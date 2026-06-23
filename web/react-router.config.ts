import type { Config } from "@react-router/dev/config";
import futureRouteManifest from "./src/data/generated/future-route-manifest.json";

export default {
  appDirectory: "src/app",
  buildDirectory: "build",
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
  prerender: futureRouteManifest.map((route) => route.path),
  ssr: false,
} satisfies Config;
