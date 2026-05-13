/**
 * AI PROMPT SPECIFICATIONS — Universell
 *
 * This file is the single source of truth for all AI generation prompts used
 * across the platform: website pages, landing pages, and cookie consent.
 *
 * Each prompt is composed of three layers:
 *   1. Page-specific content instructions
 *   2. Auto-detected JSON-LD schema block for SEO/GEO
 *   3. Modern design-system directive
 *
 * Cookie consent prompt is separate and injected into every generated page.
 */

// ---------------------------------------------------------------------------
// SCHEMA AUTO-DETECTION MAP
// Maps page IDs / types to their Schema.org @type(s) for JSON-LD injection.
// ---------------------------------------------------------------------------

export const PAGE_SCHEMA_MAP: Record<string, { primaryType: string; secondaryType?: string }> = {
  homepage:   { primaryType: "WebSite",         secondaryType: "LocalBusiness"        },
  about:      { primaryType: "AboutPage",        secondaryType: "Organization"         },
  shop:       { primaryType: "CollectionPage",   secondaryType: "ItemList"             },
  services:   { primaryType: "Service",          secondaryType: "ProfessionalService"  },
  bookings:   { primaryType: "Event",            secondaryType: "ReservationAction"    },
  contact:    { primaryType: "ContactPage",      secondaryType: "LocalBusiness"        },
  terms:      { primaryType: "WebPage"                                                 },
  privacy:    { primaryType: "WebPage"                                                 },
  // Landing page types
  "lp-business":  { primaryType: "WebPage",     secondaryType: "LocalBusiness"        },
  "lp-lead":      { primaryType: "WebPage",     secondaryType: "Offer"                },
  "lp-promo":     { primaryType: "WebPage",     secondaryType: "Offer"                },
  "lp-launch":    { primaryType: "WebPage",     secondaryType: "Product"              },
  "lp-event":     { primaryType: "Event",       secondaryType: "Offer"                },
};

// ---------------------------------------------------------------------------
// SHARED DIRECTIVES (appended to every prompt)
// ---------------------------------------------------------------------------

/**
 * Modern design-system directive injected into every generated page prompt.
 * References brand primary colour token so the AI can use it in inline styles
 * or Tailwind classes.
 */
export const DESIGN_SYSTEM_DIRECTIVE = `
DESIGN SYSTEM REQUIREMENTS (mandatory for every generated page):
- Full-width sections separated by generous vertical whitespace (min 80px top/bottom padding).
- Sticky header with frosted-glass backdrop (backdrop-filter: blur(12px); background: rgba(255,255,255,0.8)).
- Smooth-scroll behaviour on the <html> element (scroll-behavior: smooth).
- Subtle entrance animations: sections fade-in-up as they enter the viewport (use IntersectionObserver or a lightweight CSS animation class).
- Hero section must be above-the-fold with a strong H1, a supporting sub-heading, and a primary CTA button — all rendered within a gradient-accent band using the brand primary colour.
- Cards use rounded-2xl corners, soft box-shadow (0 4px 24px rgba(0,0,0,0.08)), and a hover lift effect (transform: translateY(-4px) on :hover with transition 0.2s ease).
- Typography: use a modern sans-serif pairing (e.g. Inter + DM Sans). H1 ≥ 48px, H2 ≥ 36px, body 16–18px, line-height 1.6.
- Accessible colour contrast: all text/background pairs must pass WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Mobile-first responsive grid: 1 column on mobile → 2 columns on tablet → 3–4 columns on desktop.
- Use CSS custom properties (--brand-primary, --brand-secondary) for colour tokens so the theme can be swapped at runtime.
`;

/**
 * JSON-LD schema injection directive. Accepts the detected schema types.
 */
export function buildSchemaDirective(pageId: string, businessName: string, siteUrl: string): string {
  const schema = PAGE_SCHEMA_MAP[pageId] ?? { primaryType: "WebPage" };
  return `
SCHEMA.ORG / JSON-LD REQUIREMENTS (mandatory for SEO and GEO):
- Inject a <script type="application/ld+json"> block in the <head> of the generated page.
- Primary schema type: "${schema.primaryType}"${schema.secondaryType ? `; also include a nested or sibling block for "${schema.secondaryType}"` : ""}.
- Populate all required and recommended properties using the business context provided:
    - "name": "${businessName}"
    - "url": "${siteUrl}"
    - "description": (use the business tagline / description from context)
    - "address": (use business address from context if available)
    - "telephone": (use business phone from context if available)
    - "sameAs": (include social profile URLs from context if available)
- For pages with products/services, include an "offers" array with individual Offer schemas.
- For booking pages, include "availableChannel" and "potentialAction" with ReserveAction.
- For event pages, include "startDate", "endDate", "location", and "organizer".
- Validate that all required fields for the chosen @type are present; use empty strings only as a last resort.
`;
}

/**
 * Cookie consent banner prompt — injected into every generated page that
 * will be published on the live site. Collected consent data is sent to
 * POST /api/cookie-consent for DB persistence and surfaced in Website Stats.
 */
export const COOKIE_CONSENT_PROMPT = `
COOKIE CONSENT BANNER (mandatory on every published page):
Generate a GDPR/PECR-compliant cookie consent banner and wire it up as follows:

UI REQUIREMENTS:
- Fixed-bottom slide-up banner with frosted-glass background and brand primary colour accent.
- Heading: "We use cookies" with a short one-line description.
- Three action buttons: "Accept All", "Reject Non-Essential", "Manage Preferences".
- "Manage Preferences" opens a modal listing two cookie categories:
    1. Essential Cookies (always on, toggle disabled): session, security, authentication.
    2. Non-Essential Cookies (user-toggleable): analytics, marketing, personalisation.
- Banner is hidden once a choice is made; consent state stored in localStorage key "universell_cookie_consent".

DATA CAPTURE REQUIREMENTS:
- On every consent action, call POST /api/cookie-consent with JSON body:
  {
    "siteId":    "<business slug or hostname>",
    "sessionId": "<randomly generated UUID for this visit>",
    "choice":    "accepted_all" | "rejected_non_essential" | "custom",
    "categories": { "essential": true, "analytics": boolean, "marketing": boolean },
    "timestamp": "<ISO 8601 UTC timestamp>",
    "userAgent": "<navigator.userAgent>",
    "page":      "<window.location.pathname>"
  }
- If the POST fails, retry once after 3 seconds; if it still fails, store the event in
  localStorage key "universell_consent_queue" for retry on next page load.
- On subsequent page loads, check localStorage for queued events and flush them.

This data powers the Cookie Consent breakdown in the Website Stats dashboard.
`;

// ---------------------------------------------------------------------------
// PAGE-SPECIFIC PROMPT BUILDERS
// ---------------------------------------------------------------------------

/**
 * Builds the complete AI prompt for a given website page.
 *
 * @param pageId        - One of the SUGGESTED_PAGES IDs (homepage, about, shop, etc.)
 * @param businessName  - Brand name from brand vault context
 * @param siteUrl       - Canonical site URL
 * @param customHint    - Optional user customisation text
 */
export function buildPagePrompt(
  pageId: string,
  businessName: string,
  siteUrl: string,
  customHint?: string
): string {
  const base = PAGE_BASE_PROMPTS[pageId] ?? `Generate a high-quality ${pageId} page for ${businessName}.`;
  const custom = customHint ? `\n\nUSER CUSTOMISATION: ${customHint}` : "";
  return [
    base + custom,
    buildSchemaDirective(pageId, businessName, siteUrl),
    DESIGN_SYSTEM_DIRECTIVE,
    COOKIE_CONSENT_PROMPT,
  ].join("\n");
}

/**
 * Builds the complete AI prompt for a landing page.
 *
 * @param lpType        - Landing page type: "business" | "lead" | "promo" | "launch" | "event"
 * @param businessName  - Brand name from brand vault context
 * @param siteUrl       - Canonical site URL
 * @param customHint    - Optional user customisation text
 */
export function buildLandingPagePrompt(
  lpType: string,
  businessName: string,
  siteUrl: string,
  customHint?: string
): string {
  const base = LANDING_PAGE_BASE_PROMPTS[lpType] ?? LANDING_PAGE_BASE_PROMPTS["business"];
  const custom = customHint ? `\n\nUSER CUSTOMISATION: ${customHint}` : "";
  return [
    base + custom,
    buildSchemaDirective(`lp-${lpType}`, businessName, siteUrl),
    DESIGN_SYSTEM_DIRECTIVE,
    COOKIE_CONSENT_PROMPT,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// BASE PROMPT CONTENT PER PAGE TYPE
// ---------------------------------------------------------------------------

export const PAGE_BASE_PROMPTS: Record<string, string> = {
  homepage: `
Generate a welcoming, conversion-focused Homepage for {{businessName}}.

CONTENT STRUCTURE:
1. Hero Section — Bold H1 headline (value proposition), supporting sub-heading, primary CTA button ("Shop Now" / "Book a Table" / "Get Started" based on business type), and a high-quality hero image or gradient illustration.
2. Social Proof Bar — Logo strip or "As seen in" / star-rating strip to build immediate trust.
3. Featured Products / Services Section — 3–4 spotlight cards with image, name, short description, price (if applicable), and CTA.
4. Brand Story Snippet — 2–3 sentence brand mission with a secondary CTA linking to the About page.
5. Testimonials Carousel — 3 customer reviews with avatar, name, star rating, and quote.
6. Newsletter / Lead Capture — Email opt-in strip with incentive copy.
7. Footer — Navigation links, social icons, legal links (Privacy Policy, Terms), and business contact details.

SEO META:
- <title>: {{businessName}} — [short tagline]
- <meta name="description">: 150–160 character summary of the business value proposition.
- Open Graph tags (og:title, og:description, og:image).
`.trim(),

  about: `
Generate a story-driven, brand-building About Us page for {{businessName}}.

CONTENT STRUCTURE:
1. Hero Banner — Full-width image or illustrated banner with headline "Our Story" and a supporting sub-heading.
2. Founding Story — 3–4 paragraph narrative: why the business was started, the problem it solves, and the journey so far.
3. Mission & Values — 3–4 icon-card blocks, each with a short value title and 1–2 sentence description.
4. Team Section — Grid of team member cards (photo, name, role, short bio). Use placeholder portraits if real images are unavailable.
5. Milestones Timeline — Key business milestones (founding year, first product, expansion, awards).
6. Community / Social Impact — Optional block about CSR, sustainability, or local involvement.
7. CTA Strip — "Work with us" or "Visit our shop" call-to-action linking to Contact or Shop.

SEO META:
- <title>: About {{businessName}} — Our Story & Mission
- <meta name="description">: Who we are, what we stand for, and why customers love us.
`.trim(),

  shop: `
Generate a high-converting product catalogue / Shop page for {{businessName}}.

CONTENT STRUCTURE:
1. Page Header — H1 "Shop" with a filter bar (category chips, sort dropdown, search input).
2. Product Grid — Responsive 3-column grid (1 col mobile, 2 col tablet, 3–4 col desktop). Each product card: image, name, price, rating stars, "Add to Cart" / "View Details" button.
3. Featured Collection Banner — Full-width promotional banner for a featured collection or seasonal sale.
4. Category Navigation — Icon-based category tabs or horizontal scroll category chips above the grid.
5. Pagination / Infinite Scroll — Load more products progressively.
6. Recently Viewed — Horizontal scroll strip of recently viewed items (client-side state).
7. Trust Badges Strip — Free shipping threshold, secure checkout, returns policy icons.

SEO META:
- <title>: Shop {{businessName}} — Browse Our Full Collection
- <meta name="description">: Explore our full range of products. Quality guaranteed.
`.trim(),

  services: `
Generate a professional, lead-generating Services page for {{businessName}}.

CONTENT STRUCTURE:
1. Hero Section — Headline "What We Offer" with a supporting paragraph and a "Book a Free Consultation" CTA.
2. Services Grid — 3–6 service cards, each with: icon, service name, 2–3 sentence description, pricing tier indicator, and "Learn More" / "Book Now" CTA.
3. Process Section — "How It Works" 3-step numbered visual flow (Enquire → Consult → Deliver).
4. Pricing Tiers (optional) — 3-column pricing table (Starter / Professional / Enterprise or equivalent) with feature checklist and CTA per tier.
5. Client Testimonials — 3 testimonials specific to service quality and outcomes.
6. FAQs Accordion — 5–7 frequently asked questions about the services.
7. Final CTA Strip — "Ready to get started?" with a contact form or booking link.

SEO META:
- <title>: Services — {{businessName}}
- <meta name="description">: Professional services from {{businessName}}. Discover what we offer and book your consultation today.
`.trim(),

  bookings: `
Generate a frictionless, trust-building Bookings / Reservations page for {{businessName}}.

CONTENT STRUCTURE:
1. Hero Section — "Book Your Experience" headline with a sub-heading about what the customer can expect and a direct "Book Now" CTA.
2. Booking Widget — Calendar date-picker, time-slot selector (morning / afternoon / evening), party-size or service selector, and a multi-step form (Contact Info → Confirm → Pay/Deposit if required).
3. What to Expect — 3-step visual guide (Select → Confirm → Enjoy) with icons.
4. Available Services / Packages — Card list of bookable services with description, duration, and price.
5. Cancellation & Rescheduling Policy — Clear policy block with icons for trust.
6. Testimonials — 2–3 booking-specific reviews ("Our reservation was seamless...").
7. FAQ Accordion — Questions about booking changes, deposits, group bookings, accessibility.

SEO META:
- <title>: Book a Table / Appointment — {{businessName}}
- <meta name="description">: Reserve your spot at {{businessName}}. Easy online booking, instant confirmation.
`.trim(),

  contact: `
Generate a welcoming, multi-channel Contact page for {{businessName}}.

CONTENT STRUCTURE:
1. Hero — "Get in Touch" headline with a warm sub-heading encouraging visitors to reach out.
2. Contact Form — Fields: Name, Email, Phone (optional), Subject (dropdown), Message, GDPR consent checkbox. Submit button with loading state.
3. Contact Details Cards — Three cards: Phone (with click-to-call), Email (mailto link), Physical Address with embedded Google Maps iframe.
4. Business Hours Table — Clearly formatted opening hours for each day of the week.
5. Social Media Links — Icon-button row for all active social profiles.
6. Live Chat Prompt — Optional "Chat with us" floating button or inline CTA if live chat is enabled.

SEO META:
- <title>: Contact {{businessName}} — We're Here to Help
- <meta name="description">: Reach out to {{businessName}} by phone, email, or visit us in store.
`.trim(),

  terms: `
Generate a clear, legally sound Terms & Conditions page for {{businessName}}.

CONTENT STRUCTURE:
1. Introduction — Effective date, who the agreement is between, and what it covers.
2. Use of Service — Acceptable use policy, prohibited activities, and account responsibilities.
3. Products & Orders — Ordering process, pricing, payment terms, order confirmation, and cancellation.
4. Shipping & Delivery — Estimated delivery times, international shipping (if applicable), and risk of loss.
5. Returns & Refunds — Return window, condition requirements, refund processing times.
6. Intellectual Property — Ownership of content, trademarks, and user-generated content.
7. Limitation of Liability — Disclaimer of warranties and cap on liability.
8. Governing Law — Jurisdiction and dispute resolution.
9. Changes to Terms — How and when terms may be updated.
10. Contact — How users can raise legal queries.

SEO META:
- <title>: Terms & Conditions — {{businessName}}
- <meta name="description">: Read the Terms & Conditions for using {{businessName}}'s website and services.
`.trim(),

  privacy: `
Generate a transparent, GDPR-compliant Privacy Policy page for {{businessName}}.

CONTENT STRUCTURE:
1. Introduction — Who we are, what this policy covers, and the effective date.
2. Data We Collect — Explicit list: name, email, address, payment info, usage data, cookies.
3. How We Collect Data — Website forms, cookies, third-party integrations (payment processors, analytics).
4. How We Use Data — Fulfilment, marketing (with opt-in basis), analytics, legal obligations.
5. Legal Basis for Processing (GDPR) — Consent, contract, legitimate interest, legal obligation.
6. Data Sharing — Third parties (hosting, payment, analytics providers) listed by name with purpose.
7. Data Retention — How long each category of data is kept and why.
8. Your Rights (GDPR) — Access, rectification, erasure, portability, objection, withdraw consent.
9. Cookie Policy — Link to cookie categories; reference to consent banner on the site.
10. Data Security — Encryption, access controls, breach notification procedure.
11. Children's Privacy — No data collection from under-13s (or applicable age in jurisdiction).
12. Contact / DPO — Email address for privacy queries and, where required, the Data Protection Officer.

SEO META:
- <title>: Privacy Policy — {{businessName}}
- <meta name="description">: How {{businessName}} collects, uses, and protects your personal data.
`.trim(),
};

// ---------------------------------------------------------------------------
// LANDING PAGE BASE PROMPTS
// ---------------------------------------------------------------------------

export const LANDING_PAGE_BASE_PROMPTS: Record<string, string> = {
  business: `
Generate a high-converting Business Landing Page for {{businessName}}.

CONTENT STRUCTURE:
1. Above-the-Fold Hero — Bold H1 value proposition, 1–2 sentence sub-heading, primary CTA ("Get Started" / "Contact Us"), and a hero image or brand illustration. No navigation menu — keep focus on conversion.
2. Problem → Solution Block — 2-column layout: left "The Challenge" (pain points), right "Our Solution" (how the business solves it).
3. Key Benefits — 3-icon benefit grid with short headline and description per benefit.
4. Social Proof — Logo strip of clients/partners or a featured testimonial with photo.
5. About Snippet — 2–3 sentence brand credibility paragraph with a "Learn More" link.
6. Final CTA Section — Repeated CTA with urgency copy and a simple contact form or calendar embed.
7. Footer — Minimal: logo, legal links, social icons.

SEO META:
- <title>: {{businessName}} — [value proposition]
- <meta name="description">: 150–160 char description of what the business offers.
`.trim(),

  lead: `
Generate a high-converting Lead Capture Landing Page for {{businessName}}.

CONTENT STRUCTURE:
1. Distraction-free Hero — No navigation. Headline focused on the lead magnet offer (e.g. "Free Guide", "Free Consultation", "Free Quote"). Sub-heading with specific outcome promise. Lead capture form (Name + Email minimum) prominently above the fold.
2. What You'll Get — 3–5 bullet-point list of tangible benefits the lead receives.
3. Who It's For — Short paragraph or 3 persona icons describing the ideal recipient.
4. About / Authority Block — Brief credibility paragraph about {{businessName}} with logos or statistics.
5. Testimonials — 2–3 short quotes from past leads / clients who benefited.
6. Second CTA — Repeated form or CTA button mid-page.
7. Privacy Assurance — "We respect your privacy. Unsubscribe at any time." micro-copy beneath every form.

SEO META:
- <title>: [Lead Magnet Name] — Free from {{businessName}}
- <meta name="description">: Claim your free [offer] from {{businessName}}. [Specific outcome promise].
`.trim(),

  promo: `
Generate an urgency-driven Promotional / Sale Landing Page for {{businessName}}.

CONTENT STRUCTURE:
1. Announcement Hero — Bold headline with the offer (e.g. "50% Off Sitewide"), countdown timer to offer end, and a prominent "Shop the Sale" CTA.
2. Offer Details — Clear list of what's included in the promotion: which products/services, discount %, valid dates.
3. Featured Sale Items — 3–6 product/service cards with original price, sale price, and "Buy Now" CTA.
4. Why Shop Now — 3-icon urgency block: Limited Stock / Time-Limited Offer / Free Shipping Threshold.
5. Customer Reviews — 2–3 reviews specifically praising the products on promotion.
6. FAQ Strip — 3–5 quick Q&As about the promotion (eligibility, returns, stacking discounts).
7. Final CTA — "Don't miss out" strip with countdown and repeat CTA.

SEO META:
- <title>: [Promotion Name] Sale — {{businessName}}
- <meta name="description">: [Discount]% off [product category] at {{businessName}}. Limited time only. Shop now.
`.trim(),

  launch: `
Generate an excitement-building Product / Service Launch Landing Page for {{businessName}}.

CONTENT STRUCTURE:
1. Launch Hero — "Introducing [Product Name]" headline with a striking product image/video, teaser sub-heading, and an "Early Access" / "Pre-Order" CTA. Include an email capture for launch notifications.
2. The Problem It Solves — 2-column empathy block: "Before [Product]" vs "After [Product]".
3. Feature Deep-Dive — 3–5 feature blocks, each with icon, feature name, and a 2–3 sentence benefit explanation.
4. How It Works — 3-step numbered visual (Step 1 → Step 2 → Step 3) explaining the product experience.
5. Pricing / Pre-Order Section — Price reveal with optional early-bird discount and "Order Now" CTA.
6. Social Proof — Beta tester quotes or press mentions.
7. Launch Countdown — Countdown timer to launch date above the final CTA.

SEO META:
- <title>: Introducing [Product] — {{businessName}}
- <meta name="description">: [Product] is here. [One-line value proposition]. Pre-order now from {{businessName}}.
`.trim(),

  event: `
Generate a compelling Event Registration Landing Page for {{businessName}}.

CONTENT STRUCTURE:
1. Event Hero — Event name as H1, date/time/location prominently displayed, a 1–2 sentence description, and a "Register Now" CTA. Include a high-quality event banner image.
2. Event Details — Format (in-person / virtual / hybrid), agenda/programme overview, venue information with map embed.
3. What You'll Learn / Experience — 4–6 bullet points or icon cards describing attendee outcomes.
4. Speakers / Hosts — Speaker profile cards: photo, name, title, short bio.
5. Schedule / Agenda — Timeline view of the event programme with times and session titles.
6. Pricing / Ticket Types — Ticket tier cards (Free / VIP / Group) with feature comparison and "Get Tickets" CTA per tier.
7. Sponsor Logos — Logo grid of event sponsors (if applicable).
8. Registration Form — Name, email, ticket type selection, dietary requirements (if in-person), GDPR consent.

SEO META:
- <title>: [Event Name] — [Date] — {{businessName}}
- <meta name="description">: Join us at [Event Name] on [date]. [One-line value prop]. Register for free.
`.trim(),
};

// ---------------------------------------------------------------------------
// COOKIE CONSENT — DB PERSISTENCE SPEC
// ---------------------------------------------------------------------------

/**
 * Schema for the cookie consent event stored in the database.
 * POST /api/cookie-consent persists one record per consent interaction.
 *
 * Table: cookie_consent_events
 * ┌─────────────────┬──────────────────────────────────────────────────────┐
 * │ Field           │ Type / Notes                                         │
 * ├─────────────────┼──────────────────────────────────────────────────────┤
 * │ id              │ UUID (auto-generated)                                │
 * │ site_id         │ VARCHAR — business slug or hostname                  │
 * │ session_id      │ UUID — anonymous visitor session                     │
 * │ choice          │ ENUM: accepted_all | rejected_non_essential | custom │
 * │ essential       │ BOOLEAN — always true                                │
 * │ analytics       │ BOOLEAN                                              │
 * │ marketing       │ BOOLEAN                                              │
 * │ page            │ VARCHAR — pathname where consent was given           │
 * │ user_agent      │ TEXT                                                 │
 * │ created_at      │ TIMESTAMPTZ — UTC                                    │
 * └─────────────────┴──────────────────────────────────────────────────────┘
 */
export interface CookieConsentEvent {
  siteId: string;
  sessionId: string;
  choice: "accepted_all" | "rejected_non_essential" | "custom";
  categories: {
    essential: true;
    analytics: boolean;
    marketing: boolean;
  };
  timestamp: string; // ISO 8601
  userAgent: string;
  page: string;
}
