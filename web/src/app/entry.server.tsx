import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

/*
 * With `ssr: false` this entry runs only at build time, while `react-router
 * build` prerenders the configured paths. The default entry pipes at
 * `onShellReady` for non-bot requests, which writes every pending Suspense
 * boundary as its fallback plus a hidden late segment and an inline `$RC`
 * swap script. Each service composition is a `lazy()` chunk behind Suspense
 * (see `services-v2/service-experience.tsx`), so the prerendered files
 * carried the loading fallback as the visible content — two H1s per page and
 * a body that only appears once inline scripts execute.
 *
 * Piping at `onAllReady` instead makes React emit fully resolved boundaries
 * inline, so the static HTML contains each route's complete content before
 * any JavaScript runs. Hydration is unaffected: the client still treats the
 * resolved boundaries as dehydrated Suspense content and hydrates them when
 * their chunks load.
 *
 * `progressiveChunkSize` must be raised alongside: React "outlines" any
 * completed boundary larger than that size (default ~12.5KB) into a hidden
 * late segment plus swap script even when nothing has flushed yet — and a
 * full service composition is far larger than the default. Static files gain
 * nothing from progressive reveal, so effectively disable the heuristic.
 */
const PRERENDER_PROGRESSIVE_CHUNK_SIZE = 32 * 1024 * 1024;
export const streamTimeout = 10_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  return new Promise((resolve, reject) => {
    let allReady = false;

    // Abort after `streamTimeout` so rejected boundaries still flush their
    // fallbacks instead of hanging the build.
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => abort(),
      streamTimeout + 1000,
    );

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        progressiveChunkSize: PRERENDER_PROGRESSIVE_CHUNK_SIZE,
        onAllReady() {
          allReady = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = undefined;
              callback();
            },
          });
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          pipe(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
        },
        onShellError(error: unknown) {
          reject(error instanceof Error ? error : new Error(String(error)));
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (allReady) {
            console.error(error);
          }
        },
      },
    );
  });
}
