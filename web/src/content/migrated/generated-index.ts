import type { MigratedContentIndexRecord, MigratedContentRecord } from "./schema";
import { approvedContentById, approvedContentIndex } from "./approved/registry";

const generatedContentIndex: MigratedContentIndexRecord[] = [
  {
    contentId: "content-home",
    routeId: "route-home",
    routePath: "/",
    kind: "core",
    sourceFile: "index.html",
    sourceSha256: "b59036cd0c4ae0cc839df9b55f14f2d6c60640af614661f5aac0782b5a3fdbc4",
    modulePath: "./generated/company/home",
  },
  {
    contentId: "content-about",
    routeId: "route-about",
    routePath: "/about",
    kind: "core",
    sourceFile: "about.html",
    sourceSha256: "ba0168f4dcc465658e4794f9b850f1909f925e5c31f2fcfa4994f59c9226b73c",
    modulePath: "./generated/company/about",
  },
  {
    contentId: "content-services",
    routeId: "route-services",
    routePath: "/services",
    kind: "service",
    sourceFile: "services.html",
    sourceSha256: "f4646fce7cb1c86a25bafd9754ba8fddac5ed5b274a44ee870dbcd578f38f4e8",
    modulePath: "./generated/services/services",
  },
  {
    contentId: "content-pricing",
    routeId: "route-pricing",
    routePath: "/pricing",
    kind: "conversion",
    sourceFile: "pricing.html",
    sourceSha256: "2b4fc54fbbedfcbed806ee949ae9d2779ce393d5a9831b0880f93cf6248f8817",
    modulePath: "./generated/conversion/pricing",
  },
  {
    contentId: "content-blog",
    routeId: "route-blog",
    routePath: "/blog",
    kind: "core",
    sourceFile: "blog.html",
    sourceSha256: "77477e3ee9a94e1e31d182c131767fb5e5b6cba856356e583388f88068835de6",
    modulePath: "./generated/blog/blog",
  },
  {
    contentId: "content-book",
    routeId: "route-book",
    routePath: "/book",
    kind: "conversion",
    sourceFile: "book.html",
    sourceSha256: "e48e733010eb0bd3f98274109d088a89d276f172490de43859112e26b10e698c",
    modulePath: "./generated/conversion/book",
  },
  {
    contentId: "content-contact",
    routeId: "route-contact",
    routePath: "/contact",
    kind: "conversion",
    sourceFile: "contact.html",
    sourceSha256: "b5601f504d8087d1f36c75e3fd68a991c6b895f35705bdc9b588a5a57d9b70a0",
    modulePath: "./generated/conversion/contact",
  },
  {
    contentId: "content-privacy-policy",
    routeId: "route-privacy-policy",
    routePath: "/privacy-policy",
    kind: "legal",
    sourceFile: "privacy-policy.html",
    sourceSha256: "73c15b54df9aab3c975dcdb3ba2724fe238f2ed85244b5ab3e4af919b7adc41f",
    modulePath: "./generated/legal/privacy-policy",
  },
  {
    contentId: "content-services-dentists",
    routeId: "route-services-dentists",
    routePath: "/services/dentists",
    kind: "industry",
    sourceFile: "services/dentists.html",
    sourceSha256: "50f1b0eeb8fee0791efb6fc6f241719e8203df4b1fec5a719e90e663b3db6254",
    modulePath: "./generated/industries/dentists",
  },
  {
    contentId: "content-services-ecommerce",
    routeId: "route-services-ecommerce",
    routePath: "/services/ecommerce",
    kind: "industry",
    sourceFile: "services/ecommerce.html",
    sourceSha256: "2ea365fe126588fef82d3d66196a14d0a99e0ac551375bb63ef48d072c6c4611",
    modulePath: "./generated/industries/ecommerce",
  },
  {
    contentId: "content-services-estate-agents",
    routeId: "route-services-estate-agents",
    routePath: "/services/estate-agents",
    kind: "industry",
    sourceFile: "services/estate-agents.html",
    sourceSha256: "095cdbaa97f5aefb87742db0af4fdbbb8a713e58aed78a3185caa2755053398b",
    modulePath: "./generated/industries/estate-agents",
  },
  {
    contentId: "content-services-fitness-coaches",
    routeId: "route-services-fitness-coaches",
    routePath: "/services/fitness-coaches",
    kind: "industry",
    sourceFile: "services/fitness-coaches.html",
    sourceSha256: "39494c6baa86ec101ea27a80863bb5a39d26da90f842532c27d27ec702ee0281",
    modulePath: "./generated/industries/fitness-coaches",
  },
  {
    contentId: "content-services-gyms-fitness-studios",
    routeId: "route-services-gyms-fitness-studios",
    routePath: "/services/gyms-fitness-studios",
    kind: "industry",
    sourceFile: "services/gyms-fitness-studios.html",
    sourceSha256: "f92ff3fbe43b1ba1aaf21728a1686b2bcafe1ce0605fd0fa231f6a274ace666a",
    modulePath: "./generated/industries/gyms-fitness-studios",
  },
  {
    contentId: "content-services-hospitality",
    routeId: "route-services-hospitality",
    routePath: "/services/hospitality",
    kind: "industry",
    sourceFile: "services/hospitality.html",
    sourceSha256: "ec4424cb3b5fdf18e96e93ace6a255265b04570955aa4e0e34f59087a04294b4",
    modulePath: "./generated/industries/hospitality",
  },
  {
    contentId: "content-services-physios-chiropractors",
    routeId: "route-services-physios-chiropractors",
    routePath: "/services/physios-chiropractors",
    kind: "industry",
    sourceFile: "services/physios-chiropractors.html",
    sourceSha256: "001d65f146d7478f75d9bd75bccabc51464a6cf297a352430063a39d3fdbe3d8",
    modulePath: "./generated/industries/physios-chiropractors",
  },
  {
    contentId: "content-services-salons-barbers",
    routeId: "route-services-salons-barbers",
    routePath: "/services/salons-barbers",
    kind: "industry",
    sourceFile: "services/salons-barbers.html",
    sourceSha256: "1a37487bff97fe7a562d91f454fc0792c624d5cc29cb0662690d3ca37bd3043f",
    modulePath: "./generated/industries/salons-barbers",
  },
  {
    contentId: "content-services-trades",
    routeId: "route-services-trades",
    routePath: "/services/trades",
    kind: "industry",
    sourceFile: "services/trades.html",
    sourceSha256: "5a60c29493732cae605fbe64228311f5da6e73ce60540218fffc57914f926abc",
    modulePath: "./generated/industries/trades",
  },
];

const approvedContentIds = new Set(
  approvedContentIndex.map((record) => record.contentId),
);

export const migratedContentIndex: MigratedContentIndexRecord[] = [
  ...approvedContentIndex,
  ...generatedContentIndex.filter(
    (record) => !approvedContentIds.has(record.contentId),
  ),
];

const contentLoaders: Record<
  string,
  () => Promise<{ default: MigratedContentRecord }>
> = {
  "content-home": () => import("./generated/company/home"),
  "content-about": () => import("./generated/company/about"),
  "content-services": () => import("./generated/services/services"),
  "content-pricing": () => import("./generated/conversion/pricing"),
  "content-blog": () => import("./generated/blog/blog"),
  "content-book": () => import("./generated/conversion/book"),
  "content-contact": () => import("./generated/conversion/contact"),
  "content-privacy-policy": () => import("./generated/legal/privacy-policy"),
  "content-services-dentists": () => import("./generated/industries/dentists"),
  "content-services-ecommerce": () => import("./generated/industries/ecommerce"),
  "content-services-estate-agents": () =>
    import("./generated/industries/estate-agents"),
  "content-services-fitness-coaches": () =>
    import("./generated/industries/fitness-coaches"),
  "content-services-gyms-fitness-studios": () =>
    import("./generated/industries/gyms-fitness-studios"),
  "content-services-hospitality": () => import("./generated/industries/hospitality"),
  "content-services-physios-chiropractors": () =>
    import("./generated/industries/physios-chiropractors"),
  "content-services-salons-barbers": () =>
    import("./generated/industries/salons-barbers"),
  "content-services-trades": () => import("./generated/industries/trades"),
};

export async function loadMigratedContent(
  contentId: string,
): Promise<MigratedContentRecord> {
  const approved = approvedContentById[contentId];
  if (approved) {
    return approved;
  }

  const loader = contentLoaders[contentId];
  if (!loader) {
    throw new Error(`No migrated content module for ${contentId}`);
  }
  return (await loader()).default;
}
