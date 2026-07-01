import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { fileURLToPath, URL } from "node:url";

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const robotsHeader = env.VITE_X_ROBOTS_TAG ?? "noindex,nofollow,noarchive";

  return {
    plugins: [
      stagingHeaders(robotsHeader),
      prototypeLiveReload(),
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
      sourcemap: false,
    },
  };
});
