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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const robotsHeader = env.VITE_X_ROBOTS_TAG ?? "noindex,nofollow,noarchive";

  return {
    plugins: [stagingHeaders(robotsHeader), tailwindcss(), reactRouter()],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
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
