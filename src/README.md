# iBMS 3.0 Clickdummy — source layout

Interactive design draft for POLIZEI-ONLINE / LZPD NRW. No backend, no build
step, no dependencies. All data is sample data held in memory and reset on every
reload.

Serve it over HTTP (`file://` makes relative paths fragile):

```bash
python3 -m http.server 4173 --directory src
```

## Structure

```
src/
  index.html          markup shell, webfonts, stylesheet/script order
  assets/
    logo.png          LZPD NRW badge, used in the sidebar brand and on login
    flag-de.svg       flags for the language switch (exported from the
    flag-en.svg       Figma design system)
  css/
    01-tokens.css     design tokens: colour, type, spacing, radius, shadow, motion
    02-base.css       resets, type scale, focus rings, utility classes
    03-layout.css     app shell: sidebar, workspace, top bar, content, footer
    04-components.css pills, buttons, cards, hero band, stats, course cards,
                      tables, forms, dialogs, toast, login
    05-responsive.css breakpoints (1280 / 1100 / 900 / 600) and preference queries
  js/
    00-i18n.js        EN dictionary, t(), language switch
    01-icons.js       inline SVG icon set
    02-data.js        demo fixtures: courses, people
    03-state.js       mutable app state, role labels
    04-ui.js          $, esc, badge, btn, link
    05-chrome.js      nav, brand, top bar, footer, shell layout, login, course card
    06-views.js       one function per route, each returns an HTML string
    07-render.js      hash router, toast, dialog primitives
    08-actions.js     click/submit delegation, CSV export, bootstrap
```

Scripts are classic (non-module) and share one global lexical scope, so load
order in `index.html` matters. Each file is `"use strict"`.

## Design system

The visual language comes from the BDBOS / iBMS 3.0 Figma library. Token names in
`01-tokens.css` mirror the Figma style names — a Figma style `Surface/Card` is
`--surface-card` here — so a value can be traced back to the design file.

- **Colour.** One light page surface (`--surface-page`) with white cards; the
  sidebar is the only dark area. `--accent-surface` (#5757C7) is for filled
  controls and the active nav item, `--accent-primary` (#3D4FD6) for links and
  text emphasis. Status colours are success / attention only.
- **Type.** Lora for headings and display numbers, Inter for everything else.
  Both are loaded from Google Fonts in `index.html`; the stacks fall back to
  Georgia and system sans.
- **Shape.** Cards 20px, controls 12px, buttons/pills/chips fully rounded.
  One card shadow (`--shadow-card`), a stronger one for hover and overlays.
- **Spacing** is a 4px scale (`--space-1` … `--space-16`); no loose pixel values
  in layout rules.
- **Course artwork** is generated, not photographic: the gradient on
  `.course-art` is chosen by module (`data-module`), the centred glyph by the
  course's subject category (see `courseGlyphs` in `05-chrome.js`). Nothing to
  commission, and it stays sharp at any size.

There is no longer a patch/override layer — every rule lives in the file its
name implies.

## Language

German is the source language and stays canonical. Every state value, form
`value`, `data-` attribute and comparison in the code is German; only text on its
way to the screen passes through `t()`. English is a flat lookup in
`00-i18n.js` — a missing key falls back to the German string, so nothing can
render blank.

The switch is a segmented DE/EN control in the top bar and in the login card; the
mobile menu uses a select instead. The choice is kept in `localStorage` under
`ibms-lang` and defaults to German. Changing it also updates `<html lang>` and
the date format.

To add or correct a translation, edit the `EN` object in `00-i18n.js` only.

## How the app works

- **Routing** — `render()` reads `location.hash`, switches on the first path
  segment, and writes `layout(content, route)` into `#app`. `course/<id>` is the
  only route with a parameter. `hashchange` re-renders and closes any open dialog.
- **Interaction** — two delegated listeners on `document`: `click` dispatches on
  `[data-action]`, `submit` dispatches on the form's `id`. No per-element handlers,
  so re-rendering never leaves listeners behind.
- **State** — one mutable `state` object plus the `courses` / `people` arrays.
  Mutate, then call `render(false)` (skips scroll/focus reset) or set
  `location.hash`. Nothing persists across a reload.
- **Roles** — `state.role` is `learner | admin | report`. It drives `navItems()`
  and gates the `users` and `report` routes via `restricted()`. The role switch is
  the context pill in the top bar: it reads "NRW / Anwenderin", which is exactly
  what changing it does.
- **Accessibility** — skip link, `aria-current` on nav, focus moved to
  `#page-title` on route change, focus returned to the opener on dialog close,
  `aria-pressed` on the language switch, `role="status"` toast, and
  `prefers-reduced-motion` / `forced-colors` queries.

## Home screen

The home screen follows the design system's main frame:

1. **Hero band** — greeting, training year, the search field, category chips that
   jump straight into a filtered catalogue, and the one open task that needs the
   user, lifted out of Mein iBMS so it is visible without navigating first.
2. **Stats row** — four figures, each a link into the matching Mein-iBMS tab.
3. **Course recommendations** — three cards with generated banner artwork.
4. **News and next appointment** — two panels.
