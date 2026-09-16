// 05-chrome.js - Persistent chrome: navigation, brand, page header, footer, shell layout.

"use strict";

function navItems() {
  let n = [
    ["home", "Startseite", "home"],
    ["dashboard", "Mein iBMS", "grid"],
    ["catalog", "Gesamtangebot", "book"],
    ["lastminute", "Last Minute", "clock"],
    ["learning", "Mein Lernpfad", "route"],
  ];
  if (state.role === "admin") n.push(["users", "Anwender verwalten", "users"]);
  if (state.role !== "learner")
    n.push(["report", "Berichte & Statistiken", "chart"]);
  return n;
}

function brand() {
  return `<img src="assets/logo.png" alt="LZPD NRW"><strong>POLIZEI-ONLINE</strong><span>iBMS 3.0 · ${t("Nordrhein-Westfalen")}</span>`;
}

function roleSelect(id) {
  return `<label for="${id}">${t("Ansicht im Clickdummy")}</label><select id="${id}" data-role><option value="learner" ${state.role === "learner" ? "selected" : ""}>${t("Anwenderin")}</option><option value="admin" ${state.role === "admin" ? "selected" : ""}>${t("BMS-Administrator")}</option><option value="report" ${state.role === "report" ? "selected" : ""}>${t("ET-Fachaufsicht")}</option></select>`;
}

function demoBox(suffix) {
  return `<div class="rolebox">${roleSelect("role-" + suffix)}<div class="rolebox-row">${langSelect("lang-" + suffix)}</div></div>`;
}

function pagehead(title, desc = "", action = "") {
  return `<header class="pagehead"><div><h1 id="page-title" tabindex="-1">${title}</h1>${desc ? `<p>${desc}</p>` : ""}</div>${action}</header>`;
}

function footer() {
  return `<footer class="footer"><span>${t("POLIZEI-ONLINE · LZPD Nordrhein-Westfalen")}</span><button data-action="accessibility">${t("Barrierefreiheit")}</button><button data-action="privacy">${t("Datenschutz")}</button><button data-action="about">${t("Über diesen Entwurf")}</button></footer>`;
}

function layout(content, route) {
  return `<div class="shell"><aside class="sidebar" aria-label="${t("Hauptnavigation")}"><a class="brand" href="#home">${brand()}</a><p class="nav-label">${t("Aus- und Fortbildung")}</p><nav class="sidenav">${navItems()
    .map(
      ([r, n, i]) =>
        `<a class="navlink" href="#${r}" ${route === r ? 'aria-current="page"' : ""}>${icon(i)}${t(n)}</a>`,
    )
    .join(
      "",
    )}</nav><div class="sidebar-bottom"><a class="navlink" href="#help">${icon("help")}${t("Hilfe & Kontakt")}</a><a class="navlink" href="#login">${icon("logout")}${t("Abmelden")}</a>${demoBox("side")}</div></aside><div class="workspace"><header class="topbar"><div class="context">${t("Nordrhein-Westfalen")} <span aria-hidden="true">/</span> ${t(roleNames[state.role])}</div><div class="mobile-brand"><img src="assets/logo.png" alt="LZPD NRW"><span>POLIZEI-ONLINE<br>iBMS 3.0</span></div><div class="top-actions"><span class="prototype">${t("Interaktiver Entwurf · Beispieldaten")}</span><button class="iconbtn" data-action="search" aria-label="${t("Angebote suchen")}">${icon("search")}</button><button class="iconbtn" data-action="notifications" aria-label="${t("Benachrichtigungen, 2 neue Hinweise")}">${icon("bell")}</button><button class="profile" data-action="profile" aria-label="${t("Profil von Maria Beispiel")}"><span class="avatar">MB</span><span>Maria Beispiel</span></button><button class="iconbtn mobile-menu" data-action="menu" aria-label="${t("Menü öffnen")}" aria-haspopup="dialog">${icon("menu")}</button></div></header><main class="main" id="main">${content}${footer()}</main></div></div>`;
}

function login() {
  return `<main class="login" id="main"><div class="login-brand"><div class="brand">${brand()}</div><h1 id="page-title" tabindex="-1">${t("Gemeinsam lernen.")}<br>${t("Sicher handeln.")}</h1><p>${t("Ihre Plattform für polizeiliche Aus- und Fortbildung.")}</p></div><section class="login-card" aria-labelledby="login-title"><p class="eyebrow">${t("Nordrhein-Westfalen")}</p><h2 id="login-title">${t("Willkommen")}</h2><p class="muted">${t("Melden Sie sich mit Ihrem Behördenkonto bei iBMS 3.0 an.")}</p><div class="field"><label for="organisation">${t("Organisation")}</label><select id="organisation"><option>${t("Polizei Nordrhein-Westfalen")}</option></select></div><a class="btn" href="#home">${icon("shield")}${t("Mit Behördenkonto anmelden")}</a><div class="notice mt">${icon("help")}<span>${t("Für den Entwurf öffnet dieser Button die Beispielansicht. Es werden keine Zugangsdaten abgefragt.")}</span></div><div class="login-footer"><button data-action="help-login">${t("Hilfe zur Anmeldung")}</button><button data-action="accessibility">${t("Barrierefreiheit")}</button><button data-action="privacy">${t("Datenschutz")}</button><span class="login-lang">${langSelect("lang-login")}</span></div><p class="login-note">${t("Interaktiver Gestaltungsentwurf für LZPD NRW. Kein Produktivsystem.")}</p></section></main>`;
}

function courseCard(c) {
  return `<article class="panel course-card"><div class="course-art" role="img" aria-label="${t("Abstraktes blaues Bildmotiv aus der Designvorlage")}"><span class="tag">${t(c.module)}</span></div><div class="course-body"><div class="course-meta">${icon(c.type === "E-Learning" ? "monitor" : "calendar")}${t(c.type)} · ${t(c.duration)}</div><h3>${esc(t(c.title))}</h3><div class="course-meta">${icon("pin")}${t(c.place)}</div><div class="course-meta">${c.type === "E-Learning" ? t("Ab") + " " + formatDate(c.date) : formatDate(c.date)} ${c.seats ? `· ${c.seats} ${t("freie Plätze")}` : "· " + t("Ausgebucht")}</div>${link(t("Angebot ansehen"), "course/" + c.id, "textlink")}</div></article>`;
}

function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString(
    state.lang === "de" ? "de-DE" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );
}
