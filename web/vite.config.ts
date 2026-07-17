import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { readFileSync } from "node:fs";
import type { ServerResponse } from "node:http";
import { fileURLToPath, pathToFileURL, URL } from "node:url";

function stagingHeaders(robotsHeader: string): Plugin {
  return {
    name: "silverstone-staging-headers",
    configureServer(server) {
      server.middlewares.use((_request, response, next) => {
        response.setHeader("X-Robots-Tag", robotsHeader);
        next();
      });
    },
  };
}

// Dev-only: static prototype files under public/prototypes/** are not part of
// Vite's module graph, so editing them does not trigger HMR. This watches that
// directory and fires a full page reload so the Preview live-updates on edits.
function prototypeLiveReload(): Plugin {
  return {
    name: "silverstone-prototype-live-reload",
    apply: "serve",
    configureServer(server) {
      const prototypesDir = fileURLToPath(
        new URL("./public/prototypes", import.meta.url),
      );
      server.watcher.add(prototypesDir);
      const triggerReload = (file: string) => {
        const normalized = file.replace(/\\/g, "/");
        if (normalized.includes("/public/prototypes/")) {
          const rel = normalized.slice(normalized.indexOf("public/"));
          server.config.logger.info(`[prototype] change → full reload (${rel})`, {
            timestamp: true,
          });
          server.hot.send({ type: "full-reload", path: "*" });
        }
      };
      server.watcher.on("change", triggerReload);
      server.watcher.on("add", triggerReload);
      server.watcher.on("unlink", triggerReload);
    },
  };
}

/* Dev-only bridge for the repo's Netlify booking functions: the plain Vite
 * dev server has no /.netlify/functions runtime, so the booking console can
 * never exercise the real availability/booking pipeline locally. This
 * middleware imports the two Calendly handlers from the repo root and adapts
 * Node requests to their event shape. Server-only credentials come from the
 * root .env (exactly the file `netlify dev` would use); nothing here is
 * reachable in a build — the plugin only applies to `serve`.
 *
 * The bridge runs the functions in live mode only when the developer has
 * opted in with VITE_DEV_BOOKING_MODE=live (web/.env.staging.local); the
 * functions themselves fall back to their deterministic server mocks
 * otherwise.
 */
function netlifyBookingFunctionsBridge(devBookingMode: string): Plugin {
  const FUNCTION_ALLOW_LIST = new Set(["calendly-availability", "calendly-book"]);

  type NetlifyEvent = {
    httpMethod: string;
    headers: Record<string, string>;
    queryStringParameters: Record<string, string>;
    body?: string;
  };
  type NetlifyResult = {
    statusCode: number;
    headers?: Record<string, string>;
    body?: string;
  };
  type NetlifyFunctionModule = {
    handler: (event: NetlifyEvent) => Promise<NetlifyResult>;
  };

  function loadRootServerEnv(): void {
    let raw: string;
    try {
      raw = readFileSync(fileURLToPath(new URL("../.env", import.meta.url)), "utf8");
    } catch {
      return; // No root .env — the functions answer with SERVER_MISCONFIGURED.
    }
    for (const line of raw.split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/u.exec(line);
      if (!match) continue;
      const [, key, value] = match;
      if (key && value !== undefined && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }

  return {
    name: "silverstone-netlify-booking-bridge",
    apply: "serve",
    configureServer(server) {
      loadRootServerEnv();
      if (
        devBookingMode === "live" &&
        process.env.CALENDLY_BOOKING_MODE === undefined
      ) {
        process.env.CALENDLY_BOOKING_MODE = "live";
      }

      server.middlewares.use(
        "/.netlify/functions",
        (request, response: ServerResponse, next) => {
          const url = new URL(request.url ?? "/", "http://localhost");
          const name = url.pathname.replace(/^\/+/u, "").split("/")[0] ?? "";
          if (!FUNCTION_ALLOW_LIST.has(name)) {
            next();
            return;
          }

          const chunks: Buffer[] = [];
          request.on("data", (chunk: Buffer) => chunks.push(chunk));
          request.on("end", () => {
            void (async () => {
              const moduleUrl = new URL(
                `../netlify/functions/${name}.mjs`,
                import.meta.url,
              );
              const { handler } = (await import(
                pathToFileURL(fileURLToPath(moduleUrl)).href
              )) as NetlifyFunctionModule;
              const headers: Record<string, string> = {};
              for (const [key, value] of Object.entries(request.headers)) {
                if (typeof value === "string") headers[key] = value;
                else if (Array.isArray(value)) headers[key] = value.join(", ");
              }
              const result = await handler({
                httpMethod: request.method ?? "GET",
                headers,
                queryStringParameters: Object.fromEntries(url.searchParams),
                ...(chunks.length > 0
                  ? { body: Buffer.concat(chunks).toString("utf8") }
                  : {}),
              });
              response.statusCode = result.statusCode;
              for (const [key, value] of Object.entries(result.headers ?? {})) {
                response.setHeader(key, value);
              }
              response.end(result.body ?? "");
            })().catch((error: unknown) => {
              server.config.logger.error(
                `[netlify-bridge] ${name} failed: ${String(error)}`,
              );
              response.statusCode = 500;
              response.setHeader("Content-Type", "application/json; charset=utf-8");
              response.end(
                JSON.stringify({
                  ok: false,
                  error: {
                    code: "UPSTREAM_UNAVAILABLE",
                    message: "The local booking bridge failed.",
                    retryable: true,
                  },
                }),
              );
            });
          });
        },
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const robotsHeader = env.VITE_X_ROBOTS_TAG ?? "noindex,nofollow,noarchive";
  // One build-stable UTC date is compiled into both prerender and client code.
  // Weekly featured editions can therefore activate by date without a live
  // clock read during hydration.
  const silverstoneBuildDate = new Date().toISOString().slice(0, 10);

  return {
    define: {
      __SILVERSTONE_BUILD_DATE__: JSON.stringify(silverstoneBuildDate),
    },
    plugins: [
      stagingHeaders(robotsHeader),
      prototypeLiveReload(),
      netlifyBookingFunctionsBridge(env.VITE_DEV_BOOKING_MODE ?? ""),
      tailwindcss(),
      reactRouter(),
    ],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      // All deps that could be lazily discovered via v8_splitRouteModules
      // route chunks are pre-declared here so Vite bundles them during the
      // initial crawl rather than discovering them mid-session.
      //
      // Mid-session dep discovery triggers Vite re-optimization; in the window
      // between the old and new bundles landing in the browser two copies of
      // React briefly coexist → "Invalid hook call" → the CoreSpinLoader state
      // machine never advances → all service-page content stays hidden.
      //
      // holdUntilCrawlEnd (default: true in Vite 5.3+) protects cold starts:
      // the server holds requests until the initial crawl + bundle is complete
      // so the browser always gets a coherent single-React dep set.
      //
      // Do NOT add force: true — it re-runs optimization at every server start
      // in the background while the browser is already serving the page.  That
      // creates the same duplicate-React window at ~4 s into every page load,
      // which coincides exactly with the CoreSpinLoader dismiss timer.
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-router",
        "motion/react",
        "motion/react-m",
        "gsap",
        "gsap/ScrollTrigger",
        "@gsap/react",
        "lenis",
        "radix-ui",
        "lucide-react",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        // Heavy V2 home visual deps — WebGL hero is lazily mounted; without
        // pre-bundling the first mount triggers mid-session re-optimization.
        "three",
        "@react-three/fiber",
        "@react-three/drei",
        "@react-three/postprocessing",
        "postprocessing",
        "maath",
        "maath/random",
        "@paper-design/shaders-react",
        // Botpress webchat client — mounted from the lazy Sam messaging demo
        // chunk on /services/ai-receptionists.
        "@botpress/webchat",
        "use-stick-to-bottom",
      ],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
      headers: {
        "X-Robots-Tag": robotsHeader,
      },
    },
    preview: {
      host: "0.0.0.0",
      headers: {
        "X-Robots-Tag": robotsHeader,
      },
    },
    build: {
      // The two largest assets are intentionally lazy, opt-in demo runtimes:
      // ElevenLabs + its WebGL orb (~1.41 MB raw) and Botpress (~0.95 MB raw).
      // Vite's default 500 kB warning targets general entry chunks, but these
      // never enter the foundation download. Keep their existing lazy loading
      // graph intact and let scripts/report-bundle.mjs enforce the stricter
      // gzip budget for JavaScript every visitor actually receives.
      chunkSizeWarningLimit: 1500,
      sourcemap: false,
    },
  };
});
