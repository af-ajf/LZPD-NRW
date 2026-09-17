// 07-render.js - Hash router, toast and dialog primitives.

"use strict";

function render(focus = true) {
  let r = location.hash.slice(1) || "login";
  const route = r.split("/")[0];
  let content;
  switch (route) {
    case "login":
      $("#app").innerHTML = login();
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
    case "course":
      content = courseDetail(Number(r.split("/")[1]));
      break;
    case "users":
      content = users();
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
        pagehead(t("Diese Seite ist nicht verfügbar")) +
        link(t("Zur Startseite"), "home");
  }
  if (content !== undefined) $("#app").innerHTML = layout(content, route);
  syncTabbar(route);
  $(".skip").textContent = t("Zum Hauptinhalt springen");
  document.documentElement.lang = state.lang;
  document.title =
    ($("#page-title")?.textContent || "iBMS 3.0") + " · POLIZEI-ONLINE";
  if (focus) {
    window.scrollTo(0, 0);
    $("#page-title")?.focus({ preventScroll: true });
  }
}

function toast(text) {
  const e = $("#toast");
  e.textContent = text;
  e.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => e.classList.remove("show"), 5500);
}

function modal(title, body, cls = "") {
  const d = $("#dialog");
  if (!d.open) opener = document.activeElement;
  d.className = cls;
  $("#dialog-content").innerHTML =
    `<div class="dialog-head"><h2 id="dialog-title">${title}</h2><button class="iconbtn" data-action="close" aria-label="${t("Dialog schließen")}">${icon("close")}</button></div><div class="dialog-body">${body}</div>`;
  if (!d.open) d.showModal();
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
    t("Ihre Registrierung"),
    `<p class="eyebrow">${t(c.module)}</p><h3>${t(c.title)}</h3>${badge(reg.status)}<dl class="factlist mt"><div><dt>${t("Datum")}</dt><dd>${formatDate(c.date)}</dd></div><div><dt>${t("Ort")}</dt><dd>${t(c.place)}</dd></div><div><dt>${t("Teilnehmende Person")}</dt><dd>Maria Beispiel</dd></div></dl><h3 class="mt">${t("Historie")}</h3><p class="small muted">${t("Registrierung erfasst.")} ${reg.status === "Gebucht" ? t("Teilnahme bestätigt.") : t("Freigabe durch zuständige Stelle ausstehend.")}</p><div class="dialog-actions">${c.type === "E-Learning" && reg.status === "Gebucht" ? btn(t("E-Learning starten"), "lms") : ""}${reg.status === "Angemeldet" ? `<button class="btn secondary" data-action="withdraw" data-id="${c.id}">${t("Anmeldung widerrufen")}</button>` : ""}${btn(t("Schließen"), "close", "secondary")}</div>`,
  );
}

function editUser(id) {
  let p = people.find((x) => x.id === id);
  if (!p) return;
  modal(
    t("Anwender bearbeiten"),
    `<form id="edit-user" data-id="${p.id}"><p class="eyebrow">${t("Nordrhein-Westfalen / Fachliche Berechtigung")}</p><h3>${esc(p.name)}</h3><div class="field"><label for="edit-module">${t("Modul")}</label><select id="edit-module" name="module">${["Bildung", "Einsatztraining", "Sport"].map((x) => `<option value="${x}" ${x === p.module ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><div class="field"><label for="edit-role">${t("Funktionsrolle")}</label><select id="edit-role" name="role">${roleOptions(p.module, p.role)}</select></div><div class="field"><label for="edit-oe">${t("Zuständige Organisationseinheit")}</label><select id="edit-oe" name="oe">${[...new Set(people.map((x) => x.oe))].map((x) => `<option value="${esc(x)}" ${x === p.oe ? "selected" : ""}>${esc(t(x))}</option>`).join("")}</select></div><div class="field"><label for="edit-status">${t("Kontostatus")}</label><select id="edit-status" name="status">${["Aktiv", "Gesperrt"].map((x) => `<option value="${x}" ${x === p.status ? "selected" : ""}>${t(x)}</option>`).join("")}</select></div><p class="small muted">${t("Änderungen gelten nur für den Beispielbestand dieses Clickdummys.")}</p><div class="dialog-actions">${btn(t("Abbrechen"), "close", "secondary")}<button class="btn">${t("Änderungen prüfen")}</button></div></form>`,
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
        `<option value="${x}" ${x === selected ? "selected" : ""}>${t(x)}</option>`,
    )
    .join("");
}
