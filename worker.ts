/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ASSETS: Fetcher;
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=(), payment=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    // MapLibre injects inline styles for the map canvas
    "style-src 'self' 'unsafe-inline'",
    // Map tiles from GSI; blob: for MapLibre's canvas image handling
    "img-src 'self' data: blob: https://cyberjapandata.gsi.go.jp",
    // Tile fetch requests
    "connect-src 'self' https://cyberjapandata.gsi.go.jp",
    // MapLibre creates Web Workers from blob: URLs; 'self' covers the Service Worker
    "worker-src blob: 'self'",
    "manifest-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join("; "),
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(key, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
