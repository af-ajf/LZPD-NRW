// 08-haptics.js - Taptic feedback on the phone shell.
//
// The phone shell is an app, and an app answers a tap with more than pixels.
// Two kinds, mirroring the two kinds of motion in 07-motion.css: a short
// selection tick under the finger when a control is pressed - the tab bar, the
// Mein-iBMS tabs, the chips, the buttons - and an outcome pattern once
// something is actually completed or refused: a booking, a confirmation, a
// form that will not submit.
//
// Nothing here is needed for the interface to work, and it stays quiet
// wherever it would be wrong: on the desktop shell, on a device without a
// vibrator, and under prefers-reduced-motion - a vibration is motion the hand
// feels, so the same preference that stops the animations stops this too.

"use strict";

const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

// Milliseconds, and deliberately short: these are ticks, not alarms. An array
// alternates vibration and pause, so `success` is two bumps and `warn` three.
const hapticPatterns = {
  select: 8,
  press: 12,
  success: [12, 45, 24],
  warn: [22, 55, 22, 55, 22],
};

const canVibrate = typeof navigator.vibrate === "function";

const hapticsOn = () =>
  isMobile() && navigator.maxTouchPoints > 0 && !reduceMotionMQ.matches;

// iOS has no Vibration API. Safari does play the system switch haptic when an
// <input type="checkbox" switch> is toggled, so a hidden switch stands in as
// the only way a web page reaches the Taptic Engine. It gives one tick and
// nothing else, so a pattern becomes a number of ticks here. The element is
// kept rendered but invisible: `display: none` would take its activation
// behaviour with it.
let hapticSwitch = null;

function hapticTick() {
  if (!hapticSwitch) {
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.cssText =
      "position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    label.appendChild(input);
    document.body.appendChild(label);
    hapticSwitch = label;
  }
  hapticSwitch.click();
}

function haptic(kind = "press") {
  if (!hapticsOn()) return;
  const pattern = hapticPatterns[kind] || hapticPatterns.press;
  if (canVibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
    return;
  }
  const ticks = Array.isArray(pattern) ? Math.ceil(pattern.length / 2) : 1;
  for (let i = 0; i < ticks; i++) setTimeout(hapticTick, i * 90);
}

// The controls that carry the interface: the two tab rows, the category chips,
// every button of the design system and the round glass controls of the phone
// header. Text links and body copy stay silent - a tap is answered where a
// press is a decision.
const hapticControls =
  ".tab-item, .tab, .chip, .btn, .favmark, .glassbtn, .avatarbtn, .iconbtn, .profile";

// Controls that complete something rather than open something. They answer
// when the deed is done, so they skip the press tick and take the outcome
// pattern on the click instead.
const hapticOutcomes = new Set([
  "confirm-withdraw",
  "confirm-user",
  "confirm-clear-favorites",
  "planning-solve",
  "export-job",
  "save-search",
  "csv",
]);

const isHapticOutcome = (el) =>
  hapticOutcomes.has(el.dataset.action || "") ||
  // A submit button is answered by the submit listener below, once the form
  // has actually been accepted.
  (el.form && (el.type === "submit" || !el.type));

function hapticKind(el) {
  // Moving between tabs or picking a filter is a selection, not an impact.
  if (el.matches(".tab-item, .tab, .chip")) return "select";
  // Marking an offer pops, un-marking stays quiet - the same asymmetry the
  // heart burst in 07-motion.css draws. `aria-pressed` is still the old
  // state here: the action handler has not run yet.
  if (el.dataset.action === "fav")
    return el.getAttribute("aria-pressed") === "true" ? "select" : "success";
  return "press";
}

// Under the finger, not after the render: the tick belongs to the press, and
// the capture phase runs before 09-actions.js redraws anything. Touch only -
// a mouse or a keyboard has no hand to answer.
document.addEventListener(
  "pointerdown",
  (e) => {
    if (e.pointerType !== "touch") return;
    const el = e.target.closest(hapticControls);
    if (!el || el.disabled || isHapticOutcome(el)) return;
    haptic(hapticKind(el));
  },
  true,
);

document.addEventListener(
  "click",
  (e) => {
    const el = e.target.closest("[data-action]");
    if (el && hapticOutcomes.has(el.dataset.action)) haptic("success");
  },
  true,
);

// No form carries `novalidate`, so a submit event means the browser has
// accepted the entries: the deed is done.
document.addEventListener("submit", () => haptic("success"), true);

// `invalid` does not bubble, but it can be captured. One refusal per attempt -
// a form with three empty fields fires it three times.
let hapticInvalid = null;
document.addEventListener(
  "invalid",
  () => {
    if (hapticInvalid) return;
    haptic("warn");
    hapticInvalid = setTimeout(() => (hapticInvalid = null), 400);
  },
  true,
);
