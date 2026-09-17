# LZPD NRW — iBMS 3.0 Click Dummy

Interactive design draft for the POLIZEI-ONLINE / LZPD NRW pitch.
No backend, no build step, no dependencies. All data is sample data held in
memory and reset on every reload.

## Links

| | |
| --- | --- |
| Figma design + design system | <https://www.figma.com/design/LiWqigj56Z6YMLjFCApe5i/LZPD-NRW?node-id=95-6098&t=ioWlPggJ1wffyexn-1> |
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

The interface follows the BDBOS / iBMS 3.0 Figma design system: Lora headings on
Inter body text, a light page surface with white cards, one dark sidebar, and a
violet accent for filled controls and links. Tokens in `src/css/01-tokens.css`
carry the Figma style names, so a value can be traced back to the design file.

## Language

The interface ships in German (default) and English, switchable at runtime from
the top bar, the mobile menu, or the login card. German is the source
language; English lives in a single dictionary in `src/js/00-i18n.js`.
