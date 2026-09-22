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
      else
        location.hash = location.hash.startsWith("#course")
          ? "catalog"
          : "home";
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
      // On Mein iBMS the cards point at the page they already sit on, so the
      // hash never changes and the browser has nothing to do: the picked tab
      // is drawn here instead, which is what makes the four cards a control
      // rather than a hover effect that leads nowhere.
      if (location.hash === "#dashboard") render(false);
      break;
    case "easy":
      state.easy = !state.easy;
      persistEasy();
      render(false);
      syncEasyButtons();
      toast(
        state.easy
          ? "Einfache Sprache ist eingeschaltet."
          : "Einfache Sprache ist ausgeschaltet.",
        state.easy ? "Einfache Sprache an" : "Einfache Sprache aus",
      );
      break;
    case "menu":
      modal(
        "Menü",
        `<nav class="menu-links" aria-label="Mobile Navigation">${navItems()
          .map(
            ([r, n, i]) =>
              `<a href="#${r}" ${location.hash === "#" + r ? 'aria-current="page"' : ""}>${icon(i)}${n}</a>`,
          )
          .join(
            "",
          )}<a href="#help">${icon("help")}Hilfe & Kontakt</a><a href="#login">${icon("logout")}Abmelden</a></nav>${demoBox("mobile")}<p class="small mt">Interaktiver Entwurf · Beispieldaten</p>`,
        "mobile-nav-dialog",
      );
      break;
    case "notifications":
      modal(
        "Benachrichtigungen",
        `<div class="event"><span class="iconbox accent">${icon("calendar")}</span><div class="event-main"><h3>Teilnahme bestätigt</h3><p>Deeskalation im Einsatz · 15.10.2026</p><a class="textlink" href="#dashboard">Meine Registrierungen öffnen${icon("arrow", "xs")}</a></div></div><div class="event"><span class="iconbox">${icon("file")}</span><div class="event-main"><h3>Nachweis verfügbar</h3><p>Grundlagen der Kommunikation</p><button class="textlink" data-action="certificate">Nachweis ansehen${icon("arrow", "xs")}</button></div></div>`,
      );
      break;
    case "profile":
      modal(
        "Ihr Profil",
        `<h3>Maria Beispiel</h3><dl class="factlist"><div><dt>Organisation</dt><dd>Polizei NRW</dd></div><div><dt>Organisationseinheit</dt><dd>Direktion Zentrale Aufgaben</dd></div><div><dt>Demoansicht</dt><dd>${roleNames[state.role]}</dd></div></dl>${profileExtras()}<div class="dialog-actions"><a class="btn secondary" href="#login">Abmelden</a></div>`,
        "profile-sheet",
      );
      break;
    case "search":
      modal(
        "Angebote suchen",
        `<form id="modal-search"><div class="field"><label for="modal-q">Angebot oder Thema</label><input id="modal-q" name="q" type="search" placeholder="z. B. Deeskalation" autofocus></div><button class="btn" type="submit">Gesamtangebot durchsuchen</button></form>`,
      );
      break;
    case "mytab": {
      // The page body is rebuilt in place, so the rail of tabs comes back
      // scrolled to its start. Its offset is carried across the render, and
      // the focus is set without one of its own, so the tab that was tapped
      // stays where the finger left it instead of jumping to the front.
      const railLeft = a.closest(".tabs")?.scrollLeft ?? 0;
      state.mytab = a.dataset.tab;
      render(false);
      const rail = $(".tabs");
      if (rail) rail.scrollLeft = railLeft;
      document
        .querySelector(`[data-tab="${state.mytab}"]`)
        ?.focus({ preventScroll: true });
      break;
    }
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
      toast(
        "Ihre Suchauswahl wurde für diese Demonstration gemerkt.",
        "Suche gemerkt",
      );
      break;
    // Marking a course re-renders: the card, the sidebar count and the
    // watchlist itself all show the new state. Focus is put back on the
    // button that was pressed, unless un-marking removed it from the page.
    //
    // On the phone that re-render is the wrong answer - the whole screen
    // blinks for a heart - so there the marks are patched in place and only
    // the watchlist, where the card has to go away, touches the DOM further.
    case "fav": {
      const on = toggleFavorite(id);
      if (isMobile()) {
        syncFavButtons(id);
        // An emptied watchlist swaps in its own panel, so that one case still
        // needs the route drawn again.
        if (routeName() === "favorites" && !on && !dropFavoriteCard(id))
          render(false);
      } else {
        render(false);
      }
      const mark = document.querySelector(
        `[data-action="fav"][data-id="${id}"]`,
      );
      if (!isMobile()) mark?.focus({ preventScroll: true });
      // Marking pops the heart and throws off a ring; un-marking stays quiet,
      // so the two directions do not read the same.
      if (on && mark) {
        mark.classList.add("burst");
        setTimeout(() => mark.classList.remove("burst"), 600);
      }
      toast(
        on
          ? "Angebot auf Ihrer Merkliste gespeichert."
          : "Angebot von Ihrer Merkliste entfernt.",
        on ? "Gemerkt" : "Entfernt",
      );
      break;
    }
    case "clear-favorites":
      modal(
        "Merkliste leeren?",
        `<p>Alle gemerkten Angebote werden von Ihrer Merkliste entfernt. Ihre Registrierungen bleiben davon unberührt.</p><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}${btn("Merkliste leeren", "confirm-clear-favorites")}</div>`,
      );
      break;
    case "confirm-clear-favorites":
      state.favorites = [];
      persistFavorites();
      close();
      render(false);
      toast("Merkliste geleert.");
      break;
    case "registration":
      registration(id);
      break;
    case "book": {
      let c = courses.find((x) => x.id === id);
      modal(
        c.approval ? "Teilnahme anfragen" : "Teilnahme buchen",
        `<form id="book-form" data-id="${c.id}"><h3>${c.title}</h3><p class="muted">${formatDate(c.date)} · ${c.time}</p><div class="field"><label for="book-note">Bemerkung an die zuständige Stelle (optional)</label><textarea id="book-note" name="note"></textarea></div><label class="checkline"><input type="checkbox" required><span>Ich habe die Veranstaltungsdetails und Teilnahmevoraussetzungen gelesen.</span></label><p class="small muted">${c.approval ? "Die Anfrage wartet anschließend auf fachliche Freigabe." : "Ihre Teilnahme wird im Beispielbestand direkt gebucht."}</p><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}<button class="btn">${c.approval ? "Anfrage absenden" : "Buchung bestätigen"}</button></div></form>`,
      );
      break;
    }
    case "withdraw":
      modal(
        "Anmeldung widerrufen?",
        `<p>Sie können diese noch unbearbeitete Anmeldung zurücknehmen.</p><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}<button class="btn" data-action="confirm-withdraw" data-id="${id}">Widerruf bestätigen</button></div>`,
      );
      break;
    case "confirm-withdraw":
      state.registrations = state.registrations.filter((r) => r.course !== id);
      close();
      render(false);
      toast("Anmeldung im Beispielbestand widerrufen.", "Anmeldung widerrufen");
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
        "Übergang zur Lernplattform",
        `<p>In der Anwendung öffnet sich hier die zugehörige Lernmaßnahme im angebundenen LMS.</p><div class="notice">${icon("monitor")}<span>Datenschutz im Polizeialltag<br><strong>Externe Lernmaßnahme</strong></span></div><p class="small muted mt">Der Clickdummy ist mit keinem LMS verbunden und übermittelt keine Daten. Lerninhalte und Bearbeitungsfortschritt entstehen im LMS.</p>${btn("Zurück zu iBMS", "close", "secondary")}`,
      );
      break;
    case "certificate":
      modal(
        "Fortbildungsnachweis",
        `<p class="eyebrow">Beispielnachweis</p><h3>Grundlagen der Kommunikation</h3><dl class="factlist"><div><dt>Teilnehmende Person</dt><dd>Maria Beispiel</dd></div><div><dt>Modul</dt><dd>Bildung</dd></div><div><dt>Teilnahmedatum</dt><dd>08.09.2026</dd></div><div><dt>Status</dt><dd>Abgeschlossen</dd></div></dl><p class="small muted mt">Fiktiver Nachweis zur Demonstration. Kein gültiger Fortbildungsnachweis.</p>${btn("Schließen", "close", "secondary")}`,
      );
      break;
    case "path-event":
      location.hash = "course/1";
      break;
    case "path-info":
      modal(
        "Organisatorische Hinweise",
        `<h3>Deeskalation im Einsatz</h3><p>Bitte prüfen Sie vor dem Termin die Veranstaltungsdetails und die Hinweise Ihrer Fortbildungsstelle.</p><p class="muted">Beispieltermin: 15.10.2026, 09:00–16:00 Uhr.</p>${btn("Schließen", "close", "secondary")}`,
      );
      break;
    case "wish":
      modal(
        "Begründung ergänzen",
        `<form id="wish-form"><h3>Gesprächsführung und Konfliktklärung</h3><div class="field"><label for="wish-note">Begründung Ihres Fortbildungswunsches</label><textarea id="wish-note" required minlength="10" placeholder="Welche Kenntnisse möchten Sie vertiefen?"></textarea><span class="hint">Bitte mindestens 10 Zeichen eingeben.</span></div><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}<button class="btn">Ergänzung speichern</button></div></form>`,
      );
      break;
    case "need":
      modal(
        "Fortbildungsbedarf erfassen",
        `<form id="need-form"><div class="field"><label for="need-title">Thema oder Angebot</label><input id="need-title" required name="title"></div><div class="field"><label for="need-text">Fachliche Begründung</label><textarea id="need-text" required minlength="10"></textarea></div><p class="small muted">Die Meldung wird ausschließlich in dieser Demonstration erfasst.</p><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}<button class="btn">Bedarf erfassen</button></div></form>`,
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
        toast(
          "Berechtigungen im Beispielbestand aktualisiert.",
          "Berechtigungen aktualisiert",
        );
      }
      break;
    case "create-user":
      if (state.role === "admin")
        modal(
          "Anwender anlegen",
          `<form id="create-user"><p class="small muted">Manuelle Anlage ist in diesem Demonstrationsszenario freigegeben.</p><div class="field"><label for="new-name">Vor- und Nachname</label><input id="new-name" name="name" required minlength="3"></div><div class="field"><label for="new-oe">Organisationseinheit</label><select id="new-oe" name="oe">${[...new Set(people.map((x) => x.oe))].map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select></div><p class="notice">Das neue Beispielkonto erhält zunächst die Rolle Anwender im Modul Bildung.</p><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}<button class="btn">Beispielkonto anlegen</button></div></form>`,
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
        "Exportauftrag eingeplant. Die Bereitstellung über Nacht wird im Dummy nicht ausgeführt.",
        "Export eingeplant",
      );
      break;
    case "accessibility":
      modal(
        "Barrierefreiheit",
        `<p>Der Entwurf berücksichtigt semantische Bereiche, sichtbaren Tastaturfokus, beschriftete Formulare, Statusangaben in Textform und responsive Ansichten.</p><ul class="support-list"><li>Mit Tabulator zwischen Bedienelementen wechseln</li><li>Mit Escape Dialoge und das mobile Menü schließen</li><li>Diagrammwerte auch als Tabelle lesen</li><li>Vergrößerung und reduzierte Bewegung berücksichtigen</li></ul><p class="notice">Dies ist ein Gestaltungskonzept. Eine verbindliche BITV-NRW-Prüfung und Prüfung mit assistiven Technologien erfolgt an der implementierten Anwendung.</p>`,
      );
      break;
    case "privacy":
      modal(
        "Datenschutz im Entwurf",
        `<p>Alle Personen, Termine und Kennzahlen sind Beispieldaten. Es gibt keine echte Anmeldung, keine Backend-Anbindung und keinen Versand von Nachrichten.</p><p>Änderungen bestehen nur während der aktuellen Sitzung im Arbeitsspeicher des Browsers. Beim Neuladen wird der Beispielbestand zurückgesetzt.</p><p class="small muted">Diese Information ist keine Datenschutzerklärung für das spätere Produktivsystem.</p>`,
      );
      break;
    case "about":
      modal(
        "Über diesen Gestaltungsentwurf",
        `<p><strong>Auftraggeber und Betrieb:</strong> Das LZPD NRW, das Landesamt für Zentrale Polizeiliche Dienste, ist der zentrale IT-Dienstleister der Polizei Nordrhein-Westfalen. Es betreibt POLIZEI-ONLINE und mit iBMS 3.0 eine Anwendung darin. Fachlich zuständig für die Fortbildung bleiben die Behörden der Polizei NRW.</p><p><strong>Fachliche Grundlage:</strong> Leistungsbeschreibung und Funktionsbeschreibung iBMS 3.0, Vergabenummer ZA 4.2/1002001550/LS.</p><p><strong>Designbasis:</strong> die gelieferten VITA- und Wissensplattform-SVGs sowie Distart-Beispiele. Das originale abstrakte Bildmotiv, der Rahmen, die Serif-/Sans-Kombination und die mobilen Kompositionen werden auf LZPD NRW übertragen.</p><p>Login: FB S. 20–21. Mein iBMS: S. 21–30. Anwenderverwaltung: S. 45–49. Reports: S. 61–65. Responsivität und Barrierefreiheit: LB S. 6–8.</p><p>Der Lernpfad ist ein Gestaltungsvorschlag zur Zusammenführung vorhandener Fachobjekte. Kein zusätzlicher Leistungsumfang oder Produktivbetrieb.</p>`,
      );
      break;
    case "help-login":
      modal(
        "Hilfe zur Anmeldung",
        `<p>Für den Entwurf benötigen Sie kein Passwort. „Mit Dienstkonto anmelden“ öffnet die Beispielansicht.</p><p>Im Produktivsystem richtet sich die Anmeldung nach der Konfiguration des Kooperationspartners. SSO und Mehrfaktor-Authentisierung werden dort angebunden.</p>`,
      );
      break;
    case "contact":
      modal(
        "Kontaktanfrage vorbereiten",
        `<form id="contact-form"><div class="field"><label for="contact-topic">Anliegen</label><select id="contact-topic">${["Fachliche Frage", "Technisches Problem", "Barriere melden"].map((x) => `<option value="${x}">${x}</option>`).join("")}</select></div><div class="field"><label for="contact-message">Ihre Nachricht</label><textarea id="contact-message" required minlength="10"></textarea></div><p class="small muted">Es erfolgt kein Versand. Bitte keine echten personenbezogenen Daten eingeben.</p><button class="btn">Vorschau anzeigen</button></form>`,
      );
      break;
  }
});

// ---------- filters ----------
//
// A filter takes effect as it is set: a chosen module is the filter, not a
// draft that still has to be submitted. That also makes it part of the state
// rather than of the form on screen, so leaving the tab and coming back shows
// the same selection and the same result list.
const filterForms = {
  "catalog-filter": (d) => {
    state.query = String(d.get("q"));
    state.module = String(d.get("module"));
    state.type = String(d.get("type"));
  },
  "user-filter": (d) => {
    state.userquery = String(d.get("q"));
    state.usermodule = String(d.get("module"));
    state.userstatus = String(d.get("status"));
  },
  "report-filter": (d) => {
    state.oe = String(d.get("oe"));
    state.year = String(d.get("year"));
  },
};

// Returns whether the form was a filter, so the callers can fall through.
function applyFilter(form) {
  const read = filterForms[form?.id];
  if (!read) return false;
  read(new FormData(form));
  // Drawing the route replaces the form along with the rest of the page body,
  // so the control that is being used is picked up again afterwards - with
  // its caret, or typing would jump to the end of the field.
  const active = document.activeElement;
  const id = active?.id;
  let caret = null;
  try {
    caret = active.selectionStart;
  } catch (e) {}
  render(false);
  const back = id ? document.getElementById(id) : null;
  if (!back) return true;
  back.focus({ preventScroll: true });
  try {
    if (caret != null) back.setSelectionRange(caret, caret);
  } catch (e) {}
  return true;
}

// Typing is answered one pause later: every keystroke would redraw the list
// under the hand.
let filterTyping = null;
document.addEventListener("input", (e) => {
  const form = e.target.form;
  if (e.target.tagName !== "INPUT" || !filterForms[form?.id]) return;
  clearTimeout(filterTyping);
  filterTyping = setTimeout(() => applyFilter(form), 300);
});

document.addEventListener("change", (e) => {
  // A select is a deliberate choice, so it is answered at once.
  if (e.target.tagName === "SELECT" && applyFilter(e.target.form)) return;
  if (e.target.matches("[data-role]")) {
    state.role = e.target.value;
    state.report = "Fachaufsichtsreport ET";
    if ($("#dialog").open) {
      close();
      render();
    } else render(false);
    toast(
      "Demoansicht gewechselt: " + roleNames[state.role],
      "Ansicht: " + roleNames[state.role],
    );
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
    // The filters are already applied while they are being set; submitting
    // is the confirmation of that, and says so.
    case "catalog-filter":
      clearTimeout(filterTyping);
      applyFilter(f);
      $("#catalog-q")?.focus();
      toast("Suchergebnisse aktualisiert.");
      break;
    case "user-filter":
      clearTimeout(filterTyping);
      applyFilter(f);
      $("#user-q")?.focus();
      toast("Anwenderliste gefiltert.");
      break;
    case "report-filter":
      clearTimeout(filterTyping);
      applyFilter(f);
      $("#report-oe")?.focus();
      toast("Auswertung aktualisiert.");
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
          ? "Teilnahme angefragt. Freigabe steht aus."
          : "Teilnahme im Beispielbestand gebucht.",
        c.approval ? "Teilnahme angefragt" : "Teilnahme gebucht",
      );
      break;
    }
    case "wish-form":
      state.wishDone = true;
      close();
      render(false);
      toast("Ihre Ergänzung wurde im Entwurf gespeichert.", "Ergänzung gespeichert");
      break;
    case "need-form": {
      let title = String(d.get("title"));
      state.needs.push(title);
      state.mytab = "Bedarfsmeldungen";
      close();
      if (location.hash === "#dashboard") render(false);
      else location.hash = "dashboard";
      toast("Beispielbedarf „" + title + "“ erfasst.", "Bedarf erfasst");
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
        "Änderung prüfen",
        `<p>Bitte prüfen Sie die neue Zuordnung für <strong>${esc(people.find((x) => x.id === pendingUser.id).name)}</strong>.</p><dl class="factlist"><div><dt>Modul</dt><dd>${esc(pendingUser.module)}</dd></div><div><dt>Rolle</dt><dd>${esc(pendingUser.role)}</dd></div><div><dt>Zuständigkeit</dt><dd>${esc(pendingUser.oe)}</dd></div><div><dt>Status</dt><dd>${esc(pendingUser.status)}</dd></div></dl><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}${btn("Änderung bestätigen", "confirm-user")}</div>`,
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
      toast("Beispielkonto angelegt.");
      break;
    }
    case "contact-form":
      modal(
        "Vorschau Ihrer Anfrage",
        `<p class="eyebrow">${esc($("#contact-topic").value)}</p><p style="white-space:pre-wrap">${esc($("#contact-message").value)}</p><div class="notice">Die Nachricht wurde nicht versendet.</div>${btn("Schließen", "close", "secondary")}`,
      );
      break;
  }
});

function downloadCSV() {
  let factor = state.oe === "Direktion Verkehr" ? 0.4 : 1;
  let text =
    "Beispieldaten iBMS 3.0\r\n" +
    ["Fachbereich", "Soll (h)", "Ist (h)"].join(";") +
    "\r\n" +
    [
      ["Einsatztaktik", 800, 640],
      ["Eingriffstechniken", 640, 512],
      ["Schießen", 960, 864],
    ]
      .map(([n, a, b]) =>
        [n, Math.round(a * factor), Math.round(b * factor)].join(";"),
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
  toast("CSV mit Beispieldaten erstellt.", "CSV erstellt");
}

document.addEventListener("click", (e) => {
  if (e.target.closest('a[href^="#"]') && $("#dialog").open) close();
});

$("#dialog").addEventListener("close", () => {
  if (opener?.isConnected) opener.focus();
});

// On the phone shell there is no sidebar and no footer, so the routes outside
// the five tabs (help, and the role-specific ones), the three footer notices
// and the demo switches all live in the profile sheet.
function profileExtras() {
  // On the desktop shell the top bar only names the current view, so the
  // switch between them is here as well.
  if (!isMobile()) return demoBox("profile");
  const extra = navItems().filter(
    ([r]) => !tabItems().some(([tab]) => tab === r),
  );
  const notices = [
    ["accessibility", "Barrierefreiheit", "help"],
    ["privacy", "Datenschutz", "shield"],
    ["about", "Über diesen Entwurf", "file"],
  ];
  return `<nav class="menu-links mt" aria-label="Mobile Navigation">${extra
    .map(([r, n, i]) => `<a href="#${r}">${icon(i)}${n}</a>`)
    .join("")}<a href="#help">${icon("help")}Hilfe & Kontakt</a>${notices
    .map(
      ([action, label, i]) =>
        `<button data-action="${action}">${icon(i)}${label}</button>`,
    )
    .join("")}</nav>${demoBox("profile")}`;
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
// The same listener keeps each tab's scroll position for 07-render.js.
window.addEventListener(
  "scroll",
  () => {
    $("#glassbar")?.classList.toggle("show", window.scrollY > 96);
    rememberScroll();
  },
  { passive: true },
);

render(false);
