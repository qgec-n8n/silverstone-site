import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-trades",
  routeId: "route-services-trades",
  routePath: "/services/trades",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/trades",
    file: "services/trades.html",
    sha256: "5a60c29493732cae605fbe64228311f5da6e73ce60540218fffc57914f926abc",
    bytes: 35164,
    textSha256: "b24442849442ae6e888be98f593139842d4b580564c1f55c2b24d728248304cb",
    extractedBlockCount: 58,
  },
  metadata: {
    title: "AI Automation for Trades | Silverstone AI",
    description:
      "Silverstone AI helps UK trades businesses automate missed-call capture, quote follow-up, and scheduling so fewer jobs go cold.",
    canonical: "https://silverstone-ai.com/services/trades",
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
        content: "https://silverstone-ai.com/services/trades",
      },
      {
        property: "og:title",
        content: "AI Automation for Trades | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK trades businesses automate missed-call capture, quote follow-up, and scheduling so fewer jobs go cold.",
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
        content: "AI Automation for Trades | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK trades businesses automate missed-call capture, quote follow-up, and scheduling so fewer jobs go cold.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/trades#webpage",\n          "url": "https://silverstone-ai.com/services/trades",\n          "name": "Trades Automation for UK Teams - Silverstone AI",\n          "description": "Silverstone AI automation for UK trades and field services: missed-call capture, quote chasing, scheduling updates, and faster job booking.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/trades#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/trades#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/trades#service",\n          "name": "Trades Automation for UK Teams - Silverstone AI",\n          "serviceType": "AI Automation for UK Trades Teams",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/trades",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/trades#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK trades and field-service businesses"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-trades",\n            "description": "Setup fee plus monthly retainer options for trades automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/trades#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Trades",\n              "item": "https://silverstone-ai.com/services/trades"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/trades#webpage",
            url: "https://silverstone-ai.com/services/trades",
            name: "Trades Automation for UK Teams - Silverstone AI",
            description:
              "Silverstone AI automation for UK trades and field services: missed-call capture, quote chasing, scheduling updates, and faster job booking.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/trades#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/trades#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/trades#service",
            name: "Trades Automation for UK Teams - Silverstone AI",
            serviceType: "AI Automation for UK Trades Teams",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/trades",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/trades#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK trades and field-service businesses",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-trades",
              description:
                "Setup fee plus monthly retainer options for trades automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/trades#breadcrumb",
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
                name: "Trades",
                item: "https://silverstone-ai.com/services/trades",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Will callers be talking to a machine?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The experience is designed to feel like talking to a helpful office assistant. For many enquiries, callers simply leave key details and receive a clear confirmation and next steps. You can still choose to have certain calls put straight through when you are available."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can this work if I do not have a job-management system?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We can start with simple, structured logs of calls and jobs that you can access on your phone or computer. If you later adopt a dedicated job-management tool, the automation can adapt."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What about emergencies outside normal hours?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We can create separate flows for emergencies, including clear warnings about response times and pricing. These can be routed to a specific on-call number if you choose to offer true 24/7 coverage."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Is it complicated to update prices or services?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. You can send us updates in plain language and we handle the changes. We also review key messages periodically to ensure they still match how you operate."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How do I know it is working?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "You receive simple reports showing how many calls and enquiries were captured, how many quotes were followed up and how many jobs were booked. We can review these together and adjust the system to improve results."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can this handle more than one engineer or team?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We can route jobs to different people based on location, skill set or availability, using simple rules that you help define."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will callers be talking to a machine?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The experience is designed to feel like talking to a helpful office assistant. For many enquiries, callers simply leave key details and receive a clear confirmation and next steps. You can still choose to have certain calls put straight through when you are available.",
            },
          },
          {
            "@type": "Question",
            name: "Can this work if I do not have a job-management system?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We can start with simple, structured logs of calls and jobs that you can access on your phone or computer. If you later adopt a dedicated job-management tool, the automation can adapt.",
            },
          },
          {
            "@type": "Question",
            name: "What about emergencies outside normal hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We can create separate flows for emergencies, including clear warnings about response times and pricing. These can be routed to a specific on-call number if you choose to offer true 24/7 coverage.",
            },
          },
          {
            "@type": "Question",
            name: "Is it complicated to update prices or services?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. You can send us updates in plain language and we handle the changes. We also review key messages periodically to ensure they still match how you operate.",
            },
          },
          {
            "@type": "Question",
            name: "How do I know it is working?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You receive simple reports showing how many calls and enquiries were captured, how many quotes were followed up and how many jobs were booked. We can review these together and adjust the system to improve results.",
            },
          },
          {
            "@type": "Question",
            name: "Can this handle more than one engineer or team?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We can route jobs to different people based on location, skill set or availability, using simple rules that you help define.",
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
      text: "Trades: never let the good jobs go to voicemail.",
    },
    {
      order: 1,
      level: 2,
      text: "Missed calls mean missed jobs.",
    },
    {
      order: 2,
      level: 3,
      text: "Stop losing work on the first ring.",
    },
    {
      order: 3,
      level: 2,
      text: "The Trades Pack",
    },
    {
      order: 4,
      level: 3,
      text: "Your virtual office on site",
    },
    {
      order: 5,
      level: 2,
      text: "Busy periods send jobs to competitors",
    },
    {
      order: 6,
      level: 2,
      text: "More jobs booked. Fewer late nights.",
    },
    {
      order: 7,
      level: 3,
      text: "Book more jobs. Fewer late nights.",
    },
    {
      order: 8,
      level: 2,
      text: "Practical setup, built for busy days",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Design triage rules",
    },
    {
      order: 11,
      level: 4,
      text: "Connect and launch",
    },
    {
      order: 12,
      level: 4,
      text: "Refine over time",
    },
    {
      order: 13,
      level: 2,
      text: "You stay in control — we do the heavy lifting",
    },
    {
      order: 14,
      level: 4,
      text: "No need to be technical",
    },
    {
      order: 15,
      level: 4,
      text: "Clear rules and handoff",
    },
    {
      order: 16,
      level: 4,
      text: "Emergency routing options",
    },
    {
      order: 17,
      level: 4,
      text: "Simple, transparent pricing",
    },
    {
      order: 18,
      level: 2,
      text: "Trades Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to stop losing good jobs to missed calls?",
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
        text: "Trades: never let the good jobs go to voicemail.",
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
          text: "Automation that answers calls, qualifies enquiries, and chases quotes while you are on site.",
          segments: [
            {
              type: "text",
              value:
                "Automation that answers calls, qualifies enquiries, and chases quotes while you are on site.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: owner-led trades teams juggling missed calls, quote follow-up, ETAs, and admin.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: owner-led trades teams juggling missed calls, quote follow-up, ETAs, and admin.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free trades automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free trades automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the Trades pack",
          segments: [
            {
              type: "text",
              value: "See the Trades pack",
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
        text: "Missed calls mean missed jobs.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Missed calls mean missed jobs.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "When you’re driving or on the tools, customers ring someone else — and the quote never even gets a chance.",
          segments: [
            {
              type: "text",
              value:
                "When you’re driving or on the tools, customers ring someone else — and the quote never even gets a chance.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Stop losing work on the first ring.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "When calls arrive on site or after hours, the jobs you wanted most go to whoever answers first.",
          segments: [
            {
              type: "text",
              value:
                "When calls arrive on site or after hours, the jobs you wanted most go to whoever answers first.",
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
              text: "Calls come in on site, in the van, or mid-job and go unanswered.",
              segments: [
                {
                  type: "text",
                  value:
                    "Calls come in on site, in the van, or mid-job and go unanswered.",
                },
              ],
            },
            {
              text: "Most callers do not leave voicemail. They ring the next trade.",
              segments: [
                {
                  type: "text",
                  value:
                    "Most callers do not leave voicemail. They ring the next trade.",
                },
              ],
            },
            {
              text: "Quotes get written late and chased inconsistently.",
              segments: [
                {
                  type: "text",
                  value: "Quotes get written late and chased inconsistently.",
                },
              ],
            },
            {
              text: "Weekends disappear into catch-up admin.",
              segments: [
                {
                  type: "text",
                  value: "Weekends disappear into catch-up admin.",
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
        text: "The Trades Pack",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The Trades Pack",
          sourceSelector: "h2#trades-pack",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Capture calls, qualify jobs, and follow up quotes — even when you can’t answer the phone.",
          segments: [
            {
              type: "text",
              value:
                "Capture calls, qualify jobs, and follow up quotes — even when you can’t answer the phone.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Your virtual office on site",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This bundle captures calls, triages jobs, and chases quotes so the right work keeps moving even when you are busy.",
          segments: [
            {
              type: "text",
              value:
                "This bundle captures calls, triages jobs, and chases quotes so the right work keeps moving even when you are busy.",
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
              text: "Call capture that sends callers an immediate confirmation.",
              segments: [
                {
                  type: "text",
                  value: "Call capture that sends callers an immediate confirmation.",
                },
              ],
            },
            {
              text: "Triage that separates urgent work from routine jobs.",
              segments: [
                {
                  type: "text",
                  value: "Triage that separates urgent work from routine jobs.",
                },
              ],
            },
            {
              text: "Automatic quote follow-up that keeps jobs from going cold.",
              segments: [
                {
                  type: "text",
                  value: "Automatic quote follow-up that keeps jobs from going cold.",
                },
              ],
            },
            {
              text: "Simple scheduling flows based on how you actually work.",
              segments: [
                {
                  type: "text",
                  value: "Simple scheduling flows based on how you actually work.",
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
        text: "Busy periods send jobs to competitors",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Busy periods send jobs to competitors",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "A missed call is not just an admin problem; it is revenue that may never come back.",
          segments: [
            {
              type: "text",
              value:
                "A missed call is not just an admin problem; it is revenue that may never come back.",
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
        text: "More jobs booked. Fewer late nights.",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "More jobs booked. Fewer late nights.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Capture work, qualify urgency, and keep the pipeline moving without living on your phone.",
          segments: [
            {
              type: "text",
              value:
                "Capture work, qualify urgency, and keep the pipeline moving without living on your phone.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Book more jobs. Fewer late nights.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Automation captures better calls and keeps quotes moving without burying you in admin.",
          segments: [
            {
              type: "text",
              value:
                "Automation captures better calls and keeps quotes moving without burying you in admin.",
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
              text: "More of the right jobs get booked because fewer good calls are missed.",
              segments: [
                {
                  type: "text",
                  value:
                    "More of the right jobs get booked because fewer good calls are missed.",
                },
              ],
            },
            {
              text: "Less time spent writing and chasing quotes manually.",
              segments: [
                {
                  type: "text",
                  value: "Less time spent writing and chasing quotes manually.",
                },
              ],
            },
            {
              text: "A clearer view of upcoming work and availability.",
              segments: [
                {
                  type: "text",
                  value: "A clearer view of upcoming work and availability.",
                },
              ],
            },
            {
              text: "Evenings stay freer from paperwork and catch-up admin.",
              segments: [
                {
                  type: "text",
                  value: "Evenings stay freer from paperwork and catch-up admin.",
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
        text: "Practical setup, built for busy days",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Practical setup, built for busy days",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Start capturing calls fast, then refine triage and follow-up as patterns emerge.",
          segments: [
            {
              type: "text",
              value:
                "Start capturing calls fast, then refine triage and follow-up as patterns emerge.",
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
          text: "Understand how calls and jobs are currently handled and where work is being lost.",
          segments: [
            {
              type: "text",
              value:
                "Understand how calls and jobs are currently handled and where work is being lost.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Design triage rules",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Agree what should happen for emergencies, standard jobs and quotes.",
          segments: [
            {
              type: "text",
              value:
                "Agree what should happen for emergencies, standard jobs and quotes.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 29,
          level: 4,
          text: "Connect and launch",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 30,
          text: "Link the virtual office to your phone lines and job tools, then go live in a controlled way.",
          segments: [
            {
              type: "text",
              value:
                "Link the virtual office to your phone lines and job tools, then go live in a controlled way.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Refine over time",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Adjust questions, messages and scheduling as patterns emerge.",
          segments: [
            {
              type: "text",
              value: "Adjust questions, messages and scheduling as patterns emerge.",
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
        text: "You stay in control — we do the heavy lifting",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "You stay in control — we do the heavy lifting",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "No tech headaches, clear rules, and emergency routing when it matters.",
          segments: [
            {
              type: "text",
              value:
                "No tech headaches, clear rules, and emergency routing when it matters.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "No need to be technical",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "You do not need to be technical – we set it up and keep it running.",
          segments: [
            {
              type: "text",
              value:
                "You do not need to be technical – we set it up and keep it running.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Clear rules and handoff",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "You decide what the system can say and when calls should be passed through.",
          segments: [
            {
              type: "text",
              value:
                "You decide what the system can say and when calls should be passed through.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Emergency routing options",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "If you prefer, emergency calls can always be routed directly to you or a trusted colleague.",
          segments: [
            {
              type: "text",
              value:
                "If you prefer, emergency calls can always be routed directly to you or a trusted colleague.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Simple, transparent pricing",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Clear, simple pricing with no long contracts.",
          segments: [
            {
              type: "text",
              value: "Clear, simple pricing with no long contracts.",
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
        text: "Trades Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Trades Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "The experience is designed to feel like talking to a helpful office assistant. For many enquiries, callers simply leave key details and receive a clear confirmation and next steps. You can still choose to have certain calls put straight through when you are available.",
          segments: [
            {
              type: "text",
              value:
                "The experience is designed to feel like talking to a helpful office assistant. For many enquiries, callers simply leave key details and receive a clear confirmation and next steps. You can still choose to have certain calls put straight through when you are available.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "Yes. We can start with simple, structured logs of calls and jobs that you can access on your phone or computer. If you later adopt a dedicated job-management tool, the automation can adapt.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We can start with simple, structured logs of calls and jobs that you can access on your phone or computer. If you later adopt a dedicated job-management tool, the automation can adapt.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "We can create separate flows for emergencies, including clear warnings about response times and pricing. These can be routed to a specific on-call number if you choose to offer true 24/7 coverage.",
          segments: [
            {
              type: "text",
              value:
                "We can create separate flows for emergencies, including clear warnings about response times and pricing. These can be routed to a specific on-call number if you choose to offer true 24/7 coverage.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "No. You can send us updates in plain language and we handle the changes. We also review key messages periodically to ensure they still match how you operate.",
          segments: [
            {
              type: "text",
              value:
                "No. You can send us updates in plain language and we handle the changes. We also review key messages periodically to ensure they still match how you operate.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "You receive simple reports showing how many calls and enquiries were captured, how many quotes were followed up and how many jobs were booked. We can review these together and adjust the system to improve results.",
          segments: [
            {
              type: "text",
              value:
                "You receive simple reports showing how many calls and enquiries were captured, how many quotes were followed up and how many jobs were booked. We can review these together and adjust the system to improve results.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Yes. We can route jobs to different people based on location, skill set or availability, using simple rules that you help define.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We can route jobs to different people based on location, skill set or availability, using simple rules that you help define.",
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
        text: "Ready to stop losing good jobs to missed calls?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to stop losing good jobs to missed calls?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Missed calls and slow quote follow-up send good jobs elsewhere. The trades setup shows how to plug that leak without changing how you already work.",
          segments: [
            {
              type: "text",
              value:
                "Missed calls and slow quote follow-up send good jobs elsewhere. The trades setup shows how to plug that leak without changing how you already work.",
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
          text: "See trades pricing",
          segments: [
            {
              type: "text",
              value: "See trades pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the call answering guide",
          segments: [
            {
              type: "text",
              value: "Read the call answering guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the lead capture guide",
          segments: [
            {
              type: "text",
              value: "Read the lead capture guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Read the quote follow-up guide",
          segments: [
            {
              type: "text",
              value: "Read the quote follow-up guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 57,
          text: "Book my free trades automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free trades automation audit",
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
