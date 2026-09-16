// 06-views.js - One function per route. Each returns an HTML string.

"use strict";

function home() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">${t("Nationale Kooperation POLIZEI-ONLINE")}</p><h1 id="page-title" tabindex="-1">${t("Willkommen bei")}<br><strong>POLIZEI-ONLINE.</strong></h1><p>${t("Finden Sie passende Angebote und behalten Sie Ihre nächsten Schritte im Blick.")}</p><form id="home-search" class="home-search"><label class="hidesr" for="home-q">${t("Angebote suchen")}</label><input id="home-q" name="q" placeholder="${t("Was möchten Sie lernen?")}" type="search"><button aria-label="${t("Angebote suchen")}">${icon("search")}</button></form></div><div class="hero-art"><div class="hero-caption"><small>${t("Fortbildung im Fokus")}</small><h3>${t("Kompetenz entwickeln.")}<br>${t("Wissen im Dienst anwenden.")}</h3>${link(t("Gesamtangebot entdecken"), "catalog", "textlink")}</div></div></section><nav class="quicklinks" aria-label="${t("Schnelleinstiege")}">${[
    ["dashboard", "grid", "Mein iBMS", "Termine und Nachweise"],
    ["catalog", "book", "Gesamtangebot", "Bildung, ET und Sport"],
    ["lastminute", "clock", "Last Minute", "Kurzfristig freie Plätze"],
    ["learning", "route", "Mein Lernpfad", "Die nächsten Schritte"],
  ]
    .map(
      ([r, i, h, d]) =>
        `<a class="quick" href="#${r}"><span class="quick-icon">${icon(i)}</span><span><strong>${t(h)}</strong><small>${t(d)}</small></span></a>`,
    )
    .join(
      "",
    )}</nav><div class="sectionhead"><h2>${t("Neue Perspektiven für Ihren Alltag")}</h2>${link(t("Alle Angebote"), "catalog", "textlink")}</div><div class="grid three">${courses.slice(0, 3).map(courseCard).join("")}</div><div class="grid two mt"><section class="panel"><div class="panel-head"><h2>${t("Aktuelles aus der Fortbildung")}</h2></div><div class="newsrow"><time>16.09.2026</time><div><h3><a href="#article">${t("Fortbildungsplanung gemeinsam gestalten")}</a></h3><p>${t("Melden Sie Ihren Bedarf für das kommende Fortbildungsjahr.")}</p></div></div><div class="newsrow"><time>14.09.2026</time><div><h3><a href="#help">${t("Gut ankommen in iBMS 3.0")}</a></h3><p>${t("Antworten zu Registrierung, Nachweisen und persönlicher Übersicht.")}</p></div></div></section><section class="panel"><p class="eyebrow">${t("Für Sie persönlich")}</p><h2>${t("Ihr nächster Termin")}</h2><h3>${t("Deeskalation im Einsatz")}</h3><p class="muted">${t("15. Oktober · 09:00 Uhr")}<br>${t("Fortbildungszentrum NRW")}</p>${link(t("Meine Registrierungen"), "dashboard", "textlink")}</section></div>`;
}

function eventRow(reg) {
  const c = courses.find((c) => c.id === reg.course);
  return `<div class="event"><div class="date"><strong>${c.day}</strong><small>${t(c.month)}</small></div><div class="event-main"><h3>${t(c.title)}</h3><p>${t(c.time)} · ${t(c.type)}</p></div><div class="event-action">${badge(reg.status)}<button class="textlink" data-action="registration" data-id="${c.id}">Details ${icon("chevron")}</button></div></div>`;
}

function stat(n, label, detail = "", tone = "") {
  return `<div class="stat"><h3>${label}</h3><span class="number ${tone}">${n}</span><p>${detail}</p></div>`;
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
    body = `<div class="grid two"><section class="panel"><div class="panel-head"><h2>${t("Meine nächsten Veranstaltungen")}</h2>${badge(state.registrations.length + " " + t("Einträge"))}</div>${state.registrations.length ? state.registrations.map(eventRow).join("") : `<p class="empty">${t("Noch keine Registrierungen vorhanden.")}</p>`}</section><div class="grid"><section class="panel"><p class="eyebrow">${t("Nächster Schritt")}</p><h2>${state.wishDone ? t("Vielen Dank für Ihre Rückmeldung") : t("Ihr Fortbildungswunsch")}</h2><div class="task">${badge(state.wishDone ? "Ergänzt" : "Rückmeldung offen")}<h3 class="mt">${t("Gesprächsführung und Konfliktklärung")}</h3><p>${state.wishDone ? t("Ihre Ergänzung steht in diesem Entwurf zur fachlichen Prüfung bereit.") : t("Bitte ergänzen Sie die Begründung für Ihren Fortbildungswunsch.")}</p>${state.wishDone ? "" : btn(t("Begründung ergänzen"), "wish", "secondary")}</div></section><section class="panel"><h2>${t("Ihre persönliche Entwicklung")}</h2><p class="muted">${t("Registrierungen, Lernangebote und Nachweise in einer Übersicht.")}</p>${link(t("Lernpfad öffnen"), "learning", "textlink")}</section></div></div>`;
  else if (state.mytab === "Nachweise")
    body = `<section class="panel"><div class="panel-head"><h2>${t("Meine Nachweise")}</h2></div><div class="tablewrap mobilecards"><table><thead><tr><th>${t("Fortbildung")}</th><th>${t("Datum")}</th><th>${t("Modul")}</th><th>${t("Aktion")}</th></tr></thead><tbody>${[
      ["Grundlagen der Kommunikation", "08.09.2026", "Bildung"],
      ["Funktionelles Training", "03.09.2026", "Sport"],
    ]
      .map(
        (d) =>
          `<tr><td><strong>${t(d[0])}</strong></td><td data-label="${t("Datum")}">${d[1]}</td><td data-label="${t("Modul")}">${t(d[2])}</td><td><button class="textlink" data-action="certificate">${icon("file")}${t("Nachweis ansehen")}</button></td></tr>`,
      )
      .join("")}</tbody></table></div></section>`;
  else if (state.mytab === "Fertigkeiten")
    body = `<section class="panel"><h2>${t("Meine Fertigkeiten")}</h2><div class="event"><span class="quick-icon">${icon("shield")}</span><div class="event-main"><h3>${t("Kommunikation und Gesprächsführung")}</h3><p>${t("Modul Bildung · Gültig bis 08.09.2027")}</p></div>${badge("Gültig")}</div><div class="notice mt">${icon("help")}<span>${t("Gültigkeitszeiträume und Zuweisungen folgen den Regeln des jeweiligen Moduls.")}</span></div></section>`;
  else
    body = `<section class="panel"><div class="panel-head"><h2>${t("Meine")} ${t(state.mytab)}</h2>${btn(t("Neu erfassen"), "need", "secondary")}</div><div class="event"><span class="quick-icon">${icon("book")}</span><div class="event-main"><h3>${t("Gesprächsführung und Konfliktklärung")}</h3><p>${t("Bildung · Für das Fortbildungsjahr 2027")}</p></div>${badge(state.wishDone ? "Ergänzt" : "In Prüfung")}</div>${state.needs.map((n) => `<div class="event"><span class="quick-icon">${icon("file")}</span><div class="event-main"><h3>${esc(n)}</h3><p>${t("Neue Bedarfsmeldung")}</p></div>${badge("Erfasst")}</div>`).join("")}<p class="muted small mt">${t("Den Bearbeitungsstand und Rückmeldungen Ihrer zuständigen Stelle sehen Sie hier.")}</p></section>`;
  return (
    pagehead(
      t("Mein iBMS"),
      t(
        "Guten Morgen, Maria. Hier finden Sie Ihre persönliche Fortbildungsübersicht.",
      ),
    ) +
    `<div class="grid four">${stat(state.registrations.filter((r) => r.status === "Gebucht").length, t("Gebuchte Veranstaltungen"), t("Ihre bestätigten Termine"))}${stat(state.wishDone ? 0 : 1, t("Offene Rückmeldungen"), t("Von Ihnen zu ergänzen"), "amber")}${stat(2, t("Nachweise"), t("Für absolvierte Fortbildungen"), "green")}${stat(1, t("Fertigkeiten"), t("Aktuell gültig"))}</div><nav class="tabs" aria-label="${t("Mein iBMS Bereiche")}">${tabs.map((x) => `<button class="tab" data-action="mytab" data-tab="${x}" ${state.mytab === x ? 'aria-current="true"' : ""}>${t(x)}</button>`).join("")}</nav>${body}`
  );
}

function catalog(last = false) {
  const filtered = courses.filter(
    (c) =>
      (!last || (c.seats > 0 && c.seats <= 5)) &&
      (state.module === "Alle Module" || c.module === state.module) &&
      (state.type === "Alle Formate" || c.type === state.type) &&
      (c.title + " " + c.category + " " + t(c.title) + " " + t(c.category))
        .toLowerCase()
        .includes(state.query.toLowerCase()),
  );
  return (
    pagehead(
      last ? t("Last Minute") : t("Gesamtangebot"),
      last
        ? t(
            "Kurzfristig verfügbare Plätze in Bildung, Einsatztraining und Sport.",
          )
        : t(
            "Fortbildungen finden, Details prüfen und die Teilnahme organisieren.",
          ),
    ) +
    `<form id="catalog-filter" class="filterbar"><div class="field search-field"><label for="catalog-q">${t("Angebot oder Thema")}</label><input id="catalog-q" name="q" type="search" value="${esc(state.query)}" placeholder="${t("z. B. Kommunikation")}"></div><div class="field"><label for="module">${t("Modul")}</label><select id="module" name="module">${["Alle Module", "Bildung", "Einsatztraining", "Sport"].map((x) => `<option value="${x}" ${state.module === x ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><div class="field"><label for="format">${t("Format")}</label><select id="format" name="type">${["Alle Formate", "Präsenz", "E-Learning"].map((x) => `<option value="${x}" ${state.type === x ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><button class="btn" type="submit">${icon("search")}${t("Suchen")}</button></form><div class="sectionhead"><p class="muted small" role="status">${filtered.length} ${t("passende Angebote")}</p><button class="textlink" data-action="save-search">${t("Suche merken")}</button></div>${filtered.length ? `<div class="grid three">${filtered.map(courseCard).join("")}</div>` : `<div class="panel empty"><h2>${t("Keine passenden Angebote")}</h2><p>${t("Ändern Sie den Suchbegriff oder setzen Sie die Filter zurück.")}</p>${btn(t("Filter zurücksetzen"), "reset-filter", "secondary")}</div>`}`
  );
}

function courseDetail(id) {
  const c = courses.find((x) => x.id === id);
  if (!c)
    return (
      pagehead(t("Angebot nicht gefunden")) +
      link(t("Zum Gesamtangebot"), "catalog")
    );
  let reg = state.registrations.find((r) => r.course === c.id);
  return (
    `<div class="breadcrumb"><a href="#catalog">${t("Gesamtangebot")}</a>${icon("chevron")}<span>${t(c.module)}</span></div>` +
    pagehead(t(c.title), t(c.desc)) +
    `<div class="detailgrid"><section class="panel"><p class="eyebrow">${t(c.category)}</p><h2>${t("Worum es geht")}</h2><p>${t(c.desc)}</p><h3 class="mt">${t("Zielgruppe")}</h3><p class="muted">${t("Mitarbeitende mit einem entsprechenden Fortbildungsbedarf im jeweiligen Zuständigkeitsbereich.")}</p><h3 class="mt">${t("Inhalte und Lernziele")}</h3><ul class="support-list"><li>${t("Fachliche Grundlagen auffrischen und einordnen")}</li><li>${t("Typische Situationen aus dem Arbeitsalltag bearbeiten")}</li><li>${t("Das Gelernte auf die eigene Aufgabe übertragen")}</li></ul><div class="notice mt">${icon("help")}<span>${t("Dies ist ein Beispielangebot. Inhalte, Voraussetzungen und Genehmigungsregeln werden durch die verantwortliche Stelle gepflegt.")}</span></div></section><aside class="panel"><h2>${t("Ihre Teilnahme")}</h2><dl class="factlist"><div><dt>${t("Format")}</dt><dd>${t(c.type)}</dd></div><div><dt>${t("Beginn")}</dt><dd>${formatDate(c.date)}</dd></div><div><dt>${t("Uhrzeit")}</dt><dd>${t(c.time)}</dd></div><div><dt>${t("Ort")}</dt><dd>${t(c.place)}</dd></div><div><dt>${t("Umfang")}</dt><dd>${t(c.duration)}</dd></div><div><dt>${t("Verfügbarkeit")}</dt><dd>${c.seats ? c.seats + " " + t("freie Plätze") : t("Ausgebucht")}</dd></div></dl><div class="mt">${reg ? `${badge(reg.status)}<p class="small muted mt">${t("Für dieses Angebot liegt bereits eine Registrierung vor.")}</p><button class="btn" data-action="registration" data-id="${c.id}">${t("Registrierung ansehen")}</button>` : c.seats ? `<p class="small muted">${c.approval ? t("Ihre Anmeldung benötigt eine Freigabe durch die zuständige Stelle.") : t("Für dieses Beispielangebot ist keine Genehmigung erforderlich.")}</p><button class="btn" data-action="book" data-id="${c.id}">${c.approval ? t("Teilnahme anfragen") : t("Verbindlich buchen")}</button>` : `<p class="notice amber">${t("Zurzeit sind keine Plätze verfügbar.")}</p>${btn(t("Bedarf melden"), "need", "secondary")}`}</div></aside></div>`
  );
}

function users() {
  if (state.role !== "admin")
    return restricted(
      t("Die Anwenderverwaltung gehört zur Ansicht BMS-Administrator."),
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
      t("Anwender verwalten"),
      t("Konten und fachliche Berechtigungen für Nordrhein-Westfalen."),
      btn(icon("plus") + t("Anwender anlegen"), "create-user"),
    ) +
    `<div class="grid four mb">${stat(people.length, t("Anwender gesamt"), t("Im Beispielbestand"))}${stat(people.filter((p) => p.status === "Aktiv").length, t("Aktive Konten"), t("Zur Nutzung freigegeben"), "green")}${stat(people.filter((p) => p.status === "Gesperrt").length, t("Gesperrte Konten"), t("Zugang aktuell eingeschränkt"), "amber")}${stat(3, t("Fachmodule"), t("Bildung, Einsatztraining, Sport"))}</div><section class="panel"><form id="user-filter" class="filterbar"><div class="field search-field"><label for="user-q">${t("Anwender suchen")}</label><input id="user-q" type="search" name="q" value="${esc(state.userquery)}" placeholder="${t("Name eingeben")}"></div><div class="field"><label for="user-module">${t("Modul")}</label><select id="user-module" name="module">${["Alle Module", "Bildung", "Einsatztraining", "Sport"].map((x) => `<option value="${x}" ${x === state.usermodule ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><div class="field"><label for="user-status">${t("Status")}</label><select id="user-status" name="status">${["Alle Status", "Aktiv", "Gesperrt"].map((x) => `<option value="${x}" ${x === state.userstatus ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><button class="btn secondary">${t("Filtern")}</button></form><div class="tablewrap mobilecards"><table><caption>${t("Anwender im Zuständigkeitsbereich")}</caption><thead><tr><th>${t("Name")}</th><th>${t("Organisationseinheit")}</th><th>${t("Rolle / Modul")}</th><th>${t("Status")}</th><th><span class="hidesr">${t("Aktion")}</span></th></tr></thead><tbody>${rows.map((p) => `<tr><td><div class="personcell"><span class="avatar">${esc(p.initials)}</span><strong>${esc(p.name)}</strong></div></td><td data-label="${t("Organisationseinheit")}">${esc(t(p.oe))}</td><td data-label="${t("Rolle / Modul")}">${esc(t(p.role))}<small style="display:block">${esc(t(p.module))}</small></td><td data-label="${t("Status")}">${badge(p.status)}</td><td><button class="textlink" data-action="edit-user" data-id="${p.id}">${t("Bearbeiten")} ${icon("chevron")}</button></td></tr>`).join("")}</tbody></table>${!rows.length ? `<p class="empty">${t("Keine Anwender für diese Filter gefunden.")}</p>` : ""}</div><div class="tablefoot"><span role="status">${rows.length} ${t("von")} ${people.length} ${t("Anwendern")}</span><span>${t("Seite 1 von 1")}</span></div></section>`
  );
}

function restricted(text, role) {
  return (
    pagehead(t("Ansicht wechseln"), text) +
    `<section class="panel"><p>${t("Wählen Sie für die Demonstration die passende Rolle. Der Wechsel simuliert eine andere Sicht und vergibt keine echten Berechtigungen.")}</p><button class="btn" data-action="switch-role" data-rolevalue="${role}">${t(roleNames[role])} ${t("ansehen")}</button></section>`
  );
}

function report() {
  if (state.role === "learner")
    return restricted(
      t("Berichte stehen nur freigegebenen Funktionsrollen zur Verfügung."),
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
      t("Berichte & Statistiken"),
      t("Auswertungen für Ihren fachlichen Zuständigkeitsbereich."),
    ) +
    `<div class="reportlayout"><nav class="panel reportnav" aria-label="${t("Berichte")}">${["Fachaufsichtsreport ET", ...(state.role === "admin" ? ["Nachweise exportieren"] : [])].map((x) => `<button data-action="reporttype" data-type="${x}" ${state.report === x ? 'aria-current="true"' : ""}>${t(x)}</button>`).join("")}</nav><div><section class="panel"><h2>${t(state.report)}</h2><form id="report-filter" class="filterbar"><div class="field"><label for="report-oe">${t("Organisationseinheit")}</label><select id="report-oe" name="oe">${["Alle zugewiesenen OE", "Direktion Verkehr"].map((x) => `<option value="${x}" ${state.oe === x ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><div class="field"><label for="report-year">${t("Auswertejahr")}</label><select id="report-year" name="year"><option value="2026" ${state.year === "2026" ? "selected" : ""}>2026</option><option value="2027" ${state.year === "2027" ? "selected" : ""}>2027</option></select></div><button class="btn" type="submit">${t("Auswerten")}</button></form><div class="notice">${icon("shield")}<span>${isExport ? t("Nachweisexporte werden als Auftrag angelegt und später zum Download bereitgestellt.") : t("Diese Fachaufsichtssicht zeigt statistische Daten. Personenbezogene Detailansichten sind hier nicht verfügbar.")}</span></div></section>${isExport ? `<section class="panel mt"><h2>${t("Meine Exportaufträge")}</h2><p class="muted">${t("Modul")} ${t("Bildung")} · ${t("Zeitraum")} ${state.year} · ${esc(t(state.oe))}</p>${btn(t("Nachweisexport anfordern"), "export-job")}<div class="mt">${state.exportJobs.length ? state.exportJobs.map((j, i) => `<div class="event"><div class="event-main"><h3>${t("Nachweisexport")} ${i + 1}</h3><p>${esc(t(j.oe))} · ${j.year}</p></div>${badge("Eingeplant")}</div>`).join("") : `<p class="small muted">${t("Noch keine Exportaufträge vorhanden.")}</p>`}</div></section>` : state.year === "2027" ? `<section class="panel empty mt"><h2>${t("Noch keine Trainingsdaten")}</h2><p>${t("Für 2027 liegen in diesem Beispielbestand keine erfassten Trainingsstunden vor.")}</p></section>` : `<section class="panel mt"><div class="panel-head"><h2>${t("Trainingsstunden im Überblick")}</h2>${badge(state.year)}</div><p class="small muted">${esc(t(state.oe))} · ${t("Soll und statistisch gekapptes Ist")}</p><div class="chart" role="img" aria-label="${t("Trainingsstunden. Die vollständigen Werte stehen in der anschließenden Datentabelle.")}">${rows.map(([n, a, b]) => `<div class="chartrow"><span>${t(n)}</span><div class="barpair"><div class="bar" style="width:${(a / (960 * factor)) * 100}%"></div><div class="bar ist" style="width:${(b / (960 * factor)) * 100}%"></div></div><strong>${b} h</strong></div>`).join("")}</div><div class="chartlegend"><span><i></i>${t("Soll")}</span><span><i class="blue"></i>${t("Ist")}</span></div><div class="tablewrap mt"><table><caption>${t("Trainingsstunden als Datentabelle")}</caption><thead><tr><th>${t("Fachbereich")}</th><th>${t("Soll")}</th><th>${t("Ist")}</th><th>${t("Erfüllung")}</th></tr></thead><tbody>${rows.map(([n, a, b]) => `<tr><td>${t(n)}</td><td>${a} h</td><td>${b} h</td><td>${Math.round((b / a) * 100)} %</td></tr>`).join("")}</tbody></table></div><button class="textlink mt" data-action="csv">${icon("download")}${t("Beispieldaten als CSV")}</button></section>`}</div></div>`
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
  return (
    pagehead(t("Mein Lernpfad"), t("Ihre Fortbildung Schritt für Schritt.")) +
    `<div class="learning-banner"><p class="eyebrow">${t("Kommunikation & Handlungskompetenz")}</p><h2>${t("Deeskalation im Einsatz")}</h2><p>${t("Persönliche Übersicht zu Ihren Fortbildungsangeboten")}</p></div><div class="pathlayout"><nav class="panel pathnav" aria-label="${t("Schritte im Lernpfad")}"><h3>${t("Ihr Weg im Überblick")}</h3><p class="small muted">${t("1 von 3 Schritten abgeschlossen")}</p><div class="progress" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="3" aria-label="${t("Abgeschlossene Schritte")}"><span style="width:33.33%"></span></div>${steps.map(([h, n], i) => `<button class="pathstep ${i === 0 ? "done" : ""} ${state.lesson === i ? "active" : ""}" data-action="lesson" data-id="${i}" ${state.lesson === i ? 'aria-current="step"' : ""}><strong>${i === 0 ? "✓" : i + 1 + "."} ${t(h)}</strong><small>${t(n)}</small></button>`).join("")}</nav><section class="panel"><div class="panel-head"><p class="eyebrow" style="margin:0">${t("Schritt")} ${state.lesson + 1} ${t("von")} 3</p>${badge(d.tag)}</div><h2 style="font-size:2rem">${t(d.title)}</h2><p class="muted">${t(d.text)}</p><div class="lesson"><span class="stepnumber ${state.lesson === 0 ? "done" : ""}">${icon(state.lesson === 0 ? "check" : "book")}</span><div><h3>${state.lesson === 0 ? t("Ihr Nachweis") : state.lesson === 1 ? t("Lernen im angeschlossenen LMS") : t("Ihr Präsenztermin")}</h3><p>${state.lesson === 0 ? t("Abgeschlossen am 08.09.2026 · Modul Bildung") : state.lesson === 1 ? t("90 Minuten · Zeitlich flexibel · Registrierung bestätigt") : t("15.10.2026 · 09:00–16:00 Uhr · Fortbildungszentrum NRW")}</p><button class="btn" data-action="${d.act}">${t(d.action)}${icon("arrow")}</button></div></div><h3 class="mt">${t("Ihre Unterlagen")}</h3><button class="textlink" data-action="path-info">${icon("file")}${t("Organisatorische Hinweise")}</button></section></div><p class="small muted mt">${t("Gestaltungsvorschlag: Der Lernpfad bündelt Registrierungen, LMS-Einstiege und Nachweise. Er ist kein zusätzlich zugesagtes LMS-Modul.")}</p>`
  );
}

function article() {
  return `<div class="breadcrumb"><a href="#home">${t("Startseite")}</a>${icon("chevron")}<span>${t("Aktuelles")}</span></div><div class="article-cover" role="img" aria-label="${t("Abstraktes Bildmotiv der Wissensplattform")}"></div><div class="articletext"><p class="eyebrow">${t("Fortbildungsplanung · Beispielbeitrag")}</p>${pagehead(t("Fortbildungsplanung gemeinsam gestalten"), t("16. September 2026 · Fortbildungsorganisation"))}<p>${t("Welche Kompetenzen möchten Sie vertiefen? Ihre Bedarfsmeldungen helfen der zuständigen Stelle, das Fortbildungsangebot zu planen.")}</p><h2>${t("Bedarf melden")}</h2><p>${t("In Mein iBMS können Sie einen Bedarf zu einem bestehenden Angebot erfassen und dessen Bearbeitungsstand verfolgen. Nutzen Sie für einen individuellen Wunsch den Bereich Fortbildungswünsche.")}</p><h2>${t("Was danach passiert")}</h2><p>${t("Ihre zuständige Stelle prüft die Meldung. Rückmeldungen und Statusänderungen erscheinen in Ihrer persönlichen Übersicht.")}</p>${link(t("Zu Mein iBMS"), "dashboard")}</div>`;
}

function help() {
  return (
    pagehead(t("Hilfe & Kontakt"), t("Antworten für Ihren nächsten Schritt.")) +
    `<div class="grid two"><section class="panel"><h2>${t("Häufige Fragen")}</h2>${[
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
          `<details class="faq"><summary>${t(q)}</summary><p>${t(a)}</p></details>`,
      )
      .join(
        "",
      )}</section><aside class="panel"><h2>${t("Ihre Ansprechstelle")}</h2><p class="muted">${t("Bei fachlichen Fragen wenden Sie sich an Ihre zuständige Fortbildungsstelle. Für technische Anliegen steht Ihnen der lokale Support zur Verfügung.")}</p>${btn(t("Kontaktanfrage vorbereiten"), "contact", "secondary")}<div class="notice mt">${icon("help")}<span>${t("Im Clickdummy werden keine Nachrichten versendet.")}</span></div></aside></div>`
  );
}
