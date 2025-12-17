// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: PRICING_COPY_MAP.md

export type PricingPageId = 'services.html' | 'niches/dentists.html' | 'niches/ecommerce.html' | 'niches/estate-agents.html' | 'niches/fitness-coaches.html' | 'niches/gyms-fitness-studios.html' | 'niches/hospitality.html' | 'niches/physios-chiropractors.html' | 'niches/salons-barbers.html' | 'niches/trades-virtual-office.html';

export interface Row1Plan {
  name: string;
  badge?: string;
  setupFee: number;
  monthlyRetainer: number;
  bestFor: string;
  includes: string[];
}

export interface Row2Card {
  label: string;
  plansIncluded: string[];
  oneLiner: string;
}

export interface Row1 {
  title: string;
  subtitle: string;
  plans: Row1Plan[];
}

export interface Row2 {
  title: string;
  subtitle: string;
  cards: Row2Card[];
}

export interface PricingPageCopy {
  pageId: PricingPageId;
  row1: Row1;
  row2: Row2;
}

export type PricingCopyMap = Record<PricingPageId, PricingPageCopy>;

export const pricingCopy = {
  "services.html": {
    "pageId": "services.html",
    "row1": {
      "title": "Start with the fastest path to ROI.",
      "subtitle": "These are the three most common “done-for-you” systems—pick the one that matches your business model.",
      "plans": [
        {
          "name": "Trades Virtual Office",
          "includes": [
            "End-to-end virtual office handling calls",
            "Quote follow-up automation",
            "Scheduling flow automation",
            "Covers calls, quotes, and scheduling (as one joined-up system)",
            "Virtual office “handoff” so key job details don’t get dropped"
          ],
          "setupFee": 1299,
          "monthlyRetainer": 219,
          "bestFor": "Field-service businesses that can’t pick up the phone but don’t want to lose the best jobs."
        },
        {
          "name": "Never Miss a Viewing Pack",
          "includes": [
            "Lead capture automation (end-to-end)",
            "Lead qualification automation",
            "Viewing workflow automation (from enquiry → booked viewing)",
            "Viewing follow-up automation",
            "A single joined-up “capture → qualify → follow up” journey"
          ],
          "setupFee": 1499,
          "monthlyRetainer": 229,
          "bestFor": "Estate & lettings teams where speed-to-lead decides who wins the instruction."
        },
        {
          "name": "24/7 Guest Concierge Bot",
          "includes": [
            "Web/WhatsApp concierge bot (always-on)",
            "Answers guest FAQs",
            "Captures reservation requests",
            "Hands off to booking system",
            "Converts “questions” into captured booking intent"
          ],
          "setupFee": 550,
          "monthlyRetainer": 139,
          "bestFor": "Hospitality venues that need always-on answers + booking capture without extra headcount."
        }
      ]
    },
    "row2": {
      "title": "Prefer a smaller fix—or a niche-specific variant?",
      "subtitle": "Choose a focused module or a different bundle if your biggest bottleneck is narrower than the full system.",
      "cards": [
        {
          "label": "Property & Trades — all other options",
          "plansIncluded": [
            "**Real Estate:** Never-Miss-a-Viewing Call Saver (£399 setup + £99/mo), Viewing Follow-Up & Nurture (£450 setup + £79/mo), Landlord Onboarding & Compliance Flow (£595 setup + £89/mo), 24/7 Property Lead Gatekeeper (£650 setup + £149/mo), Estate Agent Starter Pack (£999 setup + £189/mo), Landlord Growth Suite (£1399 setup + £199/mo), Estate Office Automation Pack (£2399 setup + £299/mo), Estate Agent Domination Pack (£2799 setup + £399/mo)",
            "**Trades:** Local Review Booster (£220 setup + £39/mo), Quote Chaser Text Flow (£275 setup + £55/mo), Emergency Call Saver (£350 setup + £79/mo), Jobs Board & Scheduling (£425 setup + £89/mo), Emergency Call Catcher Pack (£699 setup + £129/mo), Quote-to-Job Conversion Pack (£799 setup + £129/mo), Trades Job Board & Call Pack (£999 setup + £169/mo), Premium Trades Growth Engine (£1499 setup + £259/mo)"
          ],
          "oneLiner": "Choose these if you want a smaller “fix one leak” module or you’re scaling beyond the flagship pack."
        },
        {
          "label": "Hospitality & eCommerce — all other options",
          "plansIncluded": [
            "**Hospitality:** Menu & Event Broadcaster (£250 setup + £49/mo), Review & Reputation Booster (£320 setup + £69/mo), Last-Minute Table Filler (£375 setup + £85/mo), Restaurant & Café Starter Pack (£899 setup + £169/mo), Events & Loyal Guests Pack (£1049 setup + £189/mo), No-Show & Review Saver Pack (£1299 setup + £219/mo), Hotel Guest Journey Pack (£1699 setup + £259/mo), Hospitality Growth Engine (£1999 setup + £299/mo)",
            "**eCommerce:** Review & UGC Collector (£340 setup + £69/mo), 24/7 Order & FAQ Assistant (£520 setup + £119/mo), Customer Lifetime Value Dashboard (£560 setup + £79/mo), Cart Recovery Starter Pack (£999 setup + £179/mo), Support & Cart Pack (£1299 setup + £219/mo), LTV & Growth Pack (£1399 setup + £229/mo), E-com Growth Engine (£1599 setup + £259/mo), Premium Brand Automation Engine (£1899 setup + £299/mo)"
          ],
          "oneLiner": "Pick these if your biggest bottleneck is bookings/support load, or you need a conversion + retention system."
        },
        {
          "label": "Clinics, Beauty & Fitness — all other options",
          "plansIncluded": [
            "**Salons:** Review & Referral Engine (£230 setup + £45/mo), Chair-Filler Rebooking Flow (£260 setup + £55/mo), No-Show Saver Reminders (£280 setup + £59/mo), 24/7 Salon Receptionist (£520 setup + £129/mo), Salon No-Show Saver Pack (£749 setup + £129/mo), 24/7 Salon Receptionist Pack (£1099 setup + £189/mo), Premium Chair-Filler Suite (£1399 setup + £229/mo), Multi-Site Salon Growth Engine (£1799 setup + £299/mo)",
            "**Physios/Chiros:** Patient Review & Testimonial Booster (£295 setup + £55/mo), Treatment Plan Reminder Engine (£360 setup + £75/mo), Digital Intake & Consent Pack (£495 setup + £85/mo), Retention & Reviews Pack (£799 setup + £139/mo), Smart Intake Starter Pack (£899 setup + £159/mo), Clinic Flow Engine (£1299 setup + £199/mo), Premium Clinic Automation Suite (£1599 setup + £249/mo), Multi-Location Physio Pack (£1899 setup + £299/mo)",
            "**Dentists:** Practice Review Booster (£310 setup + £65/mo), Treatment Plan Follow-Up Flow (£380 setup + £79/mo), Recall & Hygiene Fill-Up (£420 setup + £89/mo), Recall Starter Pack (£999 setup + £179/mo), Treatment Plan Completion Pack (£1199 setup + £199/mo), Dental Growth Engine (£1499 setup + £239/mo), Multi-Surgery Dental Pack (£1799 setup + £299/mo), Premium Dental Automation Suite (£2099 setup + £339/mo)",
            "**Gyms:** Class Attendance Nudge Pack (£320 setup + £69/mo), Trial-to-Member Conversion Kit (£350 setup + £75/mo), Dormant Member Reactivation Engine (£390 setup + £89/mo), Dormant Member Starter Pack (£899 setup + £169/mo), Trial Conversion Pack (£899 setup + £169/mo), Gym Growth Engine (£1299 setup + £219/mo), Premium Gym Automation Suite (£1599 setup + £279/mo), Multi-Site Gym Pack (£1899 setup + £329/mo)",
            "**Online Coaches:** DM to Lead Triage Assistant (£310 setup + £79/mo), Coaching Client Onboarding Flow (£330 setup + £69/mo), Content Repurposing Engine (£360 setup + £79/mo), DM to Lead Starter Pack (£749 setup + £149/mo), Content & Lead Engine (£849 setup + £159/mo), Premium Coaching Automation Suite (£1099 setup + £199/mo), Launch & Waitlist Pack (£1199 setup + £209/mo), Creator Agency-Level Suite (£1399 setup + £259/mo)"
          ],
          "oneLiner": "Choose these if you need intake, rebooking, retention, review generation, or creator/gym membership journeys."
        }
      ]
    }
  },
  "niches/dentists.html": {
    "pageId": "niches/dentists.html",
    "row1": {
      "title": "Keep chairs full with recall and follow-up.",
      "subtitle": "Choose the package that matches your focus: hygiene recall, a starter bundle, or a premium optimisation suite.",
      "plans": [
        {
          "name": "Recall & Hygiene Fill-Up",
          "includes": [
            "Automated recall reminders",
            "Recall reminders for check-ups",
            "Recall reminders for hygiene appointments",
            "A structured recall automation flow (reminders as the core)",
            "Supports consistent recall without manual chasing"
          ],
          "setupFee": 420,
          "monthlyRetainer": 89,
          "bestFor": "Practices where recall inconsistency quietly creates empty chair time."
        },
        {
          "name": "Recall Starter Pack",
          "includes": [
            "Recall reminders",
            "Dental review booster included",
            "Combined recall + reviews “starter pack”",
            "Supports recall adherence and reputation signals",
            "A simple bundled starting point"
          ],
          "setupFee": 999,
          "monthlyRetainer": 179,
          "bestFor": "Practices that want recall + reputation support as a single starter bundle.",
          "badge": "Most popular"
        },
        {
          "name": "Premium Dental Automation Suite",
          "includes": [
            "Expanded reporting",
            "Quarterly optimisation",
            "Ongoing optimisation cadence (quarterly)",
            "Reporting-led continuous improvement",
            "Designed for teams that want measurement + iteration"
          ],
          "setupFee": 2099,
          "monthlyRetainer": 339,
          "bestFor": "Practices that want reporting + ongoing optimisation on top of automation."
        }
      ]
    },
    "row2": {
      "title": "More options for treatment completion and growth.",
      "subtitle": "Choose these if your biggest leak is uncompleted treatment plans or you’re scaling to multiple surgeries.",
      "cards": [
        {
          "label": "Treatment plan follow-up options",
          "plansIncluded": [
            "Treatment Plan Follow-Up Flow (£380 setup + £79/mo), Treatment Plan Completion Pack (£1199 setup + £199/mo)"
          ],
          "oneLiner": "Choose these if the biggest revenue leak is accepted treatment that never gets scheduled or completed."
        },
        {
          "label": "Growth & multi-surgery packs",
          "plansIncluded": [
            "Dental Growth Engine (£1499 setup + £239/mo), Multi-Surgery Dental Pack (£1799 setup + £299/mo)"
          ],
          "oneLiner": "Choose these if you want a broader system now, or you’re rolling out across surgeries."
        },
        {
          "label": "Reviews add-on",
          "plansIncluded": [
            "Practice Review Booster (£310 setup + £65/mo)"
          ],
          "oneLiner": "Choose this if you want a focused reputation lift without changing recall processes."
        }
      ]
    }
  },
  "niches/ecommerce.html": {
    "pageId": "niches/ecommerce.html",
    "row1": {
      "title": "Recover revenue and reduce support load.",
      "subtitle": "Choose the package that matches your growth lever: cart recovery, lifecycle automation, or premium analytics.",
      "plans": [
        {
          "name": "Abandoned Cart Recovery Flow",
          "includes": [
            "Abandoned cart trigger automation",
            "Multi-touch recovery sequence",
            "Email touchpoints",
            "SMS touchpoints",
            "Dynamic discount logic"
          ],
          "setupFee": 450,
          "monthlyRetainer": 79,
          "bestFor": "Stores with traffic but weak cart-to-checkout conversion."
        },
        {
          "name": "E-com Growth Engine",
          "includes": [
            "Conversion-focused automation",
            "Support automation",
            "Review automation",
            "Full “growth engine” bundle",
            "A combined system across conversion, support, and reviews"
          ],
          "setupFee": 1599,
          "monthlyRetainer": 259,
          "bestFor": "Brands that need conversion + support + reviews working together (not isolated tools).",
          "badge": "Most popular"
        },
        {
          "name": "Premium Brand Automation Engine",
          "includes": [
            "Cart automation",
            "Support automation",
            "Reviews automation",
            "Analytics automation",
            "Full lifecycle automation bundle"
          ],
          "setupFee": 1899,
          "monthlyRetainer": 299,
          "bestFor": "Brands that also need analytics alongside cart/support/reviews automation."
        }
      ]
    },
    "row2": {
      "title": "More options for support, LTV, and starter bundles.",
      "subtitle": "Choose these if you want a lighter-weight package focused on one outcome (support, LTV, or recovery).",
      "cards": [
        {
          "label": "Support-led bundles",
          "plansIncluded": [
            "24/7 Order & FAQ Assistant (£520 setup + £119/mo), Support & Cart Pack (£1299 setup + £219/mo)"
          ],
          "oneLiner": "Choose these if support load is the bottleneck (and conversion improves when support is faster)."
        },
        {
          "label": "LTV & analytics options",
          "plansIncluded": [
            "Customer Lifetime Value Dashboard (£560 setup + £79/mo), LTV & Growth Pack (£1399 setup + £229/mo)"
          ],
          "oneLiner": "Choose these if you want visibility into retention/cohorts to guide growth decisions."
        },
        {
          "label": "Cart/review starter alternatives",
          "plansIncluded": [
            "Review & UGC Collector (£340 setup + £69/mo), Cart Recovery Starter Pack (£999 setup + £179/mo)"
          ],
          "oneLiner": "Choose these if you want a starter bundle that improves trust signals and recovery."
        }
      ]
    }
  },
  "niches/estate-agents.html": {
    "pageId": "niches/estate-agents.html",
    "row1": {
      "title": "Book more viewings—without missing the first call.",
      "subtitle": "Pick a package based on how much of the enquiry → viewing → follow-up journey you want automated.",
      "plans": [
        {
          "name": "Never-Miss-a-Viewing Call Saver",
          "includes": [
            "Virtual number for enquiries",
            "Missed-call capture (so leads don’t disappear)",
            "Automatic SMS/WhatsApp text-back",
            "Text-back includes viewing options",
            "Basic lead log"
          ],
          "setupFee": 399,
          "monthlyRetainer": 99,
          "bestFor": "Solo/independent agents who lose instructions when calls go unanswered."
        },
        {
          "name": "Never Miss a Viewing Pack",
          "includes": [
            "Lead capture automation (end-to-end)",
            "Lead qualification automation",
            "Viewing workflow automation",
            "Viewing follow-up automation",
            "One joined-up journey rather than disconnected tools"
          ],
          "setupFee": 1499,
          "monthlyRetainer": 229,
          "bestFor": "Teams that want the full “speed-to-lead” workflow (capture → qualify → viewing → follow-up).",
          "badge": "Most popular"
        },
        {
          "name": "Estate Agent Domination Pack",
          "includes": [
            "Everything in the **Estate Office Automation Pack**",
            "Quarterly optimisation",
            "Ongoing reporting",
            "Comprehensive coverage across enquiries, viewings and landlord onboarding (via Estate Office pack)",
            "A managed “improve it every quarter” cadence"
          ],
          "setupFee": 2799,
          "monthlyRetainer": 399,
          "bestFor": "Branches that want ongoing optimisation and reporting, not a one-off build."
        }
      ]
    },
    "row2": {
      "title": "Other property workflows and scale packs.",
      "subtitle": "Choose these if you already handle leads well but want to tighten follow-up, onboarding, or office-wide operations.",
      "cards": [
        {
          "label": "Lead qualification & capture upgrades",
          "plansIncluded": [
            "24/7 Property Lead Gatekeeper (£650 setup + £149/mo), Estate Agent Starter Pack (£999 setup + £189/mo)"
          ],
          "oneLiner": "Choose these if you want 24/7 capture + qualification without the full end-to-end pack."
        },
        {
          "label": "Follow-up & landlord operations",
          "plansIncluded": [
            "Viewing Follow-Up & Nurture (£450 setup + £79/mo), Landlord Onboarding & Compliance Flow (£595 setup + £89/mo)"
          ],
          "oneLiner": "Choose these if the leak is post-viewing conversion or landlord onboarding admin."
        },
        {
          "label": "Scale packs",
          "plansIncluded": [
            "Landlord Growth Suite (£1399 setup + £199/mo), Estate Office Automation Pack (£2399 setup + £299/mo)"
          ],
          "oneLiner": "Choose these if you need a broader office-wide automation layer (beyond viewings)."
        }
      ]
    }
  },
  "niches/fitness-coaches.html": {
    "pageId": "niches/fitness-coaches.html",
    "row1": {
      "title": "Turn DMs into paying clients—without living on your phone.",
      "subtitle": "Choose based on how much you want automated: DM triage, lead-to-onboarding, or an advanced creator suite.",
      "plans": [
        {
          "name": "DM to Lead Triage Assistant",
          "includes": [
            "Categorises inbound DMs",
            "Captures email/contact details",
            "Sends basic responses automatically",
            "Reduces manual DM triage (via categorisation + replies)",
            "Turns messy DMs into a structured lead list"
          ],
          "setupFee": 310,
          "monthlyRetainer": 79,
          "bestFor": "Coaches overwhelmed by DMs who want faster replies and cleaner qualification."
        },
        {
          "name": "DM to Lead Starter Pack",
          "includes": [
            "DM triage automation",
            "Automated client onboarding flows",
            "Combined “DM → onboarding” starter system",
            "Reduces manual back-and-forth (via triage + onboarding)",
            "A single workflow from lead capture to onboarding"
          ],
          "setupFee": 749,
          "monthlyRetainer": 149,
          "bestFor": "Coaches who want DM triage plus onboarding flows so leads don’t stall.",
          "badge": "Most popular"
        },
        {
          "name": "Creator Agency-Level Suite",
          "includes": [
            "Expanded automation for multiple offers",
            "Supports creators running multiple offers (bundle designed for complexity)",
            "Reporting included",
            "Agency-level automation scope (expanded)",
            "Built for multi-offer operations rather than one funnel"
          ],
          "setupFee": 1399,
          "monthlyRetainer": 259,
          "bestFor": "Creators running multiple offers who need reporting and more advanced automation."
        }
      ]
    },
    "row2": {
      "title": "More options for onboarding, content systems, and launches.",
      "subtitle": "Choose these if you want a single workflow (onboarding, content, or waitlists) instead of a full lead engine.",
      "cards": [
        {
          "label": "Onboarding & delivery",
          "plansIncluded": [
            "Coaching Client Onboarding Flow (£330 setup + £69/mo), Premium Coaching Automation Suite (£1099 setup + £199/mo)"
          ],
          "oneLiner": "Choose these if onboarding, contracts, and fulfilment are the operational bottleneck."
        },
        {
          "label": "Content systems",
          "plansIncluded": [
            "Content Repurposing Engine (£360 setup + £79/mo), Content & Lead Engine (£849 setup + £159/mo)"
          ],
          "oneLiner": "Choose these if you want content repurposing connected to lead capture."
        },
        {
          "label": "Launch variants",
          "plansIncluded": [
            "Launch & Waitlist Pack (£1199 setup + £209/mo)"
          ],
          "oneLiner": "Choose this if you run cohort launches and want waitlist-first workflows."
        }
      ]
    }
  },
  "niches/gyms-fitness-studios.html": {
    "pageId": "niches/gyms-fitness-studios.html",
    "row1": {
      "title": "Convert more trials—and keep members longer.",
      "subtitle": "Choose the package that matches your biggest retention lever: reactivation, full growth automation, or premium optimisation.",
      "plans": [
        {
          "name": "Dormant Member Reactivation Engine",
          "includes": [
            "Win-back campaign workflows",
            "Targets frozen members",
            "Targets cancelled members",
            "Automated win-back sequences",
            "Focused reactivation journeys for lapsed members"
          ],
          "setupFee": 390,
          "monthlyRetainer": 89,
          "bestFor": "Gyms leaking revenue through freezes/cancellations and inconsistent win-back."
        },
        {
          "name": "Gym Growth Engine",
          "includes": [
            "Reactivation automation",
            "Trial conversion automation",
            "Attendance automation",
            "Comprehensive growth engine bundle",
            "Combined “retain + convert + nudge attendance” coverage"
          ],
          "setupFee": 1299,
          "monthlyRetainer": 219,
          "bestFor": "Operators who want retention + trials + attendance automation in one joined-up system.",
          "badge": "Most popular"
        },
        {
          "name": "Premium Gym Automation Suite",
          "includes": [
            "Everything in **Gym Growth Engine**",
            "Quarterly optimisation",
            "Reporting",
            "A managed “improve it every quarter” cadence",
            "Reporting-led iteration over time"
          ],
          "setupFee": 1599,
          "monthlyRetainer": 279,
          "bestFor": "Teams that want the Growth Engine plus measurement and quarterly iteration."
        }
      ]
    },
    "row2": {
      "title": "More options for attendance, trials, and multi-site growth.",
      "subtitle": "Choose these if you want a lightweight module or you’re expanding to multiple locations.",
      "cards": [
        {
          "label": "Attendance & habits",
          "plansIncluded": [
            "Class Attendance Nudge Pack (£320 setup + £69/mo), Trial-to-Member Conversion Kit (£350 setup + £75/mo)"
          ],
          "oneLiner": "Choose these if you want lightweight habit-building and trial conversion before a full engine."
        },
        {
          "label": "Starter packs (reactivation / trials)",
          "plansIncluded": [
            "Dormant Member Starter Pack (£899 setup + £169/mo), Trial Conversion Pack (£899 setup + £169/mo)"
          ],
          "oneLiner": "Choose these if you want a packaged “starter system” without going full Growth Engine."
        },
        {
          "label": "Scale",
          "plansIncluded": [
            "Multi-Site Gym Pack (£1899 setup + £329/mo)"
          ],
          "oneLiner": "Choose this if you need multi-site rollout and central dashboards."
        }
      ]
    }
  },
  "niches/hospitality.html": {
    "pageId": "niches/hospitality.html",
    "row1": {
      "title": "Capture more bookings—even when you’re slammed.",
      "subtitle": "Choose the package that matches your biggest revenue leak: enquiries, no-shows, or guest experience.",
      "plans": [
        {
          "name": "Last-Minute Table Filler",
          "includes": [
            "Automation triggers on cancellations",
            "Contacts waitlists automatically",
            "Contacts recent enquirers automatically",
            "Offers freed-up slots fast",
            "Designed to refill gaps without manual chasing"
          ],
          "setupFee": 375,
          "monthlyRetainer": 85,
          "bestFor": "Restaurants losing revenue to cancellations and empty last-minute slots."
        },
        {
          "name": "24/7 Guest Concierge Bot",
          "includes": [
            "Web/WhatsApp bot for guest messages",
            "Answers FAQs",
            "Captures reservation requests",
            "Hands off to booking system",
            "Reduces missed enquiries outside opening hours"
          ],
          "setupFee": 550,
          "monthlyRetainer": 139,
          "bestFor": "Venues that need always-on answers + booking capture during busy shifts.",
          "badge": "Most popular"
        },
        {
          "name": "Hospitality Growth Engine",
          "includes": [
            "Full guest concierge capability",
            "No-show filler journeys",
            "Review engine automation",
            "Campaign/menu/event broadcast automation",
            "A combined “concierge + fill + reviews + broadcasts” bundle"
          ],
          "setupFee": 1999,
          "monthlyRetainer": 299,
          "bestFor": "Operators who want one joined-up system for guest comms, reviews, and demand."
        }
      ]
    },
    "row2": {
      "title": "More options for promos, reviews, and venue-specific packs.",
      "subtitle": "Choose these if you want a focused module (like reviews) or a starter pack tailored to your venue type.",
      "cards": [
        {
          "label": "Promotions & demand generation",
          "plansIncluded": [
            "Menu & Event Broadcaster (£250 setup + £49/mo), Events & Loyal Guests Pack (£1049 setup + £189/mo)"
          ],
          "oneLiner": "Choose these if you need repeat footfall and event/promo broadcasting."
        },
        {
          "label": "Reviews & no-show defence",
          "plansIncluded": [
            "Review & Reputation Booster (£320 setup + £69/mo), No-Show & Review Saver Pack (£1299 setup + £219/mo)"
          ],
          "oneLiner": "Choose these if the biggest loss is reputation + no-shows (not bookings volume)."
        },
        {
          "label": "Venue starter packs",
          "plansIncluded": [
            "Restaurant & Café Starter Pack (£899 setup + £169/mo), Hotel Guest Journey Pack (£1699 setup + £259/mo)"
          ],
          "oneLiner": "Choose these if you want a packaged “starter system” tuned to your venue type."
        }
      ]
    }
  },
  "niches/physios-chiropractors.html": {
    "pageId": "niches/physios-chiropractors.html",
    "row1": {
      "title": "Reduce admin and keep patients on plan.",
      "subtitle": "Choose the package that fixes your biggest leak: intake friction, adherence, or end-to-end clinic flow.",
      "plans": [
        {
          "name": "Digital Intake & Consent Pack",
          "includes": [
            "Online intake forms",
            "Consent capture",
            "Secure data storage",
            "Integration with practice tools",
            "A single digital intake + consent workflow"
          ],
          "setupFee": 495,
          "monthlyRetainer": 85,
          "bestFor": "Clinics buried in onboarding admin and inconsistent intake data."
        },
        {
          "name": "Smart Intake Starter Pack",
          "includes": [
            "Digital intake workflow",
            "Treatment plan reminders",
            "Combined “intake + reminders” starter system",
            "Reduces manual follow-up chasing (via reminders)",
            "Helps patients stay on plan (via reminders)"
          ],
          "setupFee": 899,
          "monthlyRetainer": 159,
          "bestFor": "Clinics that want intake + reminders working together to reduce chasing.",
          "badge": "Most popular"
        },
        {
          "name": "Premium Clinic Automation Suite",
          "includes": [
            "Everything in **Clinic Flow Engine**",
            "End-to-end patient journey automation (intake → review)",
            "Quarterly optimisation",
            "Reporting",
            "A managed “improve it over time” cadence"
          ],
          "setupFee": 1599,
          "monthlyRetainer": 249,
          "bestFor": "Multi-clinician teams that want ongoing optimisation and reporting, not a set-and-forget build."
        }
      ]
    },
    "row2": {
      "title": "More options for reviews, retention, and scale.",
      "subtitle": "Choose these if you want a targeted module (reviews or reminders) or you’re rolling out across locations.",
      "cards": [
        {
          "label": "Reviews & retention",
          "plansIncluded": [
            "Patient Review & Testimonial Booster (£295 setup + £55/mo), Retention & Reviews Pack (£799 setup + £139/mo)"
          ],
          "oneLiner": "Choose these if trust-building and repeat visits are the fastest lever."
        },
        {
          "label": "Treatment adherence & journey",
          "plansIncluded": [
            "Treatment Plan Reminder Engine (£360 setup + £75/mo), Clinic Flow Engine (£1299 setup + £199/mo)"
          ],
          "oneLiner": "Choose these if “patients not staying on plan” is the core utilisation issue."
        },
        {
          "label": "Scale",
          "plansIncluded": [
            "Multi-Location Physio Pack (£1899 setup + £299/mo)"
          ],
          "oneLiner": "Choose this if you need multi-site configuration and rollout."
        }
      ]
    }
  },
  "niches/salons-barbers.html": {
    "pageId": "niches/salons-barbers.html",
    "row1": {
      "title": "Fill chairs and reduce no-shows—on autopilot.",
      "subtitle": "Pick based on whether you need reminders, a full rebook+review system, or an all-in suite.",
      "plans": [
        {
          "name": "No-Show Saver Reminders",
          "includes": [
            "SMS/WhatsApp reminders",
            "Confirm link (one-tap)",
            "Cancel link (one-tap)",
            "Automatic slot release on cancellation",
            "Faster chance to refill the gap"
          ],
          "setupFee": 280,
          "monthlyRetainer": 59,
          "bestFor": "Salons with steady bookings but too many DNAs/cancellations."
        },
        {
          "name": "Rebook & Review Pack",
          "includes": [
            "No-show prevention flows",
            "Rebooking nudges",
            "Review automation",
            "Bundled “pre + post appointment” communication",
            "Designed to lift repeat visits with less manual chasing"
          ],
          "setupFee": 949,
          "monthlyRetainer": 159,
          "bestFor": "Teams wanting a “keep columns full” system (reduce no-shows + increase rebooking).",
          "badge": "Most popular"
        },
        {
          "name": "Premium Chair-Filler Suite",
          "includes": [
            "Reminder automation",
            "Rebooking automation",
            "Reviews automation",
            "Phone handling automation",
            "Full “chair-filler” coverage in one suite"
          ],
          "setupFee": 1399,
          "monthlyRetainer": 229,
          "bestFor": "Busy salons that also need phone handling alongside diary optimisation."
        }
      ]
    },
    "row2": {
      "title": "More options for reviews, reception, and scaling.",
      "subtitle": "Choose these if you want a single-purpose module or you’re expanding beyond one location.",
      "cards": [
        {
          "label": "Reviews & retention add-ons",
          "plansIncluded": [
            "Review & Referral Engine (£230 setup + £45/mo), Chair-Filler Rebooking Flow (£260 setup + £55/mo)"
          ],
          "oneLiner": "Choose these if your priority is repeat visits and referrals (without changing your booking stack)."
        },
        {
          "label": "Reception & enquiries",
          "plansIncluded": [
            "24/7 Salon Receptionist (£520 setup + £129/mo), 24/7 Salon Receptionist Pack (£1099 setup + £189/mo)"
          ],
          "oneLiner": "Choose these if calls/DMs are the bottleneck and you need always-on answers."
        },
        {
          "label": "No-shows & scale-up packs",
          "plansIncluded": [
            "Salon No-Show Saver Pack (£749 setup + £129/mo), Multi-Site Salon Growth Engine (£1799 setup + £299/mo)"
          ],
          "oneLiner": "Choose these if you want a bigger pack now, or you’re scaling beyond one location."
        }
      ]
    }
  },
  "niches/trades-virtual-office.html": {
    "pageId": "niches/trades-virtual-office.html",
    "row1": {
      "title": "Stop missing calls—and win better jobs.",
      "subtitle": "Choose the level of support you need: missed-call capture, full virtual office, or a managed growth system.",
      "plans": [
        {
          "name": "Emergency Call Saver",
          "includes": [
            "Call flow configured for trade enquiries",
            "AI agent captures missed calls",
            "Triage urgency questions",
            "Texts you the key details",
            "Prioritises emergency work through structured triage"
          ],
          "setupFee": 350,
          "monthlyRetainer": 79,
          "bestFor": "Trades losing urgent jobs because they can’t answer on site."
        },
        {
          "name": "Trades Virtual Office",
          "includes": [
            "End-to-end virtual office handling calls",
            "Quote follow-up automation",
            "Scheduling automation",
            "One joined-up “calls → quotes → booking” workflow",
            "Less manual admin to keep the pipeline moving"
          ],
          "setupFee": 1299,
          "monthlyRetainer": 219,
          "bestFor": "Teams that want calls, quotes, and scheduling handled end-to-end.",
          "badge": "Most popular"
        },
        {
          "name": "Premium Trades Growth Engine",
          "includes": [
            "Comprehensive system from first call to final review",
            "“First call” capture and qualification",
            "Quote-to-job conversion automation (journey-level)",
            "Post-job review automation (journey-level)",
            "Full journey coverage rather than isolated fixes"
          ],
          "setupFee": 1499,
          "monthlyRetainer": 259,
          "bestFor": "Operators who want the full customer journey (incl. reputation) systemised."
        }
      ]
    },
    "row2": {
      "title": "More options for reviews, scheduling, and conversion.",
      "subtitle": "Choose these if you want a focused improvement (like quotes or reviews) without a full virtual office build.",
      "cards": [
        {
          "label": "Reputation & quote follow-up",
          "plansIncluded": [
            "Local Review Booster (£220 setup + £39/mo), Quote Chaser Text Flow (£275 setup + £55/mo)"
          ],
          "oneLiner": "Choose these if the leak is “quotes not converting” or weak local review volume."
        },
        {
          "label": "Scheduling & job tracking",
          "plansIncluded": [
            "Jobs Board & Scheduling (£425 setup + £89/mo), Trades Job Board & Call Pack (£999 setup + £169/mo)"
          ],
          "oneLiner": "Choose these if scheduling and job logging are costing evenings/weekends."
        },
        {
          "label": "Conversion packs",
          "plansIncluded": [
            "Emergency Call Catcher Pack (£699 setup + £129/mo), Quote-to-Job Conversion Pack (£799 setup + £129/mo)"
          ],
          "oneLiner": "Choose these if you want a packaged upgrade without going full “Virtual Office”."
        }
      ]
    }
  }
} satisfies PricingCopyMap;

export const pricingPageIds = [
  "services.html",
  "niches/dentists.html",
  "niches/ecommerce.html",
  "niches/estate-agents.html",
  "niches/fitness-coaches.html",
  "niches/gyms-fitness-studios.html",
  "niches/hospitality.html",
  "niches/physios-chiropractors.html",
  "niches/salons-barbers.html",
  "niches/trades-virtual-office.html"
] as const;
