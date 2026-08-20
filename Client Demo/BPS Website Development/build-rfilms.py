#!/usr/bin/env python3
"""Inline the RP Films demo into one portable HTML file.

The multi-file version under r-films/ is the one to develop against. This build
exists so the same page can be emailed, opened from a USB stick, or published
where external asset requests are blocked.

There are no raster assets to inline — every visual on the page is drawn at
runtime (WebGL barrel, canvas showreel, SVG mark), so the output stays small.

Usage: python3 build-rfilms.py
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
SRC  = ROOT / "r-films"
OUT  = ROOT / "dist" / "r-films-standalone.html"

html = (SRC / "index.html").read_text()
css  = (SRC / "assets/css/style.css").read_text()
js   = (SRC / "assets/js/main.js").read_text()

if '<link rel="stylesheet" href="assets/css/style.css">' not in html:
    sys.exit("stylesheet link not found — did the head change?")

html = html.replace('<link rel="stylesheet" href="assets/css/style.css">',
                    "<style>\n" + css + "\n</style>")
html = html.replace('<script src="assets/js/main.js"></script>',
                    "<script>\n" + js + "\n</script>")

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html)
print(f"{OUT.relative_to(ROOT)}  —  {len(html)/1024:.0f} KB")

# --- Artifact variant -------------------------------------------------------
# The Artifact host supplies its own <!doctype>/<html>/<head>/<body> skeleton and
# only scans the first 8KB for a <title>, so the title must come before the
# inline stylesheet.
head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)

title = "<title>RP Films</title>"         # gallery name, not the SEO title
fonts = re.findall(r'<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>', head)
style = re.search(r"<style>.*?</style>", head, re.S).group(0)
nos   = re.search(r"<noscript>.*?</noscript>", head, re.S)
ld    = re.search(r'<script type="application/ld\+json">.*?</script>', head, re.S)

parts = [title] + fonts + [style]
if nos: parts.append(nos.group(0))
if ld:  parts.append(ld.group(0))
parts.append(body)

art = "\n".join(parts)
ART = ROOT / "dist" / "r-films-artifact.html"
ART.write_text(art)
assert art.index("</title>") < 8192, "title pushed past the 8KB scan window"
print(f"{ART.relative_to(ROOT)}  —  {len(art)/1024:.0f} KB, title at byte {art.index('<title>')}")
