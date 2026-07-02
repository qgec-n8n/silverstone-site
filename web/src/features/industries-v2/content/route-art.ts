/**
 * Per-route art direction for the industries-v2 system.
 *
 * Every industry shares the dark cinematic Silverstone language and the
 * Industries-family Aether palette, but carries its own accent pairing,
 * primary icon and approved image set. Alt text describes the illustrative
 * scene only — never a client result.
 */
import type { IndustryRoute } from "./types";
import {
  Building2,
  ConciergeBell,
  Dumbbell,
  HeartPulse,
  Scissors,
  Send,
  ShoppingBag,
  Smile,
  Wrench,
  type LucideIcon,
} from "~/components/icons/lucide";

export type IndustryImage = {
  desktop: string;
  mobile: string;
  width: number;
  height: number;
  alt: string;
};

export type IndustryArt = {
  /** Short discipline label for eyebrows and status chrome. */
  discipline: string;
  accentFrom: string;
  accentTo: string;
  icon: LucideIcon;
  /** Primary image used beside the boundary/differentiator split. */
  primary: IndustryImage;
  /** Secondary imagery used in the journey/workflow gallery. */
  gallery: IndustryImage[];
};

const image = (
  desktop: string,
  mobile: string,
  alt: string,
  width = 2528,
  height = 1696,
): IndustryImage => ({ desktop, mobile, width, height, alt });

export const industryArt: Record<IndustryRoute, IndustryArt> = {
  "/industry/estate-agents": {
    discipline: "Estate agent automation",
    accentFrom: "#8b7cf6",
    accentTo: "#22d3ee",
    icon: Building2,
    primary: image(
      "/approved-images/Real_Estate_1.jpeg",
      "/approved-images/Real_Estate_1_Mobile.jpeg",
      "Illustrative branch command panel capturing valuation, portal-lead and viewing activity.",
    ),
    gallery: [
      image(
        "/approved-images/Real_Estate_2.jpeg",
        "/approved-images/Real_Estate_2_Mobile.jpeg",
        "Illustrative property-enquiry workflow with branch routing and diary context.",
      ),
      image(
        "/approved-images/Real_Estate_3.jpeg",
        "/approved-images/Real_Estate_3_Mobile.jpeg",
        "Illustrative viewing-coordination panel beside an agency reception.",
      ),
    ],
  },
  "/industry/salons-barbers": {
    discipline: "Salon & barber automation",
    accentFrom: "#e879b9",
    accentTo: "#8b5cf6",
    icon: Scissors,
    primary: image(
      "/approved-images/Salon_1.jpeg",
      "/approved-images/Salon_1_Mobile.jpeg",
      "Illustrative salon diary panel coordinating bookings and reminders.",
    ),
    gallery: [
      image(
        "/approved-images/salon-2.png",
        "/approved-images/salon-2-mobile.png",
        "Illustrative cancellation-to-waitlist journey beside a styling chair.",
      ),
      image(
        "/approved-images/salon-3.png",
        "/approved-images/salon-3-mobile.png",
        "Illustrative rebooking prompt panel in a salon setting.",
      ),
    ],
  },
  "/industry/ecommerce": {
    discipline: "eCommerce automation",
    accentFrom: "#38bdf8",
    accentTo: "#a78bfa",
    icon: ShoppingBag,
    primary: image(
      "/approved-images/ecommerce-1.png",
      "/approved-images/ecommerce-1.png",
      "Illustrative order-intelligence panel matching customer questions to live order state.",
    ),
    gallery: [
      image(
        "/approved-images/ecommerce-2.png",
        "/approved-images/ecommerce-2.png",
        "Illustrative returns-triage panel with policy check and human-review exception.",
      ),
      image(
        "/approved-images/ecommerce-3.png",
        "/approved-images/ecommerce-3.png",
        "Illustrative post-purchase journey panel with review, replenishment and segment states.",
      ),
    ],
  },
  "/industry/dentists": {
    discipline: "Dental practice automation",
    accentFrom: "#5eead4",
    accentTo: "#38bdf8",
    icon: Smile,
    primary: image(
      "/approved-images/dentist-1.png",
      "/approved-images/dentist-1-mobile.png",
      "Illustrative patient-admin panel at a dental reception.",
    ),
    gallery: [
      image(
        "/approved-images/dentist-2.png",
        "/approved-images/dentist-2-mobile.png",
        "Illustrative recall-workflow panel showing reminders and rebooking states.",
      ),
      image(
        "/approved-images/dentist-3.png",
        "/approved-images/dentist-3-mobile.png",
        "Illustrative form-completion and handoff panel in a dental practice.",
      ),
    ],
  },
  "/industry/fitness-coaches": {
    discipline: "Coaching automation",
    accentFrom: "#22d3ee",
    accentTo: "#e879b9",
    icon: Send,
    primary: image(
      "/approved-images/onlinecoach-1.png",
      "/approved-images/onlinecoach-1-mobile.png",
      "Illustrative lead-to-consultation panel for an online coaching business.",
    ),
    gallery: [
      image(
        "/approved-images/onlinecoach-2.png",
        "/approved-images/onlinecoach-2-mobile.png",
        "Illustrative consultation-booking workflow beside a coaching workspace.",
      ),
      image(
        "/approved-images/onlinecoach-3.png",
        "/approved-images/onlinecoach-3-mobile.png",
        "Illustrative onboarding-checklist panel for new coaching clients.",
      ),
    ],
  },
  "/industry/hospitality": {
    discipline: "Hospitality automation",
    accentFrom: "#a78bfa",
    accentTo: "#f0abfc",
    icon: ConciergeBell,
    primary: image(
      "/approved-images/Hospitality_1.jpeg",
      "/approved-images/Hospitality_1_Mobile.jpeg",
      "Illustrative guest-communication panel at a hospitality front desk.",
    ),
    gallery: [
      image(
        "/approved-images/Hospitality_2.jpeg",
        "/approved-images/Hospitality_2_Mobile.jpeg",
        "Illustrative reservation-context panel in a restaurant setting.",
      ),
      image(
        "/approved-images/Hospitality_3.jpeg",
        "/approved-images/Hospitality_3_Mobile.jpeg",
        "Illustrative pre-arrival journey panel for a hotel reservation.",
      ),
    ],
  },
  "/industry/trades": {
    discipline: "Trades automation",
    accentFrom: "#4f7df9",
    accentTo: "#66e8f0",
    icon: Wrench,
    primary: image(
      "/approved-images/Trades_1.jpeg",
      "/approved-images/Trades_1_Mobile.jpeg",
      "Illustrative job-intake panel capturing a missed call and job context.",
    ),
    gallery: [
      image(
        "/approved-images/Trades_2.jpeg",
        "/approved-images/Trades_2_Mobile.jpeg",
        "Illustrative quote-follow-up board with status and owner states.",
      ),
      image(
        "/approved-images/Trades_3.jpeg",
        "/approved-images/Trades_3_Mobile.jpeg",
        "Illustrative office-to-field handoff panel beside trade equipment.",
      ),
    ],
  },
  "/industry/physios-chiropractors": {
    discipline: "Clinic automation",
    accentFrom: "#6ee7d8",
    accentTo: "#8b7cf6",
    icon: HeartPulse,
    primary: image(
      "/approved-images/physio-1.png",
      "/approved-images/physio-1-mobile.png",
      "Illustrative non-clinical booking panel at a physiotherapy reception.",
    ),
    gallery: [
      image(
        "/approved-images/physio-3.png",
        "/approved-images/physio-3-mobile.png",
        "Illustrative intake and rebooking workflow panel in a clinic setting.",
      ),
    ],
  },
  "/industry/gyms-fitness-studios": {
    discipline: "Gym & studio automation",
    accentFrom: "#7c5cff",
    accentTo: "#e879b9",
    icon: Dumbbell,
    primary: image(
      "/approved-images/gyms-1.png",
      "/approved-images/gyms-1-mobile.png",
      "Illustrative member-journey panel at a gym front desk.",
    ),
    gallery: [
      image(
        "/approved-images/gyms-2.png",
        "/approved-images/gyms-2-mobile.png",
        "Illustrative member-retention workflow panel in a gym setting.",
      ),
      image(
        "/approved-images/gyms-3.png",
        "/approved-images/gyms-3-mobile.png",
        "Illustrative trial-booking and follow-up panel for a fitness studio.",
      ),
    ],
  },
};
