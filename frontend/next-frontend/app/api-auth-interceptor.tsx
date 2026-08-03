"use client";

type PatchedWindow = Window & { __ertikazFetchPatched?: boolean };

if (
  typeof window !== "undefined" &&
  !(window as PatchedWindow).__ertikazFetchPatched
) {
  (window as PatchedWindow).__ertikazFetchPatched = true;
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
}

export default function ApiAuthInterceptor() {
  return null;
}
