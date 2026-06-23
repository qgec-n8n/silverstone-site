import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-pricing",
  routeId: "route-pricing",
  routePath: "/pricing",
  kind: "conversion",
  source: {
    routeKey: "canonical:/pricing",
    file: "pricing.html",
    sha256: "2b4fc54fbbedfcbed806ee949ae9d2779ce393d5a9831b0880f93cf6248f8817",
    bytes: 23216,
    textSha256: "cf52413bd866e931cf291834f690ade10269d9ef30b9481c5123fdb7fb4085ae",
    extractedBlockCount: 15,
  },
  metadata: {
    title: "AI Automation Pricing | Silverstone AI",
    description:
      "Compare AI automation pricing for UK small businesses: Silverstone AI flagship packs, industry-specific modules, and bundle pricing across nine industries.",
    canonical: "https://silverstone-ai.com/pricing",
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
        content: "https://silverstone-ai.com/pricing",
      },
      {
        property: "og:title",
        content: "AI Automation Pricing | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Compare AI automation pricing for UK small businesses: Silverstone AI flagship packs, industry-specific modules, and bundle pricing across nine industries.",
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
        content: "AI Automation Pricing | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Compare AI automation pricing for UK small businesses: Silverstone AI flagship packs, industry-specific modules, and bundle pricing across nine industries.",
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
        "ReserveAction",
        "ItemList",
        "ListItem",
        "BreadcrumbList",
      ],
      rawJson:
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/pricing#webpage",\n          "url": "https://silverstone-ai.com/pricing",\n          "name": "AI Automation Pricing for UK SMEs - Silverstone AI",\n          "description": "Compare AI automation pricing for UK small businesses: Silverstone AI flagship packs, industry-specific modules, and bundle pricing across nine industries.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/#website"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "mainEntity": [\n            {\n              "@id": "https://silverstone-ai.com/pricing#pricing-service"\n            },\n            {\n              "@id": "https://silverstone-ai.com/pricing#flagship-list"\n            },\n            {\n              "@id": "https://silverstone-ai.com/pricing#atlas-list"\n            },\n            {\n              "@id": "https://silverstone-ai.com/pricing#pricing-faq"\n            }\n          ],\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/pricing#breadcrumb"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/pricing#pricing-service",\n          "name": "AI Automation Pricing for UK Small Businesses",\n          "serviceType": "AI automation pricing and package comparison",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK small businesses"\n          },\n          "url": "https://silverstone-ai.com/pricing",\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "ItemList",\n          "@id": "https://silverstone-ai.com/pricing#flagship-list",\n          "name": "Silverstone AI flagship pricing packs",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Never Miss a Viewing Pack",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-never-miss-a-viewing"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "24/7 Guest Concierge Bot",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-24-7-guest-concierge"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Rebook & Review Pack",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-rebook-review"\n            },\n            {\n              "@type": "ListItem",\n              "position": 4,\n              "name": "Trades Pack",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-trades"\n            },\n            {\n              "@type": "ListItem",\n              "position": 5,\n              "name": "E-com Growth Engine",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-ecom-growth-engine"\n            },\n            {\n              "@type": "ListItem",\n              "position": 6,\n              "name": "Smart Intake Starter Pack",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-smart-intake"\n            },\n            {\n              "@type": "ListItem",\n              "position": 7,\n              "name": "Recall Starter Pack",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-recall-starter"\n            },\n            {\n              "@type": "ListItem",\n              "position": 8,\n              "name": "Gym Growth Engine",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-gym-growth-engine"\n            },\n            {\n              "@type": "ListItem",\n              "position": 9,\n              "name": "DM to Lead Starter Pack",\n              "url": "https://silverstone-ai.com/pricing#pricing-flagship-dm-to-lead"\n            }\n          ]\n        },\n        {\n          "@type": "ItemList",\n          "@id": "https://silverstone-ai.com/pricing#atlas-list",\n          "name": "Silverstone AI pricing atlas by industry",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Real Estate pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-real-estate"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Hospitality pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-hospitality"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Salon pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-salons"\n            },\n            {\n              "@type": "ListItem",\n              "position": 4,\n              "name": "Trades pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-trades"\n            },\n            {\n              "@type": "ListItem",\n              "position": 5,\n              "name": "eCommerce pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-ecommerce"\n            },\n            {\n              "@type": "ListItem",\n              "position": 6,\n              "name": "Physio and chiropractic pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-physios-chiropractors"\n            },\n            {\n              "@type": "ListItem",\n              "position": 7,\n              "name": "Dental pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-dentists"\n            },\n            {\n              "@type": "ListItem",\n              "position": 8,\n              "name": "Gym pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-gym-owners"\n            },\n            {\n              "@type": "ListItem",\n              "position": 9,\n              "name": "Fitness coach pricing atlas",\n              "url": "https://silverstone-ai.com/pricing#pricing-atlas-fitness-coaches"\n            }\n          ]\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/pricing#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Pricing",\n              "item": "https://silverstone-ai.com/pricing"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/pricing#webpage",
            url: "https://silverstone-ai.com/pricing",
            name: "AI Automation Pricing for UK SMEs - Silverstone AI",
            description:
              "Compare AI automation pricing for UK small businesses: Silverstone AI flagship packs, industry-specific modules, and bundle pricing across nine industries.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/#website",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            mainEntity: [
              {
                "@id": "https://silverstone-ai.com/pricing#pricing-service",
              },
              {
                "@id": "https://silverstone-ai.com/pricing#flagship-list",
              },
              {
                "@id": "https://silverstone-ai.com/pricing#atlas-list",
              },
              {
                "@id": "https://silverstone-ai.com/pricing#pricing-faq",
              },
            ],
            breadcrumb: {
              "@id": "https://silverstone-ai.com/pricing#breadcrumb",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/pricing#pricing-service",
            name: "AI Automation Pricing for UK Small Businesses",
            serviceType: "AI automation pricing and package comparison",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            audience: {
              "@type": "Audience",
              audienceType: "UK small businesses",
            },
            url: "https://silverstone-ai.com/pricing",
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "ItemList",
            "@id": "https://silverstone-ai.com/pricing#flagship-list",
            name: "Silverstone AI flagship pricing packs",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Never Miss a Viewing Pack",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-never-miss-a-viewing",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "24/7 Guest Concierge Bot",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-24-7-guest-concierge",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Rebook & Review Pack",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-rebook-review",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Trades Pack",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-trades",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "E-com Growth Engine",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-ecom-growth-engine",
              },
              {
                "@type": "ListItem",
                position: 6,
                name: "Smart Intake Starter Pack",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-smart-intake",
              },
              {
                "@type": "ListItem",
                position: 7,
                name: "Recall Starter Pack",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-recall-starter",
              },
              {
                "@type": "ListItem",
                position: 8,
                name: "Gym Growth Engine",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-gym-growth-engine",
              },
              {
                "@type": "ListItem",
                position: 9,
                name: "DM to Lead Starter Pack",
                url: "https://silverstone-ai.com/pricing#pricing-flagship-dm-to-lead",
              },
            ],
          },
          {
            "@type": "ItemList",
            "@id": "https://silverstone-ai.com/pricing#atlas-list",
            name: "Silverstone AI pricing atlas by industry",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Real Estate pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-real-estate",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Hospitality pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-hospitality",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Salon pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-salons",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Trades pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-trades",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "eCommerce pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-ecommerce",
              },
              {
                "@type": "ListItem",
                position: 6,
                name: "Physio and chiropractic pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-physios-chiropractors",
              },
              {
                "@type": "ListItem",
                position: 7,
                name: "Dental pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-dentists",
              },
              {
                "@type": "ListItem",
                position: 8,
                name: "Gym pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-gym-owners",
              },
              {
                "@type": "ListItem",
                position: 9,
                name: "Fitness coach pricing atlas",
                url: "https://silverstone-ai.com/pricing#pricing-atlas-fitness-coaches",
              },
            ],
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/pricing#breadcrumb",
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
                name: "Pricing",
                item: "https://silverstone-ai.com/pricing",
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
        '{\n      "@context": "https://schema.org",\n      "@type": "FAQPage",\n      "@id": "https://silverstone-ai.com/pricing#pricing-faq",\n      "mainEntity": [\n        {\n          "@type": "Question",\n          "name": "How do the setup fees and monthly retainers work?",\n          "acceptedAnswer": {\n            "@type": "Answer",\n            "text": "The setup fee covers the build, integrations, testing and launch work. The monthly retainer covers monitoring, iteration, support and the ongoing automation layer once the system is live."\n          }\n        },\n        {\n          "@type": "Question",\n          "name": "Should I start with a flagship pack or an industry atlas module?",\n          "acceptedAnswer": {\n            "@type": "Answer",\n            "text": "Start with a flagship pack if you want the fastest route to a complete workflow. Use the industry atlas if you need a smaller fix first or want to compare multiple modules and bundles before you commit."\n          }\n        },\n        {\n          "@type": "Question",\n          "name": "Can we start with one workflow and expand later?",\n          "acceptedAnswer": {\n            "@type": "Answer",\n            "text": "Yes. Many clients begin with one high-leverage workflow, prove the ROI, then add the next module once the first system is paying back."\n          }\n        },\n        {\n          "@type": "Question",\n          "name": "What happens in the automation audit?",\n          "acceptedAnswer": {\n            "@type": "Answer",\n            "text": "We look at your current bottlenecks, identify the highest-value workflow to automate first, and recommend the pack or module that fits your stage, team and existing tools."\n          }\n        },\n        {\n          "@type": "Question",\n          "name": "How quickly can a pricing pack go live?",\n          "acceptedAnswer": {\n            "@type": "Answer",\n            "text": "Most focused systems can launch within one to two weeks after the audit, depending on your stack, approvals and how many moving parts need to be connected."\n          }\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": "https://silverstone-ai.com/pricing#pricing-faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do the setup fees and monthly retainers work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The setup fee covers the build, integrations, testing and launch work. The monthly retainer covers monitoring, iteration, support and the ongoing automation layer once the system is live.",
            },
          },
          {
            "@type": "Question",
            name: "Should I start with a flagship pack or an industry atlas module?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Start with a flagship pack if you want the fastest route to a complete workflow. Use the industry atlas if you need a smaller fix first or want to compare multiple modules and bundles before you commit.",
            },
          },
          {
            "@type": "Question",
            name: "Can we start with one workflow and expand later?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Many clients begin with one high-leverage workflow, prove the ROI, then add the next module once the first system is paying back.",
            },
          },
          {
            "@type": "Question",
            name: "What happens in the automation audit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We look at your current bottlenecks, identify the highest-value workflow to automate first, and recommend the pack or module that fits your stage, team and existing tools.",
            },
          },
          {
            "@type": "Question",
            name: "How quickly can a pricing pack go live?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most focused systems can launch within one to two weeks after the audit, depending on your stack, approvals and how many moving parts need to be connected.",
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
      text: "Silverstone AI Automation Pricing for UK Small Businesses",
    },
    {
      order: 1,
      level: 2,
      text: "Choose the fastest-fit pack, then compare every industry.",
    },
    {
      order: 2,
      level: 2,
      text: "Pricing FAQs for UK small businesses",
    },
    {
      order: 3,
      level: 2,
      text: "Price the right first workflow, not the biggest possible project.",
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
        text: "Silverstone AI Automation Pricing for UK Small Businesses",
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
          text: "Compare starter packs, industry atlases, and monthly retainers before you book an audit.",
          segments: [
            {
              type: "text",
              value:
                "Compare starter packs, industry atlases, and monthly retainers before you book an audit.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 2,
          text: "Book a Free 30-Minute Automation Audit",
          segments: [
            {
              type: "text",
              value: "Book a Free 30-Minute Automation Audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Jump to the pricing atlas",
          segments: [
            {
              type: "text",
              value: "Jump to the pricing atlas",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
      ],
    },
    {
      order: 1,
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
        text: "Choose the fastest-fit pack, then compare every industry.",
      },
      blocks: [
        {
          type: "heading",
          order: 4,
          level: 2,
          text: "Choose the fastest-fit pack, then compare every industry.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 5,
          text: "Use the industry selector for the fastest route to ROI, or the atlas below to compare every starter pack, module, and premium build.",
          segments: [
            {
              type: "text",
              value:
                " Use the industry selector for the fastest route to ROI, or the atlas below to compare every starter pack, module, and premium build. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
      ],
    },
    {
      order: 4,
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
        text: "Pricing FAQs for UK small businesses",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Pricing FAQs for UK small businesses",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "The setup fee covers the build, integrations, testing, and launch. The monthly retainer covers monitoring, support, iteration, and the live automation layer.",
          segments: [
            {
              type: "text",
              value:
                "The setup fee covers the build, integrations, testing, and launch. The monthly retainer covers monitoring, support, iteration, and the live automation layer.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 8,
          text: "Start with a flagship pack if you want the fastest route to a complete workflow. Use the industry atlas if you need a smaller fix first or want to compare multiple options.",
          segments: [
            {
              type: "text",
              value:
                "Start with a flagship pack if you want the fastest route to a complete workflow. Use the industry atlas if you need a smaller fix first or want to compare multiple options.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 9,
          text: "Yes. Most clients start with one high-leverage workflow, prove the ROI, then add the next module once the first system is paying back.",
          segments: [
            {
              type: "text",
              value:
                "Yes. Most clients start with one high-leverage workflow, prove the ROI, then add the next module once the first system is paying back.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 10,
          text: "We review your current bottlenecks, identify the highest-value workflow to automate first, and recommend the pack or module that fits your stage, team, and tools.",
          segments: [
            {
              type: "text",
              value:
                "We review your current bottlenecks, identify the highest-value workflow to automate first, and recommend the pack or module that fits your stage, team, and tools.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 11,
          text: "Most focused systems go live within one to two weeks after the audit, depending on your stack, approvals, and the number of moving parts.",
          segments: [
            {
              type: "text",
              value:
                "Most focused systems go live within one to two weeks after the audit, depending on your stack, approvals, and the number of moving parts.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 5,
      sourceSelector: "section.section.brand-gradient.animate",
      sourceId: null,
      sourceClasses: ["section", "brand-gradient", "animate"],
      heading: {
        level: 2,
        text: "Price the right first workflow, not the biggest possible project.",
      },
      blocks: [
        {
          type: "heading",
          order: 12,
          level: 2,
          text: "Price the right first workflow, not the biggest possible project.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 13,
          text: "In a focused 30-minute audit, we show which pack or module matches your current revenue leak, where a smaller starting scope makes sense, and what to launch first for the fastest payback.",
          segments: [
            {
              type: "text",
              value:
                " In a focused 30-minute audit, we show which pack or module matches your current revenue leak, where a smaller starting scope makes sense, and what to launch first for the fastest payback. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 14,
          text: "Book a Free 30-Minute Automation Audit",
          segments: [
            {
              type: "text",
              value: "Book a Free 30-Minute Automation Audit",
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
    contentStatus: "refactor",
    claimsStatus: "review-pending",
    riskNotes: "2 images lack width/height",
    unresolvedNotes: [],
  },
};

export default content;
