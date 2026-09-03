import type { MigratedContentRecord } from "../../schema";

const content: MigratedContentRecord = {
  id: "content-privacy-policy",
  routeId: "route-privacy-policy",
  routePath: "/privacy-policy",
  kind: "legal",
  source: {
    routeKey: "canonical:/privacy-policy",
    file: "privacy-policy.html",
    sha256: "73c15b54df9aab3c975dcdb3ba2724fe238f2ed85244b5ab3e4af919b7adc41f",
    bytes: 14368,
    textSha256: "577d8d7c96f23dfe46e8f3de6c03a527a2d7e0b4bc8fd1dfd96420e8985b9639",
    extractedBlockCount: 19,
  },
  metadata: {
    title: "Privacy Policy | Silverstone AI",
    description:
      "Read the Silverstone AI privacy policy to understand how we collect, use, and protect your personal data.",
    canonical: "https://silverstone-ai.com/privacy-policy",
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
        content: "https://silverstone-ai.com/privacy-policy",
      },
      {
        property: "og:title",
        content: "Privacy Policy | Silverstone AI",
      },
      {
        property: "og:description",
        content:
          "Read the Silverstone AI privacy policy to understand how we collect, use, and protect your personal data.",
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
        content: "Privacy Policy | Silverstone AI",
      },
      {
        name: "twitter:description",
        content:
          "Read the Silverstone AI privacy policy to understand how we collect, use, and protect your personal data.",
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
  schema: [],
  headings: [
    {
      order: 0,
      level: 1,
      text: "Privacy Policy",
    },
    {
      order: 1,
      level: 2,
      text: "1. Introduction",
    },
    {
      order: 2,
      level: 2,
      text: "2. Information We Collect",
    },
    {
      order: 3,
      level: 2,
      text: "3. How We Use Your Information",
    },
    {
      order: 4,
      level: 2,
      text: "4. Cookies and Tracking",
    },
    {
      order: 5,
      level: 2,
      text: "5. Data Security",
    },
    {
      order: 6,
      level: 2,
      text: "6. Your Rights",
    },
    {
      order: 7,
      level: 2,
      text: "7. Contact Us",
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
        text: "Privacy Policy",
      },
      blocks: [
        {
          type: "paragraph",
          order: 0,
          text: "Your privacy is important to us. This policy explains how we collect, use and safeguard your information.",
          segments: [
            {
              type: "text",
              value:
                " Your privacy is important to us. This policy explains how we collect, use and safeguard your information. ",
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
      sourceClasses: ["section", "bg-mesh", "animate"],
      heading: {
        level: 2,
        text: "1. Introduction",
      },
      blocks: [
        {
          type: "heading",
          order: 1,
          level: 2,
          text: "1. Introduction",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 2,
          text: "Silverstone (“we”, “us”, or “our”) is committed to protecting your personal data and respecting your privacy. This Privacy Policy describes how we collect, use and protect the information you provide when you visit our website or engage our services.",
          segments: [
            {
              type: "text",
              value:
                " Silverstone (“we”, “us”, or “our”) is committed to protecting your personal data and respecting your privacy. This Privacy Policy describes how we collect, use and protect the information you provide when you visit our website or engage our services. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 3,
          level: 2,
          text: "2. Information We Collect",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 4,
          text: "We may collect and process the following types of data:",
          segments: [
            {
              type: "text",
              value: "We may collect and process the following types of data:",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 5,
          ordered: false,
          items: [
            {
              text: "Contact Information: such as your name, email address and telephone number when you contact us or book a consultation.",
              segments: [
                {
                  type: "text",
                  value:
                    " Contact Information: such as your name, email address and telephone number when you contact us or book a consultation. ",
                },
              ],
            },
            {
              text: "Usage Data: details of your visits to our website, including traffic data, location data and other communication data.",
              segments: [
                {
                  type: "text",
                  value:
                    " Usage Data: details of your visits to our website, including traffic data, location data and other communication data. ",
                },
              ],
            },
            {
              text: "Technical Data: your IP address, browser type, operating system and other technical details collected through analytics tools.",
              segments: [
                {
                  type: "text",
                  value:
                    " Technical Data: your IP address, browser type, operating system and other technical details collected through analytics tools. ",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
        {
          type: "heading",
          order: 6,
          level: 2,
          text: "3. How We Use Your Information",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 7,
          text: "We use your personal data to:",
          segments: [
            {
              type: "text",
              value: "We use your personal data to:",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "list",
          order: 8,
          ordered: false,
          items: [
            {
              text: "Respond to your enquiries and provide the services you request.",
              segments: [
                {
                  type: "text",
                  value:
                    "Respond to your enquiries and provide the services you request.",
                },
              ],
            },
            {
              text: "Schedule and manage consultations.",
              segments: [
                {
                  type: "text",
                  value: "Schedule and manage consultations.",
                },
              ],
            },
            {
              text: "Improve our website, products and services through analytics and user feedback.",
              segments: [
                {
                  type: "text",
                  value:
                    " Improve our website, products and services through analytics and user feedback. ",
                },
              ],
            },
            {
              text: "Comply with our legal obligations and enforce our terms and conditions.",
              segments: [
                {
                  type: "text",
                  value:
                    " Comply with our legal obligations and enforce our terms and conditions. ",
                },
              ],
            },
          ],
          sourceSelector: "ul",
        },
        {
          type: "heading",
          order: 9,
          level: 2,
          text: "4. Cookies and Tracking",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 10,
          text: "Our website uses cookies and similar technologies to enhance your experience, analyse traffic and remember your preferences. Cookies are small text files stored on your device. You can control cookie usage through your browser settings. We only set non-essential cookies after obtaining your consent via the cookie banner.",
          segments: [
            {
              type: "text",
              value:
                " Our website uses cookies and similar technologies to enhance your experience, analyse traffic and remember your preferences. Cookies are small text files stored on your device. You can control cookie usage through your browser settings. We only set non-essential cookies after obtaining your consent via the cookie banner. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 11,
          level: 2,
          text: "5. Data Security",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 12,
          text: "We implement appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure or access.",
          segments: [
            {
              type: "text",
              value:
                " We implement appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure or access. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 13,
          level: 2,
          text: "6. Your Rights",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 14,
          text: "Under the General Data Protection Regulation (GDPR), you have the right to access, rectify, erase, restrict or object to the processing of your personal data. You may also have the right to portability of your data. To exercise any of these rights, please contact us using the details below.",
          segments: [
            {
              type: "text",
              value:
                " Under the General Data Protection Regulation (GDPR), you have the right to access, rectify, erase, restrict or object to the processing of your personal data. You may also have the right to portability of your data. To exercise any of these rights, please contact us using the details below. ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "heading",
          order: 15,
          level: 2,
          text: "7. Contact Us",
          sourceSelector: "h2",
        },
        {
          type: "paragraph",
          order: 16,
          text: "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:",
          segments: [
            {
              type: "text",
              value:
                " If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at: ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 17,
          text: "Email: info@silverstone-ai.com",
          segments: [
            {
              type: "text",
              value: " Email: ",
            },
            {
              type: "link",
              text: "info@silverstone-ai.com",
              href: "mailto:info@silverstone-ai.com",
              sourceHref: "mailto:info@silverstone-ai.com",
              external: true,
              valid: true,
            },
            {
              type: "text",
              value: " ",
            },
          ],
          sourceSelector: "p",
        },
        {
          type: "paragraph",
          order: 18,
          text: "Address: 4 Deacon Street, SE17 1GD, London, UK",
          segments: [
            {
              type: "text",
              value: " Address: 4 Deacon Street, SE17 1GD, London, UK ",
            },
          ],
          sourceSelector: "p",
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
  interactions: [],
  flags: {
    contentStatus: "refactor",
    claimsStatus: "review-pending",
    riskNotes:
      "2 images lack width/height; privacy consent statement conflicts with analytics loading before consent",
    unresolvedNotes: [],
  },
};

export default content;
