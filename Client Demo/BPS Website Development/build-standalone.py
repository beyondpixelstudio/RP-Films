#!/usr/bin/env python3
"""Inline the AURA demo into one portable HTML file.

The multi-file version under aura-restaurant/ is the one to develop against.
This build exists so the same page can be emailed, opened from a USB stick, or
published where external asset requests are blocked.

Usage: python3 build-standalone.py
"""
import base64, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
SRC  = ROOT / "aura-restaurant"
OUT  = ROOT / "dist" / "aura-restaurant-standalone.html"

MIME = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".webp": "image/webp", ".svg": "image/svg+xml"}


def data_uri(rel: str) -> str:
    f = SRC / rel
    if not f.exists():
        sys.exit(f"missing asset: {rel}")
    mime = MIME.get(f.suffix.lower())
    if not mime:
        sys.exit(f"unknown asset type: {rel}")
    return f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()


html = (SRC / "index.html").read_text()
css  = (SRC / "assets/css/style.css").read_text()
js   = (SRC / "assets/js/main.js").read_text()

html = html.replace('<link rel="stylesheet" href="assets/css/style.css">',
                    "<style>\n" + css + "\n</style>")
html = html.replace('<script src="assets/js/main.js"></script>',
                    "<script>\n" + js + "\n</script>")

# src="assets/img/x.jpg" -> src="data:image/jpeg;base64,..."
count = 0
def sub(m):
    global count
    count += 1
    return f'{m.group(1)}="{data_uri(m.group(2))}"'

html = re.sub(r'(src)="(assets/img/[^"]+)"', sub, html)

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html)
print(f"{OUT.relative_to(ROOT)}  —  {len(html)/1024/1024:.2f} MB, {count} images inlined")

# --- Artifact variant -------------------------------------------------------
# The Artifact host supplies its own <!doctype>/<html>/<head>/<body> skeleton and
# only scans the first 8KB for a <title>, so the title must come before the
# ~13KB inline stylesheet.
head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)

title = "<title>AURA Kitchen &amp; Terrace</title>"  # gallery name, not the SEO title
fonts = re.findall(r'<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>', head)
style = re.search(r"<style>.*?</style>", head, re.S).group(0)
ld    = re.search(r'<script type="application/ld\+json">.*?</script>', head, re.S)

art = "\n".join([title] + fonts + [style] + ([ld.group(0)] if ld else []) + [body])
ART = ROOT / "dist" / "aura-restaurant-artifact.html"
ART.write_text(art)
assert art.index("</title>") < 8192, "title pushed past the 8KB scan window"
print(f"{ART.relative_to(ROOT)}  —  {len(art)/1024/1024:.2f} MB, title at byte {art.index('<title>')}")
