import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-gyms-fitness-studios",
  routeId: "route-services-gyms-fitness-studios",
  routePath: "/services/gyms-fitness-studios",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/gyms-fitness-studios",
    file: "services/gyms-fitness-studios.html",
    sha256: "f92ff3fbe43b1ba1aaf21728a1686b2bcafe1ce0605fd0fa231f6a274ace666a",
    bytes: 35209,
    textSha256: "f9a994a1c32b0ddd08eaa2e58ad44ed34e7bbab49ac504ee0cb9a76194a3f8f8",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Gyms & Fitness Studios | Silverstone AI",
    description:
      "Silverstone AI helps UK gyms and studios automate member reactivation, trial follow-up, and booking journeys to improve retention.",
    canonical: "https://silverstone-ai.com/services/gyms-fitness-studios",
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
        content: "https://silverstone-ai.com/services/gyms-fitness-studios",
      },
      {
        property: "og:title",
        content: "AI Automation for Gyms & Fitness Studios | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK gyms and studios automate member reactivation, trial follow-up, and booking journeys to improve retention.",
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
        content: "AI Automation for Gyms & Fitness Studios | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK gyms and studios automate member reactivation, trial follow-up, and booking journeys to improve retention.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#webpage",\n          "url": "https://silverstone-ai.com/services/gyms-fitness-studios",\n          "name": "Gym Automation for UK Studios - Silverstone AI",\n          "description": "Silverstone AI automation for gyms and studios: improve onboarding, reduce churn, and reactivate lapsed members with smarter follow-up.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#service",\n          "name": "Gym Automation for UK Studios - Silverstone AI",\n          "serviceType": "Gym Automation for UK Studios",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/gyms-fitness-studios",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK gym and fitness studio operators"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-gym-owners",\n            "description": "Setup fee plus monthly retainer options for gym and studio automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Gyms & Fitness Studios",\n              "item": "https://silverstone-ai.com/services/gyms-fitness-studios"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#webpage",
            url: "https://silverstone-ai.com/services/gyms-fitness-studios",
            name: "Gym Automation for UK Studios - Silverstone AI",
            description:
              "Silverstone AI automation for gyms and studios: improve onboarding, reduce churn, and reactivate lapsed members with smarter follow-up.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id":
                "https://silverstone-ai.com/services/gyms-fitness-studios#breadcrumb",
            },
            mainEntity: {
              "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#service",
            name: "Gym Automation for UK Studios - Silverstone AI",
            serviceType: "Gym Automation for UK Studios",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/gyms-fitness-studios",
            mainEntityOfPage: {
              "@id": "https://silverstone-ai.com/services/gyms-fitness-studios#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK gym and fitness studio operators",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-gym-owners",
              description:
                "Setup fee plus monthly retainer options for gym and studio automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id":
              "https://silverstone-ai.com/services/gyms-fitness-studios#breadcrumb",
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
                name: "Gyms & Fitness Studios",
                item: "https://silverstone-ai.com/services/gyms-fitness-studios",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Which membership systems can you work with?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We work with common membership and booking platforms used by independent gyms and studios. Where direct integrations are not available, we use exports and simple connections to keep journeys running."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will members feel like they are being spammed?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The focus is on supportive, low-volume communication that feels helpful, not pushy. You decide how often members should receive messages and can adjust anything that does not feel right."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we treat different membership types differently?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. You can define different journeys for contract members, month-to-month members, class-pack holders and other groups. This ensures messages and offers stay relevant."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How do we measure success?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We track retention and engagement metrics such as churn rate, visit frequency and reactivation numbers. These are summarised in simple reports so you can see whether things are improving."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Will this create more work for coaches?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The aim is to reduce manual admin, not increase it. Coaches may be involved in shaping message tone, but day-to-day the system handles the heavy lifting."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we switch off or change journeys easily?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. Journeys can be paused, edited or expanded as your membership model changes. You remain in control of the approach."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Which membership systems can you work with?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We work with common membership and booking platforms used by independent gyms and studios. Where direct integrations are not available, we use exports and simple connections to keep journeys running.",
            },
          },
          {
            "@type": "Question",
            name: "Will members feel like they are being spammed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The focus is on supportive, low-volume communication that feels helpful, not pushy. You decide how often members should receive messages and can adjust anything that does not feel right.",
            },
          },
          {
            "@type": "Question",
            name: "Can we treat different membership types differently?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You can define different journeys for contract members, month-to-month members, class-pack holders and other groups. This ensures messages and offers stay relevant.",
            },
          },
          {
            "@type": "Question",
            name: "How do we measure success?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We track retention and engagement metrics such as churn rate, visit frequency and reactivation numbers. These are summarised in simple reports so you can see whether things are improving.",
            },
          },
          {
            "@type": "Question",
            name: "Will this create more work for coaches?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The aim is to reduce manual admin, not increase it. Coaches may be involved in shaping message tone, but day-to-day the system handles the heavy lifting.",
            },
          },
          {
            "@type": "Question",
            name: "Can we switch off or change journeys easily?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Journeys can be paused, edited or expanded as your membership model changes. You remain in control of the approach.",
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
      text: "Gyms & fitness studios: win back more members without extra ads.",
    },
    {
      order: 1,
      level: 2,
      text: "Churn isn’t a marketing problem — it’s an engagement problem.",
    },
    {
      order: 2,
      level: 3,
      text: "Where retention slips.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘Membership Reactivation Engine’",
    },
    {
      order: 4,
      level: 3,
      text: "Retention triggers that actually run",
    },
    {
      order: 5,
      level: 2,
      text: "Retention beats replacing members",
    },
    {
      order: 6,
      level: 2,
      text: "More engaged members, steadier revenue",
    },
    {
      order: 7,
      level: 3,
      text: "Turn engagement into retention",
    },
    {
      order: 8,
      level: 2,
      text: "Straightforward setup that fits your systems",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Define key journeys",
    },
    {
      order: 11,
      level: 4,
      text: "Connect and launch",
    },
    {
      order: 12,
      level: 4,
      text: "Monitor and refine",
    },
    {
      order: 13,
      level: 2,
      text: "Supportive tone, sensible limits, clear data use",
    },
    {
      order: 14,
      level: 4,
      text: "Genuine, on-brand check-ins",
    },
    {
      order: 15,
      level: 4,
      text: "Clear contact rules",
    },
    {
      order: 16,
      level: 4,
      text: "Uses your existing systems",
    },
    {
      order: 17,
      level: 4,
      text: "Impact in plain numbers",
    },
    {
      order: 18,
      level: 2,
      text: "Gym & Studio Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to keep more members for longer?",
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
        text: "Gyms & fitness studios: win back more members without extra ads.",
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
          text: "A reactivation engine that spots at-risk members, sends thoughtful nudges, and runs win-back campaigns for you.",
          segments: [
            {
              type: "text",
              value:
                "A reactivation engine that spots at-risk members, sends thoughtful nudges, and runs win-back campaigns for you.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: member-led gyms and studios focused on class fill, retention, and win-back.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: member-led gyms and studios focused on class fill, retention, and win-back.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free membership automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free membership automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘Membership Reactivation Engine’",
          segments: [
            {
              type: "text",
              value: "See the ‘Membership Reactivation Engine’",
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
        text: "Churn isn’t a marketing problem — it’s an engagement problem.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Churn isn’t a marketing problem — it’s an engagement problem.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "Most gyms have the data to spot drop-offs early, but not the time to act consistently.",
          segments: [
            {
              type: "text",
              value:
                "Most gyms have the data to spot drop-offs early, but not the time to act consistently.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where retention slips.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "Member data shows who is drifting, but without structured follow-up, churn keeps winning.",
          segments: [
            {
              type: "text",
              value:
                "Member data shows who is drifting, but without structured follow-up, churn keeps winning.",
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
              text: "New members join, then quietly drop off within months.",
              segments: [
                {
                  type: "text",
                  value: "New members join, then quietly drop off within months.",
                },
              ],
            },
            {
              text: "Attendance data exists, but nobody acts on it consistently.",
              segments: [
                {
                  type: "text",
                  value: "Attendance data exists, but nobody acts on it consistently.",
                },
              ],
            },
            {
              text: "Check-ins happen sporadically instead of through a clear journey.",
              segments: [
                {
                  type: "text",
                  value:
                    "Check-ins happen sporadically instead of through a clear journey.",
                },
              ],
            },
            {
              text: "Win-back campaigns rarely launch because ops always comes first.",
              segments: [
                {
                  type: "text",
                  value:
                    "Win-back campaigns rarely launch because ops always comes first.",
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
        text: "The ‘Membership Reactivation Engine’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘Membership Reactivation Engine’",
          sourceSelector: "h2#membership-reactivation-engine",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Spot at-risk members early, run supportive check-ins, and win back lapsed members with consistent journeys.",
          segments: [
            {
              type: "text",
              value:
                "Spot at-risk members early, run supportive check-ins, and win back lapsed members with consistent journeys.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Retention triggers that actually run",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This bundle uses your attendance and membership data to spot risk early and launch supportive journeys automatically.",
          segments: [
            {
              type: "text",
              value:
                "This bundle uses your attendance and membership data to spot risk early and launch supportive journeys automatically.",
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
              text: "Onboarding journeys that drive early visits and habit-building.",
              segments: [
                {
                  type: "text",
                  value:
                    "Onboarding journeys that drive early visits and habit-building.",
                },
              ],
            },
            {
              text: "Attendance triggers that flag members who have gone quiet.",
              segments: [
                {
                  type: "text",
                  value: "Attendance triggers that flag members who have gone quiet.",
                },
              ],
            },
            {
              text: "Supportive check-ins for at-risk members before they cancel.",
              segments: [
                {
                  type: "text",
                  value: "Supportive check-ins for at-risk members before they cancel.",
                },
              ],
            },
            {
              text: "Reporting on churn, engagement, and journey impact.",
              segments: [
                {
                  type: "text",
                  value: "Reporting on churn, engagement, and journey impact.",
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
        text: "Retention beats replacing members",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "Retention beats replacing members",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "A small lift in retention often does more for revenue than the next promotion.",
          segments: [
            {
              type: "text",
              value:
                "A small lift in retention often does more for revenue than the next promotion.",
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
        text: "More engaged members, steadier revenue",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "More engaged members, steadier revenue",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Support habits early, catch drop-offs fast, and win back members without constant manual follow-up.",
          segments: [
            {
              type: "text",
              value:
                "Support habits early, catch drop-offs fast, and win back members without constant manual follow-up.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Turn engagement into retention",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Consistent onboarding, check-ins, and win-back journeys keep more members paying for longer.",
          segments: [
            {
              type: "text",
              value:
                "Consistent onboarding, check-ins, and win-back journeys keep more members paying for longer.",
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
              text: "More members stay longer, lifting lifetime value.",
              segments: [
                {
                  type: "text",
                  value: "More members stay longer, lifting lifetime value.",
                },
              ],
            },
            {
              text: "At-risk members get contacted before they disappear.",
              segments: [
                {
                  type: "text",
                  value: "At-risk members get contacted before they disappear.",
                },
              ],
            },
            {
              text: "Coaches focus on sessions instead of chasing absences.",
              segments: [
                {
                  type: "text",
                  value: "Coaches focus on sessions instead of chasing absences.",
                },
              ],
            },
            {
              text: "Revenue becomes less dependent on constant new sign-ups.",
              segments: [
                {
                  type: "text",
                  value: "Revenue becomes less dependent on constant new sign-ups.",
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
        text: "Straightforward setup that fits your systems",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Straightforward setup that fits your systems",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Define journeys, connect data, launch with a subset, then refine based on retention metrics.",
          segments: [
            {
              type: "text",
              value:
                "Define journeys, connect data, launch with a subset, then refine based on retention metrics.",
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
          text: "Review your membership model, systems and current communication flows.",
          segments: [
            {
              type: "text",
              value:
                "Review your membership model, systems and current communication flows.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Define key journeys",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Agree how you want to onboard, support and win back members.",
          segments: [
            {
              type: "text",
              value: "Agree how you want to onboard, support and win back members.",
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
          text: "Link automation into your membership or booking system and test with a subset of members.",
          segments: [
            {
              type: "text",
              value:
                "Link automation into your membership or booking system and test with a subset of members.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 31,
          level: 4,
          text: "Monitor and refine",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 32,
          text: "Track retention metrics and adjust journeys for tone, timing and impact.",
          segments: [
            {
              type: "text",
              value:
                "Track retention metrics and adjust journeys for tone, timing and impact.",
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
        text: "Supportive tone, sensible limits, clear data use",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "Supportive tone, sensible limits, clear data use",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Retention journeys should feel like genuine check-ins — not spam.",
          segments: [
            {
              type: "text",
              value:
                "Retention journeys should feel like genuine check-ins — not spam.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Genuine, on-brand check-ins",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "Messages are written to feel like genuine check-ins from your team.",
          segments: [
            {
              type: "text",
              value:
                "Messages are written to feel like genuine check-ins from your team.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Clear contact rules",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "You set clear rules on how often members can be contacted and in what circumstances.",
          segments: [
            {
              type: "text",
              value:
                "You set clear rules on how often members can be contacted and in what circumstances.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Uses your existing systems",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "We use your existing systems and data wherever possible rather than introducing new complexity.",
          segments: [
            {
              type: "text",
              value:
                "We use your existing systems and data wherever possible rather than introducing new complexity.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Impact in plain numbers",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "You see the impact in plain numbers so you can judge whether the approach feels right.",
          segments: [
            {
              type: "text",
              value:
                "You see the impact in plain numbers so you can judge whether the approach feels right.",
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
        text: "Gym & Studio Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Gym & Studio Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "We work with common membership and booking platforms used by independent gyms and studios. Where direct integrations are not available, we use exports and simple connections to keep journeys running.",
          segments: [
            {
              type: "text",
              value:
                "We work with common membership and booking platforms used by independent gyms and studios. Where direct integrations are not available, we use exports and simple connections to keep journeys running.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "The focus is on supportive, low-volume communication that feels helpful, not pushy. You decide how often members should receive messages and can adjust anything that does not feel right.",
          segments: [
            {
              type: "text",
              value:
                "The focus is on supportive, low-volume communication that feels helpful, not pushy. You decide how often members should receive messages and can adjust anything that does not feel right.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "Yes. You can define different journeys for contract members, month-to-month members, class-pack holders and other groups. This ensures messages and offers stay relevant.",
          segments: [
            {
              type: "text",
              value:
                "Yes. You can define different journeys for contract members, month-to-month members, class-pack holders and other groups. This ensures messages and offers stay relevant.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "We track retention and engagement metrics such as churn rate, visit frequency and reactivation numbers. These are summarised in simple reports so you can see whether things are improving.",
          segments: [
            {
              type: "text",
              value:
                "We track retention and engagement metrics such as churn rate, visit frequency and reactivation numbers. These are summarised in simple reports so you can see whether things are improving.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "The aim is to reduce manual admin, not increase it. Coaches may be involved in shaping message tone, but day-to-day the system handles the heavy lifting.",
          segments: [
            {
              type: "text",
              value:
                "The aim is to reduce manual admin, not increase it. Coaches may be involved in shaping message tone, but day-to-day the system handles the heavy lifting.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Yes. Journeys can be paused, edited or expanded as your membership model changes. You remain in control of the approach.",
          segments: [
            {
              type: "text",
              value:
                "Yes. Journeys can be paused, edited or expanded as your membership model changes. You remain in control of the approach.",
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
        text: "Ready to keep more members for longer?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to keep more members for longer?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "Churn, drop-off, and reactive follow-up keep revenue flat. The ‘Membership Reactivation Engine’ shows how to support members earlier and smooth revenue with the data you already have.",
          segments: [
            {
              type: "text",
              value:
                "Churn, drop-off, and reactive follow-up keep revenue flat. The ‘Membership Reactivation Engine’ shows how to support members earlier and smooth revenue with the data you already have.",
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
          text: "See gym pricing",
          segments: [
            {
              type: "text",
              value: "See gym pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the gym booking guide",
          segments: [
            {
              type: "text",
              value: "Read the gym booking guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 55,
          text: "Read the win-back guide",
          segments: [
            {
              type: "text",
              value: "Read the win-back guide",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Book my free membership automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free membership automation audit",
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
