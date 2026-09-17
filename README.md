# LZPD NRW — iBMS 3.0 Click Dummy

Interactive design draft for the POLIZEI-ONLINE / LZPD NRW pitch.
No backend, no build step, no dependencies. All data is sample data held in
memory and reset on every reload.

## Links

| | |
| --- | --- |
| Figma design + design system | <https://www.figma.com/design/LiWqigj56Z6YMLjFCApe5i/LZPD-NRW?node-id=3107-224> |
| Click dummy (live) | <https://af-ajf.github.io/LZPD-NRW/> |
| Repository | <https://github.com/af-ajf/LZPD-NRW> |
| Mockups | <https://drive.google.com/drive/folders/1h7x0dAbAFc18pJkblcIazHJ0QmRwza9N?usp=sharing> |
| Phone frame (MOBILE) | <https://www.figma.com/design/LiWqigj56Z6YMLjFCApe5i/LZPD-NRW?node-id=3059-159> |

## Run

```bash
python3 tools/serve.py
```

Then open <http://localhost:4173>. The script is `http.server` with
`Cache-Control: no-store`, so a reload always shows the files on disk instead
of a half-updated mix of scripts.

## Install as an app

The click dummy is a progressive web app: `src/manifest.webmanifest` and
`src/sw.js` make it installable, and the service worker precaches the whole
shell, so an installed copy also opens without a network. Install it from the
browser menu ("Zum Startbildschirm hinzufügen" on iOS, "App installieren" in
Chrome). It needs to be served over HTTPS or from `localhost` — the GitHub
Pages link above qualifies.

The worker serves the shell network-first: online, the files on the server
always win, so an installed copy can never run a stale mix of scripts; offline,
it falls back to the precached copy. Bump `CACHE` in `src/sw.js` when a shell
file is added or removed, so the precache list stays in step.

## Mobile

Below 900px the app renders a phone shell instead of the desktop one, following
the Figma frame
[MOBILE](https://www.figma.com/design/LiWqigj56Z6YMLjFCApe5i/LZPD-NRW?node-id=3059-159):
no sidebar and no navy top bar, an iOS-style large title that collapses into a
glass bar on scroll, and a floating Liquid Glass tab bar with the five main
routes. The home screen keeps search, the module chips, a horizontal course
rail, the news card and the next appointment; the greeting, the hero copy, the
open-task row and the four stat cards are left to the desktop layout, since
Mein iBMS is one tab away. Everything the sidebar used to hold — the remaining
routes, the role switch and the language switch — moved into the profile sheet
behind the avatar. A route outside the five tabs (a course, an article, help)
carries a glass "Zurück" button in its place.

## Structure

The source lives in [`src/`](src/) — see [`src/README.md`](src/README.md) for the
file-by-file breakdown, the design-token system, and how routing and state work.

## Design

This branch carries the NRW web style: Lora for headings and figures, Inter for
everything else, navy `#172b4d` chrome over a `#08152c` sidebar, `#0054ca` blue
for filled controls, links and the active nav item, 10px cards on a soft shadow,
and a 3px gradient rule on the top edge of the stat and summary cards. Tokens in
`src/css/01-tokens.css` follow the Figma frame
[MAIN](https://www.figma.com/design/LiWqigj56Z6YMLjFCApe5i/LZPD-NRW?node-id=3107-224),
so a value can be traced back to the design file. The violet iBMS 3.0 styling
stays on `main`.

## Language

The interface ships in German (default) and English, switchable at runtime from
the top bar, the mobile menu, or the login card. German is the source
language; English lives in a single dictionary in `src/js/00-i18n.js`.
