import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-salons-barbers",
  routeId: "route-services-salons-barbers",
  routePath: "/services/salons-barbers",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/salons-barbers",
    file: "services/salons-barbers.html",
    sha256: "1a37487bff97fe7a562d91f454fc0792c624d5cc29cb0662690d3ca37bd3043f",
    bytes: 35484,
    textSha256: "dbcfc7cb27d237ae2b7b1a563cbeeab58a4ce7d8b7705783399c75ba1947ef97",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Salons & Barbers | Silverstone AI",
    description:
      "Silverstone AI helps UK salons and barbers automate rebooking, reminders, and review follow-up to keep chairs fuller.",
    canonical: "https://silverstone-ai.com/services/salons-barbers",
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
        content: "https://silverstone-ai.com/services/salons-barbers",
      },
      {
        property: "og:title",
        content: "AI Automation for Salons & Barbers | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK salons and barbers automate rebooking, reminders, and review follow-up to keep chairs fuller.",
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
        content: "AI Automation for Salons & Barbers | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK salons and barbers automate rebooking, reminders, and review follow-up to keep chairs fuller.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/salons-barbers#webpage",\n          "url": "https://silverstone-ai.com/services/salons-barbers",\n          "name": "Salon and Barber Automation - Silverstone AI",\n          "description": "Silverstone AI automation for salons and barbers: cut no-shows, refill cancelled slots quickly, and improve repeat booking rates.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/salons-barbers#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/salons-barbers#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/salons-barbers#service",\n          "name": "Salon and Barber Automation - Silverstone AI",\n          "serviceType": "Salon Automation for Barbers and Salons",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/salons-barbers",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/salons-barbers#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK salons, barbers, and beauty teams"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-salons",\n            "description": "Setup fee plus monthly retainer options for salon and barber automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/salons-barbers#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Salons & Barbers",\n              "item": "https://silverstone-ai.com/services/salons-barbers"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/salons-barbers#webpage",
            url: "https://silverstone-ai.com/services/salons-barbers",
            name: "Salon and Barber Automation - Silverstone AI",
            description:
              "Silverstone AI automation for salons and barbers: cut no-shows, refill cancelled slots quickly, and improve repeat booking rates.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/salons-barbers#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/salons-barbers#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/salons-barbers#service",
            name: "Salon and Barber Automation - Silverstone AI",
            serviceType: "Salon Automation for Barbers and Salons",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/salons-barbers",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/salons-barbers#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK salons, barbers, and beauty teams",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-salons",
              description:
                "Setup fee plus monthly retainer options for salon and barber automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/salons-barbers#breadcrumb",
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
                name: "Salons & Barbers",
                item: "https://silverstone-ai.com/services/salons-barbers",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Will clients be annoyed by automated messages?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Clients are generally grateful for clear reminders and easy ways to change appointments. We work with you to set sensible limits on how often messages go out and what they say. If you receive feedback that something feels too much, we adjust it."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Does this work with our current booking system?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "In most cases, yes. We aim to connect to the system you already use so that bookings and changes stay in one place. If direct integration is not possible, we design simple handovers that still keep your diary accurate."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Do we have to take deposits for this to work?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. The suite works with or without deposits. That said, we can help you introduce deposits or stricter cancellation rules if you decide they are appropriate for your clientele."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How long does setup take?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "For a typical independent salon, the core flows can usually be live within a few weeks. We start with reminders and simple rebooking journeys, then expand once you are comfortable with how everything feels."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we send different messages for different stylists or services?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. You can decide to treat high-value services or specific stylists differently. For example, colour appointments might have earlier reminders or firmer cancellation language than a quick trim."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What if a client replies with a complex request?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Whenever a client message falls outside the usual patterns, the system flags it for a human to handle. We design these handovers so that nothing important gets missed."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will clients be annoyed by automated messages?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Clients are generally grateful for clear reminders and easy ways to change appointments. We work with you to set sensible limits on how often messages go out and what they say. If you receive feedback that something feels too much, we adjust it.",
            },
          },
          {
            "@type": "Question",
            name: "Does this work with our current booking system?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases, yes. We aim to connect to the system you already use so that bookings and changes stay in one place. If direct integration is not possible, we design simple handovers that still keep your diary accurate.",
            },
          },
          {
            "@type": "Question",
            name: "Do we have to take deposits for this to work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The suite works with or without deposits. That said, we can help you introduce deposits or stricter cancellation rules if you decide they are appropriate for your clientele.",
            },
          },
          {
            "@type": "Question",
            name: "How long does setup take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For a typical independent salon, the core flows can usually be live within a few weeks. We start with reminders and simple rebooking journeys, then expand once you are comfortable with how everything feels.",
            },
          },
          {
            "@type": "Question",
            name: "Can we send different messages for different stylists or services?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You can decide to treat high-value services or specific stylists differently. For example, colour appointments might have earlier reminders or firmer cancellation language than a quick trim.",
            },
          },
          {
            "@type": "Question",
            name: "What if a client replies with a complex request?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Whenever a client message falls outside the usual patterns, the system flags it for a human to handle. We design these handovers so that nothing important gets missed.",
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
      text: "Salons & barbers: fill more chairs automatically.",
    },
    {
      order: 1,
      level: 2,
      text: "Empty chairs are expensive.",
    },
    {
      order: 2,
      level: 3,
      text: "Where diary revenue leaks.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘Chair-Filler Automation Suite’",
    },
    {
      order: 4,
      level: 3,
      text: "Keep columns full quietly",
    },
    {
      order: 5,
      level: 2,
      text: "Small no-show rates still hit revenue",
    },
    {
      order: 6,
      level: 2,
      text: "Fuller columns, calmer days",
    },
    {
      order: 7,
      level: 3,
      text: "Less admin. Fuller days.",
    },
    {
      order: 8,
      level: 2,
      text: "Simple steps from audit to launch",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Map your ideal journeys",
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
      text: "On-brand, client-friendly, and in your control",
    },
    {
      order: 14,
      level: 4,
      text: "You control frequency and channels",
    },
    {
      order: 15,
      level: 4,
      text: "Your salon’s tone of voice",
    },
    {
      order: 16,
      level: 4,
      text: "Works with your booking tools",
    },
    {
      order: 17,
      level: 4,
      text: "Clear pricing upfront",
    },
    {
      order: 18,
      level: 2,
      text: "Salon Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to stop losing time and money to empty chairs?",
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
        text: "Salons & barbers: fill more chairs automatically.",
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
          text: "Smart reminders, rebooking journeys, and a virtual receptionist keep your columns full when phones go unanswered.",
          segments: [
            {
              type: "text",
              value:
                "Smart reminders, rebooking journeys, and a virtual receptionist keep your columns full when phones go unanswered.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: chair-based businesses cutting no-shows, filling gaps, and rebooking before clients drift.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: chair-based businesses cutting no-shows, filling gaps, and rebooking before clients drift.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free salon automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free salon automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘Chair-Filler Automation Suite’",
          segments: [
            {
              type: "text",
              value: "See the ‘Chair-Filler Automation Suite’",
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
        text: "Empty chairs are expensive.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Empty chairs are expensive.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "No-shows, missed calls, and out-of-hours DMs quietly create gaps in the diary — even when demand is there.",
          segments: [
            {
              type: "text",
              value:
                "No-shows, missed calls, and out-of-hours DMs quietly create gaps in the diary — even when demand is there.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where diary revenue leaks.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "When stylists are with clients, missed calls, late cancellations, and weak rebooking leave money in the chair.",
          segments: [
            {
              type: "text",
              value:
                "When stylists are with clients, missed calls, late cancellations, and weak rebooking leave money in the chair.",
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
              text: "No-shows and late cancellations leave paid time unused.",
              segments: [
                {
                  type: "text",
                  value: "No-shows and late cancellations leave paid time unused.",
                },
              ],
            },
            {
              text: "Calls ring while the team is busy with clients in the chair.",
              segments: [
                {
                  type: "text",
                  value: "Calls ring while the team is busy with clients in the chair.",
                },
              ],
            },
            {
              text: "Breaks and evenings disappear into reminders and reschedules.",
              segments: [
                {
                  type: "text",
                  value:
                    "Breaks and evenings disappear into reminders and reschedules.",
                },
              ],
            },
            {
              text: "Rebooking and upsell prompts happen inconsistently.",
              segments: [
                {
                  type: "text",
                  value: "Rebooking and upsell prompts happen inconsistently.",
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
        text: "The ‘Chair-Filler Automation Suite’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘Chair-Filler Automation Suite’",
          sourceSelector: "h2#chair-filler-suite",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Reduce no-shows, refill cancellations, and nudge rebookings — without adding more admin.",
          segments: [
            {
              type: "text",
              value:
                "Reduce no-shows, refill cancellations, and nudge rebookings — without adding more admin.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Keep columns full quietly",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This bundle reduces no-shows, refills cancellations, and nudges repeat visits without adding front-desk load.",
          segments: [
            {
              type: "text",
              value:
                "This bundle reduces no-shows, refills cancellations, and nudges repeat visits without adding front-desk load.",
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
              text: "Automated reminders with easy reschedule links.",
              segments: [
                {
                  type: "text",
                  value: "Automated reminders with easy reschedule links.",
                },
              ],
            },
            {
              text: "Cancellation flows that offer freed-up slots to waiting clients.",
              segments: [
                {
                  type: "text",
                  value:
                    "Cancellation flows that offer freed-up slots to waiting clients.",
                },
              ],
            },
            {
              text: "Quick answers for common questions on prices, hours, and locations.",
              segments: [
                {
                  type: "text",
                  value:
                    "Quick answers for common questions on prices, hours, and locations.",
                },
              ],
            },
            {
              text: "Rebooking and lapsed-client nudges that bring people back.",
              segments: [
                {
                  type: "text",
                  value: "Rebooking and lapsed-client nudges that bring people back.",
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
        text: "Small no-show rates still hit revenue",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Small no-show rates still hit revenue",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "One missed appointment is lost revenue, and hard to refill at short notice.",
          segments: [
            {
              type: "text",
              value:
                "One missed appointment is lost revenue, and hard to refill at short notice.",
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
        text: "Fuller columns, calmer days",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "Fuller columns, calmer days",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Fewer no-shows, more rebookings, and less chasing — without changing how you work on the floor.",
          segments: [
            {
              type: "text",
              value:
                "Fewer no-shows, more rebookings, and less chasing — without changing how you work on the floor.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Less admin. Fuller days.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Consistent confirmations, reminders, and rebooking prompts keep more appointments happening on time.",
          segments: [
            {
              type: "text",
              value:
                "Consistent confirmations, reminders, and rebooking prompts keep more appointments happening on time.",
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
              text: "Fewer no-shows and more of the day filled with paying clients.",
              segments: [
                {
                  type: "text",
                  value:
                    "Fewer no-shows and more of the day filled with paying clients.",
                },
              ],
            },
            {
              text: "Less manual chasing and rescheduling for owners and reception.",
              segments: [
                {
                  type: "text",
                  value:
                    "Less manual chasing and rescheduling for owners and reception.",
                },
              ],
            },
            {
              text: "Higher rebooking rates and steadier monthly revenue.",
              segments: [
                {
                  type: "text",
                  value: "Higher rebooking rates and steadier monthly revenue.",
                },
              ],
            },
            {
              text: "Owners can step away from the desk without missing demand.",
              segments: [
                {
                  type: "text",
                  value: "Owners can step away from the desk without missing demand.",
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
        text: "Simple steps from audit to launch",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Simple steps from audit to launch",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Get the core flows live, then refine with real feedback.",
          segments: [
            {
              type: "text",
              value: "Get the core flows live, then refine with real feedback.",
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
          text: "Review how you currently take bookings, send reminders and manage cancellations.",
          segments: [
            {
              type: "text",
              value:
                "Review how you currently take bookings, send reminders and manage cancellations.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Map your ideal journeys",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Decide when clients should receive messages, what they should say and how they should respond.",
          segments: [
            {
              type: "text",
              value:
                "Decide when clients should receive messages, what they should say and how they should respond.",
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
          text: "Link the automations to your booking system and messaging channels, then test with a small group.",
          segments: [
            {
              type: "text",
              value:
                "Link the automations to your booking system and messaging channels, then test with a small group.",
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
          text: "Expand to all clients, then tune messages and timings based on feedback and results.",
          segments: [
            {
              type: "text",
              value:
                "Expand to all clients, then tune messages and timings based on feedback and results.",
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
        text: "On-brand, client-friendly, and in your control",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "On-brand, client-friendly, and in your control",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Keep communication helpful — without spamming clients or changing your booking tool.",
          segments: [
            {
              type: "text",
              value:
                "Keep communication helpful — without spamming clients or changing your booking tool.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "You control frequency and channels",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "You choose how often clients hear from you and through which channels.",
          segments: [
            {
              type: "text",
              value:
                "You choose how often clients hear from you and through which channels.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Your salon’s tone of voice",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "Messages are written in your salon’s tone of voice and can be adjusted at any time.",
          segments: [
            {
              type: "text",
              value:
                "Messages are written in your salon’s tone of voice and can be adjusted at any time.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Works with your booking tools",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "We work with the booking tools you already use wherever possible.",
          segments: [
            {
              type: "text",
              value:
                "We work with the booking tools you already use wherever possible.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Clear pricing upfront",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "You see a clear list of what is included and what it costs before anything goes live.",
          segments: [
            {
              type: "text",
              value:
                "You see a clear list of what is included and what it costs before anything goes live.",
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
        text: "Salon Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Salon Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "Clients are generally grateful for clear reminders and easy ways to change appointments. We work with you to set sensible limits on how often messages go out and what they say. If you receive feedback that something feels too much, we adjust it.",
          segments: [
            {
              type: "text",
              value:
                "Clients are generally grateful for clear reminders and easy ways to change appointments. We work with you to set sensible limits on how often messages go out and what they say. If you receive feedback that something feels too much, we adjust it.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "In most cases, yes. We aim to connect to the system you already use so that bookings and changes stay in one place. If direct integration is not possible, we design simple handovers that still keep your diary accurate.",
          segments: [
            {
              type: "text",
              value:
                "In most cases, yes. We aim to connect to the system you already use so that bookings and changes stay in one place. If direct integration is not possible, we design simple handovers that still keep your diary accurate.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "No. The suite works with or without deposits. That said, we can help you introduce deposits or stricter cancellation rules if you decide they are appropriate for your clientele.",
          segments: [
            {
              type: "text",
              value:
                "No. The suite works with or without deposits. That said, we can help you introduce deposits or stricter cancellation rules if you decide they are appropriate for your clientele.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "For a typical independent salon, the core flows can usually be live within a few weeks. We start with reminders and simple rebooking journeys, then expand once you are comfortable with how everything feels.",
          segments: [
            {
              type: "text",
              value:
                "For a typical independent salon, the core flows can usually be live within a few weeks. We start with reminders and simple rebooking journeys, then expand once you are comfortable with how everything feels.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "Yes. You can decide to treat high-value services or specific stylists differently. For example, colour appointments might have earlier reminders or firmer cancellation language than a quick trim.",
          segments: [
            {
              type: "text",
              value:
                "Yes. You can decide to treat high-value services or specific stylists differently. For example, colour appointments might have earlier reminders or firmer cancellation language than a quick trim.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Whenever a client message falls outside the usual patterns, the system flags it for a human to handle. We design these handovers so that nothing important gets missed.",
          segments: [
            {
              type: "text",
              value:
                "Whenever a client message falls outside the usual patterns, the system flags it for a human to handle. We design these handovers so that nothing important gets missed.",
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
        text: "Ready to stop losing time and money to empty chairs?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to stop losing time and money to empty chairs?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Late cancellations, no-shows, and manual chasing drain revenue fast. The ‘Chair-Filler Automation Suite’ shows where automation can quietly keep the diary fuller without changing how you work.",
          segments: [
            {
              type: "text",
              value:
                "Late cancellations, no-shows, and manual chasing drain revenue fast. The ‘Chair-Filler Automation Suite’ shows where automation can quietly keep the diary fuller without changing how you work.",
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
          text: "See salon pricing",
          segments: [
            {
              type: "text",
              value: "See salon pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the no-show reduction guide",
          segments: [
            {
              type: "text",
              value: "Read the no-show reduction guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the rebooking guide",
          segments: [
            {
              type: "text",
              value: "Read the rebooking guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free salon automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free salon automation audit",
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
