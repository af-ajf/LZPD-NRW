# LZPD NRW — iBMS 3.0 Click Dummy

Interactive design draft for the POLIZEI-ONLINE / LZPD NRW pitch.
No backend, no build step, no dependencies. All data is sample data held in
memory and reset on every reload.

## Run

```bash
python3 -m http.server 4173 --directory src
```

Then open <http://localhost:4173>.

## Structure

The source lives in [`src/`](src/) — see [`src/README.md`](src/README.md) for the
file-by-file breakdown, how routing and state work, and notes for reworking the
design.

## Language

The interface ships in German (default) and English, switchable at runtime from
the sidebar, the mobile menu, or the login footer. German is the source
language; English lives in a single dictionary in `src/js/00-i18n.js`.
