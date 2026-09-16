# iBMS 3.0 Clickdummy — source layout

Extracted from the single-file `iBMS_3.0_Clickdummy.html` (357 KB) in the repo root.
Behaviour is unchanged; the original file is kept as a reference snapshot.

Serve it over HTTP (the browser blocks nothing, but `file://` makes relative paths
fragile):

```bash
python3 -m http.server 4173 --directory src
```

## Structure

```
src/
  index.html          markup shell + stylesheet/script order
  assets/
    logo.png          POLIZEI-ONLINE wordmark (was base64 in the JS)
    texture.webp      decorative background (was base64 in the CSS, six times)
  css/
    01-tokens.css     custom properties: colour, radius, shadow, base type
    02-base.css       resets, headings, focus rings, utility classes
    03-layout.css     app shell: sidebar, workspace, topbar, page header
    04-components.css buttons, tags, panels, cards, tables, forms, dialogs
    05-responsive.css breakpoints (1600 / 1150 / 850 / 560) and preference queries
    06-overrides.css  late patch layer — see below
  js/
    00-i18n.js        EN dictionary, t(), language switch
    01-icons.js       inline SVG icon set
    02-data.js        demo fixtures: courses, people
    03-state.js       mutable app state, role labels
    04-ui.js          $, esc, badge, btn, link
    05-chrome.js      nav, brand, page header, footer, shell layout
    06-views.js       one function per route, each returns an HTML string
    07-render.js      hash router, toast, dialog primitives
    08-actions.js     click/submit delegation, CSV export, bootstrap
```

Scripts are classic (non-module) and share one global lexical scope, so load order
in `index.html` matters. Each file is `"use strict"`.

## Language

German is the source language and stays canonical. Every state value, form
`value`, `data-` attribute and comparison in the code is German; only text on its
way to the screen passes through `t()`. English is a flat lookup in
`00-i18n.js` — a missing key falls back to the German string, so nothing can
render blank.

The switch sits in the existing demo-control box (sidebar and mobile menu) and in
the login footer. The choice is kept in `localStorage` under `ibms-lang` and
defaults to German. Changing it also updates `<html lang>` and the date format.

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
  and gates the `users` and `report` routes via `restricted()`.
- **Accessibility** — skip link, `aria-current` on nav, focus moved to `#page-title`
  on route change, focus returned to the opener on dialog close, `role="status"`
  toast, `prefers-reduced-motion` and `forced-colors` queries.

## Notes before reworking the design

1. **`06-overrides.css` is a patch layer.** It was appended after the original
   sheet and wins on specificity ties. It re-declares `--radius`, `--paper` and
   `--ink`, and restyles `.shell`, `.btn`, `.login`, `.hero` and `.quick-icon`.
   Two `@media` blocks in it also re-open breakpoints already handled in
   `05-responsive.css`. Fold it into files 01–05 before making design changes,
   otherwise every edit needs checking in two places.
2. **Tokens are incomplete.** Colour, radius and shadow are tokenised; spacing,
   font sizes and breakpoints are hard-coded throughout. There is no dark mode and
   no `@keyframes`.
3. **Decorative art is one image** reused for `.hero-art`, `.course-art`,
   `.article-cover`, `.login` and `.learning-banner`, differentiated only by
   `hue-rotate` filters on `:nth-child`.
