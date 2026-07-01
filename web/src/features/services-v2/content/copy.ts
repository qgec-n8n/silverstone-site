/**
 * Concise, conversion-focused service copy (British English).
 *
 * This is the rewritten public voice for services-v2: shorter, scannable and
 * persuasive, organised around a clear commercial argument rather than the long
 * approved narrative. Benchmark *values* are still sourced from the verified
 * metrics data so exact figures/units are never altered here — this module owns
 * prose only.
 *
 * Structure covers: what Silverstone builds · the costly problem · the outcome ·
 * why Silverstone is different · what the client receives · how delivery works ·
 * verified results · the next step · a reason to act now.
 */
import type { ApprovedServiceRoute } from "~/content/services/approved-services";

export type ServicePoint = { title: string; body: string };

export type ServiceCopy = {
  eyebrow: string;
  /** Single, outcome-led H1 (kept aligned with route metadata for SEO). */
  h1: string;
  heroSub: string;
  /** Three concise capability points shown in the secondary-hero opener. */
  heroPoints: string[];
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
  eyebrow: "Bespoke web design & development",
  h1: "A website engineered to move buyers forward",
  heroSub:
    "Strategy, copy, design and engineering built as one commercial system — a bespoke site that turns qualified visitors into booked calls, not just compliments.",
  heroPoints: [
    "Scoped before we build — no guesswork",
    "From brief to launch in weeks, not quarters",
    "Wired into your CRM, calendar and follow-up",
  ],
  problem: {
    heading: "A handsome website that doesn’t convert is an expensive liability",
    body: "Most sites look the part and still lose the sale. The positioning is vague, the navigation follows your org chart, forms vanish into an inbox, and mobile gets a squeezed desktop layout. Every unanswered question is a buyer who quietly leaves — a cost that never shows up on the invoice.",
    painPoints: [
      "Visitors can’t tell what you do — or why it should be you",
      "Enquiries stall because proof and trust arrive too late",
      "Leads land in an inbox with no owner and no follow-up",
    ],
  },
  outcome: {
    heading: "What changes when the system works",
    body: "A site that makes a complex offer obvious, earns trust early, and routes every qualified enquiry straight into your calendar, CRM and follow-up. Fewer dead ends, more booked calls, and a platform your team can extend without another rebuild.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "A complete commercial website programme — not a set of disconnected hand-offs.",
  },
  differentiator: {
    heading: "One studio, not five suppliers",
    body: "Silverstone combines strategy, copy, design, engineering, AI and automation under one roof. Nothing is lost in translation between agencies, because the website is the visible edge of a working commercial system — designed around the decision a qualified buyer needs to make.",
  },
  comparison: {
    before: {
      title: "Surface-led rebuild",
      body: "Starts with appearance; treats copy, SEO and integration as later problems.",
    },
    after: {
      title: "Silverstone website system",
      body: "Starts with the buyer’s decision; builds copy, design, engineering and operations together.",
    },
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI delivery — evidence of what well-scoped systems have achieved.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "A disciplined route from commercial decision to launch and beyond.",
  },
  faqs: {
    heading: "Questions serious buyers ask",
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
        q: "Who maintains the site after launch?",
        a: "Routine content stays easy to edit while higher-risk changes stay controlled. Exact support and hand-over terms are set out in the proposal.",
      },
    ],
  },
  midCta: {
    heading: "Build the decision path before the interface expands",
    body: "Use a discovery call to pin down the offer, the proof, the pages and the integrations that deserve the first release.",
  },
  finalCta: {
    heading: "Turn your next website decision into a commercial one",
    body: "Bring a URL, a rough brief, or just the problem. We’ll map the offer, the evidence, the pages and the integrations worth building first.",
    urgency:
      "Every month a weak site stays live, it quietly costs you enquiries. The first conversation is exploratory and commits you to nothing.",
  },
};

export const appDevelopmentCopy: ServiceCopy = {
  eyebrow: "Bespoke app development",
  h1: "Build the smallest app that proves the value",
  heroSub:
    "A focused application built around one real user, one valuable task, and the system states needed to deliver it reliably — not a feature backlog dressed up as a strategy.",
  heroPoints: [
    "Scoped around the workflow, not a wish list",
    "A testable first release in weeks, not quarters",
    "AI where it helps, deterministic logic where it must be certain",
  ],
  problem: {
    heading:
      "Most app projects are over-scoped before anyone agrees what it has to prove",
    body: "Feature lists grow before the workflow is defined. Budgets stretch across screens nobody asked for. By the time it ships, no one can say whether it actually solved the problem — because the problem was never pinned down.",
    painPoints: [
      "Scope balloons before the core workflow is agreed",
      "Launch happens with no way to test whether it worked",
      "Every future change means renegotiating the whole roadmap",
    ],
  },
  outcome: {
    heading: "What a disciplined first release gets you",
    body: "A working product built around a real user and a real task — reliable enough to trust, small enough to ship fast, and structured so the next release extends it instead of rebuilding it.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "Product discovery, UX, data structure and engineering treated as one system — not four separate hand-offs.",
  },
  differentiator: {
    heading: "A release built to reduce risk, not just ship features",
    body: "We define the states your system must handle before we design a single screen — what happens when data is missing, when an action fails, when two users collide. That discipline is what makes a first release trustworthy enough to build on.",
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI delivery — evidence of what a disciplined build has achieved.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "From workflow to a testable product decision — without the scope creep.",
  },
  faqs: {
    heading: "Questions before a build begins",
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
    ],
  },
  midCta: {
    heading: "Define the workflow before the build gets expensive",
    body: "Use a discovery call to pin down the user, the task, and the states your system has to handle — before a single screen gets designed.",
  },
  finalCta: {
    heading: "Move from idea to a testable product decision",
    body: "Bring a rough workflow — that's enough. We'll help you see whether a first release, an improvement, or something else entirely is the right next step.",
    urgency:
      "Every quarter spent scoping a feature list is a quarter your competitors spend shipping. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiVoiceAgentsCopy: ServiceCopy = {
  eyebrow: "AI voice agents",
  h1: "Voice agents built for real conversations — and real consequences",
  heroSub:
    "Custom voice workflows that listen, respond, act and escalate within rules your business can inspect — not a demo voice bolted onto a talking FAQ.",
  heroPoints: [
    "Answers, books and escalates within rules you set",
    "Under 10 seconds response time",
    "Every uncertain call hands to a human, with context",
  ],
  problem: {
    heading: "A voice demo is easy. A voice agent that survives production isn't",
    body: "The hard part was never making a synthetic voice speak. It's building a call system that understands real intent, handles interruptions, takes permitted actions, and knows exactly when to hand over to a person — every time, not just in the demo.",
    painPoints: [
      "Missed calls become missed revenue, every single day",
      "A generic bot can't tell an urgent call from a routine one",
      "Nobody can see what the AI actually said or promised",
    ],
  },
  outcome: {
    heading: "What a production-grade voice agent changes",
    body: "Calls answered in seconds, around the clock. Bookings confirmed without a human touching the calendar. Anything sensitive or unclear routed to your team — with the context they need, not a cold transfer.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "Conversation design, speech processing, telephony, monitoring and escalation — engineered as one operating system.",
  },
  differentiator: {
    heading: "Designed for the call that goes off-script",
    body: "Real callers interrupt, change their mind, and ask things the script didn't anticipate. We design for that — with confidence thresholds, permitted actions, and a clean human handover before the agent guesses.",
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI voice deployments.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "From call intent to a monitored, production voice line.",
  },
  faqs: {
    heading: "Questions before a live line is connected",
    items: [
      {
        q: "Can the agent use our existing phone number?",
        a: "Usually, yes — depending on your carrier and telephony setup. We confirm porting, forwarding and routing during technical discovery.",
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
        a: "No — it handles bounded, repeatable call work so your team spends their time on the calls that actually need a person.",
      },
      {
        q: "Will it understand every caller?",
        a: "No system should claim universal accuracy. We test accents, names and phrasing against your real callers, and the agent hands over the moment confidence drops.",
      },
    ],
  },
  midCta: {
    heading: "Design the call before you choose a voice",
    body: "Use a discovery call to map the intents, the actions worth automating, and exactly where a human needs to stay in the loop.",
  },
  finalCta: {
    heading: "Design the call before choosing the voice",
    body: "Bring a sample call, a current script, or just the call problem that keeps repeating. We'll map the architecture that would actually hold up in production.",
    urgency:
      "Every missed call this week is a lead your competitor answered instead. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiReceptionistsCopy: ServiceCopy = {
  eyebrow: "AI receptionists",
  h1: "A front desk that answers, qualifies, and knows when to hand over",
  heroSub:
    "One governed reception layer for calls, chat and intake — answering what it should, and routing the rest to a person with full context.",
  heroPoints: [
    "Every channel converges into one governed layer",
    "+66% increase in phone availability",
    "Routine enquiries handled; the rest routed to a person",
  ],
  problem: {
    heading: "Your front desk is a system of decisions, not a script",
    body: "Callers, chat messages and web enquiries all arrive with different urgency, different detail, and different next steps. Treat them all the same way and routine requests clog your team while genuine emergencies wait in a queue.",
    painPoints: [
      "Out-of-hours enquiries go unanswered until morning",
      "Simple requests still need a human to type them up",
      "There's no single record of what was asked, and answered, where",
    ],
  },
  outcome: {
    heading: "What an integrated front desk changes",
    body: "Calls, chat and intake converge into one system that answers approved questions, books what it's allowed to book, and hands anything sensitive to a person — with the context already attached.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "Intake, triage, booking and escalation — designed and connected as a single operating layer, not disconnected tools.",
  },
  differentiator: {
    heading: "The difference between answering and operating",
    body: "A generic answering bot recites information. An operating front desk qualifies the enquiry, checks availability, updates your systems, and knows precisely when a decision needs a human — every time, not most of the time.",
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI receptionist deployments.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "Design the desk before connecting the channels.",
  },
  faqs: {
    heading: "Questions buyers should ask before choosing a provider",
    items: [
      {
        q: "Can it work outside office hours?",
        a: "Yes — configured against your approved fallback model and the availability of the systems it connects to.",
      },
      {
        q: "Can it book directly into our existing calendar?",
        a: "Often, yes. We test availability rules, confirmations and duplicate-prevention before direct booking goes live.",
      },
      {
        q: "How is personal data handled?",
        a: "Data minimisation, retention and access are reviewed for your exact implementation — never treated as a blanket compliance guarantee.",
      },
      {
        q: "Can customers always reach a person?",
        a: "A genuine human route is designed in — live transfer, callback or queue, matched to your staffing and hours, and it's always truthful about wait times.",
      },
      {
        q: "Will it understand every caller?",
        a: "No system understands every accent or phrasing perfectly. It confirms important details back and hands over the moment confidence drops.",
      },
    ],
  },
  midCta: {
    heading: "Design the desk before you connect the channels",
    body: "Use a discovery call to map what should be automated, what should stay human, and where the two need to meet.",
  },
  finalCta: {
    heading: "Make every routine enquiry reach a defined destination",
    body: "Bring your call notes, FAQs, or just the booking process as it stands today. We'll identify the smallest valuable front-desk route to start with.",
    urgency:
      "Every enquiry that goes unanswered tonight is a booking your competitor takes tomorrow. The first conversation is exploratory and commits you to nothing.",
  },
};

export const contentCreationCopy: ServiceCopy = {
  eyebrow: "Content creation & repurposing",
  h1: "Turn expertise into a governed content engine",
  heroSub:
    "A source-led system that turns your approved expertise into website, insight, email and social assets — each one earning its place, not padding a quota.",
  heroPoints: [
    "Every asset traces back to an approved source",
    "500+ campaigns run through the same operating system",
    "Human judgement stays in every approval gate",
  ],
  problem: {
    heading: "More content isn't the same as more authority",
    body: "Volume is the easy problem. The harder one is producing material that stays credible, distinct, and recognisably yours — instead of generic output that quietly erodes the trust you're trying to build.",
    painPoints: [
      "Publishing more, but rankings and enquiries stay flat",
      "Nobody owns the source material or the approval step",
      "Content reads like everyone else's AI-generated filler",
    ],
  },
  outcome: {
    heading: "What a governed content system changes",
    body: "Your real expertise, captured once and adapted across every channel with a defined approval gate — so output scales without your name ending up on something you wouldn't stand behind.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "Source capture, editorial structure, channel adaptation and approval workflow — built as one repeatable cycle.",
  },
  differentiator: {
    heading: "Atomise the idea without diluting it",
    body: "AI accelerates extraction, structuring and drafting. It doesn't replace the point of view, the accountable source, or the human sign-off that keeps every asset distinct instead of generic.",
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI content programmes.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "From source material to a repeatable content cycle.",
  },
  faqs: {
    heading: "Questions about AI, quality and publishing",
    items: [
      {
        q: "Will AI write all the content?",
        a: "AI supports extraction, structuring and drafting from your approved sources — human judgement decides what actually publishes.",
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
    ],
  },
  midCta: {
    heading: "Capture the source before scaling the output",
    body: "Use a discovery call to identify the expertise worth publishing and the approval gates that keep it credible.",
  },
  finalCta: {
    heading: "Build a system your expertise can sustain",
    body: "Bring existing documents, scattered notes, or just the expertise your business struggles to publish consistently. We'll map the system that turns it into a real content engine.",
    urgency:
      "Every month without a governed system is another month of generic content quietly working against your authority. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiAutomationCopy: ServiceCopy = {
  eyebrow: "AI automation",
  h1: "Engineer the work between your systems",
  heroSub:
    "Custom workflows connecting triggers, data, rules, AI judgement and approvals into an operating layer your team can actually inspect.",
  heroPoints: [
    "Built around consequence, not blanket autonomy",
    "98% extraction accuracy on structured documents",
    "First working automation live in 2–4 weeks",
  ],
  problem: {
    heading: "Automation fails where ownership disappears",
    body: "Most operational waste doesn't live inside one tool — it lives in the handoffs between them. A lead copied into a spreadsheet by hand. A document waiting in an inbox. A report stitched together from exports. Somewhere, an employee has quietly become the integration layer.",
    painPoints: [
      "The same manual handoff, repeated every single day",
      "No one can say why a workflow failed last Tuesday",
      "Every new automation feels like a bespoke, unrepeatable project",
    ],
  },
  outcome: {
    heading: "What an engineered operating layer changes",
    body: "Triggers, data and deterministic rules do the repeatable work. Bounded AI judgement handles what rules can't. Exceptions route to a person — and everything is logged, so your team can see exactly what happened and why.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "Triggers, data pipelines, deterministic logic, bounded AI judgement and human approval gates — engineered as one inspectable system.",
  },
  differentiator: {
    heading: "AI where judgement helps, rules where they're stronger",
    body: "We don't default to AI for everything. Deterministic logic runs wherever the rule is already known — AI earns its place only where judgement genuinely adds value, and every exception has a defined human owner.",
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI automation deployments.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "From one manual handoff to a monitored automation system.",
  },
  faqs: {
    heading: "Questions before the first workflow runs",
    items: [
      {
        q: "Which platform will you use?",
        a: "Whichever fits the requirement — n8n for complex self-hosted orchestration, Make for visual flexibility, Zapier for straightforward cloud integrations, or custom code where logic or scale demands it.",
      },
      {
        q: "Can you connect to any tool we use?",
        a: "Wherever it offers a suitable API, webhook or approved interface. We verify access and rate limits during discovery, before anything is promised.",
      },
      {
        q: "Will it run without any human involvement?",
        a: "Some bounded actions will. Others pause for approval or route to a person — the model follows consequence, not a blanket autonomy target.",
      },
      {
        q: "How do you prevent errors?",
        a: "Validation, deterministic rules, test cases, retries, logs and human review all play a part. No responsible provider promises zero errors.",
      },
    ],
  },
  midCta: {
    heading: "Trace the handoff before you automate it",
    body: "Use a discovery call to map the systems, the exceptions, and the first workflow worth automating.",
  },
  finalCta: {
    heading: "Choose the first workflow with enough care to scale",
    body: "Bring a process map, a systems list, or just the repeated task. We'll test readiness and identify where automation earns its place fastest.",
    urgency:
      "Every week you delay is another week of the same manual handoff. The first conversation is exploratory and commits you to nothing.",
  },
};

export const aiConsultingCopy: ServiceCopy = {
  eyebrow: "AI & automation consulting",
  h1: "Decide what to automate before you buy the tools",
  heroSub:
    "A senior decision layer for prioritising use cases, testing readiness, choosing build-versus-buy, and defining the controls delivery will need.",
  heroPoints: [
    "An independent view before you commit budget",
    "60% average reduction in manual operations overhead",
    "A roadmap that ends in decisions, not more options",
  ],
  problem: {
    heading:
      "The expensive mistake is choosing technology before the operating problem",
    body: "AI creates pressure to move fast — and an unusually large number of plausible wrong turns. Teams buy software before the workflow is defined. Pilots fail because the source data was never accessible. Departments procure overlapping tools that solve the same problem twice.",
    painPoints: [
      "Multiple teams buying overlapping AI tools independently",
      "A promising pilot stalls because the data was never ready",
      "No one can say which use case is actually worth pursuing first",
    ],
  },
  outcome: {
    heading: "What an independent decision layer changes",
    body: "A prioritised, evidence-based view of where automation actually pays off — with build-versus-buy decided, risk and governance defined, and a sequenced roadmap your team can execute with confidence.",
  },
  capabilities: {
    heading: "What you receive",
    lead: "Opportunity audit, readiness testing, build-versus-buy analysis and a sequenced roadmap — delivered as one decision package.",
  },
  differentiator: {
    heading: "A route that ends in decisions, not more options",
    body: "We're not tied to a platform or a delivery pipeline to protect. The output is a clear recommendation — including where the honest answer is to wait, or not automate at all.",
  },
  proof: {
    heading: "Proof, not promises",
    lead: "Representative figures observed across Silverstone AI consulting engagements.",
    attribution: SILVERSTONE_ATTRIBUTION,
    clarification: SILVERSTONE_CLARIFICATION,
  },
  process: {
    heading: "How delivery works",
    lead: "A consulting route that ends in decisions, not another slide deck.",
  },
  faqs: {
    heading: "Questions leadership teams should resolve",
    items: [
      {
        q: "What do we actually get from an opportunity audit?",
        a: "Typically a workflow inventory, a prioritisation matrix, readiness findings, a build-versus-buy view, and a sequenced roadmap — scoped to what you need.",
      },
      {
        q: "Is Silverstone tied to a particular vendor?",
        a: "No — the recommendation follows the operating requirement, and any commercial relationship is disclosed upfront.",
      },
      {
        q: "Can this support our internal technical team?",
        a: "Yes — we provide prioritisation, architecture challenge and governance while your team retains implementation ownership.",
      },
      {
        q: "What happens after the roadmap is delivered?",
        a: "You choose the route — implement internally, procure a product, or scope delivery with us. The roadmap stays usable whichever you pick.",
      },
    ],
  },
  midCta: {
    heading: "Get an independent view before you commit budget",
    body: "Use a discovery call to scope the opportunity audit that would actually change your next decision.",
  },
  finalCta: {
    heading: "Leave with a clearer route — including when the answer is no",
    body: "Bring a list of ideas, a vendor proposal, or just the pressure to act. We'll help you find the decision route that actually holds up.",
    urgency:
      "Every quarter without a prioritised roadmap is another quarter of scattered, overlapping bets. The first conversation is exploratory and commits you to nothing.",
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
