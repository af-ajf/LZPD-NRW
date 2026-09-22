// 06-views.js - One function per route. Each returns an HTML string.

"use strict";

function greeting() {
  return "Guten Tag, Maria.";
}

// The open task from Mein iBMS is surfaced on the home screen too, so the one
// thing that actually needs the user is visible without navigating first.
function heroTask() {
  if (state.wishDone)
    return `<div class="taskrow"><div class="taskrow-detail"><span class="iconbox green">${icon("check")}</span><div class="taskrow-text"><p class="eyebrow" style="color:var(--success)">Erledigt</p><strong>Gesprächsführung und Konfliktklärung</strong><p>Ihre Ergänzung steht zur fachlichen Prüfung bereit.</p></div></div><a class="btn secondary" href="${dashboardHref("Registrierungen")}">Mein iBMS öffnen</a></div>`;
  return `<div class="taskrow"><div class="taskrow-detail"><span class="iconbox">${icon("file")}</span><div class="taskrow-text"><p class="eyebrow attention">Rückmeldung offen</p><strong>Gesprächsführung und Konfliktklärung</strong><p>Bitte ergänzen Sie die Begründung für Ihren Fortbildungswunsch.</p></div></div>${btn("Begründung ergänzen", "wish")}</div>`;
}

// The course in progress, following the Figma frame MAIN | WEITER LERNEN
// (node 3168:20). It carries the page heading: what the user is in the middle
// of is what the home screen is about.
function heroResume() {
  const c = courses.find((x) => x.id === resume.course);
  if (isMobile()) return mobileResume(c);
  return `<div class="hero-resume">
  <div class="resume-art" aria-hidden="true"><strong>${resume.percent} %</strong><span>erledigt</span></div>
  <div class="resume-body">
    <p class="eyebrow accent">Weiter lernen</p>
    <h1 id="page-title" tabindex="-1">${esc(c.title)}</h1>
    <div class="progress" role="progressbar" aria-valuenow="${resume.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Fortschritt im Kurs"><span style="width:${resume.percent}%"></span></div>
    <p class="resume-meta">${c.type} · ${resume.step} · ${resume.left} · zuletzt am ${resume.last}</p>
  </div>
  <div class="resume-actions">${btn("Kurs fortsetzen", "lms")}<a class="textlink" href="${dashboardHref("Registrierungen")}" data-action="stat-link" data-tab="Registrierungen">Alle laufenden Kurse${icon("arrow", "xs")}</a></div>
</div>`;
}

// Phone variant of the resume band. The desktop band is three columns, which
// on a phone becomes three stacked blocks of nearly equal weight and buries
// the one thing that matters - the course. Here the artwork shrinks to a
// badge beside the title, the progress carries its own figure so the badge
// does not have to repeat it, and the way on is a full-width row.
function mobileResume(c) {
  return `<div class="hero-resume">
  <div class="resume-head">
    <span class="resume-art" aria-hidden="true">${resume.percent}<small>%</small></span>
    <div class="resume-headline">
      <p class="eyebrow accent">Weiter lernen</p>
      <h2>${esc(c.title)}</h2>
    </div>
  </div>
  <div class="resume-track">
    <div class="progress" role="progressbar" aria-valuenow="${resume.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Fortschritt im Kurs"><span style="width:${resume.percent}%"></span></div>
    <p class="resume-meta">${c.type} · ${resume.step}<br>${resume.left} · zuletzt am ${resume.last}</p>
  </div>
  <div class="resume-actions">${btn("Kurs fortsetzen", "lms")}</div>
</div>`;
}

function home() {
  if (isMobile()) return mobileHome();
  const chips = [
    ["Bildung", "module"],
    ["Einsatztraining", "module"],
    ["Sport", "module"],
    ["Kurzfristig freie Plätze", "lastminute"],
  ];
  return `<section class="hero">
  <div class="hero-topline"><p class="eyebrow">${greeting()}</p><span class="pill">Fortbildungsjahr 2026</span></div>
  ${heroResume()}
  <hr>
  <div class="hero-discover">
    <p class="eyebrow">Etwas Neues finden</p>
    <div class="discover-row">
      <form id="home-search" class="home-search"><label class="hidesr" for="home-q">Angebote suchen</label><input id="home-q" name="q" type="search" placeholder="z. B. Kommunikation"><button aria-label="Angebote suchen">${icon("search", "sm")}</button></form>
      <div class="chips">${chips
        .map(
          ([label, kind]) =>
            `<button class="chip" data-action="chip" data-kind="${kind}" data-value="${esc(label)}">${label}</button>`,
        )
        .join("")}</div>
    </div>
  </div>
  <hr>
  ${heroTask()}
</section>
<section class="section"><div class="sectionhead"><h2>Ihre Fortbildung auf einen Blick</h2><a class="textlink" href="${dashboardHref("Registrierungen")}">Mein iBMS öffnen${icon("arrow", "sm")}</a></div><div class="grid four">${homeStats()}</div></section>
<section class="section"><div class="sectionhead"><h2>Neue Perspektiven für Ihren Alltag</h2><a class="textlink" href="#catalog">Alle Angebote${icon("arrow", "sm")}</a></div><div class="grid three">${courses.slice(0, 3).map(courseCard).join("")}</div></section>
<div class="grid two">
  <section class="panel ruled"><p class="eyebrow">Aktuelles</p><h2>Fortbildungsnews</h2><hr class="rule"><div class="newsrow"><time datetime="2026-09-16">16.09.2026</time><a class="textlink" href="#article">Fortbildungsplanung gemeinsam gestalten${icon("arrow", "xs")}</a><p>Melden Sie Ihren Bedarf für das kommende Fortbildungsjahr.</p></div><div class="newsrow"><time datetime="2026-09-14">14.09.2026</time><a class="textlink" href="#help">Gut ankommen in iBMS 3.0${icon("arrow", "xs")}</a><p>Antworten zu Registrierung, Nachweisen und persönlicher Übersicht.</p></div></section>
  <section class="panel ruled"><p class="eyebrow">Für Sie persönlich</p><h2>Ihr nächster Termin</h2><hr class="rule"><div class="stack" style="gap:var(--space-3)"><h4 style="margin:0">Deeskalation im Einsatz</h4><p class="factrow">${icon("calendar", "sm")}15. Oktober · 09:00 Uhr</p><p class="factrow">${icon("pin", "sm")}Fortbildungszentrum NRW</p></div><hr class="rule"><a class="textlink" href="${dashboardHref("Registrierungen")}" data-action="stat-link" data-tab="Registrierungen">Meine Registrierungen${icon("arrow", "xs")}</a></section>
</div>`;
}

// Phone home screen keeps the complete personal entry from desktop. The
// content is stacked rather than reduced so greeting, current course, open
// task and personal overview remain available at narrow phone widths.
function mobileHome() {
  const chips = [
    ["Bildung", "module"],
    ["Einsatztraining", "module"],
    ["Sport", "module"],
    ["Kurzfristig freie Plätze", "lastminute"],
  ];
  return `<section class="hero mobile-home-hero">
  <div class="hero-topline"><p class="eyebrow">${greeting()}</p><span class="pill">Fortbildungsjahr 2026</span></div>
  ${heroResume()}
  <hr>
  <div class="hero-discover"><p class="eyebrow">Etwas Neues finden</p><div class="discover-row">
  <form id="home-search" class="home-search"><label class="hidesr" for="home-q">Angebote suchen</label><input id="home-q" name="q" type="search" placeholder="z. B. Kommunikation"><button aria-label="Angebote suchen">${icon("search", "sm")}</button></form>
  <div class="chips">${chips
    .map(
      ([label, kind]) =>
        `<button class="chip" data-action="chip" data-kind="${kind}" data-value="${esc(label)}">${label}</button>`,
    )
    .join("")}</div></div></div>
  <hr>
  ${heroTask()}
</section>
<section class="section"><div class="sectionhead"><h2>Ihre Fortbildung auf einen Blick</h2><a class="textlink" href="${dashboardHref("Registrierungen")}">Mein iBMS öffnen${icon("arrow", "xs")}</a></div><div class="grid four">${homeStats()}</div></section>
<section class="section"><div class="sectionhead"><h2>Neue Perspektiven</h2><a class="textlink" href="#catalog">Alle Angebote${icon("arrow", "xs")}</a></div><div class="rail">${courses
    .slice(0, 6)
    .map(courseCard)
    .join("")}</div></section>
<section class="panel"><p class="eyebrow">Aktuelles</p><h2>Fortbildungsnews</h2><hr class="rule">${mobileNewsRow("#article", "2026-09-16", "16.09.2026", "Fortbildungsplanung gemeinsam gestalten", "Melden Sie Ihren Bedarf für das kommende Fortbildungsjahr.")}<hr class="rule">${mobileNewsRow("#help", "2026-09-14", "14.09.2026", "Gut ankommen in iBMS 3.0", "Antworten zu Registrierung, Nachweisen und persönlicher Übersicht.")}</section>
<a class="panel panel-link" href="${dashboardHref("Registrierungen")}" data-action="stat-link" data-tab="Registrierungen" aria-label="Ihr nächster Termin – meine Registrierungen öffnen"><div class="panel-linkhead"><div><p class="eyebrow">Für Sie persönlich</p><h2>Ihr nächster Termin</h2></div><span class="panel-chevron" aria-hidden="true">${icon("chevron", "sm")}</span></div><hr class="rule"><div class="stack" style="gap:var(--space-2)"><h4 style="margin:0">Deeskalation im Einsatz</h4><p class="factrow">${icon("calendar", "sm")}15. Oktober · 09:00 Uhr</p><p class="factrow">${icon("pin", "sm")}Fortbildungszentrum NRW</p></div></a>`;
}

// A news entry on the phone: the row is the link, so the headline is plain
// text and the chevron carries the affordance. Desktop keeps the inline link,
// where a row that wide would give the eye nothing to aim at.
function mobileNewsRow(href, iso, date, title, text) {
  return `<a class="newsrow newsrow-link" href="${href}"><span class="newsrow-body"><time datetime="${iso}">${date}</time><strong>${esc(title)}</strong><p>${esc(text)}</p></span><span class="newsrow-chevron" aria-hidden="true">${icon("chevron", "xs")}</span></a>`;
}

function homeStats() {
  const booked = state.registrations.filter(
    (r) => r.status === "Gebucht",
  ).length;
  return (
    stat(
      booked,
      "Gebuchte Veranstaltungen",
      "Ihre bestätigten Termine",
      "",
      "Registrierungen",
    ) +
    stat(
      state.wishDone ? 0 : 1,
      "Offene Rückmeldungen",
      "Von Ihnen zu ergänzen",
      state.wishDone ? "" : "amber",
      "Fortbildungswünsche",
    ) +
    stat(
      2,
      "Nachweise",
      "Für absolvierte Fortbildungen",
      "green",
      "Nachweise",
    ) +
    stat(1, "Fertigkeiten", "Aktuell gültig", "", "Fertigkeiten")
  );
}

function dashboardHref(tab) {
  return `#dashboard/${encodeURIComponent(tab)}`;
}

// `tab` turns the card into a link that opens the matching Mein-iBMS tab.
function stat(n, label, detail = "", tone = "", tab = "") {
  const body = `<h3>${label}</h3><span class="number ${tone}">${n}</span><p>${detail}</p>`;
  return tab
    ? `<a class="stat" href="${dashboardHref(tab)}" data-action="stat-link" data-tab="${tab}">${body}</a>`
    : `<div class="stat">${body}</div>`;
}

function eventRow(reg) {
  const c = courses.find((c) => c.id === reg.course);
  return `<div class="event"><div class="date"><strong>${c.day}</strong><small>${c.month}</small></div><div class="event-main"><h3>${c.title}</h3><p>${c.time} · ${c.type}</p></div><div class="event-action">${badge(reg.status)}<button class="textlink" data-action="registration" data-id="${c.id}">Details ${icon("chevron", "xs")}</button></div></div>`;
}

function dashboard() {
  const tabs = [
    "Registrierungen",
    "Bedarfsmeldungen",
    "Fortbildungswünsche",
    "Nachweise",
    "Fertigkeiten",
  ];
  let body = "";
  if (state.mytab === "Registrierungen")
    body = `<div class="grid split"><section class="panel"><div class="panel-head"><h2>Meine nächsten Veranstaltungen</h2>${badge(state.registrations.length + " Einträge")}</div>${state.registrations.length ? state.registrations.map(eventRow).join("") : `<p class="empty">Noch keine Registrierungen vorhanden.</p>`}</section><div class="stack"><section class="panel"><p class="eyebrow">Nächster Schritt</p><h2>${state.wishDone ? "Vielen Dank für Ihre Rückmeldung" : "Ihr Fortbildungswunsch"}</h2><div class="task">${badge(state.wishDone ? "Ergänzt" : "Rückmeldung offen")}<h3>Gesprächsführung und Konfliktklärung</h3><p>${state.wishDone ? "Ihre Ergänzung steht in diesem Entwurf zur fachlichen Prüfung bereit." : "Bitte ergänzen Sie die Begründung für Ihren Fortbildungswunsch."}</p>${state.wishDone ? "" : btn("Begründung ergänzen", "wish")}</div></section><section class="panel"><h2>Ihre persönliche Entwicklung</h2><p class="muted">Registrierungen, Lernangebote und Nachweise in einer Übersicht.</p><a class="textlink" href="#learning">Lernpfad öffnen${icon("arrow", "sm")}</a></section></div></div>`;
  else if (state.mytab === "Nachweise")
    body = `<section class="panel"><div class="panel-head"><h2>Meine Nachweise</h2></div><div class="tablewrap mobilecards"><table><thead><tr><th>Fortbildung</th><th>Datum</th><th>Modul</th><th>Aktion</th></tr></thead><tbody>${[
      ["Grundlagen der Kommunikation", "08.09.2026", "Bildung", "assets/nachweise/grundlagen-kommunikation.pdf"],
      ["Funktionelles Training", "03.09.2026", "Sport", "assets/nachweise/funktionelles-training.pdf"],
    ]
      .map(
        (d) =>
          `<tr><td><strong>${d[0]}</strong></td><td data-label="Datum">${d[1]}</td><td data-label="Modul">${d[2]}</td><td><button class="textlink" data-action="certificate">${icon("file", "sm")}Nachweis ansehen</button><a class="textlink certificate-download" href="${d[3]}" download>${icon("download", "sm")}PDF herunterladen</a></td></tr>`,
      )
      .join("")}</tbody></table></div></section>`;
  else if (state.mytab === "Fertigkeiten")
    body = `<section class="panel"><h2>Meine Fertigkeiten</h2><div class="event"><span class="iconbox accent">${icon("shield")}</span><div class="event-main"><h3>Kommunikation und Gesprächsführung</h3><p>Modul Bildung · Gültig bis 08.09.2027</p></div>${badge("Gültig")}</div><div class="notice mt">${icon("help")}<span>Gültigkeitszeiträume und Zuweisungen folgen den Regeln des jeweiligen Moduls.</span></div></section>`;
  else
    body = `<section class="panel"><div class="panel-head"><h2>Meine ${state.mytab}</h2>${btn("Neu erfassen", "need", "secondary")}</div><div class="event"><span class="iconbox accent">${icon("book")}</span><div class="event-main"><h3>Gesprächsführung und Konfliktklärung</h3><p>Bildung · Für das Fortbildungsjahr 2027</p></div>${badge(state.wishDone ? "Ergänzt" : "In Prüfung")}</div>${state.needs.map((n) => `<div class="event"><span class="iconbox accent">${icon("file")}</span><div class="event-main"><h3>${esc(n)}</h3><p>Neue Bedarfsmeldung</p></div>${badge("Erfasst")}</div>`).join("")}<p class="muted small mt">Den Bearbeitungsstand und Rückmeldungen Ihrer zuständigen Stelle sehen Sie hier.</p></section>`;
  return (
    pagehead(
      "Mein iBMS",
      "Guten Tag, Maria. Hier finden Sie Ihre persönliche Fortbildungsübersicht.",
    ) +
    `<div class="grid four mobile-stats">${homeStats()}</div><nav class="tabs" aria-label="Mein iBMS Bereiche">${tabs.map((x) => `<button class="tab" data-action="mytab" data-tab="${x}" ${state.mytab === x ? 'aria-current="true"' : ""}>${x}</button>`).join("")}</nav>${body}`
  );
}

function catalog(last = false) {
  const filtered = courses.filter(
    (c) =>
      (!last || (c.seats > 0 && c.seats <= 5)) &&
      (state.module === "Alle Module" || c.module === state.module) &&
      (state.type === "Alle Formate" || c.type === state.type) &&
      (c.title + " " + c.category)
        .toLowerCase()
        .includes(state.query.toLowerCase()),
  );
  const hasFilter =
    state.query ||
    state.module !== "Alle Module" ||
    state.type !== "Alle Formate";
  return (
    pagehead(
      last ? "Last Minute" : "Gesamtangebot",
      last
        ? "Kurzfristig verfügbare Plätze in Bildung, Einsatztraining und Sport."
        : "Fortbildungen finden, Details prüfen und die Teilnahme organisieren.",
    ) +
    `<form id="catalog-filter" class="filterbar"><div class="field search-field"><label for="catalog-q">Angebot oder Thema</label><input id="catalog-q" name="q" type="search" value="${esc(state.query)}" placeholder="z. B. Kommunikation"></div><div class="field"><label for="module">Modul</label><select id="module" name="module">${["Alle Module", "Bildung", "Einsatztraining", "Sport"].map((x) => `<option value="${x}" ${state.module === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><div class="field"><label for="format">Format</label><select id="format" name="type">${["Alle Formate", "Präsenz", "E-Learning"].map((x) => `<option value="${x}" ${state.type === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><button class="btn" type="submit">${icon("search", "sm")}Suchen</button></form><div class="sectionhead"><p class="muted small" role="status">${filtered.length} passende Angebote</p><div class="chips">${hasFilter ? `<button class="chip" data-action="reset-filter">${icon("close", "xs")}Filter zurücksetzen</button>` : ""}<button class="chip" data-action="save-search">Suche merken</button></div></div>${filtered.length ? `<div class="grid three">${filtered.map(courseCard).join("")}</div>` : `<div class="panel empty"><h2>Keine passenden Angebote</h2><p>Ändern Sie den Suchbegriff oder setzen Sie die Filter zurück.</p>${btn("Filter zurücksetzen", "reset-filter", "secondary")}</div>`}`
  );
}

// The watchlist. It reuses the catalogue card, so a course can be un-marked
// straight from here; the list then shrinks under the click.
function favorites() {
  const list = state.favorites
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean);
  if (!list.length)
    return (
      pagehead(
        "Merkliste",
        "Angebote, die Sie sich für später gemerkt haben.",
      ) +
      `<section class="panel empty"><span class="iconbox accent emptyicon">${icon("heart")}</span><h2>Noch nichts gemerkt</h2><p>Mit dem Herz auf einem Angebot merken Sie es sich für später. Die Merkliste bleibt auf diesem Gerät erhalten.</p><div class="mt">${link("Zum Gesamtangebot", "catalog")}</div></section>`
    );
  return (
    pagehead("Merkliste", "Angebote, die Sie sich für später gemerkt haben.") +
    `<div class="sectionhead"><p class="muted small" role="status" tabindex="-1">${list.length} ${list.length === 1 ? "gemerktes Angebot" : "gemerkte Angebote"}</p><div class="chips"><button class="chip" data-action="clear-favorites">${icon("close", "xs")}Merkliste leeren</button></div></div><div class="grid three">${list.map(courseCard).join("")}</div>`
  );
}

function courseDetail(id) {
  const c = courses.find((x) => x.id === id);
  if (!c)
    return (
      pagehead("Angebot nicht gefunden") + link("Zum Gesamtangebot", "catalog")
    );
  let reg = state.registrations.find((r) => r.course === c.id);
  return (
    `<div class="breadcrumb"><a href="#catalog">Gesamtangebot</a>${icon("chevron", "xs")}<span>${c.module}</span></div>` +
    pagehead(c.title, c.desc, favButton(c, "button")) +
    `<div class="detailgrid"><section class="panel"><p class="eyebrow accent">${c.category}</p><h2>Worum es geht</h2><p class="muted">${c.desc}</p><h3 class="mt">Zielgruppe</h3><p class="muted">Mitarbeitende mit einem entsprechenden Fortbildungsbedarf im jeweiligen Zuständigkeitsbereich.</p><h3 class="mt">Inhalte und Lernziele</h3><ul class="support-list"><li>Fachliche Grundlagen auffrischen und einordnen</li><li>Typische Situationen aus dem Arbeitsalltag bearbeiten</li><li>Das Gelernte auf die eigene Aufgabe übertragen</li></ul><div class="notice mt">${icon("help")}<span>Dies ist ein Beispielangebot. Inhalte, Voraussetzungen und Genehmigungsregeln werden durch die verantwortliche Stelle gepflegt.</span></div></section><aside class="panel"><h2>Ihre Teilnahme</h2><dl class="factlist"><div><dt>Format</dt><dd>${c.type}</dd></div><div><dt>Beginn</dt><dd>${formatDate(c.date)}</dd></div><div><dt>Uhrzeit</dt><dd>${c.time}</dd></div><div><dt>Ort</dt><dd>${c.place}</dd></div><div><dt>Umfang</dt><dd>${c.duration}</dd></div><div><dt>Verfügbarkeit</dt><dd>${c.seats ? c.seats + " freie Plätze" : "Ausgebucht"}</dd></div></dl><div class="mt">${reg ? `${badge(reg.status)}<p class="small muted mt">Für dieses Angebot liegt bereits eine Registrierung vor.</p><button class="btn mt" data-action="registration" data-id="${c.id}">Registrierung ansehen</button>` : c.seats ? `<p class="small muted">${c.approval ? "Ihre Anmeldung benötigt eine Freigabe durch die zuständige Stelle." : "Für dieses Beispielangebot ist keine Genehmigung erforderlich."}</p><button class="btn mt" data-action="book" data-id="${c.id}">${c.approval ? "Teilnahme anfragen" : "Verbindlich buchen"}</button>` : `<p class="notice amber">Zurzeit sind keine Plätze verfügbar.</p><div class="mt">${btn("Bedarf melden", "need", "secondary")}</div>`}</div></aside></div>`
  );
}

function users() {
  if (state.role !== "admin")
    return restricted(
      "Die Anwenderverwaltung gehört zur Ansicht BMS-Administrator.",
      "admin",
    );
  const rows = people.filter(
    (p) =>
      p.name.toLowerCase().includes(state.userquery.toLowerCase()) &&
      (state.userstatus === "Alle Status" || p.status === state.userstatus) &&
      (state.usermodule === "Alle Module" || p.module === state.usermodule),
  );
  return (
    pagehead(
      "Anwender verwalten",
      "Konten und fachliche Berechtigungen für Nordrhein-Westfalen.",
      btn(icon("plus", "sm") + "Anwender anlegen", "create-user"),
    ) +
    `<div class="grid four">${stat(people.length, "Anwender gesamt", "Im Beispielbestand")}${stat(people.filter((p) => p.status === "Aktiv").length, "Aktive Konten", "Zur Nutzung freigegeben", "green")}${stat(people.filter((p) => p.status === "Gesperrt").length, "Gesperrte Konten", "Zugang aktuell eingeschränkt", "amber")}${stat(3, "Fachmodule", "Bildung, Einsatztraining, Sport")}</div><section class="panel"><form id="user-filter" class="filterbar"><div class="field search-field"><label for="user-q">Anwender suchen</label><input id="user-q" type="search" name="q" value="${esc(state.userquery)}" placeholder="Name eingeben"></div><div class="field"><label for="user-module">Modul</label><select id="user-module" name="module">${["Alle Module", "Bildung", "Einsatztraining", "Sport"].map((x) => `<option value="${x}" ${x === state.usermodule ? "selected" : ""}>${x}</option>`).join("")}</select></div><div class="field"><label for="user-status">Status</label><select id="user-status" name="status">${["Alle Status", "Aktiv", "Gesperrt"].map((x) => `<option value="${x}" ${x === state.userstatus ? "selected" : ""}>${x}</option>`).join("")}</select></div><button class="btn secondary">${icon("sliders", "sm")}Filtern</button></form><div class="tablewrap mobilecards"><table><caption>Anwender im Zuständigkeitsbereich</caption><thead><tr><th>Name</th><th>Organisationseinheit</th><th>Rolle / Modul</th><th>Status</th><th><span class="hidesr">Aktion</span></th></tr></thead><tbody>${rows.map((p) => `<tr><td><div class="personcell"><span class="avatar">${esc(p.initials)}</span><strong>${esc(p.name)}</strong></div></td><td data-label="Organisationseinheit">${esc(p.oe)}</td><td data-label="Rolle / Modul">${esc(p.role)}<small style="display:block">${esc(p.module)}</small></td><td data-label="Status">${badge(p.status)}</td><td><button class="textlink" data-action="edit-user" data-id="${p.id}">Bearbeiten${icon("chevron", "xs")}</button></td></tr>`).join("")}</tbody></table>${!rows.length ? `<p class="empty">Keine Anwender für diese Filter gefunden.</p>` : ""}</div><div class="tablefoot"><span role="status">${rows.length} von ${people.length} Anwendern</span><span>Seite 1 von 1</span></div></section>`
  );
}

function planning() {
  if (state.role !== "admin")
    return restricted(
      "Die Planung gehört zur Ansicht BMS-Administrator.",
      "admin",
    );

  const week = state.planningWeek === 0 ? "12. – 18. Mai 2025" : state.planningWeek < 0 ? "05. – 11. Mai 2025" : "19. – 25. Mai 2025";
  const dayLabels = ["Mo|12. Mai", "Di|13. Mai", "Mi|14. Mai", "Do|15. Mai", "Fr|16. Mai"];
  const rows = [
    {
      resource: "Raum 1",
      detail: "Seminarraum · 30 Pers.",
      icon: "grid",
      kind: "room",
      cells: [
        ["Einsatztraining", "08:00 – 12:00", "24/30", "blue"],
        null,
        ["Recht im Einsatz", "09:00 – 13:00", "18/20", "green"],
        null,
        ["Deeskalation", "09:00 – 12:00", "16/20", "blue"],
      ],
    },
    {
      resource: "Raum 2",
      detail: "Schulungsraum · 20 Pers.",
      icon: "grid",
      kind: "room",
      cells: [
        null,
        ["Kommunikation", "09:00 – 12:00", "20/20", "red", true],
        null,
        ["Führungskräfte", "09:00 – 16:00", "12/20", "purple"],
        null,
      ],
    },
    {
      resource: "Trainerin A. Müller",
      detail: "",
      icon: "users",
      kind: "trainer",
      cells: [
        ["Einsatztraining", "08:00 – 12:00", "", "blue"],
        null,
        ["Recht im Einsatz", "09:00 – 13:00", "", "green"],
        null,
        null,
      ],
    },
    {
      resource: "Trainer T. Schneider",
      detail: "",
      icon: "users",
      kind: "trainer",
      cells: [
        null,
        ["Kommunikation", "09:00 – 12:00", "", "purple"],
        null,
        null,
        ["Deeskalation", "09:00 – 12:00", "", "blue"],
      ],
    },
  ];
  const visibleRows = rows.filter((row) => state.planningFilters[row.kind === "room" ? "rooms" : "trainers"]);
  const movedTo = new Map(
    Object.entries(state.planningMoves || {}).map(([title, move]) => [
      `${move.resource}|${move.day}`,
      title,
    ]),
  );
  const eventsByTitle = new Map();
  rows.forEach((row) => row.cells.forEach((cell, day) => {
    if (cell) {
      eventsByTitle.set(cell[0], cell);
    }
  }));
  const calendarRows = visibleRows
    .map(
      (row) =>
        `<div class="planning-resource"><span class="iconbox accent">${icon(row.icon)}</span><span><strong>${row.resource}</strong>${row.detail ? `<small>${row.detail}</small>` : ""}</span></div>${row.cells
          .map((cell, day) => {
            const slot = `${row.resource}|${day}`;
            const movedTitle = movedTo.get(slot);
            let event = movedTitle ? eventsByTitle.get(movedTitle) : cell;
            const movedAway = cell && state.planningMoves?.[cell[0]];
            if (movedAway && `${movedAway.resource}|${movedAway.day}` !== slot) event = null;
            if (!event || !state.planningFilters.courses) return `<div class="planning-cell" data-resource="${esc(row.resource)}" data-day="${day}" tabindex="0" aria-label="${esc(row.resource)}, ${dayLabels[day].replace("|", " ")}: freie Ablage"></div>`;
            const [title, time, peopleCount, tone, conflict] = event;
            const moved = state.planningMoves?.[title];
            return `<div class="planning-cell" data-resource="${esc(row.resource)}" data-day="${day}" tabindex="0" aria-label="${esc(row.resource)}, ${dayLabels[day].replace("|", " ")}"><button draggable="true" class="planning-event ${tone}${conflict ? " conflict" : ""}" data-action="${conflict ? "planning-conflict" : "planning-event"}" data-title="${esc(title)}" data-time="${esc(time)}" data-resource="${esc(row.resource)}" data-day="${day}" data-people="${esc(peopleCount || "–")}" aria-grabbed="${moved ? "true" : "false"}" aria-label="${esc(title)}, ${esc(time)}, ${esc(row.resource)}${conflict ? ", Konflikt öffnen" : ""}. Zum Verschieben ziehen oder Leertaste drücken."><strong>${esc(title)}</strong><span>${esc(time)}</span>${peopleCount ? `<small>${icon("users", "xs")}${esc(peopleCount)}</small>` : ""}${conflict ? `<span class="planning-alert" aria-label="Konflikt">${icon("alert")}</span>` : ""}</button></div>`;
          })
          .join("")}`,
    )
    .join("");

  return (
    pagehead(
      "Planung",
      "Fortbildungen einfach planen. Ressourcen optimal nutzen.",
      btn(icon("plus", "sm") + "Veranstaltung planen", "planning-new"),
    ) +
    `<div class="planning-stats grid four"><div class="panel planning-stat"><span class="iconbox accent">${icon("calendar")}</span><div><span>Geplante Veranstaltungen</span><strong>5</strong><small>diese Woche</small></div></div><div class="panel planning-stat"><span class="iconbox cyan">${icon("users")}</span><div><span>Freie Plätze</span><strong>48</strong><small>von 60 insgesamt</small></div></div><div class="panel planning-stat"><span class="iconbox accent">${icon("grid")}</span><div><span>Gebuchte Räume</span><strong>3</strong><small>von 6 verfügbar</small></div></div><button class="panel planning-stat planning-stat-alert" data-action="planning-conflict"><span class="iconbox red">${icon("alert")}</span><div><span>Offene Konflikte</span><strong>1</strong><small>Jetzt lösen ${icon("arrow", "xs")}</small></div></button></div>` +
    `<div class="planning-layout"><section class="panel planning-calendar"><div class="planning-calendar-head"><div><h2>Wochenplanung</h2><p>${week}</p></div><div class="planning-controls"><button class="iconbtn" data-action="planning-prev" aria-label="Vorherige Woche">${icon("chevronleft")}</button><button class="btn secondary" data-action="planning-today">Heute</button><button class="iconbtn" data-action="planning-next" aria-label="Nächste Woche">${icon("chevron")}</button><button class="planning-range" data-action="planning-today" aria-label="Zeitraum ${week}">${icon("calendar", "sm")}${week}${icon("chevrondown", "xs")}</button></div></div><div class="planning-body"><aside class="planning-filters"><h3>Ressourcen anzeigen</h3>${[["Räume", "grid", "rooms"], ["Trainerinnen & Trainer", "users", "trainers"], ["Fortbildungen", "file", "courses"]].map(([label, i, key]) => `<label class="checkline"><input type="checkbox" data-planning-filter="${key}" ${state.planningFilters[key] ? "checked" : ""}><span>${icon(i, "sm")}${label}</span></label>`).join("")}<hr><h3>Ressourcentyp</h3><select id="planning-resource-type" aria-label="Ressourcentyp"><option ${state.planningResourceType === "Alle anzeigen" ? "selected" : ""}>Alle anzeigen</option><option ${state.planningResourceType === "Räume" ? "selected" : ""}>Räume</option><option ${state.planningResourceType === "Trainerinnen und Trainer" ? "selected" : ""}>Trainerinnen und Trainer</option></select></aside><div class="planning-grid" role="grid" aria-label="Wochenplanung ${week}"><div class="planning-corner"></div>${dayLabels.map((d) => { const [a, b] = d.split("|"); return `<div class="planning-day" role="columnheader"><strong>${a}</strong><span>${b}</span></div>`; }).join("")}${calendarRows}</div></div></section><aside class="panel planning-conflicts"><button class="planning-conflict-head" data-action="planning-conflict" aria-expanded="true"><span class="iconbox red">${icon("alert")}</span><strong>1 Konflikt gefunden</strong>${icon("chevrondown", "sm")}</button><div class="planning-conflict-body"><h3>Raumkonflikt</h3><p>Raum 2 ist am 13. Mai 2025<br>von 09:00 – 12:00 Uhr bereits belegt.</p><div class="planning-conflict-card"><strong>Kommunikation im Team</strong><span>13. Mai 2025, 09:00 – 12:00</span><small>${icon("grid", "xs")} Raum 2 · ${icon("users", "xs")} 20 Teilnehmende</small></div><h3>Vorschläge zur Lösung</h3><button class="planning-suggestion" data-action="planning-suggest">${icon("clock", "sm")}Alternative Zeit suchen</button><button class="planning-suggestion" data-action="planning-suggest">${icon("grid", "sm")}Anderen Raum wählen</button><button class="planning-suggestion" data-action="planning-solve">${icon("check", "sm")}Konflikt lösen</button><button class="textlink" data-action="planning-conflict">Details anzeigen${icon("arrow", "xs")}</button></div></aside></div>`
  );
}

function restricted(text, role) {
  return (
    pagehead("Ansicht wechseln", text) +
    `<section class="panel"><p class="muted">Wählen Sie für die Demonstration die passende Rolle. Der Wechsel simuliert eine andere Sicht und vergibt keine echten Berechtigungen.</p><button class="btn" data-action="switch-role" data-rolevalue="${role}">${roleNames[role]} ansehen</button></section>`
  );
}

function report() {
  if (state.role === "learner")
    return restricted(
      "Berichte stehen nur freigegebenen Funktionsrollen zur Verfügung.",
      "report",
    );
  const factor = state.oe === "Direktion Verkehr" ? 0.4 : 1;
  const rows = [
    ["Einsatztaktik", 800, 640],
    ["Eingriffstechniken", 640, 512],
    ["Schießen", 960, 864],
  ].map(([n, a, b]) => [n, Math.round(a * factor), Math.round(b * factor)]);
  const isExport = state.report === "Nachweise exportieren";
  return (
    pagehead(
      "Berichte & Statistiken",
      "Auswertungen für Ihren fachlichen Zuständigkeitsbereich.",
    ) +
    `<div class="reportlayout"><nav class="panel reportnav" aria-label="Berichte">${["Fachaufsichtsreport ET", ...(state.role === "admin" ? ["Nachweise exportieren"] : [])].map((x) => `<button data-action="reporttype" data-type="${x}" ${state.report === x ? 'aria-current="true"' : ""}>${x}</button>`).join("")}</nav><div class="stack"><section class="panel"><h2>${state.report}</h2><form id="report-filter" class="filterbar"><div class="field"><label for="report-oe">Organisationseinheit</label><select id="report-oe" name="oe">${["Alle zugewiesenen OE", "Direktion Verkehr"].map((x) => `<option value="${x}" ${state.oe === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><div class="field"><label for="report-year">Auswertejahr</label><select id="report-year" name="year"><option value="2026" ${state.year === "2026" ? "selected" : ""}>2026</option><option value="2027" ${state.year === "2027" ? "selected" : ""}>2027</option></select></div><button class="btn" type="submit">Auswerten</button></form><div class="notice">${icon("shield")}<span>${isExport ? "Nachweisexporte werden als Auftrag angelegt und später zum Download bereitgestellt." : "Diese Fachaufsichtssicht zeigt statistische Daten. Personenbezogene Detailansichten sind hier nicht verfügbar."}</span></div></section>${isExport ? `<section class="panel"><h2>Meine Exportaufträge</h2><p class="muted">Modul Bildung · Zeitraum ${state.year} · ${esc(state.oe)}</p>${btn("Nachweisexport anfordern", "export-job")}<div class="mt">${state.exportJobs.length ? state.exportJobs.map((j, i) => `<div class="event"><span class="iconbox accent">${icon("download")}</span><div class="event-main"><h3>Nachweisexport ${i + 1}</h3><p>${esc(j.oe)} · ${j.year}</p></div>${badge("Eingeplant")}</div>`).join("") : `<p class="small muted">Noch keine Exportaufträge vorhanden.</p>`}</div></section>` : state.year === "2027" ? `<section class="panel empty"><h2>Noch keine Trainingsdaten</h2><p>Für 2027 liegen in diesem Beispielbestand keine erfassten Trainingsstunden vor.</p></section>` : `<section class="panel"><div class="panel-head"><h2>Trainingsstunden im Überblick</h2>${badge(state.year)}</div><p class="small muted">${esc(state.oe)} · Soll und statistisch gekapptes Ist</p><div class="chart" role="img" aria-label="Trainingsstunden. Die vollständigen Werte stehen in der anschließenden Datentabelle.">${rows.map(([n, a, b]) => `<div class="chartrow"><span>${n}</span><div class="barpair"><div class="bar" style="width:${(a / (960 * factor)) * 100}%"></div><div class="bar ist" style="width:${(b / (960 * factor)) * 100}%"></div></div><strong>${b} h</strong></div>`).join("")}</div><div class="chartlegend"><span><i></i>Soll</span><span><i class="blue"></i>Ist</span></div><div class="tablewrap mt"><table><caption>Trainingsstunden als Datentabelle</caption><thead><tr><th>Fachbereich</th><th>Soll</th><th>Ist</th><th>Erfüllung</th></tr></thead><tbody>${rows.map(([n, a, b]) => `<tr><td>${n}</td><td>${a} h</td><td>${b} h</td><td>${Math.round((b / a) * 100)} %</td></tr>`).join("")}</tbody></table></div><button class="textlink mt" data-action="csv">${icon("download", "sm")}Beispieldaten als CSV</button></section>`}</div></div>`
  );
}

function learning() {
  const steps = [
    ["Grundlagen", "Nachweis vorhanden"],
    ["Wissen vertiefen", "E-Learning gebucht"],
    ["In der Praxis anwenden", "Präsenztermin gebucht"],
  ];
  const details = [
    {
      title: "Grundlagen der Kommunikation",
      text: "Ihre Teilnahme ist abgeschlossen. Der Nachweis ist in Mein iBMS hinterlegt.",
      tag: "Abgeschlossen",
      action: "Nachweis ansehen",
      act: "certificate",
    },
    {
      title: "Datenschutz im Polizeialltag",
      text: "Öffnen Sie die zugehörige Lernmaßnahme im angebundenen Lernmanagementsystem.",
      tag: "Gebucht",
      action: "E-Learning starten",
      act: "lms",
    },
    {
      title: "Deeskalation in der Praxis",
      text: "Ihre Präsenzveranstaltung ist gebucht. Prüfen Sie die Veranstaltungsdetails und organisatorischen Hinweise.",
      tag: "Gebucht",
      action: "Veranstaltungsdetails",
      act: "path-event",
    },
  ];
  let d = details[state.lesson];
  return `<div class="learning-banner"><p class="eyebrow">Kommunikation & Handlungskompetenz</p><h1 id="page-title" tabindex="-1">Deeskalation im Einsatz</h1><p>Persönliche Übersicht zu Ihren Fortbildungsangeboten</p></div><div class="pathlayout"><nav class="panel pathnav" aria-label="Schritte im Lernpfad"><h3>Ihr Weg im Überblick</h3><p class="small muted">1 von 3 Schritten abgeschlossen</p><div class="progress" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="3" aria-label="Abgeschlossene Schritte"><span style="width:33.33%"></span></div>${steps.map(([h, n], i) => `<button class="pathstep ${i === 0 ? "done" : ""} ${state.lesson === i ? "active" : ""}" data-action="lesson" data-id="${i}" ${state.lesson === i ? 'aria-current="step"' : ""}><strong>${h}</strong><small>${n}</small></button>`).join("")}</nav><section class="panel"><div class="panel-head"><p class="eyebrow" style="margin:0">Schritt ${state.lesson + 1} von 3</p>${badge(d.tag)}</div><h2>${d.title}</h2><p class="muted">${d.text}</p><div class="lesson"><span class="stepnumber ${state.lesson === 0 ? "done" : ""}">${icon(state.lesson === 0 ? "check" : "book", "sm")}</span><div><h3>${state.lesson === 0 ? "Ihr Nachweis" : state.lesson === 1 ? "Lernen im angeschlossenen LMS" : "Ihr Präsenztermin"}</h3><p>${state.lesson === 0 ? "Abgeschlossen am 08.09.2026 · Modul Bildung" : state.lesson === 1 ? "90 Minuten · Zeitlich flexibel · Registrierung bestätigt" : "15.10.2026 · 09:00–16:00 Uhr · Fortbildungszentrum NRW"}</p><button class="btn" data-action="${d.act}">${d.action}${icon(d.act === "lms" ? "external" : "arrow", "sm")}</button></div></div><h3 class="mt">Ihre Unterlagen</h3><button class="textlink" data-action="path-info">${icon("file", "sm")}Organisatorische Hinweise</button></section></div><p class="small muted">Gestaltungsvorschlag: Der Lernpfad bündelt Registrierungen, LMS-Einstiege und Nachweise. Er ist kein zusätzlich zugesagtes LMS-Modul.</p>`;
}

function article() {
  return `<div class="breadcrumb"><a href="#home">Startseite</a>${icon("chevron", "xs")}<span>Aktuelles</span></div><div class="article-cover" role="img" aria-label="Abstraktes Bildmotiv der Wissensplattform"></div><div class="articletext"><p class="eyebrow accent">Fortbildungsplanung · Beispielbeitrag</p>${pagehead("Fortbildungsplanung gemeinsam gestalten", "16. September 2026 · Fortbildungsorganisation")}<p>Welche Kompetenzen möchten Sie vertiefen? Ihre Bedarfsmeldungen helfen der zuständigen Stelle, das Fortbildungsangebot zu planen.</p><h2>Bedarf melden</h2><p>In Mein iBMS können Sie einen Bedarf zu einem bestehenden Angebot erfassen und dessen Bearbeitungsstand verfolgen. Nutzen Sie für einen individuellen Wunsch den Bereich Fortbildungswünsche.</p><h2>Was danach passiert</h2><p>Ihre zuständige Stelle prüft die Meldung. Rückmeldungen und Statusänderungen erscheinen in Ihrer persönlichen Übersicht.</p>${link("Zu Mein iBMS", "dashboard")}</div>`;
}

function help() {
  return (
    pagehead("Hilfe & Kontakt", "Antworten für Ihren nächsten Schritt.") +
    `<div class="grid split"><section class="panel"><h2>Häufige Fragen</h2>${[
      [
        "Wie melde ich mich zu einer Veranstaltung an?",
        "Öffnen Sie das Gesamtangebot, wählen Sie eine Veranstaltung und prüfen Sie die Details. Je nach Regelung können Sie direkt buchen oder eine Teilnahme anfragen.",
      ],
      [
        "Wo finde ich meine Nachweise?",
        "Öffnen Sie Mein iBMS und wählen Sie Nachweise. Dort finden Sie Ihre dokumentierten Teilnahmen.",
      ],
      [
        "Warum sehe ich nicht alle Verwaltungsfunktionen?",
        "Die Oberfläche richtet sich nach Ihrer fachlichen Rolle und Ihrem Zuständigkeitsbereich. In diesem Entwurf können Sie über „Ansicht im Clickdummy“ weitere Rollen demonstrieren.",
      ],
      [
        "Wo bearbeite ich meine E-Learning-Inhalte?",
        "iBMS öffnet die zugehörige Lernmaßnahme im angebundenen LMS. Die Bearbeitung der Lerninhalte erfolgt dort.",
      ],
    ]
      .map(
        ([q, a]) =>
          `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`,
      )
      .join(
        "",
      )}</section><aside class="panel"><h2>Ihre Ansprechstelle</h2><p class="muted">Bei fachlichen Fragen wenden Sie sich an Ihre zuständige Fortbildungsstelle. Für technische Anliegen steht Ihnen der lokale Support zur Verfügung.</p><p class="small muted"><strong>Technischer Dienstleister:</strong> LZPD NRW</p>${btn("Kontaktanfrage vorbereiten", "contact", "secondary")}<div class="notice mt">${icon("help")}<span>Im Clickdummy werden keine Nachrichten versendet.</span></div></aside></div>`
  );
}
