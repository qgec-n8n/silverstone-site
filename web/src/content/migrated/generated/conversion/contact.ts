import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-contact",
  routeId: "route-contact",
  routePath: "/contact",
  kind: "conversion",
  source: {
    routeKey: "canonical:/contact",
    file: "contact.html",
    sha256: "b5601f504d8087d1f36c75e3fd68a991c6b895f35705bdc9b588a5a57d9b70a0",
    bytes: 15458,
    textSha256: "41c3d99a94e932abc9cb245623fb8b81bd9ad5d1621ba030ee86e41de8fa03ff",
    extractedBlockCount: 12,
  },
  metadata: {
    title: "Contact Us | Silverstone AI",
    description:
      "Contact Silverstone AI to discuss automation for your business, request support, or ask about services, pricing, and implementation.",
    canonical: "https://silverstone-ai.com/contact",
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
        content: "https://silverstone-ai.com/contact",
      },
      {
        property: "og:title",
        content: "Contact Us | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Contact Silverstone AI to discuss automation for your business, request support, or ask about services, pricing, and implementation.",
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
        content: "Contact Us | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Contact Silverstone AI to discuss automation for your business, request support, or ask about services, pricing, and implementation.",
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
      types: ["ContactPage", "BreadcrumbList", "ListItem"],
      rawJson:
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "ContactPage",\n          "@id": "https://silverstone-ai.com/contact#webpage",\n          "url": "https://silverstone-ai.com/contact",\n          "name": "Contact Silverstone AI - Silverstone AI",\n          "description": "Contact Silverstone AI to discuss automation for your business, request support, or ask about services, pricing, and implementation.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/#website"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/contact#breadcrumb"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/contact#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "Contact",\n              "item": "https://silverstone-ai.com/contact"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ContactPage",
            "@id": "https://silverstone-ai.com/contact#webpage",
            url: "https://silverstone-ai.com/contact",
            name: "Contact Silverstone AI - Silverstone AI",
            description:
              "Contact Silverstone AI to discuss automation for your business, request support, or ask about services, pricing, and implementation.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/#website",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/contact#breadcrumb",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/contact#breadcrumb",
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
                name: "Contact",
                item: "https://silverstone-ai.com/contact",
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
      text: "Contact Silverstone AI",
    },
    {
      order: 1,
      level: 2,
      text: "Contact Us",
    },
    {
      order: 2,
      level: 3,
      text: "Follow Silverstone AI",
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
        text: "Contact Silverstone AI",
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
          text: "Tell us where time leaks or leads slow down. We’ll reply with practical next steps, not a hard sell.",
          segments: [
            {
              type: "text",
              value:
                "Tell us where time leaks or leads slow down. We’ll reply with practical next steps, not a hard sell.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 1,
      sourceSelector: "section.section.bg-waves.animate",
      sourceId: null,
      sourceClasses: ["section", "bg-waves", "animate", "parallax-section"],
      heading: {
        level: 2,
        text: "Contact Us",
      },
      blocks: [
        {
          type: "heading",
          order: 2,
          level: 2,
          text: "Contact Us",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Send a quick overview and we’ll point you to the clearest next step.",
          segments: [
            {
              type: "text",
              value:
                " Send a quick overview and we’ll point you to the clearest next step. ",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "interaction",
          order: 4,
          interactionId: "route-contact-interaction-1",
          sourceSelector: "form#contact-form",
        },
        {
          type: "interaction",
          order: 5,
          interactionId: "route-contact-interaction-2",
          sourceSelector: "iframe.map-iframe",
        },
        {
          type: "paragraph",
          order: 6,
          text: "Address: 4 Deacon Street, London, SE17 1GD, UK Email: info@silverstone-ai.com",
          segments: [
            {
              type: "text",
              value: "Address: 4 Deacon Street, London, SE17 1GD, UK Email: ",
            },
            {
              type: "link",
              text: "info@silverstone-ai.com",
              href: "mailto:info@silverstone-ai.com",
              sourceHref: "mailto:info@silverstone-ai.com",
              external: true,
              valid: true,
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 7,
          level: 3,
          text: "Follow Silverstone AI",
          sourceSelector: "h3",
        },
        {
          type: "paragraph",
          order: 8,
          text: "See rollout ideas, product visuals, and practical automation examples across our social channels.",
          segments: [
            {
              type: "text",
              value:
                "See rollout ideas, product visuals, and practical automation examples across our social channels.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 9,
          text: "@silverstone.ai",
          segments: [
            {
              type: "text",
              value: "  @silverstone.ai ",
            },
          ],
          sourceSelector: "a.contact-social-link",
        },
        {
          type: "paragraph",
          order: 10,
          text: "Facebook Community",
          segments: [
            {
              type: "text",
              value: "  Facebook Community ",
            },
          ],
          sourceSelector: "a.contact-social-link",
        },
        {
          type: "paragraph",
          order: 11,
          text: "Follow for rollout ideas, product updates, and practical automation examples.",
          segments: [
            {
              type: "text",
              value:
                "Follow for rollout ideas, product updates, and practical automation examples.",
            },
          ],
          sourceSelector: "p.contact-social-note",
        },
      ],
    },
  ],
  links: [
    {
      order: 0,
      text: "info@silverstone-ai.com",
      sourceHref: "mailto:info@silverstone-ai.com",
      migratedHref: "mailto:info@silverstone-ai.com",
      external: true,
      valid: true,
    },
  ],
  assets: [],
  interactions: [
    {
      id: "route-contact-interaction-1",
      type: "form",
      provider: "legacy form",
      sourceSelector: "form#contact-form",
      sourceAction: null,
      sourceUrl: null,
      fields: [
        {
          name: "company",
          label: "",
          type: "text",
          placeholder: "",
          required: false,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "Your full name",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          required: true,
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          placeholder: "What is slowing the business down right now?",
          required: true,
        },
      ],
      active: false,
    },
    {
      id: "route-contact-interaction-2",
      type: "embed",
      provider: null,
      sourceSelector: "iframe.map-iframe",
      sourceAction: null,
      sourceUrl:
        "https://www.google.com/maps?q=4+Deacon+Street,+SE17+1GD,+London,+UK&output=embed",
      fields: [],
      active: false,
    },
  ],
  flags: {
    contentStatus: "retain",
    claimsStatus: "review-pending",
    riskNotes: "2 images lack width/height",
    unresolvedNotes: [],
  },
};

export default content;
