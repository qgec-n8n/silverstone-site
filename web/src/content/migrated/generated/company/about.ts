import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-about",
  routeId: "route-about",
  routePath: "/about",
  kind: "core",
  source: {
    routeKey: "canonical:/about",
    file: "about.html",
    sha256: "ba0168f4dcc465658e4794f9b850f1909f925e5c31f2fcfa4994f59c9226b73c",
    bytes: 23293,
    textSha256: "515294a589943de1f6a5e16b7f8e45e50a4c7eb94135a15e13efe7ef12ae90ab",
    extractedBlockCount: 26,
  },
  metadata: {
    title: "About Us | Silverstone AI",
    description:
      "Learn how Silverstone AI helps UK small businesses grow with practical automation, faster response times, and tailored support.",
    canonical: "https://silverstone-ai.com/about",
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
        content: "https://silverstone-ai.com/about",
      },
      {
        property: "og:title",
        content: "About Us | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Learn how Silverstone AI helps UK small businesses grow with practical automation, faster response times, and tailored support.",
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
        content: "About Us | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Learn how Silverstone AI helps UK small businesses grow with practical automation, faster response times, and tailored support.",
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
      types: ["AboutPage", "BreadcrumbList", "ListItem"],
      rawJson:
        '{\n      "@context": "https://schema.org",\n      "@graph": [\n        {\n          "@type": "AboutPage",\n          "@id": "https://silverstone-ai.com/about#webpage",\n          "url": "https://silverstone-ai.com/about",\n          "name": "About Silverstone AI - Silverstone AI",\n          "description": "Learn how Silverstone AI helps UK small businesses grow with practical automation, faster response times, and tailored support.",\n          "isPartOf": {\n            "@id": "https://silverstone-ai.com/#website"\n          },\n          "about": {\n            "@id": "https://silverstone-ai.com/#organization"\n          },\n          "breadcrumb": {\n            "@id": "https://silverstone-ai.com/about#breadcrumb"\n          }\n        },\n        {\n          "@type": "BreadcrumbList",\n          "@id": "https://silverstone-ai.com/about#breadcrumb",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Home",\n              "item": "https://silverstone-ai.com"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "About",\n              "item": "https://silverstone-ai.com/about"\n            }\n          ]\n        }\n      ]\n    }',
      parsed: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "AboutPage",
            "@id": "https://silverstone-ai.com/about#webpage",
            url: "https://silverstone-ai.com/about",
            name: "About Silverstone AI - Silverstone AI",
            description:
              "Learn how Silverstone AI helps UK small businesses grow with practical automation, faster response times, and tailored support.",
            isPartOf: {
              "@id": "https://silverstone-ai.com/#website",
            },
            about: {
              "@id": "https://silverstone-ai.com/#organization",
            },
            breadcrumb: {
              "@id": "https://silverstone-ai.com/about#breadcrumb",
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://silverstone-ai.com/about#breadcrumb",
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
                name: "About",
                item: "https://silverstone-ai.com/about",
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
      text: "About Silverstone AI",
    },
    {
      order: 1,
      level: 2,
      text: "Our Mission",
    },
    {
      order: 2,
      level: 2,
      text: "Our Values",
    },
    {
      order: 3,
      level: 4,
      text: "Personalised Approach",
    },
    {
      order: 4,
      level: 4,
      text: "Innovation & Excellence",
    },
    {
      order: 5,
      level: 4,
      text: "Empowering People",
    },
    {
      order: 6,
      level: 2,
      text: "Experience by the Numbers",
    },
    {
      order: 7,
      level: 2,
      text: "Our Story",
    },
    {
      order: 8,
      level: 2,
      text: "What Drives Us",
    },
    {
      order: 9,
      level: 2,
      text: "Ready to build smarter systems?",
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
        text: "About Silverstone AI",
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
          text: "Silverstone AI is a London automation studio helping UK small businesses save time, cut admin, and run on better systems.",
          segments: [
            {
              type: "text",
              value:
                "Silverstone AI is a London automation studio helping UK small businesses save time, cut admin, and run on better systems.",
            },
          ],
          sourceSelector: "p",
        },
      ],
    },
    {
      order: 1,
      sourceSelector: "section.section.bg-mesh.animate",
      sourceId: null,
      sourceClasses: ["section", "bg-mesh", "animate", "parallax-section"],
      heading: {
        level: 2,
        text: "Our Mission",
      },
      blocks: [
        {
          type: "heading",
          order: 2,
          level: 2,
          text: "Our Mission",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 3,
          text: "Silverstone AI helps UK small businesses run with the clarity, consistency, and commercial control of a much larger team. We design practical automation around the way your people already work, so every workflow feels measured, brand-safe, and immediately useful rather than bolted on for the sake of novelty.",
          segments: [
            {
              type: "text",
              value:
                "Silverstone AI helps UK small businesses run with the clarity, consistency, and commercial control of a much larger team. We design practical automation around the way your people already work, so every workflow feels measured, brand-safe, and immediately useful rather than bolted on for the sake of novelty.",
            },
          ],
          sourceSelector: "p.mission-card__lead",
        },
        {
          type: "paragraph",
          order: 4,
          text: "Our mission is to replace scattered manual tasks with a calmer operating rhythm: faster first response, cleaner handoffs, fewer dropped opportunities, and more time for the work only your team should own. The result is premium in feel but practical in delivery, giving ambitious businesses a stronger foundation for sustainable growth.",
          segments: [
            {
              type: "text",
              value:
                "Our mission is to replace scattered manual tasks with a calmer operating rhythm: faster first response, cleaner handoffs, fewer dropped opportunities, and more time for the work only your team should own. The result is premium in feel but practical in delivery, giving ambitious businesses a stronger foundation for sustainable growth.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 5,
          level: 2,
          text: "Our Values",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 6,
          text: "The principles that guide every project and partnership.",
          segments: [
            {
              type: "text",
              value: "The principles that guide every project and partnership.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 7,
          level: 4,
          text: "Personalised Approach",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 8,
          text: "We listen first, then design around the way your business actually works.",
          segments: [
            {
              type: "text",
              value:
                "We listen first, then design around the way your business actually works.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 9,
          level: 4,
          text: "Innovation & Excellence",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 10,
          text: "We use modern tools carefully, with a bias for clear outcomes over novelty.",
          segments: [
            {
              type: "text",
              value:
                "We use modern tools carefully, with a bias for clear outcomes over novelty.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 11,
          level: 4,
          text: "Empowering People",
          sourceSelector: "h4",
        },
        {
          type: "paragraph",
          order: 12,
          text: "Automation should remove low-value work so people can focus on judgment, service, and growth.",
          segments: [
            {
              type: "text",
              value:
                "Automation should remove low-value work so people can focus on judgment, service, and growth.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 13,
          level: 2,
          text: "Experience by the Numbers",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 14,
          text: "A snapshot of our impact so far.",
          segments: [
            {
              type: "text",
              value: "A snapshot of our impact so far.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "heading",
          order: 15,
          level: 2,
          text: "Our Story",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 16,
          text: "Founded by a team of technologists and entrepreneurs, Silverstone AI was born out of a desire to help small businesses harness the power of automation without the complexity. We saw how inefficient processes, manual tasks and disconnected systems were holding organisations back and decided to build a better way.",
          segments: [
            {
              type: "text",
              value:
                "Founded by a team of technologists and entrepreneurs, Silverstone AI was born out of a desire to help small businesses harness the power of automation without the complexity. We saw how inefficient processes, manual tasks and disconnected systems were holding organisations back and decided to build a better way.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Today, we partner closely with clients across industries - from professional services and manufacturing to retail and healthcare - to identify bottlenecks, remove friction and implement smart systems that work seamlessly together. Our bespoke approach ensures that every solution fits your business like a glove, delivering measurable results and empowering your people.",
          segments: [
            {
              type: "text",
              value:
                "Today, we partner closely with clients across industries - from professional services and manufacturing to retail and healthcare - to identify bottlenecks, remove friction and implement smart systems that work seamlessly together. Our bespoke approach ensures that every solution fits your business like a glove, delivering measurable results and empowering your people.",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 18,
          level: 2,
          text: "What Drives Us",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 19,
          text: "Technology is only useful when it creates clearer operations and better outcomes for people.",
          segments: [
            {
              type: "text",
              value:
                "Technology is only useful when it creates clearer operations and better outcomes for people.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "image",
          order: 20,
          assetId: "asset-6bccfe39823cf85e",
          sourceSelector: "img",
        },
        {
          type: "image",
          order: 21,
          assetId: "asset-1bb3e7ada4ba3770",
          sourceSelector: "img",
        },
        {
          type: "image",
          order: 22,
          assetId: "asset-0bfc7e90cd87d985",
          sourceSelector: "img",
        },
      ],
    },
    {
      order: 2,
      sourceSelector: "section.section.brand-gradient.animate",
      sourceId: null,
      sourceClasses: ["section", "brand-gradient", "animate"],
      heading: {
        level: 2,
        text: "Ready to build smarter systems?",
      },
      blocks: [
        {
          type: "heading",
          order: 23,
          level: 2,
          text: "Ready to build smarter systems?",
          sourceSelector: "h2.section-title",
        },
        {
          type: "paragraph",
          order: 24,
          text: "Book the audit if you want a practical view of what to automate first.",
          segments: [
            {
              type: "text",
              value:
                "Book the audit if you want a practical view of what to automate first.",
            },
          ],
          sourceSelector: "p.section-subtitle",
        },
        {
          type: "paragraph",
          order: 25,
          text: "Book the Free Audit",
          segments: [
            {
              type: "text",
              value: "Book the Free Audit",
            },
          ],
          sourceSelector: "a.btn.btn-primary",
        },
      ],
    },
  ],
  links: [],
  assets: [
    {
      id: "asset-6bccfe39823cf85e",
      role: "content",
      sourcePath: "assets/images/zip/derived/Silverstone_04-640.jpg",
      sourceReference: "assets/images/zip/derived/Silverstone_04-640.jpg",
      sourceSha256: "018d138135da485399f3882e6d84dd693da7a77ff12efa0663f7d916de672c9d",
      sourceBytes: 27935,
      publicPath: "/migrated-assets/assets/images/zip/derived/Silverstone_04-640.jpg",
      width: 640,
      height: 427,
      sourceAlt: "Human and robotic hand connection",
      altCandidate: "Human and robotic hand connection",
      altStatus: "source-alt",
      inventoryDisposition: "refactor",
      fallbackForMissingSource: null,
    },
    {
      id: "asset-1bb3e7ada4ba3770",
      role: "content",
      sourcePath: "assets/images/zip/derived/Silverstone_06-640.jpg",
      sourceReference: "assets/images/zip/derived/Silverstone_06-640.jpg",
      sourceSha256: "0dba4e0e407e52b7d34501862821903f911ab5b67dc60e0061f4ef7a03ef14ee",
      sourceBytes: 55152,
      publicPath: "/migrated-assets/assets/images/zip/derived/Silverstone_06-640.jpg",
      width: 640,
      height: 427,
      sourceAlt: "Gears and neural network",
      altCandidate: "Gears and neural network",
      altStatus: "source-alt",
      inventoryDisposition: "refactor",
      fallbackForMissingSource: null,
    },
    {
      id: "asset-0bfc7e90cd87d985",
      role: "content",
      sourcePath: "assets/images/zip/derived/Silverstone_27-640.jpg",
      sourceReference: "assets/images/zip/derived/Silverstone_27-640.jpg",
      sourceSha256: "0936ba1f0ed363990092565d55de7f2310eea411cf48dffc248264a20076d723",
      sourceBytes: 37786,
      publicPath: "/migrated-assets/assets/images/zip/derived/Silverstone_27-640.jpg",
      width: 640,
      height: 427,
      sourceAlt: "Neon green leaf symbolising sustainable growth",
      altCandidate: "Neon green leaf symbolising sustainable growth",
      altStatus: "source-alt",
      inventoryDisposition: "refactor",
      fallbackForMissingSource: null,
    },
  ],
  interactions: [],
  flags: {
    contentStatus: "retain",
    claimsStatus: "review-pending",
    riskNotes: "7 images lack width/height",
    unresolvedNotes: [],
  },
};

export default content;
