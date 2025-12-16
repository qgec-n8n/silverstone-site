<!-- FILE: codex/PRICING_WIDGET_REFERENCE.md -->

# Pricing Widget Reference (Authoritative Mount + Mapping)

This document is the single source of truth for:
1) Exact placeholder identification rules
2) Exact replacement block to insert
3) Page → SKU → price mappings (from `Silverstone_Service_Master_List.csv`)

---

## 1) Placeholder identification (exact + safe)

### Primary identification rule
On each target page, find this element (exact tag/class; text may contain a straight or curly apostrophe):

- Tag: `p`
- Class: `section-subtitle`
- Text prefix:
  - `Transparent pricing tables will appear here soon.`

This placeholder appears inside the **Pricing** section:
- `h2.section-title` text is exactly `Pricing`

### Replacement boundary (do not exceed)
Replace **only** the `<p class="section-subtitle">...</p>` placeholder element.  
Do not alter:
- the surrounding `<div class="neon-card" style="text-align: center;">`
- the `<h2 class="section-title">Pricing</h2>`
- the `<section ...>` wrapper or any other HTML in the file

---

## 2) Exact replacement block to insert (must match exactly)

Replace the placeholder `<p class="section-subtitle">...</p>` with the following block:

~~~html
<!-- SS:PRICING:START -->
<div class="ss-react-pricing" data-ss-pricing-key="__PAGE_KEY__">
  <div class="ss-react-pricing__fallback">Pricing is loading… If this persists, please refresh.</div>
</div>
<!-- SS:PRICING:END -->
~~~

Where `__PAGE_KEY__` must be set per page (see mappings below).

Idempotency rule:
- If the page already contains `<!-- SS:PRICING:START -->`, do not insert again.

---

## 3) CSV-backed mapping tables (page → key → SKUs/prices)

### services.html (overview: Starter Packs across all niches)
| Page | data-ss-pricing-key | CSV Niche | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- | --- |
| services.html | services | Real Estate | PKG-REA-01 | Estate Agent Starter Pack | £999 | £189/mo |
| services.html | services | Hospitality | PKG-HOS-01 | Restaurant & Café Starter Pack | £899 | £169/mo |
| services.html | services | Salons | PKG-SAL-01 | Salon No-Show Saver Pack | £749 | £129/mo |
| services.html | services | Trades | PKG-TRD-01 | Emergency Call Catcher Pack | £699 | £129/mo |
| services.html | services | eCommerce | PKG-ECOM-01 | Cart Recovery Starter Pack | £999 | £179/mo |
| services.html | services | Physios/Chiropractors | PKG-PHY-01 | Smart Intake Starter Pack | £899 | £159/mo |
| services.html | services | Dentists | PKG-DEN-01 | Recall Starter Pack | £999 | £179/mo |
| services.html | services | Gym Owners | PKG-GYM-01 | Dormant Member Starter Pack | £899 | £169/mo |
| services.html | services | Fitness Influencers/Online Coaches | PKG-INF-01 | DM to Lead Starter Pack | £749 | £149/mo |

### niches/dentists.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/dentists.html | dentists | PKG-DEN-01 | Recall Starter Pack | £999 | £179/mo |
| niches/dentists.html | dentists | PKG-DEN-02 | Treatment Plan Completion Pack | £1199 | £199/mo |
| niches/dentists.html | dentists | PKG-DEN-03 | Dental Growth Engine | £1499 | £239/mo |
| niches/dentists.html | dentists | PKG-DEN-04 | Multi-Surgery Dental Pack | £1799 | £299/mo |
| niches/dentists.html | dentists | PKG-DEN-05 | Premium Dental Automation Suite | £2099 | £339/mo |

### niches/ecommerce.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/ecommerce.html | ecommerce | PKG-ECOM-01 | Cart Recovery Starter Pack | £999 | £179/mo |
| niches/ecommerce.html | ecommerce | PKG-ECOM-02 | Abandonment & Upsell Pack | £1299 | £229/mo |
| niches/ecommerce.html | ecommerce | PKG-ECOM-03 | eCommerce Growth Engine | £1499 | £279/mo |
| niches/ecommerce.html | ecommerce | PKG-ECOM-04 | Subscription Retention Suite | £1599 | £299/mo |
| niches/ecommerce.html | ecommerce | PKG-ECOM-05 | Premium eCommerce Automation Suite | £1999 | £349/mo |

### niches/estate-agents.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/estate-agents.html | estate-agents | PKG-REA-01 | Estate Agent Starter Pack | £999 | £189/mo |
| niches/estate-agents.html | estate-agents | PKG-REA-02 | Never Miss a Viewing Pack | £1499 | £249/mo |
| niches/estate-agents.html | estate-agents | PKG-REA-03 | Landlord Growth Suite | £1399 | £229/mo |
| niches/estate-agents.html | estate-agents | PKG-REA-04 | Estate Office Automation Pack | £2399 | £339/mo |
| niches/estate-agents.html | estate-agents | PKG-REA-05 | Estate Agent Domination Pack | £2799 | £399/mo |

### niches/fitness-coaches.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/fitness-coaches.html | fitness-coaches | PKG-INF-01 | DM to Lead Starter Pack | £749 | £149/mo |
| niches/fitness-coaches.html | fitness-coaches | PKG-INF-02 | Evergreen Content Funnel Pack | £899 | £189/mo |
| niches/fitness-coaches.html | fitness-coaches | PKG-INF-03 | Influencer Growth Engine | £1199 | £249/mo |
| niches/fitness-coaches.html | fitness-coaches | PKG-INF-04 | High-Ticket Lead Machine | £1499 | £299/mo |
| niches/fitness-coaches.html | fitness-coaches | PKG-INF-05 | Premium Creator Automation Suite | £1799 | £339/mo |

### niches/gyms-fitness-studios.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/gyms-fitness-studios.html | gyms-fitness-studios | PKG-GYM-01 | Dormant Member Starter Pack | £899 | £169/mo |
| niches/gyms-fitness-studios.html | gyms-fitness-studios | PKG-GYM-02 | Class Fill & No-Show Saver | £999 | £199/mo |
| niches/gyms-fitness-studios.html | gyms-fitness-studios | PKG-GYM-03 | Gym Growth Engine | £1299 | £249/mo |
| niches/gyms-fitness-studios.html | gyms-fitness-studios | PKG-GYM-04 | Multi-Location Ops Pack | £1599 | £299/mo |
| niches/gyms-fitness-studios.html | gyms-fitness-studios | PKG-GYM-05 | Premium Gym Automation Suite | £1899 | £339/mo |

### niches/hospitality.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/hospitality.html | hospitality | PKG-HOS-01 | Restaurant & Café Starter Pack | £899 | £169/mo |
| niches/hospitality.html | hospitality | PKG-HOS-02 | No-Show & Review Saver Pack | £1299 | £219/mo |
| niches/hospitality.html | hospitality | PKG-HOS-03 | Events & Loyal Guests Pack | £1049 | £189/mo |
| niches/hospitality.html | hospitality | PKG-HOS-04 | Hotel Guest Journey Pack | £1699 | £259/mo |
| niches/hospitality.html | hospitality | PKG-HOS-05 | Hospitality Growth Engine | £1999 | £299/mo |

### niches/physios-chiropractors.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/physios-chiropractors.html | physios-chiropractors | PKG-PHY-01 | Smart Intake Starter Pack | £899 | £159/mo |
| niches/physios-chiropractors.html | physios-chiropractors | PKG-PHY-02 | Recall & Rebook Pack | £1049 | £189/mo |
| niches/physios-chiropractors.html | physios-chiropractors | PKG-PHY-03 | Clinic Growth Engine | £1299 | £239/mo |
| niches/physios-chiropractors.html | physios-chiropractors | PKG-PHY-04 | Referral & Reviews Suite | £1399 | £259/mo |
| niches/physios-chiropractors.html | physios-chiropractors | PKG-PHY-05 | Premium Clinic Automation Suite | £1699 | £299/mo |

### niches/salons-barbers.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/salons-barbers.html | salons-barbers | PKG-SAL-01 | Salon No-Show Saver Pack | £749 | £129/mo |
| niches/salons-barbers.html | salons-barbers | PKG-SAL-02 | Rebook & Review Pack | £949 | £159/mo |
| niches/salons-barbers.html | salons-barbers | PKG-SAL-03 | 24/7 Salon Receptionist Pack | £1099 | £189/mo |
| niches/salons-barbers.html | salons-barbers | PKG-SAL-04 | Premium Chair-Filler Suite | £1399 | £229/mo |
| niches/salons-barbers.html | salons-barbers | PKG-SAL-05 | Multi-Site Salon Growth Engine | £1799 | £299/mo |

### niches/trades-virtual-office.html
| Page | data-ss-pricing-key | SKU | Display name (Sales_Name_External) | Setup fee | Monthly retainer |
| --- | --- | --- | --- | --- | --- |
| niches/trades-virtual-office.html | trades-virtual-office | PKG-TRD-01 | Emergency Call Catcher Pack | £699 | £129/mo |
| niches/trades-virtual-office.html | trades-virtual-office | PKG-TRD-02 | Quote Follow-Up Pack | £899 | £159/mo |
| niches/trades-virtual-office.html | trades-virtual-office | PKG-TRD-03 | Trades Growth Engine | £1199 | £199/mo |
| niches/trades-virtual-office.html | trades-virtual-office | PKG-TRD-04 | Multi-Team Ops Pack | £1399 | £239/mo |
| niches/trades-virtual-office.html | trades-virtual-office | PKG-TRD-05 | Premium Trades Automation Suite | £1699 | £299/mo |
