import type { Config } from "@react-router/dev/config";
import { PUBLISHED_BLOG_POSTS } from "./src/data/blog-posts";
import {
  approvedAdditionalRoutes,
  approvedRouteOverrides,
} from "./src/data/approved-routes";
import baselineRouteManifest from "./src/data/generated/future-route-manifest.json";

const overrideById = new Map(approvedRouteOverrides.map((route) => [route.id, route]));

const canonicalPrerenderPaths = [
  ...baselineRouteManifest.map(
    (route) => overrideById.get(route.id)?.path ?? route.path,
  ),
  ...approvedAdditionalRoutes.map((route) => route.path),
  ...PUBLISHED_BLOG_POSTS.map((post) => `/blog/${post.slug}`),
];

if (new Set(canonicalPrerenderPaths).size !== canonicalPrerenderPaths.length) {
  throw new Error("Canonical prerender paths must be unique");
}

for (const path of canonicalPrerenderPaths) {
  if (!path.startsWith("/") || (path !== "/" && path.endsWith("/"))) {
    throw new Error(`Invalid canonical prerender path: ${path}`);
  }
}

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
  prerender: canonicalPrerenderPaths,
  ssr: false,
} satisfies Config;
