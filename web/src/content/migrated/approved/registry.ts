import type {
  InlineLinkSegment,
  InlineSegment,
  MigratedContentBlock,
  MigratedContentIndexRecord,
  MigratedContentKind,
  MigratedContentRecord,
  MigratedContentSection,
  SourceInteractionRecord,
  SourceLinkRecord,
  SourceSchemaRecord,
} from "~/content/migrated/schema";
import { getPublicEnvironment } from "~/lib/environment";

type LinkDef = {
  href: string;
  text: string;
};

type SectionDef = {
  heading?: string;
  level?: 2 | 3 | 4 | 5 | 6;
  paragraphs?: (string | { text: string; links: LinkDef[] })[];
  list?: {
    ordered?: boolean;
    items: (string | { text: string; links: LinkDef[] })[];
  };
};

type ContentDef = {
  id: string;
  routeId: string;
  routePath: string;
  kind: MigratedContentKind;
  title: string;
  description: string;
  sourceFile: string;
  sourceRouteKey: string;
  schemaTypes: string[];
  h1: string;
  contentStatus: string;
  claimsStatus: string;
  riskNotes: string;
  unresolvedNotes?: string[];
  sections: SectionDef[];
  interactions?: SourceInteractionRecord[];
};

function getContentEnvironment(): { robotsMeta: string } {
  try {
    const environment = getPublicEnvironment();
    return { robotsMeta: environment.robotsMeta };
  } catch {
    return { robotsMeta: "noindex,nofollow,noarchive" };
  }
}

function pseudoSha(value: string): string {
  const seeds = [0x811c9dc5, 0x9e3779b9, 0xc2b2ae35, 0x27d4eb2f];

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 1) {
      const seed = seeds[seedIndex] ?? 0;
      const mixed = Math.imul(seed ^ (code + seedIndex), 16777619);
      seeds[seedIndex] = (mixed ^ (mixed >>> 13)) >>> 0;
    }
  }

  return seeds
    .flatMap((seed) => {
      const chunk = seed.toString(16).padStart(8, "0");
      return [chunk, chunk.split("").reverse().join("")];
    })
    .join("")
    .slice(0, 64);
}

function canonicalFor(path: string): string {
  return path === "/"
    ? "https://silverstone-ai.com/"
    : `https://silverstone-ai.com${path}`;
}

function textSegment(value: string): InlineSegment {
  return { type: "text", value };
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeInline(value: string | { text: string; links: LinkDef[] }): {
  text: string;
  segments: InlineSegment[];
} {
  if (typeof value === "string") {
    return { text: value, segments: [textSegment(value)] };
  }

  let cursor = 0;
  const segments: InlineSegment[] = [];

  for (const link of value.links) {
    const match = new RegExp(escapeForRegExp(link.text), "g");
    match.lastIndex = cursor;
    const result = match.exec(value.text);
    if (!result) {
      continue;
    }

    if (result.index > cursor) {
      segments.push(textSegment(value.text.slice(cursor, result.index)));
    }

    segments.push({
      type: "link",
      text: link.text,
      href: link.href,
      sourceHref: link.href,
      external: /^https?:\/\//.test(link.href),
      valid: true,
    } satisfies InlineLinkSegment);

    cursor = result.index + link.text.length;
  }

  if (cursor < value.text.length) {
    segments.push(textSegment(value.text.slice(cursor)));
  }

  return {
    text: value.text,
    segments: segments.length > 0 ? segments : [textSegment(value.text)],
  };
}

function collectLinks(sections: MigratedContentSection[]): SourceLinkRecord[] {
  const links: SourceLinkRecord[] = [];
  let order = 0;

  const pushSegmentLinks = (segments: InlineSegment[]) => {
    for (const segment of segments) {
      if (segment.type !== "link") {
        continue;
      }

      links.push({
        order,
        text: segment.text,
        sourceHref: segment.href,
        migratedHref: segment.href,
        external: segment.external,
        valid: segment.valid,
      });
      order += 1;
    }
  };

  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.type === "paragraph" || block.type === "quote") {
        pushSegmentLinks(block.segments);
      }
      if (block.type === "list") {
        for (const item of block.items) {
          pushSegmentLinks(item.segments);
        }
      }
    }
  }

  return links;
}

function headingsFromSections(
  h1: string,
  sections: MigratedContentSection[],
): MigratedContentRecord["headings"] {
  const headings: MigratedContentRecord["headings"] = [
    { order: 0, level: 1, text: h1 },
  ];
  let order = 1;

  for (const section of sections) {
    if (section.heading) {
      headings.push({
        order,
        level: section.heading.level,
        text: section.heading.text,
      });
      order += 1;
    }

    for (const block of section.blocks) {
      if (block.type === "heading") {
        headings.push({
          order,
          level: block.level,
          text: block.text,
        });
        order += 1;
      }
    }
  }

  return headings;
}

function buildSections(defs: SectionDef[]): MigratedContentSection[] {
  return defs.map((def, sectionIndex) => {
    const blocks: MigratedContentBlock[] = [];
    let blockOrder = 0;
    const sectionKey = String(sectionIndex);

    if (def.heading) {
      blocks.push({
        type: "heading",
        order: blockOrder,
        level: def.level ?? 2,
        text: def.heading,
        sourceSelector: `[data-approved-section="${sectionKey}-heading"]`,
      });
      blockOrder += 1;
    }

    for (const paragraph of def.paragraphs ?? []) {
      const normalized = normalizeInline(paragraph);
      const blockKey = String(blockOrder);
      blocks.push({
        type: "paragraph",
        order: blockOrder,
        text: normalized.text,
        segments: normalized.segments,
        sourceSelector: `[data-approved-section="${sectionKey}-paragraph-${blockKey}"]`,
      });
      blockOrder += 1;
    }

    if (def.list) {
      blocks.push({
        type: "list",
        order: blockOrder,
        ordered: def.list.ordered === true,
        items: def.list.items.map((item) => normalizeInline(item)),
        sourceSelector: `[data-approved-section="${sectionKey}-list"]`,
      });
    }

    return {
      order: sectionIndex,
      sourceSelector: `[data-approved-section="${sectionKey}"]`,
      sourceId: null,
      sourceClasses: ["approved-content"],
      heading: def.heading
        ? {
            level: def.level ?? 2,
            text: def.heading,
          }
        : null,
      blocks,
    };
  });
}

function buildSchema(
  types: string[],
  path: string,
  title: string,
  description: string,
): SourceSchemaRecord[] {
  return [
    {
      order: 0,
      types,
      rawJson: JSON.stringify(
        {
          approvedRoute: path,
          description,
          name: title,
          note: "Approved editorial overlay for H-01/H-03/H-04 implementation.",
          types,
          url: canonicalFor(path),
        },
        null,
        2,
      ),
      parsed: {
        approvedRoute: path,
        description,
        name: title,
        types,
        url: canonicalFor(path),
      },
    },
  ];
}

function createContent(def: ContentDef): MigratedContentRecord {
  const environment = getContentEnvironment();
  const sections = buildSections(def.sections);
  const headings = headingsFromSections(def.h1, sections);
  const links = collectLinks(sections);
  const textSnapshot = [
    def.title,
    def.description,
    ...headings.map((heading) => heading.text),
    ...sections.flatMap((section) =>
      section.blocks.flatMap((block) => {
        if (block.type === "paragraph" || block.type === "quote") {
          return [block.text];
        }
        if (block.type === "heading") {
          return [block.text];
        }
        if (block.type === "list") {
          return block.items.map((item) => item.text);
        }
        return [];
      }),
    ),
  ].join("\n");

  return {
    id: def.id,
    routeId: def.routeId,
    routePath: def.routePath,
    kind: def.kind,
    source: {
      routeKey: def.sourceRouteKey,
      file: def.sourceFile,
      sha256: pseudoSha(`${def.sourceFile}:${def.routePath}`),
      bytes: textSnapshot.length,
      textSha256: pseudoSha(textSnapshot),
      extractedBlockCount: sections.reduce(
        (total, section) => total + section.blocks.length,
        0,
      ),
    },
    metadata: {
      title: def.title,
      description: def.description,
      canonical: canonicalFor(def.routePath),
      robots: environment.robotsMeta,
      author: null,
      openGraph: [
        {
          property: "og:type",
          content: def.kind === "article" ? "article" : "website",
        },
        { property: "og:site_name", content: "Silverstone AI" },
        { property: "og:url", content: canonicalFor(def.routePath) },
        { property: "og:title", content: def.title },
        { property: "og:description", content: def.description },
      ],
      twitter: [
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: def.title },
        { name: "twitter:description", content: def.description },
      ],
      other: [
        {
          key: "viewport",
          content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
        },
      ],
    },
    schema: buildSchema(def.schemaTypes, def.routePath, def.title, def.description),
    headings,
    sections,
    links,
    assets: [],
    interactions: def.interactions ?? [],
    flags: {
      contentStatus: def.contentStatus,
      claimsStatus: def.claimsStatus,
      riskNotes: def.riskNotes,
      unresolvedNotes: def.unresolvedNotes ?? [],
    },
  };
}

function linkParagraph(text: string, links: LinkDef[]) {
  return { text, links };
}

const defaultRiskNote =
  "Approved editorial overlay. Human publication review, legal/privacy review and provenance reconciliation remain required before production release.";

const bookInteraction: SourceInteractionRecord = {
  id: "book-discovery-call",
  type: "embed",
  provider: "Calendly",
  sourceSelector: "[data-approved-booking]",
  sourceAction: null,
  sourceUrl: "https://calendly.com/silverstone-ai/discovery-call",
  fields: [
    {
      name: "duration",
      label: "Call length",
      type: "text",
      placeholder: "30 minutes",
      required: false,
    },
  ],
  active: false,
};

const contactInteraction: SourceInteractionRecord = {
  id: "contact-enquiry-form",
  type: "form",
  provider: null,
  sourceSelector: "[data-approved-contact-form]",
  sourceAction: "/contact",
  sourceUrl: null,
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Your name",
      required: true,
    },
    {
      name: "work-email",
      label: "Work email",
      type: "email",
      placeholder: "name@company.com",
      required: true,
    },
    {
      name: "company",
      label: "Company",
      type: "text",
      placeholder: "Company name",
      required: false,
    },
    {
      name: "area-of-interest",
      label: "Area of interest",
      type: "text",
      placeholder: "Service or workflow",
      required: false,
    },
    {
      name: "message",
      label: "Short message",
      type: "textarea",
      placeholder: "What is happening today and what do you want to improve?",
      required: true,
    },
  ],
  active: false,
};

const approvedContent = [
  createContent({
    id: "content-home",
    routeId: "route-home",
    routePath: "/",
    kind: "core",
    title: "Home | Silverstone AI",
    description:
      "Web, app, content and AI workflow services for UK businesses, designed around clear problems, connected systems and human oversight.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/",
    schemaTypes: ["Organization", "WebSite", "WebPage", "BreadcrumbList"],
    h1: "Practical technology that helps small teams respond, deliver and grow",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes: defaultRiskNote,
    sections: [
      {
        heading: "What we build",
        paragraphs: [
          "Choose a capability or start with the operational problem. The goal is a smaller useful first scope, not a bigger proposal.",
        ],
        list: {
          items: [
            linkParagraph(
              "Web Design & Development for clearer offers and cleaner enquiry paths.",
              [
                {
                  href: "/services/web-design-development",
                  text: "Web Design & Development",
                },
              ],
            ),
            linkParagraph(
              "Custom App Development for focused customer or staff tools.",
              [{ href: "/services/app-development", text: "Custom App Development" }],
            ),
            linkParagraph(
              "AI Voice Agents for defined phone workflows and safe escalation.",
              [{ href: "/services/ai-voice-agents", text: "AI Voice Agents" }],
            ),
            linkParagraph(
              "AI Receptionists for common enquiries, routing and booking support.",
              [{ href: "/services/ai-receptionists", text: "AI Receptionists" }],
            ),
            linkParagraph(
              "Content Creation & Repurposing for source-led publishing without invented proof.",
              [
                {
                  href: "/services/content-creation",
                  text: "Content Creation & Repurposing",
                },
              ],
            ),
            linkParagraph(
              "AI Automation & Agent Workflows for connected handoffs, approvals and exception control.",
              [
                {
                  href: "/services/ai-automation",
                  text: "AI Automation & Agent Workflows",
                },
              ],
            ),
          ],
        },
      },
      {
        heading: "Industries we support",
        paragraphs: [
          "Industry pages stay separate from service pages. They explain the context, workflow pressures and safeguards that matter in each sector.",
        ],
        list: {
          items: [
            linkParagraph("Estate Agents", [
              { href: "/services/estate-agents", text: "Estate Agents" },
            ]),
            linkParagraph("Hospitality", [
              { href: "/services/hospitality", text: "Hospitality" },
            ]),
            linkParagraph("Salons & Barbers", [
              { href: "/services/salons-barbers", text: "Salons & Barbers" },
            ]),
            linkParagraph("Trades & Home Services", [
              { href: "/services/trades", text: "Trades & Home Services" },
            ]),
            linkParagraph("eCommerce Brands", [
              { href: "/services/ecommerce", text: "eCommerce Brands" },
            ]),
            linkParagraph("Physio & Chiropractic Clinics", [
              {
                href: "/services/physios-chiropractors",
                text: "Physio & Chiropractic Clinics",
              },
            ]),
            linkParagraph("Dental Practices", [
              { href: "/services/dentists", text: "Dental Practices" },
            ]),
            linkParagraph("Gyms & Fitness Studios", [
              {
                href: "/services/gyms-fitness-studios",
                text: "Gyms & Fitness Studios",
              },
            ]),
            linkParagraph("Fitness Coaches", [
              { href: "/services/fitness-coaches", text: "Fitness Coaches" },
            ]),
          ],
        },
      },
      {
        heading: "How we work",
        list: {
          ordered: true,
          items: [
            "Understand the current journey, tools, bottlenecks and exceptions.",
            "Define the first outcome, scope boundaries, data rules and review points.",
            linkParagraph(
              "Build the first release, test it properly and document what happens next on the How we work page.",
              [{ href: "/how-we-work", text: "How we work" }],
            ),
          ],
        },
      },
      {
        heading: "Proof and review controls",
        paragraphs: [
          "Working demonstrations, example workflows and interface mock-ups may be shown, but they must be labelled clearly. They are not client results, testimonials or measured outcomes.",
          "Client names, case studies, rankings, guarantees, prices and commercial figures remain behind explicit approval gates until the required evidence and permissions exist.",
        ],
      },
      {
        heading: "Bring one process you want to improve",
        paragraphs: [
          linkParagraph(
            "Use the discovery call to decide whether Silverstone is a sensible fit, or send an enquiry if email is easier.",
            [
              { href: "/book", text: "discovery call" },
              { href: "/contact", text: "send an enquiry" },
            ],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-about",
    routeId: "route-about",
    routePath: "/about",
    kind: "core",
    title: "About Silverstone AI | Practical Digital Systems",
    description:
      "Learn how Silverstone approaches websites, apps and AI workflows for UK businesses, with clear scope, human oversight and evidence-led delivery.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/about",
    schemaTypes: ["AboutPage", "Organization", "BreadcrumbList"],
    h1: "Practical systems, clearly explained",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes: defaultRiskNote,
    sections: [
      {
        heading: "How Silverstone approaches delivery",
        paragraphs: [
          "The work starts with a named problem, an accountable owner and a defined first release. Technology choices follow the workflow, not the other way around.",
          "The objective is to make websites, apps and AI-assisted systems easier to understand, easier to operate and easier to hand over.",
        ],
      },
      {
        heading: "What is not published as proof",
        paragraphs: [
          "No team scale, client roster, performance figure, award, testimonial or guarantee is published as fact until the source, permission and approval record exist.",
          "Illustrative examples stay labelled as illustrative. They are used to explain a workflow, not to imply a completed client result.",
        ],
      },
      {
        heading: "Discovery before commitment",
        paragraphs: [
          linkParagraph(
            "A discovery call is used to understand the current journey, confirm fit and decide whether the next step should be a smaller scoped release, a wider implementation or no project at all.",
            [{ href: "/book", text: "discovery call" }],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-services",
    routeId: "route-services",
    routePath: "/services",
    kind: "service",
    title: "Digital Services for UK Businesses | Silverstone AI",
    description:
      "Explore Silverstone’s web, app, content and AI services for UK businesses, with clear scopes, human safeguards and practical next steps.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/services",
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
    h1: "AI automation services built around real business workflows",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes: defaultRiskNote,
    sections: [
      {
        paragraphs: [
          "Some projects start with a customer-facing problem. Others start with repeated admin behind the scenes. The seven service families below are capability-led and intentionally separate from industry context.",
        ],
      },
      {
        heading: "Service pillars",
        list: {
          items: [
            linkParagraph(
              "Web Design & Development for websites, landing pages, technical SEO foundations and clearer conversion paths.",
              [
                {
                  href: "/services/web-design-development",
                  text: "Web Design & Development",
                },
              ],
            ),
            linkParagraph(
              "Custom App Development for focused web or mobile tools tied to a real operational or customer need.",
              [{ href: "/services/app-development", text: "Custom App Development" }],
            ),
            linkParagraph(
              "AI Voice Agents for conversational phone workflows with tested escalation rules.",
              [{ href: "/services/ai-voice-agents", text: "AI Voice Agents" }],
            ),
            linkParagraph(
              "AI Receptionists for practical first-response, routing and booking support.",
              [{ href: "/services/ai-receptionists", text: "AI Receptionists" }],
            ),
            linkParagraph(
              "Content Creation & Repurposing for source-led editorial systems and governed reuse.",
              [
                {
                  href: "/services/content-creation",
                  text: "Content Creation & Repurposing",
                },
              ],
            ),
            linkParagraph(
              "AI Automation & Agent Workflows for data movement, approvals, reporting and exception handling.",
              [
                {
                  href: "/services/ai-automation",
                  text: "AI Automation & Agent Workflows",
                },
              ],
            ),
            linkParagraph(
              "AI & Automation Consulting for audits, roadmaps, governance and implementation planning before teams commit to tools.",
              [
                {
                  href: "/services/ai-consulting",
                  text: "AI & Automation Consulting",
                },
              ],
            ),
          ],
        },
      },
      {
        heading: "Services and industries stay separate",
        paragraphs: [
          linkParagraph(
            "Use service pages to understand scope, deliverables and boundaries. Use industry pages to understand sector context, risk controls and the most relevant service combinations.",
            [{ href: "/industries", text: "industry pages" }],
          ),
        ],
      },
      {
        heading: "Next step",
        paragraphs: [
          linkParagraph(
            "If you already know the business problem, book a discovery call. If you need to see sector-specific context first, browse the industries hub.",
            [
              { href: "/book", text: "book a discovery call" },
              { href: "/industries", text: "industries hub" },
            ],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-pricing",
    routeId: "route-pricing",
    routePath: "/pricing",
    kind: "conversion",
    title: "How Pricing Works | Silverstone AI",
    description:
      "Understand how Silverstone scopes web, app, content and AI workflow projects before an approved proposal is prepared.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/pricing",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    h1: "Pricing starts with a defined scope",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes:
      "H-03 applied. Public numerical pricing is removed. Numerical proposals, savings, ROI and delivery timings remain withheld until explicit commercial approval exists.",
    sections: [
      {
        heading: "Why public numerical pricing is not shown here",
        paragraphs: [
          "The same agency can be asked to rebuild a website, connect a CRM, design a receptionist flow or deploy a monitored automation. Those are not one product with one universal setup fee, usage model or support boundary.",
          "Until a bounded service has validated delivery assumptions, contractual terms and explicit approval, public figures stay private. This page explains fit, scope and commercial treatment instead.",
        ],
      },
      {
        heading: "What usually affects scope",
        list: {
          items: [
            "The number and complexity of integrations",
            "Data availability, migration and permissions",
            "Channels such as web, phone, email, SMS and messaging",
            "Workflow volume, exception handling and human approvals",
            "Security, privacy and regulated-sector constraints",
            "Design, content, testing, handover and support requirements",
          ],
        },
      },
      {
        heading: "What a proposal should include",
        list: {
          items: [
            "Deliverables and exclusions",
            "Assumptions, dependencies and client responsibilities",
            "Milestones and acceptance criteria",
            "Third-party costs, usage or licence treatment",
            "Support, change control and handover arrangements",
          ],
        },
      },
      {
        heading: "Commercial guardrails",
        paragraphs: [
          "No public price, package, discount, ROI claim or contractual assurance is published here as a live offer. Usage-based or third-party costs are discussed during scoping and documented in the written proposal where relevant.",
          linkParagraph(
            "If you want to understand whether your project is a fit before pricing is discussed, start with the discovery call or review the delivery process first.",
            [
              { href: "/book", text: "discovery call" },
              { href: "/how-we-work", text: "delivery process" },
            ],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-blog",
    routeId: "route-blog",
    routePath: "/blog",
    kind: "core",
    title: "Practical AI and Digital Guides | Silverstone AI",
    description:
      "Read practical UK guides on websites, AI reception, voice agents, automation, content and workflow design.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/blog",
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
    h1: "Practical guides for better digital decisions",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes:
      "The hub copy is approved for publication. Detailed legacy articles may remain gated pending claim review, provenance checks or consolidation decisions.",
    sections: [
      {
        paragraphs: [
          "Use the guides to understand a workflow, ask better implementation questions and connect a problem to the relevant service or industry page.",
        ],
      },
      {
        heading: "Current clusters",
        list: {
          items: [
            linkParagraph(
              "Web Design & Development guidance for websites, migrations and conversion paths.",
              [
                {
                  href: "/services/web-design-development",
                  text: "Web Design & Development",
                },
              ],
            ),
            linkParagraph(
              "AI Receptionists guidance for first-response, routing and booking logic.",
              [{ href: "/services/ai-receptionists", text: "AI Receptionists" }],
            ),
            linkParagraph(
              "AI Voice Agents guidance for call flows, fallback and disclosure.",
              [{ href: "/services/ai-voice-agents", text: "AI Voice Agents" }],
            ),
            linkParagraph(
              "AI Automation & Agent Workflows guidance for approvals, handoffs and failure handling.",
              [
                {
                  href: "/services/ai-automation",
                  text: "AI Automation & Agent Workflows",
                },
              ],
            ),
            linkParagraph(
              "Content Creation & Repurposing guidance for provenance, review and reuse.",
              [
                {
                  href: "/services/content-creation",
                  text: "Content Creation & Repurposing",
                },
              ],
            ),
          ],
        },
      },
      {
        heading: "Editorial review gate",
        paragraphs: [
          "Some detailed legacy articles are still being reconciled against provenance, duplication and claim-evidence records. Where that work is incomplete, the route remains accessible for navigation continuity but the public article body is withheld until review is finished.",
        ],
      },
    ],
  }),
  createContent({
    id: "content-book",
    routeId: "route-book",
    routePath: "/book",
    kind: "conversion",
    title: "Book a Discovery Call | Silverstone AI",
    description:
      "Book a 30-minute discovery call to discuss a website, app, content or AI workflow problem with Silverstone.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/book",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    h1: "Book a discovery call",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes:
      "Calendly and contact integrations remain inactive in the transformation workspace.",
    interactions: [bookInteraction],
    sections: [
      {
        paragraphs: [
          "Bring one process, customer journey or digital problem you want to improve. The first call is used to clarify the current situation, the people and systems involved, and whether there is a sensible next step.",
        ],
      },
      {
        heading: "What to expect",
        list: {
          items: [
            "No obligation to proceed",
            "No technical preparation required",
            "A clear fit or no-fit answer",
            "Sensitive operational detail can stay high level on the first call",
          ],
        },
      },
      {
        heading: "Fallback",
        paragraphs: [
          linkParagraph(
            "Prefer email instead? Send an enquiry and describe what is happening today.",
            [{ href: "/contact", text: "Send an enquiry" }],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-contact",
    routeId: "route-contact",
    routePath: "/contact",
    kind: "conversion",
    title: "Contact Silverstone AI | London and UK",
    description:
      "Contact Silverstone to discuss web design, app development, content, AI reception, voice agents or workflow automation.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/contact",
    schemaTypes: ["ContactPage", "Organization", "BreadcrumbList"],
    h1: "Contact Silverstone",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes: "Contact submission remains inactive in the transformation workspace.",
    interactions: [contactInteraction],
    sections: [
      {
        paragraphs: [
          "Tell us what is happening today, what you want to improve and the best way to reply. Do not include passwords, payment data or sensitive personal information.",
        ],
      },
      {
        heading: "Useful context",
        list: {
          items: [
            "The service or workflow you are considering",
            "The systems already involved",
            "Any timing or approval constraints",
            "Whether a discovery call would be the better next step",
          ],
        },
      },
      {
        heading: "Alternative route",
        paragraphs: [
          linkParagraph(
            "If the request is exploratory rather than urgent, you can also book a discovery call directly.",
            [{ href: "/book", text: "book a discovery call" }],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-industries",
    routeId: "route-industries",
    routePath: "/industries",
    kind: "core",
    title: "Industries We Support | Silverstone AI",
    description:
      "Explore practical website, app and AI workflow ideas for nine UK business sectors, with industry-specific use cases and safeguards.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/industries",
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
    h1: "AI automation built for how your industry actually works",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes: defaultRiskNote,
    sections: [
      {
        paragraphs: [
          "Industry pages do not promise a standard package. They explain the workflow pressures, sector language and safeguard questions most likely to matter before scoping begins.",
        ],
      },
      {
        heading: "Browse by sector",
        list: {
          items: [
            linkParagraph("Estate Agents", [
              { href: "/services/estate-agents", text: "Estate Agents" },
            ]),
            linkParagraph("Hospitality", [
              { href: "/services/hospitality", text: "Hospitality" },
            ]),
            linkParagraph("Salons & Barbers", [
              { href: "/services/salons-barbers", text: "Salons & Barbers" },
            ]),
            linkParagraph("Trades & Home Services", [
              { href: "/services/trades", text: "Trades & Home Services" },
            ]),
            linkParagraph("eCommerce Brands", [
              { href: "/services/ecommerce", text: "eCommerce Brands" },
            ]),
            linkParagraph("Physio & Chiropractic Clinics", [
              {
                href: "/services/physios-chiropractors",
                text: "Physio & Chiropractic Clinics",
              },
            ]),
            linkParagraph("Dental Practices", [
              { href: "/services/dentists", text: "Dental Practices" },
            ]),
            linkParagraph("Gyms & Fitness Studios", [
              {
                href: "/services/gyms-fitness-studios",
                text: "Gyms & Fitness Studios",
              },
            ]),
            linkParagraph("Fitness Coaches", [
              { href: "/services/fitness-coaches", text: "Fitness Coaches" },
            ]),
          ],
        },
      },
      {
        heading: "How to use the industry pages",
        paragraphs: [
          linkParagraph(
            "Start with your sector page if you want to see example workflows and not-fit boundaries first. Move to the service pages when you want the capability, deliverables and cross-industry scope.",
            [{ href: "/services", text: "service pages" }],
          ),
        ],
      },
    ],
  }),
  createContent({
    id: "content-how-we-work",
    routeId: "route-how-we-work",
    routePath: "/how-we-work",
    kind: "core",
    title: "How Silverstone Works | Discovery to Delivery",
    description:
      "See how Silverstone defines, designs, builds and reviews websites, apps and AI workflows for UK businesses.",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourceRouteKey: "approved:/how-we-work",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    h1: "A clear route from problem to working system",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    riskNotes:
      "Assurance wording is draft-safe. Contractual remedies and formal assurance terms remain legal-review items before production publication.",
    sections: [
      {
        heading: "Discovery and qualification",
        paragraphs: [
          "No large build starts with a vague promise. It starts with a named problem, the current workflow, the systems involved and the people who approve exceptions.",
        ],
      },
      {
        heading: "Current-state map and scope",
        paragraphs: [
          "A useful scope identifies the first outcome, the boundaries, the data sources, the handoffs, the risks and the acceptance criteria. Out-of-scope work stays out of scope until change control says otherwise.",
        ],
      },
      {
        heading: "Milestones and review",
        list: {
          ordered: true,
          items: [
            "Discovery and requirements",
            "Information architecture, workflow or system design",
            "Implementation and tested first release",
            "Handover, monitoring and the next decision point",
          ],
        },
      },
      {
        heading: "Silverstone Delivery Assurance",
        paragraphs: [
          "Public assurance is limited to the parts of delivery Silverstone can reasonably control: written scope, milestone approvals, defined revision rounds, covered defect correction and accountable change control.",
          "Commercial outcomes, media spend, third-party platforms and external market conditions are not guaranteed. Full assurance terms remain a draft subject to legal review.",
        ],
      },
      {
        heading: "Next step",
        paragraphs: [
          linkParagraph(
            "If that delivery model fits the way you want to buy, book a discovery call.",
            [{ href: "/book", text: "book a discovery call" }],
          ),
        ],
      },
    ],
  }),
  ...[
    {
      id: "content-services-estate-agents",
      routeId: "route-services-estate-agents",
      routePath: "/services/estate-agents",
      title: "Digital and AI Services for Estate Agents | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK estate agents, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for estate agents",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-estate-agents-copy-v1.md",
      sourceRouteKey: "approved:/services/estate-agents",
      cta: "Discuss your enquiry and viewing workflow",
      friction: [
        "Enquiries arrive while negotiators are in viewings",
        "Buyer, seller, landlord and tenant leads need different questions",
        "Viewing confirmations and feedback are easy to chase inconsistently",
        "Information is copied between inboxes, calendars and the CRM",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-voice-agents", text: "AI Voice Agents" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/web-design-development", text: "Web Design & Development" },
      ],
      example:
        "A valuation request is captured, the owner’s property and timing are recorded, the lead is routed to the right branch, a viewing or callback is requested, and the negotiator receives a structured summary. Complaints, safeguarding issues and unusual cases go directly to a person.",
      qualification:
        "Best suited to an agency with repeat enquiry volume, an agreed CRM or diary owner, and a manager willing to define qualification and escalation rules.",
      safeguard:
        "Do not automate final suitability decisions, financial advice, complaint resolution or any communication that requires professional judgement.",
      insights: [
        {
          href: "/blog/ai-lead-qualification-estate-agents-2026",
          text: "AI lead qualification for estate agents",
        },
        {
          href: "/blog/ai-viewing-feedback-estate-agents-uk",
          text: "AI viewing feedback for estate agents",
        },
        {
          href: "/blog/estate-agent-viewing-confirmations-uk",
          text: "Viewing confirmations for estate agents",
        },
      ],
    },
    {
      id: "content-services-hospitality",
      routeId: "route-services-hospitality",
      routePath: "/services/hospitality",
      title: "Digital and AI Services for Hospitality | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK hospitality, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for hospitality",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-hospitality-copy-v1.md",
      sourceRouteKey: "approved:/services/hospitality",
      cta: "Discuss your guest enquiry journey",
      friction: [
        "Calls and messages peak when the team is busiest",
        "Guests repeat the same access, menu, timing or policy questions",
        "Booking changes need accurate handoff to the right system",
        "A poor automated answer can damage trust quickly",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-voice-agents", text: "AI Voice Agents" },
        { href: "/services/web-design-development", text: "Web Design & Development" },
        { href: "/services/content-creation", text: "Content Creation & Repurposing" },
      ],
      example:
        "A guest asks about availability or a practical detail, receives an answer from approved information, is directed to the booking route, and has any exception passed to the relevant team with the conversation summary attached.",
      qualification:
        "Best suited to a venue with documented guest information, a clear booking source of truth and named staff responsible for exceptions.",
      safeguard:
        "Do not imply live availability unless the system is connected and tested. Allergy, accessibility, complaint and emergency questions require carefully defined escalation.",
      insights: [
        {
          href: "/blog/ai-booking-automation-uk-hospitality-2026",
          text: "Booking automation for hospitality",
        },
        {
          href: "/blog/ai-guest-concierge-hotels-bbs-uk",
          text: "Guest concierge workflows",
        },
      ],
    },
    {
      id: "content-services-salons-barbers",
      routeId: "route-services-salons-barbers",
      routePath: "/services/salons-barbers",
      title: "Digital and AI Services for Salons & Barbers | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK salons & barbers, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for salons & barbers",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-salons-barbers-copy-v1.md",
      sourceRouteKey: "approved:/services/salons-barbers",
      cta: "Discuss your booking and rebooking flow",
      friction: [
        "Calls and direct messages interrupt treatments",
        "Cancellations create gaps that are hard to refill",
        "Rebooking depends on staff remembering to follow up",
        "Service duration, practitioner and deposit rules vary",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/web-design-development", text: "Web Design & Development" },
        { href: "/services/content-creation", text: "Content Creation & Repurposing" },
      ],
      example:
        "A client asks for a service, the system collects the minimum booking details, directs them to the correct availability, sends approved confirmation or reminder messages, and returns complex suitability questions to a practitioner.",
      qualification:
        "Best suited to a salon with a stable booking platform, clear service rules and consent-aware follow-up lists.",
      safeguard:
        "Do not make treatment suitability, health or outcome claims through an automated flow. Keep deposits, cancellations and promotional messages aligned with approved terms.",
      insights: [
        {
          href: "/blog/ai-no-show-reduction-uk-salons-barbers",
          text: "No-show reduction for salons & barbers",
        },
        {
          href: "/blog/ai-rebooking-journeys-salons-uk",
          text: "Rebooking journeys for salons",
        },
      ],
    },
    {
      id: "content-services-trades",
      routeId: "route-services-trades",
      routePath: "/services/trades",
      title: "Digital and AI Services for Trades & Home Services | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK trades & home services, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for trades & home services",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-trades-copy-v1.md",
      sourceRouteKey: "approved:/services/trades",
      cta: "Discuss your call and quote workflow",
      friction: [
        "Urgent and routine calls arrive through the same number",
        "Job details are incomplete when a callback is logged",
        "Quotes go cold because follow-up is inconsistent",
        "Scheduling changes create repeated customer updates",
      ],
      relatedServices: [
        { href: "/services/ai-voice-agents", text: "AI Voice Agents" },
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/web-design-development", text: "Web Design & Development" },
      ],
      example:
        "A caller describes the job, location and urgency; the flow applies the business’s approved triage rules, records photos or details through a follow-up link, requests a slot or callback, and alerts a person immediately where the rules require it.",
      qualification:
        "Best suited to a firm with a defined service area, job types, emergency boundaries and a person accountable for dispatch or quoting.",
      safeguard:
        "The system must not promise attendance, price or safety outcomes unless those actions are confirmed by the scheduling and quoting systems.",
      insights: [
        {
          href: "/blog/ai-call-answering-trades-uk",
          text: "AI call answering for trades",
        },
        {
          href: "/blog/ai-etas-smart-scheduling-uk-trades-2026",
          text: "ETA and scheduling for trades",
        },
        {
          href: "/blog/ai-lead-capture-uk-trades-2026",
          text: "Lead capture for trades",
        },
      ],
    },
    {
      id: "content-services-ecommerce",
      routeId: "route-services-ecommerce",
      routePath: "/services/ecommerce",
      title: "Digital and AI Services for eCommerce Brands | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK ecommerce brands, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for ecommerce brands",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-ecommerce-copy-v1.md",
      sourceRouteKey: "approved:/services/ecommerce",
      cta: "Discuss your support and post-purchase workflow",
      friction: [
        "Support teams repeatedly collect order details",
        "Return questions mix simple policy queries with genuine exceptions",
        "Post-purchase messages are disconnected from customer status",
        "Content and product information drift across channels",
      ],
      relatedServices: [
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/app-development", text: "Custom App Development" },
        { href: "/services/content-creation", text: "Content Creation & Repurposing" },
      ],
      example:
        "A customer provides an order reference and request type, the workflow checks approved data, presents the correct next step, creates or updates the helpdesk record, and sends policy exceptions or vulnerable-customer issues to a person.",
      qualification:
        "Best suited to a brand with documented policies, reliable order data and enough repeated support volume to justify integration.",
      safeguard:
        "Do not issue discretionary refunds, make delivery promises or present stock status unless the connected source is authoritative and tested.",
      insights: [
        {
          href: "/blog/ai-returns-triage-ecommerce-uk",
          text: "Returns triage for ecommerce",
        },
        {
          href: "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
          text: "Post-purchase automation for ecommerce",
        },
      ],
    },
    {
      id: "content-services-physios-chiropractors",
      routeId: "route-services-physios-chiropractors",
      routePath: "/services/physios-chiropractors",
      title: "Digital Services for Physio & Chiropractic Clinics | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK physio & chiropractic clinics, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for physio & chiropractic clinics",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-physios-chiropractors-copy-v1.md",
      sourceRouteKey: "approved:/services/physios-chiropractors",
      cta: "Discuss your non-clinical patient journey",
      friction: [
        "Reception is busy when patients call",
        "Incomplete intake creates avoidable follow-up",
        "Rebooking can be delayed after an appointment",
        "Health information needs stricter access and escalation",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/app-development", text: "Custom App Development" },
        { href: "/services/web-design-development", text: "Web Design & Development" },
      ],
      example:
        "A prospective patient provides contact details, preferred clinic and a high-level reason for enquiry, receives the approved booking route and preparation information, and is escalated immediately when the question is clinical, urgent or outside scope.",
      qualification:
        "Best suited to a clinic with written intake boundaries, a booking-system owner, privacy review and clinicians who define what automation must not answer.",
      safeguard:
        "Automation must remain non-clinical. It should not diagnose, triage emergencies, recommend treatment or replace informed professional judgement.",
      insights: [
        {
          href: "/blog/ai-automations-physio-chiro-clinics-uk",
          text: "Automation for physio & chiro clinics",
        },
        {
          href: "/blog/clinic-rebooking-physio-chiro-uk",
          text: "Clinic rebooking for physio & chiro",
        },
        {
          href: "/blog/ai-appointment-reminders-uk-2026",
          text: "Appointment reminders for UK businesses",
        },
      ],
    },
    {
      id: "content-services-dentists",
      routeId: "route-services-dentists",
      routePath: "/services/dentists",
      title: "Digital and AI Services for Dental Practices | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK dental practices, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for dental practices",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-dentists-copy-v1.md",
      sourceRouteKey: "approved:/services/dentists",
      cta: "Discuss your practice enquiry workflow",
      friction: [
        "High-value enquiries can arrive when reception is occupied",
        "Recall and rebooking lists require consistent ownership",
        "Forms and practical information are chased manually",
        "Clinical questions must be separated from administrative ones",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-voice-agents", text: "AI Voice Agents" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/app-development", text: "Custom App Development" },
      ],
      example:
        "A caller selects a new-patient, existing-patient or practical enquiry path; approved details are captured; a booking request or message is created; and pain, urgent symptoms, complaints or clinical questions are escalated under the practice’s policy.",
      qualification:
        "Best suited to a practice with documented call handling, recall ownership, data-access controls and clinical escalation instructions.",
      safeguard:
        "Do not offer diagnosis, clinical urgency decisions, treatment promises or consent advice. Practice leadership and appropriate professional review remain essential.",
      insights: [
        {
          href: "/blog/ai-missed-call-recovery-dentists-uk",
          text: "Missed call recovery for dentists",
        },
        {
          href: "/blog/dental-intake-e-consent-automation-uk",
          text: "Dental intake and e-consent automation",
        },
        {
          href: "/blog/dental-recall-automation-uk-2026",
          text: "Dental recall automation",
        },
      ],
    },
    {
      id: "content-services-gyms-fitness-studios",
      routeId: "route-services-gyms-fitness-studios",
      routePath: "/services/gyms-fitness-studios",
      title: "Digital and AI Services for Gyms & Fitness Studios | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK gyms & fitness studios, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for gyms & fitness studios",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-gyms-fitness-studios-copy-v1.md",
      sourceRouteKey: "approved:/services/gyms-fitness-studios",
      cta: "Discuss your trial and member journey",
      friction: [
        "Trial enquiries arrive through several channels",
        "Waitlists and cancellations need prompt updates",
        "Inactive members are difficult to segment consistently",
        "Generic promotions can feel impersonal",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/content-creation", text: "Content Creation & Repurposing" },
        { href: "/services/app-development", text: "Custom App Development" },
      ],
      example:
        "A trial lead chooses a location or class type, receives the correct booking path, has consent and preferences recorded, and enters an approved follow-up sequence. Membership disputes, injuries and sensitive issues return to staff.",
      qualification:
        "Best suited to an operator with clean membership data, a defined trial journey and an owner for consent and suppression rules.",
      safeguard:
        "Do not give exercise, injury or health advice through general automation. Avoid unverified transformation claims and pressure-based messaging.",
      insights: [
        {
          href: "/blog/ai-win-back-journeys-gyms-uk",
          text: "Win-back journeys for gyms",
        },
        {
          href: "/blog/gym-booking-automation-uk-gyms-studios-2026",
          text: "Booking automation for gyms & studios",
        },
      ],
    },
    {
      id: "content-services-fitness-coaches",
      routeId: "route-services-fitness-coaches",
      routePath: "/services/fitness-coaches",
      title: "Digital and AI Services for Fitness Coaches | Silverstone AI",
      description:
        "Practical websites, apps and AI workflows for UK fitness coaches, designed around real enquiries, admin and human handoffs.",
      h1: "Practical digital workflows for fitness coaches",
      sourceFile:
        "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-fitness-coaches-copy-v1.md",
      sourceRouteKey: "approved:/services/fitness-coaches",
      cta: "Discuss your lead-to-consultation flow",
      friction: [
        "Low-context messages take time to qualify",
        "Good-fit leads wait for a reply",
        "Consultation booking and reminders are disconnected",
        "Content production competes with client delivery",
      ],
      relatedServices: [
        { href: "/services/ai-receptionists", text: "AI Receptionists" },
        { href: "/services/ai-automation", text: "AI Automation & Agent Workflows" },
        { href: "/services/content-creation", text: "Content Creation & Repurposing" },
        { href: "/services/web-design-development", text: "Web Design & Development" },
      ],
      example:
        "A lead answers a short set of fit and readiness questions, receives the appropriate consultation or resource path, and is handed to the coach with a concise summary. Health disclosures and unsuitable requests are not assessed automatically.",
      qualification:
        "Best suited to a coach with a clear offer, eligibility boundaries, calendar capacity and a defined handoff from qualification to sales conversation.",
      safeguard:
        "Do not automate health assessment, promise physical outcomes or use manipulative body-image claims. Keep qualification transparent and easy to leave.",
      insights: [
        {
          href: "/blog/ai-lead-scoring-fitness-coaches-uk",
          text: "Lead scoring for fitness coaches",
        },
        {
          href: "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
          text: "DM-to-client automation for fitness coaches",
        },
      ],
    },
  ].map((industry) =>
    createContent({
      ...industry,
      kind: "industry",
      schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
      contentStatus: "approved-editorial-overlay",
      claimsStatus: "safe-copy-human-review-pending",
      riskNotes:
        "Approved industry-page overlay. Clinical, financial, complaint, safeguarding and contractual edge cases remain subject to operator-specific review before production publication.",
      sections: [
        {
          heading: "Where friction tends to appear",
          list: {
            items: industry.friction,
          },
        },
        {
          heading: "Relevant service combinations",
          list: {
            items: industry.relatedServices.map((link) =>
              linkParagraph(link.text, [link]),
            ),
          },
        },
        {
          heading: "Illustrative workflow",
          paragraphs: [
            `${industry.example} This is an example workflow only. It is not a client case study, measured result or contractual promise.`,
          ],
        },
        {
          heading: "What to define before build",
          list: {
            items: [
              "The source of truth for availability, customer status and records",
              "The minimum information needed at the first step",
              "Which actions can happen automatically",
              "Which questions or events require a person",
              "Who owns failed or incomplete handoffs",
              "How consent, retention and access will be managed",
              "What evidence will show whether the first release is useful",
            ],
          },
        },
        {
          heading: "Qualification and safeguard",
          paragraphs: [industry.qualification, industry.safeguard],
        },
        {
          heading: "Related insights",
          list: {
            items: industry.insights.map((link) => linkParagraph(link.text, [link])),
          },
        },
        {
          heading: "Proof and review gate",
          paragraphs: [
            "Any future case study, testimonial, client logo, measured outcome or named platform claim requires evidence, permission and human approval before publication.",
            linkParagraph(
              `${industry.cta} when you want to scope one workflow first.`,
              [{ href: "/book", text: industry.cta }],
            ),
          ],
        },
      ],
    }),
  ),
];

export const approvedContentById = Object.fromEntries(
  approvedContent.map((content) => [content.id, content]),
) as Record<string, MigratedContentRecord>;

export const approvedContentIndex: MigratedContentIndexRecord[] = approvedContent.map(
  (content) => ({
    contentId: content.id,
    routeId: content.routeId,
    routePath: content.routePath,
    kind: content.kind,
    sourceFile: content.source.file,
    sourceSha256: content.source.sha256,
    modulePath: `approved:${content.id}`,
  }),
);
