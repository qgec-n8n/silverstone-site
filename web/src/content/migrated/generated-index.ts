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
  {
    contentId: "content-blog-ai-appointment-reminders-uk-2026",
    routeId: "route-blog-ai-appointment-reminders-uk-2026",
    routePath: "/blog/ai-appointment-reminders-uk-2026",
    kind: "article",
    sourceFile: "blog/ai-appointment-reminders-uk-2026.html",
    sourceSha256: "99e74f05fa70c32a9cb6d55dd179c947f481bf997d2e3dd22647f07b51febabd",
    modulePath: "./generated/blog/ai-appointment-reminders-uk-2026",
  },
  {
    contentId: "content-blog-ai-automation-failures-uk-smes-2026",
    routeId: "route-blog-ai-automation-failures-uk-smes-2026",
    routePath: "/blog/ai-automation-failures-uk-smes-2026",
    kind: "article",
    sourceFile: "blog/ai-automation-failures-uk-smes-2026.html",
    sourceSha256: "d34924bcfb1ee75cc02363c76456353336e963c20e8f8ab8ac77c72aeca0c6ed",
    modulePath: "./generated/blog/ai-automation-failures-uk-smes-2026",
  },
  {
    contentId: "content-blog-ai-automation-uk-gdpr-2026-sme-guide",
    routeId: "route-blog-ai-automation-uk-gdpr-2026-sme-guide",
    routePath: "/blog/ai-automation-uk-gdpr-2026-sme-guide",
    kind: "article",
    sourceFile: "blog/ai-automation-uk-gdpr-2026-sme-guide.html",
    sourceSha256: "4e9b0804dcd182ef5003b26eac934ffd5a8ed2702f144947f4a807df49fe83b8",
    modulePath: "./generated/blog/ai-automation-uk-gdpr-2026-sme-guide",
  },
  {
    contentId: "content-blog-ai-automations-physio-chiro-clinics-uk",
    routeId: "route-blog-ai-automations-physio-chiro-clinics-uk",
    routePath: "/blog/ai-automations-physio-chiro-clinics-uk",
    kind: "article",
    sourceFile: "blog/ai-automations-physio-chiro-clinics-uk.html",
    sourceSha256: "66eadacb1774d7d854d29a944a33c55a7acf93d2888a867a6ea618db1e45c8ed",
    modulePath: "./generated/blog/ai-automations-physio-chiro-clinics-uk",
  },
  {
    contentId: "content-blog-ai-booking-automation-uk-hospitality-2026",
    routeId: "route-blog-ai-booking-automation-uk-hospitality-2026",
    routePath: "/blog/ai-booking-automation-uk-hospitality-2026",
    kind: "article",
    sourceFile: "blog/ai-booking-automation-uk-hospitality-2026.html",
    sourceSha256: "ae124c89e83f8e7bd003e55c16a729afeabb58fb5fc43e3c95bdaaa0c9b042e0",
    modulePath: "./generated/blog/ai-booking-automation-uk-hospitality-2026",
  },
  {
    contentId: "content-blog-ai-call-answering-trades-uk",
    routeId: "route-blog-ai-call-answering-trades-uk",
    routePath: "/blog/ai-call-answering-trades-uk",
    kind: "article",
    sourceFile: "blog/ai-call-answering-trades-uk.html",
    sourceSha256: "7e5a5edb38fe705d944e58780aa901d9a29670af875350409e0aae5ebae39a6b",
    modulePath: "./generated/blog/ai-call-answering-trades-uk",
  },
  {
    contentId: "content-blog-ai-document-automation-uk-smes-2026",
    routeId: "route-blog-ai-document-automation-uk-smes-2026",
    routePath: "/blog/ai-document-automation-uk-smes-2026",
    kind: "article",
    sourceFile: "blog/ai-document-automation-uk-smes-2026.html",
    sourceSha256: "4a2eb6e98db45f370432734f53f463c832c4514533870d0bbac7255d814e3669",
    modulePath: "./generated/blog/ai-document-automation-uk-smes-2026",
  },
  {
    contentId: "content-blog-ai-etas-smart-scheduling-uk-trades-2026",
    routeId: "route-blog-ai-etas-smart-scheduling-uk-trades-2026",
    routePath: "/blog/ai-etas-smart-scheduling-uk-trades-2026",
    kind: "article",
    sourceFile: "blog/ai-etas-smart-scheduling-uk-trades-2026.html",
    sourceSha256: "c05d9c4757bc75e2bdca6727abf25d44f542395fead21b4e7c5de2f1300072fd",
    modulePath: "./generated/blog/ai-etas-smart-scheduling-uk-trades-2026",
  },
  {
    contentId: "content-blog-ai-guest-concierge-hotels-bbs-uk",
    routeId: "route-blog-ai-guest-concierge-hotels-bbs-uk",
    routePath: "/blog/ai-guest-concierge-hotels-bbs-uk",
    kind: "article",
    sourceFile: "blog/ai-guest-concierge-hotels-bbs-uk.html",
    sourceSha256: "3a5085e3609413cee58f1ef579ee8483f6ebb687f5eacec473b2512de0807880",
    modulePath: "./generated/blog/ai-guest-concierge-hotels-bbs-uk",
  },
  {
    contentId: "content-blog-ai-lead-capture-uk-trades-2026",
    routeId: "route-blog-ai-lead-capture-uk-trades-2026",
    routePath: "/blog/ai-lead-capture-uk-trades-2026",
    kind: "article",
    sourceFile: "blog/ai-lead-capture-uk-trades-2026.html",
    sourceSha256: "53b859e28ba6e421e5579ccb2c0fbe714cd46f5b48c35978b1204f30ec8ab7a2",
    modulePath: "./generated/blog/ai-lead-capture-uk-trades-2026",
  },
  {
    contentId: "content-blog-ai-lead-qualification-estate-agents-2026",
    routeId: "route-blog-ai-lead-qualification-estate-agents-2026",
    routePath: "/blog/ai-lead-qualification-estate-agents-2026",
    kind: "article",
    sourceFile: "blog/ai-lead-qualification-estate-agents-2026.html",
    sourceSha256: "24369fdee26409a6bec2f61b641ff517756c0bb5eba4f10c4b955a095732e599",
    modulePath: "./generated/blog/ai-lead-qualification-estate-agents-2026",
  },
  {
    contentId: "content-blog-ai-lead-scoring-fitness-coaches-uk",
    routeId: "route-blog-ai-lead-scoring-fitness-coaches-uk",
    routePath: "/blog/ai-lead-scoring-fitness-coaches-uk",
    kind: "article",
    sourceFile: "blog/ai-lead-scoring-fitness-coaches-uk.html",
    sourceSha256: "a23945267275645deefa3661c33014bc5327e0dc864fd51712269242ce001496",
    modulePath: "./generated/blog/ai-lead-scoring-fitness-coaches-uk",
  },
  {
    contentId: "content-blog-ai-missed-call-recovery-dentists-uk",
    routeId: "route-blog-ai-missed-call-recovery-dentists-uk",
    routePath: "/blog/ai-missed-call-recovery-dentists-uk",
    kind: "article",
    sourceFile: "blog/ai-missed-call-recovery-dentists-uk.html",
    sourceSha256: "fe1ac7f84439ff17a2a2bf1a2228dba77fe8ee4f352593fb5b7a53c0cefe1ba2",
    modulePath: "./generated/blog/ai-missed-call-recovery-dentists-uk",
  },
  {
    contentId: "content-blog-ai-no-show-reduction-uk-salons-barbers",
    routeId: "route-blog-ai-no-show-reduction-uk-salons-barbers",
    routePath: "/blog/ai-no-show-reduction-uk-salons-barbers",
    kind: "article",
    sourceFile: "blog/ai-no-show-reduction-uk-salons-barbers.html",
    sourceSha256: "7136ea3976dd10cf8651fecf57aefc11d34563915d11ccc595f749a0baa2abc7",
    modulePath: "./generated/blog/ai-no-show-reduction-uk-salons-barbers",
  },
  {
    contentId: "content-blog-ai-quote-follow-up-trades",
    routeId: "route-blog-ai-quote-follow-up-trades",
    routePath: "/blog/ai-quote-follow-up-trades",
    kind: "article",
    sourceFile: "blog/ai-quote-follow-up-trades.html",
    sourceSha256: "472750eb6f36740924cc46afa0e4cf6c5daf8b070768f3def004d6f997f6dfc3",
    modulePath: "./generated/blog/ai-quote-follow-up-trades",
  },
  {
    contentId: "content-blog-ai-rebooking-journeys-salons-uk",
    routeId: "route-blog-ai-rebooking-journeys-salons-uk",
    routePath: "/blog/ai-rebooking-journeys-salons-uk",
    kind: "article",
    sourceFile: "blog/ai-rebooking-journeys-salons-uk.html",
    sourceSha256: "c6e3f5fb91b5b7c2d5e025c5f3520872275d86fb65f5d0f4fb1a5f4151686d6c",
    modulePath: "./generated/blog/ai-rebooking-journeys-salons-uk",
  },
  {
    contentId: "content-blog-ai-receptionist-small-business-2026",
    routeId: "route-blog-ai-receptionist-small-business-2026",
    routePath: "/blog/ai-receptionist-small-business-2026",
    kind: "article",
    sourceFile: "blog/ai-receptionist-small-business-2026.html",
    sourceSha256: "c068a99f432db83a0b172bc42952528e067d550705474895967a52327b70728c",
    modulePath: "./generated/blog/ai-receptionist-small-business-2026",
  },
  {
    contentId: "content-blog-ai-receptionist-uk-costs-roi-2026",
    routeId: "route-blog-ai-receptionist-uk-costs-roi-2026",
    routePath: "/blog/ai-receptionist-uk-costs-roi-2026",
    kind: "article",
    sourceFile: "blog/ai-receptionist-uk-costs-roi-2026.html",
    sourceSha256: "058499c16a6e52fc6fad0122fa90649a2050e1d19445cd6fa32b617482f5b207",
    modulePath: "./generated/blog/ai-receptionist-uk-costs-roi-2026",
  },
  {
    contentId: "content-blog-ai-returns-triage-ecommerce-uk",
    routeId: "route-blog-ai-returns-triage-ecommerce-uk",
    routePath: "/blog/ai-returns-triage-ecommerce-uk",
    kind: "article",
    sourceFile: "blog/ai-returns-triage-ecommerce-uk.html",
    sourceSha256: "1f9ba75abe2a019a91894cef5645c6b5f63fff946ddf0d49c3952527c0e27c92",
    modulePath: "./generated/blog/ai-returns-triage-ecommerce-uk",
  },
  {
    contentId: "content-blog-ai-viewing-feedback-estate-agents-uk",
    routeId: "route-blog-ai-viewing-feedback-estate-agents-uk",
    routePath: "/blog/ai-viewing-feedback-estate-agents-uk",
    kind: "article",
    sourceFile: "blog/ai-viewing-feedback-estate-agents-uk.html",
    sourceSha256: "c37245a9213783054b11ff80385b4872f90ee1328bbbde1a31af1dbc781ce1c9",
    modulePath: "./generated/blog/ai-viewing-feedback-estate-agents-uk",
  },
  {
    contentId: "content-blog-ai-voice-agents-uk-smes-2026",
    routeId: "route-blog-ai-voice-agents-uk-smes-2026",
    routePath: "/blog/ai-voice-agents-uk-smes-2026",
    kind: "article",
    sourceFile: "blog/ai-voice-agents-uk-smes-2026.html",
    sourceSha256: "90562a78fbc3d918b73435e42dacc474e4ea10d13e2bd291e06c66d6fe6a1377",
    modulePath: "./generated/blog/ai-voice-agents-uk-smes-2026",
  },
  {
    contentId: "content-blog-ai-website-tools-uk-small-businesses-2026",
    routeId: "route-blog-ai-website-tools-uk-small-businesses-2026",
    routePath: "/blog/ai-website-tools-uk-small-businesses-2026",
    kind: "article",
    sourceFile: "blog/ai-website-tools-uk-small-businesses-2026.html",
    sourceSha256: "8031cfb6942242d1bfa2875f4ad77a04f13f1ecaf11d3c4772ef0a35ef66445f",
    modulePath: "./generated/blog/ai-website-tools-uk-small-businesses-2026",
  },
  {
    contentId: "content-blog-ai-win-back-journeys-gyms-uk",
    routeId: "route-blog-ai-win-back-journeys-gyms-uk",
    routePath: "/blog/ai-win-back-journeys-gyms-uk",
    kind: "article",
    sourceFile: "blog/ai-win-back-journeys-gyms-uk.html",
    sourceSha256: "53165787c735eebf09f806c52f7e69d7eb1d0af267806626e1e8d4bb32c16c98",
    modulePath: "./generated/blog/ai-win-back-journeys-gyms-uk",
  },
  {
    contentId: "content-blog-clinic-rebooking-physio-chiro-uk",
    routeId: "route-blog-clinic-rebooking-physio-chiro-uk",
    routePath: "/blog/clinic-rebooking-physio-chiro-uk",
    kind: "article",
    sourceFile: "blog/clinic-rebooking-physio-chiro-uk.html",
    sourceSha256: "a771cda771718e7fc58a46dea60c22763ede1fd9b18f211d4ef9c4dd6718aa7c",
    modulePath: "./generated/blog/clinic-rebooking-physio-chiro-uk",
  },
  {
    contentId: "content-blog-dental-intake-e-consent-automation-uk",
    routeId: "route-blog-dental-intake-e-consent-automation-uk",
    routePath: "/blog/dental-intake-e-consent-automation-uk",
    kind: "article",
    sourceFile: "blog/dental-intake-e-consent-automation-uk.html",
    sourceSha256: "bafc59ae5137e685c9aed668849867db7623046c20a73c3a4d11d387bb2faf99",
    modulePath: "./generated/blog/dental-intake-e-consent-automation-uk",
  },
  {
    contentId: "content-blog-dental-recall-automation-uk-2026",
    routeId: "route-blog-dental-recall-automation-uk-2026",
    routePath: "/blog/dental-recall-automation-uk-2026",
    kind: "article",
    sourceFile: "blog/dental-recall-automation-uk-2026.html",
    sourceSha256: "0250857197d5f32199ca1714b92a5c2bb45cd1b36eccc5acce0b6aed389931d8",
    modulePath: "./generated/blog/dental-recall-automation-uk-2026",
  },
  {
    contentId: "content-blog-dm-to-client-automation-uk-fitness-coaches-2026",
    routeId: "route-blog-dm-to-client-automation-uk-fitness-coaches-2026",
    routePath: "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
    kind: "article",
    sourceFile: "blog/dm-to-client-automation-uk-fitness-coaches-2026.html",
    sourceSha256: "b60d19261ced9c9f6cfb889a5eb0a68ea9860424ec64c4bfb1a883c881a48f44",
    modulePath: "./generated/blog/dm-to-client-automation-uk-fitness-coaches-2026",
  },
  {
    contentId: "content-blog-estate-agent-viewing-confirmations-uk",
    routeId: "route-blog-estate-agent-viewing-confirmations-uk",
    routePath: "/blog/estate-agent-viewing-confirmations-uk",
    kind: "article",
    sourceFile: "blog/estate-agent-viewing-confirmations-uk.html",
    sourceSha256: "7d95abe041ed88215b1b5f2c6519e66d87ed488dd26fd0ebb8b6899d153366d4",
    modulePath: "./generated/blog/estate-agent-viewing-confirmations-uk",
  },
  {
    contentId: "content-blog-gym-booking-automation-uk-gyms-studios-2026",
    routeId: "route-blog-gym-booking-automation-uk-gyms-studios-2026",
    routePath: "/blog/gym-booking-automation-uk-gyms-studios-2026",
    kind: "article",
    sourceFile: "blog/gym-booking-automation-uk-gyms-studios-2026.html",
    sourceSha256: "128ee7797fbfc70d921a1077f15e1a2f81bdf76277f25955ceb5a8540f9d14f6",
    modulePath: "./generated/blog/gym-booking-automation-uk-gyms-studios-2026",
  },
  {
    contentId: "content-blog-post-purchase-automation-uk-ecommerce-repeat-customers",
    routeId: "route-blog-post-purchase-automation-uk-ecommerce-repeat-customers",
    routePath: "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
    kind: "article",
    sourceFile: "blog/post-purchase-automation-uk-ecommerce-repeat-customers.html",
    sourceSha256: "380d58354161b1bc498bbc6d036117daf379ee13d30c7a9447638a4fbf10623b",
    modulePath:
      "./generated/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
  },
  {
    contentId: "content-blog-quote-chase-automation-uk-trades-accepted-jobs-2026",
    routeId: "route-blog-quote-chase-automation-uk-trades-accepted-jobs-2026",
    routePath: "/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
    kind: "article",
    sourceFile: "blog/quote-chase-automation-uk-trades-accepted-jobs-2026.html",
    sourceSha256: "f1f57c726ef347edc01201d6c6c7fc077107ff20e3b7da8b112a9162c1345d36",
    modulePath: "./generated/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
  },
  {
    contentId: "content-blog-quote-follow-up-automation-uk-trades-2026",
    routeId: "route-blog-quote-follow-up-automation-uk-trades-2026",
    routePath: "/blog/quote-follow-up-automation-uk-trades-2026",
    kind: "article",
    sourceFile: "blog/quote-follow-up-automation-uk-trades-2026.html",
    sourceSha256: "a7a414e8c2b0db307396bdc43935c29fb785903425c4b2ebe8ddfd644ee11a77",
    modulePath: "./generated/blog/quote-follow-up-automation-uk-trades-2026",
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
  "content-blog-ai-appointment-reminders-uk-2026": () =>
    import("./generated/blog/ai-appointment-reminders-uk-2026"),
  "content-blog-ai-automation-failures-uk-smes-2026": () =>
    import("./generated/blog/ai-automation-failures-uk-smes-2026"),
  "content-blog-ai-automation-uk-gdpr-2026-sme-guide": () =>
    import("./generated/blog/ai-automation-uk-gdpr-2026-sme-guide"),
  "content-blog-ai-automations-physio-chiro-clinics-uk": () =>
    import("./generated/blog/ai-automations-physio-chiro-clinics-uk"),
  "content-blog-ai-booking-automation-uk-hospitality-2026": () =>
    import("./generated/blog/ai-booking-automation-uk-hospitality-2026"),
  "content-blog-ai-call-answering-trades-uk": () =>
    import("./generated/blog/ai-call-answering-trades-uk"),
  "content-blog-ai-document-automation-uk-smes-2026": () =>
    import("./generated/blog/ai-document-automation-uk-smes-2026"),
  "content-blog-ai-etas-smart-scheduling-uk-trades-2026": () =>
    import("./generated/blog/ai-etas-smart-scheduling-uk-trades-2026"),
  "content-blog-ai-guest-concierge-hotels-bbs-uk": () =>
    import("./generated/blog/ai-guest-concierge-hotels-bbs-uk"),
  "content-blog-ai-lead-capture-uk-trades-2026": () =>
    import("./generated/blog/ai-lead-capture-uk-trades-2026"),
  "content-blog-ai-lead-qualification-estate-agents-2026": () =>
    import("./generated/blog/ai-lead-qualification-estate-agents-2026"),
  "content-blog-ai-lead-scoring-fitness-coaches-uk": () =>
    import("./generated/blog/ai-lead-scoring-fitness-coaches-uk"),
  "content-blog-ai-missed-call-recovery-dentists-uk": () =>
    import("./generated/blog/ai-missed-call-recovery-dentists-uk"),
  "content-blog-ai-no-show-reduction-uk-salons-barbers": () =>
    import("./generated/blog/ai-no-show-reduction-uk-salons-barbers"),
  "content-blog-ai-quote-follow-up-trades": () =>
    import("./generated/blog/ai-quote-follow-up-trades"),
  "content-blog-ai-rebooking-journeys-salons-uk": () =>
    import("./generated/blog/ai-rebooking-journeys-salons-uk"),
  "content-blog-ai-receptionist-small-business-2026": () =>
    import("./generated/blog/ai-receptionist-small-business-2026"),
  "content-blog-ai-receptionist-uk-costs-roi-2026": () =>
    import("./generated/blog/ai-receptionist-uk-costs-roi-2026"),
  "content-blog-ai-returns-triage-ecommerce-uk": () =>
    import("./generated/blog/ai-returns-triage-ecommerce-uk"),
  "content-blog-ai-viewing-feedback-estate-agents-uk": () =>
    import("./generated/blog/ai-viewing-feedback-estate-agents-uk"),
  "content-blog-ai-voice-agents-uk-smes-2026": () =>
    import("./generated/blog/ai-voice-agents-uk-smes-2026"),
  "content-blog-ai-website-tools-uk-small-businesses-2026": () =>
    import("./generated/blog/ai-website-tools-uk-small-businesses-2026"),
  "content-blog-ai-win-back-journeys-gyms-uk": () =>
    import("./generated/blog/ai-win-back-journeys-gyms-uk"),
  "content-blog-clinic-rebooking-physio-chiro-uk": () =>
    import("./generated/blog/clinic-rebooking-physio-chiro-uk"),
  "content-blog-dental-intake-e-consent-automation-uk": () =>
    import("./generated/blog/dental-intake-e-consent-automation-uk"),
  "content-blog-dental-recall-automation-uk-2026": () =>
    import("./generated/blog/dental-recall-automation-uk-2026"),
  "content-blog-dm-to-client-automation-uk-fitness-coaches-2026": () =>
    import("./generated/blog/dm-to-client-automation-uk-fitness-coaches-2026"),
  "content-blog-estate-agent-viewing-confirmations-uk": () =>
    import("./generated/blog/estate-agent-viewing-confirmations-uk"),
  "content-blog-gym-booking-automation-uk-gyms-studios-2026": () =>
    import("./generated/blog/gym-booking-automation-uk-gyms-studios-2026"),
  "content-blog-post-purchase-automation-uk-ecommerce-repeat-customers": () =>
    import("./generated/blog/post-purchase-automation-uk-ecommerce-repeat-customers"),
  "content-blog-quote-chase-automation-uk-trades-accepted-jobs-2026": () =>
    import("./generated/blog/quote-chase-automation-uk-trades-accepted-jobs-2026"),
  "content-blog-quote-follow-up-automation-uk-trades-2026": () =>
    import("./generated/blog/quote-follow-up-automation-uk-trades-2026"),
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
