import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-home",
  routeId: "route-home",
  routePath: "/",
  kind: "core",
  source: {
    routeKey: "canonical:/",
    file: "index.html",
    sha256: "b59036cd0c4ae0cc839df9b55f14f2d6c60640af614661f5aac0782b5a3fdbc4",
    bytes: 44886,
    textSha256: "cf957cdf00be41902e230372b2a604d85891d08d49b23f3ef4249e2aaa3ac0ef",
    extractedBlockCount: 69,
  },
  metadata: {
    title: "Silverstone AI - AI Automation for UK Small Businesses",
    description:
      "Silverstone AI helps UK small businesses automate calls, lead follow-up, bookings, and back-office workflows with practical AI systems.",
    canonical: "https://silverstone-ai.com",
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
        content: "https://silverstone-ai.com",
      },
      {
        property: "og:title",
        content: "Silverstone AI - AI Automation for UK Small Businesses",
      },
      {
        property: "og:description",
        content:
          "Silverstone AI helps UK small businesses automate calls, lead follow-up, bookings, and back-office workflows with practical AI systems.",
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
        content: "Silverstone AI - AI Automation for UK Small Businesses",
      },
      {
        name: "twitter:description",
        content:
          "Silverstone AI helps UK small businesses automate calls, lead follow-up, bookings, and back-office workflows with practical AI systems.",
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
        "WebSite",
        "Organization",
        "ImageObject",
        "PostalAddress",
        "ProfessionalService",
        "ContactPoint",
        "WebPage",
        "BreadcrumbList",
        "ListItem",
      ],
      rawJson:
        '{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "WebSite",\n      "@id": "https://silverstone-ai.com/#website",\n      "url": "https://silverstone-ai.com",\n      "name": "Silverstone AI",\n      "alternateName": "silverstone-ai.com",\n      "publisher": {\n        "@id": "https://silverstone-ai.com/#organization"\n      }\n    },\n    {\n      "@type": "Organization",\n      "@id": "https://silverstone-ai.com/#organization",\n      "name": "Silverstone AI",\n      "url": "https://silverstone-ai.com",\n      "logo": {\n        "@type": "ImageObject",\n        "url": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png"\n      },\n      "sameAs": [\n        "https://www.instagram.com/silverstone.ai/",\n        "https://www.facebook.com/people/Silverstone-AI/61583930930530/"\n      ],\n      "email": "info@silverstone-ai.com",\n      "telephone": "+447418329232",\n      "areaServed": "GB",\n      "address": {\n        "@type": "PostalAddress",\n        "streetAddress": "4 Deacon Street",\n        "addressLocality": "London",\n        "postalCode": "SE17 1GE",\n        "addressCountry": "UK"\n      }\n    },\n    {\n      "@type": "ProfessionalService",\n      "@id": "https://silverstone-ai.com/#service",\n      "name": "Silverstone AI",\n      "url": "https://silverstone-ai.com",\n      "image": "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",\n      "description": "Silverstone AI helps UK small businesses automate calls, lead follow-up, bookings, and back-office workflows with practical AI systems.",\n      "provider": {\n        "@id": "https://silverstone-ai.com/#organization"\n      },\n      "areaServed": "GB",\n      "contactPoint": {\n        "@type": "ContactPoint",\n        "email": "info@silverstone-ai.com",\n        "contactType": "customer support"\n      }\n    },\n    {\n      "@type": "WebPage",\n      "@id": "https://silverstone-ai.com/#webpage",\n      "url": "https://silverstone-ai.com",\n      "name": "AI Automation for UK Small Businesses - Silverstone AI",\n      "isPartOf": {\n        "@id": "https://silverstone-ai.com/#website"\n      },\n      "about": {\n        "@id": "https://silverstone-ai.com/#organization"\n      },\n      "breadcrumb": {\n        "@id": "https://silverstone-ai.com/#breadcrumb"\n      }\n    },\n    {\n      "@type": "BreadcrumbList",\n      "@id": "https://silverstone-ai.com/#breadcrumb",\n      "itemListElement": [\n        {\n          "@type": "ListItem",\n          "position": 1,\n          "name": "Home",\n          "item": "https://silverstone-ai.com"\n        }\n      ]\n    }\n  ]\n}',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://silverstone-ai.com/#website",
            url: "https://silverstone-ai.com",
            name: "Silverstone AI",
            alternateName: "silverstone-ai.com",
            publisher: {
              "@id": "https://silverstone-ai.com/#organization",
            },
          },
          {
            "@type": "Organization",
            "@id": "https://silverstone-ai.com/#organization",
            name: "Silverstone AI",
            url: "https://silverstone-ai.com",
            logo: {
              "@type": "ImageObject",
              url: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            },
            sameAs: [
              "https://www.instagram.com/silverstone.ai/",
              "https://www.facebook.com/people/Silverstone-AI/61583930930530/",
            ],
            email: "info@silverstone-ai.com",
            telephone: "+447418329232",
            areaServed: "GB",
            address: {
              "@type": "PostalAddress",
              streetAddress: "4 Deacon Street",
              addressLocality: "London",
              postalCode: "SE17 1GE",
              addressCountry: "UK",
            },
          },
          {
            "@type": "ProfessionalService",
            "@id": "https://silverstone-ai.com/#service",
            name: "Silverstone AI",
            url: "https://silverstone-ai.com",
            image: "https://silverstone-ai.com/assets/logo/silverstone-logo-new.png",
            description:
              "Silverstone AI helps UK small businesses automate calls, lead follow-up, bookings, and back-office workflows with practical AI systems.",
            provider: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            areaServed: "GB",
            contactPoint: {
              "@type": "ContactPoint",
              email: "info@silverstone-ai.com",
              contactType: "customer support",
            },
          },
          {
            "@type": "WebPage",
            "@id": "https://silverstone-ai.com/#webpage",
            url: "https://silverstone-ai.com",
            name: "AI Automation for UK Small Businesses - Silverstone AI",
            isPartOf: {
              "@id": "https://silverstone-ai.com/#website",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/#breadcrumb",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/#breadcrumb",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://silverstone-ai.com",
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
      text: "Silverstone AI for UK Small Businesses — Calls, Bookings & Lead Follow-Up Silverstone AI for UK Small Businesses",
    },
    {
      order: 1,
      level: 2,
      text: "Explore the main Silverstone AI pages",
    },
    {
      order: 2,
      level: 2,
      text: "Go straight to the service page that matches your business.",
    },
    {
      order: 3,
      level: 2,
      text: "Streamline. Optimize. Succeed.",
    },
    {
      order: 4,
      level: 3,
      text: "Streamline",
    },
    {
      order: 5,
      level: 3,
      text: "Optimize",
    },
    {
      order: 6,
      level: 3,
      text: "Succeed",
    },
    {
      order: 7,
      level: 2,
      text: "No hype. Just measurable wins.",
    },
    {
      order: 8,
      level: 2,
      text: "What we automate",
    },
    {
      order: 9,
      level: 2,
      text: "What small businesses usually get back",
    },
    {
      order: 10,
      level: 3,
      text: "Hours back each week",
    },
    {
      order: 11,
      level: 3,
      text: "Fewer missed appointments",
    },
    {
      order: 12,
      level: 3,
      text: "Faster lead response",
    },
    {
      order: 13,
      level: 2,
      text: "Compare every automation pack before you book.",
    },
    {
      order: 14,
      level: 2,
      text: "AI Automation Agency FAQs",
    },
    {
      order: 15,
      level: 2,
      text: "Ready to scope your first automation?",
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
        text: "Silverstone AI for UK Small Businesses — Calls, Bookings & Lead Follow-Up Silverstone AI for UK Small Businesses",
      },
      blocks: [
        {
          type: "paragraph",
          order: 0,
          text: "Capture more enquiries, follow up faster, and cut admin with practical AI systems for the tools you already use.",
          segments: [
            {
              type: "text",
              value:
                " Capture more enquiries, follow up faster, and cut admin with practical AI systems for the tools you already use. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 1,
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
          order: 2,
          text: "Explore Services",
          segments: [
            {
              type: "text",
              value: "Explore Services",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
      ],
    },
    {
      order: 1,
      sourceSelector: "section#primary-site-links",
      sourceId: "primary-site-links",
      sourceClasses: [
        "section",
        "bg-circuit",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Explore the main Silverstone AI pages",
      },
      blocks: [
        {
          type: "heading",
          order: 3,
          level: 2,
          text: "Explore the main Silverstone AI pages",
          sourceSelector: "h2.section-title.primary-site-links-card__title",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Start with the page that matches what you need: background, services, pricing, guides, booking, or direct contact.",
          segments: [
            {
              type: "text",
              value:
                " Start with the page that matches what you need: background, services, pricing, guides, booking, or direct contact. ",
            },
          ],
          sourceSelector: "p.section-subtitle.primary-site-links-card__subtitle",
        },
        {
          type: "paragraph",
          order: 5,
          text: "01 About See who Silverstone AI helps and how we work.",
          segments: [
            {
              type: "text",
              value: " 01 About See who Silverstone AI helps and how we work. ",
            },
          ],
          sourceSelector: "a.primary-site-link",
        },
        {
          type: "paragraph",
          order: 6,
          text: "02 Services See the core automation offers, workflow packs, and buying paths.",
          segments: [
            {
              type: "text",
              value:
                " 02 Services See the core automation offers, workflow packs, and buying paths. ",
            },
          ],
          sourceSelector: "a.primary-site-link",
        },
        {
          type: "paragraph",
          order: 7,
          text: "03 Pricing Compare flagship packs, industry bundles, and smaller fixes before you book.",
          segments: [
            {
              type: "text",
              value:
                " 03 Pricing Compare flagship packs, industry bundles, and smaller fixes before you book. ",
            },
          ],
          sourceSelector: "a.primary-site-link",
        },
        {
          type: "paragraph",
          order: 8,
          text: "04 Blog Browse practical articles on use cases, rollout questions, and ROI.",
          segments: [
            {
              type: "text",
              value:
                " 04 Blog Browse practical articles on use cases, rollout questions, and ROI. ",
            },
          ],
          sourceSelector: "a.primary-site-link",
        },
        {
          type: "paragraph",
          order: 9,
          text: "05 Book Book a free automation audit when you want the fastest route to a first win.",
          segments: [
            {
              type: "text",
              value:
                " 05 Book Book a free automation audit when you want the fastest route to a first win. ",
            },
          ],
          sourceSelector: "a.primary-site-link",
        },
        {
          type: "paragraph",
          order: 10,
          text: "06 Contact Start a conversation before you book anything formal.",
          segments: [
            {
              type: "text",
              value:
                " 06 Contact Start a conversation before you book anything formal. ",
            },
          ],
          sourceSelector: "a.primary-site-link",
        },
      ],
    },
    {
      order: 2,
      sourceSelector: "section#industry-service-directory",
      sourceId: "industry-service-directory",
      sourceClasses: [
        "section",
        "bg-circuit",
        "animate",
        "parallax-section",
        "compact-section",
      ],
      heading: {
        level: 2,
        text: "Go straight to the service page that matches your business.",
      },
      blocks: [
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "Go straight to the service page that matches your business.",
          sourceSelector: "h2.section-title.industry-directory-shell__title",
        },
        {
          type: "paragraph",
          order: 12,
          text: "These are the nine industry pages Google should discover directly from the homepage, each with the relevant pack, use cases, and supporting guides.",
          segments: [
            {
              type: "text",
              value:
                "These are the nine industry pages Google should discover directly from the homepage, each with the relevant pack, use cases, and supporting guides.",
            },
          ],
          sourceSelector: "p.section-subtitle.industry-directory-shell__subtitle",
        },
        {
          type: "paragraph",
          order: 13,
          text: "Estate Agent Automation Lead capture, viewings, feedback, and vendor updates.",
          segments: [
            {
              type: "text",
              value:
                "  Estate Agent Automation Lead capture, viewings, feedback, and vendor updates. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 14,
          text: "Hospitality Automation Guest questions, booking follow-up, reminders, and reviews.",
          segments: [
            {
              type: "text",
              value:
                "  Hospitality Automation Guest questions, booking follow-up, reminders, and reviews. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 15,
          text: "Salon & Barber Automation No-show reduction, rebooking, reviews, and gap-filling.",
          segments: [
            {
              type: "text",
              value:
                "  Salon & Barber Automation No-show reduction, rebooking, reviews, and gap-filling. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 16,
          text: "Trades Automation Missed calls, job triage, quote follow-up, and ETAs.",
          segments: [
            {
              type: "text",
              value:
                "  Trades Automation Missed calls, job triage, quote follow-up, and ETAs. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 17,
          text: "eCommerce Automation Cart recovery, support triage, returns, and repeat purchase.",
          segments: [
            {
              type: "text",
              value:
                "  eCommerce Automation Cart recovery, support triage, returns, and repeat purchase. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 18,
          text: "Clinic Automation Intake, reminders, rebooking, and care-plan follow-up.",
          segments: [
            {
              type: "text",
              value:
                "  Clinic Automation Intake, reminders, rebooking, and care-plan follow-up. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Dental Automation Missed-call recovery, recalls, hygiene fill, and follow-up.",
          segments: [
            {
              type: "text",
              value:
                "  Dental Automation Missed-call recovery, recalls, hygiene fill, and follow-up. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 20,
          text: "Gym & Studio Automation Class fill, cancellations, win-back, and member retention.",
          segments: [
            {
              type: "text",
              value:
                "  Gym & Studio Automation Class fill, cancellations, win-back, and member retention. ",
            },
          ],
          sourceSelector: "a.industry-directory-card",
        },
        {
          type: "paragraph",
          order: 21,
          text: "Fitness Coach Automation DMs, lead scoring, onboarding, and nurture.",
          segments: [
            {
              type: "text",
              value:
                "  Fitness Coach Automation DMs, lead scoring, onboarding, and nurture. ",
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
      sourceClasses: ["section", "bg-lines", "animate", "parallax-section"],
      heading: {
        level: 2,
        text: "Streamline. Optimize. Succeed.",
      },
      blocks: [
        {
          type: "heading",
          order: 22,
          level: 2,
          text: "Streamline. Optimize. Succeed.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 23,
          text: "Practical automation that helps UK small businesses save time, respond faster, and grow with less friction.",
          segments: [
            {
              type: "text",
              value:
                "Practical automation that helps UK small businesses save time, respond faster, and grow with less friction.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 24,
          level: 3,
          text: "Streamline",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 25,
          text: "Remove bottlenecks, automate repeat work, and free your team for higher‑value tasks.",
          segments: [
            {
              type: "text",
              value:
                " Remove bottlenecks, automate repeat work, and free your team for higher‑value tasks. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 26,
          level: 3,
          text: "Optimize",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 27,
          text: "Connect data and workflows so decisions get faster, cleaner, and easier to manage.",
          segments: [
            {
              type: "text",
              value:
                " Connect data and workflows so decisions get faster, cleaner, and easier to manage. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 28,
          level: 3,
          text: "Succeed",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 29,
          text: "Build more capacity, more consistency, and more room to grow without adding admin.",
          segments: [
            {
              type: "text",
              value:
                " Build more capacity, more consistency, and more room to grow without adding admin. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 30,
          level: 2,
          text: "No hype. Just measurable wins.",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 31,
          text: "We build practical systems that answer calls, follow up leads, and chase admin in the background so small teams respond faster and waste less time.",
          segments: [
            {
              type: "text",
              value:
                " We build practical systems that answer calls, follow up leads, and chase admin in the background so small teams respond faster and waste less time. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 32,
          level: 2,
          text: "What we automate",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 33,
          text: "Four practical ways we help UK small businesses save time, respond faster, and keep customers moving without replacing the tools they already use.",
          segments: [
            {
              type: "text",
              value:
                " Four practical ways we help UK small businesses save time, respond faster, and keep customers moving without replacing the tools they already use. ",
            },
          ],
          sourceSelector: "p.section-subtitle.subtitle-muted",
        },
        {
          type: "paragraph",
          order: 34,
          text: "Explore consulting",
          segments: [
            {
              type: "text",
              value: "Explore consulting",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
        {
          type: "paragraph",
          order: 35,
          text: "Automate follow-up",
          segments: [
            {
              type: "text",
              value: "Automate follow-up",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
        {
          type: "paragraph",
          order: 36,
          text: "Streamline workflows",
          segments: [
            {
              type: "text",
              value: "Streamline workflows",
            },
          ],
          sourceSelector: "a.btn.btn-secondary.btn-streamline-workflows",
        },
        {
          type: "paragraph",
          order: 37,
          text: "Connect your stack",
          segments: [
            {
              type: "text",
              value: "Connect your stack",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
        {
          type: "heading",
          order: 38,
          level: 2,
          text: "What small businesses usually get back",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 39,
          text: "When the right workflows run automatically, small teams usually win back time, reduce no‑shows, and reply faster.",
          segments: [
            {
              type: "text",
              value:
                " When the right workflows run automatically, small teams usually win back time, reduce no‑shows, and reply faster. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 40,
          level: 3,
          text: "Hours back each week",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 41,
          text: "Less admin. More focus.",
          segments: [
            {
              type: "text",
              value: "Less admin. More focus.",
            },
          ],
          sourceSelector: "p.tagline",
        },
        {
          type: "list",
          order: 42,
          ordered: false,
          items: [
            {
              text: "Many small businesses reclaim 8–15 hours per week once key processes are automated.",
              segments: [
                {
                  type: "text",
                  value:
                    "Many small businesses reclaim 8–15 hours per week once key processes are automated.",
                },
              ],
            },
          ],
          sourceSelector: "ul.proof-list",
        },
        {
          type: "heading",
          order: 43,
          level: 3,
          text: "Fewer missed appointments",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 44,
          text: "Fewer gaps in the diary.",
          segments: [
            {
              type: "text",
              value: "Fewer gaps in the diary.",
            },
          ],
          sourceSelector: "p.tagline",
        },
        {
          type: "list",
          order: 45,
          ordered: false,
          items: [
            {
              text: "Automated reminders commonly cut no‑shows by around a third compared with manual processes.",
              segments: [
                {
                  type: "text",
                  value:
                    "Automated reminders commonly cut no‑shows by around a third compared with manual processes.",
                },
              ],
            },
          ],
          sourceSelector: "ul.proof-list",
        },
        {
          type: "heading",
          order: 46,
          level: 3,
          text: "Faster lead response",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 47,
          text: "First replies without delay.",
          segments: [
            {
              type: "text",
              value: "First replies without delay.",
            },
          ],
          sourceSelector: "p.tagline",
        },
        {
          type: "list",
          order: 48,
          ordered: false,
          items: [
            {
              text: "New enquiries are acknowledged instantly, even outside office hours, so fewer opportunities go cold.",
              segments: [
                {
                  type: "text",
                  value:
                    "New enquiries are acknowledged instantly, even outside office hours, so fewer opportunities go cold.",
                },
              ],
            },
          ],
          sourceSelector: "ul.proof-list",
        },
        {
          type: "heading",
          order: 49,
          level: 2,
          text: "Compare every automation pack before you book.",
          sourceSelector: "h2.section-title.primary-site-links-card__title",
        },
        {
          type: "paragraph",
          order: 50,
          text: "Compare flagship packs, industry bundles, and smaller modules in one place before you book.",
          segments: [
            {
              type: "text",
              value:
                " Compare flagship packs, industry bundles, and smaller modules in one place before you book. ",
            },
          ],
          sourceSelector: "p.section-subtitle.primary-site-links-card__subtitle",
        },
        {
          type: "paragraph",
          order: 51,
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
          order: 52,
          text: "Compare Industry Packs",
          segments: [
            {
              type: "text",
              value: "Compare Industry Packs",
            },
          ],
          sourceSelector: "a.btn.btn-secondary",
        },
        {
          type: "heading",
          order: 53,
          level: 2,
          text: "AI Automation Agency FAQs",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 54,
          text: "AI automation combines artificial intelligence with automated workflows to handle both complex processes and repetitive tasks. Our AI-driven solutions analyse data, make decisions and learn from patterns, enabling businesses to achieve outcomes that go beyond traditional automation — essentially giving your operations “superpowers”.",
          segments: [
            {
              type: "text",
              value:
                " AI automation combines artificial intelligence with automated workflows to handle both complex processes and repetitive tasks. Our AI-driven solutions analyse data, make decisions and learn from patterns, enabling businesses to achieve outcomes that go beyond traditional automation — essentially giving your operations “superpowers”. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 55,
          text: "AI can automate a range of tasks, from routine data entry to complex decision‑making processes. By leveraging AI’s ability to learn and adapt, you can increase productivity and efficiency, freeing up time for your team to focus on the work that requires a human touch.",
          segments: [
            {
              type: "text",
              value:
                " AI can automate a range of tasks, from routine data entry to complex decision‑making processes. By leveraging AI’s ability to learn and adapt, you can increase productivity and efficiency, freeing up time for your team to focus on the work that requires a human touch. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 56,
          text: "Examples of AI automation include chatbots for customer support, predictive analytics for forecasting and planning, automated content creation and interactive dashboards — all of which streamline operations and boost efficiency.",
          segments: [
            {
              type: "text",
              value:
                " Examples of AI automation include chatbots for customer support, predictive analytics for forecasting and planning, automated content creation and interactive dashboards — all of which streamline operations and boost efficiency. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 57,
          text: "An AI automation agency like Silverstone AI offers services such as AI consulting, marketing automation, workflow and data automation, and systems & data integration to help businesses optimise operations.",
          segments: [
            {
              type: "text",
              value:
                " An AI automation agency like Silverstone AI offers services such as AI consulting, marketing automation, workflow and data automation, and systems & data integration to help businesses optimise operations. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 58,
          text: "Most projects start with a one-time setup fee plus monthly support. You can now review representative pricing across flagship packs, industry bundles, and smaller modules on our pricing page, then book an audit for a scoped recommendation.",
          segments: [
            {
              type: "text",
              value:
                " Most projects start with a one-time setup fee plus monthly support. You can now review representative pricing across flagship packs, industry bundles, and smaller modules on our ",
            },
            {
              type: "link",
              text: "pricing page",
              href: "/pricing",
              sourceHref: "/pricing",
              external: false,
              valid: true,
            },
            {
              type: "text",
              value: ", then book an audit for a scoped recommendation. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 59,
          text: "Popular AI automation tools include Zapier for integration, HubSpot for marketing automation and OpenAI’s GPT models for content generation and AI agents. We recommend tools based on your unique needs, budget and strategy.",
          segments: [
            {
              type: "text",
              value:
                " Popular AI automation tools include Zapier for integration, HubSpot for marketing automation and OpenAI’s GPT models for content generation and AI agents. We recommend tools based on your unique needs, budget and strategy. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 60,
          text: "Choosing a UK‑based AI automation agency, such as Silverstone AI, gives you access to local expertise, personalised support and a deep understanding of UK market dynamics.",
          segments: [
            {
              type: "text",
              value:
                " Choosing a UK‑based AI automation agency, such as Silverstone AI, gives you access to local expertise, personalised support and a deep understanding of UK market dynamics. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 61,
          text: "Silverstone AI specialises in practical, tailored AI solutions for small businesses, helping you adopt impactful automation that delivers measurable ROI.",
          segments: [
            {
              type: "text",
              value:
                " Silverstone AI specialises in practical, tailored AI solutions for small businesses, helping you adopt impactful automation that delivers measurable ROI. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 62,
          text: "Yes. AI automation can benefit small businesses by simplifying complex tasks and providing easy‑to‑use tools, allowing you to leverage AI without needing in‑house expertise.",
          segments: [
            {
              type: "text",
              value:
                " Yes. AI automation can benefit small businesses by simplifying complex tasks and providing easy‑to‑use tools, allowing you to leverage AI without needing in‑house expertise. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 63,
          text: "A small business automation consultant like Silverstone AI provides expert guidance on choosing the right AI tools, designing automation strategies and implementing solutions that drive growth and efficiency.",
          segments: [
            {
              type: "text",
              value:
                " A small business automation consultant like Silverstone AI provides expert guidance on choosing the right AI tools, designing automation strategies and implementing solutions that drive growth and efficiency. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 64,
          text: "Silverstone AI is based in London, UK, but operates as a remote team. This allows us to assist clients across the UK, Europe, the USA and beyond, providing services to start‑ups and small businesses regardless of location.",
          segments: [
            {
              type: "text",
              value:
                " Silverstone AI is based in London, UK, but operates as a remote team. This allows us to assist clients across the UK, Europe, the USA and beyond, providing services to start‑ups and small businesses regardless of location. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 65,
          text: "Silverstone AI can build AI agents and custom GPTs that perform actions by integrating them into your tech stack. Fully autonomous agents are an evolving capability in AI; we focus on practical agentic solutions available today.",
          segments: [
            {
              type: "text",
              value:
                " Silverstone AI can build AI agents and custom GPTs that perform actions by integrating them into your tech stack. Fully autonomous agents are an evolving capability in AI; we focus on practical agentic solutions available today. ",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 4,
      sourceSelector: "section.section.brand-gradient.animate",
      sourceId: null,
      sourceClasses: ["section", "brand-gradient", "animate"],
      heading: {
        level: 2,
        text: "Ready to scope your first automation?",
      },
      blocks: [
        {
          type: "heading",
          order: 66,
          level: 2,
          text: "Ready to scope your first automation?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 67,
          text: "Book a short audit to see what to fix first and where the fastest ROI sits.",
          segments: [
            {
              type: "text",
              value:
                " Book a short audit to see what to fix first and where the fastest ROI sits. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 68,
          text: "Book the 30‑Minute Audit",
          segments: [
            {
              type: "text",
              value: "Book the 30‑Minute Audit",
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
      text: "pricing page",
      sourceHref: "/pricing",
      migratedHref: "/pricing",
      external: false,
      valid: true,
    },
  ],
  assets: [],
  interactions: [],
  flags: {
    contentStatus: "rewrite",
    claimsStatus: "evidence-pending",
    riskNotes:
      "6 images lack width/height; quantified or absolute proof claims require substantiation",
    unresolvedNotes: [],
  },
};

export default content;
