// 03-state.js - Mutable app state and role labels.
// Every value here is the German canonical form and is compared as-is.
// Translation happens only at render time, via t().

"use strict";

const state = {
  lang: (() => {
    try {
      return localStorage.getItem("ibms-lang") === "en" ? "en" : "de";
    } catch (e) {
      return "de";
    }
  })(),
  role: "learner",
  registrations: [
    { course: 1, status: "Gebucht" },
    { course: 2, status: "Gebucht" },
    { course: 3, status: "Angemeldet" },
  ],
  mytab: "Registrierungen",
  query: "",
  module: "Alle Module",
  type: "Alle Formate",
  userquery: "",
  userstatus: "Alle Status",
  usermodule: "Alle Module",
  report: "Fachaufsichtsreport ET",
  oe: "Alle zugewiesenen OE",
  year: "2026",
  lesson: 1,
  wishDone: false,
  needs: [],
  favorites: [],
  exportJobs: [],
};

const roleNames = {
  learner: "Anwenderin",
  admin: "BMS-Administrator",
  report: "ET-Fachaufsicht",
};
