from pathlib import Path
from textwrap import dedent

niches = [
    {
        "slug": "real-estate",
        "name": "Estate Agents",
        "variant": "violet",
        "title": "Estate Agent Automation – Never Miss a Viewing",
        "subtitle": "24/7 lead capture, viewing scheduling and follow-up tuned for portals, calls and walk-ins.",
        "bundle": "Never Miss a Viewing Pack",
        "bundle_tagline": "AI receptionist and viewing flows so no portal lead gets away.",
        "pains": [
            "Portal leads and late-night calls go unanswered before competitors respond.",
            "Viewings slip through because diaries and negotiators aren’t synced.",
            "Post-viewing follow-up is inconsistent so hot buyers go cold.",
        ],
        "features": [
            "24/7 AI receptionist for portal, web and phone leads with instant acknowledgement.",
            "Viewing scheduler that syncs negotiator calendars and sends confirmations.",
            "Automated post-viewing follow-up and feedback capture so you can prioritise serious buyers.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_realestate_phone-map_never-miss-a-viewing.jpg", "caption": "Instant replies to portal leads."},
            {"file": "assets/images/socialmedia/2-3_realestate_phone-with-house-icon_focus-on-the-viewing.jpg", "caption": "Diary-aware viewing slots."},
            {"file": "assets/images/socialmedia/2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.jpg", "caption": "Lead qualification before you call back."},
        ],
        "proof": [
            {"title": "Faster viewing confirmations", "tagline": "Minutes, not hours", "text": "Automated replies log enquiries instantly so buyers lock in a slot before they browse elsewhere."},
            {"title": "Fewer missed appointments", "tagline": "Reminders & updates", "text": "Diary-sync reminders reduce no-shows and keep both negotiators and buyers aligned."},
            {"title": "Time back for valuations", "tagline": "Less admin drag", "text": "Agents typically reclaim hours each week when follow-up, feedback and triage run automatically."},
        ],
    },
    {
        "slug": "hospitality",
        "name": "Hospitality",
        "variant": "teal",
        "title": "Hospitality Guest Concierge – Always On",
        "subtitle": "Answer bookings, FAQs and review invites automatically for hotels, B&Bs and restaurants.",
        "bundle": "Hospitality 24/7 Guest Concierge",
        "bundle_tagline": "Front-of-house coverage without hiring a night shift.",
        "pains": [
            "Phones and DMs spike after hours when front desk is offline.",
            "Teams waste time repeating Wi‑Fi, parking and menu answers.",
            "Review invites and feedback requests happen ad hoc, hurting ratings.",
        ],
        "features": [
            "Always-on Q&A for menus, parking, check-in and allergen details.",
            "Table and room booking assistant with confirmations and reminders.",
            "Automated review invites and feedback routing to catch issues early.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_hospitality_holographic-receptionist_your-front-desk-always-open.jpg", "caption": "Front desk coverage 24/7."},
            {"file": "assets/images/socialmedia/3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.jpg", "caption": "Faster table and booking replies."},
            {"file": "assets/images/socialmedia/2-3_kitchen_modern-kitchen-with-floorplan_capture-every-dream-kitchen-enquiry.jpg", "caption": "Capture every private-dining enquiry."},
        ],
        "proof": [
            {"title": "More confirmed bookings", "tagline": "Reply instantly", "text": "Auto-replies reduce drop-off when guests call or message out of hours."},
            {"title": "Happier guests", "tagline": "Consistent info", "text": "FAQs stay consistent so guests arrive prepared and staff avoid repeats."},
            {"title": "Better reviews", "tagline": "Prompt invites", "text": "Structured review invites keep feedback flowing while memories are fresh."},
        ],
    },
    {
        "slug": "salons-barbers",
        "name": "Salons & Barbers",
        "variant": "rose",
        "title": "Salon Automation – Keep Chairs Full",
        "subtitle": "Reduce no-shows, rebook fast and keep the front desk calm during peak hours.",
        "bundle": "Chair-Filler Automation Suite",
        "bundle_tagline": "Reminders and rebooking that run while you focus on clients.",
        "pains": [
            "No-shows leave empty chairs and lost revenue.",
            "Front desk gets swamped answering the same pricing and availability questions.",
            "Rebooking relies on memory so clients drift to competitors.",
        ],
        "features": [
            "Automated reminders with one-tap confirm/reschedule to cut no-shows.",
            "AI receptionist for FAQs on pricing, timings and services.",
            "Rebooking prompts sent after each visit to keep clients on the calendar.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_salon_dark-chair-with-calendar_stay-fully-booked-stay-present.jpg", "caption": "Reminders that protect your chair time."},
            {"file": "assets/images/socialmedia/2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg", "caption": "Spa confirmations without phone tag."},
            {"file": "assets/images/socialmedia/2-3_business_smartphone-with-message_ai-just-booked-your-next-client.jpg", "caption": "Rebookings triggered automatically."},
        ],
        "proof": [
            {"title": "Fewer no-shows", "tagline": "Reminders that stick", "text": "Clients receive confirmations and nudges so empty chairs become rare."},
            {"title": "Quicker rebooking", "tagline": "Stay top-of-mind", "text": "Follow-up prompts keep regulars returning before they drift."},
            {"title": "Calmer front desk", "tagline": "FAQs handled", "text": "AI handles pricing and availability questions while stylists stay focused."},
        ],
    },
    {
        "slug": "trades",
        "name": "Trades & Field Services",
        "variant": "copper",
        "title": "Trades Virtual Office – Catch Every Job",
        "subtitle": "For plumbers, electricians, cleaners and field teams who can’t sit by the phone.",
        "bundle": "Trades Virtual Office",
        "bundle_tagline": "Dispatch, triage and quote follow-up without extra office staff.",
        "pains": [
            "Missed emergency calls while on ladders or driving.",
            "Quotes go cold because follow-up happens after hours.",
            "Job details get lost between calls, texts and WhatsApps.",
        ],
        "features": [
            "AI call answer with emergency routing and job triage questions.",
            "Automated quote chasers and reminder sequences to win work.",
            "Simple scheduler that syncs crews, vans and location details.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_tradesman_van-at-night_never-miss-an-emergency-job.jpg", "caption": "Catch emergency jobs day or night."},
            {"file": "assets/images/socialmedia/2-3_cleaning_phone-with-booked-job_turn-every-missed-ring.jpg", "caption": "Log every incoming request automatically."},
            {"file": "assets/images/socialmedia/2-3_cleaning_phone-with-weekly-job_turn-every-missed-ring-into-regular-client.jpg", "caption": "Nurture leads into recurring clients."},
        ],
        "proof": [
            {"title": "More booked jobs", "tagline": "Instant pickup", "text": "Emergency callers reach you even when you’re on-site or underground."},
            {"title": "Higher quote conversion", "tagline": "Persistent follow-up", "text": "Automated chasers keep you front-of-mind until the job is scheduled."},
            {"title": "Cleaner dispatch", "tagline": "Fewer mix-ups", "text": "Structured intake means crews arrive with the right kit and notes."},
        ],
    },
    {
        "slug": "ecommerce",
        "name": "eCommerce Brands",
        "variant": "aqua",
        "title": "E‑Com Growth Engine – Convert & Retain",
        "subtitle": "Recover abandoned carts, answer order questions and drive repeat purchases automatically.",
        "bundle": "E‑Com Growth Engine",
        "bundle_tagline": "On-site, in-inbox and in-DMs support to keep customers buying.",
        "pains": [
            "Abandoned carts with no structured recovery.",
            "Support queues for order status and returns overwhelm small teams.",
            "Repeat purchases are ad hoc instead of a predictable rhythm.",
        ],
        "features": [
            "On-site and email cart recovery with personalised incentives.",
            "Order-status and FAQ chatbot that deflects tickets without hiding humans.",
            "Review, referral and replenishment sequences to lift LTV.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg", "caption": "Every DM, call and WhatsApp answered."},
            {"file": "assets/images/socialmedia/3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.jpg", "caption": "Revenue stays moving overnight."},
            {"file": "assets/images/socialmedia/3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.jpg", "caption": "Guided shoppers convert faster."},
        ],
        "proof": [
            {"title": "More recovered carts", "tagline": "Timely nudges", "text": "Sequenced reminders bring shoppers back before they forget."},
            {"title": "Lean support", "tagline": "Ticket deflection", "text": "Order bots answer status questions instantly while humans handle edge cases."},
            {"title": "Higher repeat buys", "tagline": "LTV focus", "text": "Replenishment and review flows encourage second and third purchases."},
        ],
    },
    {
        "slug": "physio-chiro",
        "name": "Physio & Chiro Clinics",
        "variant": "mint",
        "title": "Smart Intake & Rebooking for Clinics",
        "subtitle": "Streamlined intake, reminders and plan adherence for physio and chiro teams.",
        "bundle": "Smart Intake & Rebooking Hub",
        "bundle_tagline": "From first enquiry to treatment-plan reminders without extra admin.",
        "pains": [
            "8am phone rush leads to voicemail and frustrated patients.",
            "Paper intake slows clinicians before sessions start.",
            "Follow-up and recall rely on manual calls that slip through the cracks.",
        ],
        "features": [
            "Digital intake and triage so clinicians start with better context.",
            "Automated reminders and check-ins to reduce no-shows and cancellations.",
            "Plan-based rebooking prompts so patients complete their course of care.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_healthcare_call-queue_end-the-8am-phone-chaos.jpg", "caption": "End the 8am phone scramble."},
            {"file": "assets/images/socialmedia/2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg", "caption": "Smooth digital intake before arrival."},
            {"file": "assets/images/socialmedia/2-3_healthcare_dark-call-queue_end-the-8am-phone-chaos.jpg", "caption": "Reminders that keep diaries full."},
        ],
        "proof": [
            {"title": "Lower no-shows", "tagline": "Reminders & pre-visit info", "text": "Patients receive confirmations plus pre-appointment guidance so attendance stays high."},
            {"title": "Faster onboarding", "tagline": "Structured intake", "text": "Digital forms capture history before the first appointment, saving time in the room."},
            {"title": "Better adherence", "tagline": "Planned follow-up", "text": "Scheduled prompts keep patients on their treatment plans without manual chasing."},
        ],
    },
    {
        "slug": "dentists",
        "name": "Dentists",
        "variant": "ice",
        "title": "Dental Recall & Hygiene Booster",
        "subtitle": "Automated recalls, treatment reminders and reputation flows for modern practices.",
        "bundle": "Recall & Hygiene Booster",
        "bundle_tagline": "Full diaries and happier patients without endless phone calls.",
        "pains": [
            "Recall lists are worked manually so hygiene slots stay half-full.",
            "Patients forget treatment follow-ups once they leave the chair.",
            "Reviews and feedback requests happen sporadically.",
        ],
        "features": [
            "Automated recall schedules for check-ups and hygiene visits.",
            "Treatment-plan reminders and pre/post-visit instructions.",
            "Review prompts and satisfaction loops to protect your reputation.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_dental_phone-with-schedule_every-patient-call-answered.jpg", "caption": "Every patient call acknowledged."},
            {"file": "assets/images/socialmedia/2-3_dental_black-phone-appointments_never-miss-toothache.jpg", "caption": "Urgent appointments triaged fast."},
            {"file": "assets/images/socialmedia/2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg", "caption": "Recall prompts keep diaries full."},
        ],
        "proof": [
            {"title": "Fuller hygiene books", "tagline": "Predictable recalls", "text": "Automated schedules nudge patients before they lapse."},
            {"title": "Better follow-through", "tagline": "Treatment reminders", "text": "Plan-based reminders improve attendance for follow-up work."},
            {"title": "Stronger reputation", "tagline": "Reviews on repeat", "text": "Consistent review invites lift ratings without feeling pushy."},
        ],
    },
    {
        "slug": "gyms",
        "name": "Gyms & Studios",
        "variant": "electric",
        "title": "Membership Reactivation for Gyms & Studios",
        "subtitle": "Reactivate dormant members, reduce churn and keep classes full automatically.",
        "bundle": "Membership Reactivation Engine",
        "bundle_tagline": "Engagement nudges and win-back offers that run every week.",
        "pains": [
            "Trials and leads stall because responses are slow outside reception hours.",
            "Attendance drops quietly until members cancel.",
            "Coaches lose time chasing bookings instead of coaching.",
        ],
        "features": [
            "Instant responses to trials and membership enquiries with booking links.",
            "Attendance nudges and churn-risk signals to re-engage members.",
            "Win-back offers and referrals sequences to fill classes.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/2-3_gym_phone-trial-ring_ai-calls-every-new-lead.jpg", "caption": "Trials booked while you coach."},
            {"file": "assets/images/socialmedia/2-3_fitness_phone-with-schedule_ai-powers-your-fitness-journey.jpg", "caption": "Schedule nudges keep members active."},
            {"file": "assets/images/socialmedia/2-3_business_smartphone-with-message_ai-just-booked-your-next-client.jpg", "caption": "Automated follow-up for class spots."},
        ],
        "proof": [
            {"title": "More trial conversions", "tagline": "Fast follow-up", "text": "Leads get an immediate invite to pick a class or consult."},
            {"title": "Higher attendance", "tagline": "Timely nudges", "text": "Members receive check-ins and reminders before they drift."},
            {"title": "Lower churn", "tagline": "Reactivation flows", "text": "Win-back offers trigger before cancellations become final."},
        ],
    },
    {
        "slug": "online-coaches",
        "name": "Online Coaches & Influencers",
        "variant": "sunset",
        "title": "DM to Client Conversion Kit",
        "subtitle": "Turn DMs, comments and emails into booked, paid clients without manual back-and-forth.",
        "bundle": "DM to Client Conversion Kit",
        "bundle_tagline": "Automated triage, booking and onboarding for remote coaching.",
        "pains": [
            "DMs pile up and hot prospects vanish while you’re delivering sessions.",
            "Manual payment links and onboarding sequences slow down sales.",
            "Leads aren’t qualified, so calls get booked with the wrong people.",
        ],
        "features": [
            "DM triage bot that qualifies leads and shares the right booking link.",
            "Automated payment-link flows and contract steps once someone says yes.",
            "Onboarding sequences with forms, expectations and check-in cadence.",
        ],
        "gallery": [
            {"file": "assets/images/socialmedia/3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg", "caption": "Replies land while you’re coaching."},
            {"file": "assets/images/socialmedia/3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.jpg", "caption": "Qualify and route leads instantly."},
            {"file": "assets/images/socialmedia/1-1_business_monitor-graphs_10k-lost-overnight.jpg", "caption": "Track conversion without spreadsheets."},
        ],
        "proof": [
            {"title": "More booked calls", "tagline": "Always-on DMs", "text": "Prospects get a tailored link right after they reach out, not hours later."},
            {"title": "Cleaner pipelines", "tagline": "Qualified leads", "text": "Triage questions keep discovery calls focused on buyers, not browsers."},
            {"title": "Faster onboarding", "tagline": "Payments + forms", "text": "Payment links, forms and check-ins trigger automatically after the call."},
        ],
    },
]

footer_html = dedent(
    """
    <!-- Global site footer -->
    <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <img class="footer-logo" src="assets/logo/silverstone-logo-cropped-whitebg-v2.png" alt="Silverstone Logo">
        <p class="tagline">Streamline. Optimize. Succeed.</p>
        <p class="mission">Empowering businesses through intelligent automation to streamline workflows, optimise operations and succeed in the digital age.</p>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="book.html">Book</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Contact Us</h4>
        <p><i class="fa-solid fa-location-dot"></i> 4 Deacon Street, SE17 1GE, London, UK</p>
        <p><i class="fa-solid fa-envelope"></i> <a href="mailto:info@silverstone-ai.com">info@silverstone-ai.com</a></p>
      </div>
      <div class="footer-social">
        <h4>Follow Us</h4>
        <div class="social-icons">
          <a href="https://www.instagram.com/silverstone.ai/" target="_blank" rel="noopener" aria-label="Instagram (@silverstone.ai)"><i class="fa-brands fa-instagram"></i></a>
          <a href="https://www.tiktok.com/@silverstone_ai" target="_blank" rel="noopener" aria-label="TikTok (@silverstone_ai)"><i class="fa-brands fa-tiktok"></i></a>
          <a href="https://www.facebook.com/people/Silverstone-AI/61583930930530/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">© 2025 Silverstone. All rights reserved.</div>
  </footer>
    """
)

nav_html = dedent(
    """
      <nav>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li class="has-dropdown">
            <a href="services.html" class="services-link">Services</a>
            <button class="dropdown-trigger" type="button" aria-label="Toggle Services menu"><span class="chevron"></span></button>
            <ul class="dropdown-menu">
              <li><a href="services.html">General</a></li>
              <li><a href="real-estate.html">Estate Agents</a></li>
              <li><a href="hospitality.html">Hospitality</a></li>
              <li><a href="salons-barbers.html">Salons &amp; Barbers</a></li>
              <li><a href="trades.html">Trades &amp; Field Services</a></li>
              <li><a href="ecommerce.html">eCommerce Brands</a></li>
              <li><a href="physio-chiro.html">Physio &amp; Chiro Clinics</a></li>
              <li><a href="dentists.html">Dentists</a></li>
              <li><a href="gyms.html">Gyms &amp; Studios</a></li>
              <li><a href="online-coaches.html">Online Coaches &amp; Influencers</a></li>
            </ul>
          </li>
          <li><a href="book.html">Book</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
    """
)


def aspect_ratio(path: str) -> str:
    prefix = Path(path).name.split('_')[0]
    if '-' in prefix:
        try:
            a, b = prefix.split('-')
            return f"{a} / {b}"
        except ValueError:
            return "3 / 2"
    return "3 / 2"


def build_list(items, icon):
    return "\n".join([f"            <li><i class=\"fa-solid {icon}\"></i><span>{item}</span></li>" for item in items])

for niche in niches:
    pain_list = build_list(niche["pains"], "fa-circle-check")
    feature_list = build_list(niche["features"], "fa-rocket")
    proof_cards = []
    for p in niche["proof"]:
        proof_cards.append(
            f"        <div class=\"neon-card proof-card\">\n          <h3>{p['title']}</h3>\n          <p class=\"tagline\">{p['tagline']}</p>\n          <ul class=\"proof-list\">\n            <li><i class=\"fa-solid fa-sparkles\"></i><span>{p['text']}</span></li>\n          </ul>\n        </div>"
        )
    proof_block = "\n".join(proof_cards)

    gallery_items = []
    for g in niche["gallery"]:
        gallery_items.append(
            f"        <figure class=\"niche-image\" style=\"aspect-ratio: {aspect_ratio(g['file'])};\">\n          <img src=\"{g['file']}\" alt=\"{g['caption']}\" loading=\"lazy\" />\n          <figcaption>{g['caption']}</figcaption>\n        </figure>"
        )
    gallery_block = "\n".join(gallery_items)

    html = f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>{niche['title']} – Silverstone</title>
  <meta name=\"description\" content=\"Automation for {niche['name']}: {niche['subtitle']}\" />
  <meta name=\"robots\" content=\"index, follow\" />
  <meta property=\"og:type\" content=\"website\" />
  <meta property=\"og:url\" content=\"https://silverstone-ai.com/{niche['slug']}\" />
  <meta property=\"og:title\" content=\"{niche['title']} – Silverstone\" />
  <meta property=\"og:description\" content=\"Automation for {niche['name']}: {niche['subtitle']}\" />
  <meta property=\"og:image\" content=\"https://silverstone-ai.com/assets/logo/silverstone-logo-cropped-whitebg-v2.png\" />
  <link rel=\"canonical\" href=\"https://silverstone-ai.com/{niche['slug']}\" />
  <link href=\"https://fonts.googleapis.com\" rel=\"preconnect\" />
  <link href=\"https://fonts.gstatic.com\" rel=\"preconnect\" crossorigin />
  <link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Open+Sans:wght@400;500&family=Montserrat:wght@600&display=swap\" rel=\"stylesheet\" />
  <link rel=\"icon\" href=\"favicon.ico\" sizes=\"any\" />
  <link rel=\"stylesheet\" href=\"assets/css/styles.css\" />
  <link rel=\"stylesheet\" href=\"assets/css/custom-styles.css\" />
  <link rel=\"stylesheet\" href=\"assets/css/parallax-fix.css\" />
  <link rel=\"stylesheet\" href=\"assets/css/mobile.css\" />
  <link rel=\"stylesheet\" href=\"assets/css/icons.css\" />
  <link rel=\"stylesheet\" href=\"assets/css/hero-base.css\" />
  <style id=\"neon-fix\">.section.bg-circuit{{position:relative;isolation:isolate;}}.section.bg-circuit::before{{z-index:0;pointer-events:none;}}.section.bg-circuit>.container{{position:relative;z-index:1;}}.neon-card{{position:relative;z-index:2;}}.service-row,.service-image,.service-content{{position:relative;z-index:2;}}</style>
</head>
<body class=\"page-services niche-page\">
  <div id=\"cookie-banner\" class=\"cookie-banner\" style=\"position: fixed; bottom: 0; left: 0; right: 0; display: none;\">\n    <p>We use cookies to improve your browsing experience and to analyse website traffic. By clicking “Accept”, you consent to our use of cookies. For more details, please read our <a href=\"privacy-policy.html\">Privacy Policy</a>.</p>\n    <div class=\"cookie-actions\">\n      <button id=\"cookie-accept-btn\" class=\"btn btn-primary\">Accept</button>\n      <button id=\"cookie-decline-btn\" class=\"btn btn-secondary\">Decline</button>\n    </div>\n  </div>
  <header class=\"site-header\">\n    <div class=\"container header-inner\">\n      <a href=\"index.html\" class=\"logo\">\n        <img src=\"assets/logo/silverstone-logo-cropped-whitebg-v2.png\" srcset=\"assets/logo/silverstone-logo-cropped-whitebg-v2.png 1x, assets/logo/silverstone-logo-cropped-whitebg-v2@2x.png 2x\" alt=\"Silverstone Logo\" class=\"site-logo\" />\n      </a>\n      <div class=\"nav-toggle\" aria-label=\"Open navigation\" tabindex=\"0\">\n        <span></span><span></span><span></span>\n      </div>\n{nav_html}\n    </div>\n  </header>\n  <section class=\"hero title-band\">\n    <div class=\"hero-media\">\n      <canvas id=\"hero-shader-canvas\" data-variant=\"{niche['variant']}\"></canvas>\n    </div>\n    <div class=\"content\">\n      <h1>{niche['title']}</h1>\n      <p>{niche['subtitle']}</p>\n      <a href=\"book.html\" class=\"btn btn-primary\">Book a Free 30‑Minute Automation Audit</a>\n      <a href=\"services.html\" class=\"btn btn-secondary\" style=\"margin-left: 1rem\">Back to Services</a>\n    </div>\n  </section>\n  <section class=\"section parallax-section\" data-parallax-theme=\"book\">\n    <div class=\"container niche-wrap\">\n      <div class=\"niche-grid\">\n        <div class=\"neon-card\">\n          <h2>Why {niche['name']} call us</h2>\n          <p class=\"tagline\">We focus on the bottlenecks that waste the most time and bookings first.</p>\n          <ul class=\"icon-list\">\n{pain_list}\n          </ul>\n        </div>\n        <div class=\"neon-card\">\n          <h2>{niche['bundle']}</h2>\n          <p class=\"tagline\">{niche['bundle_tagline']}</p>\n          <ul class=\"icon-list\">\n{feature_list}\n          </ul>\n          <a href=\"book.html\" class=\"btn btn-secondary\">Start with a 30‑minute audit</a>\n        </div>\n      </div>\n      <div class=\"niche-gallery\">\n{gallery_block}\n      </div>\n      <h3 class=\"section-title\">Outcomes we target</h3>\n      <div class=\"proof-grid\">\n{proof_block}\n      </div>\n      <p class=\"small proof-disclaimer\">Outcome ranges are based on broader industry benchmarks, not guaranteed results. We’ll shape expectations during your audit.</p>\n      <div class=\"pricing-placeholder neon-card\">\n        <h3>Transparent, Affordable Pricing</h3>\n        <p>We’ll drop in our React pricing component here next. For now, your audit maps the right starting plan for {niche['name'].lower()}.</p>\n        <div id=\"pricing-{niche['slug']}-root\" class=\"pricing-root-placeholder\"></div>\n      </div>\n      <div class=\"niche-cta neon-card\">\n        <h3>How your first month works</h3>\n        <ol class=\"process-list\">\n          <li><strong>Audit (30 minutes):</strong> map the biggest leaks and quick wins.</li>\n          <li><strong>Blueprint:</strong> confirm the workflows, tools and success measures.</li>\n          <li><strong>Build & launch:</strong> we ship the first flows, you see results fast.</li>\n          <li><strong>Optimise:</strong> weekly tweaks so performance keeps climbing.</li>\n        </ol>\n        <div class=\"cta-actions\">\n          <a href=\"book.html\" class=\"btn btn-primary\">Book a Free 30‑Minute Automation Audit</a>\n          <a href=\"contact.html\" class=\"btn btn-secondary\">Talk through a custom request</a>\n        </div>\n      </div>\n    </div>\n  </section>\n{footer_html}
  <script src=\"assets/js/script.js\" defer></script>\n  <script defer src=\"assets/js/cookie-consent.js\"></script>\n  <script defer src=\"assets/js/hero-shader.js\"></script>\n  <script defer src=\"assets/js/magnetic-buttons.js\"></script>\n</body>\n</html>\n"""

    Path(f"{niche['slug']}.html").write_text(html)
    print(f"Wrote {niche['slug']}.html")
