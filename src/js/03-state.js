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
  savedSearches: [],
  // Course ids the user has marked. Unlike the rest of the sample data this
  // survives a reload, the same way the language does: a watchlist that is
  // emptied by every refresh cannot be demonstrated.
  favorites: (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ibms-favorites") || "[]");
      return Array.isArray(saved)
        ? saved.filter((x) => Number.isInteger(x))
        : [];
    } catch (e) {
      return [];
    }
  })(),
  exportJobs: [],
};

const isFavorite = (id) => state.favorites.includes(id);

// Returns the new state, so the caller can pick the matching toast.
function toggleFavorite(id) {
  const on = isFavorite(id);
  state.favorites = on
    ? state.favorites.filter((x) => x !== id)
    : [...state.favorites, id];
  persistFavorites();
  return !on;
}

function persistFavorites() {
  try {
    localStorage.setItem("ibms-favorites", JSON.stringify(state.favorites));
  } catch (e) {}
}

const roleNames = {
  learner: "Anwenderin",
  admin: "BMS-Administrator",
  report: "ET-Fachaufsicht",
};
