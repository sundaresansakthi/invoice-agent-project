export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // serve invoices.json
    if (url.pathname === "/invoices") {
      return env.ASSETS.fetch("https://fake/invoices.json");
    }

    // serve payments.json
    if (url.pathname === "/payments") {
      return env.ASSETS.fetch("https://fake/payments.json");
    }

    // default → serve static asset (index.html, css, js)
    return env.ASSETS.fetch(request);
  }
};
