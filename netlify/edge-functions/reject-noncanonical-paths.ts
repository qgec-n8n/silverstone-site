/**
 * Reject malformed URL variants without redirecting them onto canonical pages.
 * Canonical requests and normal static assets do not match this function's
 * narrow pattern and continue through Netlify's static request chain.
 */
export default function rejectNoncanonicalPath(
  request: Request,
): Response | undefined {
  const url = new URL(request.url);

  // Edge Functions run before redirects. Let the sole hostname redirect handle
  // every www request, including requests carrying query strings.
  if (url.hostname === "www.silverstone-ai.com") {
    return undefined;
  }

  const { pathname } = url;
  const isNoncanonical =
    (pathname !== "/" && pathname.endsWith("/")) ||
    pathname.includes("//") ||
    pathname.endsWith(".html");

  if (!isNoncanonical) {
    return undefined;
  }

  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export const config = {
  // Invoke only for non-root trailing slashes, repeated slashes, or .html
  // requests. Upper/mixed-case route variants miss the case-sensitive static
  // files naturally once Pretty URLs are disabled.
  pattern: "^(?:/.+/$|/.*\\.html$|.*//.*)$",
  method: ["GET", "HEAD"],
};
