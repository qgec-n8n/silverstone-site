/**
 * Concise, conversion-focused service copy (US English, for readers in the US and the UK).
 *
 * This is the rewritten public voice for services-v2: shorter, scannable and
 * persuasive, organized around a clear commercial argument rather than the long
 * approved narrative. Benchmark *values* are still sourced from the verified
 * metrics data so exact figures/units are never altered here — this module owns
 * prose only.
 *
 * Structure covers: what Silverstone builds · the costly problem · the outcome ·
 * why Silverstone is different · what the client receives · how delivery works ·
 * verified results · the next step · a reason to act now.
 */
import type { ApprovedServiceRoute } from "~/content/services/approved-services";

import type { MobileHeroCopy } from "./mobile-hero";

export type ServicePoint = { title: string; body: string };

export type ServiceCopy = {
  eyebrow: string;
  /** Single, outcome-led H1 (kept aligned with route metadata for SEO). */
  h1: string;
  /** Optional short line under the H1; see SecondaryHero's `deck` prop. */
  deck?: string;
  heroSub: string;
  /** Three concise capability points shown in the secondary-hero opener. */
  heroPoints: string[];
  /** Phone-only hero copy; see `MobileHeroCopy`. */
  mobile?: MobileHeroCopy;
  problem: { heading: string; body: string; painPoints: string[] };
  outcome: { heading: string; body: string };
  capabilities: { heading: string; lead: string };
  differentiator: { heading: string; body: string };
  comparison?: { before: ServicePoint; after: ServicePoint };
  proof: { heading: string; lead: string; attribution: string; clarification: string };
  process: { heading: string; lead: string };
  faqs: { heading: string; items: { q: string; a: string }[] };
  midCta: { heading: string; body: string };
  finalCta: { heading: string; body: string; urgency: string };
};

const SILVERSTONE_ATTRIBUTION = "Verified Silverstone AI performance";
const SILVERSTONE_CLARIFICATION =
  "Results vary by scope, data quality, implementation and operating environment.";

export const webDesignCopy: ServiceCopy = {
  eyebrow: "Custom web design & development",
  h1: "Web design and development engineered to *move buyers forward*",
  heroSub:
    "Strategy, copy, design and engineering built as one commercial system — a custom site that turns qualified visitors into booked calls, not just compliments.",
  heroPoints: [
    "Scoped before we build — no guesswork",
    "From brief to launch in weeks, not quarters",
    "Wired into your CRM, calendar and follow-up",
  ],
  mobile: {
    tagline: "A site that turns visits into *booked calls*",
    points: ["Scoped before we build", "Launch in weeks", "Wired into your CRM"],
  },
  problem: {
    heading: "A site that doesn’t convert is an *expensive liability*",
    body: "Most sites look the part and still lose the sale. The positioning is vague, the navigation follows your org chart, forms vanish into an inbox, and mobile gets a squeezed desktop layout. Every unanswered question is a buyer who quietly leaves — a cost that never shows up on the invoice. The damage compounds quietly: a slow, script-heavy template drops phone visitors before the first paragraph lands; three service pages compete with each other for the same search; and nobody can say which page produced last month’s best inquiry, so the next redesign gets argued on taste. *A site you cannot measure can only be replaced, never improved.*",
    painPoints: [
      "Visitors can’t tell what you do — or why it should be you",
      "Inquiries stall because proof and trust arrive too late",
      "Leads land in an inbox with no owner and no follow-up",

      "Your strongest service page sits three clicks below a generic homepage",
      "US and UK visitors see the wrong currency, date format and contact route",
      "Your team can’t edit content safely, so the site ages between rebuilds",
    ],
  },
  outcome: {
    heading: "What changes when the system *works*",
    body: "A site that makes a complex offer obvious, earns trust early, and routes *every qualified inquiry straight into your calendar, CRM and follow-up*. Fewer dead ends, more booked calls, and a platform your team can extend without another rebuild. Each page owns one buyer question and one next action, so nothing competes with itself; the layout holds on a phone as strictly as on a desktop; and the conversion path is instrumented from launch, so the next change is chosen from behavior instead of opinion.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "A complete commercial website program — not a set of disconnected hand-offs. Positioning, page-level copy, design system, responsive engineering, accessibility, analytics and the integrations sitting behind your forms are scoped in one document, built by one team, and handed over with the files and the reasoning behind them.",
  },
  differentiator: {
    heading: "One studio, not *five suppliers*",
    body: "Silverstone AI combines strategy, copy, design, engineering, AI and automation under one roof. Nothing is lost in translation between agencies, because the website is *the visible edge of a working commercial system* — designed around the decision a qualified buyer needs to make. The same team wires the booking flow, the CRM hand-off and the follow-up, and, where it genuinely earns its place, the AI receptionist that answers the calls arriving after hours. Built in London, delivered for UK businesses and US companies alike.",
  },
  comparison: {
    before: {
      title: "Surface-led rebuild",
      body: "Starts with appearance. A template is chosen, copy is poured in afterward, SEO and integrations become later problems, and the launch date quietly replaces the commercial goal.",
    },
    after: {
      title: "Silverstone AI website system",
      body: "Starts with the buyer’s decision. Copy, design, engineering and the systems behind the forms are built together, and the build is judged on booked calls rather than compliments.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI delivery — evidence of what well-scoped systems have achieved.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "A disciplined route from commercial decision to launch and beyond. Discovery fixes the offer, the evidence and the page map before design starts. An MVP build goes up for your review at the halfway milestone. The final build lands the remaining pages, integrations and tracking. After launch, the first changes come from observed behavior rather than opinion.",
  },
  faqs: {
    heading: "Questions *serious buyers* ask",
    items: [
      {
        q: "Can you work with our existing brand?",
        a: "Yes. We can extend an established identity or refine where it’s holding you back. A full rebrand isn’t assumed.",
      },
      {
        q: "Is this only for large websites?",
        a: "No. A focused site with a sharp proposition often outperforms a sprawling one. Scope follows buyer needs, not page count.",
      },
      {
        q: "Can it connect to our current tools?",
        a: "Where suitable APIs, embeds or webhooks exist, we scope integrations into the build — with permissions, data ownership and fallbacks reviewed before anything goes live.",
      },
      {
        q: "Will we rank first on Google?",
        a: "No one can promise a ranking. We build a fast, people-first, technically sound foundation with a deliberate keyword-to-page structure; performance also depends on competition, authority and demand.",
      },
      {
        q: "Do you build websites for US businesses as well as UK ones?",
        a: "Yes. The studio is in London with US-based team members, and the site is built for the market it sells into: US or UK spelling, currency, time zones, address formats and the tools your team already runs, whether that is HubSpot, Calendly, Stripe or Shopify.",
      },
      {
        q: "Who maintains the site after launch?",
        a: "Routine content stays easy to edit while higher-risk changes stay controlled. Exact support and hand-over terms are set out in the proposal.",
      },

      {
        q: "How much does a custom website cost?",
        a: "Silverstone AI publishes its website bands rather than quoting on request. A 1–10 page Foundation build is [[£1,500|$1,950]], an 11–25 page Professional build is [[£2,750|$3,500]], a 26–50 page Growth build is [[£4,750|$5,950]], and 51 pages or more starts at [[£7,500|$9,500]] as a phased build. Figures exclude [[VAT|applicable sales tax]], third-party services and separately quoted functionality. US and UK clients pay the same published bands.",
      },
      {
        q: "How long does a website build take from brief to launch?",
        a: "Weeks rather than quarters for most builds. The sequence is fixed: discovery to agree the offer, the evidence and the page map; an MVP build you review; then the final build carrying the remaining pages, integrations and tracking. Dates are written into the proposal before work starts. Slippage is rarely engineering — it is waiting on content, photography or a stakeholder approval, so all three are scheduled at the start rather than chased at the end.",
      },
      {
        q: "Is a custom build better than Squarespace, Wix or a WordPress theme?",
        a: "For a simple brochure site with no integrations, a builder is often the right call, and Silverstone AI will say so. A custom build earns its cost when the site has to do work: positioning a template would flatten, page speed you control, a structure built around what buyers actually search, and forms that reach a CRM, a calendar and a follow-up sequence instead of an inbox. Buy the template when the job is presentation; build the system when the job is conversion.",
      },
      {
        q: "Do we own the website and the files when the project ends?",
        a: "Yes. Final project files are supplied after full payment, and nothing is held hostage to a hosting contract. Hosting is optional: Silverstone AI manages sites on Netlify from [[£15/month|$19/month]] under 15 pages and [[£25/month|$32/month]] above it, or hands the build over for you to host yourself for [[£350 one-off|$450 one-off]], which covers a handover call, DNS and deploy guidance and two capped support hours.",
      },
      {
        q: "What does website maintenance cost after launch?",
        a: "Maintenance is optional and separate from the build fee. Essential Maintenance is [[£65/month|$85/month]] for monitoring, link checks, small content changes and minor updates. Professional is [[£125/month|$160/month]] with priority support and monthly health checks. Growth is [[£225/month|$290/month]] with a higher update allowance, content support and reporting. Enterprise is quoted against your SLA. A plan is a recommended pairing with your build, never an automatic charge.",
      },
      {
        q: "Will a redesign lose the Google rankings we already have?",
        a: "Not if the migration is planned. Before launch, every existing URL is mapped to its replacement, pages that already earn traffic are kept or redirected, working titles and internal links are preserved, and the new build ships with its sitemap and structured data in place. Positions can move for a few weeks while search engines recrawl. The real damage comes from quietly dropping URLs at launch, which is a planning failure rather than a design one.",
      },
      {
        q: "How do payments work, and can you invoice a US company in dollars?",
        a: "Builds are split across milestones: 50% before the MVP build and 50% before the final build, with custom milestones agreed in writing on phased enterprise projects. Proposals are quoted and invoiced in the currency agreed at proposal — pounds or US dollars, not a conversion applied later. Milestone payments can be made by Stripe payment link by card in either currency, or by bank transfer or wire to the details shown on the invoice.",
      },
      {
        q: "Do you write the copy, or do we have to supply it?",
        a: "Silverstone AI writes it. Copy is part of the build, not homework sent back to you: positioning, page-level messaging and calls to action are drafted from discovery and from the sales conversations your team already has, then reviewed by you before design locks. You supply the raw material — real client questions, objections, proof, photography and any wording your sector is required to use. Nothing that claims a result goes live without your sign-off.",
      },
      {
        q: "Is the site built to be accessible for US and UK visitors?",
        a: "Accessibility is designed in rather than bolted on. Pages are built toward WCAG AA: keyboard navigable, labeled for screen readers, color contrast checked, and motion reduced for anyone whose device asks for it. Automated checks run during the build, with manual keyboard and screen-reader passes before launch. No agency can certify you against the ADA or the UK Equality Act, so what you receive is tested work and a written record of what was checked.",
      },
      {
        q: "Can you improve our current site instead of rebuilding it?",
        a: "Sometimes that is the cheaper answer, and Silverstone AI will say so after looking. Where the positioning is sound and the platform is healthy, the work can be a targeted pass: sharpen the messaging on pages that already draw traffic, repair the mobile layout, connect the forms to your CRM and calendar, and instrument the conversion path so the next decision has evidence behind it. A rebuild is worth paying for when the structure, not the surface, is losing the sale.",
      },
    ],
  },
  midCta: {
    heading: "Build the *decision path* before the interface expands",
    body: "Use a discovery call to pin down the offer, the proof, the pages and the integrations that deserve the first release.",
  },
  finalCta: {
    heading: "Turn your next website decision into a *commercial* one",
    body: "Bring a URL, a rough brief, or just the problem. We’ll map the offer, the evidence, the pages and the integrations worth building first.",
    urgency:
      "Every month a weak site stays live, it quietly costs you inquiries. The first conversation is exploratory and commits you to nothing.",
  },
};

export const appDevelopmentCopy: ServiceCopy = {
  eyebrow: "Custom app development",
  h1: "Custom app development that starts small and *proves value*",
  heroSub:
    "A focused application built around one real user, one valuable task, and the system states needed to deliver it reliably — not a feature backlog dressed up as a strategy.",
  heroPoints: [
    "Scoped around the workflow, not a wish list",
    "A testable first release in weeks, not quarters",
    "AI where it helps, deterministic logic where it must be certain",
  ],
  mobile: {
    tagline: "A first release your team can *actually test*",
    points: [
      "Scoped to the workflow",
      "Testable release in weeks",
      "Certainty where it matters",
    ],
  },
  problem: {
    heading: "App projects get *over-scoped* before the goal is set",
    body: "Feature lists grow before the workflow is defined. Dashboards, notifications, payments, messaging and reporting each sound useful on their own, so each one gets added — while the question that actually decides the budget, *what has to work first*, goes unanswered. Screens nobody asked for absorb the money. Edge cases multiply faster than anyone can test them. By the time it ships, no one can say whether it solved the problem, because the problem was never pinned down. Then the real cost lands: the release can’t be extended, so version two is a rebuild.",
    painPoints: [
      "Scope balloons before the core workflow is agreed",
      "Launch happens with no way to test whether it worked",
      "Every future change means renegotiating the whole roadmap",

      "Staff still retype what the app just collected",
      "No one can say which system holds the true record",
    ],
  },
  outcome: {
    heading: "What a *disciplined first release* gets you",
    body: "A working product built around a real user and a real task — *reliable enough to trust, small enough to ship fast*, and structured so the next release extends it instead of rebuilding it. Approvals, failures, empty states and permissions are handled, not discovered in production. Records have an owner, so the app writes back into the systems your team already runs. Once it’s live, completion rates and abandoned states decide what gets built next.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "Product discovery, UX, data structure and engineering treated as one system — not four separate hand-offs. The user and the job, the state model behind the screens, the roles and sources of truth, the integrations checked against real API limits, and the release testing that has to pass. Locale is designed in rather than patched later: UK postcodes and US ZIP codes, both date orders, both currencies, both time zones.",
  },
  differentiator: {
    heading: "A release built to *reduce risk*",
    body: "We define the states your system must handle before we design a single screen — *what happens when data is missing, when an action fails, when two users collide*. The critical route is prototyped with acceptance criteria attached while change is still cheap, and open questions get written down rather than hidden behind a polished design. Where AI is involved it gets approved inputs, approved outputs and a fallback, with human review kept on any decision that carries real cost. That discipline is what makes a first release trustworthy enough to build on.",
  },
  comparison: {
    before: {
      title: "Feature-led build",
      body: "Treats the backlog as the strategy: scope is agreed as a list of screens, and the hard questions — states, permissions, ownership — are postponed until they are expensive.",
    },
    after: {
      title: "Silverstone AI first-release model",
      body: "Makes the user, the workflow, the system states and the evidence explicit first, so the release ships smaller, proves something, and can be extended rather than rebuilt.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI delivery — evidence of what a disciplined build has achieved.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "From workflow to a testable product decision — without the scope creep. Discovery ends in a written first-release definition and the evidence that would justify it. The prototype carries acceptance criteria you sign off before production code exists. The build implements that scope and nothing else. After launch, the roadmap is set by adoption, errors and abandoned states.",
  },
  faqs: {
    heading: "Questions before a *build begins*",
    items: [
      {
        q: "Do we need a complete specification before speaking?",
        a: "No. A rough workflow and the problem it needs to solve is enough to start the conversation.",
      },
      {
        q: "Can you improve an existing app instead of rebuilding it?",
        a: "Often, yes. We start by reviewing the current architecture, data and operational risk — a targeted improvement can be the smarter route.",
      },
      {
        q: "Can AI be part of the build?",
        a: "Where it adds real value and can be bounded — for retrieval, classification or guided actions. Deterministic logic wins wherever the rule is already known.",
      },
      {
        q: "Is a “smallest first release” the same as a cheap MVP?",
        a: "No. We cut unnecessary scope, not reliability, permissions, testing, or the product logic real use depends on.",
      },

      {
        q: "How much does custom app development cost?",
        a: "Custom app builds are scoped and quoted as a defined project fee once discovery has settled the first release. Silverstone AI publishes no fixed app price, because cost follows the workflow, the platforms, the integrations and any data migration involved. Payment is staged: 50% at kickoff, 30% across development milestones, 20% on completion. Third-party software, API, hosting and usage costs are itemized separately before work begins, and the [[£150|$195]] per hour senior AI engineer rate applies only where specialist work is explicitly priced hourly.",
      },
      {
        q: "How long does it take to build a custom app?",
        a: "Timelines follow scope, not a template. The first-release workflow, the platforms, integrations, permissions, design depth, data migration, testing and how quickly your team approves decisions all move the date. Silverstone AI’s published pricing puts the average project at twelve weeks from discovery to deployment, with roughly 15% of effort in discovery and planning, 60% in development and integration, 15% in testing and deployment, and 10% in training and hand-over. Discovery produces the delivery route before anything is committed.",
      },
      {
        q: "Should we build a web app, a progressive web app, or a native iOS and Android app?",
        a: "A responsive web application is usually the fastest way to reach users on every device and prove the workflow. A progressive web app adds installability and a limited set of device behaviors. Native iOS and Android delivery is justified by deeper device access, app-store distribution, offline use or performance constraints — not by prestige. Silverstone AI chooses the route from the use case and the commercial model, and will say plainly when a web app is enough.",
      },
      {
        q: "Is it better to build custom software or buy an off-the-shelf platform?",
        a: "Custom software is not always the right answer. An existing product may cover most of the requirement at lower risk, and a configured platform can beat owning a codebase you then have to maintain. A custom build earns its place when the workflow or the differentiation is specific enough that compromise costs more than construction. Where the decision is genuinely open, Silverstone AI’s AI and automation consulting runs a structured build-versus-buy assessment before any engineering starts.",
      },
      {
        q: "Should we hire in-house developers or use an agency for a first release?",
        a: "A permanent team makes sense when there is a continuous roadmap to keep it busy and the product is central to how the business earns. An agency suits the stage before that, when the scope is still uncertain and hiring against an unproven idea is the larger risk. Silverstone AI is often used to prove the first release and hand over a documented product an internal team can take on, with support and hand-over terms set in the proposal.",
      },
      {
        q: "Who owns the code and intellectual property when the app is finished?",
        a: "Ownership, licensing, source access, third-party dependencies and hand-over terms are defined contractually in the proposal, because the right arrangement depends on the engagement. Silverstone AI’s commercial intent is clarity rather than lock-in: the proposal should state what is being created, what depends on external services you license directly, and exactly what your business can operate after delivery. Ask for that wording in writing before signing — on any build, with any studio.",
      },
      {
        q: "How does a custom app connect to our CRM, calendar and payment systems?",
        a: "Integration starts with the data model: which system holds the true record, who is allowed to change it, and what happens when a call fails or arrives twice. From there the app connects to CRM, scheduling, payments, messaging, document storage and analytics through documented APIs and webhooks, with permissions and fallbacks agreed first. Third-party availability, rate limits and licensing are confirmed during discovery rather than assumed. An app that leaves staff retyping has only moved the bottleneck.",
      },
      {
        q: "How do you handle user data, permissions and access?",
        a: "Roles and permissions are modeled before screens are designed, so a customer, a staff member and an administrator never share a view by accident. Silverstone AI maps where each record lives, who owns it and how long it is kept, then identifies the obligations that apply — UK GDPR and the Information Commissioner’s Office in the UK, state privacy laws in the US — so your legal advisers review a system they can actually see. US healthcare work is limited to HIPAA-conscious, non-clinical workflows.",
      },
      {
        q: "Do you build apps for US businesses as well as UK ones?",
        a: "Silverstone AI is a London studio with US-based team members, and builds for both markets. The product is built for the market it serves: US or UK spelling, both date orders, currency and tax handling, time zones, postcodes or ZIP codes, and the tools your team already runs, whether that is HubSpot, Salesforce, Stripe or Shopify. Support runs across UK and US business hours, with response times set in the written agreement.",
      },
      {
        q: "What happens after the app launches?",
        a: "The roadmap is set by real use: completion rates, errors, support requests, abandoned states and the commercial value of the next feature. A request moves forward because it improves the product, not because it appeared on the original list. Ongoing support is a separate retainer, from [[£350|$450]] per month for business-hours cover across UK and US time zones, monitoring and scheduled reviews, with response times agreed in writing. Higher tiers add 24/7 priority cover from [[£1,250|$1,600]] per month.",
      },
    ],
  },
  midCta: {
    heading: "Define the workflow before the build gets *expensive*",
    body: "Use a discovery call to pin down the user, the task, and the states your system has to handle — before a single screen gets designed.",
  },
  finalCta: {
    heading: "Move from idea to a *testable product decision*",
    body: "Bring a rough workflow — that's enough. We'll help you see whether a first release, an improvement, or something else entirely is the right next step.",
    urgency:
      "Every quarter spent scoping a feature list is a quarter your competitors spend shipping. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiVoiceAgentsCopy: ServiceCopy = {
  eyebrow: "AI voice agents",
  h1: "AI voice agents for real conversations and *real consequences*",
  heroSub:
    "An AI voice agent is a custom call workflow that listens, responds, acts and escalates within rules your business can inspect, not a demo voice bolted onto a talking FAQ. Built for US and UK phone lines, monitored in your time zone.",
  heroPoints: [
    "Answers, books and escalates within rules you set",
    "Under 10 seconds response time",
    "Every uncertain call hands to a human, with context",
  ],
  mobile: {
    tagline: "Every call answered, *inside the rules you set*",
    points: [
      "Under 10s response time",
      "Books within your rules",
      "Uncertain calls go human",
    ],
  },
  problem: {
    heading: "A voice demo is easy. *Surviving production* isn't",
    body: "The hard part was never making a synthetic voice speak. It's building a call system that understands real intent, handles interruptions, takes permitted actions, and knows exactly when to hand over to a person — every time, not just in the demo. Production is where the unglamorous work lives: what happens when the calendar times out, when two callers want the same slot, when someone gives a name the model has never heard, or when the caller is angry and the only right answer is a person. A demo has no consequences. A live line has a caller, a booking and your reputation attached to every turn.",
    painPoints: [
      "Missed calls become missed revenue, every single day",
      "A generic bot can't tell an urgent call from a routine one",
      "Nobody can see what the AI actually said or promised",

      "The agent confirms a booking your calendar had already given away",
      "Outbound calling starts before anyone checks the consent record",
    ],
  },
  outcome: {
    heading: "What a *production-grade* voice agent changes",
    body: "Calls answered in seconds, around the clock. *Bookings confirmed without a human touching the calendar.* Anything sensitive or unclear routed to your team — with the context they need, not a cold transfer. Your systems stay the source of truth: the agent writes to the calendar and CRM only where it is permitted to, confirms details back to the caller before it commits, and leaves a transcript and an outcome record behind every call.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "Conversation design, speech processing, telephony, monitoring and escalation — engineered as one operating system. That means intent and state design before scripting, a speech pipeline tuned for latency and interruption, permissioned connections into your calendar, CRM, SMS and ticketing, and monitoring that surfaces failed actions and low-confidence calls instead of burying them in a log.",
  },
  differentiator: {
    heading: "Built for the call that goes *off-script*",
    body: "Real callers interrupt, change their mind, and ask things the script didn't anticipate. We design for that — *with confidence thresholds, permitted actions, and a clean human handover* before the agent guesses. Every action it can take is enumerated and bounded, every failure path has a named owner, and every uncertain call is reviewable as a transcript. That is the difference between a voice that sounds convincing and a call system you can put in front of paying customers.",
  },
  comparison: {
    before: {
      title: "Voice demo",
      body: "Optimized for a short, expected conversation with no operational consequence — the failure paths are never exercised.",
    },
    after: {
      title: "Silverstone AI voice system",
      body: "Designed around real call states, permitted actions, monitoring, and a named human owner for every exception.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI voice deployments.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "From call intent to a monitored, production voice line. We define and bound the call types first, prototype the conversation against interrupted and failed paths as well as the ones that go to plan, connect telephony and business systems with fallbacks, then evaluate transcripts, action outcomes, latency and handovers before a single new intent is added.",
  },
  faqs: {
    heading: "Questions before a *live line* is connected",
    items: [
      {
        q: "Can the agent use our existing phone number?",
        a: "Usually, yes, for US and UK numbers alike. Porting, forwarding and routing depend on your carrier, and we confirm them during technical discovery before anything is promised.",
      },
      {
        q: "Can it book appointments during the call?",
        a: "Yes, once calendar access, availability rules and confirmation language are approved — and it confirms details back to the caller before writing the booking.",
      },
      {
        q: "Is every call recorded?",
        a: "Not automatically — recording, transcription and retention are configured to your use case and legal requirements.",
      },
      {
        q: "Will it replace the team?",
        a: "No. It handles bounded, repeatable call work so your team spends their time on the calls that actually need a person.",
      },
      {
        q: "Does it cover US and UK hours?",
        a: "Yes. The agent answers around the clock on either side of the Atlantic, and escalation windows follow your team's time zone. Silverstone AI has US-based team members, so a US deployment is monitored during US business hours, not from a London desk at night.",
      },
      {
        q: "Will it understand every caller?",
        a: "No system should claim universal accuracy. We test accents, names and phrasing against your real callers, and the agent hands over the moment confidence drops.",
      },

      {
        q: "How much does an AI voice agent cost?",
        a: "Voice agents sit inside the published implementation bands. A focused pilot on one call type starts from [[£3,000|$3,900]], and most full deployments land between [[£10,000|$12,500]] and [[£25,000|$32,500]], plus a support retainer from [[£350|$450]] per month. Telephony, speech and usage costs are itemized separately before work begins, because they scale with call minutes rather than with the build. US and UK clients pay the same published bands.",
      },
      {
        q: "What's the difference between an AI voice agent and an AI receptionist?",
        a: "They overlap, and the difference is scope. An AI receptionist is a front-desk layer across calls, chat and web intake: it answers approved questions, books what it is permitted to book, and routes the rest to a person. An AI voice agent is the call itself, engineered for a defined set of intents, outbound as well as inbound, with deeper actions in your systems and tighter latency and interruption handling. Many clients run a voice agent as the phone channel inside a wider reception layer.",
      },
      {
        q: "How long does it take to get an AI voice agent live?",
        a: "Delivery runs in four stages: define the calls, prototype the conversation, connect the actions, then evaluate transcripts before scope widens. Across Silverstone AI projects the published average from discovery to deployment is 12 weeks. A single-intent pilot with one calendar and one CRM sits at the short end of that; a multi-intent line with number porting and several downstream systems sits at the long end. The schedule is confirmed at scoping, not before.",
      },
      {
        q: "Can an AI voice agent make outbound calls, not just answer them?",
        a: "Yes, and outbound changes the design brief. In the United States, outbound AI calling raises TCPA questions, so the workflow is built consent-first: a record must carry a consent basis, channel scope, capture timestamp and suppression status before the number can enter a campaign. In the UK the same workflow is reviewed against UK GDPR, the ICO and Ofcom rules rather than reused as-is. We design the controls; qualified legal review before launch stays with your counsel.",
      },
      {
        q: "What happens if the calendar or CRM the agent depends on goes down?",
        a: "It fails visibly, not silently. Every permitted action — booking, lookup, ticket creation — has a defined fallback. If the calendar or CRM does not respond, the agent tells the caller plainly, captures the details, and routes the call or a written summary to a named human owner instead of inventing a confirmation. Those failure paths are built and tested during the prototype stage, alongside the ones that go to plan, before the line goes live.",
      },
      {
        q: "Do we have to tell callers they're speaking to an AI?",
        a: "Plan to. Explicit disclosure is designed in by default: the agent identifies itself as an automated assistant at the start of the call and never claims to be a person when asked. Rules differ by jurisdiction, including between US states, and they keep moving, so the exact wording is agreed with you and reviewed by your counsel where the use case warrants it. Disclosure also sets expectations early, so a handover to a person reads as routine rather than as a failure.",
      },
      {
        q: "How do we know the voice agent is actually working?",
        a: "You measure call outcomes, not how natural the voice sounds. Before launch we agree what a resolved call means for each intent, then report against it: resolution by intent, action successes and failures, escalation rate and reason, response latency, and the transcripts behind every uncertain call. Reviews are scheduled rather than reactive, scope widens only once the evidence supports it, and you keep access to the same records we work from.",
      },
      {
        q: "Can the agent transfer a caller to a person mid-call?",
        a: "Yes. Transfer is a designed state, not an emergency exit. When confidence drops, a caller asks for a person, or the request falls outside permitted actions, the agent hands over on the rules you set: live transfer during staffed hours, a callback or a queue outside them. It passes what it has already captured so the caller does not repeat themselves, and it is truthful about wait times rather than optimistic.",
      },
    ],
  },
  midCta: {
    heading: "Design the call before you choose a *voice*",
    body: "Use a discovery call to map the intents, the actions worth automating, and exactly where a human needs to stay in the loop.",
  },
  finalCta: {
    heading: "Design the call before choosing *the voice*",
    body: "Bring a sample call, a current script, or just the call problem that keeps repeating. We'll map the architecture that would actually hold up in production.",
    urgency:
      "Every missed call this week is a lead your competitor answered instead. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiReceptionistsCopy: ServiceCopy = {
  eyebrow: "AI receptionists",
  h1: "An AI receptionist that knows *when to hand over*",
  deck: "Answers every call, qualifies the caller, hands over the ones that matter.",
  heroSub:
    "An AI receptionist is one governed reception layer for calls, chat and intake: it answers what it should, books what it is allowed to book, and routes the rest to a person with full context. Built for front desks in the US and the UK.",
  heroPoints: [
    "Every channel converges into one governed layer",
    "+66% increase in phone availability",
    "Routine inquiries handled; the rest routed to a person",
  ],
  mobile: {
    tagline: "Answers what it should, *routes what it shouldn't*",
    points: [
      "Every channel, one layer",
      "+66% phone availability",
      "Handovers reach a person",
    ],
  },
  problem: {
    heading: "Your front desk is a system of *decisions*, not a script",
    body: "Callers, chat messages and web inquiries all arrive with different urgency, different detail and different next steps. Behind each one sits a decision your desk makes without naming it: routine or specialist, which details are genuinely needed, whether this person can book directly or someone has to approve it, which location or practitioner owns it, where the record goes, and which topics must never be answered without a person. Leave those rules undocumented and automation only makes the inconsistency faster — routine requests still clog your team while the calls that matter wait in a queue.",
    painPoints: [
      "Out-of-hours inquiries go unanswered until morning",
      "Simple requests still need a human to type them up",
      "There's no single record of what was asked, and answered, where",

      "Peak-hour calls ring out while the desk serves the person standing in front of it",
      "Bookings get taken that break your own rules — wrong service, no buffer, no eligibility check",
    ],
  },
  outcome: {
    heading: "What an *integrated front desk* changes",
    body: "Calls, chat and intake converge into one system that answers approved questions, *books what it's allowed to book*, and hands anything sensitive to a person — with the context already attached. Your team stops retyping: the reason for contact, the qualifying answers, the booking status and the reason for any handoff land in your CRM or shared inbox with an owner and a next action. Exceptions — a failed calendar write, an unclear caller, a blocked topic — arrive as work someone can pick up, not as silence.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "Intake, triage, booking and escalation — designed and connected as a single operating layer, not disconnected tools. Phone lines, web chat and messaging run on the same rules, whether the desk sits in a UK branch or a US front office.",
  },
  differentiator: {
    heading: "*Answering* versus *operating*",
    body: "A generic answering bot recites information. An operating front desk *qualifies the inquiry, checks availability, updates your systems*, and knows precisely when a decision needs a human — every time, not most of the time. The difference shows when something fails: a full calendar, a rejected write, a caller who doesn't fit the script. An operating desk says what is true, retries only where retrying is safe, and moves the inquiry to a named owner instead of ending the conversation politely and losing it. Blocked topics, confidence thresholds and escalation routes are written down before launch, and every conversation leaves a record you can read.",
  },
  comparison: {
    before: {
      title: "Basic answering tool",
      body: "Produces a response or a message in one channel, then leaves the booking, the record and the follow-up to your team.",
    },
    after: {
      title: "Silverstone AI reception system",
      body: "Coordinates intake, permitted actions, connected records, routing and human ownership across every front-desk channel.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI receptionist deployments.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "Design the desk before connecting the channels. Nothing goes live until your approved answers are signed off, calendar and CRM writes are tested against real availability rules, and the human route has a named owner.",
  },
  faqs: {
    heading: "Questions buyers should ask before *choosing a provider*",
    items: [
      {
        q: "Can it work outside office hours?",
        a: "Yes — configured against your approved fallback model and the availability of the systems it connects to.",
      },
      {
        q: "Can it book directly into our existing calendar?",
        a: "Often, yes, whether that is Google Calendar, Outlook, Calendly, Acuity, Vagaro, Mindbody, Jane or your practice-management system. We test availability rules, confirmations and duplicate prevention before direct booking goes live.",
      },
      {
        q: "How is personal data handled?",
        a: "Data minimization, retention and access are reviewed for your exact implementation — never treated as a blanket compliance guarantee.",
      },
      {
        q: "Can customers always reach a person?",
        a: "A genuine human route is designed in — live transfer, callback or queue, matched to your staffing and hours, and it's always truthful about wait times.",
      },
      {
        q: "Will it understand every caller?",
        a: "No system understands every accent or phrasing perfectly. It confirms important details back and hands over the moment confidence drops.",
      },
      {
        q: "How much does an AI receptionist cost?",
        a: "A focused pilot starts from [[£3,000|$3,900]], with most full front-desk implementations landing between [[£10,000|$12,500]] and [[£25,000|$32,500]], plus a support retainer from [[£350|$450]] per month. Telephony and usage costs are itemized separately. See the pricing page for every band in GBP and USD.",
      },

      {
        q: "What's the difference between an AI receptionist and a phone answering service?",
        a: "A phone answering service uses people to take a message and pass it on; an AI receptionist answers the inquiry itself, qualifies it against your rules, books what it is permitted to book and writes the record into your systems. An answering service still suits sensitive or highly variable calls. Plenty of front desks run both — automation takes the routine demand, people take the rest.",
      },
      {
        q: "Can an AI receptionist replace our human receptionist?",
        a: "An AI receptionist is built to absorb repeatable front-desk work — opening hours, directions, service questions, appointment requests, callbacks and intake — not to replace the judgment a receptionist applies to a distressed caller, a complaint or an unusual request. The realistic outcome is a receptionist with fewer interruptions, better notes, and time for the person standing at the desk.",
      },
      {
        q: "How long does it take to get an AI receptionist live?",
        a: "Silverstone AI publishes an average of 12 weeks from discovery to deployment across projects, split roughly 15% discovery, 60% build and integration, 15% testing and 10% training and handover. For a front desk, the calendar is usually set by how quickly approved answers, calendar access and CRM permissions arrive from your side rather than by build time, which is why the first release is deliberately narrow.",
      },
      {
        q: "Do you build AI receptionists for US businesses as well as UK ones?",
        a: "Yes. Silverstone AI is a London studio with US-based team members, and each front desk is built for the market it answers: US or UK spelling, time zones, date formats, ZIP or postcode capture, and the calendar, CRM and telephony stack your team already runs. Escalation windows follow your office hours, so a US deployment is monitored during US business hours.",
      },
      {
        q: "Will callers be told they're speaking to an AI?",
        a: "Disclosure is your decision, and Silverstone AI makes honest disclosure the default: the receptionist introduces itself as an automated assistant, says what it can do, and offers a person early rather than after a caller has become frustrated. The wording, how often it is repeated and how it appears in chat are agreed before launch, and your own counsel confirms what your sector requires.",
      },
      {
        q: "Can it answer only the calls we don't pick up?",
        a: "Yes — overflow answering is one of the most common places to start. Your main number keeps ringing at the desk, and calls roll over to the AI receptionist after a set number of rings, outside opening hours, or when every line is busy. It handles what it is approved to handle and returns the rest to your team as a callback task with the details already captured.",
      },
      {
        q: "Is an AI receptionist suitable for a medical, dental or clinic front desk?",
        a: "An AI receptionist suits the administrative layer of a clinical front desk, never clinical decisions. In the US, Silverstone AI builds HIPAA-conscious, non-clinical workflows — scheduling, directions, forms, reminders and callbacks — with symptoms, triage and advice routed to staff. In the UK, private clinics, dental and veterinary practices work the same way, with data minimization, retention and lawful basis reviewed against UK GDPR and your own ICO obligations before launch.",
      },
      {
        q: "What does it write into our CRM after a call or chat?",
        a: "After each conversation the AI receptionist writes the contact details, the reason for contact, the qualifying answers, the booking or callback status, a conversation summary and the reason for any handoff — mapped to the fields your team already uses so nothing is duplicated. Where an API or approved integration exists, writes, required fields and duplicate handling are tested before go-live.",
      },
      {
        q: "Can it handle callers in other languages, such as Spanish?",
        a: "An AI receptionist can work in more than one language, but each language is scoped on its own rather than switched on in bulk. Spanish is the common request from US front desks; Polish, Urdu and Welsh come up on UK lines. Each needs approved answers, tested pronunciation of names and places, and its own human route — and we will say plainly when a language is not reliable enough for your callers.",
      },
    ],
  },
  midCta: {
    heading: "Design the desk before you connect *the channels*",
    body: "Use a discovery call to map what should be automated, what should stay human, and where the two need to meet.",
  },
  finalCta: {
    heading: "Make every routine inquiry reach a *defined destination*",
    body: "Bring your call notes, FAQs, or just the booking process as it stands today. We'll identify the smallest valuable front-desk route to start with.",
    urgency:
      "Every inquiry that goes unanswered tonight is a booking your competitor takes tomorrow. The first conversation is exploratory and commits you to nothing.",
  },
};

export const contentCreationCopy: ServiceCopy = {
  eyebrow: "Content creation & repurposing",
  h1: "AI content creation that turns your expertise into *a system*",
  deck: "Governed, on-brand, and yours.",
  heroSub:
    "A source-led system that turns your approved expertise into website, insight, email and social assets — each one earning its place, not padding a quota.",
  heroPoints: [
    "Every asset traces back to an approved source",
    "500+ campaigns run through the same operating system",
    "Human judgment stays in every approval gate",
  ],
  mobile: {
    tagline: "Your expertise, published as *a working system*",
    points: [
      "Traced to your source",
      "500+ campaigns run",
      "Judgment stays with people",
    ],
  },
  problem: {
    heading: "More content isn't the same as more *authority*",
    body: "Volume is the easy problem. The harder one is producing material that stays credible, distinct, and recognizably yours — instead of generic output that quietly erodes the trust you're trying to build. The failure is usually structural rather than creative: the expertise sits with two or three people who are never actually interviewed, nobody owns the claim that goes into a draft, and nobody decides which single question a page exists to answer. So the calendar fills, the archive grows, and *nothing in it is worth citing* — least of all by the AI assistants your buyers now ask before they reach your site.",
    painPoints: [
      "Publishing more, but rankings and inquiries stay flat",
      "Nobody owns the source material or the approval step",
      "Content reads like everyone else's AI-generated filler",

      "Your sharpest expertise stays trapped in calls, proposals and inboxes",
      "Every channel gets the same text, rebuilt for none of them",
      "AI assistants answer your buyers' questions without ever citing you",
    ],
  },
  outcome: {
    heading: "What a *governed content system* changes",
    body: "Your real expertise, *captured once and adapted across every channel* with a defined approval gate — so output scales without your name ending up on something you wouldn't stand behind. Interviews, sales calls, proposals and the questions your team answers daily become the source library. Each asset is then built for one audience question and one channel, with a named reviewer signing off the claims before anything publishes. Service pages, insight articles, email and social stop competing with each other and start pointing at the same commercial argument — so when a buyer, or the assistant they asked first, looks for what you actually do, there is a specific and attributable answer to find.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "Source capture, editorial structure, channel adaptation and approval workflow — built as one repeatable cycle rather than four disconnected requests. You receive the interview and extraction method, an intent map that gives every asset one audience question and one owner, the channel-specific adaptations, and the review gate that holds publication until a named person signs off the claims. The whole cycle is documented and handed over, so your team can run it without us.",
  },
  differentiator: {
    heading: "Atomize the idea without *diluting it*",
    body: "AI accelerates extraction, structuring and drafting. It doesn't replace the point of view, the accountable source, or the human sign-off that keeps every asset distinct instead of generic.",
  },
  comparison: {
    before: {
      title: "AI content factory",
      body: "Optimizes for output volume and generic consistency: one prompt, many near-identical assets, no accountable source and nobody between the model and the publish button.",
    },
    after: {
      title: "Silverstone content system",
      body: "Optimizes for source quality, distinct intent, governance and commercial usefulness: every asset traces to approved expertise, answers one audience question, and clears a named reviewer before it carries your name.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI content programs.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "From source material to a repeatable content cycle, usually inside the first month. Weeks one and two capture the expertise and map intent, page by page. Week three produces the first governed batch and runs it through the approval gate. Week four publishes, measures what moved, and sets the cadence your team can actually sustain — then the cycle repeats with the previous round's evidence steering it.",
  },
  faqs: {
    heading: "Questions about AI, *quality* and publishing",
    items: [
      {
        q: "Will AI write all the content?",
        a: "AI supports extraction, structuring and drafting from your approved sources — human judgment decides what actually publishes.",
      },
      {
        q: "How do you keep it original?",
        a: "Originality starts with your source and context. Every asset needs a distinct angle, example or framework — generic synthesis isn't the goal.",
      },
      {
        q: "Can the system publish automatically?",
        a: "Technically, yes — but approval gates stay in by default. The workflow makes publishing faster, not accountability optional.",
      },
      {
        q: "Does this include SEO?",
        a: "Search intent, page ownership, headings and internal links are built in. No ranking is ever guaranteed.",
      },

      {
        q: "How much does a governed content system cost?",
        a: "Content systems are quoted on the same published implementation bands as our other builds. A focused pilot starts from [[£3,000|$3,900]], most SME implementations land between [[£10,000|$12,500]] and [[£25,000|$32,500]], and ongoing support starts from [[£350|$450]] per month. Model usage, software licenses and stock costs are itemized separately before work begins. Every band is published in both GBP and USD, and proposals are invoiced in the currency agreed.",
      },
      {
        q: "Who owns the content, and what happens if we stop working with you?",
        a: "You do. The source library, the intent map, the prompts, the templates and every published asset are yours, and the cycle is documented so your own marketer or agency can run it without us. Nothing is locked inside a proprietary tool you cannot export. If the engagement ends, you keep a working editorial system rather than an archive nobody on your team knows how to extend.",
      },
      {
        q: "Will AI-assisted content hurt our Google rankings?",
        a: "Google's guidance targets content produced primarily to manipulate rankings, not the use of AI as a tool. That is exactly why the system is source-led: every asset starts from your expertise, answers a real audience question, and clears a human reviewer who is accountable for the claims inside it. No agency can guarantee a ranking, and we never do — rankings also depend on competition, authority and demand.",
      },
      {
        q: "What do you actually need from us to get started?",
        a: "Less than most teams expect. Usually two or three recorded interviews with the people who hold the expertise, access to existing proposals, decks and support inboxes, and one named reviewer with authority to approve claims. After the first cycle the standing ask is roughly an hour a month: one short interview and the review pass. Extraction, structuring, channel adaptation and publishing sit with us.",
      },
      {
        q: "Can you publish into our existing CMS?",
        a: "Usually, yes. We publish into WordPress, Webflow, HubSpot, Shopify, Squarespace and headless setups wherever an API or editor access exists, and into your email platform and LinkedIn on the same cycle. Where direct publishing is not safe or not possible, you receive review-ready drafts in the structure your CMS expects. Permissions, staging and rollback are agreed before anything writes to a live site.",
      },
      {
        q: "Do you write differently for US and UK audiences?",
        a: "Yes, and it is a deliberate setting rather than an afterthought. Spelling, currency, date format and vocabulary follow the market a page sells into: US readers get “inquiry”, “real estate brokerage” and dollar figures, while UK readers get the British spelling, “estate agency” and sterling. Regulator and body names are never localized — the Information Commissioner's Office, the ICO and UK GDPR keep their proper names in both versions.",
      },
      {
        q: "Which channels does this cover?",
        a: "The website is the spine: service pages, industry pages and insight articles that each answer one search intent and link to each other deliberately. From the same approved source we adapt email, LinkedIn and short-form social, plus sales collateral where it earns its place. Each channel gets a rebuilt version with its own context and next action — never the same paragraph pasted in four places.",
      },
      {
        q: "Should we build this in-house or bring in an agency?",
        a: "If you already have an editor, an accountable reviewer and someone who maintains the tooling, in-house is the cheaper long-run answer and we will say so. Most teams have the expertise and none of the editorial machinery. What we build is the machinery — capture method, intent map, adaptation templates and approval gate — documented and handed over, so you can staff it internally afterwards.",
      },
      {
        q: "How much will we actually publish each month?",
        a: "Cadence follows how much genuine source material exists, not a quota. A typical cycle turns one substantial interview or document into a primary asset plus its channel adaptations, and the number of cycles per month is agreed in the proposal. We would rather publish fewer assets that each answer a real buyer question than fill a calendar with material that dilutes the pieces worth reading.",
      },
      {
        q: "How do you measure whether the content is working?",
        a: "Against commercial signals rather than word count. We track which pages earn impressions and clicks for the intents they were built for, which assets get used in sales conversations, and which routes produce inquiries and booked calls. Those readings set the next cycle's priorities, so the program compounds instead of restarting each quarter. We report movement rather than promise it.",
      },
    ],
  },
  midCta: {
    heading: "Capture the source before *scaling the output*",
    body: "Use a discovery call to identify the expertise worth publishing and the approval gates that keep it credible.",
  },
  finalCta: {
    heading: "Build a system your expertise can *sustain*",
    body: "Bring existing documents, scattered notes, or just the expertise your business struggles to publish consistently. We'll map the system that turns it into a real content engine.",
    urgency:
      "Every month without a governed system is another month of generic content quietly working against your authority. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiAutomationCopy: ServiceCopy = {
  eyebrow: "AI automation",
  h1: "AI automation for the work *between your systems*",
  heroSub:
    "AI automation is a custom workflow connecting triggers, data, rules, AI judgment and approvals into an operating layer your team can actually inspect. Built on the tools US and UK businesses already run.",
  heroPoints: [
    "Built around consequence, not blanket autonomy",
    "98% extraction accuracy on structured documents",
    "First working automation live in 2–4 weeks",
  ],
  mobile: {
    tagline: "Every trigger and approval *you can inspect*",
    points: ["Scoped by consequence", "98% extraction accuracy", "Live in 2–4 weeks"],
  },
  problem: {
    heading: "Automation fails where *ownership* disappears",
    body: "Most operational waste doesn't live inside one tool — it lives in the handoffs between them. A lead copied into a spreadsheet by hand. A document waiting in an inbox. A report stitched together from exports. Somewhere, an employee has quietly become the integration layer. That person is usually the documentation too: the rule about which orders need a second check, the exception nobody wrote down, the account a connector authenticates as. When they're away the process slows; when they leave, it breaks. And the usual first response — a connector task built in an afternoon — moves the data without ever recording who owns the decision or what should happen when the data is wrong.",
    painPoints: [
      "The same manual handoff, repeated every single day",
      "No one can say why a workflow failed last Tuesday",
      "Every new automation feels like a custom, unrepeatable project",

      "One person holds the process — and all of the documentation",
      "A renamed field breaks a connector task silently, for weeks",
    ],
  },
  outcome: {
    heading: "What an *engineered operating layer* changes",
    body: "*Triggers, data and deterministic rules do the repeatable work.* Bounded AI judgment handles what rules can't. Exceptions route to a named person — and every run is logged, so your team can see exactly what happened and why. The change is narrow and measurable: the handoff stops depending on who is at their desk, the same rule is applied at three in the morning as at three in the afternoon, and the next workflow extends a monitored system instead of becoming another one-off build.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "Triggers, data pipelines, deterministic logic, bounded AI judgment and human approval gates — engineered as one inspectable system. You also receive what makes it survivable: credentials held in your own accounts, a documented run-through of every branch including the failure paths, a named owner on each exception queue, and monitoring that alerts a person when a run stalls rather than letting it fail quietly.",
  },
  differentiator: {
    heading: "AI where *judgment* helps",
    body: "We don't default to AI for everything. Deterministic logic runs wherever the rule is already known — AI earns its place only *where judgment genuinely adds value*, and every exception has a defined human owner. The same discipline decides autonomy: we start from consequence — what a wrong action would cost, who finds out, and how it gets reversed. Cheap-to-undo steps run unattended. Anything that moves money, messages a client or writes to a system of record waits for approval until it has earned autonomy.",
  },
  comparison: {
    before: {
      title: "Connector-first automation",
      body: "Starts with the apps already available and a happy-path trigger. Data moves, but no one owns the decision, exceptions have nowhere to go, and the first renamed field breaks the flow quietly.",
    },
    after: {
      title: "Silverstone AI operating layer",
      body: "Starts with ownership, source of truth, exception and consequence, then selects the platform. Rules stay deterministic, AI stays bounded, approvals gate the costly steps, and every run is logged and monitored.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI automation deployments.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "From one manual handoff to a monitored automation system. Discovery traces a real run of the process end to end, exceptions included, and confirms API access and rate limits before anything is promised. Build runs against a copy of your data, and the failure paths are tested as deliberately as the normal ones. A first working automation is typically live in 2–4 weeks, then reviewed against the baseline before the next process is touched.",
  },
  faqs: {
    heading: "Questions before the first *workflow* runs",
    items: [
      {
        q: "Which platform will you use?",
        a: "Whichever fits the requirement — n8n for complex self-hosted orchestration, Make for visual flexibility, Zapier for straightforward cloud integrations, or custom code where logic or scale demands it.",
      },
      {
        q: "Can you connect to any tool we use?",
        a: "Wherever it offers a suitable API, webhook or approved interface: HubSpot, Salesforce, Pipedrive, QuickBooks, Xero, ServiceTitan, Jobber, Shopify, Stripe and the rest. We verify access and rate limits during discovery, before anything is promised.",
      },
      {
        q: "Will it run without any human involvement?",
        a: "Some bounded actions will. Others pause for approval or route to a person — the model follows consequence, not a blanket autonomy target.",
      },
      {
        q: "How do you prevent errors?",
        a: "Validation, deterministic rules, test cases, retries, logs and human review all play a part. No responsible provider promises zero errors.",
      },

      {
        q: "What does an AI automation project cost?",
        a: "AI automation is quoted from the published implementation bands: [[£2,000–£10,000|$2,500–$12,500]] for one focused workflow automated end to end, and [[£10,000–£50,000|$12,500–$65,000]] for a coordinated multi-system build, with most SME implementations landing between [[£10,000|$12,500]] and [[£25,000|$32,500]]. Ongoing support starts from [[£350|$450]] per month. Software, API, hosting and usage costs are identified separately before work begins, and every band is published in GBP and USD on the pricing page.",
      },
      {
        q: "How long does it take to get the first automation live?",
        a: "A first working automation is typically live within 2–4 weeks of discovery: one process, its exceptions and its monitoring, rather than a platform rollout. Wider multi-system programs average around twelve weeks from discovery to deployment. The variables that move that date are access to the systems involved, the state of the source data, and how quickly exception rules can be confirmed with the person who currently makes those calls.",
      },
      {
        q: "We already use Zapier in-house — why would we pay an agency to build this?",
        a: "Connector tools are excellent at moving data and poor at owning decisions. In-house automations usually hold until the first edge case: a missing field, a duplicate record, an API returning an error nobody sees. Silverstone AI builds the parts teams rarely build for themselves — validation, retries with limits, exception queues with named owners, run logs and alerting — and will keep your existing Zapier or Make tasks in place wherever they are already doing the job well.",
      },
      {
        q: "Who owns the workflows and the accounts once the build is finished?",
        a: "You do. Automations are built inside your own accounts and workspaces wherever the platform allows it, with credentials held by you and a handover pack documenting every trigger, branch, exception route and integration. Silverstone AI works across n8n, Make, Zapier and custom code precisely so nothing depends on a proprietary layer of ours: you can keep us on support, move to another provider, or bring the system in-house.",
      },
      {
        q: "How is our data handled by an automation workflow?",
        a: "Data handling is designed for each implementation rather than claimed as a blanket guarantee. In practice that means data minimization — the workflow reads only the fields it needs — least-privilege credentials, a defined retention period, and a written record of which systems and which model providers see what. UK work is designed with UK GDPR and Information Commissioner's Office guidance in view; for US clients the same questions are asked against state privacy law and sector expectations, including HIPAA-conscious, non-clinical workflows in healthcare settings.",
      },
      {
        q: "What happens when one of our systems changes or an integration breaks?",
        a: "Connected systems change: a CRM renames a field, a vendor deprecates an endpoint, a token expires. Automations are therefore built to fail loudly rather than quietly — validation on the way in, retries with limits, and an alert to a named owner when a run stalls. Under a support retainer, monitoring, fixes and version updates are handled as part of the plan; without one, changes are quoted as they arise. Either way the run history shows precisely which step broke.",
      },
      {
        q: "Can you automate a process that runs in software with no API?",
        a: "Sometimes, and that answer is settled in discovery rather than promised in a proposal. Where a system offers no API, the routes worth testing are scheduled file or email exports, a direct database or reporting connection, a supported import format, or a vendor integration that already exists. Where none of those exist, we say so: a fragile screen-scraping workaround that breaks at the next interface update is usually worse than the manual step it replaces.",
      },
      {
        q: "Is our business too small for AI automation?",
        a: "Repetition matters more than size. A single handoff performed several times a day by one person is a better first candidate than a complex process touched twice a month, and narrow standalone automations start at [[£2,000|$2,500]]. Silverstone AI works with owner-run UK businesses and US small and mid-sized companies as well as larger operations, and part of the purpose of discovery is to say plainly when a process is not yet worth automating.",
      },
      {
        q: "How is this different from RPA?",
        a: "Robotic process automation drives the user interface: it clicks, types and reads screens as a person would, and it breaks when the screen changes. The automation Silverstone AI builds works at the data layer instead — APIs, webhooks and database connections, with deterministic rules for logic that is already known and bounded AI only where interpretation is genuinely required. That makes it more durable to run, easier to test before launch, and far easier to audit afterward.",
      },
      {
        q: "Do you build automation for US businesses as well as UK ones?",
        a: "Silverstone AI is a London studio with US-based team members, and each system is built for the market it operates in: business-hours support across UK and US time zones, workflows that respect local time zones and date formats, currency and tax fields matched to the region, and the stack your team already runs — HubSpot, Salesforce, Pipedrive, Xero, QuickBooks, ServiceTitan or Jobber.",
      },
    ],
  },
  midCta: {
    heading: "Trace the handoff before you *automate it*",
    body: "Use a discovery call to map the systems, the exceptions, and the first workflow worth automating.",
  },
  finalCta: {
    heading: "Choose the first workflow with enough care to *scale*",
    body: "Bring a process map, a systems list, or just the repeated task. We'll test readiness and identify where automation earns its place fastest.",
    urgency:
      "Every week you delay is another week of the same manual handoff. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiConsultingCopy: ServiceCopy = {
  eyebrow: "AI & automation consulting",
  h1: "AI consulting that settles *what to automate* before you buy",
  heroSub:
    "AI and automation consulting is a senior decision layer for prioritizing use cases, testing readiness, choosing build-versus-buy and defining the controls delivery will need, for leadership teams in the US and the UK.",
  heroPoints: [
    "An independent view before you commit budget",
    "60% average reduction in manual operations overhead",
    "A roadmap that ends in decisions, not more options",
  ],
  mobile: {
    tagline: "Decide what to automate *before you spend*",
    points: [
      "Independent before you buy",
      "60% average overhead cut",
      "A roadmap that decides",
    ],
  },
  problem: {
    heading: "Technology is chosen before the *operating problem*",
    body: "AI creates pressure to move fast — and an unusually large number of plausible wrong turns. Teams buy software before the workflow is defined. Pilots fail because the source data was never accessible. Departments procure overlapping tools that solve the same problem twice. The decisive questions go unasked: which workflow is causing measurable friction, who owns it, whether the inputs are reliable, which decisions must stay with an authorized person, and what happens when the system is wrong. Without those answers, the easiest task to demo gets automated while the process that actually constrains the business stays blocked by data, ownership or policy.",
    painPoints: [
      "Multiple teams buying overlapping AI tools independently",
      "A promising pilot stalls because the data was never ready",
      "No one can say which use case is actually worth pursuing first",

      "A vendor proposal on the table and no independent way to judge it",
      "Budget approved for AI with no agreed measure of what success looks like",
    ],
  },
  outcome: {
    heading: "What an *independent decision layer* changes",
    body: "A *prioritized, evidence-based view of where automation actually pays off* — with build-versus-buy decided, risk and governance defined, and a sequenced roadmap your team can execute with confidence. Every candidate carries an owner, a measured baseline, the systems it touches, the enabling work it depends on and the decision gate that releases it — so leadership can fund the first move without reopening the whole agenda.",
  },
  capabilities: {
    heading: "What you *receive*",
    lead: "Opportunity audit, readiness testing, build-versus-buy analysis and a sequenced roadmap — delivered as one decision package. Each candidate workflow is inventoried with its owner, frequency, volume, inputs, systems, exception pattern and consequence of failure, then scored on value, effort and risk so the order of work is defensible to a board, not merely persuasive in a meeting.",
  },
  differentiator: {
    heading: "A route that ends in *decisions*",
    body: "We're not tied to a platform or a delivery pipeline to protect. The output is a clear recommendation — *including where the honest answer is to wait, or not automate at all*. Judgment-led work, disputed processes, ungoverned inputs and genuinely infrequent tasks are named as such rather than dressed up as opportunities. Where a build is justified, the reasoning travels with it: the requirements, controls and measures that justified the decision are the ones delivery is tested against — whether your team builds it, a vendor does, or we do.",
  },
  comparison: {
    before: {
      title: "Tool-led AI strategy",
      body: "Starts with a product and hunts for places to deploy it. Scope follows the vendor's roadmap, the business case is written after the purchase, and the enabling work — data, ownership, policy — surfaces once the invoice is paid.",
    },
    after: {
      title: "Silverstone AI advisory route",
      body: "Starts with the operating problem and a baseline you can defend. Build, buy, configure, defer and leave alone are all permitted answers, and the recommendation carries the requirements, controls and measures delivery will be judged against.",
    },
  },
  proof: {
    heading: "*Proof*, not promises",
    lead: "Representative figures observed across Silverstone AI consulting engagements.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery *works*",
    lead: "A consulting route that ends in decisions, not another slide deck. Frame sets the leadership question and the evidence required. Investigate separates verified fact from assumption across process owners, systems and data. Prioritize scores value, effort, risk and readiness in the open. Translate turns the result into first decisions, architecture direction, governance requirements, owners and measures — with scope and access fixed in the proposal before work begins.",
  },
  faqs: {
    heading: "Questions leadership teams should *resolve*",
    items: [
      {
        q: "What do we actually get from an opportunity audit?",
        a: "Typically a workflow inventory, a prioritization matrix, readiness findings, a build-versus-buy view, and a sequenced roadmap — scoped to what you need.",
      },
      {
        q: "Is Silverstone AI tied to a particular vendor?",
        a: "No. The recommendation follows the operating requirement, and any commercial relationship is disclosed upfront.",
      },
      {
        q: "Can this support our internal technical team?",
        a: "Yes. We provide prioritization, architecture challenge and governance while your team retains implementation ownership, in the US or the UK.",
      },
      {
        q: "What happens after the roadmap is delivered?",
        a: "You choose the route — implement internally, procure a product, or scope delivery with us. The roadmap stays usable whichever you pick.",
      },

      {
        q: "How much does AI consulting cost?",
        a: "Silverstone AI consulting is priced on application, because a focused review of one workflow and a full operating audit across several functions are different pieces of work. The basis — hourly, daily or a fixed fee — is confirmed before anything starts, and the published senior AI engineer rate is [[£150|$195]] per hour where work is explicitly priced by the hour. Implementation, if you choose it later, is quoted separately against its own published bands.",
      },
      {
        q: "How long does an AI and automation consulting engagement take?",
        a: "It depends on how many workflows, stakeholders, systems and decisions are in scope. Silverstone AI does not sell a universal audit or a fixed 90-day program, because a single vendor decision and a cross-functional operating audit are not the same job. In practice, duration is set by how quickly process owners can be interviewed and system access granted. Scope, the access required and the outputs are written into the proposal before work begins.",
      },
      {
        q: "Do you work with US companies as well as UK ones?",
        a: "Yes. Silverstone AI is a London studio with US-based team members, and consulting runs for US and UK leadership teams alike. Engagements are quoted and invoiced in pounds or dollars, scheduled around your business hours, and account for where a decision differs by market — UK GDPR and Information Commissioner's Office guidance for a UK entity, sector and state-level rules for a US one, plus the CRM, telephony and finance stack each market actually runs.",
      },
      {
        q: "Should we build AI in-house, buy a tool, or configure what we already have?",
        a: "All three are legitimate outcomes, and settling that question is what the audit exists to do. Silverstone AI compares them on control, time to value, integration effort, data dependency, vendor lock-in and the cost of operating the thing for years — not the license fee alone. Often the cheapest defensible answer is configuring a platform you already pay for, or fixing the manual process first. A custom build is recommended where the workflow is genuinely differentiating.",
      },
      {
        q: "Can you review an AI vendor proposal we have already received?",
        a: "Yes. A vendor and architecture review is one of the most common reasons US and UK teams call. Silverstone AI reads the proposal against your actual workflow: what data the vendor assumes you can supply, which integrations are quoted rather than implied, who owns exceptions and monitoring after go-live, what the contract costs to leave, and whether the stated benefit can be measured against your baseline. Sometimes the finding is that the proposal is sound.",
      },
      {
        q: "What if the audit concludes we should not automate anything yet?",
        a: "That is a valid and often valuable result. Silverstone AI has no delivery pipeline to feed, so a recommendation to wait is a real outcome — usually paired with the enabling work that would change the answer: cleaning a data source, naming an owner for exceptions, simplifying a disputed process, or clarifying a policy. A process should not be automated because it is manual, but because value, readiness and risk all support it.",
      },
      {
        q: "Does the audit cover legal, privacy or security compliance?",
        a: "No. Silverstone AI consulting does not give legal advice and does not certify anything. It identifies where specialist review is required and translates the technical context so that review is quick — which data leaves your network, where it is processed, what is retained, and which decisions must stay with a named, authorized person. Your counsel, data protection lead or security team makes the ruling; UK teams usually test it against UK GDPR and ICO guidance.",
      },
      {
        q: "Who from our team needs to be involved in an opportunity audit?",
        a: "Fewer people than most leaders expect, but the right ones. Silverstone AI needs the process owners who actually run the workflows, someone who can grant read access to the relevant systems, and a decision-maker who can act on the result. Interviews are short and scheduled around operations. Engagements go badly when no process owner can take part — an audit built only from leadership assumptions describes the process the business thinks it has.",
      },
      {
        q: "Do you need access to our systems and data during the audit?",
        a: "Usually read-level access or exported samples, not production credentials or a data migration. Silverstone AI reviews source systems, data quality, ownership, identifiers, access routes and retention to judge whether a use case is actually deliverable. Where access is slow to arrange — common in larger US and UK organizations — the audit works from structure, samples and interviews, and records that dependency openly instead of assuming the data will be ready.",
      },
      {
        q: "How will we know afterwards whether the roadmap actually worked?",
        a: "Because the measurement is agreed before anything is built. Silverstone AI records the current baseline for each prioritized workflow — how long it takes, how often it runs, where it fails — then defines what would count as improvement, including the review and exception work that automation creates rather than removes. Released capacity only counts once it becomes faster service, more throughput or lower cost. A roadmap without a baseline can never be judged.",
      },
    ],
  },
  midCta: {
    heading: "Get an independent view before you *commit budget*",
    body: "Use a discovery call to scope the opportunity audit that would actually change your next decision.",
  },
  finalCta: {
    heading: "Leave with a clearer route — even when the answer is *no*",
    body: "Bring a list of ideas, a vendor proposal, or just the pressure to act. We'll help you find the decision route that actually holds up.",
    urgency:
      "Every quarter without a prioritized roadmap is another quarter of scattered, overlapping bets. The first conversation is exploratory and commits you to nothing.",
  },
};

/** Registry of rewritten copy by route. */
export const serviceCopyByRoute: Record<ApprovedServiceRoute, ServiceCopy> = {
  "/services/web-design-development": webDesignCopy,
  "/services/app-development": appDevelopmentCopy,
  "/services/ai-voice-agents": aiVoiceAgentsCopy,
  "/services/ai-receptionists": aiReceptionistsCopy,
  "/services/content-creation": contentCreationCopy,
  "/services/ai-automation": aiAutomationCopy,
  "/services/ai-consulting": aiConsultingCopy,
};
