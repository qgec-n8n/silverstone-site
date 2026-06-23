import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-fitness-coaches",
  routeId: "route-services-fitness-coaches",
  routePath: "/services/fitness-coaches",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/fitness-coaches",
    file: "services/fitness-coaches.html",
    sha256: "39494c6baa86ec101ea27a80863bb5a39d26da90f842532c27d27ec702ee0281",
    bytes: 35502,
    textSha256: "578624a0f86580a6a9b613d4abf9ab4e052f6e196cf17abe0fd2a26820cbced0",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Fitness Coaches | Silverstone AI",
    description:
      "Silverstone AI helps UK fitness coaches automate DMs, lead follow-up, and onboarding so more conversations turn into paid clients.",
    canonical: "https://silverstone-ai.com/services/fitness-coaches",
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
        content: "https://silverstone-ai.com/services/fitness-coaches",
      },
      {
        property: "og:title",
        content: "AI Automation for Fitness Coaches | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK fitness coaches automate DMs, lead follow-up, and onboarding so more conversations turn into paid clients.",
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
        content: "AI Automation for Fitness Coaches | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK fitness coaches automate DMs, lead follow-up, and onboarding so more conversations turn into paid clients.",
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
      types: [
        "WebPage",
        "Service",
        "Audience",
        "Offer",
        "ReserveAction",
        "BreadcrumbList",
        "ListItem",
      ],
      rawJson:
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/fitness-coaches#webpage",\n          "url": "https://silverstone-ai.com/services/fitness-coaches",\n          "name": "Fitness Coach Automation - Silverstone AI",\n          "description": "Silverstone AI automation for fitness coaches: turn DMs into qualified leads, respond faster, and convert more enquiries into clients.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/fitness-coaches#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/fitness-coaches#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/fitness-coaches#service",\n          "name": "Fitness Coach Automation - Silverstone AI",\n          "serviceType": "Automation for Fitness Coaches",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/fitness-coaches",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/fitness-coaches#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK fitness coaches and creators"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-fitness-coaches",\n            "description": "Setup fee plus monthly retainer options for fitness-coach automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/fitness-coaches#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Fitness Coaches",\n              "item": "https://silverstone-ai.com/services/fitness-coaches"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/fitness-coaches#webpage",
            url: "https://silverstone-ai.com/services/fitness-coaches",
            name: "Fitness Coach Automation - Silverstone AI",
            description:
              "Silverstone AI automation for fitness coaches: turn DMs into qualified leads, respond faster, and convert more enquiries into clients.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/fitness-coaches#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/fitness-coaches#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/fitness-coaches#service",
            name: "Fitness Coach Automation - Silverstone AI",
            serviceType: "Automation for Fitness Coaches",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/fitness-coaches",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/fitness-coaches#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK fitness coaches and creators",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-fitness-coaches",
              description:
                "Setup fee plus monthly retainer options for fitness-coach automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/fitness-coaches#breadcrumb",
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
                name: "Services",
                item: "https://silverstone-ai.com/services",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Fitness Coaches",
                item: "https://silverstone-ai.com/services/fitness-coaches",
              },
            ],
          },
        ],
      },
    },
    {
      order: 1,
      types: ["FAQPage", "Question", "Answer"],
      rawJson:
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Which platforms can this support?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We focus on the channels you actually use – typically a mix of messaging apps, email and forms. Where direct integrations are not available, we use simple bridges so that key events still trigger the right steps."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will this make my messages feel less personal?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. We build from your own language and keep automation focused on the parts that are repetitive. You still step in for deeper conversations, voice notes and coaching decisions."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What if my offers change frequently?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We can design flows that are easy to adjust when you launch new programmes, change pricing or open different containers. You are not locked into one structure forever."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Do I need a big team to manage this?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. The whole point is to reduce the need for extra admin support. You may still choose to have an assistant help with some replies, but the system aims to make their job far easier."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can I still reply manually whenever I want?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Absolutely. You can jump into any conversation at any time. Automation simply ensures the basics are handled quickly and consistently."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How do we measure if it is working?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We track simple but important numbers such as response times, number of qualified leads and client sign-ups attributed to automated journeys. You see these in clear summaries rather than complex dashboards."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Which platforms can this support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We focus on the channels you actually use – typically a mix of messaging apps, email and forms. Where direct integrations are not available, we use simple bridges so that key events still trigger the right steps.",
            },
          },
          {
            "@type": "Question",
            name: "Will this make my messages feel less personal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. We build from your own language and keep automation focused on the parts that are repetitive. You still step in for deeper conversations, voice notes and coaching decisions.",
            },
          },
          {
            "@type": "Question",
            name: "What if my offers change frequently?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We can design flows that are easy to adjust when you launch new programmes, change pricing or open different containers. You are not locked into one structure forever.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need a big team to manage this?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The whole point is to reduce the need for extra admin support. You may still choose to have an assistant help with some replies, but the system aims to make their job far easier.",
            },
          },
          {
            "@type": "Question",
            name: "Can I still reply manually whenever I want?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely. You can jump into any conversation at any time. Automation simply ensures the basics are handled quickly and consistently.",
            },
          },
          {
            "@type": "Question",
            name: "How do we measure if it is working?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We track simple but important numbers such as response times, number of qualified leads and client sign-ups attributed to automated journeys. You see these in clear summaries rather than complex dashboards.",
            },
          },
        ],
      },
    },
  ],
  headings: [
    {
      order: 0,
      level: 1,
      text: "Fitness coaches: turn DMs into paying clients on autopilot.",
    },
    {
      order: 1,
      level: 2,
      text: "Your inbox shouldn’t decide your income.",
    },
    {
      order: 2,
      level: 3,
      text: "Where leads go cold.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘DM to Client Conversion Kit’",
    },
    {
      order: 4,
      level: 3,
      text: "Turn DMs into a pipeline",
    },
    {
      order: 5,
      level: 2,
      text: "Speed to lead wins more coaching sales",
    },
    {
      order: 6,
      level: 2,
      text: "More clients, less inbox overwhelm",
    },
    {
      order: 7,
      level: 3,
      text: "Protect your energy and revenue",
    },
    {
      order: 8,
      level: 2,
      text: "Creator-friendly setup in four steps",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Design your lead journeys",
    },
    {
      order: 11,
      level: 4,
      text: "Connect and test",
    },
    {
      order: 12,
      level: 4,
      text: "Roll out and refine",
    },
    {
      order: 13,
      level: 2,
      text: "On-brand, under your control",
    },
    {
      order: 14,
      level: 4,
      text: "Replies sound like you",
    },
    {
      order: 15,
      level: 4,
      text: "You choose the handover points",
    },
    {
      order: 16,
      level: 4,
      text: "Respect platform rules",
    },
    {
      order: 17,
      level: 4,
      text: "Start small, grow over time",
    },
    {
      order: 18,
      level: 2,
      text: "Creator Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to stop leaving money in your DMs?",
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
        text: "Fitness coaches: turn DMs into paying clients on autopilot.",
      },
      blocks: [
        {
          type: "paragraph",
          order: 0,
          text: "Home",
          segments: [
            {
              type: "text",
              value: "Home",
            },
          ],
          sourceSelector: "a.hero-breadcrumb__link",
        },
        {
          type: "paragraph",
          order: 1,
          text: "Services",
          segments: [
            {
              type: "text",
              value: "Services",
            },
          ],
          sourceSelector: "a.hero-breadcrumb__link",
        },
        {
          type: "paragraph",
          order: 2,
          text: "A DM and lead-handling system that replies fast, filters time-wasters, and guides serious people to become clients.",
          segments: [
            {
              type: "text",
              value:
                "A DM and lead-handling system that replies fast, filters time-wasters, and guides serious people to become clients.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: coaches and creators handling DMs, qualification, onboarding, and nurture.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: coaches and creators handling DMs, qualification, onboarding, and nurture.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free creator automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free creator automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘DM to Client Conversion Kit’",
          segments: [
            {
              type: "text",
              value: "See the ‘DM to Client Conversion Kit’",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
      ],
    },
    {
      order: 1,
      sourceSelector: "section.section.bg-lines.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Your inbox shouldn’t decide your income.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Your inbox shouldn’t decide your income.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "When DMs, comments and emails pile up, warm leads cool off and onboarding becomes inconsistent.",
          segments: [
            {
              type: "text",
              value:
                "When DMs, comments and emails pile up, warm leads cool off and onboarding becomes inconsistent.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where leads go cold.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "When DMs, comments, and emails pile up, warm prospects lose momentum before you ever qualify them.",
          segments: [
            {
              type: "text",
              value:
                "When DMs, comments, and emails pile up, warm prospects lose momentum before you ever qualify them.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 10,
          ordered: false,
          items: [
            {
              text: "Your inbox fills faster than you can prioritise it.",
              segments: [
                {
                  type: "text",
                  value: "Your inbox fills faster than you can prioritise it.",
                },
              ],
            },
            {
              text: "Voice notes, comments, and email leads live in different places.",
              segments: [
                {
                  type: "text",
                  value:
                    "Voice notes, comments, and email leads live in different places.",
                },
              ],
            },
            {
              text: "Slow replies kill momentum for warm prospects.",
              segments: [
                {
                  type: "text",
                  value: "Slow replies kill momentum for warm prospects.",
                },
              ],
            },
            {
              text: "Onboarding is manual and slightly different every time.",
              segments: [
                {
                  type: "text",
                  value: "Onboarding is manual and slightly different every time.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
      ],
    },
    {
      order: 2,
      sourceSelector: "section.section.bg-circuit.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-circuit",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "The ‘DM to Client Conversion Kit’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘DM to Client Conversion Kit’",
          sourceSelector: "h2#dm-to-client-conversion-kit",
        },
        {
          type: "paragraph",
          order: 12,
          text: "A simple system that turns your inbox into a clear pipeline — with fast first replies, screening questions and consistent follow-up.",
          segments: [
            {
              type: "text",
              value:
                "A simple system that turns your inbox into a clear pipeline — with fast first replies, screening questions and consistent follow-up.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Turn DMs into a pipeline",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This system sends first replies, asks fit questions, and routes serious prospects to the next step.",
          segments: [
            {
              type: "text",
              value:
                "This system sends first replies, asks fit questions, and routes serious prospects to the next step.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 15,
          ordered: false,
          items: [
            {
              text: "Fast first-response messages for coaching and offer enquiries.",
              segments: [
                {
                  type: "text",
                  value:
                    "Fast first-response messages for coaching and offer enquiries.",
                },
              ],
            },
            {
              text: "Screening questions for goals, timing, budget, and fit.",
              segments: [
                {
                  type: "text",
                  value: "Screening questions for goals, timing, budget, and fit.",
                },
              ],
            },
            {
              text: "Routing to application forms, booking links, or direct checkout.",
              segments: [
                {
                  type: "text",
                  value:
                    "Routing to application forms, booking links, or direct checkout.",
                },
              ],
            },
            {
              text: "Simple tagging so you know who to prioritise next.",
              segments: [
                {
                  type: "text",
                  value: "Simple tagging so you know who to prioritise next.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
      ],
    },
    {
      order: 3,
      sourceSelector: "section.section.bg-lines.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Speed to lead wins more coaching sales",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Speed to lead wins more coaching sales",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Fast replies and consistent follow-up unlock more revenue from the same audience.",
          segments: [
            {
              type: "text",
              value:
                "Fast replies and consistent follow-up unlock more revenue from the same audience.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
      ],
    },
    {
      order: 4,
      sourceSelector: "section.section.bg-circuit.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-circuit",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "More clients, less inbox overwhelm",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "More clients, less inbox overwhelm",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Turn warm conversations into sales while protecting your time for coaching and content.",
          segments: [
            {
              type: "text",
              value:
                "Turn warm conversations into sales while protecting your time for coaching and content.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Protect your energy and revenue",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Automation handles the repetitive conversion work so you can coach, create, and close with focus.",
          segments: [
            {
              type: "text",
              value:
                "Automation handles the repetitive conversion work so you can coach, create, and close with focus.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 22,
          ordered: false,
          items: [
            {
              text: "More warm DMs turn into applications, calls, and sales.",
              segments: [
                {
                  type: "text",
                  value: "More warm DMs turn into applications, calls, and sales.",
                },
              ],
            },
            {
              text: "Replies stay fast without you living on your phone.",
              segments: [
                {
                  type: "text",
                  value: "Replies stay fast without you living on your phone.",
                },
              ],
            },
            {
              text: "You get a clearer view of serious leads in the pipeline.",
              segments: [
                {
                  type: "text",
                  value: "You get a clearer view of serious leads in the pipeline.",
                },
              ],
            },
            {
              text: "More time stays protected for coaching, content, and training.",
              segments: [
                {
                  type: "text",
                  value:
                    "More time stays protected for coaching, content, and training.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
      ],
    },
    {
      order: 5,
      sourceSelector: "section.section.bg-lines.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Creator-friendly setup in four steps",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Creator-friendly setup in four steps",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Build from what you already say, then refine until it feels natural.",
          segments: [
            {
              type: "text",
              value:
                "Build from what you already say, then refine until it feels natural.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 25,
          level: 4,
          text: "Quick automation audit",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 26,
          text: "Review how you currently handle DMs, enquiries and onboarding.",
          segments: [
            {
              type: "text",
              value: "Review how you currently handle DMs, enquiries and onboarding.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Design your lead journeys",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Agree what should happen when someone asks about coaching or specific offers.",
          segments: [
            {
              type: "text",
              value:
                "Agree what should happen when someone asks about coaching or specific offers.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 29,
          level: 4,
          text: "Connect and test",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 30,
          text: "Link automation into your forms, calendars and messaging tools, then test with a small slice of your audience.",
          segments: [
            {
              type: "text",
              value:
                "Link automation into your forms, calendars and messaging tools, then test with a small slice of your audience.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Roll out and refine",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Expand as you get comfortable, refining questions and wording so it feels natural.",
          segments: [
            {
              type: "text",
              value:
                "Expand as you get comfortable, refining questions and wording so it feels natural.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 6,
      sourceSelector: "section.section.bg-lines.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "On-brand, under your control",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "On-brand, under your control",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Automate the repetitive parts while keeping your voice and your boundaries.",
          segments: [
            {
              type: "text",
              value:
                "Automate the repetitive parts while keeping your voice and your boundaries.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Replies sound like you",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "We build flows from your existing messages, voice notes and content so replies sound like you.",
          segments: [
            {
              type: "text",
              value:
                "We build flows from your existing messages, voice notes and content so replies sound like you.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "You choose the handover points",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "You choose which parts of the conversation are automated and where you personally step in.",
          segments: [
            {
              type: "text",
              value:
                "You choose which parts of the conversation are automated and where you personally step in.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Respect platform rules",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "We respect platform rules and keep things simple so you keep control of your accounts.",
          segments: [
            {
              type: "text",
              value:
                "We respect platform rules and keep things simple so you keep control of your accounts.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Start small, grow over time",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Clear, flexible pricing means you can start small and grow over time.",
          segments: [
            {
              type: "text",
              value:
                "Clear, flexible pricing means you can start small and grow over time.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 8,
      sourceSelector: "section.section.bg-lines.animate",
      sourceId: null,
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Creator Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Creator Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "We focus on the channels you actually use – typically a mix of messaging apps, email and forms. Where direct integrations are not available, we use simple bridges so that key events still trigger the right steps.",
          segments: [
            {
              type: "text",
              value:
                "We focus on the channels you actually use – typically a mix of messaging apps, email and forms. Where direct integrations are not available, we use simple bridges so that key events still trigger the right steps.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "No. We build from your own language and keep automation focused on the parts that are repetitive. You still step in for deeper conversations, voice notes and coaching decisions.",
          segments: [
            {
              type: "text",
              value:
                "No. We build from your own language and keep automation focused on the parts that are repetitive. You still step in for deeper conversations, voice notes and coaching decisions.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "We can design flows that are easy to adjust when you launch new programmes, change pricing or open different containers. You are not locked into one structure forever.",
          segments: [
            {
              type: "text",
              value:
                "We can design flows that are easy to adjust when you launch new programmes, change pricing or open different containers. You are not locked into one structure forever.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "No. The whole point is to reduce the need for extra admin support. You may still choose to have an assistant help with some replies, but the system aims to make their job far easier.",
          segments: [
            {
              type: "text",
              value:
                "No. The whole point is to reduce the need for extra admin support. You may still choose to have an assistant help with some replies, but the system aims to make their job far easier.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "Absolutely. You can jump into any conversation at any time. Automation simply ensures the basics are handled quickly and consistently.",
          segments: [
            {
              type: "text",
              value:
                "Absolutely. You can jump into any conversation at any time. Automation simply ensures the basics are handled quickly and consistently.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "We track simple but important numbers such as response times, number of qualified leads and client sign-ups attributed to automated journeys. You see these in clear summaries rather than complex dashboards.",
          segments: [
            {
              type: "text",
              value:
                "We track simple but important numbers such as response times, number of qualified leads and client sign-ups attributed to automated journeys. You see these in clear summaries rather than complex dashboards.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 9,
      sourceSelector: "section.section.brand-gradient.animate",
      sourceId: null,
      sourceClasses: ["section", "brand-gradient", "animate"],
      heading: {
        level: 2,
        text: "Ready to stop leaving money in your DMs?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to stop leaving money in your DMs?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Warm DMs cool off fast when follow-up depends on your spare time. The ‘DM to Client Conversion Kit’ shows how to protect your time while turning more conversations into clients.",
          segments: [
            {
              type: "text",
              value:
                "Warm DMs cool off fast when follow-up depends on your spare time. The ‘DM to Client Conversion Kit’ shows how to protect your time while turning more conversations into clients.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 52,
          text: "Browse all Silverstone AI services",
          segments: [
            {
              type: "text",
              value: "Browse all Silverstone AI services",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 53,
          text: "See fitness coach pricing",
          segments: [
            {
              type: "text",
              value: "See fitness coach pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the DM automation guide",
          segments: [
            {
              type: "text",
              value: "Read the DM automation guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the lead scoring guide",
          segments: [
            {
              type: "text",
              value: "Read the lead scoring guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free creator automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free creator automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
      ],
    },
  ],
  links: [],
  assets: [],
  interactions: [],
  flags: {
    contentStatus: "rewrite",
    claimsStatus: "evidence-pending",
    riskNotes:
      "5 images lack width/height; quantified or absolute proof claims require substantiation",
    unresolvedNotes: [],
  },
};

export default content;
