import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-ecommerce",
  routeId: "route-services-ecommerce",
  routePath: "/services/ecommerce",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/ecommerce",
    file: "services/ecommerce.html",
    sha256: "2ea365fe126588fef82d3d66196a14d0a99e0ac551375bb63ef48d072c6c4611",
    bytes: 35470,
    textSha256: "5380dfe0ff2b8f8cf501e2d54be45c433188116705a3ccd3f1d1f4527f90c97a",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for eCommerce Brands | Silverstone AI",
    description:
      "Silverstone AI helps UK eCommerce brands automate cart recovery, support, and post-purchase follow-up to increase repeat revenue.",
    canonical: "https://silverstone-ai.com/services/ecommerce",
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
        content: "https://silverstone-ai.com/services/ecommerce",
      },
      {
        property: "og:title",
        content: "AI Automation for eCommerce Brands | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK eCommerce brands automate cart recovery, support, and post-purchase follow-up to increase repeat revenue.",
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
        content: "AI Automation for eCommerce Brands | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK eCommerce brands automate cart recovery, support, and post-purchase follow-up to increase repeat revenue.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/ecommerce#webpage",\n          "url": "https://silverstone-ai.com/services/ecommerce",\n          "name": "eCommerce Automation for UK Brands - Silverstone AI",\n          "description": "Silverstone AI automation for eCommerce brands: recover carts, speed up support, and drive more repeat orders without extra headcount.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/ecommerce#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/ecommerce#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/ecommerce#service",\n          "name": "eCommerce Automation for UK Brands - Silverstone AI",\n          "serviceType": "eCommerce Automation for UK Brands",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/ecommerce",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/ecommerce#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK eCommerce brands and online stores"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-ecommerce",\n            "description": "Setup fee plus monthly retainer options for eCommerce automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/ecommerce#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "eCommerce Brands",\n              "item": "https://silverstone-ai.com/services/ecommerce"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/ecommerce#webpage",
            url: "https://silverstone-ai.com/services/ecommerce",
            name: "eCommerce Automation for UK Brands - Silverstone AI",
            description:
              "Silverstone AI automation for eCommerce brands: recover carts, speed up support, and drive more repeat orders without extra headcount.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/ecommerce#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/ecommerce#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/ecommerce#service",
            name: "eCommerce Automation for UK Brands - Silverstone AI",
            serviceType: "eCommerce Automation for UK Brands",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/ecommerce",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/ecommerce#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK eCommerce brands and online stores",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-ecommerce",
              description:
                "Setup fee plus monthly retainer options for eCommerce automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/ecommerce#breadcrumb",
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
                name: "eCommerce Brands",
                item: "https://silverstone-ai.com/services/ecommerce",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Which platforms do you support?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We focus on mainstream store platforms and common email and messaging tools used by small and mid-sized brands. If you are on a more unusual setup, we can usually still connect using webhooks or simple integrations."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will this clash with flows we already have?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Part of the initial audit is reviewing what is already in place. We either improve and extend existing flows or replace them where they are not performing. The goal is a coherent set of journeys, not competing messages."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How do you avoid over-messaging customers?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We build sensible contact rules and frequency caps into your flows. You decide how often customers should hear from you and which events are important enough to trigger messages."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we personalise messaging by segment or country?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We can create different content or logic for key segments such as high-value customers, first-time buyers or specific regions. This allows you to respect local norms and make offers more relevant."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Do we need a big team to manage this after launch?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. The idea is that the journeys largely run themselves once set up. You will want to review performance periodically, but day-to-day operation should not require extra headcount."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we see the impact clearly?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We provide simple reporting that shows recovered revenue, repeat purchase rates and key flow performance in plain language. This makes it easier to link automation work back to commercial outcomes."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Which platforms do you support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We focus on mainstream store platforms and common email and messaging tools used by small and mid-sized brands. If you are on a more unusual setup, we can usually still connect using webhooks or simple integrations.",
            },
          },
          {
            "@type": "Question",
            name: "Will this clash with flows we already have?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Part of the initial audit is reviewing what is already in place. We either improve and extend existing flows or replace them where they are not performing. The goal is a coherent set of journeys, not competing messages.",
            },
          },
          {
            "@type": "Question",
            name: "How do you avoid over-messaging customers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We build sensible contact rules and frequency caps into your flows. You decide how often customers should hear from you and which events are important enough to trigger messages.",
            },
          },
          {
            "@type": "Question",
            name: "Can we personalise messaging by segment or country?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We can create different content or logic for key segments such as high-value customers, first-time buyers or specific regions. This allows you to respect local norms and make offers more relevant.",
            },
          },
          {
            "@type": "Question",
            name: "Do we need a big team to manage this after launch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The idea is that the journeys largely run themselves once set up. You will want to review performance periodically, but day-to-day operation should not require extra headcount.",
            },
          },
          {
            "@type": "Question",
            name: "Can we see the impact clearly?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We provide simple reporting that shows recovered revenue, repeat purchase rates and key flow performance in plain language. This makes it easier to link automation work back to commercial outcomes.",
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
      text: "eCommerce brands: turn more clicks into repeat customers.",
    },
    {
      order: 1,
      level: 2,
      text: "Most of your revenue is leaking after the click.",
    },
    {
      order: 2,
      level: 3,
      text: "Where growth gets stuck.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘E-Com Growth Engine’",
    },
    {
      order: 4,
      level: 3,
      text: "Recover carts. Grow retention.",
    },
    {
      order: 5,
      level: 2,
      text: "Benchmark gaps are your growth opportunity",
    },
    {
      order: 6,
      level: 2,
      text: "More orders, smoother operations",
    },
    {
      order: 7,
      level: 3,
      text: "Turn automation into margin",
    },
    {
      order: 8,
      level: 2,
      text: "Audit, build, optimise",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Prioritise quick wins",
    },
    {
      order: 11,
      level: 4,
      text: "Build and connect",
    },
    {
      order: 12,
      level: 4,
      text: "Monitor and optimise",
    },
    {
      order: 13,
      level: 2,
      text: "Brand-safe automation, with commercial control",
    },
    {
      order: 14,
      level: 4,
      text: "Your brand voice first",
    },
    {
      order: 15,
      level: 4,
      text: "Works with your stack",
    },
    {
      order: 16,
      level: 4,
      text: "Discount control stays with you",
    },
    {
      order: 17,
      level: 4,
      text: "Clear scope and pricing",
    },
    {
      order: 18,
      level: 2,
      text: "eCommerce Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to grow revenue without more ad spend?",
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
        text: "eCommerce brands: turn more clicks into repeat customers.",
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
          text: "Automation that recovers carts, answers common questions, and nudges customers back without adding headcount.",
          segments: [
            {
              type: "text",
              value:
                "Automation that recovers carts, answers common questions, and nudges customers back without adding headcount.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: lean brands handling abandoned carts, support questions, returns, and repeat purchase.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: lean brands handling abandoned carts, support questions, returns, and repeat purchase.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free eCommerce automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free eCommerce automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘E-Com Growth Engine’",
          segments: [
            {
              type: "text",
              value: "See the ‘E-Com Growth Engine’",
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
        text: "Most of your revenue is leaking after the click.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Most of your revenue is leaking after the click.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "Cart abandonment, repeat-purchase drop-off, and manual support quietly erode margin for lean teams.",
          segments: [
            {
              type: "text",
              value:
                "Cart abandonment, repeat-purchase drop-off, and manual support quietly erode margin for lean teams.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where growth gets stuck.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "You already pay for demand. The missed opportunity is converting more visitors and bringing more first-time buyers back.",
          segments: [
            {
              type: "text",
              value:
                "You already pay for demand. The missed opportunity is converting more visitors and bringing more first-time buyers back.",
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
              text: "Most visitors abandon basket before they buy.",
              segments: [
                {
                  type: "text",
                  value: "Most visitors abandon basket before they buy.",
                },
              ],
            },
            {
              text: "Support teams lose time on the same shipping and returns questions.",
              segments: [
                {
                  type: "text",
                  value:
                    "Support teams lose time on the same shipping and returns questions.",
                },
              ],
            },
            {
              text: "Repeat-purchase journeys stay on the to-do list instead of going live.",
              segments: [
                {
                  type: "text",
                  value:
                    "Repeat-purchase journeys stay on the to-do list instead of going live.",
                },
              ],
            },
            {
              text: "Data sits across too many tools to see what is actually working.",
              segments: [
                {
                  type: "text",
                  value:
                    "Data sits across too many tools to see what is actually working.",
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
        text: "The ‘E-Com Growth Engine’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘E-Com Growth Engine’",
          sourceSelector: "h2#ecom-growth-engine",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Recover lost checkout revenue, streamline support, and increase repeat orders with a coherent set of automated journeys.",
          segments: [
            {
              type: "text",
              value:
                "Recover lost checkout revenue, streamline support, and increase repeat orders with a coherent set of automated journeys.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Recover carts. Grow retention.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This bundle connects your store, email, and messaging tools to recover revenue and support buyers faster.",
          segments: [
            {
              type: "text",
              value:
                "This bundle connects your store, email, and messaging tools to recover revenue and support buyers faster.",
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
              text: "Abandoned-cart journeys with sensible timing and offers.",
              segments: [
                {
                  type: "text",
                  value: "Abandoned-cart journeys with sensible timing and offers.",
                },
              ],
            },
            {
              text: "FAQ and order-status support that cuts simple tickets fast.",
              segments: [
                {
                  type: "text",
                  value: "FAQ and order-status support that cuts simple tickets fast.",
                },
              ],
            },
            {
              text: "Post-purchase flows that educate, cross-sell, and invite the next order.",
              segments: [
                {
                  type: "text",
                  value:
                    "Post-purchase flows that educate, cross-sell, and invite the next order.",
                },
              ],
            },
            {
              text: "Dashboards for recovered revenue, repeat orders, and flow engagement.",
              segments: [
                {
                  type: "text",
                  value:
                    "Dashboards for recovered revenue, repeat orders, and flow engagement.",
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
        text: "Benchmark gaps are your growth opportunity",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Benchmark gaps are your growth opportunity",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Simple automation can recover checkout revenue and lift repeat purchase rates without more ad spend.",
          segments: [
            {
              type: "text",
              value:
                "Simple automation can recover checkout revenue and lift repeat purchase rates without more ad spend.",
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
        text: "More orders, smoother operations",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "More orders, smoother operations",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Turn existing demand into revenue and retention, while keeping support efficient.",
          segments: [
            {
              type: "text",
              value:
                "Turn existing demand into revenue and retention, while keeping support efficient.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Turn automation into margin",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Recover more checkout revenue, speed up support, and build repeat-purchase habits without adding headcount.",
          segments: [
            {
              type: "text",
              value:
                "Recover more checkout revenue, speed up support, and build repeat-purchase habits without adding headcount.",
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
              text: "Higher revenue from traffic and ad spend you already fund.",
              segments: [
                {
                  type: "text",
                  value: "Higher revenue from traffic and ad spend you already fund.",
                },
              ],
            },
            {
              text: "Faster answers for customers with simple questions.",
              segments: [
                {
                  type: "text",
                  value: "Faster answers for customers with simple questions.",
                },
              ],
            },
            {
              text: "More buyers coming back for a second and third order.",
              segments: [
                {
                  type: "text",
                  value: "More buyers coming back for a second and third order.",
                },
              ],
            },
            {
              text: "Founders spend more time on product, brand, and partnerships.",
              segments: [
                {
                  type: "text",
                  value:
                    "Founders spend more time on product, brand, and partnerships.",
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
        text: "Audit, build, optimise",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Audit, build, optimise",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Start with high-impact flows, then expand as you learn what converts.",
          segments: [
            {
              type: "text",
              value:
                "Start with high-impact flows, then expand as you learn what converts.",
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
          text: "Review your store data, key tools and current flows.",
          segments: [
            {
              type: "text",
              value: "Review your store data, key tools and current flows.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Prioritise quick wins",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Identify the highest-impact journeys to build first, such as abandoned carts and post-purchase sequences.",
          segments: [
            {
              type: "text",
              value:
                "Identify the highest-impact journeys to build first, such as abandoned carts and post-purchase sequences.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 29,
          level: 4,
          text: "Build and connect",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 30,
          text: "Configure flows in your existing email, SMS and messaging tools, then connect them to your store.",
          segments: [
            {
              type: "text",
              value:
                "Configure flows in your existing email, SMS and messaging tools, then connect them to your store.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Monitor and optimise",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Track performance, test variants and add new journeys as you grow.",
          segments: [
            {
              type: "text",
              value:
                "Track performance, test variants and add new journeys as you grow.",
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
        text: "Brand-safe automation, with commercial control",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "Brand-safe automation, with commercial control",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Keep customer experience consistent while protecting margins and discounts.",
          segments: [
            {
              type: "text",
              value:
                "Keep customer experience consistent while protecting margins and discounts.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Your brand voice first",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "Flows are written in your brand voice and reviewed with you before anything goes live.",
          segments: [
            {
              type: "text",
              value:
                "Flows are written in your brand voice and reviewed with you before anything goes live.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Works with your stack",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "We work with your current stack wherever possible to avoid unnecessary replatforming.",
          segments: [
            {
              type: "text",
              value:
                "We work with your current stack wherever possible to avoid unnecessary replatforming.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Discount control stays with you",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "You retain full control over discounts and incentives used in abandoned-cart and win-back journeys.",
          segments: [
            {
              type: "text",
              value:
                "You retain full control over discounts and incentives used in abandoned-cart and win-back journeys.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Clear scope and pricing",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Clear pricing and scoped deliverables mean you know exactly what you are getting.",
          segments: [
            {
              type: "text",
              value:
                "Clear pricing and scoped deliverables mean you know exactly what you are getting.",
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
        text: "eCommerce Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "eCommerce Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "We focus on mainstream store platforms and common email and messaging tools used by small and mid-sized brands. If you are on a more unusual setup, we can usually still connect using webhooks or simple integrations.",
          segments: [
            {
              type: "text",
              value:
                "We focus on mainstream store platforms and common email and messaging tools used by small and mid-sized brands. If you are on a more unusual setup, we can usually still connect using webhooks or simple integrations.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "Part of the initial audit is reviewing what is already in place. We either improve and extend existing flows or replace them where they are not performing. The goal is a coherent set of journeys, not competing messages.",
          segments: [
            {
              type: "text",
              value:
                "Part of the initial audit is reviewing what is already in place. We either improve and extend existing flows or replace them where they are not performing. The goal is a coherent set of journeys, not competing messages.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "We build sensible contact rules and frequency caps into your flows. You decide how often customers should hear from you and which events are important enough to trigger messages.",
          segments: [
            {
              type: "text",
              value:
                "We build sensible contact rules and frequency caps into your flows. You decide how often customers should hear from you and which events are important enough to trigger messages.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "Yes. We can create different content or logic for key segments such as high-value customers, first-time buyers or specific regions. This allows you to respect local norms and make offers more relevant.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We can create different content or logic for key segments such as high-value customers, first-time buyers or specific regions. This allows you to respect local norms and make offers more relevant.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "No. The idea is that the journeys largely run themselves once set up. You will want to review performance periodically, but day-to-day operation should not require extra headcount.",
          segments: [
            {
              type: "text",
              value:
                "No. The idea is that the journeys largely run themselves once set up. You will want to review performance periodically, but day-to-day operation should not require extra headcount.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "We provide simple reporting that shows recovered revenue, repeat purchase rates and key flow performance in plain language. This makes it easier to link automation work back to commercial outcomes.",
          segments: [
            {
              type: "text",
              value:
                "We provide simple reporting that shows recovered revenue, repeat purchase rates and key flow performance in plain language. This makes it easier to link automation work back to commercial outcomes.",
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
        text: "Ready to grow revenue without more ad spend?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to grow revenue without more ad spend?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "If traffic is landing but revenue is leaking, the ‘E-Com Growth Engine’ closes the gap across conversion, support, and repeat purchase. A short call is enough to see how it fits your store and margin.",
          segments: [
            {
              type: "text",
              value:
                "If traffic is landing but revenue is leaking, the ‘E-Com Growth Engine’ closes the gap across conversion, support, and repeat purchase. A short call is enough to see how it fits your store and margin.",
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
          text: "See eCommerce pricing",
          segments: [
            {
              type: "text",
              value: "See eCommerce pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the returns triage guide",
          segments: [
            {
              type: "text",
              value: "Read the returns triage guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the post-purchase guide",
          segments: [
            {
              type: "text",
              value: "Read the post-purchase guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free eCommerce automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free eCommerce automation audit",
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
