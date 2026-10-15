"""Salesforce CloudPages kit: converts the main website build (dist/) into CloudPages files.

This is separate from the website itself. The website is built and deployed from src/ as usual;
this script only reads its output. Run from the repo root after `npm run build`:

    python3 salesforce-cloudpages/build.py

Output (salesforce-cloudpages/kit/, not committed):
  pages/NN-<cloud-url>.html      one Landing Page per site page (paste into a Blank layout)
  code-resources/valuations-styles.css, valuations-script.js
  images/<name>.jpg|png          upload to Content Builder
  va-capability-images.txt       AMPscript content block: image name -> Content Builder URL
  image-list.csv                 the same list, with where each image is used
"""
import base64, csv, io, json, os, re, shutil, sys
from bs4 import BeautifulSoup
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
# Optional: --urls image-list.csv (with the Content Builder URL column filled in) bakes the image
# addresses straight into the pages, so no content block is needed.
URLS_CSV = None
if '--urls' in sys.argv:
    i = sys.argv.index('--urls')
    URLS_CSV = os.path.abspath(sys.argv[i + 1])
    del sys.argv[i:i + 2]
args = sys.argv[1:] + [None] * 3
DIST = os.path.abspath(args[0] or 'dist')
OUT = os.path.abspath(args[1] or os.path.join(HERE, 'kit'))
HERO_STILL = os.path.abspath(args[2] or os.path.join(HERE, 'hero-still.jpg'))
# The home hero animation frames stay on the main site (107 WebP frames are not practical in
# Content Builder). The still poster comes from Content Builder and stays if they cannot load.
FRAMES_URL = 'https://colliers-va-capability.pegasus456.workers.dev/hero-frames/v2/'
BASE = 'https://cloud.realestate.colliers.com/'
CSS_URL, JS_URL = BASE + 'valuations-styles', BASE + 'valuations-script'
BLOCK_KEY = 'va-capability-images'
FONTS = ('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300'
         '&family=Open+Sans:wdth,wght@75..100,300..800&display=swap')
SLUGS = ['office', 'industrial-logistics', 'retail', 'hotels-living', 'agribusiness',
         'healthcare-retirement-living', 'government-legal', 'mortgage', 'data-centres',
         'self-storage', 'childcare-education', 'service-stations']
PAGES = [('index.html', 'valuations'), ('sectors/index.html', 'valuations-sectors'),
         ('contact/index.html', 'valuations-contact')] + \
        [(f'sectors/{s}/index.html', f'valuations-{s}') for s in SLUGS]
INLINE_MAX = 6_000
ASSETS = os.path.abspath('src/assets/images')  # images smaller than this are embedded, not uploaded

os.makedirs(OUT, exist_ok=True)
shutil.copy(os.path.join(HERE, 'START-HERE.md'), os.path.join(OUT, 'START-HERE.md'))
for d in ('pages', 'code-resources', 'images'):
    shutil.rmtree(os.path.join(OUT, d), ignore_errors=True)
    os.makedirs(os.path.join(OUT, d))

def route(path):
    """Site path -> CloudPages URL (None if not a page we publish)."""
    p, _, frag = path.partition('#')
    p = p.split('?')[0]
    frag = '#' + frag if frag else ''
    if p in ('/', ''):
        return BASE + 'valuations' + frag
    m = re.fullmatch(r'/sectors/([a-z-]+)/', p)
    if m:
        return BASE + (f'valuations-{m.group(1)}' if m.group(1) in SLUGS else 'valuations-sectors') + frag
    if p == '/sectors/':
        return BASE + 'valuations-sectors' + frag
    if p == '/contact/':
        return BASE + 'valuations-contact' + frag
    return None

# ---------- images ----------
images = {}   # var name -> dict(file, used)
def var_for(stem):
    return 'img_' + re.sub(r'[^a-z0-9]+', '_', stem.lower()).strip('_')

def has_alpha(im):
    return im.mode in ('RGBA', 'LA') and im.getchannel('A').getextrema()[0] < 250

def register(src_path, width, used_on, *, force_name=None):
    """Convert one built image to JPG/PNG at `width`; return AMPscript reference or data URI."""
    full = src_path if os.path.exists(src_path) and os.path.isabs(src_path) else os.path.join(DIST, src_path.lstrip('/'))
    base = force_name or re.sub(r'\.[A-Za-z0-9_-]{8}(_[A-Za-z0-9_-]+)?$', '', os.path.splitext(os.path.basename(full))[0])
    if full.endswith('.svg'):
        raw = open(full, 'rb').read()
        if len(raw) <= INLINE_MAX:
            return 'data:image/svg+xml;base64,' + base64.b64encode(raw).decode()
        name, var = f'va-{base}.svg', var_for(base)
        if var not in images:
            open(os.path.join(OUT, 'images', name), 'wb').write(raw)
            images[var] = {'file': name, 'used': set(), 'kb': len(raw) // 1024}
        images[var]['used'].add(used_on)
        return f'%%=v(@{var})=%%'
    # Leader portraits: one 640px file from the original, whatever size the slot asks for
    orig = os.path.join(ASSETS, 'experts', base + '.webp')
    if os.path.exists(orig):
        full, width = orig, 640
    im = Image.open(full)
    im.load()
    alpha = has_alpha(im.convert('RGBA')) if im.mode in ('RGBA', 'LA', 'P') else False
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    if alpha:
        im.convert('RGBA').quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(buf, 'PNG', optimize=True)
        ext = 'png'
    else:
        im.convert('RGB').save(buf, 'JPEG', quality=74 if width > 1000 else 78, optimize=True, progressive=True)
        ext = 'jpg'
    data = buf.getvalue()
    if len(data) <= INLINE_MAX:
        return f'data:image/{"png" if ext == "png" else "jpeg"};base64,' + base64.b64encode(data).decode()
    name = f'va-{base}-{width}.{ext}'
    var = var_for(f'{base}-{width}')
    if var not in images:
        open(os.path.join(OUT, 'images', name), 'wb').write(data)
        images[var] = {'file': name, 'used': set(), 'kb': len(data) // 1024}
    images[var]['used'].add(used_on)
    return f'%%=v(@{var})=%%'

def candidates(tag):
    """(width, path) candidates from a <picture>/<img>, preferring JPG/PNG/WebP over AVIF."""
    out = []
    srcs = []
    if tag.name == 'picture':
        for s in tag.find_all('source'):
            if 'avif' not in (s.get('type') or ''):
                srcs.append(s.get('srcset', ''))
        img = tag.find('img')
    else:
        img = tag
    srcs += [img.get('srcset') or '', img.get('src') or '']
    for ss in srcs:
        for part in ss.split(','):
            bits = part.strip().split()
            if bits and bits[0].startswith('/_astro/') and not bits[0].endswith('.avif'):
                w = int(bits[1][:-1]) if len(bits) > 1 and bits[1].endswith('w') else 0
                out.append((w, bits[0]))
    return img, out

def best(cands, target):
    widest = max(cands)
    path = widest[1]
    if path.endswith('.svg'):
        return path, 0
    w = widest[0] or Image.open(os.path.join(DIST, path.lstrip('/'))).width
    return path, min(w, target)

# ---------- styles and script (shared Code Resources) ----------
css_order, js_src = [], None

def css_bundle():
    parts = []
    for href in css_order:
        css = open(os.path.join(DIST, href.lstrip('/'))).read()
        css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)   # fonts come from Google Fonts
        def inline_url(m):
            p = os.path.join(DIST, m.group(1).lstrip('/'))
            mime = 'image/svg+xml' if p.endswith('.svg') else 'image/png'
            return f'url("data:{mime};base64,{base64.b64encode(open(p, "rb").read()).decode()}")'
        css = re.sub(r'url\((/_astro/[^)"\']+)\)', inline_url, css)
        parts.append(f'/* {os.path.basename(href)} */\n{css}')
    return '\n'.join(parts)

# ---------- pages ----------
# Links that may leave CloudPages: Colliers corporate pages only (plus email and phone)
ALLOWED_EXTERNAL = ('https://www.colliers.com.au/', 'https://www.colliers.com/')
link_rows = []

def link_kind(href):
    if href.startswith('#'): return 'Section on this page'
    if href.startswith('mailto:'): return 'Email'
    if href.startswith('tel:'): return 'Phone'
    if href.startswith(BASE): return 'CloudPages page'
    if href.startswith(ALLOWED_EXTERNAL): return 'Colliers corporate website'
    return None

report, pending_pages = [], []
for n, (src, cloud) in enumerate(PAGES, 1):
    soup = BeautifulSoup(open(os.path.join(DIST, src), encoding='utf-8').read(), 'html.parser')
    head, body = soup.head, soup.body
    page_url = BASE + cloud

    # Head: shared stylesheet + Google Fonts; no client router, prefetch or preloads
    for link in head.find_all('link'):
        rel = ' '.join(link.get('rel') or [])
        href = link.get('href', '')
        if 'stylesheet' in rel and href.startswith('/_astro/'):
            if href not in css_order: css_order.append(href)
            link.decompose()
        elif rel in ('preload', 'modulepreload', 'prefetch') or 'sitemap' in rel or href.endswith('sitemap-index.xml'):
            link.decompose()
        elif rel == 'canonical':
            link['href'] = page_url
        elif 'icon' in rel:
            link['href'] = register(href, 180 if 'apple' in rel else 32, cloud, force_name=None) \
                if not href.endswith('.svg') else register(href, 64, cloud)
    for m in head.find_all('meta'):
        if (m.get('name') or '').startswith('astro-view-transitions'):
            m.decompose()
        elif m.get('property') == 'og:url':
            m['content'] = page_url
        elif m.get('property') in ('og:image',) or m.get('name') in ('twitter:image',):
            m['content'] = register(os.path.join(DIST, 'og.png'), 1200, 'social sharing', force_name='og')
    for link in soup.find_all('link', rel=['preload', 'modulepreload', 'prefetch']):
        link.decompose()
    for sc in soup.find_all('script', src=True):
        if 'BaseLayout' in sc['src']:
            js_src = sc['src']
        sc.decompose()
    for sc in soup.find_all('script', type='application/ld+json'):
        txt = sc.string or ''
        txt = re.sub(r'https://colliers-va-capability\.pegasus456\.workers\.dev(/[^"]*)?',
                     lambda m: route(m.group(1) or '/') or BASE + 'valuations', txt)
        sc.string = txt

    first = head.find(True)
    for tag in reversed([
        soup.new_tag('link', rel='preconnect', href='https://fonts.googleapis.com'),
        soup.new_tag('link', rel='preconnect', href='https://fonts.gstatic.com', crossorigin=''),
        soup.new_tag('link', rel='stylesheet', href=FONTS),
        soup.new_tag('link', rel='stylesheet', href=CSS_URL),
    ]):
        first.insert_after(tag)
    js = soup.new_tag('script', src=JS_URL)
    js['defer'] = ''
    body.append(js)

    # Home hero: still poster from Content Builder, scroll animation frames from the main site
    hero = soup.find(attrs={'data-hero': True})
    if hero:
        hero['data-frames-base'] = FRAMES_URL
        pic = hero.find('picture') or hero.find('img')
        ref = register(HERO_STILL, 1920, cloud, force_name='hero-sydney-harbour')
        img = soup.new_tag('img', src=ref, alt='', **{'class': 'hero__poster'})
        img['fetchpriority'] = 'high'; img['decoding'] = 'async'; img['width'] = '1920'; img['height'] = '1080'
        pic.replace_with(img)
        pre = soup.new_tag('link', rel='preload', href=ref, **{'as': 'image'})
        pre['fetchpriority'] = 'high'
        head.append(pre)

    # Images: one uploaded file per image and size; lazy below the fold
    for tag in soup.find_all(['picture', 'img']):
        if tag.name == 'img' and tag.find_parent('picture'): continue
        if tag.name == 'img' and (tag.get('src', '').startswith(('data:', '%%'))): continue
        img, cands = candidates(tag)
        if not cands:
            src_ = img.get('src', '')
            if src_.startswith('/'):
                img['src'] = register(src_, 2000, cloud)
            continue
        in_hero = tag.find_parent(class_=re.compile(r'\bsh__media\b|\bhero\b'))
        target = 1440 if in_hero else (640 if tag.find_parent(class_=re.compile('expert|portrait|md')) else 800)
        path, width = best(cands, target)
        new = soup.new_tag('img')
        for k, v in img.attrs.items():
            if k not in ('srcset', 'sizes', 'src'):
                new[k] = v
        new['src'] = register(path, width, cloud)
        if not in_hero:
            new['loading'] = 'lazy'
        new['decoding'] = 'async'
        tag.replace_with(new)

    # Links: every site page goes to its CloudPage; same-page anchors stay in place
    for a in soup.find_all('a', href=True):
        h = a['href']
        if h.startswith('/'):
            r = route(h)
            if r:
                if r.split('#')[0] == page_url and '#' in r:
                    r = '#' + r.split('#', 1)[1]
                a['href'] = r
    # Every link must stay on CloudPages (or go to Colliers corporate, email or phone)
    for a in soup.find_all('a', href=True):
        kind = link_kind(a['href'])
        if not kind:
            raise SystemExit(f'{cloud}: link leaves CloudPages: {a["href"]}')
        text = ' '.join(a.get_text(' ', strip=True).split()) or a.get('aria-label', '')
        link_rows.append((cloud, text[:80], a['href'], kind))
    for el in soup.find_all(attrs={'data-astro-prefetch': True}):
        del el['data-astro-prefetch']

    html = str(soup)
    # Image variables come from one shared content block, loaded first (unless URLs are baked in)
    html = html.replace('<head>', f'<head>\n%%=ContentBlockByKey("{BLOCK_KEY}")=%%', 1)
    pending_pages.append((n, cloud, html))
    continue

def finish(n, cloud, html):
    if baked is not None:
        html = html.replace(f'%%=ContentBlockByKey("{BLOCK_KEY}")=%%', '')
        html = re.sub(r'%%=v\(@(\w+)\)=%%', lambda m: baked[m.group(1)], html)
        assert '%%' not in html
    left = sorted(set(re.findall(r'(?:src|href|content)="(/[^"]*)"', html)))
    assert html.count('%%') % 2 == 0
    fname = f'{n:02d}-{cloud}.html'
    open(os.path.join(OUT, 'pages', fname), 'w', encoding='utf-8').write(html)
    report.append((fname, len(html) // 1024, left))

baked = None
if URLS_CSV:
    by_file = {}
    with open(URLS_CSV, newline='', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            u = (row.get('Content Builder URL') or '').strip()
            if row.get('File to upload') and u:
                by_file[row['File to upload'].strip()] = u
    missing = [i['file'] for i in images.values() if i['file'] not in by_file]
    bad = [f for f, u in by_file.items() if not re.match(r'https://[^\s"<>]+$', u)]
    if missing or bad:
        raise SystemExit('Image URLs missing for: ' + ', '.join(missing) + ('\nNot a valid URL: ' + ', '.join(bad) if bad else ''))
    baked = {var: by_file[i['file']] for var, i in images.items()}
for args_ in pending_pages:
    finish(*args_)

open(os.path.join(OUT, 'code-resources', 'valuations-styles.css'), 'w').write(css_bundle())
shutil.copy(os.path.join(DIST, js_src.lstrip('/')), os.path.join(OUT, 'code-resources', 'valuations-script.js'))

# ---------- the content block and the checklist ----------
lines = ['%%[', '/* Colliers V&A capability statement: image addresses.',
         '   Paste each image\'s Content Builder URL between its quotes. */']
w = max(len(v) for v in images)
for var in sorted(images):
    lines.append(f'SET @{var.ljust(w)} = ""   /* {images[var]["file"]} */')
lines.append(']%%')
open(os.path.join(OUT, f'{BLOCK_KEY}.txt'), 'w').write('\n'.join(lines) + '\n')
with open(os.path.join(OUT, 'image-list.csv'), 'w', newline='') as f:
    wr = csv.writer(f)
    wr.writerow(['File to upload', 'AMPscript variable', 'Size (KB)', 'Used on', 'Content Builder URL'])
    for var in sorted(images, key=lambda v: images[v]['file']):
        i = images[var]
        wr.writerow([i['file'], '@' + var, i['kb'], ', '.join(sorted(i['used'])), ''])

with open(os.path.join(OUT, 'link-list.csv'), 'w', newline='') as f:
    wr = csv.writer(f)
    wr.writerow(['Page', 'Link text', 'Goes to', 'Type'])
    seen = set()
    for row in link_rows:
        if row not in seen:
            seen.add(row); wr.writerow([BASE + row[0], *row[1:]])
kinds = {}
for r in link_rows: kinds[r[3]] = kinds.get(r[3], 0) + 1
print('links by type:', kinds)
for r in report: print(*r)
print('images to upload:', len(images), 'total KB', sum(i['kb'] for i in images.values()))
print('css KB', os.path.getsize(os.path.join(OUT, 'code-resources', 'valuations-styles.css')) // 1024,
      'js KB', os.path.getsize(os.path.join(OUT, 'code-resources', 'valuations-script.js')) // 1024)
