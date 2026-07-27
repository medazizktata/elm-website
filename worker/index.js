const SECURITY_HEADERS = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function withHeaders(response, extra = {}) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries({ ...SECURITY_HEADERS, ...extra })) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "theelmdesign.com") {
      url.hostname = "www.theelmdesign.com";
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    const extra = url.hostname.endsWith(".workers.dev")
      ? { "X-Robots-Tag": "noindex, nofollow" }
      : {};

    return withHeaders(response, extra);
  },
};
