import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-services-physios-chiropractors",
  routeId: "route-services-physios-chiropractors",
  routePath: "/services/physios-chiropractors",
  kind: "industry",
  source: {
    routeKey: "canonical:/services/physios-chiropractors",
    file: "services/physios-chiropractors.html",
    sha256: "001d65f146d7478f75d9bd75bccabc51464a6cf297a352430063a39d3fdbe3d8",
    bytes: 35600,
    textSha256: "aebf10d44108ba7e8d2f082bc839d004ab7059f8d3d1349a9a7d8900bb776217",
    extractedBlockCount: 57,
  },
  metadata: {
    title: "AI Automation for Physios & Chiropractors | Silverstone AI",
    description:
      "Silverstone AI helps UK physio and chiropractic clinics automate intake, reminders, and rebooking to keep patients on plan.",
    canonical: "https://silverstone-ai.com/services/physios-chiropractors",
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
        content: "https://silverstone-ai.com/services/physios-chiropractors",
      },
      {
        property: "og:title",
        content: "AI Automation for Physios & Chiropractors | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK physio and chiropractic clinics automate intake, reminders, and rebooking to keep patients on plan.",
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
        content: "AI Automation for Physios & Chiropractors | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK physio and chiropractic clinics automate intake, reminders, and rebooking to keep patients on plan.",
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
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "WebPage",\n          "@id": "https://silverstone-ai.com/services/physios-chiropractors#webpage",\n          "url": "https://silverstone-ai.com/services/physios-chiropractors",\n          "name": "Physio and Chiro Automation - Silverstone AI",\n          "description": "Silverstone AI automation for physio and chiropractic clinics: streamline intake, reduce no-shows, and increase rebookings.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/services#webpage"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/services/physios-chiropractors#breadcrumb"\n          },\n          "mainEntity": {\n            "@id": "https://silverstone-ai.com/services/physios-chiropractors#service"\n          }\n        },\n        {\n          "@type": "Service",\n          "@id": "https://silverstone-ai.com/services/physios-chiropractors#service",\n          "name": "Physio and Chiro Automation - Silverstone AI",\n          "serviceType": "AI Automation for Physio & Chiro Clinics",\n          "provider": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "areaServed": "GB",\n          "url": "https://silverstone-ai.com/services/physios-chiropractors",\n          "mainEntityOfPage": {\n            "@id": "https://silverstone-ai.com/services/physios-chiropractors#webpage"\n          },\n          "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n          "audience": {\n            "@type": "Audience",\n            "audienceType": "UK physio and chiropractic clinics"\n          },\n          "offers": {\n            "@type": "Offer",\n            "url": "https://silverstone-ai.com/pricing#pricing-atlas-physios-chiropractors",\n            "description": "Setup fee plus monthly retainer options for clinic automation systems in the pricing atlas."\n          },\n          "potentialAction": {\n            "@type": "ReserveAction",\n            "target": "https://silverstone-ai.com/book"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/services/physios-chiropractors#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Services",\n              "item": "https://silverstone-ai.com/services"\n            },\n            {\n              "@type": "ListItem",\n              "position": 3,\n              "name": "Physios & Chiropractors",\n              "item": "https://silverstone-ai.com/services/physios-chiropractors"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/services/physios-chiropractors#webpage",
            url: "https://silverstone-ai.com/services/physios-chiropractors",
            name: "Physio and Chiro Automation - Silverstone AI",
            description:
              "Silverstone AI automation for physio and chiropractic clinics: streamline intake, reduce no-shows, and increase rebookings.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/services#webpage",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id":
                "https://silverstone-ai.com/services/physios-chiropractors#breadcrumb",
            },
            mainEntity: {
              "@id":
                "https://silverstone-ai.com/services/physios-chiropractors#service",
            },
          },
          {
            "@type": "Service",
            "@id": "https://silverstone-ai.com/services/physios-chiropractors#service",
            name: "Physio and Chiro Automation - Silverstone AI",
            serviceType: "AI Automation for Physio & Chiro Clinics",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            url: "https://silverstone-ai.com/services/physios-chiropractors",
            mainEntityOfPage: {
              "@id":
                "https://silverstone-ai.com/services/physios-chiropractors#webpage",
            },
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            audience: {
              "@type": "Audience",
              audienceType: "UK physio and chiropractic clinics",
            },
            offers: {
              "@type": "Offer",
              url: "https://silverstone-ai.com/pricing#pricing-atlas-physios-chiropractors",
              description:
                "Setup fee plus monthly retainer options for clinic automation systems in the pricing atlas.",
            },
            potentialAction: {
              "@type": "ReserveAction",
              target: "https://silverstone-ai.com/book",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id":
              "https://silverstone-ai.com/services/physios-chiropractors#breadcrumb",
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
                name: "Physios & Chiropractors",
                item: "https://silverstone-ai.com/services/physios-chiropractors",
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
        '{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [\n      {\n        "@type": "Question",\n        "name": "Will this replace our practice-management system?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "No. The hub is designed to sit alongside your existing software, not replace it. Where possible we connect directly so that appointments and records stay in one source of truth."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Is patient data handled safely?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. We work with you to ensure automation respects your existing data-protection processes. Only the information needed for communication and booking is used, and you decide how long it is retained."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "How do we make sure messages feel appropriate for clinical settings?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "We use clear, professional language that supports rather than alarms patients. Clinicians and practice managers review and approve content before it is used."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "What if a patient has complex needs and standard journeys are not appropriate?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Clinicians can choose to adjust or pause automation for individual patients. The system is there to handle typical scenarios, not override clinical judgement."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Does this increase workload for clinicians?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "The aim is to reduce workload by taking repetitive tasks away. Clinicians may spend a small amount of time upfront agreeing wording, but day-to-day the system should free time, not consume it."\n        }\n      },\n      {\n        "@type": "Question",\n        "name": "Can we start with one service line or site first?",\n        "acceptedAnswer": {\n          "@type": "Answer",\n          "text": "Yes. Many clinics prefer to start with one service or location, demonstrate value and then expand gradually."\n        }\n      }\n    ]\n  }',
      parsed: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will this replace our practice-management system?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The hub is designed to sit alongside your existing software, not replace it. Where possible we connect directly so that appointments and records stay in one source of truth.",
            },
          },
          {
            "@type": "Question",
            name: "Is patient data handled safely?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We work with you to ensure automation respects your existing data-protection processes. Only the information needed for communication and booking is used, and you decide how long it is retained.",
            },
          },
          {
            "@type": "Question",
            name: "How do we make sure messages feel appropriate for clinical settings?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We use clear, professional language that supports rather than alarms patients. Clinicians and practice managers review and approve content before it is used.",
            },
          },
          {
            "@type": "Question",
            name: "What if a patient has complex needs and standard journeys are not appropriate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Clinicians can choose to adjust or pause automation for individual patients. The system is there to handle typical scenarios, not override clinical judgement.",
            },
          },
          {
            "@type": "Question",
            name: "Does this increase workload for clinicians?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The aim is to reduce workload by taking repetitive tasks away. Clinicians may spend a small amount of time upfront agreeing wording, but day-to-day the system should free time, not consume it.",
            },
          },
          {
            "@type": "Question",
            name: "Can we start with one service line or site first?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Many clinics prefer to start with one service or location, demonstrate value and then expand gradually.",
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
      text: "Physios & chiropractors: keep diaries full and patients on plan.",
    },
    {
      order: 1,
      level: 2,
      text: "Less chasing. Better attendance.",
    },
    {
      order: 2,
      level: 3,
      text: "Where clinic time leaks.",
    },
    {
      order: 3,
      level: 2,
      text: "The ‘Smart Intake & Rebooking Hub’",
    },
    {
      order: 4,
      level: 3,
      text: "Intake and rebooking in sync",
    },
    {
      order: 5,
      level: 2,
      text: "No-shows reduce capacity and continuity",
    },
    {
      order: 6,
      level: 2,
      text: "Better attendance, clearer plans",
    },
    {
      order: 7,
      level: 3,
      text: "Support outcomes and utilisation",
    },
    {
      order: 8,
      level: 2,
      text: "Clinic-friendly setup in four steps",
    },
    {
      order: 9,
      level: 4,
      text: "Quick automation audit",
    },
    {
      order: 10,
      level: 4,
      text: "Design intake and rebooking journeys",
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
      text: "Supportive messaging, privacy-aware by design",
    },
    {
      order: 14,
      level: 4,
      text: "Aligned with your data-protection settings",
    },
    {
      order: 15,
      level: 4,
      text: "Plain-language, supportive communication",
    },
    {
      order: 16,
      level: 4,
      text: "Clinician control stays central",
    },
    {
      order: 17,
      level: 4,
      text: "Transparent setup and support",
    },
    {
      order: 18,
      level: 2,
      text: "Clinic Automation FAQs",
    },
    {
      order: 19,
      level: 2,
      text: "Ready to reduce DNAs and fill more appointments?",
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
        text: "Physios & chiropractors: keep diaries full and patients on plan.",
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
          text: "A smart intake and rebooking hub that reduces no-shows, tidies paperwork, and keeps patients on plan.",
          segments: [
            {
              type: "text",
              value:
                "A smart intake and rebooking hub that reduces no-shows, tidies paperwork, and keeps patients on plan.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Typical fit: clinics balancing intake, diary gaps, care-plan follow-up, and practitioner admin.",
          segments: [
            {
              type: "text",
              value:
                "Typical fit: clinics balancing intake, diary gaps, care-plan follow-up, and practitioner admin.",
            },
          ],
          sourceSelector: "p.hero-context",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Book a free clinic automation audit",
          segments: [
            {
              type: "text",
              value: "Book a free clinic automation audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
        {
          type: "paragraph",
          order: 5,
          text: "See the ‘Smart Intake & Rebooking Hub’",
          segments: [
            {
              type: "text",
              value: "See the ‘Smart Intake & Rebooking Hub’",
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
        text: "Less chasing. Better attendance.",
      },
      blocks: [
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "Less chasing. Better attendance.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 7,
          text: "Streamlined intake and consistent follow-up keep patients prepared, on plan, and more likely to attend.",
          segments: [
            {
              type: "text",
              value:
                "Streamlined intake and consistent follow-up keep patients prepared, on plan, and more likely to attend.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 8,
          level: 3,
          text: "Where clinic time leaks.",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 9,
          text: "When intake, reminders, and rebooking are inconsistent, diaries open up and patients drift off plan.",
          segments: [
            {
              type: "text",
              value:
                "When intake, reminders, and rebooking are inconsistent, diaries open up and patients drift off plan.",
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
              text: "New patients arrive without forms or the right prep.",
              segments: [
                {
                  type: "text",
                  value: "New patients arrive without forms or the right prep.",
                },
              ],
            },
            {
              text: "No-shows and short-notice cancellations leave hard-to-fill gaps.",
              segments: [
                {
                  type: "text",
                  value:
                    "No-shows and short-notice cancellations leave hard-to-fill gaps.",
                },
              ],
            },
            {
              text: "Clinicians lose time chasing rebookings and basic questions.",
              segments: [
                {
                  type: "text",
                  value: "Clinicians lose time chasing rebookings and basic questions.",
                },
              ],
            },
            {
              text: "Patients drop off plan when next steps are not reinforced clearly.",
              segments: [
                {
                  type: "text",
                  value:
                    "Patients drop off plan when next steps are not reinforced clearly.",
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
        text: "The ‘Smart Intake & Rebooking Hub’",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "The ‘Smart Intake & Rebooking Hub’",
          sourceSelector: "h2#smart-intake-rebooking-hub",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Clinic-ready automations that streamline intake, reduce no-shows and keep patients moving through treatment plans.",
          segments: [
            {
              type: "text",
              value:
                "Clinic-ready automations that streamline intake, reduce no-shows and keep patients moving through treatment plans.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 13,
          level: 3,
          text: "Intake and rebooking in sync",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 14,
          text: "This clinic-ready bundle tightens pre-visit prep, reminders, and follow-up without changing your care model.",
          segments: [
            {
              type: "text",
              value:
                "This clinic-ready bundle tightens pre-visit prep, reminders, and follow-up without changing your care model.",
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
              text: "Digital intake forms that go out as soon as a patient books.",
              segments: [
                {
                  type: "text",
                  value: "Digital intake forms that go out as soon as a patient books.",
                },
              ],
            },
            {
              text: "Triage questions that steer patients to the right clinician or service.",
              segments: [
                {
                  type: "text",
                  value:
                    "Triage questions that steer patients to the right clinician or service.",
                },
              ],
            },
            {
              text: "Reminders with prep guidance and easy reschedule options.",
              segments: [
                {
                  type: "text",
                  value: "Reminders with prep guidance and easy reschedule options.",
                },
              ],
            },
            {
              text: "Rebooking nudges that keep treatment plans moving.",
              segments: [
                {
                  type: "text",
                  value: "Rebooking nudges that keep treatment plans moving.",
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
        text: "No-shows reduce capacity and continuity",
      },
      blocks: [
        {
          type: "heading",
          order: 16,
          level: 2,
          text: "No-shows reduce capacity and continuity",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Small improvements in attendance add up to meaningful capacity over the year.",
          segments: [
            {
              type: "text",
              value:
                "Small improvements in attendance add up to meaningful capacity over the year.",
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
        text: "Better attendance, clearer plans",
      },
      blocks: [
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "Better attendance, clearer plans",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Help patients show up prepared and stay on track, while reducing admin for clinicians and reception.",
          segments: [
            {
              type: "text",
              value:
                "Help patients show up prepared and stay on track, while reducing admin for clinicians and reception.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 20,
          level: 3,
          text: "Support outcomes and utilisation",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Reduce DNAs, improve preparation, and keep treatment plans moving with less admin.",
          segments: [
            {
              type: "text",
              value:
                "Reduce DNAs, improve preparation, and keep treatment plans moving with less admin.",
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
              text: "Fewer no-shows and short-notice cancellations.",
              segments: [
                {
                  type: "text",
                  value: "Fewer no-shows and short-notice cancellations.",
                },
              ],
            },
            {
              text: "Clinicians start with the right information already captured.",
              segments: [
                {
                  type: "text",
                  value:
                    "Clinicians start with the right information already captured.",
                },
              ],
            },
            {
              text: "More patients understand and complete their treatment plan.",
              segments: [
                {
                  type: "text",
                  value: "More patients understand and complete their treatment plan.",
                },
              ],
            },
            {
              text: "Teams get clearer visibility on active, drifting, and lapsed patients.",
              segments: [
                {
                  type: "text",
                  value:
                    "Teams get clearer visibility on active, drifting, and lapsed patients.",
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
        text: "Clinic-friendly setup in four steps",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Clinic-friendly setup in four steps",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Respect clinical workflows, integrate where possible, and iterate based on results.",
          segments: [
            {
              type: "text",
              value:
                "Respect clinical workflows, integrate where possible, and iterate based on results.",
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
          text: "Understand your current booking process, systems and pain points.",
          segments: [
            {
              type: "text",
              value:
                "Understand your current booking process, systems and pain points.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 27,
          level: 4,
          text: "Design intake and rebooking journeys",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 28,
          text: "Agree which forms, reminders and follow-ups should exist for each service type.",
          segments: [
            {
              type: "text",
              value:
                "Agree which forms, reminders and follow-ups should exist for each service type.",
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
          text: "Link automations to your practice-management system or booking tools and test with a small group of patients.",
          segments: [
            {
              type: "text",
              value:
                "Link automations to your practice-management system or booking tools and test with a small group of patients.",
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
          text: "Expand to the wider patient base, then adjust language and timings as you see results.",
          segments: [
            {
              type: "text",
              value:
                "Expand to the wider patient base, then adjust language and timings as you see results.",
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
        text: "Supportive messaging, privacy-aware by design",
      },
      blocks: [
        {
          type: "heading",
          order: 33,
          level: 2,
          text: "Supportive messaging, privacy-aware by design",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Protect patient experience and clinician control while improving attendance.",
          segments: [
            {
              type: "text",
              value:
                "Protect patient experience and clinician control while improving attendance.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 35,
          level: 4,
          text: "Aligned with your data-protection settings",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 36,
          text: "We work within the permissions and data-protection settings that your clinic already follows.",
          segments: [
            {
              type: "text",
              value:
                "We work within the permissions and data-protection settings that your clinic already follows.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 37,
          level: 4,
          text: "Plain-language, supportive communication",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 38,
          text: "Patients receive clear, supportive communication in plain language – never pushy or technical.",
          segments: [
            {
              type: "text",
              value:
                "Patients receive clear, supportive communication in plain language – never pushy or technical.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 39,
          level: 4,
          text: "Clinician control stays central",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 40,
          text: "Clinicians retain control over treatment plans and can override or pause automations for individual cases.",
          segments: [
            {
              type: "text",
              value:
                "Clinicians retain control over treatment plans and can override or pause automations for individual cases.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 41,
          level: 4,
          text: "Transparent setup and support",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 42,
          text: "Transparent setup and support so you know exactly what will change before anything goes live.",
          segments: [
            {
              type: "text",
              value:
                "Transparent setup and support so you know exactly what will change before anything goes live.",
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
        text: "Clinic Automation FAQs",
      },
      blocks: [
        {
          type: "heading",
          order: 43,
          level: 2,
          text: "Clinic Automation FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 44,
          text: "No. The hub is designed to sit alongside your existing software, not replace it. Where possible we connect directly so that appointments and records stay in one source of truth.",
          segments: [
            {
              type: "text",
              value:
                "No. The hub is designed to sit alongside your existing software, not replace it. Where possible we connect directly so that appointments and records stay in one source of truth.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 45,
          text: "Yes. We work with you to ensure automation respects your existing data-protection processes. Only the information needed for communication and booking is used, and you decide how long it is retained.",
          segments: [
            {
              type: "text",
              value:
                "Yes. We work with you to ensure automation respects your existing data-protection processes. Only the information needed for communication and booking is used, and you decide how long it is retained.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 46,
          text: "We use clear, professional language that supports rather than alarms patients. Clinicians and practice managers review and approve content before it is used.",
          segments: [
            {
              type: "text",
              value:
                "We use clear, professional language that supports rather than alarms patients. Clinicians and practice managers review and approve content before it is used.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 47,
          text: "Clinicians can choose to adjust or pause automation for individual patients. The system is there to handle typical scenarios, not override clinical judgement.",
          segments: [
            {
              type: "text",
              value:
                "Clinicians can choose to adjust or pause automation for individual patients. The system is there to handle typical scenarios, not override clinical judgement.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 48,
          text: "The aim is to reduce workload by taking repetitive tasks away. Clinicians may spend a small amount of time upfront agreeing wording, but day-to-day the system should free time, not consume it.",
          segments: [
            {
              type: "text",
              value:
                "The aim is to reduce workload by taking repetitive tasks away. Clinicians may spend a small amount of time upfront agreeing wording, but day-to-day the system should free time, not consume it.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 49,
          text: "Yes. Many clinics prefer to start with one service or location, demonstrate value and then expand gradually.",
          segments: [
            {
              type: "text",
              value:
                "Yes. Many clinics prefer to start with one service or location, demonstrate value and then expand gradually.",
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
        text: "Ready to reduce DNAs and fill more appointments?",
      },
      blocks: [
        {
          type: "heading",
          order: 50,
          level: 2,
          text: "Ready to reduce DNAs and fill more appointments?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 51,
          text: "DNAs, messy intake, and patchy follow-up cost clinics both capacity and outcomes. The ‘Smart Intake & Rebooking Hub’ shows how to fix that around your current systems.",
          segments: [
            {
              type: "text",
              value:
                "DNAs, messy intake, and patchy follow-up cost clinics both capacity and outcomes. The ‘Smart Intake & Rebooking Hub’ shows how to fix that around your current systems.",
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
          text: "See clinic pricing",
          segments: [
            {
              type: "text",
              value: "See clinic pricing",
            },
          ],
          sourceSelector: "a",
        },
        {
          type: "paragraph",
          order: 54,
          text: "Read the clinic automation guide",
          segments: [
            {
              type: "text",
              value: "Read the clinic automation guide",
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
          text: "Book my free clinic automation audit",
          segments: [
            {
              type: "text",
              value: "Book my free clinic automation audit",
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
