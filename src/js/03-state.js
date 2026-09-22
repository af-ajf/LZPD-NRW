// 03-state.js - Mutable app state and role labels.
// The interface is German throughout: every value here is the form that is
// both compared against and rendered to the screen.

"use strict";

const state = {
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
  // survives a reload: a watchlist that is emptied by every refresh cannot
  // be demonstrated.
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
  // Einfache Sprache. Like the watchlist it outlives a reload: a reading aid
  // someone switches on because they need it should not be off again after
  // the next click.
  easy: (() => {
    try {
      return localStorage.getItem("ibms-easy") === "on";
    } catch (e) {
      return false;
    }
  })(),
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

function persistEasy() {
  try {
    localStorage.setItem("ibms-easy", state.easy ? "on" : "off");
  } catch (e) {}
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
