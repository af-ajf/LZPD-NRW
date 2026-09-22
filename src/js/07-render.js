// 07-render.js - Hash router, toast and dialog primitives.

"use strict";

// Where each hash was left off, so returning to a tab puts the user back
// where they were instead of at the top, the way a tab does. Written on
// scroll by 08-actions.js, read back here.
const scrollMemory = new Map();

// Routes that have already been on screen in this session. The enter motion
// belongs to the first sight of a tab, so it is played once per route.
const seenRoutes = new Set();

function rememberScroll() {
  if (render.last) scrollMemory.set(render.last, window.scrollY);
}

function render(focus = true) {
  let r = location.hash.slice(1) || "login";
  const route = r.split("/")[0];
  if (route === "dashboard" && r.split("/")[1]) {
    const tab = decodeURIComponent(r.split("/")[1]);
    if (["Registrierungen", "Bedarfsmeldungen", "Fortbildungswünsche", "Nachweise", "Fertigkeiten"].includes(tab)) state.mytab = tab;
  }
  // The old page is still on screen, so this is its scroll position.
  if (r !== render.last) rememberScroll();
  let content;
  switch (route) {
    case "login":
      break;
    case "home":
      content = home();
      break;
    case "dashboard":
      content = dashboard();
      break;
    case "catalog":
      content = catalog();
      break;
    case "lastminute":
      content = catalog(true);
      break;
    case "favorites":
      content = favorites();
      break;
    case "course":
      content = courseDetail(Number(r.split("/")[1]));
      break;
    case "users":
      content = users();
      break;
    case "planning":
      content = planning();
      break;
    case "report":
      content = report();
      break;
    case "learning":
      content = learning();
      break;
    case "article":
      content = article();
      break;
    case "help":
      content = help();
      break;
    default:
      content =
        pagehead("Diese Seite ist nicht verfügbar") +
        link("Zur Startseite", "home");
  }
  render.last = r;
  // The shell is mounted once and then kept: a route change swaps the page
  // body inside it and updates the chrome in place. Rebuilding sidebar, top
  // bar and header on every tab is what made a click read like a page load.
  // Only the two presentations - phone and desktop - and the login screen,
  // which carries no chrome at all, mount markup of their own.
  const shell = route === "login" ? "login" : isMobile() ? "phone" : "desktop";
  // Armed before the new markup is written: the rules hang off `#app.enter`,
  // so the class has to be there by the time the nodes are inserted.
  armEnter(route);
  if (shell !== render.shell) {
    $("#app").innerHTML = route === "login" ? login() : layout(content, route);
    render.shell = shell;
    enterSidebar();
  } else if (shell !== "login") {
    $("#main").innerHTML = content;
    syncChrome(route);
  }
  syncTabbar(route);
  $(".skip").textContent = "Zum Hauptinhalt springen";
  document.title =
    ($("#page-title")?.textContent || "iBMS 3.0") + " · POLIZEI-ONLINE";
  if (focus) {
    window.scrollTo(0, scrollMemory.get(r) || 0);
    $("#page-title")?.focus({ preventScroll: true });
  }
}

// Enter motion belongs to the first sight of a tab: the first time a route is
// opened it builds itself up, every later visit and every re-render in place
// (a filter, a heart, a tab of Mein iBMS) simply shows the page.
//
// The class is taken off again once it has played: left on, the same rules
// would catch every page body swapped in afterwards. The timer is what ends
// it when nothing else happens - any further render decides for itself
// whether its own route is being seen for the first time.
function armEnter(route) {
  const app = $("#app");
  const first = route !== "login" && !seenRoutes.has(route);
  if (route !== "login") seenRoutes.add(route);
  clearTimeout(armEnter.timer);
  app.classList.toggle("enter", first);
  if (first)
    armEnter.timer = setTimeout(() => app.classList.remove("enter"), 1000);
}

// The rail comes with the shell and then stays, so it builds itself up when
// the app is entered and never again while it is on screen - a route change
// only moves the marker along it.
function enterSidebar() {
  const nav = $(".sidenav");
  if (!nav) return;
  nav.classList.add("enter");
  clearTimeout(enterSidebar.timer);
  enterSidebar.timer = setTimeout(() => nav.classList.remove("enter"), 1000);
}

// `short` is the phone wording. On the small screen the toast drops in from
// the top as a Dynamic-Island-style capsule, where a full sentence would wrap
// to three lines, so callers that have a terser form pass it here.
function toast(text, short) {
  const e = $("#toast");
  const phone = isMobile();
  e.textContent = phone && short ? short : text;
  // Dropped and re-added around a forced reflow, so a toast that replaces one
  // still on screen plays its entrance again instead of appearing in place.
  e.classList.remove("leaving", "show");
  void e.offsetWidth;
  e.classList.add("show");
  clearTimeout(toast.timer);
  clearTimeout(toast.exit);
  // Two steps out: play the exit animation, then take the node out of the
  // flow. The phone capsule sits over the content, so it leaves sooner.
  toast.timer = setTimeout(
    () => {
      e.classList.add("leaving");
      toast.exit = setTimeout(
        () => e.classList.remove("show", "leaving"),
        phone ? 280 : 240,
      );
    },
    phone ? 3200 : 5500,
  );
}

function modal(title, body, cls = "") {
  const d = $("#dialog");
  if (!d.open) opener = document.activeElement;
  d.className = cls;
  $("#dialog-content").innerHTML =
    `<div class="dialog-head"><h2 id="dialog-title">${title}</h2><button class="iconbtn" data-action="close" aria-label="Dialog schließen">${icon("close")}</button></div><div class="dialog-body">${body}</div>`;
  if (!d.open) d.showModal();
  requestAnimationFrame(() => {
    const target = d.querySelector("[autofocus], [data-action='close']");
    target?.focus({ preventScroll: true });
  });
}

function close() {
  const d = $("#dialog");
  if (d.open) d.close();
  if (opener?.isConnected) opener.focus();
}

function registration(id) {
  const reg = state.registrations.find((x) => x.course === id);
  const c = courses.find((x) => x.id === id);
  if (!reg || !c) return;
  modal(
    "Ihre Registrierung",
    `<p class="eyebrow">${c.module}</p><h3>${c.title}</h3>${badge(reg.status)}<dl class="factlist mt"><div><dt>Datum</dt><dd>${formatDate(c.date)}</dd></div><div><dt>Ort</dt><dd>${c.place}</dd></div><div><dt>Teilnehmende Person</dt><dd>Maria Beispiel</dd></div></dl><h3 class="mt">Historie</h3><p class="small muted">Registrierung erfasst. ${reg.status === "Gebucht" ? "Teilnahme bestätigt." : "Freigabe durch zuständige Stelle ausstehend."}</p><div class="dialog-actions">${c.type === "E-Learning" && reg.status === "Gebucht" ? btn("E-Learning starten", "lms") : ""}${reg.status === "Angemeldet" ? `<button class="btn secondary" data-action="withdraw" data-id="${c.id}">Anmeldung widerrufen</button>` : ""}${btn("Schließen", "close", "secondary")}</div>`,
  );
}

function editUser(id) {
  let p = people.find((x) => x.id === id);
  if (!p) return;
  modal(
    "Anwender bearbeiten",
    `<form id="edit-user" data-id="${p.id}"><p class="eyebrow">Nordrhein-Westfalen / Fachliche Berechtigung</p><h3>${esc(p.name)}</h3><div class="field"><label for="edit-module">Modul</label><select id="edit-module" name="module">${["Bildung", "Einsatztraining", "Sport"].map((x) => `<option value="${x}" ${x === p.module ? "selected" : ""}>${x}</option>`).join("")}</select></div><div class="field"><label for="edit-role">Funktionsrolle</label><select id="edit-role" name="role">${roleOptions(p.module, p.role)}</select></div><div class="field"><label for="edit-oe">Zuständige Organisationseinheit</label><select id="edit-oe" name="oe">${[...new Set(people.map((x) => x.oe))].map((x) => `<option value="${esc(x)}" ${x === p.oe ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></div><div class="field"><label for="edit-status">Kontostatus</label><select id="edit-status" name="status">${["Aktiv", "Gesperrt"].map((x) => `<option value="${x}" ${x === p.status ? "selected" : ""}>${x}</option>`).join("")}</select></div><p class="small muted">Änderungen gelten nur für den Beispielbestand dieses Clickdummys.</p><div class="dialog-actions">${btn("Abbrechen", "close", "secondary")}<button class="btn">Änderungen prüfen</button></div></form>`,
  );
}

function roleOptions(module, selected) {
  return (
    module === "Bildung"
      ? ["Anwender", "SbDA", "SbAuF"]
      : module === "Einsatztraining"
        ? ["Anwender", "ET-Trainer", "ET-Administrator"]
        : ["Anwender", "Sport-Beauftragter", "Sport-Koordinator"]
  )
    .map(
      (x) =>
        `<option value="${x}" ${x === selected ? "selected" : ""}>${x}</option>`,
    )
    .join("");
}
