import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-dentists",
  routeId: "route-services-dentists",
  routePath: "/services/dentists",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/dentists",
    file: "services/dentists.html",
    sha256: "50f1b0eeb8fee0791efb6fc6f241719e8203df4b1fec5a719e90e663b3db6254",
    bytes: 35264,
    textSha256: "f59518008de285442e240dfe627f0f4c7724f382be58b368c2df0897e4742197",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Dentists | Silverstone AI",
    description:
      "Silverstone AI helps UK dental practices automate recall, reduce DNAs, and keep treatment books full with practical AI follow-up.",
    canonical: "https://silverstone-ai.com/services/dentists",
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
        content: "https://silverstone-ai.com/services/dentists",
      },
      {
        property: "og:title",
        content: "AI Automation for Dentists | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK dental practices automate recall, reduce DNAs, and keep treatment books full with practical AI follow-up.",
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
        content: "AI Automation for Dentists | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK dental practices automate recall, reduce DNAs, and keep treatment books full with practical AI follow-up.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/dentists#webpage",\n          "url": "https://silverstone-ai.com/services/dentists",\n          "name": "Dental Automation for UK Practices - Silverstone AI",\n          "description": "Silverstone AI automation for dental practices: improve recall uptake, reduce DNAs, and keep treatment books full with timely follow-up.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/dentists#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/dentists#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/dentists#service",\n          "name": "Dental Automation for UK Practices - Silverstone AI",\n          "serviceType": "Dental Automation for UK Practices",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/dentists",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/dentists#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK dental practices"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-dentists",\n            "description": "Setup fee plus monthly retainer options for dental automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/dentists#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Dentists",\n              "item": "https://silverstone-ai.com/services/dentists"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/dentists#webpage",
            url: "https://silverstone-ai.com/services/dentists",
            name: "Dental Automation for UK Practices - Silverstone AI",
            description:
              "Silverstone AI automation for dental practices: improve recall uptake, reduce DNAs, and keep treatment books full with timely follow-up.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/dentists#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/dentists#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/dentists#service",
            name: "Dental Automation for UK Practices - Silverstone AI",
            serviceType: "Dental Automation for UK Practices",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/dentists",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/dentists#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK dental practices",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-dentists",
              description:
                "Setup fee plus monthly retainer options for dental automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/dentists#breadcrumb",
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
                name: "Dentists",
                item: "https://silverstone-ai.com/services/dentists",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Will this work with our existing dental software?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "In most cases we connect to, or work alongside, your current practice-management system. The goal is to make better use of the data you already hold rather than introduce yet another platform."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How do you handle patient consent and preferences?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We use the consent status and preferences recorded in your system as the starting point. Patients who opt out of certain channels are respected, and you can choose which groups receive which messages."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we separate NHS and private patients?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We can create different recall rules and messaging for different patient groups, so you can respect contractual and clinical differences while still benefiting from automation."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What about clinical responsibility for recall?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Clinical decisions remain with your dental team. Automation helps deliver agreed recall schedules but does not decide who needs what care. We work with clinical leads to ensure messaging supports, rather than replaces, clinical judgement."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will patients feel bombarded?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The system is designed to be measured and respectful. We agree sensible limits on how often patients can be contacted and ensure messages add value rather than noise."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we start small?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. Many practices begin with hygiene recall or a specific patient group, prove the benefit and then expand gradually to wider recall."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will this work with our existing dental software?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases we connect to, or work alongside, your current practice-management system. The goal is to make better use of the data you already hold rather than introduce yet another platform.",
            },
          },
          {
            "@type": "Question",
            name: "How do you handle patient consent and preferences?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We use the consent status and preferences recorded in your system as the starting point. Patients who opt out of certain channels are respected, and you can choose which groups receive which messages.",
            },
          },
          {
            "@type": "Question",
            name: "Can we separate NHS and private patients?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We can create different recall rules and messaging for different patient groups, so you can respect contractual and clinical differences while still benefiting from automation.",
            },
          },
          {
            "@type": "Question",
            name: "What about clinical responsibility for recall?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Clinical decisions remain with your dental team. Automation helps deliver agreed recall schedules but does not decide who needs what care. We work with clinical leads to ensure messaging supports, rather than replaces, clinical judgement.",
            },
          },
          {
            "@type": "Question",
            name: "Will patients feel bombarded?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The system is designed to be measured and respectful. We agree sensible limits on how often patients can be contacted and ensure messages add value rather than noise.",
            },
          },
          {
            "@type": "Question",
            name: "Can we start small?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Many practices begin with hygiene recall or a specific patient group, prove the benefit and then expand gradually to wider recall.",
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
      text: "Dentists: never let recall slip through the cracks.",
    },
    {
      order: 1,
      level: 2,
      text: "DNAs and recall gaps quietly empty chairs.",
    },
    {
      order: 2,
      level: 3,
      text: "Where chair time leaks.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘Recall & Hygiene Booster’",
    },
    {
      order: 4,
      level: 3,
      text: "Structured recall, less chasing",
    },
    {
      order: 5,
      level: 2,
      text: "Consistent recall keeps chairs fuller",
    },
    {
      order: 6,
      level: 2,
      text: "Fuller books, smoother recall",
    },
    {
      order: 7,
      level: 3,
      text: "Keep chairs consistently full",
    },
    {
      order: 8,
      level: 2,
      text: "A clear, compliant rollout",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Define recall rules",
    },
    {
      order: 11,
      level: 4,
      text: "Connect and configure",
    },
    {
      order: 12,
      level: 4,
      text: "Pilot and refine",
    },
    {
      order: 13,
      level: 2,
      text: "Consent-aware, clinically reviewed",
    },
    {
      order: 14,
      level: 4,
      text: "Consent and preferences respected",
    },
    {
      order: 15,
      level: 4,
      text: "Reassuring, plain language",
    },
    {
      order: 16,
      level: 4,
      text: "Practice control over outreach",
    },
    {
      order: 17,
      level: 4,
      text: "Documented set-up",
    },
    {
      order: 18,
      level: 2,
      text: "Dental Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to keep more chairs consistently full?",
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
        text: "Dentists: never let recall slip through the cracks.",
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
          text: "Automation that strengthens recall, reduces DNAs, and keeps hygiene lists healthier without more reception pressure.",
          segments: [
            {
              type: "text",
              value:
                "Automation that strengthens recall, reduces DNAs, and keeps hygiene lists healthier without more reception pressure.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: practices protecting recall, hygiene capacity, follow-up, and front-desk workload.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: practices protecting recall, hygiene capacity, follow-up, and front-desk workload.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free dental automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free dental automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘Recall & Hygiene Booster’",
          segments: [
            {
              type: "text",
              value: "See the ‘Recall & Hygiene Booster’",
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
        text: "DNAs and recall gaps quietly empty chairs.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "DNAs and recall gaps quietly empty chairs.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "When recall is manual and inconsistent, overdue patients drift away and hygiene slots are harder to fill.",
          segments: [
            {
              type: "text",
              value:
                "When recall is manual and inconsistent, overdue patients drift away and hygiene slots are harder to fill.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where chair time leaks.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "Loose recall and inconsistent reminders leave hygiene capacity empty and overdue patients untouched.",
          segments: [
            {
              type: "text",
              value:
                "Loose recall and inconsistent reminders leave hygiene capacity empty and overdue patients untouched.",
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
              text: "Recall lists live in spreadsheets or outdated systems.",
              segments: [
                {
                  type: "text",
                  value: "Recall lists live in spreadsheets or outdated systems.",
                },
              ],
            },
            {
              text: "Reception spends hours filling hygiene gaps by hand.",
              segments: [
                {
                  type: "text",
                  value: "Reception spends hours filling hygiene gaps by hand.",
                },
              ],
            },
            {
              text: "DNAs and cancellations leave chair time unsold.",
              segments: [
                {
                  type: "text",
                  value: "DNAs and cancellations leave chair time unsold.",
                },
              ],
            },
            {
              text: "Teams cannot see who is overdue and worth prioritising.",
              segments: [
                {
                  type: "text",
                  value: "Teams cannot see who is overdue and worth prioritising.",
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
        text: "The ‘Recall & Hygiene Booster’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘Recall & Hygiene Booster’",
          sourceSelector: "h2#recall-hygiene-booster",
        },
        {
          type: "paragraph",
          order: 12,
          text: "A structured recall and hygiene bundle that keeps track of who is due and helps fill gaps with the right patients at the right time.",
          segments: [
            {
              type: "text",
              value:
                "A structured recall and hygiene bundle that keeps track of who is due and helps fill gaps with the right patients at the right time.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Structured recall, less chasing",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This bundle keeps due patients moving, reminds them on time, and helps reception fill gaps with the right people.",
          segments: [
            {
              type: "text",
              value:
                "This bundle keeps due patients moving, reminds them on time, and helps reception fill gaps with the right people.",
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
              text: "Automated recall prompts by due date and contact preference.",
              segments: [
                {
                  type: "text",
                  value: "Automated recall prompts by due date and contact preference.",
                },
              ],
            },
            {
              text: "Confirm-or-reschedule reminders without heavy phone work.",
              segments: [
                {
                  type: "text",
                  value: "Confirm-or-reschedule reminders without heavy phone work.",
                },
              ],
            },
            {
              text: "Priority nudges for overdue or high-risk patients.",
              segments: [
                {
                  type: "text",
                  value: "Priority nudges for overdue or high-risk patients.",
                },
              ],
            },
            {
              text: "Reporting on recall engagement, DNAs, and hygiene uptake.",
              segments: [
                {
                  type: "text",
                  value: "Reporting on recall engagement, DNAs, and hygiene uptake.",
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
        text: "Consistent recall keeps chairs fuller",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Consistent recall keeps chairs fuller",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Small gains in recall and attendance add up quickly across a multi-chair practice.",
          segments: [
            {
              type: "text",
              value:
                "Small gains in recall and attendance add up quickly across a multi-chair practice.",
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
        text: "Fuller books, smoother recall",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "Fuller books, smoother recall",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Reduce empty chair time and keep more patients on preventive recall with clear communication.",
          segments: [
            {
              type: "text",
              value:
                "Reduce empty chair time and keep more patients on preventive recall with clear communication.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Keep chairs consistently full",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Measured reminders and rebooking flows reduce DNAs without overloading reception.",
          segments: [
            {
              type: "text",
              value:
                "Measured reminders and rebooking flows reduce DNAs without overloading reception.",
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
              text: "Fewer empty chair slots from DNAs and late cancellations.",
              segments: [
                {
                  type: "text",
                  value: "Fewer empty chair slots from DNAs and late cancellations.",
                },
              ],
            },
            {
              text: "More patients kept on regular recall cycles.",
              segments: [
                {
                  type: "text",
                  value: "More patients kept on regular recall cycles.",
                },
              ],
            },
            {
              text: "Hygienists run fuller, better-planned books.",
              segments: [
                {
                  type: "text",
                  value: "Hygienists run fuller, better-planned books.",
                },
              ],
            },
            {
              text: "Reception gains clearer visibility on overdue patients.",
              segments: [
                {
                  type: "text",
                  value: "Reception gains clearer visibility on overdue patients.",
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
        text: "A clear, compliant rollout",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "A clear, compliant rollout",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Align recall rules with your policies, then pilot before scaling.",
          segments: [
            {
              type: "text",
              value:
                "Align recall rules with your policies, then pilot before scaling.",
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
          text: "Review your current recall process, systems and policies.",
          segments: [
            {
              type: "text",
              value: "Review your current recall process, systems and policies.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Define recall rules",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Agree how often different patient groups should be contacted and through which channels.",
          segments: [
            {
              type: "text",
              value:
                "Agree how often different patient groups should be contacted and through which channels.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 29,
          level: 4,
          text: "Connect and configure",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 30,
          text: "Link automation into your existing practice-management software where possible and configure message templates.",
          segments: [
            {
              type: "text",
              value:
                "Link automation into your existing practice-management software where possible and configure message templates.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Pilot and refine",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Start with a subset of patients or services, then refine language and rules before wider rollout.",
          segments: [
            {
              type: "text",
              value:
                "Start with a subset of patients or services, then refine language and rules before wider rollout.",
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
        text: "Consent-aware, clinically reviewed",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "Consent-aware, clinically reviewed",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Measured messaging that respects preferences, oversight and compliance.",
          segments: [
            {
              type: "text",
              value:
                "Measured messaging that respects preferences, oversight and compliance.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Consent and preferences respected",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "We work within your existing consent processes and respect patients’ communication preferences.",
          segments: [
            {
              type: "text",
              value:
                "We work within your existing consent processes and respect patients’ communication preferences.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Reassuring, plain language",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "Messages are written in plain, reassuring language and reviewed with clinical leads.",
          segments: [
            {
              type: "text",
              value:
                "Messages are written in plain, reassuring language and reviewed with clinical leads.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Practice control over outreach",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "Practices retain control over which patients are contacted, how often and through which channels.",
          segments: [
            {
              type: "text",
              value:
                "Practices retain control over which patients are contacted, how often and through which channels.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Documented set-up",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Set-up is documented so you can evidence how recall and reminders are being managed.",
          segments: [
            {
              type: "text",
              value:
                "Set-up is documented so you can evidence how recall and reminders are being managed.",
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
        text: "Dental Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Dental Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "In most cases we connect to, or work alongside, your current practice-management system. The goal is to make better use of the data you already hold rather than introduce yet another platform.",
          segments: [
            {
              type: "text",
              value:
                "In most cases we connect to, or work alongside, your current practice-management system. The goal is to make better use of the data you already hold rather than introduce yet another platform.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "We use the consent status and preferences recorded in your system as the starting point. Patients who opt out of certain channels are respected, and you can choose which groups receive which messages.",
          segments: [
            {
              type: "text",
              value:
                "We use the consent status and preferences recorded in your system as the starting point. Patients who opt out of certain channels are respected, and you can choose which groups receive which messages.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "Yes. We can create different recall rules and messaging for different patient groups, so you can respect contractual and clinical differences while still benefiting from automation.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We can create different recall rules and messaging for different patient groups, so you can respect contractual and clinical differences while still benefiting from automation.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "Clinical decisions remain with your dental team. Automation helps deliver agreed recall schedules but does not decide who needs what care. We work with clinical leads to ensure messaging supports, rather than replaces, clinical judgement.",
          segments: [
            {
              type: "text",
              value:
                "Clinical decisions remain with your dental team. Automation helps deliver agreed recall schedules but does not decide who needs what care. We work with clinical leads to ensure messaging supports, rather than replaces, clinical judgement.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "The system is designed to be measured and respectful. We agree sensible limits on how often patients can be contacted and ensure messages add value rather than noise.",
          segments: [
            {
              type: "text",
              value:
                "The system is designed to be measured and respectful. We agree sensible limits on how often patients can be contacted and ensure messages add value rather than noise.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Yes. Many practices begin with hygiene recall or a specific patient group, prove the benefit and then expand gradually to wider recall.",
          segments: [
            {
              type: "text",
              value:
                "Yes. Many practices begin with hygiene recall or a specific patient group, prove the benefit and then expand gradually to wider recall.",
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
        text: "Ready to keep more chairs consistently full?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to keep more chairs consistently full?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Recall gaps, hygiene DNAs, and overdue patients quietly drain chair time. The ‘Recall & Hygiene Booster’ shows how to fix that with the systems you already use.",
          segments: [
            {
              type: "text",
              value:
                "Recall gaps, hygiene DNAs, and overdue patients quietly drain chair time. The ‘Recall & Hygiene Booster’ shows how to fix that with the systems you already use.",
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
          text: "See dental pricing",
          segments: [
            {
              type: "text",
              value: "See dental pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the missed-call recovery guide",
          segments: [
            {
              type: "text",
              value: "Read the missed-call recovery guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the dental recall guide",
          segments: [
            {
              type: "text",
              value: "Read the dental recall guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free dental automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free dental automation audit",
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
