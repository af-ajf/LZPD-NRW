// 05-chrome.js - Persistent chrome: navigation, brand, page header, footer,
// shell layout, login screen and the course card.

"use strict";

function navItems() {
  let n = [
    ["home", "Startseite", "home"],
    ["dashboard", "Mein iBMS", "users"],
    ["catalog", "Gesamtangebot", "book"],
    ["lastminute", "Last Minute", "clock"],
    ["learning", "Mein Lernpfad", "activity"],
  ];
  if (state.role === "admin") n.push(["users", "Anwender verwalten", "grid"]);
  if (state.role !== "learner")
    n.push(["report", "Berichte & Statistiken", "chart"]);
  return n;
}

function brand(sub = "NRW") {
  return `<span class="brand-badge"><img src="assets/logo.svg" alt=""></span><span class="brand-text"><strong>POLIZEI-ONLINE</strong><span>iBMS 3.0 · ${sub}</span></span>`;
}

// The top-bar context pill doubles as the click-dummy role switch: the label it
// shows ("NRW / Anwenderin") is exactly what changing it does.
function rolePill(id) {
  return `<span class="rolepill"><label class="hidesr" for="${id}">${t("Ansicht im Clickdummy")}</label><select id="${id}" data-role>${Object.keys(
    roleNames,
  )
    .map(
      (r) =>
        `<option value="${r}" ${state.role === r ? "selected" : ""}>${t("Nordrhein-Westfalen")} / ${t(roleNames[r])}</option>`,
    )
    .join(
      "",
    )}</select><span class="rolepill-sizer" aria-hidden="true">${t("Nordrhein-Westfalen")} / ${t(roleNames[state.role])}</span>${icon("chevrondown", "xs")}</span>`;
}

function langSwitch() {
  return `<div class="langswitch" role="group" aria-label="${t("Sprache")}">${[
    ["de", "DE", "Deutsch"],
    ["en", "EN", "Englisch"],
  ]
    .map(
      ([v, short, full]) =>
        `<button data-action="setlang" data-lang-value="${v}" aria-pressed="${state.lang === v}" title="${t(full)}"><img src="assets/flag-${v}.svg" alt=""><span aria-hidden="true">${short}</span><span class="hidesr">${t(full)}</span></button>`,
    )
    .join("")}</div>`;
}

// Selects for the mobile menu, where the pill and the segmented switch do not fit.
function demoBox(suffix) {
  return `<div class="demo-controls"><div><label for="role-${suffix}">${t("Ansicht im Clickdummy")}</label><select id="role-${suffix}" data-role>${Object.keys(
    roleNames,
  )
    .map(
      (r) =>
        `<option value="${r}" ${state.role === r ? "selected" : ""}>${t(roleNames[r])}</option>`,
    )
    .join(
      "",
    )}</select></div><div><label for="lang-${suffix}">${t("Sprache")}</label><select id="lang-${suffix}" data-lang><option value="de" ${state.lang === "de" ? "selected" : ""}>${t("Deutsch")}</option><option value="en" ${state.lang === "en" ? "selected" : ""}>${t("Englisch")}</option></select></div></div>`;
}

function pagehead(title, desc = "", action = "") {
  return `<header class="pagehead"><div><h1 id="page-title" tabindex="-1">${title}</h1>${desc ? `<p>${desc}</p>` : ""}</div>${action}</header>`;
}

function footer() {
  return `<footer class="footer"><span>${t("POLIZEI-ONLINE · LZPD Nordrhein-Westfalen")}</span><div class="footer-links"><button data-action="accessibility">${t("Barrierefreiheit")}</button><button data-action="privacy">${t("Datenschutz")}</button><button data-action="about">${t("Über diesen Entwurf")}</button></div></footer>`;
}

function sidebar(route) {
  return `<aside class="sidebar" aria-label="${t("Hauptnavigation")}"><div class="sidebar-top"><a class="brand" href="#home">${brand()}</a><hr><div><p class="nav-label">${t("Aus- und Fortbildung")}</p><nav class="sidenav">${navItems()
    .map(
      ([r, n, i]) =>
        `<a class="navlink" href="#${r}" ${route === r ? 'aria-current="page"' : ""}>${icon(i)}${t(n)}</a>`,
    )
    .join(
      "",
    )}</nav></div></div><div class="sidebar-bottom"><div class="sidebar-utility"><a class="navlink" href="#help" ${route === "help" ? 'aria-current="page"' : ""}>${icon("help")}${t("Hilfe & Kontakt")}</a><a class="navlink" href="#login">${icon("logout")}${t("Abmelden")}</a></div></div></aside>`;
}

function topbar() {
  return `<header class="topbar">${rolePill("role-top")}<a class="mobile-brand" href="#home">${brand("NRW")}</a><div class="top-actions"><div class="icon-buttons"><button class="iconbtn" data-action="search" aria-label="${t("Angebote suchen")}">${icon("search")}</button><button class="iconbtn" data-action="notifications" data-badge="2" aria-label="${t("Benachrichtigungen, 2 neue Hinweise")}">${icon("bell")}</button></div><span class="topbar-divider" aria-hidden="true"></span>${langSwitch()}<button class="profile" data-action="profile" aria-label="${t("Profil von Maria Beispiel")}"><span class="avatar" aria-hidden="true">MB</span><span>Maria Beispiel</span></button><button class="iconbtn mobile-menu" data-action="menu" aria-label="${t("Menü öffnen")}" aria-haspopup="dialog">${icon("menu")}</button></div></header>`;
}

function layout(content, route) {
  return `<div class="shell">${sidebar(route)}<div class="workspace">${topbar()}<main class="main" id="main">${content}</main>${footer()}</div></div>`;
}

function login() {
  return `<main class="login" id="main"><div class="login-brand"><div class="brand">${brand()}</div><h1 id="page-title" tabindex="-1">${t("Gemeinsam lernen.")}<br>${t("Sicher handeln.")}</h1><p>${t("Ihre Plattform für polizeiliche Aus- und Fortbildung.")}</p></div><section class="login-card" aria-labelledby="login-title"><p class="eyebrow accent">${t("Nordrhein-Westfalen")}</p><h2 id="login-title">${t("Willkommen")}</h2><p class="muted">${t("Melden Sie sich mit Ihrem Behördenkonto bei iBMS 3.0 an.")}</p><div class="field"><label for="organisation">${t("Organisation")}</label><select id="organisation"><option>${t("Polizei Nordrhein-Westfalen")}</option></select></div><a class="btn" href="#home">${icon("shield")}${t("Mit Behördenkonto anmelden")}</a><div class="notice mt">${icon("help")}<span>${t("Für den Entwurf öffnet dieser Button die Beispielansicht. Es werden keine Zugangsdaten abgefragt.")}</span></div><div class="login-footer"><button data-action="help-login">${t("Hilfe zur Anmeldung")}</button><button data-action="accessibility">${t("Barrierefreiheit")}</button>${langSwitch()}</div><p class="login-note">${t("Interaktiver Gestaltungsentwurf für LZPD NRW. Kein Produktivsystem.")}</p></section></main>`;
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

function courseCard(c) {
  const seats = c.seats
    ? `${c.seats} ${t("freie Plätze")}`
    : t("Ausgebucht");
  const start =
    c.type === "E-Learning"
      ? t("Ab") + " " + formatDate(c.date)
      : formatDate(c.date);
  return `<article class="panel course-card"><div class="course-art" data-module="${esc(c.module)}"><span class="course-glyph">${icon(courseGlyphs[c.category] || "book")}</span><span class="tag">${t(c.module)}</span></div><div class="course-body"><div class="course-headline"><p class="course-meta">${icon(c.type === "E-Learning" ? "monitor" : "calendar", "xs")}${t(c.type)} · ${t(c.duration)}</p><h3>${esc(t(c.title))}</h3></div><div><div class="course-facts"><p class="course-meta">${icon("pin", "xs")}${t(c.place)}</p><p class="course-meta">${start} · ${seats}</p></div><a class="textlink" href="#course/${c.id}">${t("Angebot ansehen")}${icon("arrow", "xs")}</a></div></div></article>`;
}

function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString(
    state.lang === "de" ? "de-DE" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );
}
