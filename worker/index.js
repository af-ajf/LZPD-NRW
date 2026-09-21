// The password in front of the click dummy.
//
// Answers every request with HTTP Basic authentication: the browser shows its
// own password box, and nothing of the site is sent until the right user name
// and password arrive. This is the server refusing the request, not a screen
// drawn on top of it - there is no URL that gets around it.
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

export default {
  async fetch(request, env) {
    const { SITE_USER, SITE_PASS } = env;

    if (PUBLIC.has(new URL(request.url).pathname))
      return env.ASSETS.fetch(request);

    // Before the secrets are set the site refuses everyone, rather than
    // letting everyone in.
    if (!SITE_USER || !SITE_PASS) return ask();

    const [scheme, encoded] = (
      request.headers.get("Authorization") || ""
    ).split(" ");
    if (scheme !== "Basic" || !encoded) return ask();

    let sent;
    try {
      // atob gives bytes, not text: decode them as UTF-8 so a password with
      // an umlaut in it compares as what the visitor typed.
      sent = new TextDecoder().decode(
        Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
      );
    } catch {
      return ask();
    }

    if (sent !== `${SITE_USER}:${SITE_PASS}`) return ask();

    return env.ASSETS.fetch(request);
  },
};

function ask() {
  return new Response("Dieser Entwurf ist passwortgeschützt.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="iBMS 3.0 Entwurf", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      // Never let a browser or proxy keep the refusal, or the password box
      // comes back after a correct login.
      "Cache-Control": "no-store",
    },
  });
}
