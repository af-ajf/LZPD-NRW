// 08-actions.js - Click and submit delegation, CSV export, bootstrap.

"use strict";

let pendingUser = null;

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-action]");
  if (!a) return;
  const action = a.dataset.action,
    id = Number(a.dataset.id);
  switch (action) {
    case "close":
      close();
      break;
    // Back out of a detail route. Falls back to the tab the route belongs to,
    // so a cold start on #course/3 still lands somewhere sensible.
    case "back":
      if (history.length > 1) history.back();
      else location.hash = location.hash.startsWith("#course") ? "catalog" : "home";
      break;
    case "setlang":
      if (state.lang !== a.dataset.langValue) setLang(a.dataset.langValue);
      break;
    // Hero chips: jump into the catalogue with the filter already applied.
    case "chip":
      if (a.dataset.kind === "module") {
        state.module = a.dataset.value;
        state.type = "Alle Formate";
        state.query = "";
        if (location.hash === "#catalog") render(false);
        else location.hash = "catalog";
      } else {
        location.hash = "lastminute";
      }
      break;
    // Stat cards link to #dashboard; pick the tab they stand for on the way.
    case "stat-link":
      state.mytab = a.dataset.tab;
      break;
    case "menu":
      modal(
        t("Menü"),
        `<nav class="menu-links" aria-label="${t("Mobile Navigation")}">${navItems()
          .map(
            ([r, n, i]) =>
              `<a href="#${r}" ${location.hash === "#" + r ? 'aria-current="page"' : ""}>${icon(i)}${t(n)}</a>`,
          )
          .join(
            "",
          )}<a href="#help">${icon("help")}${t("Hilfe & Kontakt")}</a><a href="#login">${icon("logout")}${t("Abmelden")}</a></nav>${demoBox("mobile")}<p class="small mt">${t("Interaktiver Entwurf · Beispieldaten")}</p>`,
        "mobile-nav-dialog",
      );
      break;
    case "notifications":
      modal(
        t("Benachrichtigungen"),
        `<div class="event"><span class="iconbox accent">${icon("calendar")}</span><div class="event-main"><h3>${t("Teilnahme bestätigt")}</h3><p>${t("Deeskalation im Einsatz")} · 15.10.2026</p><a class="textlink" href="#dashboard">${t("Meine Registrierungen öffnen")}${icon("arrow", "xs")}</a></div></div><div class="event"><span class="iconbox">${icon("file")}</span><div class="event-main"><h3>${t("Nachweis verfügbar")}</h3><p>${t("Grundlagen der Kommunikation")}</p><button class="textlink" data-action="certificate">${t("Nachweis ansehen")}${icon("arrow", "xs")}</button></div></div>`,
      );
      break;
    case "profile":
      modal(
        t("Ihr Profil"),
        `<h3>Maria Beispiel</h3><dl class="factlist"><div><dt>${t("Organisation")}</dt><dd>${t("Polizei NRW")}</dd></div><div><dt>${t("Organisationseinheit")}</dt><dd>${t("Direktion Zentrale Aufgaben")}</dd></div><div><dt>${t("Demoansicht")}</dt><dd>${t(roleNames[state.role])}</dd></div></dl>${profileExtras()}<div class="dialog-actions"><a class="btn secondary" href="#login">${t("Abmelden")}</a></div>`,
        "profile-sheet",
      );
      break;
    case "search":
      modal(
        t("Angebote suchen"),
        `<form id="modal-search"><div class="field"><label for="modal-q">${t("Angebot oder Thema")}</label><input id="modal-q" name="q" type="search" placeholder="${t("z. B. Deeskalation")}" autofocus></div><button class="btn" type="submit">${t("Gesamtangebot durchsuchen")}</button></form>`,
      );
      break;
    case "mytab":
      state.mytab = a.dataset.tab;
      render(false);
      document.querySelector(`[data-tab="${state.mytab}"]`)?.focus();
      break;
    case "reset-filter":
      state.query = "";
      state.module = "Alle Module";
      state.type = "Alle Formate";
      render();
      break;
    case "save-search":
      state.savedSearches.push({
        q: state.query,
        module: state.module,
        type: state.type,
      });
      toast(t("Ihre Suchauswahl wurde für diese Demonstration gemerkt."));
      break;
    // Marking a course re-renders: the card, the sidebar count and the
    // watchlist itself all show the new state. Focus is put back on the
    // button that was pressed, unless un-marking removed it from the page.
    case "fav": {
      const on = toggleFavorite(id);
      render(false);
      document
        .querySelector(`[data-action="fav"][data-id="${id}"]`)
        ?.focus({ preventScroll: true });
      toast(
        on
          ? t("Angebot auf Ihrer Merkliste gespeichert.")
          : t("Angebot von Ihrer Merkliste entfernt."),
      );
      break;
    }
    case "clear-favorites":
      modal(
        t("Merkliste leeren?"),
        `<p>${t("Alle gemerkten Angebote werden von Ihrer Merkliste entfernt. Ihre Registrierungen bleiben davon unberührt.")}</p><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}${btn(t("Merkliste leeren"), "confirm-clear-favorites")}</div>`,
      );
      break;
    case "confirm-clear-favorites":
      state.favorites = [];
      persistFavorites();
      close();
      render(false);
      toast(t("Merkliste geleert."));
      break;
    case "registration":
      registration(id);
      break;
    case "book": {
      let c = courses.find((x) => x.id === id);
      modal(
        c.approval ? t("Teilnahme anfragen") : t("Teilnahme buchen"),
        `<form id="book-form" data-id="${c.id}"><h3>${t(c.title)}</h3><p class="muted">${formatDate(c.date)} · ${t(c.time)}</p><div class="field"><label for="book-note">${t("Bemerkung an die zuständige Stelle (optional)")}</label><textarea id="book-note" name="note"></textarea></div><label class="checkline"><input type="checkbox" required><span>${t("Ich habe die Veranstaltungsdetails und Teilnahmevoraussetzungen gelesen.")}</span></label><p class="small muted">${c.approval ? t("Die Anfrage wartet anschließend auf fachliche Freigabe.") : t("Ihre Teilnahme wird im Beispielbestand direkt gebucht.")}</p><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}<button class="btn">${c.approval ? t("Anfrage absenden") : t("Buchung bestätigen")}</button></div></form>`,
      );
      break;
    }
    case "withdraw":
      modal(
        t("Anmeldung widerrufen?"),
        `<p>${t("Sie können diese noch unbearbeitete Anmeldung zurücknehmen.")}</p><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}<button class="btn" data-action="confirm-withdraw" data-id="${id}">${t("Widerruf bestätigen")}</button></div>`,
      );
      break;
    case "confirm-withdraw":
      state.registrations = state.registrations.filter((r) => r.course !== id);
      close();
      render(false);
      toast(t("Anmeldung im Beispielbestand widerrufen."));
      break;
    case "lesson":
      state.lesson = id;
      render(false);
      document
        .querySelector(`[data-action="lesson"][data-id="${id}"]`)
        ?.focus();
      break;
    case "lms":
      modal(
        t("Übergang zur Lernplattform"),
        `<p>${t("In der Anwendung öffnet sich hier die zugehörige Lernmaßnahme im angebundenen LMS.")}</p><div class="notice">${icon("monitor")}<span>${t("Datenschutz im Polizeialltag")}<br><strong>${t("Externe Lernmaßnahme")}</strong></span></div><p class="small muted mt">${t("Der Clickdummy ist mit keinem LMS verbunden und übermittelt keine Daten. Lerninhalte und Bearbeitungsfortschritt entstehen im LMS.")}</p>${btn(t("Zurück zu iBMS"), "close", "secondary")}`,
      );
      break;
    case "certificate":
      modal(
        t("Fortbildungsnachweis"),
        `<p class="eyebrow">${t("Beispielnachweis")}</p><h3>${t("Grundlagen der Kommunikation")}</h3><dl class="factlist"><div><dt>${t("Teilnehmende Person")}</dt><dd>Maria Beispiel</dd></div><div><dt>${t("Modul")}</dt><dd>${t("Bildung")}</dd></div><div><dt>${t("Teilnahmedatum")}</dt><dd>08.09.2026</dd></div><div><dt>${t("Status")}</dt><dd>${t("Abgeschlossen")}</dd></div></dl><p class="small muted mt">${t("Fiktiver Nachweis zur Demonstration. Kein gültiger Fortbildungsnachweis.")}</p>${btn(t("Schließen"), "close", "secondary")}`,
      );
      break;
    case "path-event":
      location.hash = "course/1";
      break;
    case "path-info":
      modal(
        t("Organisatorische Hinweise"),
        `<h3>${t("Deeskalation im Einsatz")}</h3><p>${t("Bitte prüfen Sie vor dem Termin die Veranstaltungsdetails und die Hinweise Ihrer Fortbildungsstelle.")}</p><p class="muted">${t("Beispieltermin: 15.10.2026, 09:00–16:00 Uhr.")}</p>${btn(t("Schließen"), "close", "secondary")}`,
      );
      break;
    case "wish":
      modal(
        t("Begründung ergänzen"),
        `<form id="wish-form"><h3>${t("Gesprächsführung und Konfliktklärung")}</h3><div class="field"><label for="wish-note">${t("Begründung Ihres Fortbildungswunsches")}</label><textarea id="wish-note" required minlength="10" placeholder="${t("Welche Kenntnisse möchten Sie vertiefen?")}"></textarea><span class="hint">${t("Bitte mindestens 10 Zeichen eingeben.")}</span></div><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}<button class="btn">${t("Ergänzung speichern")}</button></div></form>`,
      );
      break;
    case "need":
      modal(
        t("Fortbildungsbedarf erfassen"),
        `<form id="need-form"><div class="field"><label for="need-title">${t("Thema oder Angebot")}</label><input id="need-title" required name="title"></div><div class="field"><label for="need-text">${t("Fachliche Begründung")}</label><textarea id="need-text" required minlength="10"></textarea></div><p class="small muted">${t("Die Meldung wird ausschließlich in dieser Demonstration erfasst.")}</p><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}<button class="btn">${t("Bedarf erfassen")}</button></div></form>`,
      );
      break;
    case "edit-user":
      if (state.role === "admin") editUser(id);
      break;
    case "confirm-user":
      if (pendingUser && state.role === "admin") {
        Object.assign(
          people.find((x) => x.id === pendingUser.id),
          pendingUser,
        );
        pendingUser = null;
        close();
        render(false);
        toast(t("Berechtigungen im Beispielbestand aktualisiert."));
      }
      break;
    case "create-user":
      if (state.role === "admin")
        modal(
          t("Anwender anlegen"),
          `<form id="create-user"><p class="small muted">${t("Manuelle Anlage ist in diesem Demonstrationsszenario freigegeben.")}</p><div class="field"><label for="new-name">${t("Vor- und Nachname")}</label><input id="new-name" name="name" required minlength="3"></div><div class="field"><label for="new-oe">${t("Organisationseinheit")}</label><select id="new-oe" name="oe">${[...new Set(people.map((x) => x.oe))].map((x) => `<option value="${esc(x)}">${esc(t(x))}</option>`).join("")}</select></div><p class="notice">${t("Das neue Beispielkonto erhält zunächst die Rolle Anwender im Modul Bildung.")}</p><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}<button class="btn">${t("Beispielkonto anlegen")}</button></div></form>`,
        );
      break;
    case "switch-role":
      state.role = a.dataset.rolevalue;
      state.report = "Fachaufsichtsreport ET";
      render();
      break;
    case "reporttype":
      state.report = a.dataset.type;
      render(false);
      break;
    case "csv":
      downloadCSV();
      break;
    case "export-job":
      state.exportJobs.push({ year: state.year, oe: state.oe });
      render(false);
      toast(
        t(
          "Exportauftrag eingeplant. Die Bereitstellung über Nacht wird im Dummy nicht ausgeführt.",
        ),
      );
      break;
    case "accessibility":
      modal(
        t("Barrierefreiheit"),
        `<p>${t("Der Entwurf berücksichtigt semantische Bereiche, sichtbaren Tastaturfokus, beschriftete Formulare, Statusangaben in Textform und responsive Ansichten.")}</p><ul class="support-list"><li>${t("Mit Tabulator zwischen Bedienelementen wechseln")}</li><li>${t("Mit Escape Dialoge und das mobile Menü schließen")}</li><li>${t("Diagrammwerte auch als Tabelle lesen")}</li><li>${t("Vergrößerung und reduzierte Bewegung berücksichtigen")}</li></ul><p class="notice">${t("Dies ist ein Gestaltungskonzept. Eine verbindliche BITV-NRW-Prüfung und Prüfung mit assistiven Technologien erfolgt an der implementierten Anwendung.")}</p>`,
      );
      break;
    case "privacy":
      modal(
        t("Datenschutz im Entwurf"),
        `<p>${t("Alle Personen, Termine und Kennzahlen sind Beispieldaten. Es gibt keine echte Anmeldung, keine Backend-Anbindung und keinen Versand von Nachrichten.")}</p><p>${t("Änderungen bestehen nur während der aktuellen Sitzung im Arbeitsspeicher des Browsers. Beim Neuladen wird der Beispielbestand zurückgesetzt.")}</p><p class="small muted">${t("Diese Information ist keine Datenschutzerklärung für das spätere Produktivsystem.")}</p>`,
      );
      break;
    case "about":
      modal(
        t("Über diesen Gestaltungsentwurf"),
        `<p><strong>${t("Fachliche Grundlage:")}</strong> ${t("Leistungsbeschreibung und Funktionsbeschreibung iBMS 3.0, Vergabenummer ZA 4.2/1002001550/LS.")}</p><p><strong>${t("Designbasis:")}</strong> ${t("die gelieferten VITA- und Wissensplattform-SVGs sowie Distart-Beispiele. Das originale abstrakte Bildmotiv, der Rahmen, die Serif-/Sans-Kombination und die mobilen Kompositionen werden auf LZPD NRW übertragen.")}</p><p>${t("Login: FB S. 20–21. Mein iBMS: S. 21–30. Anwenderverwaltung: S. 45–49. Reports: S. 61–65. Responsivität und Barrierefreiheit: LB S. 6–8.")}</p><p>${t("Der Lernpfad ist ein Gestaltungsvorschlag zur Zusammenführung vorhandener Fachobjekte. Kein zusätzlicher Leistungsumfang oder Produktivbetrieb.")}</p>`,
      );
      break;
    case "help-login":
      modal(
        t("Hilfe zur Anmeldung"),
        `<p>${t("Für den Entwurf benötigen Sie kein Passwort. „Mit Behördenkonto anmelden“ öffnet die Beispielansicht.")}</p><p>${t("Im Produktivsystem richtet sich die Anmeldung nach der Konfiguration des Kooperationspartners. SSO und Mehrfaktor-Authentisierung werden dort angebunden.")}</p>`,
      );
      break;
    case "contact":
      modal(
        t("Kontaktanfrage vorbereiten"),
        `<form id="contact-form"><div class="field"><label for="contact-topic">${t("Anliegen")}</label><select id="contact-topic">${["Fachliche Frage", "Technisches Problem", "Barriere melden"].map((x) => `<option value="${x}">${t(x)}</option>`).join("")}</select></div><div class="field"><label for="contact-message">${t("Ihre Nachricht")}</label><textarea id="contact-message" required minlength="10"></textarea></div><p class="small muted">${t("Es erfolgt kein Versand. Bitte keine echten personenbezogenen Daten eingeben.")}</p><button class="btn">${t("Vorschau anzeigen")}</button></form>`,
      );
      break;
  }
});

document.addEventListener("change", (e) => {
  if (e.target.matches("[data-lang]")) {
    setLang(e.target.value);
    return;
  }
  if (e.target.matches("[data-role]")) {
    state.role = e.target.value;
    state.report = "Fachaufsichtsreport ET";
    if ($("#dialog").open) {
      close();
      render();
    } else render(false);
    toast(t("Demoansicht gewechselt: ") + t(roleNames[state.role]));
  }
  if (e.target.id === "edit-module")
    $("#edit-role").innerHTML = roleOptions(e.target.value, "Anwender");
});

document.addEventListener("submit", (e) => {
  const f = e.target;
  if (!f.id) return;
  e.preventDefault();
  if (!f.reportValidity()) return;
  const d = new FormData(f);
  switch (f.id) {
    case "home-search":
    case "modal-search":
      state.query = String(d.get("q") || "");
      close();
      if (location.hash === "#catalog") render(false);
      else location.hash = "catalog";
      break;
    case "catalog-filter":
      state.query = String(d.get("q"));
      state.module = String(d.get("module"));
      state.type = String(d.get("type"));
      render(false);
      $("#catalog-q")?.focus();
      toast(t("Suchergebnisse aktualisiert."));
      break;
    case "user-filter":
      state.userquery = String(d.get("q"));
      state.usermodule = String(d.get("module"));
      state.userstatus = String(d.get("status"));
      render(false);
      $("#user-q")?.focus();
      toast(t("Anwenderliste gefiltert."));
      break;
    case "report-filter":
      state.oe = String(d.get("oe"));
      state.year = String(d.get("year"));
      render(false);
      $("#report-oe")?.focus();
      toast(t("Auswertung aktualisiert."));
      break;
    case "book-form": {
      const id = Number(f.dataset.id),
        c = courses.find((x) => x.id === id);
      if (!state.registrations.some((r) => r.course === id)) {
        state.registrations.push({
          course: id,
          status: c.approval ? "Angemeldet" : "Gebucht",
        });
      }
      close();
      state.mytab = "Registrierungen";
      location.hash = "dashboard";
      toast(
        c.approval
          ? t("Teilnahme angefragt. Freigabe steht aus.")
          : t("Teilnahme im Beispielbestand gebucht."),
      );
      break;
    }
    case "wish-form":
      state.wishDone = true;
      close();
      render(false);
      toast(t("Ihre Ergänzung wurde im Entwurf gespeichert."));
      break;
    case "need-form": {
      let title = String(d.get("title"));
      state.needs.push(title);
      state.mytab = "Bedarfsmeldungen";
      close();
      if (location.hash === "#dashboard") render(false);
      else location.hash = "dashboard";
      toast(t("Beispielbedarf") + " „" + title + "“ " + t("erfasst."));
      break;
    }
    case "edit-user":
      pendingUser = {
        id: Number(f.dataset.id),
        module: String(d.get("module")),
        role: String(d.get("role")),
        oe: String(d.get("oe")),
        status: String(d.get("status")),
      };
      modal(
        t("Änderung prüfen"),
        `<p>${t("Bitte prüfen Sie die neue Zuordnung für")} <strong>${esc(people.find((x) => x.id === pendingUser.id).name)}</strong>.</p><dl class="factlist"><div><dt>${t("Modul")}</dt><dd>${esc(t(pendingUser.module))}</dd></div><div><dt>${t("Rolle")}</dt><dd>${esc(t(pendingUser.role))}</dd></div><div><dt>${t("Zuständigkeit")}</dt><dd>${esc(t(pendingUser.oe))}</dd></div><div><dt>${t("Status")}</dt><dd>${esc(t(pendingUser.status))}</dd></div></dl><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}${btn(t("Änderung bestätigen"), "confirm-user")}</div>`,
      );
      break;
    case "create-user": {
      const name = String(d.get("name")).trim();
      people.push({
        id: Math.max(...people.map((x) => x.id)) + 1,
        name,
        initials: name
          .split(" ")
          .map((x) => x[0])
          .slice(0, 2)
          .join(""),
        oe: String(d.get("oe")),
        role: "Anwender",
        module: "Bildung",
        status: "Aktiv",
      });
      close();
      render(false);
      toast(t("Beispielkonto angelegt."));
      break;
    }
    case "contact-form":
      modal(
        t("Vorschau Ihrer Anfrage"),
        `<p class="eyebrow">${esc(t($("#contact-topic").value))}</p><p style="white-space:pre-wrap">${esc($("#contact-message").value)}</p><div class="notice">${t("Die Nachricht wurde nicht versendet.")}</div>${btn(t("Schließen"), "close", "secondary")}`,
      );
      break;
  }
});

function downloadCSV() {
  let factor = state.oe === "Direktion Verkehr" ? 0.4 : 1;
  let text =
    t("Beispieldaten iBMS 3.0") +
    "\r\n" +
    [t("Fachbereich"), t("Soll") + " (h)", t("Ist") + " (h)"].join(";") +
    "\r\n" +
    [
      ["Einsatztaktik", 800, 640],
      ["Eingriffstechniken", 640, 512],
      ["Schießen", 960, 864],
    ]
      .map(([n, a, b]) =>
        [t(n), Math.round(a * factor), Math.round(b * factor)].join(";"),
      )
      .join("\r\n");
  let url = URL.createObjectURL(
    new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }),
  );
  let a = document.createElement("a");
  a.href = url;
  a.download = "iBMS_Beispielreport.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(t("CSV mit Beispieldaten erstellt."));
}

document.addEventListener("click", (e) => {
  if (e.target.closest('a[href^="#"]') && $("#dialog").open) close();
});

$("#dialog").addEventListener("close", () => {
  if (opener?.isConnected) opener.focus();
});

// On the phone shell there is no sidebar, so the routes outside the five tabs
// (help, and the role-specific ones) plus the demo switches live in the
// profile sheet.
function profileExtras() {
  if (!isMobile()) return "";
  const extra = navItems().filter(
    ([r]) => !tabItems().some(([tab]) => tab === r),
  );
  return `<nav class="menu-links mt" aria-label="${t("Mobile Navigation")}">${extra
    .map(([r, n, i]) => `<a href="#${r}">${icon(i)}${t(n)}</a>`)
    .join("")}<a href="#help">${icon("help")}${t("Hilfe & Kontakt")}</a></nav>${demoBox("profile")}`;
}

window.addEventListener("hashchange", () => {
  close();
  render();
});

// Desktop and phone shells are different markup, so crossing 900px re-renders
// rather than being reflowed by CSS alone.
mobileMQ.addEventListener("change", () => render(false));

// iOS-style large title: once it has scrolled away, the compact glass bar
// takes over. 96px is the height of the title block plus its accessory row.
window.addEventListener(
  "scroll",
  () => {
    $("#glassbar")?.classList.toggle("show", window.scrollY > 96);
  },
  { passive: true },
);

render(false);
