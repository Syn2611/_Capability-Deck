"""Local stand-in for CloudPages, for testing the kit: the same page URLs, with the AMPscript image
variables resolved to the kit's image files and the hero frames served from dist/.

    python3 salesforce-cloudpages/preview_server.py [kit-dir] [port]
"""
import http.server, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
KIT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'kit')
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 4340
DIST = os.path.join(HERE, '..', 'dist')
FRAMES_URL = 'https://colliers-va-capability.pegasus456.workers.dev/hero-frames/'

BASE = 'https://cloud.realestate.colliers.com/'
block = open(os.path.join(KIT, 'va-capability-images.txt')).read()
files = dict(re.findall(r'SET @(\w+)\s*=\s*""\s*/\* (\S+) \*/', block))
pages = {re.sub(r'^\d+-|\.html$', '', f): f for f in os.listdir(os.path.join(KIT, 'pages'))}
def render(html):
    html = re.sub(r'%%=ContentBlockByKey\("[^"]+"\)=%%', '', html)
    html = re.sub(r'%%=v\(@(\w+)\)=%%', lambda m: '/images/' + files[m.group(1)], html)
    assert '%%' not in html
    return html.replace(BASE, f'http://127.0.0.1:{PORT}/').replace(FRAMES_URL, f'http://127.0.0.1:{PORT}/hero-frames/')
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        p = self.path.split('?')[0].split('#')[0].strip('/')
        if p == 'valuations-styles': body, ct = open(os.path.join(KIT, 'code-resources/valuations-styles.css'), 'rb').read(), 'text/css'
        elif p == 'valuations-script': body, ct = open(os.path.join(KIT, 'code-resources/valuations-script.js'), 'rb').read(), 'application/javascript'
        elif p in pages: body, ct = render(open(os.path.join(KIT, 'pages', pages[p]), encoding='utf-8').read()).encode(), 'text/html; charset=utf-8'
        elif p.startswith('hero-frames/') and os.path.exists(os.path.join(DIST, p)):
            body, ct = open(os.path.join(DIST, p), 'rb').read(), 'image/webp'
        elif p.startswith('images/') and os.path.exists(os.path.join(KIT, p)):
            body = open(os.path.join(KIT, p), 'rb').read(); ct = {'jpg': 'image/jpeg', 'png': 'image/png', 'svg': 'image/svg+xml'}[p.rsplit('.', 1)[1]]
        else:
            self.send_response(404); self.end_headers(); return
        self.send_response(200); self.send_header('Content-Type', ct); self.end_headers(); self.wfile.write(body)
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
