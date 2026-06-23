import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-hospitality",
  routeId: "route-services-hospitality",
  routePath: "/services/hospitality",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/hospitality",
    file: "services/hospitality.html",
    sha256: "ec4424cb3b5fdf18e96e93ace6a255265b04570955aa4e0e34f59087a04294b4",
    bytes: 36630,
    textSha256: "122f5a744dbf0f502d637161ea710d252587fad41b3ed2ea9333c878ed6acae9",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Hospitality | Silverstone AI",
    description:
      "Silverstone AI helps UK hospitality teams automate bookings, guest follow-up, and concierge enquiries to capture more revenue.",
    canonical: "https://silverstone-ai.com/services/hospitality",
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
        content: "https://silverstone-ai.com/services/hospitality",
      },
      {
        property: "og:title",
        content: "AI Automation for Hospitality | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK hospitality teams automate bookings, guest follow-up, and concierge enquiries to capture more revenue.",
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
        content: "AI Automation for Hospitality | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK hospitality teams automate bookings, guest follow-up, and concierge enquiries to capture more revenue.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/hospitality#webpage",\n          "url": "https://silverstone-ai.com/services/hospitality",\n          "name": "Hospitality Automation for UK Teams - Silverstone AI",\n          "description": "Silverstone AI automation for UK hospitality teams: 24/7 guest enquiry handling, faster booking capture, fewer no-shows, and smoother operations.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/hospitality#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/hospitality#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/hospitality#service",\n          "name": "Hospitality Automation for UK Teams - Silverstone AI",\n          "serviceType": "AI Automation for UK Hospitality Teams",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/hospitality",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/hospitality#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK hospitality venues and guest teams"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-hospitality",\n            "description": "Setup fee plus monthly retainer options for hospitality automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/hospitality#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Hospitality",\n              "item": "https://silverstone-ai.com/services/hospitality"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/hospitality#webpage",
            url: "https://silverstone-ai.com/services/hospitality",
            name: "Hospitality Automation for UK Teams - Silverstone AI",
            description:
              "Silverstone AI automation for UK hospitality teams: 24/7 guest enquiry handling, faster booking capture, fewer no-shows, and smoother operations.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/hospitality#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/hospitality#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/hospitality#service",
            name: "Hospitality Automation for UK Teams - Silverstone AI",
            serviceType: "AI Automation for UK Hospitality Teams",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/hospitality",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/hospitality#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK hospitality venues and guest teams",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-hospitality",
              description:
                "Setup fee plus monthly retainer options for hospitality automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/hospitality#breadcrumb",
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
                name: "Hospitality",
                item: "https://silverstone-ai.com/services/hospitality",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Will guests notice they are not talking to a person?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The aim is for interactions to feel like messaging a switched-on member of your team. We use simple, conversational language and keep answers focused on what guests actually need. Whenever a query is unusual or sensitive, the system hands it back to a real staff member to respond."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Do we need to change our booking system?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. In most cases, we wrap around the booking tools you already use. The concierge can capture enquiries and either write into your existing system, send structured requests to your team or both. If you ever change platforms, the automation can move with you."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can this handle multiple sites or brands?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We can configure different flows, branding and information for each site while keeping a single view of how many enquiries and bookings are coming in. This is particularly useful for small groups that want consistent standards without losing local character."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will this add more work for my staff?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The goal is the opposite. Staff should see fewer repetitive questions and better quality enquiries. You will still choose how and when humans step in, but the system does the heavy lifting on confirmations, reminders and follow-ups."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What happens if we close for refurbishment or run special events?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "You can quickly switch messaging to reflect closures, special menus or events. We can also pre-build seasonal or event-specific flows so that campaigns and set menus are supported without scrambling at the last minute."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Is guest data handled safely?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We follow sensible data protection practices and only capture information that is genuinely needed for bookings and communication. You decide how long data is retained and which systems it is passed into."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will guests notice they are not talking to a person?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The aim is for interactions to feel like messaging a switched-on member of your team. We use simple, conversational language and keep answers focused on what guests actually need. Whenever a query is unusual or sensitive, the system hands it back to a real staff member to respond.",
            },
          },
          {
            "@type": "Question",
            name: "Do we need to change our booking system?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. In most cases, we wrap around the booking tools you already use. The concierge can capture enquiries and either write into your existing system, send structured requests to your team or both. If you ever change platforms, the automation can move with you.",
            },
          },
          {
            "@type": "Question",
            name: "Can this handle multiple sites or brands?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We can configure different flows, branding and information for each site while keeping a single view of how many enquiries and bookings are coming in. This is particularly useful for small groups that want consistent standards without losing local character.",
            },
          },
          {
            "@type": "Question",
            name: "Will this add more work for my staff?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The goal is the opposite. Staff should see fewer repetitive questions and better quality enquiries. You will still choose how and when humans step in, but the system does the heavy lifting on confirmations, reminders and follow-ups.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if we close for refurbishment or run special events?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can quickly switch messaging to reflect closures, special menus or events. We can also pre-build seasonal or event-specific flows so that campaigns and set menus are supported without scrambling at the last minute.",
            },
          },
          {
            "@type": "Question",
            name: "Is guest data handled safely?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We follow sensible data protection practices and only capture information that is genuinely needed for bookings and communication. You decide how long data is retained and which systems it is passed into.",
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
      text: "Hospitality: a guest concierge that never sleeps.",
    },
    {
      order: 1,
      level: 2,
      text: "Busy shifts shouldn’t cost you bookings.",
    },
    {
      order: 2,
      level: 3,
      text: "Where bookings get lost.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘Hospitality 24/7 Guest Concierge’",
    },
    {
      order: 4,
      level: 3,
      text: "A digital front desk, 24/7",
    },
    {
      order: 5,
      level: 2,
      text: "What missed bookings cost",
    },
    {
      order: 6,
      level: 2,
      text: "Fuller books, happier guests, calmer teams",
    },
    {
      order: 7,
      level: 3,
      text: "Less firefighting. More covers.",
    },
    {
      order: 8,
      level: 2,
      text: "Overlay your existing systems — don’t replace them",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Design your guest journeys",
    },
    {
      order: 11,
      level: 4,
      text: "Connect and launch",
    },
    {
      order: 12,
      level: 4,
      text: "Refine and expand",
    },
    {
      order: 13,
      level: 2,
      text: "On-brand, guest-friendly, and privacy-aware",
    },
    {
      order: 14,
      level: 4,
      text: "Transparent setup and monthly fees",
    },
    {
      order: 15,
      level: 4,
      text: "Your tone of voice",
    },
    {
      order: 16,
      level: 4,
      text: "Human handoff built in",
    },
    {
      order: 17,
      level: 4,
      text: "Data handled responsibly",
    },
    {
      order: 18,
      level: 2,
      text: "Hospitality Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to stop losing bookings to busy shifts?",
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
        text: "Hospitality: a guest concierge that never sleeps.",
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
          text: "Automation that answers guest questions, takes bookings, and chases reviews while your team focuses on service.",
          segments: [
            {
              type: "text",
              value:
                "Automation that answers guest questions, takes bookings, and chases reviews while your team focuses on service.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: hotels, serviced stays, and small groups handling booking questions, late arrivals, and reviews.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: hotels, serviced stays, and small groups handling booking questions, late arrivals, and reviews.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free hospitality automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free hospitality automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘Hospitality 24/7 Guest Concierge’ bundle",
          segments: [
            {
              type: "text",
              value: "See the ‘Hospitality 24/7 Guest Concierge’ bundle",
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
        text: "Busy shifts shouldn’t cost you bookings.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Busy shifts shouldn’t cost you bookings.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "When enquiries and DMs go unanswered, guests book elsewhere — and no-shows leave gaps you can’t fill.",
          segments: [
            {
              type: "text",
              value:
                "When enquiries and DMs go unanswered, guests book elsewhere — and no-shows leave gaps you can’t fill.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where bookings get lost.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "When service is busy, unanswered calls, DMs, and late confirmations turn straight into empty tables and rooms.",
          segments: [
            {
              type: "text",
              value:
                "When service is busy, unanswered calls, DMs, and late confirmations turn straight into empty tables and rooms.",
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
              text: "Phones ring during service while staff are already with guests.",
              segments: [
                {
                  type: "text",
                  value:
                    "Phones ring during service while staff are already with guests.",
                },
              ],
            },
            {
              text: "Simple questions eat hours that should stay on the floor.",
              segments: [
                {
                  type: "text",
                  value: "Simple questions eat hours that should stay on the floor.",
                },
              ],
            },
            {
              text: "Online enquiries and DMs sit unanswered when teams are stretched.",
              segments: [
                {
                  type: "text",
                  value:
                    "Online enquiries and DMs sit unanswered when teams are stretched.",
                },
              ],
            },
            {
              text: "No-shows punch revenue gaps with little chance to resell the slot.",
              segments: [
                {
                  type: "text",
                  value:
                    "No-shows punch revenue gaps with little chance to resell the slot.",
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
        text: "The ‘Hospitality 24/7 Guest Concierge’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘Hospitality 24/7 Guest Concierge’",
          sourceSelector: "h2#hospitality-guest-concierge",
        },
        {
          type: "paragraph",
          order: 12,
          text: "An always-on concierge layer that captures enquiries, reduces no-shows, and helps you earn more reviews — without adding headcount.",
          segments: [
            {
              type: "text",
              value:
                "An always-on concierge layer that captures enquiries, reduces no-shows, and helps you earn more reviews — without adding headcount.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "A digital front desk, 24/7",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This concierge layer answers common questions, captures bookings, and sends the confirmations guests need to show up.",
          segments: [
            {
              type: "text",
              value:
                "This concierge layer answers common questions, captures bookings, and sends the confirmations guests need to show up.",
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
              text: "Multichannel answers for opening times, menus, allergens, and directions.",
              segments: [
                {
                  type: "text",
                  value:
                    "Multichannel answers for opening times, menus, allergens, and directions.",
                },
              ],
            },
            {
              text: "Booking capture from website and messaging into your existing systems.",
              segments: [
                {
                  type: "text",
                  value:
                    "Booking capture from website and messaging into your existing systems.",
                },
              ],
            },
            {
              text: "Automatic confirmations and reminders that cut no-shows.",
              segments: [
                {
                  type: "text",
                  value: "Automatic confirmations and reminders that cut no-shows.",
                },
              ],
            },
            {
              text: "Review invites and feedback routing after the visit.",
              segments: [
                {
                  type: "text",
                  value: "Review invites and feedback routing after the visit.",
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
        text: "What missed bookings cost",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "What missed bookings cost",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "No-shows, slow replies and unanswered messages add up fast, even when the venue is busy.",
          segments: [
            {
              type: "text",
              value:
                "No-shows, slow replies and unanswered messages add up fast, even when the venue is busy.",
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
        text: "Fuller books, happier guests, calmer teams",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "Fuller books, happier guests, calmer teams",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Capture more enquiries, reduce no-shows, and keep front-of-house focused on the room — not the phone.",
          segments: [
            {
              type: "text",
              value:
                "Capture more enquiries, reduce no-shows, and keep front-of-house focused on the room — not the phone.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Less firefighting. More covers.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Automation keeps enquiries moving while your team stays focused on guests.",
          segments: [
            {
              type: "text",
              value:
                "Automation keeps enquiries moving while your team stays focused on guests.",
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
              text: "Fewer missed calls and messages turn into lost bookings.",
              segments: [
                {
                  type: "text",
                  value: "Fewer missed calls and messages turn into lost bookings.",
                },
              ],
            },
            {
              text: "Lower no-show rates thanks to consistent reminders.",
              segments: [
                {
                  type: "text",
                  value: "Lower no-show rates thanks to consistent reminders.",
                },
              ],
            },
            {
              text: "Front-of-house staff stay with guests instead of tied to the phone.",
              segments: [
                {
                  type: "text",
                  value:
                    "Front-of-house staff stay with guests instead of tied to the phone.",
                },
              ],
            },
            {
              text: "Managers see enquiry volume and booking patterns more clearly.",
              segments: [
                {
                  type: "text",
                  value:
                    "Managers see enquiry volume and booking patterns more clearly.",
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
        text: "Overlay your existing systems — don’t replace them",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Overlay your existing systems — don’t replace them",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Four steps to get a 24/7 concierge live without disrupting service.",
          segments: [
            {
              type: "text",
              value:
                "Four steps to get a 24/7 concierge live without disrupting service.",
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
          text: "We map how guests currently contact you and where bottlenecks appear.",
          segments: [
            {
              type: "text",
              value:
                "We map how guests currently contact you and where bottlenecks appear.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Design your guest journeys",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Define how enquiries, bookings, reminders and reviews should flow for your specific venue.",
          segments: [
            {
              type: "text",
              value:
                "Define how enquiries, bookings, reminders and reviews should flow for your specific venue.",
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
          text: "Link the concierge into your phone, website and booking tools, then go live in a controlled way.",
          segments: [
            {
              type: "text",
              value:
                "Link the concierge into your phone, website and booking tools, then go live in a controlled way.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Refine and expand",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Adjust flows, add seasonal campaigns and refine messaging based on guest feedback and performance.",
          segments: [
            {
              type: "text",
              value:
                "Adjust flows, add seasonal campaigns and refine messaging based on guest feedback and performance.",
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
        text: "On-brand, guest-friendly, and privacy-aware",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "On-brand, guest-friendly, and privacy-aware",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Automation should protect your guest experience — not compromise it.",
          segments: [
            {
              type: "text",
              value:
                "Automation should protect your guest experience — not compromise it.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Transparent setup and monthly fees",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "Fees are clear, with no long contracts or hidden extras.",
          segments: [
            {
              type: "text",
              value: "Fees are clear, with no long contracts or hidden extras.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Your tone of voice",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "Messages are written in your tone of voice and can be different for casual bars, fine-dining restaurants or family hotels.",
          segments: [
            {
              type: "text",
              value:
                "Messages are written in your tone of voice and can be different for casual bars, fine-dining restaurants or family hotels.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Human handoff built in",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "You keep full control of what the system can and cannot do, with sensitive issues always routed straight to a human.",
          segments: [
            {
              type: "text",
              value:
                "You keep full control of what the system can and cannot do, with sensitive issues always routed straight to a human.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Data handled responsibly",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Data is handled in line with sensible data protection practices and kept within tools you are comfortable using.",
          segments: [
            {
              type: "text",
              value:
                "Data is handled in line with sensible data protection practices and kept within tools you are comfortable using.",
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
        text: "Hospitality Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Hospitality Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "The aim is for interactions to feel like messaging a switched-on member of your team. We use simple, conversational language and keep answers focused on what guests actually need. Whenever a query is unusual or sensitive, the system hands it back to a real staff member to respond.",
          segments: [
            {
              type: "text",
              value:
                "The aim is for interactions to feel like messaging a switched-on member of your team. We use simple, conversational language and keep answers focused on what guests actually need. Whenever a query is unusual or sensitive, the system hands it back to a real staff member to respond.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "No. In most cases, we wrap around the booking tools you already use. The concierge can capture enquiries and either write into your existing system, send structured requests to your team or both. If you ever change platforms, the automation can move with you.",
          segments: [
            {
              type: "text",
              value:
                "No. In most cases, we wrap around the booking tools you already use. The concierge can capture enquiries and either write into your existing system, send structured requests to your team or both. If you ever change platforms, the automation can move with you.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "Yes. We can configure different flows, branding and information for each site while keeping a single view of how many enquiries and bookings are coming in. This is particularly useful for small groups that want consistent standards without losing local character.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We can configure different flows, branding and information for each site while keeping a single view of how many enquiries and bookings are coming in. This is particularly useful for small groups that want consistent standards without losing local character.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "The goal is the opposite. Staff should see fewer repetitive questions and better quality enquiries. You will still choose how and when humans step in, but the system does the heavy lifting on confirmations, reminders and follow-ups.",
          segments: [
            {
              type: "text",
              value:
                "The goal is the opposite. Staff should see fewer repetitive questions and better quality enquiries. You will still choose how and when humans step in, but the system does the heavy lifting on confirmations, reminders and follow-ups.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "You can quickly switch messaging to reflect closures, special menus or events. We can also pre-build seasonal or event-specific flows so that campaigns and set menus are supported without scrambling at the last minute.",
          segments: [
            {
              type: "text",
              value:
                "You can quickly switch messaging to reflect closures, special menus or events. We can also pre-build seasonal or event-specific flows so that campaigns and set menus are supported without scrambling at the last minute.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Yes. We follow sensible data protection practices and only capture information that is genuinely needed for bookings and communication. You decide how long data is retained and which systems it is passed into.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We follow sensible data protection practices and only capture information that is genuinely needed for bookings and communication. You decide how long data is retained and which systems it is passed into.",
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
        text: "Ready to stop losing bookings to busy shifts?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to stop losing bookings to busy shifts?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Unanswered enquiries and late no-shows leave tables and rooms unfilled. The ‘Hospitality 24/7 Guest Concierge’ shows how an always-on concierge layer can plug into your current systems.",
          segments: [
            {
              type: "text",
              value:
                "Unanswered enquiries and late no-shows leave tables and rooms unfilled. The ‘Hospitality 24/7 Guest Concierge’ shows how an always-on concierge layer can plug into your current systems.",
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
          text: "See hospitality pricing",
          segments: [
            {
              type: "text",
              value: "See hospitality pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the booking automation guide",
          segments: [
            {
              type: "text",
              value: "Read the booking automation guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the guest concierge guide",
          segments: [
            {
              type: "text",
              value: "Read the guest concierge guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free hospitality automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free hospitality automation audit",
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
