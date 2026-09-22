# iBMS 3.0 Clickdummy — source layout

Interactive design draft for POLIZEI-ONLINE / LZPD NRW. No backend, no build
step, no dependencies. All data is sample data held in memory and reset on every
reload.

Serve it over HTTP (`file://` makes relative paths fragile):

```bash
python3 tools/serve.py
```

## Structure

```
src/
  index.html          markup shell, webfonts, stylesheet/script order,
                      PWA manifest link and service-worker registration
  manifest.webmanifest  name, icons, start URL and display mode of the app
  sw.js               service worker: precaches the shell, serves it offline
  assets/
    logo.png          NRW police star, used in the sidebar brand and on login
    icon-192.png      home-screen icons, derived from logo.png
    icon-512.png
    icon-maskable-512.png
    apple-touch-icon.png
  css/
    01-tokens.css     design tokens: colour, type, spacing, radius, shadow, motion
    02-base.css       resets, type scale, focus rings, utility classes
    03-layout.css     app shell: sidebar, workspace, top bar, content, footer
    04-components.css pills, buttons, cards, hero band, stats, course cards,
                      tables, forms, dialogs, toast, login
    05-responsive.css breakpoints (1280 / 1100 / 900 / 600) and preference queries
    06-mobile.css     phone shell: large title, glass bar, course rail, the
                      Liquid Glass tab bar and the installed-app rules
    07-motion.css     motion layer: route enter stagger, hover and press
                      reactions, heart burst, dialog and toast transitions
  js/
    01-icons.js       inline SVG icon set
    02-data.js        demo fixtures: courses, people
    03-state.js       mutable app state, role labels
    04-ui.js          $, esc, badge, btn, link
    05-chrome.js      nav, brand, top bar, footer, shell layout, login, course
                      card, and the phone shell (large title, tab bar)
    06-views.js       one function per route, each returns an HTML string
    07-render.js      hash router, toast, dialog primitives
    08-haptics.js     taptic feedback on the phone shell: press ticks and
                      outcome patterns
    09-actions.js     click/submit delegation, CSV export, bootstrap
```

Scripts are classic (non-module) and share one global lexical scope, so load
order in `index.html` matters. Each file is `"use strict"`.

## Two shells

`layout()` in `05-chrome.js` picks the shell: the desktop one (sidebar, navy top
bar) above 900px, the phone one below it. The phone shell follows the Figma
frame "MOBILE" (node 3059:159) — an iOS-style large title over the page
surface, a compact glass bar that fades in on scroll, and a floating Liquid
Glass tab bar carrying the six main routes. `home()` branches the same way:
`mobileHome()` keeps search, chips, the course rail, the news card and the next
appointment, and drops the greeting, the hero copy, the open-task row and the
stat cards. The routes outside the tabs and the role switch live in the profile
sheet behind the avatar.

Because the two shells are different markup rather than one reflowed layout,
crossing 900px re-renders (`mobileMQ` listener in `09-actions.js`).

The tab bar itself lives in `#tabbar-root`, outside `#app`, and `syncTabbar()`
only updates it — it is rebuilt only when it is missing.
That keeps its nodes across a route change, so the selection pill slides from
one tab to the next instead of being redrawn. The selection pill is sized
from `--tab-count`, which `syncTabbar()` sets from the number of rendered
tabs. Routes outside the tabs
(help, the admin and report views) drop the pill rather than moving it, and
`mobilehead()` gives those routes a glass "Zurück" button — the phone shell has
no breadcrumb rail of its own, so without it a course detail is a dead end.

## Installable app

`manifest.webmanifest` and `sw.js` make the click dummy installable. The worker
precaches every shell file on install, then serves it network-first: online the
server wins, so an installed copy can never run a new `05-chrome.js` against an
old `07-render.js`; offline every request falls back to the precache, and a
navigation to the cached `index.html`, since routing happens in the hash. Bump
`CACHE` in `sw.js` when a file joins or leaves the shell list.

## Design system

The visual language comes from the Figma frame "MAIN" (node 3107:224) in the
LZPD NRW file. Token names in `01-tokens.css` mirror the Figma style names — a
Figma style `Surface/Card` is `--surface-card` here — so a value can be traced
back to the design file.

- **Colour.** One light page surface (`--surface-page`) with white cards; the
  sidebar and the top bar / footer band are the only dark areas.
  `--accent-surface` (#0054CA) is for filled controls and the active nav item,
  `--accent-primary` (the same blue) for links and text emphasis. Status colours
  are success / attention only.
- **Type.** Lora carries the display headline alone — `h1` on the desktop shell
  and the iOS-style large title on the phone. Everything else, headings
  included, is Inter. Both are loaded from Google Fonts in `index.html`; the
  stacks fall back to Georgia and system sans.
- **Shape.** Cards 10px, controls 8px, category badges 4px, buttons/pills/chips
  fully rounded. One card shadow (`--shadow-card`), a stronger one for hover and
  overlays.
- **Accent rules.** `--rule-blue` / `-cyan` / `-green` / `-amber` are the 3px
  gradient hairlines on the top edge of a card: the four stat cards in a row
  take one each, `.panel.ruled` takes the blue one. The figure itself stays
  navy — the hue lives in the rule.
- **Spacing** is a 4px scale (`--space-1` … `--space-16`); no loose pixel values
  in layout rules.
- **Course artwork** is generated, not photographic: the gradient on
  `.course-art` is chosen by module (`data-module`), the centred glyph by the
  course's subject category (see `courseGlyphs` in `05-chrome.js`). Nothing to
  commission, and it stays sharp at any size.

- **Motion** lives in `07-motion.css` and nowhere else. Two kinds: enter motion,
  played once per route change and gated behind the `enter` class `render()`
  puts on `#app`, so a re-render in place (a filter, a heart, a Mein-iBMS tab)
  leaves the page still; and reaction motion on single controls — hover lift,
  press scale, the arrow that leans towards where it goes, the heart that pops
  when a course is marked. `--ease-out-soft` is for things that arrive,
  `--ease-spring` for things that should feel physical. No element rests at
  `opacity: 0`: keyframes only describe where it came from, so the
  reduced-motion query in `05-responsive.css` — which kills every animation and
  transition with `!important` — leaves a complete page behind.

- **Haptics** are the phone counterpart of that motion layer and live in
  `08-haptics.js` alone. Two kinds again: a selection tick on the press of a
  tab, chip or button, delivered in the capture phase so it is felt under the
  finger rather than after the redraw; and an outcome pattern once something is
  done or refused — a booking, a confirmation, a form the browser rejects.
  `haptic(kind)` is the only entry point. It is silent on the desktop shell, on
  a device without a vibrator, and under `prefers-reduced-motion`, which is
  treated as covering a vibration too. Android uses `navigator.vibrate`; iOS
  has no such API, so a hidden `<input type="checkbox" switch>` is toggled
  instead — Safari plays the system switch haptic for it, one tick at a time,
  and the patterns become tick counts.

There is no longer a patch/override layer — every rule lives in the file its
name implies.

## Language

The interface is German, and German only. There is no translation layer: every
state value, form `value`, `data-` attribute, comparison and on-screen string is
the same German text, written where it is used. `<html lang="de">` is set in
`index.html`, and dates are formatted with a fixed `de-DE` locale in
`formatDate()`.

To change wording, edit the string in the view that renders it.

## How the app works

- **Routing** — `render()` reads `location.hash`, switches on the first path
  segment, and writes `layout(content, route)` into `#app`. `course/<id>` is the
  only route with a parameter. `hashchange` re-renders and closes any open dialog.
- **Interaction** — two delegated listeners on `document`: `click` dispatches on
  `[data-action]`, `submit` dispatches on the form's `id`. No per-element handlers,
  so re-rendering never leaves listeners behind. `08-haptics.js` adds its own
  delegated listeners in the capture phase and touches no state, so haptics can
  be removed by dropping the one script tag.
- **State** — one mutable `state` object plus the `courses` / `people` arrays.
  Mutate, then call `render(false)` (skips scroll/focus reset) or set
  `location.hash`. Nothing persists across a reload, apart from the watchlist
  (`ibms-favorites`).
- **Watchlist** — `state.favorites` holds course ids; `isFavorite()`,
  `toggleFavorite()` and `persistFavorites()` in `03-state.js` are the only way
  to touch it. `favButton()` in `05-chrome.js` renders the toggle in both
  presentations (the round marker on the course art, the labelled button in the
  course header) and the `fav` action re-renders so the card, the sidebar count
  and the `#favorites` route all follow. `state.savedSearches` is a separate
  list, fed by "Suche merken" in the catalogue.
- **Roles** — `state.role` is `learner | admin | report`. It drives `navItems()`
  and gates the `users` and `report` routes via `restricted()`. The role switch is
  the context pill in the top bar: it reads "NRW / Anwenderin", which is exactly
  what changing it does.
- **Accessibility** — skip link, `aria-current` on nav, focus moved to
  `#page-title` on route change, focus returned to the opener on dialog close,
  `aria-pressed` on the watchlist toggles, `role="status"` toast, and
  `prefers-reduced-motion` / `forced-colors` queries.

## Home screen

The home screen follows the design system's main frame:

1. **Hero band** — greeting, training year, the search field, category chips that
   jump straight into a filtered catalogue, and the one open task that needs the
   user, lifted out of Mein iBMS so it is visible without navigating first.
2. **Stats row** — four figures, each a link into the matching Mein-iBMS tab.
3. **Course recommendations** — three cards with generated banner artwork.
4. **News and next appointment** — two panels.
