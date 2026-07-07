import type { InsightArticle } from "~/features/core-pages/insights-data";

export type SilverstoneBlogLink = {
  href: string;
  label: string;
};

export type SilverstoneBlogFaq = {
  answer: string;
  question: string;
};

export type SilverstoneBlogSection = {
  body: string[];
  heading: string;
  subsections?: SilverstoneBlogSection[];
};

export type SilverstoneBlogSource = {
  date?: string;
  relevance?: string;
  summary?: string;
  title: string;
  url: string;
};

export type SilverstoneBlogPost = {
  articleBody: SilverstoneBlogSection[];
  categoryId: string;
  categoryKey: string;
  categoryLabel: string;
  categoryOrder: number;
  ctaPrimary: SilverstoneBlogLink;
  ctaSecondary: SilverstoneBlogLink;
  displayDate: string;
  faqs: SilverstoneBlogFaq[];
  heroImage: string;
  heroImageAlt: string;
  imagePrompt: string;
  internalLinks: SilverstoneBlogLink[];
  metaDescription: string;
  metaTitle: string;
  primaryKeyword: string;
  publishedIsoDate: string;
  readTime: string;
  researchSources: SilverstoneBlogSource[];
  secondaryKeywords: string[];
  slug: string;
  status: "draft" | "published";
  subtitle: string;
  summary: string[];
  title: string;
  updatedIsoDate: string;
};

export const BLOG_POSTS: SilverstoneBlogPost[] = [
  // N8N_BLOG_POSTS_START
  {
    "slug": "how-to-plan-a-conversion-focused-website-build-for-a-uk-small-business",
    "title": "How to Plan a Conversion-Focused Website Build for a UK Small Business",
    "subtitle": "A practical guide to structuring pages, platforms, content and handoffs so your website works as part of the business, not apart from it.",
    "summary": [
      "A polished website can still underperform if service structure, user journeys and enquiry handoffs are unclear.",
      "Better website planning starts with service architecture, page ownership and operational requirements before platform selection.",
      "Technical SEO, migration, accessibility and mobile UX should be treated as commercial build decisions, not late-stage extras."
    ],
    "categoryLabel": "Web Design & Development",
    "categoryKey": "web-design-development",
    "categoryId": "web-design-development",
    "categoryOrder": 1,
    "displayDate": "7 July 2026",
    "publishedIsoDate": "2026-07-07T16:15:32.460Z",
    "updatedIsoDate": "2026-07-07T16:15:32.460Z",
    "readTime": "6 min read",
    "status": "published",
    "heroImage": "/assets/images/blog/how-to-plan-a-conversion-focused-website-build-for-a-uk-small-business-hero.webp",
    "heroImageAlt": "Illustrative premium website design and development operating surface with layered responsive pages, CMS modules, analytics and CRM handoff for a UK small business",
    "metaTitle": "Conversion-Focused Web Design for UK Small Businesses",
    "metaDescription": "Learn how to plan a conversion-focused website build for a UK small business, from service structure and platform choice to SEO, migration and enquiry handoff.",
    "primaryKeyword": "conversion-focused web design UK",
    "secondaryKeywords": [
      "web design and development agency UK",
      "bespoke website development UK",
      "website redesign checklist UK",
      "technical SEO web design",
      "small business website development UK"
    ],
    "articleBody": [
      {
        "heading": "Introduction",
        "body": [
          "A website can look polished, load quickly and still underperform commercially. For many UK small businesses, the issue is not simply design quality. It is the gap between what the site shows, how services are structured, what visitors need in order to act, and where enquiries go next. A conversion-focused website build starts earlier than visual design. It begins with service clarity, page ownership, decision paths, technical foundations and the operational handoff after someone presses submit."
        ]
      },
      {
        "heading": "Why attractive websites still fail to convert qualified buyers",
        "body": [
          "Silverstone AI approaches web design and development as a commercial system, not a gallery exercise. A site can be visually impressive and still create uncertainty: unclear service descriptions, weak next actions, duplicated topics, slow mobile journeys, or forms that disappear into an inbox with no proper routing.",
          "Qualified buyers usually arrive with a specific question. They may want to know whether you serve their sector, whether a service fits their problem, how to take the next step, and whether your business appears organised enough to trust. If the page architecture does not answer those questions in sequence, design alone will not rescue the enquiry path.",
          "This is especially relevant in the UK small-business market, where websites often need to support mixed acquisition channels at once: branded search, local discovery, referrals, email traffic, social traffic and repeat visits from buyers comparing several providers. In that context, the website should reduce ambiguity rather than add visual noise."
        ]
      },
      {
        "heading": "Start with service architecture before platform choice",
        "body": [
          "One common mistake is choosing a platform too early. The better order is strategy first, structure second, platform third. Before comparing WordPress, Webflow, React or a static build, define what the website needs to own commercially.",
          "That usually means identifying core services, adjacent services, sector relevance, proof requirements, conversion routes and content responsibilities. If three pages all attempt to rank for the same service theme, or if one service is split across several weak pages, demand can be diluted. Visitors feel it as confusion; search engines may read it as overlap.",
          "For a UK service business, a practical discovery brief should cover: your service list, who each service is for, what questions buyers ask before enquiring, which pages should own each topic, what proof can be shown, what should happen after a form completion, and who in the business will maintain content after launch.",
          "Only then does platform choice become sensible. A CMS should make routine publishing, page updates and modular edits straightforward. It should not make governance loose. The wrong setup often gives teams too much freedom in the wrong places and too little flexibility where regular updates are actually needed."
        ]
      },
      {
        "heading": "A practical framework for choosing the right build approach",
        "body": [
          "Bespoke website development is not automatically the right answer, and neither is a template-led build. The decision should follow complexity, operational needs and the level of control required.",
          "A simpler brochure-style service site with stable content may suit a streamlined CMS setup. A business with multiple service lines, booking rules, CRM handoffs, gated resources or custom interactive tools may need a more tailored approach. The question is not which option sounds more advanced. It is which one matches the operating model with the least friction.",
          "For non-technical buyers, four decision factors usually matter most: content governance, integration needs, performance expectations and future change. If your business needs frequent service-page updates, campaign landing pages and editorial control, the CMS experience matters. If the site must connect tightly to calendars, lead routing or internal systems, integration design matters more than surface aesthetics.",
          "The same principle applies to technology selection. React may be suitable where component control or app-like behaviour is important. WordPress can be effective where editorial flexibility is central. Webflow can suit teams wanting a controlled visual CMS environment. Static approaches can be strong where speed, simplicity and low maintenance are the priority. The right answer depends on ownership, not fashion."
        ]
      },
      {
        "heading": "How to audit the path from landing page to qualified enquiry",
        "body": [
          "A useful website audit follows the journey step by step. Start with the entry page. Is the visitor’s likely intent obvious? Can they tell what service is being offered, who it is for, and what to do next without scrolling through decorative filler?",
          "Then review page composition. Strong service pages usually move through a clear order: the problem or need, the offer, the fit, the process, the evidence available, common objections, and the next action. That next action may be a booking, a contact form, a scoped enquiry, or a request for a conversation. The right choice depends on how your sales process works.",
          "After that, inspect handoff points. A form should not be an isolated endpoint. It should route into the right system, whether that is a CRM, inbox, calendar workflow or follow-up sequence. If a prospect books, the business should know which source they came from, what page drove the action and what happens next operationally. That is why the website should be treated as an operating surface rather than a static brochure.",
          "Measurement matters here as well. For booking journeys, useful events often include page entry, CTA clicks, form starts, form completions, booking initiations and confirmed bookings. Analytics will not explain everything, but they can show where friction appears. External context such as common conversion-tracking practice is useful as a benchmark, but it should not be confused with a promise of performance."
        ]
      },
      {
        "heading": "Technical quality, migration and accessibility are commercial decisions",
        "body": [
          "A web-design proposal should include more than layout and page count. Technical SEO foundations, migration handling, responsive behaviour, accessibility considerations and quality assurance all affect commercial performance. They are not optional extras to be revisited at the end.",
          "If an existing site has useful URLs, they should be reviewed before redesign work begins. A migration that drops valuable pages, changes slugs carelessly or ignores redirects can erase useful search equity and create a poor user experience for returning visitors. A careful migration preserves what still serves the business while removing duplication and dead weight deliberately.",
          "Core Web Vitals are best understood as user-experience signals rather than a magical ranking switch. For owners, the practical question is simpler: does the site load and respond in a way that supports trust, especially on mobile connections common across the UK? Equally, accessibility should be treated as a quality standard. Clear contrast, sensible semantics, keyboard support and readable interactions tend to improve usability for everyone, not just satisfy a checklist.",
          "Mobile design deserves its own discipline. Reducing friction on smaller screens should not mean flattening the entire experience. The aim is to preserve clarity and action while adapting content hierarchy, spacing, navigation and form design to real mobile behaviour."
        ]
      },
      {
        "heading": "What to ask before signing with a UK web design and development agency",
        "body": [
          "A sensible proposal review is less about polished language and more about operational detail. Ask how discovery is handled before design starts. Ask how page ownership is defined across services, industries and insights. Ask what happens to existing URLs, how redirects are planned, what content responsibilities sit with your team, and how the post-enquiry handoff is designed.",
          "You should also ask how the agency thinks about CMS permissions, tracking, accessibility, mobile QA and integration boundaries. If booking, forms or follow-up matter commercially, that should be visible in the scope rather than implied later.",
          "For many small businesses, the more useful next step is not an immediate redesign but a structured review of the current sales path. That can clarify whether the issue is visual, architectural, technical or operational. If you want to understand how Silverstone AI approaches planning, delivery and ownership, see <a href=\"/how-we-work\">how we work</a>. If your website also needs enquiry routing or follow-up logic, <a href=\"/services/ai-automation\">AI automation</a> may be relevant. And if you want to discuss a new build or redesign in context, you can <a href=\"/book#booking-calendar\">book a call</a>."
        ]
      }
    ],
    "faqs": [
      {
        "question": "What is the difference between web design and web development?",
        "answer": "Web design covers structure, user experience, interface decisions and visual communication. Web development covers the technical build, templates, components, CMS setup, integrations, performance and deployment implementation. In practice, the two should be planned together."
      },
      {
        "question": "Should a small business choose a bespoke website or a template?",
        "answer": "It depends on complexity, control requirements and future change. A template-led approach may suit a simpler site with limited custom behaviour. A bespoke build may be more suitable where service architecture, integrations, workflows or content governance require tighter control."
      },
      {
        "question": "Can a redesign improve SEO without losing existing visibility?",
        "answer": "It can support stronger structure and better technical quality, but only if migration is handled carefully. Useful URLs, redirects, internal linking, metadata and page ownership should be reviewed before launch to avoid unnecessary losses."
      }
    ],
    "internalLinks": [
      {
        "label": "how we work",
        "href": "/how-we-work"
      },
      {
        "label": "AI automation",
        "href": "/services/ai-automation"
      },
      {
        "label": "book a call",
        "href": "/book#booking-calendar"
      }
    ],
    "researchSources": [
      {
        "title": "Small Business Website Design Services UK (2026) | Dot it Media",
        "url": "https://dotitmedia.co.uk/small-business-website-design",
        "date": "",
        "summary": "## Trusted by 40+ Small Business in the UK. ## What is Small Business Website Design? Small business website design is the process of planning, designing, and building a professional website specifically for a small business — built around your goals, your customers, and your budget. A properly designed small business website combines strategy, SEO structure",
        "relevance": "Current UK business context for Web Design & Development"
      },
      {
        "title": "Top Web App Development Companies in the UK: 2026 Guide",
        "url": "https://luminarybrands.co.uk/blog/web-app-development-companies-uk",
        "date": "",
        "summary": "# Top Web App Development Agencies in the UK for 2026. Web App Development Companies UK. This guide reviews the best web app development companies in the UK based on important selection factors: technical expertise, industry experience, scalability, communication, and product support. The top web development companies in the UK below were selected based on t",
        "relevance": "Current UK business context for Web Design & Development"
      },
      {
        "title": "Website Design Services UK: The Essential Guide for 2026 | Article",
        "url": "https://futurmedia.co.uk/blog/website-design-services-uk",
        "date": "",
        "summary": "This guide is crafted to give you a comprehensive, up-to-date overview of website design services UK for 2026. Inside, you will discover the",
        "relevance": "Current UK business context for Web Design & Development"
      },
      {
        "title": "Top 7 Web Development Agencies in 2026 for UK Businesses",
        "url": "https://www.bigeyedeers.co.uk/top-web-development-agencies-7",
        "date": "",
        "summary": "# Top 7 Web Development Agencies in 2026 for UK Businesses. Choosing a web development agency can feel like searching for a needle in a haystack. Big Eye Deers is our clear winner for UK retail teams seeking a single partner to design, build, and support ambitious eCommerce platforms. The agency combines a **senior team** with deep platform expertise and a f",
        "relevance": "Current UK business context for Web Design & Development"
      },
      {
        "title": "The 7 Best Web Design Agency UK Picks for 2026",
        "url": "https://grumspot.com/blog/best-web-design-agency-uk",
        "date": "",
        "summary": "BlogThe 7 Best Web Design Agency UK Picks for 2026. # The 7 Best Web Design Agency UK Picks for 2026. * best web design agency uk. Choosing a web design agency in the UK usually starts the same way. One team looks more creative, another sounds more technical, and a third promises end-to-end delivery, but it's still hard to tell who will indeed ship the right",
        "relevance": "Current UK business context for Web Design & Development"
      }
    ],
    "imagePrompt": "Create one premium 16:9 editorial hero image for Silverstone AI in the same visual campaign as /approved-images/general-services-1.png and its mobile pair. Scene: a sophisticated browser and publishing-system operating surface for web design and development, showing a conversion-focused service website as an operational system rather than a brochure. Main surface: a refined desktop website architecture with clear content blocks, service-page hierarchy and one visible enquiry path. Supporting layers: responsive mobile state, CMS module panels, analytics signals, and a clean CRM or booking handoff panel inspired by an illustrative reception and enquiry-capture console. Show one controlled movement from landing page to enquiry capture to routed follow-up, plus one subtle human approval or exception point. Use deep ink, graphite and dark navy materials with platinum content areas, restrained blue-cyan and teal accents, and minimal amber only for priority/handoff. Keep generous negative space for real HTML title overlay. No readable text, no logos, no fake metrics, no stock-photo people, no generic AI tropes, no full browser mock frame. The image should feel precise, commercial, quietly futuristic and clearly relevant to UK small-business website planning.",
    "ctaPrimary": {
      "label": "Book a discovery call",
      "href": "/book#booking-calendar"
    },
    "ctaSecondary": {
      "label": "Back to insights",
      "href": "/blog"
    }
  },
  // N8N_BLOG_POSTS_END
];

export const PUBLISHED_BLOG_POSTS = BLOG_POSTS.filter(
  (post) => post.status === "published",
);

export function getBlogPostBySlug(slug: string | undefined) {
  if (!slug) {
    return undefined;
  }

  return PUBLISHED_BLOG_POSTS.find((post) => post.slug === slug);
}

export const BLOG_CARD_ARTICLES: InsightArticle[] = PUBLISHED_BLOG_POSTS.map(
  (post) => ({
    id: post.slug,
    categoryId: post.categoryId,
    href: `/blog/${post.slug}`,
    imageAlt: post.heroImageAlt,
    imageSrc: post.heroImage,
    publishedDate: post.displayDate,
    status: "published",
    summary: post.summary,
    title: post.title,
  }),
);
