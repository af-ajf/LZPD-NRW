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

This branch carries the NRW web style: the palette, type and shapes of
<https://internetwache.polizei.nrw> applied to the iBMS 3.0 layout. Inter for
headings and body, navy `#08152c` chrome and sidebar, NRW red for filled
controls and links, lime `#ebff00` as the accent marker, square cards with
hairline borders instead of shadows. Tokens in `src/css/01-tokens.css` mirror
the Figma collection "NRW Web 2026", so a value can be traced back to the
design file. The violet iBMS 3.0 styling stays on `main`.

## Language

The interface ships in German (default) and English, switchable at runtime from
the top bar, the mobile menu, or the login card. German is the source
language; English lives in a single dictionary in `src/js/00-i18n.js`.
