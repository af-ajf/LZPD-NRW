// 05-chrome.js - Persistent chrome: navigation, brand, page header, footer,
// shell layout, login screen and the course card.
//
// Below 900px the app switches to the phone shell from the Figma frame
// "MOBILE" (node 3059:159): no sidebar and no navy top bar, an iOS-style large
// title, and a floating Liquid Glass tab bar. The switch is decided in JS, not
// only in CSS, because the two shells carry different markup; 09-actions.js
// re-renders when the breakpoint is crossed.

"use strict";

const mobileMQ = window.matchMedia("(max-width: 900px)");
const isMobile = () => mobileMQ.matches;

// The tabs of the phone shell follow the same primary navigation order as the
// desktop rail. Routes that only exist for the admin and report roles stay in
// the profile sheet.
function tabItems() {
  return [
    ["home", "Start", "home"],
    ["dashboard", "Mein iBMS", "users"],
    ["catalog", "Angebote", "book"],
    ["lastminute", "Last Minute", "clock"],
    ["favorites", "Merkliste", "heart"],
    ["learning", "Lernpfad", "activity"],
  ];
}

function navItems() {
  let n = [
    ["home", "Startseite", "home"],
    ["dashboard", "Mein iBMS", "users"],
    ["catalog", "Gesamtangebot", "book"],
    ["lastminute", "Last Minute", "clock"],
    ["favorites", "Merkliste", "heart"],
    ["learning", "Mein Lernpfad", "activity"],
  ];
  if (state.role === "admin") {
    n.push(["planning", "Planung", "calendar"]);
    n.push(["users", "Anwender verwalten", "grid"]);
  }
  if (state.role !== "learner")
    n.push(["report", "Berichte & Statistiken", "chart"]);
  return n;
}

function brand(sub = "NRW") {
  return `<span class="brand-badge"><img src="assets/logo.png" alt=""></span><span class="brand-text"><strong>POLIZEI-ONLINE</strong><span>iBMS 3.0 · ${sub}</span></span>`;
}

// The top-bar context pill names the tenant and the current view. It is a
// label, not a control - the click-dummy role switch sits in the profile
// dialog, where it does not read like part of the product.
function contextPill() {
  return `<span class="rolepill">Nordrhein-Westfalen / ${roleNames[state.role]}</span>`;
}

// The role switch itself, for the profile dialog and the mobile menu.
function demoBox(suffix) {
  return `<div class="demo-controls"><div class="field"><label for="role-${suffix}">Ansicht im Clickdummy</label><select id="role-${suffix}" data-role>${Object.keys(
    roleNames,
  )
    .map(
      (r) =>
        `<option value="${r}" ${state.role === r ? "selected" : ""}>${roleNames[r]}</option>`,
    )
    .join("")}</select></div></div>`;
}

function pagehead(title, desc = "", action = "") {
  return `<header class="pagehead"><div><h1 id="page-title" tabindex="-1">${title}</h1>${desc ? `<p>${desc}</p>` : ""}</div>${action}</header>`;
}

function footer() {
  return `<footer class="footer"><span>POLIZEI-ONLINE · Polizei NRW</span><div class="footer-links"><button data-action="easy-language">Leichte Sprache</button><button data-action="accessibility">Barrierefreiheit</button><button data-action="privacy">Datenschutz</button></div></footer>`;
}

// One rail entry. Shared by the initial markup and by syncSidebar(), so the
// rebuilt link is the same link.
function navLink([r, n, i], route) {
  const count =
    r === "favorites" && state.favorites.length
      ? `<span class="navcount">${state.favorites.length}</span>`
      : "";
  return `<a class="navlink" href="#${r}" ${route === r ? 'aria-current="page"' : ""}>${icon(i)}${n}${count}</a>`;
}

function sidebar(route) {
  return `<aside class="sidebar" aria-label="Hauptnavigation"><div class="sidebar-top"><a class="brand" href="#home">${brand()}</a><hr><div><p class="nav-label">Aus- und Fortbildung</p><nav class="sidenav" data-key="${navKey()}">${navItems()
    .map((item) => navLink(item, route))
    .join(
      "",
    )}</nav></div></div><div class="sidebar-bottom"><div class="sidebar-utility"><a class="navlink" href="#help" ${route === "help" ? 'aria-current="page"' : ""}>${icon("help")}Hilfe & Kontakt</a><a class="navlink" href="#login">${icon("logout")}Abmelden</a></div></div></aside>`;
}

// What the rail is made of, as opposed to which entry is current: the role
// decides the entries, the watchlist decides the count beside one of them.
function navKey() {
  return navItems().map(([r]) => r).join(",") + "|" + state.favorites.length;
}

// ---------- keeping the mounted chrome current ----------
//
// The shell is mounted once (07-render.js) and only the page body is
// exchanged afterwards, so the parts of the chrome that depend on the route
// or on the state are updated here instead of being rebuilt with it.

function syncSidebar(route) {
  const nav = $(".sidenav");
  if (!nav) return;
  // Entries and counts only change with the role and the watchlist; the
  // current marker changes with every route.
  const key = navKey();
  if (nav.dataset.key !== key) {
    nav.innerHTML = navItems()
      .map((item) => navLink(item, route))
      .join("");
    nav.dataset.key = key;
  }
  document.querySelectorAll(".sidebar .navlink").forEach((el) => {
    const target = el.getAttribute("href").slice(1);
    if (target === route) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
}

// The role can also be changed from the mobile menu and the profile sheet, so
// every switch is put back in step with the state after a change.
function syncRoleControls() {
  document.querySelectorAll("[data-role]").forEach((el) => {
    if (el.value !== state.role) el.value = state.role;
  });
  const pill = $(".rolepill");
  if (pill) pill.textContent = `Nordrhein-Westfalen / ${roleNames[state.role]}`;
}

// Phone shell: the header carries the back affordance and, on the start
// route, the large title, so it follows the route. The compact bar keeps its
// `.show` class - that one belongs to the scroll position, not to the route.
function syncMobilehead(route) {
  const head = $(".mobilehead");
  if (head && head.dataset.route !== route) head.outerHTML = mobilehead(route);
  const label = $("#glassbar span");
  if (label) {
    const item = tabItems().find(([r]) => r === route);
    label.textContent =
      route === "home" ? "POLIZEI-ONLINE" : item ? item[1] : "";
  }
}

function syncChrome(route) {
  if (isMobile()) syncMobilehead(route);
  else syncSidebar(route);
  syncRoleControls();
}

function topbar() {
  return `<header class="topbar">${contextPill()}<a class="mobile-brand" href="#home">${brand("NRW")}</a><div class="top-actions"><button class="easy-language-link" data-action="easy-language" aria-haspopup="dialog">Leichte Sprache</button><div class="icon-buttons"><button class="iconbtn" data-action="search" aria-label="Angebote suchen">${icon("search")}</button><button class="iconbtn" data-action="notifications" data-badge="2" aria-label="Benachrichtigungen, 2 neue Hinweise">${icon("bell")}</button></div><span class="topbar-divider" aria-hidden="true"></span><button class="profile" data-action="profile" aria-label="Profil von Maria Beispiel"><span class="avatar" aria-hidden="true">MB</span><span>Maria Beispiel</span></button><button class="iconbtn mobile-menu" data-action="menu" aria-label="Menü öffnen" aria-haspopup="dialog">${icon("menu")}</button></div></header>`;
}

function layout(content, route) {
  if (isMobile()) return mobileLayout(content, route);
  return `<div class="shell">${sidebar(route)}<div class="workspace">${topbar()}<main class="main" id="main">${content}</main>${footer()}</div></div>`;
}

// ---------- phone shell ----------

// Round glass button and avatar, floating over the page surface. On the home
// route the large title follows underneath; every other route brings its own
// pagehead, so only the accessory row is rendered there.
function mobilehead(route) {
  // A route that is not one of the tabs was pushed on top of one, so it
  // gets the iOS back affordance instead of relying on the system gesture.
  const back = tabItems().some(([r]) => r === route)
    ? ""
    : `<button class="glassbtn backbtn" data-action="back">${icon("chevronleft", "sm")}<span>Zurück</span></button>`;
  const acc = `<div class="mobilehead-actions">${back}<span class="mobilehead-spacer"></span><button class="mobile-easy-language" data-action="easy-language" aria-haspopup="dialog">Leichte Sprache</button><button class="glassbtn" data-action="notifications" data-badge="2" aria-label="Benachrichtigungen, 2 neue Hinweise">${icon("bell", "sm")}</button><button class="avatarbtn" data-action="profile" aria-label="Profil von Maria Beispiel"><span class="avatar" aria-hidden="true">MB</span></button></div>`;
  const title =
    route === "home"
      ? `<div class="mobilehead-title"><h1 id="page-title" tabindex="-1">POLIZEI-ONLINE</h1><p>iBMS 3.0 · NRW · Fortbildungsjahr 2026</p></div>`
      : "";
  return `<header class="mobilehead" data-route="${route}">${acc}${title}</header>`;
}

// Compact bar that fades in once the large title has scrolled away.
// 09-actions.js toggles `.show` on scroll.
function glassbar(route) {
  const item = tabItems().find(([r]) => r === route);
  const label = route === "home" ? "POLIZEI-ONLINE" : item ? item[1] : "";
  return `<div class="glassbar" id="glassbar" aria-hidden="true"><span>${esc(label)}</span></div>`;
}

// Liquid Glass tab bar (Apple UI Kit, node 3059:205): one blurred capsule
// floating above the content, the active tab carried by a soft blue pill.
//
// It is rendered once into #tabbar-root and then only updated, never rebuilt:
// the pill is a single element moved with a transform, so switching tabs
// animates instead of cutting.
function syncTabbar(route) {
  const root = $("#tabbar-root");
  if (!root) return;
  if (!isMobile() || route === "login") {
    root.innerHTML = "";
    return;
  }
  // Rebuilt only when it is missing; otherwise the nodes stay put and the
  // pill can animate between routes.
  if (!root.firstElementChild) {
    root.innerHTML = `<nav class="tabbar" aria-label="Hauptnavigation"><div class="tabbar-glass"><span class="tab-indicator" aria-hidden="true"></span>${tabItems()
      .map(
        ([r, n, i]) =>
          `<a class="tab-item" href="#${r}" data-route="${r}"><span class="tab-symbol">${icon(i)}</span><span class="tab-label">${n}</span></a>`,
      )
      .join("")}</div></nav>`;
  }
  const items = root.querySelectorAll(".tab-item");
  let active = -1;
  items.forEach((el, i) => {
    const on =
      el.dataset.route === route ||
      (el.dataset.route === "catalog" && route === "course");
    if (on) active = i;
    if (on) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  const glass = root.querySelector(".tabbar-glass");
  // A route outside the tabs (help, users, report) parks the pill where
  // it is and simply drops the highlight.
  if (glass) {
    glass.style.setProperty("--tab-count", items.length);
    glass.classList.toggle("off-tab", active < 0);
    if (active >= 0) glass.style.setProperty("--tab-index", active);
  }
}

// No footer on the phone: an app has no page end, and the three notices it
// carries would sit directly under the floating tab bar. They are reached
// from the profile sheet instead (see profileExtras in 09-actions.js).
function mobileLayout(content, route) {
  return `<div class="shell phone">${glassbar(route)}<div class="workspace">${mobilehead(route)}<main class="main" id="main">${content}</main><div class="tabbar-space" aria-hidden="true"></div></div></div>`;
}

function login() {
  return `<main class="login" id="main"><div class="login-brand"><div class="brand">${brand()}</div><h1 id="page-title" tabindex="-1">Gemeinsam lernen.<br>Sicher handeln.</h1><p>Ihre Plattform für polizeiliche Aus- und Fortbildung.</p></div><section class="login-card" aria-labelledby="login-title"><p class="eyebrow accent">Nordrhein-Westfalen</p><h2 id="login-title">Willkommen</h2><p class="muted">Melden Sie sich mit Ihrem Dienstkonto bei iBMS 3.0 an.</p><a class="btn" href="#home">${icon("shield")}Mit Dienstkonto anmelden</a><div class="login-footer"><button data-action="help-login">Hilfe zur Anmeldung</button><button data-action="easy-language">Leichte Sprache</button><button data-action="accessibility">Barrierefreiheit</button></div><p class="login-note">Interaktiver Gestaltungsentwurf für Polizei NRW. Kein Produktivsystem.</p></section></main>`;
}

// Banner artwork is derived from the course itself: the gradient carries the
// module, the centred glyph carries the subject area.
const courseGlyphs = {
  Kommunikation: "users",
  "Recht & Verwaltung": "shield",
  Einsatzkompetenz: "route",
  "Gesundheit & Fitness": "activity",
  "Digitale Kompetenz": "monitor",
};

// Favourite toggle. `variant` picks the presentation: "mark" is the round chip
// that floats over the course art, "button" is the labelled control on the
// detail page. Both are the same control, so both carry aria-pressed.
function favButton(c, variant = "mark") {
  const on = isFavorite(c.id);
  const label = on ? "Gemerkt" : "Merken";
  const glyph = icon(
    on ? "heartfull" : "heart",
    variant === "mark" ? "" : "sm",
  );
  const cls = variant === "mark" ? "favmark" : "btn secondary favtoggle";
  return `<button class="${cls}${on ? " on" : ""}" data-action="fav" data-id="${c.id}" aria-pressed="${on}" title="${label}" aria-label="${label}: ${esc(c.title)}">${glyph}${variant === "mark" ? "" : `<span>${label}</span>`}</button>`;
}

// Phone only. Re-rendering the whole screen for a heart is the one place the
// click dummy reads like a page reload, so the marks are patched where they
// stand: same markup as favButton(), written onto the live nodes.
function syncFavButtons(id) {
  const c = courses.find((x) => x.id === id);
  if (!c) return;
  const on = isFavorite(c.id);
  const label = on ? "Gemerkt" : "Merken";
  document
    .querySelectorAll(`[data-action="fav"][data-id="${c.id}"]`)
    .forEach((el) => {
      const mark = el.classList.contains("favmark");
      el.classList.toggle("on", on);
      el.setAttribute("aria-pressed", String(on));
      el.setAttribute("title", label);
      el.setAttribute("aria-label", `${label}: ${c.title}`);
      el.innerHTML =
        icon(on ? "heartfull" : "heart", mark ? "" : "sm") +
        (mark ? "" : `<span>${label}</span>`);
      // Focusing the mark can scroll the artwork it sits in; without the
      // re-render that used to follow, the shift would stay on screen.
      const art = el.closest(".course-art");
      if (art) art.scrollTo(0, 0);
    });
}

// Un-marking on the watchlist takes the card out from under the finger. The
// count beside it is the live region, so it is updated and focused; an empty
// list has its own panel and is left to a re-render.
function dropFavoriteCard(id) {
  const card = document
    .querySelector(`[data-action="fav"][data-id="${id}"]`)
    ?.closest(".course-card");
  if (!card) return false;
  const left = state.favorites.length;
  if (!left) return false;
  const count = $('.sectionhead [role="status"]');
  if (count) {
    count.textContent = `${left} ${left === 1 ? "gemerktes Angebot" : "gemerkte Angebote"}`;
    count.focus({ preventScroll: true });
  }
  card.classList.add("leaving");
  setTimeout(() => card.remove(), 240);
  return true;
}

function courseCard(c) {
  const seats = c.seats ? `${c.seats} freie Plätze` : "Ausgebucht";
  const start =
    c.type === "E-Learning" ? "Ab " + formatDate(c.date) : formatDate(c.date);
  return `<article class="panel course-card"><a class="course-card-link" href="#course/${c.id}" aria-label="${esc(c.title)} – Angebot ansehen"><span class="hidesr">${esc(c.title)} – Angebot ansehen</span></a><div class="course-art" data-module="${esc(c.module)}"><span class="course-glyph">${icon(courseGlyphs[c.category] || "book")}</span><span class="tag">${c.module}</span>${favButton(c)}</div><div class="course-body"><div class="course-headline"><p class="course-meta">${icon(c.type === "E-Learning" ? "monitor" : "calendar", "xs")}${c.type} · ${c.duration}</p><h3>${esc(c.title)}</h3></div><div><div class="course-facts"><p class="course-meta">${icon("pin", "xs")}${c.place}</p><p class="course-meta">${start} · ${seats}</p></div><span class="textlink" aria-hidden="true">Angebot ansehen${icon("arrow", "xs")}</span></div></div></article>`;
}

function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
