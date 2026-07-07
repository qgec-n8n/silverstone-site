import type { Config } from "@react-router/dev/config";
import { PUBLISHED_BLOG_POSTS } from "./src/data/blog-posts";
import futureRouteManifest from "./src/data/generated/future-route-manifest.json";

const approvedPrerenderPaths = [
  "/industries",
  "/industry",
  "/industry/estate-agents",
  "/industry/salons-barbers",
  "/industry/ecommerce",
  "/industry/dentists",
  "/industry/fitness-coaches",
  "/industry/hospitality",
  "/industry/trades",
  "/industry/physios-chiropractors",
  "/industry/gyms-fitness-studios",
  "/how-we-work",
  "/services/web-design-development",
  "/services/website-design-development",
  "/services/app-development",
  "/services/ai-voice-agents",
  "/services/ai-receptionists",
  "/services/content-creation",
  "/services/ai-automation",
  "/services/ai-agents-automation",
  "/services/ai-consulting",
];

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
  prerender: [
    ...futureRouteManifest.map((route) => route.path),
    ...approvedPrerenderPaths,
    ...PUBLISHED_BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  ],
  ssr: false,
} satisfies Config;
