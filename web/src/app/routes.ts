import { index, route, type RouteConfig } from "@react-router/dev/routes";

const routes = [index("../routes/home.tsx")];

if (process.env.NODE_ENV !== "production") {
  routes.push(route("__components", "../routes/component-lab.tsx"));
}

export default routes satisfies RouteConfig;
