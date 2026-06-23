import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-estate-agents",
  routeId: "route-services-estate-agents",
  routePath: "/services/estate-agents",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/estate-agents",
    file: "services/estate-agents.html",
    sha256: "095cdbaa97f5aefb87742db0af4fdbbb8a713e58aed78a3185caa2755053398b",
    bytes: 35316,
    textSha256: "7104e9a4c454d40dba9c07d4996a28120af25ac975dd786ab0e146d499806b7a",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Estate Agents | Silverstone AI",
    description:
      "Silverstone AI helps UK estate agents automate lead capture, viewing follow-up, and landlord workflows so instructions move faster.",
    canonical: "https://silverstone-ai.com/services/estate-agents",
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
        content: "https://silverstone-ai.com/services/estate-agents",
      },
      {
        property: "og:title",
        content: "AI Automation for Estate Agents | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK estate agents automate lead capture, viewing follow-up, and landlord workflows so instructions move faster.",
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
        content: "AI Automation for Estate Agents | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK estate agents automate lead capture, viewing follow-up, and landlord workflows so instructions move faster.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/estate-agents#webpage",\n          "url": "https://silverstone-ai.com/services/estate-agents",\n          "name": "Estate Agent Automation for UK Teams - Silverstone AI",\n          "description": "Silverstone AI automation for UK estate agents: instant portal lead response, viewing confirmations, and reliable follow-up to win more instructions.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/estate-agents#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/estate-agents#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/estate-agents#service",\n          "name": "Estate Agent Automation for UK Teams - Silverstone AI",\n          "serviceType": "AI Automation for UK Estate Agents",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/estate-agents",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/estate-agents#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK estate agents and lettings branches"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-real-estate",\n            "description": "Setup fee plus monthly retainer options for estate-agent automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/estate-agents#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Estate Agents",\n              "item": "https://silverstone-ai.com/services/estate-agents"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/estate-agents#webpage",
            url: "https://silverstone-ai.com/services/estate-agents",
            name: "Estate Agent Automation for UK Teams - Silverstone AI",
            description:
              "Silverstone AI automation for UK estate agents: instant portal lead response, viewing confirmations, and reliable follow-up to win more instructions.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/services/estate-agents#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/estate-agents#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/estate-agents#service",
            name: "Estate Agent Automation for UK Teams - Silverstone AI",
            serviceType: "AI Automation for UK Estate Agents",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/estate-agents",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/estate-agents#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK estate agents and lettings branches",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-real-estate",
              description:
                "Setup fee plus monthly retainer options for estate-agent automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/services/estate-agents#breadcrumb",
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
                name: "Estate Agents",
                item: "https://silverstone-ai.com/services/estate-agents",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Will this replace my negotiators?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. The system acts like a highly responsive assistant: it answers first, books viewings and valuations, and gathers feedback so your negotiators spend their time on instructions and offers."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Does it work with our existing CRM and calendars?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We plug into the calendars and inboxes you already use and map fields back into your CRM so nothing is duplicated or lost."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How long does it take to go live?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Most branches are live in 1–2 weeks after the audit: we design the journeys, connect calendars, test handoffs, then switch on with close monitoring."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will it sound robotic or scripted?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "All copy is written in your tone of voice and reviewed by you. We use natural language, add local context and include easy routes for humans to step in."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What happens if something goes wrong or we want to change the journeys?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "You have escalation paths for urgent issues, and we keep everything documented. We can pause, tweak or swap journeys quickly based on your feedback."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Is this suitable for multi-branch agencies?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. Routing rules can split sales and lettings, assign enquiries by branch or postcode and surface branch-level metrics so managers see what\'s working."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will this replace my negotiators?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The system acts like a highly responsive assistant: it answers first, books viewings and valuations, and gathers feedback so your negotiators spend their time on instructions and offers.",
            },
          },
          {
            "@type": "Question",
            name: "Does it work with our existing CRM and calendars?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We plug into the calendars and inboxes you already use and map fields back into your CRM so nothing is duplicated or lost.",
            },
          },
          {
            "@type": "Question",
            name: "How long does it take to go live?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most branches are live in 1–2 weeks after the audit: we design the journeys, connect calendars, test handoffs, then switch on with close monitoring.",
            },
          },
          {
            "@type": "Question",
            name: "Will it sound robotic or scripted?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "All copy is written in your tone of voice and reviewed by you. We use natural language, add local context and include easy routes for humans to step in.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if something goes wrong or we want to change the journeys?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You have escalation paths for urgent issues, and we keep everything documented. We can pause, tweak or swap journeys quickly based on your feedback.",
            },
          },
          {
            "@type": "Question",
            name: "Is this suitable for multi-branch agencies?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Routing rules can split sales and lettings, assign enquiries by branch or postcode and surface branch-level metrics so managers see what's working.",
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
      text: "Estate agents: never miss a viewing or instruction again.",
    },
    {
      order: 1,
      level: 2,
      text: "The cost of a slow response in property is brutal.",
    },
    {
      order: 2,
      level: 3,
      text: "Where instructions slip away.",
    },
    {
      order: 3,
      level: 2,
      text: 'The "Never Miss a Viewing" pack',
    },
    {
      order: 4,
      level: 3,
      text: "Reply first. Book faster.",
    },
    {
      order: 5,
      level: 2,
      text: "Put the numbers in front of the promise",
    },
    {
      order: 6,
      level: 2,
      text: "The branch experience after launch",
    },
    {
      order: 7,
      level: 3,
      text: "Less chasing. More instructions.",
    },
    {
      order: 8,
      level: 2,
      text: "Plug, personalise, launch",
    },
    {
      order: 9,
      level: 4,
      text: "Branch deep-dive",
    },
    {
      order: 10,
      level: 4,
      text: "Connect your stack",
    },
    {
      order: 11,
      level: 4,
      text: "Test & refine",
    },
    {
      order: 12,
      level: 4,
      text: "Launch with guardrails",
    },
    {
      order: 13,
      level: 2,
      text: "Safe, compliant, and fully supported",
    },
    {
      order: 14,
      level: 4,
      text: "Clear setup and monthly fees",
    },
    {
      order: 15,
      level: 4,
      text: "No need to be “technical”",
    },
    {
      order: 16,
      level: 4,
      text: "Tone of voice alignment",
    },
    {
      order: 17,
      level: 4,
      text: "GDPR-aware by design",
    },
    {
      order: 18,
      level: 2,
      text: "Estate Agent Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to stop losing instructions to missed calls?",
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
        text: "Estate agents: never miss a viewing or instruction again.",
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
          text: "Automation for instant portal replies, confirmed viewings, and consistent follow-up without burning out negotiators.",
          segments: [
            {
              type: "text",
              value:
                "Automation for instant portal replies, confirmed viewings, and consistent follow-up without burning out negotiators.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: branches chasing portal leads, viewings, landlord messages, and vendor updates.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: branches chasing portal leads, viewings, landlord messages, and vendor updates.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a Free 30‑Minute Automation Audit",
          segments: [
            {
              type: "text",
              value: "Book a Free 30‑Minute Automation Audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘Never Miss a Viewing’ Pack",
          segments: [
            {
              type: "text",
              value: "See the ‘Never Miss a Viewing’ Pack",
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
        text: "The cost of a slow response in property is brutal.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "The cost of a slow response in property is brutal.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "Missed calls and slow follow-ups mean lost viewings, cold vendors, and instructions drifting to faster rivals.",
          segments: [
            {
              type: "text",
              value:
                "Missed calls and slow follow-ups mean lost viewings, cold vendors, and instructions drifting to faster rivals.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where instructions slip away.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "When viewings, calls, and inboxes stack up, buyers and vendors hear from another agent first.",
          segments: [
            {
              type: "text",
              value:
                "When viewings, calls, and inboxes stack up, buyers and vendors hear from another agent first.",
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
              text: "Portal leads and calls stack up while the team is out on viewings.",
              segments: [
                {
                  type: "text",
                  value:
                    "Portal leads and calls stack up while the team is out on viewings.",
                },
              ],
            },
            {
              text: "Missed calls turn into lost instructions because sellers ring the next agent.",
              segments: [
                {
                  type: "text",
                  value:
                    "Missed calls turn into lost instructions because sellers ring the next agent.",
                },
              ],
            },
            {
              text: "Shared inboxes fill with unread buyer, tenant, and landlord messages.",
              segments: [
                {
                  type: "text",
                  value:
                    "Shared inboxes fill with unread buyer, tenant, and landlord messages.",
                },
              ],
            },
            {
              text: "Warm leads cool off when out-of-hours follow-up waits until tomorrow.",
              segments: [
                {
                  type: "text",
                  value:
                    "Warm leads cool off when out-of-hours follow-up waits until tomorrow.",
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
        text: 'The "Never Miss a Viewing" pack',
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: 'The "Never Miss a Viewing" pack',
          sourceSelector: "h2#never-miss-viewing-pack",
        },
        {
          type: "paragraph",
          order: 12,
          text: "A ready-to-deploy automation bundle tuned for estate and lettings workflows.",
          segments: [
            {
              type: "text",
              value:
                "A ready-to-deploy automation bundle tuned for estate and lettings workflows.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Reply first. Book faster.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "We connect portals, website, phone, and CRM so every enquiry is acknowledged, triaged, and moved into the diary fast.",
          segments: [
            {
              type: "text",
              value:
                "We connect portals, website, phone, and CRM so every enquiry is acknowledged, triaged, and moved into the diary fast.",
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
              text: "24/7 capture of portal, website, and missed-call enquiries.",
              segments: [
                {
                  type: "text",
                  value: "24/7 capture of portal, website, and missed-call enquiries.",
                },
              ],
            },
            {
              text: "Triage that separates casual browsers from serious buyers and sellers.",
              segments: [
                {
                  type: "text",
                  value:
                    "Triage that separates casual browsers from serious buyers and sellers.",
                },
              ],
            },
            {
              text: "Diary integration that offers live viewing and valuation slots.",
              segments: [
                {
                  type: "text",
                  value:
                    "Diary integration that offers live viewing and valuation slots.",
                },
              ],
            },
            {
              text: "Follow-up sequences for confirmations, feedback, and next steps.",
              segments: [
                {
                  type: "text",
                  value:
                    "Follow-up sequences for confirmations, feedback, and next steps.",
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
        text: "Put the numbers in front of the promise",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Put the numbers in front of the promise",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "These metrics show what instant responses and confirmed viewings do for a branch.",
          segments: [
            {
              type: "text",
              value:
                "These metrics show what instant responses and confirmed viewings do for a branch.",
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
        text: "The branch experience after launch",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "The branch experience after launch",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Clients get faster responses; your team gets their evenings back.",
          segments: [
            {
              type: "text",
              value:
                "Clients get faster responses; your team gets their evenings back.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Less chasing. More instructions.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Automation keeps buyers, tenants, landlords, and vendors warm while negotiators stay in revenue work.",
          segments: [
            {
              type: "text",
              value:
                "Automation keeps buyers, tenants, landlords, and vendors warm while negotiators stay in revenue work.",
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
              text: "More valuations and instructions because you reply first.",
              segments: [
                {
                  type: "text",
                  value: "More valuations and instructions because you reply first.",
                },
              ],
            },
            {
              text: "Higher viewing attendance and fewer wasted diary slots.",
              segments: [
                {
                  type: "text",
                  value: "Higher viewing attendance and fewer wasted diary slots.",
                },
              ],
            },
            {
              text: "Negotiators spend more time closing and less time chasing.",
              segments: [
                {
                  type: "text",
                  value: "Negotiators spend more time closing and less time chasing.",
                },
              ],
            },
            {
              text: "Cleaner pipeline visibility with every enquiry logged and tagged.",
              segments: [
                {
                  type: "text",
                  value:
                    "Cleaner pipeline visibility with every enquiry logged and tagged.",
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
        text: "Plug, personalise, launch",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Plug, personalise, launch",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Four steps that get your branch live without slowing the team.",
          segments: [
            {
              type: "text",
              value: "Four steps that get your branch live without slowing the team.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 25,
          level: 4,
          text: "Branch deep-dive",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 26,
          text: "We map your portals, CRM, calendars, and preferred scripts to mirror how you already sell and let.",
          segments: [
            {
              type: "text",
              value:
                "We map your portals, CRM, calendars, and preferred scripts to mirror how you already sell and let.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Connect your stack",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Secure integrations tie enquiries, phone, WhatsApp, and email into one place with full audit trails.",
          segments: [
            {
              type: "text",
              value:
                "Secure integrations tie enquiries, phone, WhatsApp, and email into one place with full audit trails.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 29,
          level: 4,
          text: "Test & refine",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 30,
          text: "We A/B test messaging, routing, and reminders so the automation sounds on-brand and books more viewings.",
          segments: [
            {
              type: "text",
              value:
                "We A/B test messaging, routing, and reminders so the automation sounds on-brand and books more viewings.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Launch with guardrails",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Live dashboards show every contact, SLA, and viewing confirmation so you can prove the ROI fast.",
          segments: [
            {
              type: "text",
              value:
                "Live dashboards show every contact, SLA, and viewing confirmation so you can prove the ROI fast.",
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
        text: "Safe, compliant, and fully supported",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "Safe, compliant, and fully supported",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "We build automation you can trust with your brand, your data, and your clients.",
          segments: [
            {
              type: "text",
              value:
                "We build automation you can trust with your brand, your data, and your clients.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Clear setup and monthly fees",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "No hidden extras. You know the setup effort, the ongoing support and exactly what is included before we start.",
          segments: [
            {
              type: "text",
              value:
                "No hidden extras. You know the setup effort, the ongoing support and exactly what is included before we start.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "No need to be “technical”",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "We configure everything, document handoffs and provide simple dashboards so your team can focus on vendors and buyers.",
          segments: [
            {
              type: "text",
              value:
                "We configure everything, document handoffs and provide simple dashboards so your team can focus on vendors and buyers.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Tone of voice alignment",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "Scripts, emails and SMS copy are approved by you and written in your voice so prospects feel like they are dealing with your branch, not a bot.",
          segments: [
            {
              type: "text",
              value:
                "Scripts, emails and SMS copy are approved by you and written in your voice so prospects feel like they are dealing with your branch, not a bot.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "GDPR-aware by design",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Data capture, storage and routing respect consent and access rules, with clear audit trails and easy human intervention.",
          segments: [
            {
              type: "text",
              value:
                "Data capture, storage and routing respect consent and access rules, with clear audit trails and easy human intervention.",
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
        text: "Estate Agent Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Estate Agent Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "No. The system acts like a highly responsive assistant: it answers first, books viewings and valuations, and gathers feedback so your negotiators spend their time on instructions and offers.",
          segments: [
            {
              type: "text",
              value:
                "No. The system acts like a highly responsive assistant: it answers first, books viewings and valuations, and gathers feedback so your negotiators spend their time on instructions and offers.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "Yes. We plug into the calendars and inboxes you already use and map fields back into your CRM so nothing is duplicated or lost.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We plug into the calendars and inboxes you already use and map fields back into your CRM so nothing is duplicated or lost.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "Most branches are live in 1–2 weeks after the audit: we design the journeys, connect calendars, test handoffs, then switch on with close monitoring.",
          segments: [
            {
              type: "text",
              value:
                "Most branches are live in 1–2 weeks after the audit: we design the journeys, connect calendars, test handoffs, then switch on with close monitoring.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "All copy is written in your tone of voice and reviewed by you. We use natural language, add local context and include easy routes for humans to step in.",
          segments: [
            {
              type: "text",
              value:
                "All copy is written in your tone of voice and reviewed by you. We use natural language, add local context and include easy routes for humans to step in.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "You have escalation paths for urgent issues, and we keep everything documented. We can pause, tweak or swap journeys quickly based on your feedback.",
          segments: [
            {
              type: "text",
              value:
                "You have escalation paths for urgent issues, and we keep everything documented. We can pause, tweak or swap journeys quickly based on your feedback.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Yes. Routing rules can split sales and lettings, assign enquiries by branch or postcode and surface branch-level metrics so managers see what’s working.",
          segments: [
            {
              type: "text",
              value:
                "Yes. Routing rules can split sales and lettings, assign enquiries by branch or postcode and surface branch-level metrics so managers see what’s working.",
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
        text: "Ready to stop losing instructions to missed calls?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to stop losing instructions to missed calls?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Missed calls and slow follow-up cost viewings and instructions. Book a short call to see how the ‘Never Miss a Viewing’ Pack fits your branch and CRM.",
          segments: [
            {
              type: "text",
              value:
                "Missed calls and slow follow-up cost viewings and instructions. Book a short call to see how the ‘Never Miss a Viewing’ Pack fits your branch and CRM.",
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
          text: "See estate agent pricing",
          segments: [
            {
              type: "text",
              value: "See estate agent pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the lead qualification guide",
          segments: [
            {
              type: "text",
              value: "Read the lead qualification guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the viewing feedback guide",
          segments: [
            {
              type: "text",
              value: "Read the viewing feedback guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free estate agency automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free estate agency automation audit",
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
