"use client";

import { useEffect } from "react";

let patched = false;

export default function ApiAuthInterceptor() {
  useEffect(() => {
    if (patched) return;
    patched = true;
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      if (url.startsWith("/backend/") || url.startsWith("/backend?")) {
        const token = window.localStorage.getItem("ertikaz-token");
        if (token) {
          const headers = new Headers(
            init?.headers ?? (input instanceof Request ? input.headers : undefined)
          );
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          init = { ...init, headers };
        }
      }
      return originalFetch(input, init);
    };
  }, []);
  return null;
}
