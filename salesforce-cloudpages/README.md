# Salesforce CloudPages version

This folder is **separate from the main website**. The main website lives in `src/` and deploys
to Cloudflare on every push. Nothing in this folder changes it.

The CloudPages version is generated from the main website's build, so content, design and fixes
are made once (in the main site) and then carried over.

| File | What it does |
| --- | --- |
| `build.py` | Reads `dist/` and writes the kit to `kit/` (not committed): 15 pages, 2 Code Resources, 65 images, the image content block |
| `START-HERE.md` | Step-by-step guide for setting the pages up in Marketing Cloud (copied into the kit) |
| `hero-still.jpg` | The home hero still (Sydney Harbour aerial) used as the poster in CloudPages |
| `preview_server.py` | Local stand-in for CloudPages, for testing the kit |
| `test.mjs` | Checks every page: images, links, profile pop-ups, filter and the hero animation and fallback |

## Regenerate after a website change

```bash
npm run build
python3 salesforce-cloudpages/build.py
python3 salesforce-cloudpages/preview_server.py &   # then
node salesforce-cloudpages/test.mjs
```

Addresses used (`cloud.realestate.colliers.com/valuations…`), the Code Resource URLs, the content
block key and the hero frames URL are set at the top of `build.py`.
