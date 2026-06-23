import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-book",
  routeId: "route-book",
  routePath: "/book",
  kind: "conversion",
  source: {
    routeKey: "canonical:/book",
    file: "book.html",
    sha256: "e48e733010eb0bd3f98274109d088a89d276f172490de43859112e26b10e698c",
    bytes: 15444,
    textSha256: "f11e36492dd69f4875400585977610b97cf3675c1f9f5dbba8accc80ad0d6b29",
    extractedBlockCount: 12,
  },
  metadata: {
    title: "Book an Automation Audit | Silverstone AI",
    description:
      "Book a free 30-minute automation audit with Silverstone AI to uncover quick wins and plan practical next steps.",
    canonical: "https://silverstone-ai.com/book",
    robots: "index, follow",
    author: null,
    openGraph: [
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "Silverstone AI",
      },
      {
        property: "og:url",
        content: "https://silverstone-ai.com/book",
      },
      {
        property: "og:title",
        content: "Book an Automation Audit | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Book a free 30-minute automation audit with Silverstone AI to uncover quick wins and plan practical next steps.",
      },
      {
        property: "og:image",
        content: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
      },
    ],
    twitter: [
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: "Book an Automation Audit | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Book a free 30-minute automation audit with Silverstone AI to uncover quick wins and plan practical next steps.",
      },
      {
        name: "twitter:image",
        content: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
      },
    ],
    other: [
      {
        key: "viewport",
        content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
      },
      {
        key: "yandex-verification",
        content: "fb2b6f788d990108",
      },
    ],
  },
  schema: [
    {
      order: 0,
      types: ["WebPage", "BreadcrumbList", "ListItem"],
      rawJson:
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/book#webpage",\n          "url": "https://silverstone-ai.com/book",\n          "name": "Book an Automation Audit - Silverstone AI",\n          "description": "Book a free 30-minute automation audit with Silverstone AI to uncover quick wins and plan practical next steps.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/#website"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/book#breadcrumb"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/book#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Book",\n              "item": "https://silverstone-ai.com/book"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/book#webpage",
            url: "https://silverstone-ai.com/book",
            name: "Book an Automation Audit - Silverstone AI",
            description:
              "Book a free 30-minute automation audit with Silverstone AI to uncover quick wins and plan practical next steps.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/#website",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/book#breadcrumb",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/book#breadcrumb",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://silverstone-ai.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Book",
                item: "https://silverstone-ai.com/book",
              },
            ],
          },
        ],
      },
    },
  ],
  headings: [
    {
      order: 0,
      level: 1,
      text: "Book your Silverstone AI automation audit",
    },
    {
      order: 1,
      level: 2,
      text: "What happens on your 30-minute automation audit",
    },
    {
      order: 2,
      level: 2,
      text: "Need a different route?",
    },
  ],
  sections: [
    {
      order: 0,
      sourceSelector: "section.hero.title-band",
      sourceId: null,
      sourceClasses: ["hero", "title-band"],
      heading: {
        level: 1,
        text: "Book your Silverstone AI automation audit",
      },
      blocks: [
        {
          type: "paragraph",
          order: 0,
          text: "HOME",
          segments: [
            {
              type: "text",
              value: "HOME",
            },
          ],
          sourceSelector: "a.hero-breadcrumb__link",
        },
        {
          type: "paragraph",
          order: 1,
          text: "Share a few details and we’ll use the call to spot the best first automation move.",
          segments: [
            {
              type: "text",
              value:
                "Share a few details and we’ll use the call to spot the best first automation move.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 1,
      sourceSelector: "section#discovery-call-section",
      sourceId: "discovery-call-section",
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "discovery-call-section",
      ],
      heading: {
        level: 2,
        text: "What happens on your 30-minute automation audit",
      },
      blocks: [
        {
          type: "heading",
          order: 2,
          level: 2,
          text: "What happens on your 30-minute automation audit",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 3,
          text: "The call is designed to give you a clear first step, not pressure you into a project before you are ready. We use the session to understand where time, leads, bookings, or follow-up are leaking, then map the automation move most likely to pay back first.",
          segments: [
            {
              type: "text",
              value:
                "The call is designed to give you a clear first step, not pressure you into a project before you are ready. We use the session to understand where time, leads, bookings, or follow-up are leaking, then map the automation move most likely to pay back first.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 4,
          text: "It is useful whether you want to move quickly, compare providers, or simply understand what a sensible AI starting point looks like for your business. If you speak to other agencies afterwards, you should still leave this call with a sharper brief, better questions, and a clearer benchmark for judging their advice.",
          segments: [
            {
              type: "text",
              value:
                "It is useful whether you want to move quickly, compare providers, or simply understand what a sensible AI starting point looks like for your business. If you speak to other agencies afterwards, you should still leave this call with a sharper brief, better questions, and a clearer benchmark for judging their advice.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 5,
          ordered: false,
          items: [
            {
              text: "Walk through the operational bottlenecks, response gaps, and admin drag slowing your business down.",
              segments: [
                {
                  type: "text",
                  value:
                    "Walk through the operational bottlenecks, response gaps, and admin drag slowing your business down.",
                },
              ],
            },
            {
              text: "Identify the first workflow to automate, why it matters, and how it should be sequenced.",
              segments: [
                {
                  type: "text",
                  value:
                    "Identify the first workflow to automate, why it matters, and how it should be sequenced.",
                },
              ],
            },
            {
              text: "Leave with practical recommendations you can use to compare quotes, providers, and delivery approaches.",
              segments: [
                {
                  type: "text",
                  value:
                    "Leave with practical recommendations you can use to compare quotes, providers, and delivery approaches.",
                },
              ],
            },
            {
              text: "Understand the likely rollout path, expected quick wins, and what should wait until later.",
              segments: [
                {
                  type: "text",
                  value:
                    "Understand the likely rollout path, expected quick wins, and what should wait until later.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
        {
          type: "paragraph",
          order: 6,
          text: "If Silverstone AI is the right fit, we can explain the next step and the likely scope. If not, you still leave with useful direction and no downside for taking the call.",
          segments: [
            {
              type: "text",
              value:
                "If Silverstone AI is the right fit, we can explain the next step and the likely scope. If not, you still leave with useful direction and no downside for taking the call.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 7,
          text: "If the calendar does not work, use the contact form and we’ll arrange a better time.",
          segments: [
            {
              type: "text",
              value: "If the calendar does not work, ",
            },
            {
              type: "link",
              text: "use the contact form",
              href: "/contact",
              sourceHref: "/contact",
              external: false,
              valid: true,
            },
            {
              type: "text",
              value: " and we’ll arrange a better time.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "interaction",
          order: 8,
          interactionId: "route-book-interaction-1",
          sourceSelector: "div.calendly-inline-widget",
        },
      ],
    },
    {
      order: 2,
      sourceSelector: "section.section.brand-gradient.animate",
      sourceId: null,
      sourceClasses: ["section", "brand-gradient", "animate"],
      heading: {
        level: 2,
        text: "Need a different route?",
      },
      blocks: [
        {
          type: "heading",
          order: 9,
          level: 2,
          text: "Need a different route?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 10,
          text: "Use the contact page if you want to ask a question first or arrange another slot.",
          segments: [
            {
              type: "text",
              value:
                "Use the contact page if you want to ask a question first or arrange another slot.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 11,
          text: "Contact Silverstone AI",
          segments: [
            {
              type: "text",
              value: "Contact Silverstone AI",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
      ],
    },
  ],
  links: [
    {
      order: 0,
      text: "use the contact form",
      sourceHref: "/contact",
      migratedHref: "/contact",
      external: false,
      valid: true,
    },
  ],
  assets: [],
  interactions: [
    {
      id: "route-book-interaction-1",
      type: "embed",
      provider: "Calendly",
      sourceSelector: "div.calendly-inline-widget",
      sourceAction: null,
      sourceUrl:
        "https://calendly.com/silverstone-ai/30min?hide_landing_page_details=1&hide_event_type_details=1&primary_color=00FF9D",
      fields: [],
      active: false,
    },
  ],
  flags: {
    contentStatus: "retain",
    claimsStatus: "review-pending",
    riskNotes: "2 images lack width/height",
    unresolvedNotes: [],
  },
};

export default content;
