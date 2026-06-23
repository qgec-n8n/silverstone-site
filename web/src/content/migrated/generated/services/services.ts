import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services",
  routeId: "route-services",
  routePath: "/services",
  kind: "service",
  source: {
    routeKey: "canonical:/services",
    file: "services.html",
    sha256: "f4646fce7cb1c86a25bafd9754ba8fddac5ed5b274a44ee870dbcd578f38f4e8",
    bytes: 53056,
    textSha256: "e7ed2f28031cb2a64fbb628425a9738cb39ae812fe648af674762f1dddbde373",
    extractedBlockCount: 81,
  },
  metadata: {
    title: "AI Automation Services by Industry | Silverstone AI",
    description:
      "Browse Silverstone AI automation services by industry for UK SMEs, from estate agents and hospitality to trades, eCommerce, clinics, dentists, gyms, and coaches.",
    canonical: "https://silverstone-ai.com/services",
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
        content: "https://silverstone-ai.com/services",
      },
      {
        property: "og:title",
        content: "AI Automation Services by Industry | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Browse Silverstone AI automation services by industry for UK SMEs, from estate agents and hospitality to trades, eCommerce, clinics, dentists, gyms, and coaches.",
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
        content: "AI Automation Services by Industry | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Browse Silverstone AI automation services by industry for UK SMEs, from estate agents and hospitality to trades, eCommerce, clinics, dentists, gyms, and coaches.",
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
      types: ["CollectionPage", "ItemList", "ListItem", "BreadcrumbList"],
      rawJson:
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "CollectionPage",\n          "@id": "https://silverstone-ai.com/services#webpage",\n          "url": "https://silverstone-ai.com/services",\n          "name": "AI Automation Services by Industry - Silverstone AI",\n          "description": "Browse Silverstone AI automation services by industry for UK SMEs, from estate agents and hospitality to trades, eCommerce, clinics, dentists, gyms, and coaches.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/#website"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services#itemlist"\n          }\n        },\n        {\n          "@type": "ItemList",\n          "@id": "https://silverstone-ai.com/services#itemlist",\n          "name": "Silverstone AI services by industry",\n          "numberOfItems": 9,\n          "itemListOrder": "https://schema.org/ItemListOrderAscending",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Estate Agents",\n              "url": "https://silverstone-ai.com/services/estate-agents"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Hospitality",\n              "url": "https://silverstone-ai.com/services/hospitality"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Salons & Barbers",\n              "url": "https://silverstone-ai.com/services/salons-barbers"\n            },\n            {\n              "@type": "ListItem",\n              "position": 4,\n              "name": "Trades",\n              "url": "https://silverstone-ai.com/services/trades"\n            },\n            {\n              "@type": "ListItem",\n              "position": 5,\n              "name": "eCommerce Brands",\n              "url": "https://silverstone-ai.com/services/ecommerce"\n            },\n            {\n              "@type": "ListItem",\n              "position": 6,\n              "name": "Physios & Chiropractors",\n              "url": "https://silverstone-ai.com/services/physios-chiropractors"\n            },\n            {\n              "@type": "ListItem",\n              "position": 7,\n              "name": "Dentists",\n              "url": "https://silverstone-ai.com/services/dentists"\n            },\n            {\n              "@type": "ListItem",\n              "position": 8,\n              "name": "Gyms & Fitness Studios",\n              "url": "https://silverstone-ai.com/services/gyms-fitness-studios"\n            },\n            {\n              "@type": "ListItem",\n              "position": 9,\n              "name": "Fitness Coaches",\n              "url": "https://silverstone-ai.com/services/fitness-coaches"\n            }\n          ]\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": "https://silverstone-ai.com/services#webpage",
            url: "https://silverstone-ai.com/services",
            name: "AI Automation Services by Industry - Silverstone AI",
            description:
              "Browse Silverstone AI automation services by industry for UK SMEs, from estate agents and hospitality to trades, eCommerce, clinics, dentists, gyms, and coaches.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/#website",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services#itemlist",
            },
          },
          {
            "@type": "ItemList",
            "@id": "https://silverstone-ai.com/services#itemlist",
            name: "Silverstone AI services by industry",
            numberOfItems: 9,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Estate Agents",
                url: "https://silverstone-ai.com/services/estate-agents",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Hospitality",
                url: "https://silverstone-ai.com/services/hospitality",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Salons & Barbers",
                url: "https://silverstone-ai.com/services/salons-barbers",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Trades",
                url: "https://silverstone-ai.com/services/trades",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "eCommerce Brands",
                url: "https://silverstone-ai.com/services/ecommerce",
              },
              {
                "@type": "ListItem",
                position: 6,
                name: "Physios & Chiropractors",
                url: "https://silverstone-ai.com/services/physios-chiropractors",
              },
              {
                "@type": "ListItem",
                position: 7,
                name: "Dentists",
                url: "https://silverstone-ai.com/services/dentists",
              },
              {
                "@type": "ListItem",
                position: 8,
                name: "Gyms & Fitness Studios",
                url: "https://silverstone-ai.com/services/gyms-fitness-studios",
              },
              {
                "@type": "ListItem",
                position: 9,
                name: "Fitness Coaches",
                url: "https://silverstone-ai.com/services/fitness-coaches",
              },
            ],
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services#breadcrumb",
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
      text: "Silverstone AI services, organised by industry.",
    },
    {
      order: 1,
      level: 2,
      text: "Move from the overview into the right industry page, then into pricing.",
    },
    {
      order: 2,
      level: 2,
      text: "Choose the industry page that matches your team.",
    },
    {
      order: 3,
      level: 2,
      text: "Stop losing enquiries and hours to the same predictable bottlenecks.",
    },
    {
      order: 4,
      level: 3,
      text: "Where leads and time leak.",
    },
    {
      order: 5,
      level: 2,
      text: "Productised automation packs - built to fix one painful bottleneck first.",
    },
    {
      order: 6,
      level: 3,
      text: "Start small. Prove ROI. Scale.",
    },
    {
      order: 7,
      level: 4,
      text: "What every pack includes",
    },
    {
      order: 8,
      level: 3,
      text: "Extend the core workflow.",
    },
    {
      order: 9,
      level: 2,
      text: "The numbers behind missed enquiries and wasted capacity",
    },
    {
      order: 10,
      level: 2,
      text: "More bookings. Faster responses. Less admin.",
    },
    {
      order: 11,
      level: 3,
      text: "What changes after launch",
    },
    {
      order: 12,
      level: 2,
      text: "A simple four-step process to get automation live without disruption",
    },
    {
      order: 13,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 14,
      level: 4,
      text: "Pick the first win",
    },
    {
      order: 15,
      level: 4,
      text: "Build, connect and launch",
    },
    {
      order: 16,
      level: 4,
      text: "Refine and expand",
    },
    {
      order: 17,
      level: 2,
      text: "On-brand, controllable, and built around your existing systems",
    },
    {
      order: 18,
      level: 4,
      text: "Transparent scope and fees",
    },
    {
      order: 19,
      level: 4,
      text: "Your tone of voice",
    },
    {
      order: 20,
      level: 4,
      text: "Human handoff built in",
    },
    {
      order: 21,
      level: 4,
      text: "Data handled responsibly",
    },
    {
      order: 22,
      level: 2,
      text: "See every Silverstone AI pack, module, and industry price on one page.",
    },
    {
      order: 23,
      level: 2,
      text: "Browse practical automation guides that answer the questions buyers ask before they book.",
    },
    {
      order: 24,
      level: 2,
      text: "General Services FAQs",
    },
    {
      order: 25,
      level: 2,
      text: "Find the one workflow that will pay back fastest.",
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
        text: "Silverstone AI services, organised by industry.",
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
          text: "Open your industry page, compare the relevant pack, then move into pricing when you want exact numbers.",
          segments: [
            {
              type: "text",
              value:
                "Open your industry page, compare the relevant pack, then move into pricing when you want exact numbers.",
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
          text: "Explore industries",
          segments: [
            {
              type: "text",
              value: "Explore industries",
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
        text: "Move from the overview into the right industry page, then into pricing.",
      },
      blocks: [
        {
          type: "heading",
          order: 4,
          level: 2,
          text: "Move from the overview into the right industry page, then into pricing.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 5,
          text: "Start broad, open the industry page that matches your business, compare the pack and modules that fit, then book when you want a scoped recommendation.",
          segments: [
            {
              type: "text",
              value:
                "Start broad, open the industry page that matches your business, compare the pack and modules that fit, then book when you want a scoped recommendation.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 6,
          text: "01 Overview Stay here if you still need the broad picture of what Silverstone AI covers.",
          segments: [
            {
              type: "text",
              value:
                " 01 Overview Stay here if you still need the broad picture of what Silverstone AI covers. ",
            },
          ],
          sourceSelector: "a.commercial-pathway__step",
        },
        {
          type: "paragraph",
          order: 7,
          text: "02 Industry pages Use the directory below to open the page that matches your team and buying intent.",
          segments: [
            {
              type: "text",
              value:
                " 02 Industry pages Use the directory below to open the page that matches your team and buying intent. ",
            },
          ],
          sourceSelector: "a.commercial-pathway__step",
        },
        {
          type: "paragraph",
          order: 8,
          text: "03 Pricing Compare the exact module and bundle options in the atlas.",
          segments: [
            {
              type: "text",
              value:
                " 03 Pricing Compare the exact module and bundle options in the atlas. ",
            },
          ],
          sourceSelector: "a.commercial-pathway__step",
        },
        {
          type: "paragraph",
          order: 9,
          text: "04 Book Book the audit once you want the right first workflow mapped.",
          segments: [
            {
              type: "text",
              value:
                " 04 Book Book the audit once you want the right first workflow mapped. ",
            },
          ],
          sourceSelector: "a.commercial-pathway__step",
        },
      ],
    },
    {
      order: 2,
      sourceSelector: "section#service-page-clusters",
      sourceId: "service-page-clusters",
      sourceClasses: [
        "section",
        "bg-circuit",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Choose the industry page that matches your team.",
      },
      blocks: [
        {
          type: "heading",
          order: 10,
          level: 2,
          text: "Choose the industry page that matches your team.",
          sourceSelector: "h2.section-title.industry-directory-shell__title",
        },
        {
          type: "paragraph",
          order: 11,
          text: "Each page gives you the most relevant pack, supporting guides, and a short explanation of where automation pays back fastest.",
          segments: [
            {
              type: "text",
              value:
                "Each page gives you the most relevant pack, supporting guides, and a short explanation of where automation pays back fastest.",
            },
          ],
          sourceSelector: "p.section-subtitle.industry-directory-shell__subtitle",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Estate Agents Lead capture, viewings, feedback, and vendor follow-up.",
          segments: [
            {
              type: "text",
              value:
                "  Estate Agents Lead capture, viewings, feedback, and vendor follow-up. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 13,
          text: "Hospitality Booking questions, guest messaging, reminders, and reviews.",
          segments: [
            {
              type: "text",
              value:
                "  Hospitality Booking questions, guest messaging, reminders, and reviews. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 14,
          text: "Salons & Barbers No-show reduction, rebooking, reviews, and gap-filling.",
          segments: [
            {
              type: "text",
              value:
                "  Salons & Barbers No-show reduction, rebooking, reviews, and gap-filling. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 15,
          text: "Trades Missed calls, job triage, quote follow-up, and ETAs.",
          segments: [
            {
              type: "text",
              value: "  Trades Missed calls, job triage, quote follow-up, and ETAs. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 16,
          text: "eCommerce Brands Cart recovery, support triage, returns, and repeat purchase.",
          segments: [
            {
              type: "text",
              value:
                "  eCommerce Brands Cart recovery, support triage, returns, and repeat purchase. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Physios & Chiropractors Intake, reminders, rebooking, and care-plan follow-up.",
          segments: [
            {
              type: "text",
              value:
                "  Physios & Chiropractors Intake, reminders, rebooking, and care-plan follow-up. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 18,
          text: "Dentists Missed-call recovery, recalls, hygiene fill, and follow-up.",
          segments: [
            {
              type: "text",
              value:
                "  Dentists Missed-call recovery, recalls, hygiene fill, and follow-up. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Gyms & Fitness Studios Class fill, cancellations, win-back, and member retention.",
          segments: [
            {
              type: "text",
              value:
                "  Gyms & Fitness Studios Class fill, cancellations, win-back, and member retention. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 20,
          text: "Fitness Coaches DMs, lead scoring, onboarding, and nurture.",
          segments: [
            {
              type: "text",
              value: "  Fitness Coaches DMs, lead scoring, onboarding, and nurture. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
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
        text: "Stop losing enquiries and hours to the same predictable bottlenecks.",
      },
      blocks: [
        {
          type: "heading",
          order: 21,
          level: 2,
          text: "Stop losing enquiries and hours to the same predictable bottlenecks.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 22,
          text: "Most small businesses do not have a demand problem - they have a response, follow-up, and admin overload problem.",
          segments: [
            {
              type: "text",
              value:
                "Most small businesses do not have a demand problem - they have a response, follow-up, and admin overload problem.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 23,
          level: 3,
          text: "Where leads and time leak.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 24,
          text: "When calls hit during service, inboxes pile up overnight, and bookings rely on manual chasing, revenue slips before your team can catch it.",
          segments: [
            {
              type: "text",
              value:
                "When calls hit during service, inboxes pile up overnight, and bookings rely on manual chasing, revenue slips before your team can catch it.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 25,
          ordered: false,
          items: [
            {
              text: "Unanswered calls and slow replies cost ready-to-buy leads.",
              segments: [
                {
                  type: "text",
                  value: "Unanswered calls and slow replies cost ready-to-buy leads.",
                },
              ],
            },
            {
              text: "Prospects expect a fast answer across phone, forms, and messaging.",
              segments: [
                {
                  type: "text",
                  value:
                    "Prospects expect a fast answer across phone, forms, and messaging.",
                },
              ],
            },
            {
              text: "Manual booking and follow-up creates weak handovers and dropped tasks.",
              segments: [
                {
                  type: "text",
                  value:
                    "Manual booking and follow-up creates weak handovers and dropped tasks.",
                },
              ],
            },
            {
              text: "No-shows and late cancellations leave gaps you cannot refill fast enough.",
              segments: [
                {
                  type: "text",
                  value:
                    "No-shows and late cancellations leave gaps you cannot refill fast enough.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
      ],
    },
    {
      order: 4,
      sourceSelector: "section#automation-packs",
      sourceId: "automation-packs",
      sourceClasses: [
        "section",
        "bg-circuit",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Productised automation packs - built to fix one painful bottleneck first.",
      },
      blocks: [
        {
          type: "heading",
          order: 26,
          level: 2,
          text: "Productised automation packs - built to fix one painful bottleneck first.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 27,
          text: "Choose an industry pack or start with a general automation block. Everything is designed to sit on top of your existing tools - not replace them.",
          segments: [
            {
              type: "text",
              value:
                "Choose an industry pack or start with a general automation block. Everything is designed to sit on top of your existing tools - not replace them.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 28,
          level: 3,
          text: "Start small. Prove ROI. Scale.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 29,
          text: "Each pack fixes one costly bottleneck first, then gives you a clean base to expand without rebuilding from scratch.",
          segments: [
            {
              type: "text",
              value:
                "Each pack fixes one costly bottleneck first, then gives you a clean base to expand without rebuilding from scratch.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 30,
          level: 4,
          text: "What every pack includes",
          sourceSelector: "h4",
        },
        {
          type: "list",
          order: 31,
          ordered: false,
          items: [
            {
              text: "Always-on enquiry capture across web, messaging, and phone where relevant.",
              segments: [
                {
                  type: "text",
                  value:
                    "Always-on enquiry capture across web, messaging, and phone where relevant.",
                },
              ],
            },
            {
              text: "Qualification that routes strong leads and filters noise.",
              segments: [
                {
                  type: "text",
                  value: "Qualification that routes strong leads and filters noise.",
                },
              ],
            },
            {
              text: "Booking, confirmations, and reminders that cut no-shows.",
              segments: [
                {
                  type: "text",
                  value: "Booking, confirmations, and reminders that cut no-shows.",
                },
              ],
            },
            {
              text: "Follow-up flows for quotes, viewings, rebookings, and renewals.",
              segments: [
                {
                  type: "text",
                  value:
                    "Follow-up flows for quotes, viewings, rebookings, and renewals.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
        {
          type: "heading",
          order: 32,
          level: 3,
          text: "Extend the core workflow.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 33,
          text: "Once the revenue-critical flow is fixed, we can layer in the supporting automations that remove more admin and sharpen reporting.",
          segments: [
            {
              type: "text",
              value:
                "Once the revenue-critical flow is fixed, we can layer in the supporting automations that remove more admin and sharpen reporting.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 34,
          ordered: false,
          items: [
            {
              text: "Marketing automation for campaigns, content repurposing, and nurture flows.",
              segments: [
                {
                  type: "text",
                  value:
                    "Marketing automation for campaigns, content repurposing, and nurture flows.",
                },
              ],
            },
            {
              text: "Workflow and data automation for scheduling, dashboards, and handoffs.",
              segments: [
                {
                  type: "text",
                  value:
                    "Workflow and data automation for scheduling, dashboards, and handoffs.",
                },
              ],
            },
            {
              text: "Document and finance automation for OCR, invoicing, and reconciliation.",
              segments: [
                {
                  type: "text",
                  value:
                    "Document and finance automation for OCR, invoicing, and reconciliation.",
                },
              ],
            },
            {
              text: "System integration with APIs, n8n, and Zapier to remove rekeying.",
              segments: [
                {
                  type: "text",
                  value:
                    "System integration with APIs, n8n, and Zapier to remove rekeying.",
                },
              ],
            },
            {
              text: "Practical AI advisory on tools, agents, and rollout risk.",
              segments: [
                {
                  type: "text",
                  value: "Practical AI advisory on tools, agents, and rollout risk.",
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
        text: "The numbers behind missed enquiries and wasted capacity",
      },
      blocks: [
        {
          type: "heading",
          order: 35,
          level: 2,
          text: "The numbers behind missed enquiries and wasted capacity",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 36,
          text: "Benchmarks vary by industry, but these patterns show up again and again when response and follow-up are manual.",
          segments: [
            {
              type: "text",
              value:
                "Benchmarks vary by industry, but these patterns show up again and again when response and follow-up are manual.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
      ],
    },
    {
      order: 6,
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
        text: "More bookings. Faster responses. Less admin.",
      },
      blocks: [
        {
          type: "heading",
          order: 37,
          level: 2,
          text: "More bookings. Faster responses. Less admin.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 38,
          text: "Automation should make your business easier to buy from - and easier to run.",
          segments: [
            {
              type: "text",
              value:
                "Automation should make your business easier to buy from - and easier to run.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 39,
          level: 3,
          text: "What changes after launch",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 40,
          text: "Once the basics run automatically, teams respond faster, stay organised, and stop relying on memory to keep revenue moving.",
          segments: [
            {
              type: "text",
              value:
                "Once the basics run automatically, teams respond faster, stay organised, and stop relying on memory to keep revenue moving.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 41,
          ordered: false,
          items: [
            {
              text: "More enquiries convert because first response is immediate and consistent.",
              segments: [
                {
                  type: "text",
                  value:
                    "More enquiries convert because first response is immediate and consistent.",
                },
              ],
            },
            {
              text: "Fewer no-shows thanks to confirmations, reminders, and easier reschedules.",
              segments: [
                {
                  type: "text",
                  value:
                    "Fewer no-shows thanks to confirmations, reminders, and easier reschedules.",
                },
              ],
            },
            {
              text: "Less admin spent copying, chasing, and moving bookings around.",
              segments: [
                {
                  type: "text",
                  value:
                    "Less admin spent copying, chasing, and moving bookings around.",
                },
              ],
            },
            {
              text: "Clearer visibility over what is booked, pending, and needs a person.",
              segments: [
                {
                  type: "text",
                  value:
                    "Clearer visibility over what is booked, pending, and needs a person.",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
      ],
    },
    {
      order: 7,
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
        text: "A simple four-step process to get automation live without disruption",
      },
      blocks: [
        {
          type: "heading",
          order: 42,
          level: 2,
          text: "A simple four-step process to get automation live without disruption",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 43,
          text: "We start with the fastest win, then expand only when it is working.",
          segments: [
            {
              type: "text",
              value:
                "We start with the fastest win, then expand only when it is working.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 44,
          level: 4,
          text: "Quick automation audit",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 45,
          text: "Map how enquiries, bookings and admin are handled today, and where time and revenue leak.",
          segments: [
            {
              type: "text",
              value:
                "Map how enquiries, bookings and admin are handled today, and where time and revenue leak.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 46,
          level: 4,
          text: "Pick the first win",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 47,
          text: "Choose one pack or workflow to implement first, based on impact and simplicity.",
          segments: [
            {
              type: "text",
              value:
                "Choose one pack or workflow to implement first, based on impact and simplicity.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 48,
          level: 4,
          text: "Build, connect and launch",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Integrate with your existing tools, test safely, then go live in a controlled way.",
          segments: [
            {
              type: "text",
              value:
                "Integrate with your existing tools, test safely, then go live in a controlled way.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 50,
          level: 4,
          text: "Refine and expand",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Improve wording and routing, add new journeys, and tighten reporting as patterns emerge.",
          segments: [
            {
              type: "text",
              value:
                "Improve wording and routing, add new journeys, and tighten reporting as patterns emerge.",
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
        text: "On-brand, controllable, and built around your existing systems",
      },
      blocks: [
        {
          type: "heading",
          order: 52,
          level: 2,
          text: "On-brand, controllable, and built around your existing systems",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 53,
          text: "Automation should protect your customer experience - not compromise it.",
          segments: [
            {
              type: "text",
              value:
                "Automation should protect your customer experience - not compromise it.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 54,
          level: 4,
          text: "Transparent scope and fees",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 55,
          text: "You see what is included before anything goes live. No invented guarantees.",
          segments: [
            {
              type: "text",
              value:
                "You see what is included before anything goes live. No invented guarantees.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 56,
          level: 4,
          text: "Your tone of voice",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 57,
          text: "Messages are written in your style, reviewed with you, and easy to adjust.",
          segments: [
            {
              type: "text",
              value:
                "Messages are written in your style, reviewed with you, and easy to adjust.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 58,
          level: 4,
          text: "Human handoff built in",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 59,
          text: "You decide what the system can and cannot do, with exceptions routed to a person.",
          segments: [
            {
              type: "text",
              value:
                "You decide what the system can and cannot do, with exceptions routed to a person.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 60,
          level: 4,
          text: "Data handled responsibly",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 61,
          text: "We capture only what is needed and work within sensible data-protection practices.",
          segments: [
            {
              type: "text",
              value:
                "We capture only what is needed and work within sensible data-protection practices.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 9,
      sourceSelector: "section#pricing",
      sourceId: "pricing",
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "See every Silverstone AI pack, module, and industry price on one page.",
      },
      blocks: [
        {
          type: "heading",
          order: 62,
          level: 2,
          text: "See every Silverstone AI pack, module, and industry price on one page.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 63,
          text: "Compare flagship systems, smaller fixes, and industry-specific bundles before you book, so pricing intent moves cleanly into the right solution.",
          segments: [
            {
              type: "text",
              value:
                " Compare flagship systems, smaller fixes, and industry-specific bundles before you book, so pricing intent moves cleanly into the right solution. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 64,
          text: "View Full Pricing",
          segments: [
            {
              type: "text",
              value: "View Full Pricing",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 65,
          text: "Compare Industry Packs",
          segments: [
            {
              type: "text",
              value: "Compare Industry Packs",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
      ],
    },
    {
      order: 10,
      sourceSelector: "section#service-supporting-guides",
      sourceId: "service-supporting-guides",
      sourceClasses: [
        "section",
        "bg-lines",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Browse practical automation guides that answer the questions buyers ask before they book.",
      },
      blocks: [
        {
          type: "heading",
          order: 66,
          level: 2,
          text: "Browse practical automation guides that answer the questions buyers ask before they book.",
          sourceSelector: "h2.section-title.services-resource-shell__title",
        },
        {
          type: "paragraph",
          order: 67,
          text: "Start with the highlighted guides below, then open the full blog library for every industry article, pricing question, and rollout guide.",
          segments: [
            {
              type: "text",
              value:
                "Start with the highlighted guides below, then open the full blog library for every industry article, pricing question, and rollout guide.",
            },
          ],
          sourceSelector: "p.section-subtitle.services-resource-shell__subtitle",
        },
        {
          type: "list",
          order: 68,
          ordered: false,
          items: [
            {
              text: "Appointment reminders for UK SMEs",
              segments: [
                {
                  type: "link",
                  text: "Appointment reminders for UK SMEs",
                  href: "/blog/ai-appointment-reminders-uk-2026",
                  sourceHref: "/blog/ai-appointment-reminders-uk-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "AI automation and UK GDPR",
              segments: [
                {
                  type: "link",
                  text: "AI automation and UK GDPR",
                  href: "/blog/ai-automation-uk-gdpr-2026-sme-guide",
                  sourceHref: "/blog/ai-automation-uk-gdpr-2026-sme-guide",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Booking automation for UK hospitality",
              segments: [
                {
                  type: "link",
                  text: "Booking automation for UK hospitality",
                  href: "/blog/ai-booking-automation-uk-hospitality-2026",
                  sourceHref: "/blog/ai-booking-automation-uk-hospitality-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Lead capture for UK trades",
              segments: [
                {
                  type: "link",
                  text: "Lead capture for UK trades",
                  href: "/blog/ai-lead-capture-trades-uk-2026",
                  sourceHref: "/blog/ai-lead-capture-trades-uk-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Lead qualification for estate agents",
              segments: [
                {
                  type: "link",
                  text: "Lead qualification for estate agents",
                  href: "/blog/ai-lead-qualification-estate-agents-2026",
                  sourceHref: "/blog/ai-lead-qualification-estate-agents-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Viewing feedback follow-up for estate agents",
              segments: [
                {
                  type: "link",
                  text: "Viewing feedback follow-up for estate agents",
                  href: "/blog/ai-viewing-feedback-estate-agents-uk",
                  sourceHref: "/blog/ai-viewing-feedback-estate-agents-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "AI receptionist costs and ROI",
              segments: [
                {
                  type: "link",
                  text: "AI receptionist costs and ROI",
                  href: "/blog/ai-receptionist-uk-costs-roi-2026",
                  sourceHref: "/blog/ai-receptionist-uk-costs-roi-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Fix AI automation failures",
              segments: [
                {
                  type: "link",
                  text: "Fix AI automation failures",
                  href: "/blog/ai-automation-failures-uk-smes-2026",
                  sourceHref: "/blog/ai-automation-failures-uk-smes-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Document automation for UK SMEs",
              segments: [
                {
                  type: "link",
                  text: "Document automation for UK SMEs",
                  href: "/blog/ai-document-automation-uk-smes-2026",
                  sourceHref: "/blog/ai-document-automation-uk-smes-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "ETA scheduling for UK trades",
              segments: [
                {
                  type: "link",
                  text: "ETA scheduling for UK trades",
                  href: "/blog/ai-etas-smart-scheduling-uk-trades-2026",
                  sourceHref: "/blog/ai-etas-smart-scheduling-uk-trades-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Missed-call lead capture for UK trades",
              segments: [
                {
                  type: "link",
                  text: "Missed-call lead capture for UK trades",
                  href: "/blog/ai-lead-capture-uk-trades-2026",
                  sourceHref: "/blog/ai-lead-capture-uk-trades-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "No-show reduction for UK salons",
              segments: [
                {
                  type: "link",
                  text: "No-show reduction for UK salons",
                  href: "/blog/ai-no-show-reduction-uk-salons-barbers",
                  sourceHref: "/blog/ai-no-show-reduction-uk-salons-barbers",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "AI receptionist systems for SMEs",
              segments: [
                {
                  type: "link",
                  text: "AI receptionist systems for SMEs",
                  href: "/blog/ai-receptionist-small-business-2026",
                  sourceHref: "/blog/ai-receptionist-small-business-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "AI voice agents for UK SMEs",
              segments: [
                {
                  type: "link",
                  text: "AI voice agents for UK SMEs",
                  href: "/blog/ai-voice-agents-uk-smes-2026",
                  sourceHref: "/blog/ai-voice-agents-uk-smes-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "AI website tools for UK SMEs",
              segments: [
                {
                  type: "link",
                  text: "AI website tools for UK SMEs",
                  href: "/blog/ai-website-tools-uk-small-businesses-2026",
                  sourceHref: "/blog/ai-website-tools-uk-small-businesses-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Dental recall automation",
              segments: [
                {
                  type: "link",
                  text: "Dental recall automation",
                  href: "/blog/dental-recall-automation-uk-2026",
                  sourceHref: "/blog/dental-recall-automation-uk-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "DM automation for fitness coaches",
              segments: [
                {
                  type: "link",
                  text: "DM automation for fitness coaches",
                  href: "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
                  sourceHref: "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Gym booking automation for UK studios",
              segments: [
                {
                  type: "link",
                  text: "Gym booking automation for UK studios",
                  href: "/blog/gym-booking-automation-uk-gyms-studios-2026",
                  sourceHref: "/blog/gym-booking-automation-uk-gyms-studios-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Automation for physio and chiro clinics",
              segments: [
                {
                  type: "link",
                  text: "Automation for physio and chiro clinics",
                  href: "/blog/ai-automations-physio-chiro-clinics-uk",
                  sourceHref: "/blog/ai-automations-physio-chiro-clinics-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Viewing confirmations for estate agents",
              segments: [
                {
                  type: "link",
                  text: "Viewing confirmations for estate agents",
                  href: "/blog/estate-agent-viewing-confirmations-uk",
                  sourceHref: "/blog/estate-agent-viewing-confirmations-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Missed-call recovery for dental practices",
              segments: [
                {
                  type: "link",
                  text: "Missed-call recovery for dental practices",
                  href: "/blog/ai-missed-call-recovery-dentists-uk",
                  sourceHref: "/blog/ai-missed-call-recovery-dentists-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Dental intake and e-consent automation",
              segments: [
                {
                  type: "link",
                  text: "Dental intake and e-consent automation",
                  href: "/blog/dental-intake-e-consent-automation-uk",
                  sourceHref: "/blog/dental-intake-e-consent-automation-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Returns triage for eCommerce brands",
              segments: [
                {
                  type: "link",
                  text: "Returns triage for eCommerce brands",
                  href: "/blog/ai-returns-triage-ecommerce-uk",
                  sourceHref: "/blog/ai-returns-triage-ecommerce-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Lead scoring for fitness coaches",
              segments: [
                {
                  type: "link",
                  text: "Lead scoring for fitness coaches",
                  href: "/blog/ai-lead-scoring-fitness-coaches-uk",
                  sourceHref: "/blog/ai-lead-scoring-fitness-coaches-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Win-back journeys for gyms and studios",
              segments: [
                {
                  type: "link",
                  text: "Win-back journeys for gyms and studios",
                  href: "/blog/ai-win-back-journeys-gyms-uk",
                  sourceHref: "/blog/ai-win-back-journeys-gyms-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "24/7 guest concierge for hotels and B&Bs",
              segments: [
                {
                  type: "link",
                  text: "24/7 guest concierge for hotels and B&Bs",
                  href: "/blog/ai-guest-concierge-hotels-bbs-uk",
                  sourceHref: "/blog/ai-guest-concierge-hotels-bbs-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Clinic rebooking for physio and chiropractic teams",
              segments: [
                {
                  type: "link",
                  text: "Clinic rebooking for physio and chiropractic teams",
                  href: "/blog/clinic-rebooking-physio-chiro-uk",
                  sourceHref: "/blog/clinic-rebooking-physio-chiro-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Rebooking journeys for salons and barbers",
              segments: [
                {
                  type: "link",
                  text: "Rebooking journeys for salons and barbers",
                  href: "/blog/ai-rebooking-journeys-salons-uk",
                  sourceHref: "/blog/ai-rebooking-journeys-salons-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "After-hours call answering for UK trades",
              segments: [
                {
                  type: "link",
                  text: "After-hours call answering for UK trades",
                  href: "/blog/ai-call-answering-trades-uk",
                  sourceHref: "/blog/ai-call-answering-trades-uk",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Post-purchase automation for eCommerce brands",
              segments: [
                {
                  type: "link",
                  text: "Post-purchase automation for eCommerce brands",
                  href: "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
                  sourceHref:
                    "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Quote-chasing for UK trades",
              segments: [
                {
                  type: "link",
                  text: "Quote-chasing for UK trades",
                  href: "/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
                  sourceHref:
                    "/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Quote follow-up for UK trades",
              segments: [
                {
                  type: "link",
                  text: "Quote follow-up for UK trades",
                  href: "/blog/quote-follow-up-automation-uk-trades-2026",
                  sourceHref: "/blog/quote-follow-up-automation-uk-trades-2026",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "View all automation guides",
              segments: [
                {
                  type: "link",
                  text: "View all automation guides",
                  href: "/blog",
                  sourceHref: "/blog",
                  external: false,
                  valid: true,
                },
              ],
            },
            {
              text: "Supporting guides for trades businesses",
              segments: [
                {
                  type: "link",
                  text: "Supporting guides for trades businesses",
                  href: "/blog/ai-quote-follow-up-trades",
                  sourceHref: "/blog/ai-quote-follow-up-trades",
                  external: false,
                  valid: true,
                },
              ],
            },
          ],
          sourceSelector: "ul.services-resource-list.services-resource-list--blogs",
        },
        {
          type: "paragraph",
          order: 69,
          text: "Read the blog guides",
          segments: [
            {
              type: "text",
              value: "Read the blog guides",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
      ],
    },
    {
      order: 11,
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
        text: "General Services FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 70,
          level: 2,
          text: "General Services FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 71,
          text: "Start with the bottleneck that is most expensive in time or missed revenue - usually speed-to-lead, no-shows, or follow-up. In the free automation audit, we map your current flow and recommend one small project that unlocks the most time back first.",
          segments: [
            {
              type: "text",
              value:
                "Start with the bottleneck that is most expensive in time or missed revenue - usually speed-to-lead, no-shows, or follow-up. In the free automation audit, we map your current flow and recommend one small project that unlocks the most time back first.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 72,
          text: "No. Like the industry packs, general services are designed to sit on top of the systems you already use. Where direct integration is possible we connect it; where it is not, we design simple handovers that still keep your data accurate.",
          segments: [
            {
              type: "text",
              value:
                "No. Like the industry packs, general services are designed to sit on top of the systems you already use. Where direct integration is possible we connect it; where it is not, we design simple handovers that still keep your data accurate.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 73,
          text: "The aim is for interactions to feel like dealing with a switched-on member of your team. We keep language simple and helpful, and we build clear handoff rules so unusual or sensitive conversations go straight to a human.",
          segments: [
            {
              type: "text",
              value:
                "The aim is for interactions to feel like dealing with a switched-on member of your team. We keep language simple and helpful, and we build clear handoff rules so unusual or sensitive conversations go straight to a human.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 74,
          text: "Typically: website forms, web chat, email, messaging channels, and calendars. Where it makes sense, we also design missed-call capture and call-handling flows. We prioritise the channels your customers already use, so you are not forced into a new platform.",
          segments: [
            {
              type: "text",
              value:
                "Typically: website forms, web chat, email, messaging channels, and calendars. Where it makes sense, we also design missed-call capture and call-handling flows. We prioritise the channels your customers already use, so you are not forced into a new platform.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 75,
          text: "We build from your existing scripts and preferred wording, then review everything with you before launch. For regulated or sensitive contexts, we keep automation scoped to appropriate tasks (reminders, routing, information) and hand off anything outside agreed boundaries.",
          segments: [
            {
              type: "text",
              value:
                "We build from your existing scripts and preferred wording, then review everything with you before launch. For regulated or sensitive contexts, we keep automation scoped to appropriate tasks (reminders, routing, information) and hand off anything outside agreed boundaries.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 76,
          text: "Yes. We follow sensible data-protection practices, capture only what is genuinely needed, and keep data within tools you are comfortable using. You control what is stored, who can access it, and what is passed into other systems.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We follow sensible data-protection practices, capture only what is genuinely needed, and keep data within tools you are comfortable using. You control what is stored, who can access it, and what is passed into other systems.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 77,
          text: "Yes. Most clients start with one journey (for example, instant enquiry handling or reminders) and expand once it is delivering value. Automation should feel like a steady upgrade, not a risky overhaul.",
          segments: [
            {
              type: "text",
              value:
                "Yes. Most clients start with one journey (for example, instant enquiry handling or reminders) and expand once it is delivering value. Automation should feel like a steady upgrade, not a risky overhaul.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 12,
      sourceSelector: "section.section.brand-gradient.animate",
      sourceId: null,
      sourceClasses: ["section", "brand-gradient", "animate"],
      heading: {
        level: 2,
        text: "Find the one workflow that will pay back fastest.",
      },
      blocks: [
        {
          type: "heading",
          order: 78,
          level: 2,
          text: "Find the one workflow that will pay back fastest.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 79,
          text: "In a focused 30-minute audit, we pinpoint where slow response, weak follow-up, or manual admin is leaking the most revenue, then map the fastest route to a practical first win.",
          segments: [
            {
              type: "text",
              value:
                " In a focused 30-minute audit, we pinpoint where slow response, weak follow-up, or manual admin is leaking the most revenue, then map the fastest route to a practical first win. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 80,
          text: "Book a Free 30‑Minute Automation Audit",
          segments: [
            {
              type: "text",
              value: "Book a Free 30‑Minute Automation Audit",
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
      text: "Appointment reminders for UK SMEs",
      sourceHref: "/blog/ai-appointment-reminders-uk-2026",
      migratedHref: "/blog/ai-appointment-reminders-uk-2026",
      external: false,
      valid: true,
    },
    {
      order: 1,
      text: "AI automation and UK GDPR",
      sourceHref: "/blog/ai-automation-uk-gdpr-2026-sme-guide",
      migratedHref: "/blog/ai-automation-uk-gdpr-2026-sme-guide",
      external: false,
      valid: true,
    },
    {
      order: 2,
      text: "Booking automation for UK hospitality",
      sourceHref: "/blog/ai-booking-automation-uk-hospitality-2026",
      migratedHref: "/blog/ai-booking-automation-uk-hospitality-2026",
      external: false,
      valid: true,
    },
    {
      order: 3,
      text: "Lead capture for UK trades",
      sourceHref: "/blog/ai-lead-capture-trades-uk-2026",
      migratedHref: "/blog/ai-lead-capture-trades-uk-2026",
      external: false,
      valid: true,
    },
    {
      order: 4,
      text: "Lead qualification for estate agents",
      sourceHref: "/blog/ai-lead-qualification-estate-agents-2026",
      migratedHref: "/blog/ai-lead-qualification-estate-agents-2026",
      external: false,
      valid: true,
    },
    {
      order: 5,
      text: "Viewing feedback follow-up for estate agents",
      sourceHref: "/blog/ai-viewing-feedback-estate-agents-uk",
      migratedHref: "/blog/ai-viewing-feedback-estate-agents-uk",
      external: false,
      valid: true,
    },
    {
      order: 6,
      text: "AI receptionist costs and ROI",
      sourceHref: "/blog/ai-receptionist-uk-costs-roi-2026",
      migratedHref: "/blog/ai-receptionist-uk-costs-roi-2026",
      external: false,
      valid: true,
    },
    {
      order: 7,
      text: "Fix AI automation failures",
      sourceHref: "/blog/ai-automation-failures-uk-smes-2026",
      migratedHref: "/blog/ai-automation-failures-uk-smes-2026",
      external: false,
      valid: true,
    },
    {
      order: 8,
      text: "Document automation for UK SMEs",
      sourceHref: "/blog/ai-document-automation-uk-smes-2026",
      migratedHref: "/blog/ai-document-automation-uk-smes-2026",
      external: false,
      valid: true,
    },
    {
      order: 9,
      text: "ETA scheduling for UK trades",
      sourceHref: "/blog/ai-etas-smart-scheduling-uk-trades-2026",
      migratedHref: "/blog/ai-etas-smart-scheduling-uk-trades-2026",
      external: false,
      valid: true,
    },
    {
      order: 10,
      text: "Missed-call lead capture for UK trades",
      sourceHref: "/blog/ai-lead-capture-uk-trades-2026",
      migratedHref: "/blog/ai-lead-capture-uk-trades-2026",
      external: false,
      valid: true,
    },
    {
      order: 11,
      text: "No-show reduction for UK salons",
      sourceHref: "/blog/ai-no-show-reduction-uk-salons-barbers",
      migratedHref: "/blog/ai-no-show-reduction-uk-salons-barbers",
      external: false,
      valid: true,
    },
    {
      order: 12,
      text: "AI receptionist systems for SMEs",
      sourceHref: "/blog/ai-receptionist-small-business-2026",
      migratedHref: "/blog/ai-receptionist-small-business-2026",
      external: false,
      valid: true,
    },
    {
      order: 13,
      text: "AI voice agents for UK SMEs",
      sourceHref: "/blog/ai-voice-agents-uk-smes-2026",
      migratedHref: "/blog/ai-voice-agents-uk-smes-2026",
      external: false,
      valid: true,
    },
    {
      order: 14,
      text: "AI website tools for UK SMEs",
      sourceHref: "/blog/ai-website-tools-uk-small-businesses-2026",
      migratedHref: "/blog/ai-website-tools-uk-small-businesses-2026",
      external: false,
      valid: true,
    },
    {
      order: 15,
      text: "Dental recall automation",
      sourceHref: "/blog/dental-recall-automation-uk-2026",
      migratedHref: "/blog/dental-recall-automation-uk-2026",
      external: false,
      valid: true,
    },
    {
      order: 16,
      text: "DM automation for fitness coaches",
      sourceHref: "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
      migratedHref: "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
      external: false,
      valid: true,
    },
    {
      order: 17,
      text: "Gym booking automation for UK studios",
      sourceHref: "/blog/gym-booking-automation-uk-gyms-studios-2026",
      migratedHref: "/blog/gym-booking-automation-uk-gyms-studios-2026",
      external: false,
      valid: true,
    },
    {
      order: 18,
      text: "Automation for physio and chiro clinics",
      sourceHref: "/blog/ai-automations-physio-chiro-clinics-uk",
      migratedHref: "/blog/ai-automations-physio-chiro-clinics-uk",
      external: false,
      valid: true,
    },
    {
      order: 19,
      text: "Viewing confirmations for estate agents",
      sourceHref: "/blog/estate-agent-viewing-confirmations-uk",
      migratedHref: "/blog/estate-agent-viewing-confirmations-uk",
      external: false,
      valid: true,
    },
    {
      order: 20,
      text: "Missed-call recovery for dental practices",
      sourceHref: "/blog/ai-missed-call-recovery-dentists-uk",
      migratedHref: "/blog/ai-missed-call-recovery-dentists-uk",
      external: false,
      valid: true,
    },
    {
      order: 21,
      text: "Dental intake and e-consent automation",
      sourceHref: "/blog/dental-intake-e-consent-automation-uk",
      migratedHref: "/blog/dental-intake-e-consent-automation-uk",
      external: false,
      valid: true,
    },
    {
      order: 22,
      text: "Returns triage for eCommerce brands",
      sourceHref: "/blog/ai-returns-triage-ecommerce-uk",
      migratedHref: "/blog/ai-returns-triage-ecommerce-uk",
      external: false,
      valid: true,
    },
    {
      order: 23,
      text: "Lead scoring for fitness coaches",
      sourceHref: "/blog/ai-lead-scoring-fitness-coaches-uk",
      migratedHref: "/blog/ai-lead-scoring-fitness-coaches-uk",
      external: false,
      valid: true,
    },
    {
      order: 24,
      text: "Win-back journeys for gyms and studios",
      sourceHref: "/blog/ai-win-back-journeys-gyms-uk",
      migratedHref: "/blog/ai-win-back-journeys-gyms-uk",
      external: false,
      valid: true,
    },
    {
      order: 25,
      text: "24/7 guest concierge for hotels and B&Bs",
      sourceHref: "/blog/ai-guest-concierge-hotels-bbs-uk",
      migratedHref: "/blog/ai-guest-concierge-hotels-bbs-uk",
      external: false,
      valid: true,
    },
    {
      order: 26,
      text: "Clinic rebooking for physio and chiropractic teams",
      sourceHref: "/blog/clinic-rebooking-physio-chiro-uk",
      migratedHref: "/blog/clinic-rebooking-physio-chiro-uk",
      external: false,
      valid: true,
    },
    {
      order: 27,
      text: "Rebooking journeys for salons and barbers",
      sourceHref: "/blog/ai-rebooking-journeys-salons-uk",
      migratedHref: "/blog/ai-rebooking-journeys-salons-uk",
      external: false,
      valid: true,
    },
    {
      order: 28,
      text: "After-hours call answering for UK trades",
      sourceHref: "/blog/ai-call-answering-trades-uk",
      migratedHref: "/blog/ai-call-answering-trades-uk",
      external: false,
      valid: true,
    },
    {
      order: 29,
      text: "Post-purchase automation for eCommerce brands",
      sourceHref: "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
      migratedHref: "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
      external: false,
      valid: true,
    },
    {
      order: 30,
      text: "Quote-chasing for UK trades",
      sourceHref: "/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
      migratedHref: "/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
      external: false,
      valid: true,
    },
    {
      order: 31,
      text: "Quote follow-up for UK trades",
      sourceHref: "/blog/quote-follow-up-automation-uk-trades-2026",
      migratedHref: "/blog/quote-follow-up-automation-uk-trades-2026",
      external: false,
      valid: true,
    },
    {
      order: 32,
      text: "View all automation guides",
      sourceHref: "/blog",
      migratedHref: "/blog",
      external: false,
      valid: true,
    },
    {
      order: 33,
      text: "Supporting guides for trades businesses",
      sourceHref: "/blog/ai-quote-follow-up-trades",
      migratedHref: "/blog/ai-quote-follow-up-trades",
      external: false,
      valid: true,
    },
  ],
  assets: [],
  interactions: [],
  flags: {
    contentStatus: "refactor",
    claimsStatus: "review-pending",
    riskNotes: "6 images lack width/height",
    unresolvedNotes: [],
  },
};

export default content;
