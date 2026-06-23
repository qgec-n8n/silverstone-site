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
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-router",
        "framer-motion",
        "gsap",
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
