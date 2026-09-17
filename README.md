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

## Run

```bash
python3 -m http.server 4173 --directory src
```

Then open <http://localhost:4173>.

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
