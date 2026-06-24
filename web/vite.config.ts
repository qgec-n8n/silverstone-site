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
      // Pre-bundle every runtime dependency that appears in the SSR'd route tree
      // so Vite never discovers one mid-session. Late discovery triggers a
      // re-optimize + full reload, and during that window two React copies
      // briefly coexist — surfacing as "Invalid hook call (more than one copy
      // of React)" + hydration failure, which blanks the Preview iframe. The
      // UI deps below are pulled in by shared primitives (Breadcrumb, TextLink,
      // icons, variant helpers) mounted across the routes.
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-router",
        "framer-motion",
        "gsap",
        "gsap/ScrollTrigger",
        "@gsap/react",
        "lenis",
        "radix-ui",
        "lucide-react",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        // Heavy V2 home visual deps. Pre-bundle so the first lazy mount of the
        // WebGL hero does not trigger a mid-session re-optimize + full reload
        // (which briefly loads two React copies → "Invalid hook call").
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
