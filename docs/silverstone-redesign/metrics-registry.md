# Silverstone AI — Metrics & Claims Registry (V2 Redesign)

> **Governing document:** `docs/silverstone-redesign/v2-creative-directive.md`.
> **Source CSV:** `docs/silverstone-redesign/source/performance-metrics.csv` (129 metric rows).

## CRITICAL FRAMING RULES — READ AND APPLY FIRST

These rules are binding for every use of any metric below, in UI copy, components, and schema.

1. **"(calculated average rate)" = calculated agency average / performance benchmark.**
   Any `full_claim_text` ending in *"(calculated average rate)"* is a **calculated agency
   average / performance benchmark**. It must be framed as a **"calculated agency average"**, a
   **"performance benchmark"**, or **"the level of impact well-designed systems can target"** —
   **NEVER** as Silverstone's own client result, case study, or guarantee.
2. **No invented outcomes.** Do **NOT** invent or imply guaranteed revenue, ranking, ROI, lead
   or conversion outcomes for any prospect. Numbers illustrate potential, not promises.
3. **No false attribution.** Do **NOT** present third-party / calculated averages as
   Silverstone-owned client results. **No metric in this registry is currently classified as
   Silverstone-owned evidence** — none should carry per-client attribution until verifiable
   repository evidence exists and is approved.
4. **Use exact wording.** Use the exact wording from `full_claim_text` where appropriate, kept
   inside the benchmark framing.
5. **Selective use only.** Use metrics selectively in premium visual sections (animated
   counters, outcome dashboards, benchmark cards, comparison rails, service-proof sections).
   **Do not dump the entire CSV onto any page.**

### Classification legend

| Code | Classification | Meaning |
| --- | --- | --- |
| **CA** | Calculated average | `full_claim_text` carries "(calculated average rate)" — calculated agency average / performance benchmark. |
| **BM** | Benchmark | Cumulative/stated figure **without** the "(calculated average rate)" tag — treat as an industry/agency performance benchmark, still **not** a guaranteed or per-client Silverstone result. |
| **SO** | Silverstone-owned evidence | Reserved. **None assigned** — requires verifiable repository evidence + owner approval before any metric may be reclassified here. |

### Standard disclaimers

- **Disclaimer A (for CA):** "Calculated agency average / performance benchmark — illustrative
  of the impact well-designed systems can target. Not a Silverstone client guarantee or owned
  result."
- **Disclaimer B (for BM):** "Performance benchmark — not presented as a guaranteed outcome or
  a per-client Silverstone result."

---

## Selected metrics registry

The CSV contains many duplicates (e.g. `-75% No-Shows`, `3.84x ROI`, `+66% Phone Availability`
recur across App Development, AI Voice Agents, AI Receptionists, AI Agents & Automation, and
several industries). The registry below selects **distinct, premium-suitable** metrics, notes
which pages each maps to, and assigns framing. It is intentionally curated, not exhaustive.

### Services — Web Development / Content Creation (growth & demand)

| Service / industry | Display wording (exact) | Value (unit / time basis) | Impact area | Source classification | Disclaimer | Intended page | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web Development; AI Receptionists | 850% increase in conversions | 850% | Conversion | Calculated agency average | A | Homepage benchmarks; Web Development; AI Receptionists | CA |
| Web Development; AI Receptionists | 70% increase in leads | 70% | Revenue | Calculated agency average | A | Web Development; AI Receptionists | CA |
| Web Development; AI Receptionists | 1324% Online sales up | 1,324% | Revenue | Calculated agency average | A | Web Development; eCommerce | CA |
| Web Development; Content Creation; Dentists | 102K+ Annual Leads | 102,000+ (Annual) | Lead generation | Calculated agency average | A | Service proof sections | CA |
| Web Development; Content Creation; Dentists | 1.2M+ Organic Calls | 1,200,000+ (Cumulative) | Lead generation | Benchmark | B | Service proof sections | BM |
| Web Development; Content Creation; Dentists | 90% Client Retention Rate | 90% | Retention | Calculated agency average | A | Homepage benchmarks; trust sections | CA |
| Web Development; Content Creation | 1.84% Best CTR achieved | 1.84% | Advertising | Calculated agency average | A | Content Creation; Fitness Coaches | CA |
| Web Development; Content Creation | £0.49 Best cost per click | £0.49 (GBP) | Cost efficiency | Calculated agency average | A | Content Creation; Fitness Coaches | CA |
| Content Creation | 500+ Campaigns Running | 500+ (Cumulative/current) | Client scale | Benchmark | B | Content Creation | BM |
| Content Creation; Hospitality | Bookings from SEO & PPC increased to over 3000 in 12 months | 3,000+ (12 months) | Bookings | Benchmark | B | Content Creation; Hospitality | BM |
| Content Creation; Hospitality | total return on investment for SEO and PPC from 3X to 20X | 3x → 20x | ROI | Calculated agency average | A | Content Creation; Hospitality | CA |

### Services — App Development / AI Voice / AI Receptionists / AI Automation (operations & ROI)

| Service / industry | Display wording (exact) | Value (unit / time basis) | Impact area | Source classification | Disclaimer | Intended page | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App Dev; AI Voice; AI Receptionists; AI Automation; Estate Agents | -75% Reduction in No-Shows | -75% | Attendance | Calculated agency average | A | Homepage benchmarks; service/industry proof | CA |
| App Dev; AI Voice; AI Receptionists; AI Automation; Estate Agents | +66% Increase in Phone Availability | +66% | Availability | Calculated agency average | A | AI Voice; AI Receptionists | CA |
| App Dev; AI Voice; AI Receptionists; AI Automation; Estate Agents | £16,800 Direct Cost Savings | £16,800 (Annual) | Cost savings | Calculated agency average | A | Homepage benchmarks; automation proof | CA |
| App Dev; AI Voice; AI Receptionists; AI Automation; Estate Agents | 3.84x Return on Investment | 3.84x | ROI | Calculated agency average | A | Homepage benchmarks; automation proof | CA |
| App Dev; AI Voice; AI Receptionists; AI Automation | -77% Reduction in Admin Time | -77% | Time saved | Calculated agency average | A | Automation proof; AI Receptionists | CA |
| AI Voice; AI Receptionists; AI Automation; Dentists | no-show rate fell to 14% within 8 weeks | 14% (Within 8 weeks) | Attendance | Calculated agency average | A | AI Voice; Dentists | CA |
| AI Voice; AI Receptionists; AI Automation; Dentists | Estimated monthly revenue recovery: £6,400 | £6,400 (Per month) | Revenue | Calculated agency average | A | AI Receptionists; Dentists | CA |
| AI Voice; AI Receptionists; AI Automation; Dentists | a further £2,100 from rescheduled patients | £2,100 (Per month) | Revenue | Calculated agency average | A | Dentists | CA |
| AI Voice; AI Receptionists; AI Automation; Dentists | Up 22% New Patient Bookings | 22% | Bookings | Calculated agency average | A | AI Receptionists; Dentists | CA |
| AI Voice; AI Receptionists; AI Automation; Dentists | 15 hrs/week Time Saved | 15 hours (Per week) | Time saved | Calculated agency average | A | Homepage benchmarks; automation proof | CA |
| AI Voice; AI Receptionists; AI Automation; Estate Agents | Under 10 seconds Response Time | <10 seconds | Response time | Benchmark | B | AI Voice; AI Receptionists | BM |
| AI Voice; AI Receptionists; AI Automation; Estate Agents | 2.4x Viewings Increase | 2.4x | Viewings | Calculated agency average | A | Estate Agents | CA |

### Services — AI Agents & Automation Workflows (advanced automation)

| Service / industry | Display wording (exact) | Value (unit / time basis) | Impact area | Source classification | Disclaimer | Intended page | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AI Agents & Automation | average ROI of 1,200% | 1,200% | ROI | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | Return On Investment 780% | 780% | ROI | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | Hours Saved 768+ | 768+ | Time saved | Benchmark | B | AI Automation | BM |
| AI Agents & Automation | 24/7 automated processing with no human input | 24/7 (Ongoing) | Availability | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | 60% average reduction in manual ops overhead | 60% | Cost efficiency | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | 2-4 weeks to first working automation | 2–4 weeks (Implementation) | Implementation speed | Benchmark | B | Homepage benchmarks; AI Automation | BM |
| AI Agents & Automation | 98% extraction accuracy on structured documents | 98% | Accuracy | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | 65% cost reduction in document processing | 65% | Cost efficiency | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | 10x faster document turnaround | 10x | Speed | Calculated agency average | A | AI Automation | CA |
| AI Agents & Automation | 3 FTEs redeployed to higher-value work | 3 FTEs | Workforce capacity | Benchmark | B | AI Automation | BM |
| AI Agents & Automation; eCommerce | 4.2 → 4.8 Trustpilot rating improvement for one e-commerce client | 4.2 → 4.8 | Reputation | Benchmark | B | eCommerce | BM |
| AI Agents & Automation; eCommerce | 15% higher response rates on AI-drafted outreach | 15% | Response rate | Calculated agency average | A | eCommerce | CA |
| AI Agents & Automation; eCommerce | 10+ hrs saved per person per month | 10+ hours (Per month) | Time saved | Calculated agency average | A | AI Automation; eCommerce | CA |

### Industries — Gyms & Fitness Studios

| Service / industry | Display wording (exact) | Value (unit / time basis) | Impact area | Source classification | Disclaimer | Intended page | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gyms & Fitness Studios | Average Follower Growth 272% | 272% (Campaign period) | Reach | Calculated agency average | A | Gyms & Fitness Studios | CA |
| Gyms & Fitness Studios | Content interactions increased by an average of 640.7% | 640.7% (Campaign period) | App engagement | Calculated agency average | A | Gyms & Fitness Studios | CA |
| Gyms & Fitness Studios | Link clicks up 338% | 338% (Campaign period) | Conversion | Calculated agency average | A | Gyms & Fitness Studios | CA |
| Gyms & Fitness Studios | Across a three month snapshot, 290,000 views | 290,000 (3 months) | Reach | Benchmark | B | Gyms & Fitness Studios | BM |
| Gyms & Fitness Studios | 400k+ Annual website visitors | 400,000+ (Annual) | Reach | Calculated agency average | A | Gyms & Fitness Studios | CA |

### Industries — Physios & Chiropractors

| Service / industry | Display wording (exact) | Value (unit / time basis) | Impact area | Source classification | Disclaimer | Intended page | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Physios & Chiropractors | Average 167% growth in patient leads | 167% (3 months) | Lead generation | Calculated agency average | A | Physios & Chiropractors | CA |
| Physios & Chiropractors | Reduced the website loading time from 11 seconds to 2.5 seconds | 11s → 2.5s | Speed | Benchmark | B | Physios & Chiropractors; Web Development | BM |
| Physios & Chiropractors | Introducing a 'Free Consultation' offer increased conversion rates by over 200% | over 200% | Conversion | Calculated agency average | A | Physios & Chiropractors | CA |
| Physios & Chiropractors | a 156% increase in enquiries | 156% (First 3 months) | Lead generation | Calculated agency average | A | Physios & Chiropractors | CA |
| Physios & Chiropractors | Old lead to patient conversion rate: 17% New lead to patient conversion rate: 46% | 17% → 46% (After new web form) | Conversion | Calculated agency average | A | Physios & Chiropractors | CA |
| Physios & Chiropractors | A 44% reduction in cost per lead | 44% (Month on month) | Cost efficiency | Calculated agency average | A | Physios & Chiropractors | CA |
| Physios & Chiropractors | 147 new patient consultations booked | 147 (Campaign period) | Bookings | Benchmark | B | Physios & Chiropractors | BM |
| Physios & Chiropractors | generate 50+ new patients a month | 50+ (Monthly) | Bookings | Calculated agency average | A | Physios & Chiropractors | CA |

### Industries — Fitness Coaches (online coaching)

| Service / industry | Display wording (exact) | Value (unit / time basis) | Impact area | Source classification | Disclaimer | Intended page | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fitness Coaches | 1,679 Professionals reached | 1,679 | Reach | Benchmark | B | Fitness Coaches | BM |
| Fitness Coaches | 6 confirmed event registrations per campaign at £22.15 each | 6 / £22.15 (Per campaign) | Registrations | Calculated agency average | A | Fitness Coaches | CA |

> **Note on duplicates not re-listed:** identical metrics appearing under additional
> `page_title`/`page_type` values in the CSV (for example `-75% No-Shows` under App Development,
> AI Voice Agents, AI Receptionists, AI Agents & Automation, and Estate Agents) inherit the
> same display wording, framing, classification, and disclaimer as their first listing above.

---

## Homepage benchmark shortlist (~6–10) — RECOMMENDED

Use these strongest, safely-framed metrics in the homepage **"Selected performance
benchmarks"** section (animated counters / benchmark cards). All are framed strictly as
**calculated agency averages / performance benchmarks**. The section must carry a visible
framing line.

**Section framing line (required, displayed near the benchmarks):**
> "Calculated agency averages and performance benchmarks — illustrative of the impact
> well-designed AI, automation and web systems can target. Not guaranteed outcomes or
> Silverstone client results."

| # | Display copy (exact / benchmark-framed) | Value | Impact area | Class | Per-card disclaimer |
| --- | --- | --- | --- | --- | --- |
| 1 | "850% increase in conversions" | 850% | Conversion | CA | A |
| 2 | "3.84x Return on Investment" | 3.84x | ROI | CA | A |
| 3 | "-75% Reduction in No-Shows" | -75% | Attendance | CA | A |
| 4 | "£16,800 Direct Cost Savings" | £16,800 / year | Cost savings | CA | A |
| 5 | "15 hrs/week Time Saved" | 15 hrs/week | Time saved | CA | A |
| 6 | "90% Client Retention Rate" | 90% | Retention | CA | A |
| 7 | "+66% Increase in Phone Availability" | +66% | Availability | CA | A |
| 8 | "60% average reduction in manual ops overhead" | 60% | Cost efficiency | CA | A |
| 9 | "2-4 weeks to first working automation" | 2–4 weeks | Implementation speed | BM | B |
| 10 | "98% extraction accuracy on structured documents" | 98% | Accuracy | CA | A |

**Why these:** they span the full Silverstone proposition (conversion, ROI, cost, time, trust,
availability, automation accuracy and speed), are visually punchy for animated counters, and
are all expressible safely as agency benchmarks. Items 1–8 and 10 are calculated agency
averages (Disclaimer A); item 9 is a process benchmark (Disclaimer B). None is presented as a
guaranteed or Silverstone-owned client result.

**Do not** pair these benchmarks with language implying a specific named client, a guarantee,
or a promised prospect outcome.
