// The password in front of the click dummy.
//
// The gate is a login page the Worker serves itself, and a cookie it hands out
// when the right user name and password arrive. Nothing of the site is sent
// before that cookie exists, so this is still the server refusing the request
// and not a screen drawn on top of it - there is no URL that gets around it.
//
// It used to be HTTP Basic authentication, and that breaks the installed app:
// an iOS home-screen app runs standalone, and WebKit does not open its
// password box there. The visitor got the bare 401 text with nothing to type
// into, and every launch after the app was killed showed it again. A login
// page and a cookie work the same in a tab and in the installed app.
//
// SITE_USER and SITE_PASS are secrets set in the Cloudflare dashboard
// (Settings - Variables and Secrets), never in this repository.

// An installed app asks for its icon and its manifest outside the page that
// was logged in, and those requests carry no credentials: answer them with 401
// and iOS drops a grey letter tile on the home screen instead of the app icon.
// These five files are served to anyone, so the installed app looks right. They
// are the NRW star and the app's name - no page, no content, no data.
const PUBLIC = new Set([
  "/manifest.webmanifest",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/icon-maskable-512.png",
  "/assets/apple-touch-icon.png",
]);

const LOGIN_PATH = "/__login";
const LOGOUT_PATH = "/__logout";

// The cookie holds a hash of the login, never the password itself, and lasts a
// year: the installed app is opened and killed over and over, and each launch
// must not start with a password box.
const COOKIE = "lzpd_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default {
  async fetch(request, env) {
    const { SITE_USER, SITE_PASS } = env;
    const url = new URL(request.url);
    const path = url.pathname;

    if (PUBLIC.has(path)) return env.ASSETS.fetch(request);

    // Before the secrets are set the site refuses everyone, rather than
    // letting everyone in.
    if (!SITE_USER || !SITE_PASS) return refuse(request, "");

    if (path === LOGOUT_PATH) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
          "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax`,
          "Cache-Control": "no-store",
        },
      });
    }

    const token = await hash(`${SITE_USER}:${SITE_PASS}`);

    if (path === LOGIN_PATH) {
      if (request.method !== "POST") return loginPage(next(url), "");

      const form = await request.formData();
      const user = String(form.get("user") || "");
      const pass = String(form.get("pass") || "");
      const target = safeNext(String(form.get("next") || "/"));

      if (user !== SITE_USER || pass !== SITE_PASS)
        return loginPage(target, "Benutzername oder Passwort stimmt nicht.", 401);

      return new Response(null, {
        status: 303,
        headers: {
          Location: target,
          "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${COOKIE_MAX_AGE}; Secure; HttpOnly; SameSite=Lax`,
          "Cache-Control": "no-store",
        },
      });
    }

    if (cookie(request, COOKIE) === token) return env.ASSETS.fetch(request);

    // Command-line tools and the odd desktop browser still send an
    // Authorization header; it is accepted, but never asked for - asking is
    // what opened the box the installed app cannot show.
    if (basic(request) === `${SITE_USER}:${SITE_PASS}`)
      return env.ASSETS.fetch(request);

    return refuse(request, path + url.search);
  },
};

// A page request gets the login page. A stylesheet, a script or an icon gets a
// short 401 instead: the service worker stores what comes back, and a login
// page stored under the name of a stylesheet would break the installed app.
function refuse(request, target) {
  if (isNavigation(request)) return loginPage(safeNext(target), "");

  return new Response("Dieser Entwurf ist passwortgeschützt.", {
    status: 401,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function isNavigation(request) {
  return (
    request.headers.get("Sec-Fetch-Mode") === "navigate" ||
    (request.method === "GET" &&
      (request.headers.get("Accept") || "").includes("text/html"))
  );
}

function next(url) {
  return safeNext(url.searchParams.get("next") || "/");
}

// Only a path on this site, so the form can never be turned into a redirect to
// somewhere else.
function safeNext(value) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith(LOGIN_PATH) || value.startsWith(LOGOUT_PATH)) return "/";
  return value;
}

function cookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

function basic(request) {
  const [scheme, encoded] = (
    request.headers.get("Authorization") || ""
  ).split(" ");
  if (scheme !== "Basic" || !encoded) return null;
  try {
    // atob gives bytes, not text: decode them as UTF-8 so a password with an
    // umlaut in it compares as what the visitor typed.
    return new TextDecoder().decode(
      Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
    );
  } catch {
    return null;
  }
}

async function hash(value) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function escape(value) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// The login page carries its own styles and registers no service worker: it is
// a single file that must render the moment it arrives, in a tab and in the
// installed app alike.
function loginPage(target, error, status = 200) {
  const body = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="theme-color" content="#ebecf0" />
    <meta name="robots" content="noindex" />
    <title>Anmeldung · iBMS 3.0</title>
    <link rel="icon" href="/assets/icon-192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="iBMS 3.0" />
    <style>
      :root { color-scheme: light dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: max(24px, env(safe-area-inset-top)) 16px
          max(24px, env(safe-area-inset-bottom));
        background: #ebecf0;
        color: #1c1d21;
        font: 400 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter,
          system-ui, sans-serif;
      }
      main {
        width: 100%;
        max-width: 360px;
        background: #fff;
        border-radius: 20px;
        padding: 28px 24px;
        box-shadow: 0 18px 40px rgba(20, 22, 30, 0.12);
      }
      img { width: 56px; height: 56px; border-radius: 14px; display: block; }
      h1 { font-size: 20px; margin: 16px 0 4px; }
      p.lead { margin: 0 0 20px; color: #5a5d67; font-size: 14px; }
      label { display: block; font-size: 13px; font-weight: 600; margin: 0 0 6px; }
      input {
        width: 100%;
        font-size: 16px;
        padding: 12px 14px;
        margin: 0 0 14px;
        border: 1px solid #d3d5dd;
        border-radius: 12px;
        background: #f7f8fa;
        color: inherit;
      }
      input:focus { outline: 2px solid #1b4d9b; outline-offset: 1px; }
      button {
        width: 100%;
        font: inherit;
        font-weight: 600;
        color: #fff;
        background: #1b4d9b;
        border: 0;
        border-radius: 12px;
        padding: 13px 16px;
        margin-top: 4px;
      }
      p.error {
        margin: 0 0 16px;
        padding: 10px 12px;
        border-radius: 10px;
        background: #fdecec;
        color: #8c1d1d;
        font-size: 14px;
      }
      @media (prefers-color-scheme: dark) {
        body { background: #131418; color: #f1f2f5; }
        main { background: #1d1f25; box-shadow: none; }
        p.lead { color: #a2a5b0; }
        input { background: #26282f; border-color: #383b44; }
        p.error { background: #3a1d1d; color: #ffb4b4; }
      }
    </style>
  </head>
  <body>
    <main>
      <img src="/assets/icon-192.png" alt="" />
      <h1>iBMS 3.0 · POLIZEI-ONLINE</h1>
      <p class="lead">Dieser Entwurf ist passwortgeschützt.</p>
      ${error ? `<p class="error">${escape(error)}</p>` : ""}
      <form method="post" action="${LOGIN_PATH}">
        <input type="hidden" name="next" value="${escape(target)}" />
        <label for="user">Benutzername</label>
        <input id="user" name="user" type="text" autocomplete="username"
               autocapitalize="none" autocorrect="off" spellcheck="false" required />
        <label for="pass">Passwort</label>
        <input id="pass" name="pass" type="password"
               autocomplete="current-password" required />
        <button type="submit">Anmelden</button>
      </form>
    </main>
  </body>
</html>
`;

  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Never let a browser, a proxy or the service worker keep the login
      // page, or it comes back after a correct login.
      "Cache-Control": "no-store",
    },
  });
}
