#!/usr/bin/env python3
"""Static server for the click dummy, with caching switched off.

`python3 -m http.server` sends no cache headers, so a browser is free to reuse
a script or stylesheet it already has. With nine separate files that produces
mixed states: a new 05-chrome.js next to an old 07-render.js, and a shell that
half works. This server answers every request with `no-store`, so a reload
always shows the files on disk.

    python3 tools/serve.py [port]

The port is the first argument, the PORT environment variable, or 4173 - in
that order. The environment variable is what lets a second copy run beside a
server that already holds the default port.

Use it for development. It is not part of the click dummy itself.
"""

import functools
import http.server
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src")


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


def main():
    port = int(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PORT") or 4173)
    handler = functools.partial(Handler, directory=os.path.normpath(ROOT))
    with http.server.ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"Serving {os.path.normpath(ROOT)} on http://localhost:{port}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
