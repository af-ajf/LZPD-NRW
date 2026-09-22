#!/usr/bin/env python3
"""Render the click dummy into framed presentation mockups.

Each shot is the running click dummy inside the navy device bezel of the
existing mockups, on a white background — the desktop shell only, at 1440px, so
the phone layout never appears. The shots go to `mockups/` as 2x PNGs, ready to
be dropped into a slide.

    python3 tools/mockups.py [--out mockups] [--port 4189]

The script serves a copy of `src/` from a temporary directory rather than `src/`
itself: the copy carries one extra script, `capture.js`, which reads `role`,
`fav` and `mytab` from the query string before the first render. That is the
only way to reach the administrator and Fachaufsicht views, since the role lives
in memory and is otherwise switched by hand in the top bar.

Headless Chrome captures the viewport, not the full page, so a view taller than
the 1440x900 screen is cut off at its bottom edge. That is deliberate: one size
for every still keeps them interchangeable on a slide, and a full page — the
home screen is over 1900px tall — would be far too small to read there.
"""

import argparse
import functools
import http.server
import os
import shutil
import subprocess
import sys
import tempfile
import threading
import urllib.parse

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SRC = os.path.join(ROOT, "src")

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Every shot uses the same 1440x900 screen, so the stills line up on a slide and
# share one aspect ratio. A view taller than that is cut off at the bottom edge
# of the screen, the way the earlier mockups are.
VIEWPORT = (1440, 900)

# name and route (with the query that sets the demo role).
SHOTS = [
    ("01-anmeldung", "index.html#login"),
    ("02-startseite", "index.html#home"),
    ("03-mein-ibms", "index.html#dashboard"),
    ("04-anwender", "index.html?role=admin#users"),
    ("05-berichte", "index.html?role=report#report"),
    ("06-lernpfad", "index.html#learning"),
]

CAPTURE_JS = """// capture.js - test hook, loaded only by tools/mockups.py.
// Reads the demo state from the query string so a shot can be taken of a view
// that is otherwise reached by switching the role in the top bar.
"use strict";
(function () {
  const p = new URLSearchParams(location.search);
  const role = p.get("role");
  if (role) state.role = role;
  const fav = p.get("fav");
  if (fav) state.favorites = fav.split(",").map(Number).filter(Number.isInteger);
  const tab = p.get("mytab");
  if (tab) state.mytab = tab;
  render(false);
})();
"""

FRAME_HTML = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>frame</title>
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    width: 1600px;
    display: flex; align-items: center; justify-content: center;
  }
  .pad { padding: 80px 0; }
  /* The device bezel of the existing mockups: one navy body, a camera dot on
     the top edge, and the screen inset in it. */
  .device {
    position: relative;
    padding: 34px 30px 38px;
    border-radius: 42px;
    background: linear-gradient(150deg, #10244a 0%, #0a1830 100%);
    box-shadow:
      0 40px 80px rgba(8, 21, 44, .22),
      0 8px 20px rgba(8, 21, 44, .12);
  }
  .device::before {
    content: "";
    position: absolute;
    top: 15px; left: 50%;
    width: 7px; height: 7px;
    margin-left: -3.5px;
    border-radius: 50%;
    background: #33456a;
  }
  .screen {
    width: 1440px;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
  }
  iframe { display: block; width: 1440px; height: 900px; border: 0; background: #fff; }
</style>
</head>
<body>
  <div class="pad"><div class="device">
    <div class="screen"><iframe id="frame" title="POLIZEI-ONLINE"></iframe></div>
  </div></div>
<script>
  const p = new URLSearchParams(location.search);
  const h = p.get("h");
  if (h) document.getElementById("frame").style.height = h + "px";
  document.getElementById("frame").src = p.get("src") || "index.html";
</script>
</body>
</html>
"""


def stage(tmp):
    """Copy the click dummy and add the capture hook to it."""
    site = os.path.join(tmp, "site")
    shutil.copytree(SRC, site)
    with open(os.path.join(site, "capture.js"), "w") as f:
        f.write(CAPTURE_JS)
    with open(os.path.join(site, "frame.html"), "w") as f:
        f.write(FRAME_HTML)
    index = os.path.join(site, "index.html")
    with open(index) as f:
        html = f.read()
    tag = '<script src="js/09-actions.js"></script>'
    if tag not in html:
        sys.exit("index.html no longer loads js/09-actions.js — update tools/mockups.py")
    with open(index, "w") as f:
        f.write(html.replace(tag, tag + '\n<script src="capture.js"></script>'))
    return site


class Quiet(http.server.SimpleHTTPRequestHandler):
    """The request log would bury the one line per shot that matters."""

    def log_message(self, *args):
        pass


def serve(site, port):
    handler = functools.partial(Quiet, directory=site)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "mockups"))
    ap.add_argument("--port", type=int, default=4189)
    ap.add_argument("--chrome", default=CHROME)
    ap.add_argument(
        "--bare",
        action="store_true",
        help="capture the screen alone, without the device bezel — for placing "
        "the shot into a device frame that already exists elsewhere, e.g. in Figma",
    )
    args = ap.parse_args()

    if not os.path.exists(args.chrome):
        sys.exit(f"Chrome not found at {args.chrome} — pass --chrome")
    os.makedirs(args.out, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        site = stage(tmp)
        httpd = serve(site, args.port)
        try:
            width, height = VIEWPORT
            for name, src in SHOTS:
                if args.bare:
                    url = f"http://127.0.0.1:{args.port}/{src}"
                    window = f"{width},{height}"
                else:
                    query = urllib.parse.urlencode({"src": src, "h": height})
                    url = f"http://127.0.0.1:{args.port}/frame.html?{query}"
                    window = f"1600,{height + 232}"
                dest = os.path.join(args.out, name + ".png")
                subprocess.run(
                    [
                        args.chrome,
                        "--headless",
                        "--disable-gpu",
                        "--hide-scrollbars",
                        "--force-device-scale-factor=2",
                        f"--window-size={window}",
                        "--virtual-time-budget=8000",
                        f"--screenshot={dest}",
                        url,
                    ],
                    check=True,
                    capture_output=True,
                )
                print(f"{name}.png")
        finally:
            httpd.shutdown()


if __name__ == "__main__":
    main()
