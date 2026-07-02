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
  route("blog/:slug", "../routes/blog/article.tsx"),
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
