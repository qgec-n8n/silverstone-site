import { index, route, type RouteConfig } from "@react-router/dev/routes";

const routes = [
  index("../routes/company/home.tsx"),
  route("about", "../routes/company/about.tsx"),
  route("how-we-work", "../routes/company/how-we-work.tsx"),
  route("services", "../routes/services/index.tsx"),
  route("services/:slug", "../routes/services/detail.tsx"),
  route("industry", "../routes/industries/index.tsx"),
  route("industry/:slug", "../routes/industries/detail.tsx"),
  route("industries", "../routes/industries/index.tsx", { id: "industries-hub-alias" }),
  route("blog", "../routes/blog/index.tsx"),
  // Article routes were removed at the 2026-07-07 blog teardown. When the
  // blog automation publishes its first article (route manifest entry +
  // content module), re-register: route("blog/:slug", "../routes/blog/article.tsx")
  // — with ssr:false the loader is only valid once at least one /blog/<slug>
  // path is prerendered again. Until then unknown /blog/* URLs 301 to /blog
  // at the CDN (netlify.toml) and hit the not-found route in the SPA.
  route("pricing", "../routes/conversion/pricing.tsx"),
  route("book", "../routes/conversion/book.tsx"),
  route("contact", "../routes/conversion/contact.tsx"),
  route("privacy-policy", "../routes/legal/privacy-policy.tsx"),
  route("*", "../routes/not-found.tsx"),
];

if (process.env.NODE_ENV !== "production") {
  routes.push(route("__components", "../routes/component-lab.tsx"));
}

export default routes satisfies RouteConfig;
