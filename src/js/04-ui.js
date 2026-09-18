// 04-ui.js - Small HTML helpers: selector, escaping, badge, button, link.

"use strict";

const $ = (s) => document.querySelector(s);

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

let opener = null;

// Tone is decided on the status text itself.
const badge = (s) =>
  `<span class="tag ${
    ["Gebucht", "Aktiv", "Abgeschlossen", "Gültig"].includes(s)
      ? "green"
      : ["Angemeldet", "Rückmeldung offen", "Gesperrt"].includes(s)
        ? "amber"
        : "gray"
  }">${esc(s)}</span>`;

const btn = (text, action, cls = "") =>
  `<button class="btn ${cls}" data-action="${action}">${text}</button>`;

const link = (text, href, cls = "btn") =>
  `<a class="${cls}" href="#${href}">${text}${icon("arrow")}</a>`;
