# Universell AI Prompt Specifications

**Version:** 2.0  
**Last Updated:** 13 May 2026  
**Source of Truth:** `lib/ai-prompts.ts`

---

## Overview

Every AI-generated page is composed of three prompt layers stacked together at generation time:

| Layer | Purpose |
|---|---|
| **1. Content** | Page-specific structure, sections, and copy instructions |
| **2. Schema** | Auto-detected JSON-LD injection for SEO & GEO |
| **3. Directives** | Shared design system rules + cookie consent banner |

All `{{VARIABLE}}` placeholders are replaced at runtime from the brand vault / business context. See **Section 5 — Variable Reference** for the full list.

---

## 1. Shared Directives (Injected into Every Prompt)

### 1.1 Design System Directive

```
You are a professional web designer and developer. Every page you generate must follow these design rules:

LAYOUT & STRUCTURE
- Mobile-first responsive grid (12-column, max-width 1280px, 24px gutters)
- Sticky header with frosted-glass backdrop (backdrop-blur-md bg-white/80)
- Minimum section padding: 80px vertical on desktop, 48px on mobile
- Hero section must be above the fold with a single, prominent CTA

VISUAL DESIGN
- Use CSS custom property --brand-primary for all accent colours
- Gradient hero: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))
- Cards: rounded-2xl, soft box-shadow (0 4px 24px rgba(0,0,0,0.08)), hover:translateY(-4px) transition
- Glassmorphism panels: background rgba(255,255,255,0.7), backdrop-filter blur(12px)
- Typography scale: hero 56px/64px bold, h2 36px, h3 24px, body 16px/28px, caption 13px
- Colour contrast minimum WCAG AA (4.5:1 for body text, 3:1 for large text)

ANIMATIONS & INTERACTIONS
- Fade-in-up on scroll for all sections (IntersectionObserver, 0.4s ease, 60px translateY)
- Button hover: scale(1.03) + box-shadow lift, 200ms ease
- Image hover: slight zoom (scale 1.05) inside overflow-hidden container
- Smooth scroll behaviour on all anchor links

COMPONENTS TO INCLUDE ON EVERY PAGE
- Navigation: logo left, links centre, CTA button right, hamburger on mobile
- Footer: logo, tagline, column links, social icons, copyright, Cookie Settings link
- Back-to-top button (fixed bottom-right, appears after 300px scroll)
- Loading skeleton states for dynamic content

PERFORMANCE
- Lazy-load all images below the fold (loading="lazy")
- Use next/image or img with explicit width/height to prevent layout shift
- Inline critical CSS for above-the-fold content
- Minify and defer non-critical scripts
```

---

### 1.2 Schema Auto-Detection Map

| Page ID | Schema.org Types |
|---|---|
| `homepage` | `WebSite` + `LocalBusiness` |
| `about` | `AboutPage` + `Organization` |
| `services` | `Service` + `ProfessionalService` |
| `shop` | `CollectionPage` + `ItemList` + `Product` |
| `bookings` | `Event` + `ReservationAction` |
| `contact` | `ContactPage` + `LocalBusiness` |
| `terms` | `WebPage` |
| `privacy` | `WebPage` |
| `blog` | `Blog` + `BlogPosting` |
| `faq` | `FAQPage` |
| `lp-lead` | `WebPage` + `Offer` |
| `lp-business` | `WebPage` + `LocalBusiness` |
| `lp-launch` | `WebPage` + `Product` |
| `lp-promo` | `WebPage` + `Offer` |
| `lp-event` | `WebPage` + `Event` |

---

### 1.3 Schema Directive Template

```
At the end of the <head> section, inject a <script type="application/ld+json"> block.
Use the following schema types: {{SCHEMA_TYPES}}

Populate ALL fields using the business context provided:
  @context:    "https://schema.org"
  @type:       {{PRIMARY_SCHEMA_TYPE}}
  name:        {{BUSINESS_NAME}}
  url:         {{SITE_URL}}
  description: {{BUSINESS_DESCRIPTION}}
  logo:        {{LOGO_URL}}
  image:       {{BANNER_URL}}
  telephone:   {{PHONE}}
  email:       {{EMAIL}}
  address:
    @type:           PostalAddress
    streetAddress:   {{STREET}}
    addressLocality: {{CITY}}
    addressRegion:   {{STATE}}
    postalCode:      {{ZIP}}
    addressCountry:  {{COUNTRY}}
  sameAs: [{{SOCIAL_PROFILE_URLS}}]

For LocalBusiness also include:
  openingHours, priceRange, currenciesAccepted, paymentAccepted

For Product include:
  offers: { @type: Offer, price, priceCurrency, availability }

For Event include:
  startDate, endDate, eventStatus, eventAttendanceMode, location

For FAQPage include:
  mainEntity: array of { @type: Question, name, acceptedAnswer: { @type: Answer, text } }

For CollectionPage with products include:
  mainEntity:
    @type: ItemList
    itemListElement:
      - @type: ListItem
        position: 1
        item: { @type: Product, name, image, offers: { @type: Offer, price, priceCurrency } }
```

---

### 1.4 Cookie Consent Banner Directive

```
COOKIE CONSENT BANNER (mandatory on every generated page)

Generate a GDPR/PECR-compliant cookie consent banner with the following specification:

APPEARANCE
- Fixed to the bottom of the viewport, full width, z-index 9999
- Frosted glass: bg-white/90 backdrop-blur-lg, 1px border-top rgba(0,0,0,0.08)
- Two states: (1) compact banner, (2) expanded manage-preferences panel

COMPACT BANNER
  Title: "We use cookies"
  Body:  "We use essential cookies to make our site work. With your consent, we may
          also use non-essential cookies to improve user experience and analyse traffic."
  Buttons:
    "Accept All"           - primary filled button, brand colour
    "Reject Non-Essential" - secondary outlined button
    "Manage Preferences"   - text link, opens expanded panel

EXPANDED MANAGE-PREFERENCES PANEL
  Cookie categories with toggle switches:
    1. Essential Cookies   (always ON, disabled toggle)
       "Required for the website to function. Cannot be disabled."
    2. Analytics Cookies   (default OFF)
       "Help us understand how visitors interact with our website."
    3. Marketing Cookies   (default OFF)
       "Used to deliver personalised advertisements."
    4. Functional Cookies  (default OFF)
       "Enable enhanced functionality like live chat and video embeds."
  Buttons: "Save Preferences"  |  "Accept All"

BEHAVIOUR
- Show compact banner on first visit
- Store consent in localStorage key "universell_cookie_consent":
    version:   "1.0"
    timestamp: ISO 8601 UTC string
    essential: true
    analytics: boolean
    marketing: boolean
    functional: boolean
    action:    "accept_all" | "reject_non_essential" | "custom"
- Re-show banner if stored consent is older than 365 days
- Emit custom DOM event "universell:consent" with the consent object as detail
- On every consent action POST to /api/cookie-consent with JSON body:
    siteId:     business slug or hostname
    sessionId:  uuid v4 generated for this visit
    action:     "accept_all" | "reject_non_essential" | "custom"
    essential:  true
    analytics:  boolean
    marketing:  boolean
    functional: boolean
    timestamp:  ISO 8601 UTC string
    userAgent:  navigator.userAgent
    page:       window.location.pathname
    country:    derived from Accept-Language or IP geo if available
- If POST fails, retry once after 3 seconds; on second failure queue event in
  localStorage "universell_consent_queue" and flush on next page load
- Add "Cookie Settings" link in every page footer that reopens the manage-preferences panel
```

---

## 2. Website Page Prompts

### 2.1 Homepage

```
ROLE: You are an expert web designer and conversion copywriter.

TASK: Generate a complete, production-ready HTML page for the homepage of {{BUSINESS_NAME}}.

BUSINESS CONTEXT:
  Business Name:  {{BUSINESS_NAME}}
  Tagline:        {{TAGLINE}}
  Description:    {{DESCRIPTION}}
  Industry:       {{INDUSTRY}}
  Email:          {{EMAIL}}
  Phone:          {{PHONE}}
  Address:        {{ADDRESS}}
  Logo URL:       {{LOGO_URL}}
  Brand Primary:  {{BRAND_PRIMARY}}
  Site URL:       {{SITE_URL}}

PAGE SECTIONS (in order):

1. NAVIGATION
   - Logo (left) | Nav links: Home, About, Services, Shop, Contact | CTA "Get Started" (right)
   - Sticky with frosted-glass background on scroll

2. HERO SECTION
   - Bold H1 headline incorporating {{BUSINESS_NAME}} and the core value proposition
   - Supporting subheadline (1-2 sentences)
   - Two CTAs: primary "Get Started" -> /contact, secondary "Learn More" -> smooth scroll to features
   - Hero background: gradient using {{BRAND_PRIMARY}}
   - Trust badges row: "Trusted by 10,000+ customers" | 5-star rating | "Free delivery"

3. FEATURES / VALUE PROPOSITION (3-column icon grid)
   - Icon + bold heading + 2-line description per column
   - Content derived from {{DESCRIPTION}}

4. ABOUT SNIPPET (2-column: text left, image right)
   - Brand mission in 3-4 sentences
   - CTA: "Our Story" -> /about

5. SERVICES / PRODUCTS PREVIEW (3-4 cards)
   - Image, title, short description, "Learn More" link per card

6. TESTIMONIALS (3 cards, carousel on mobile)
   - Star rating, quote, customer name, role/company

7. CALL TO ACTION BANNER
   - Full-width gradient band using {{BRAND_PRIMARY}}
   - Headline: "Ready to get started?"
   - Single CTA: "Contact Us Today" -> /contact

8. FOOTER
   - Logo + tagline
   - 4 columns: Company links | Services links | Contact details | Social icons
   - Copyright + Privacy Policy + Terms + Cookie Settings links

SEO META:
  <title>{{BUSINESS_NAME}} | {{TAGLINE}}</title>
  <meta name="description" content="{{DESCRIPTION}} - {{TAGLINE}}">
  Open Graph: og:title, og:description, og:image, og:url
  Canonical URL: {{SITE_URL}}

{{SCHEMA_DIRECTIVE}}         types: WebSite + LocalBusiness
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.2 About Us

```
ROLE: You are an expert brand storyteller and web designer.

TASK: Generate a complete About Us page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. PAGE HERO
   - Headline: "About {{BUSINESS_NAME}}"
   - Subheadline: brand mission in one sentence
   - Full-width header image or brand-primary gradient

2. OUR STORY (2-column: large image left, narrative text right)
   - 3-4 paragraphs: founding story, mission, values, future vision
   - Tone derived from {{DESCRIPTION}}

3. MISSION & VALUES (3-4 icon cards)
   - Icon + value name + 2-line description each
   - e.g. Quality, Community, Innovation, Sustainability

4. MEET THE TEAM (3-4 portrait cards)
   - Circular photo, name, role, 1-line bio, LinkedIn icon

5. MILESTONES TIMELINE (horizontal)
   - 4-6 key dates with year label and short description

6. SOCIAL PROOF
   - Client logo strip OR 2-3 testimonial quote cards

7. CTA SECTION
   - "Work with us" or "Get in touch" heading + button -> /contact

SEO META:
  <title>About {{BUSINESS_NAME}} | Our Story & Mission</title>
  <meta name="description" content="Learn about {{BUSINESS_NAME}}, our founding story,
  mission, values, and the team behind the brand.">

{{SCHEMA_DIRECTIVE}}         types: AboutPage + Organization
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.3 Services

```
ROLE: You are a conversion-focused web designer.

TASK: Generate a Services page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. PAGE HERO
   - Headline: "Our Services"
   - Subheadline: "Discover how {{BUSINESS_NAME}} can help you"

2. SERVICES GRID (3-column, minimum 6 cards)
   - Icon, service title, 2-3 line description, price hint, "Learn More" / "Book Now" CTA

3. HOW IT WORKS (3-step horizontal flow)
   - Large brand-colour step number, step title, description
   - Arrow connectors between steps on desktop

4. PRICING TABLE (3 tiers: Starter / Professional / Enterprise or equivalent)
   - Feature checklist per tier, highlighted "Most Popular" tier, CTA per tier

5. FAQ SECTION (accordion, 6-8 questions derived from service context)

6. CTA BANNER
   - "Ready to get started? Let's talk." + button -> /contact

SEO META:
  <title>Services | {{BUSINESS_NAME}}</title>
  <meta name="description" content="Explore the professional services offered by
  {{BUSINESS_NAME}}. Book a free consultation today.">

{{SCHEMA_DIRECTIVE}}         types: Service + ProfessionalService
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.4 Shop / Products

```
ROLE: You are an e-commerce UI/UX designer.

TASK: Generate a Shop / Products catalogue page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. PAGE HERO
   - Headline: "Shop {{BUSINESS_NAME}}"
   - Category filter chips row (derived from product categories)

2. PRODUCT GRID (responsive: 1 col mobile -> 2 tablet -> 3-4 desktop)
   Each product card:
   - Product image (aspect-ratio 4:3, object-cover, rounded-xl)
   - Product name (bold)
   - 1-line description
   - Price (brand-primary colour, bold)
   - "Add to Cart" button + wishlist heart icon
   - Conditional badges: "Sale" (red), "New" (green), "Best Seller" (amber)

3. FEATURED COLLECTION BANNER (full-width)
   - Brand-primary gradient background + featured product image
   - Headline, subheadline, "Shop Collection" CTA

4. TRUST BADGES STRIP (3 icons)
   - Free shipping threshold | Easy returns | Secure checkout (SSL)

5. TESTIMONIALS (3 product review cards)
   - Star rating, review text, reviewer name, product name

6. NEWSLETTER SIGNUP
   - "Get exclusive deals" - email input + "Subscribe" button
   - Privacy micro-copy: "No spam. Unsubscribe anytime."

SEO META:
  <title>Shop | {{BUSINESS_NAME}}</title>
  <meta name="description" content="Browse the full {{BUSINESS_NAME}} collection.
  Quality products with fast delivery and easy returns.">

{{SCHEMA_DIRECTIVE}}         types: CollectionPage + ItemList + Product (with Offer per item)
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.5 Bookings

```
ROLE: You are a UX designer specialising in appointment and reservation flows.

TASK: Generate a Bookings / Reservations page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. PAGE HERO
   - Headline: "Book with {{BUSINESS_NAME}}"
   - Subheadline: "Simple, fast, confirmed instantly"
   - Primary CTA: "Book Now" -> smooth scroll to booking form

2. BOOKING FORM (2-column layout)
   Left panel:  Calendar date-picker + time slot selector (morning / afternoon / evening chips)
   Right panel: Service selector dropdown, Full Name, Email, Phone, Special Notes, Submit button
   - Submit button text: "Confirm Booking"
   - Inline validation on all required fields

3. WHY BOOK WITH US (3 icon + text blocks)
   - Instant confirmation | Easy rescheduling | 24/7 support

4. NEXT AVAILABLE SLOTS PREVIEW
   - Next 7 available time slots shown as clickable chips

5. CANCELLATION & RESCHEDULING POLICY
   - Accordion or clear text block with icon

6. LOCATION + CONTACT (2-column grid)
   - Static map image, address, phone, email

SEO META:
  <title>Book an Appointment | {{BUSINESS_NAME}}</title>
  <meta name="description" content="Book an appointment or reservation with
  {{BUSINESS_NAME}}. Instant confirmation, easy rescheduling.">

{{SCHEMA_DIRECTIVE}}         types: Event + ReservationAction
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.6 Contact

```
ROLE: You are a UX/UI designer focused on lead generation.

TASK: Generate a Contact page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. PAGE HERO
   - Headline: "Get in Touch"
   - Subheadline: "We'd love to hear from you"

2. CONTACT FORM (left column, ~60% width)
   - Fields: Full Name, Email, Phone (optional), Subject (dropdown), Message (textarea)
   - GDPR consent checkbox: "I agree to the Privacy Policy"
   - Submit button: "Send Message"
   - Success state: animated checkmark + "We'll be in touch within 24 hours"

3. CONTACT DETAILS (right column, ~40% width)
   - Address with map-pin icon (links to Google Maps)
   - Phone with phone icon (click-to-call tel: link)
   - Email with email icon (mailto: link)
   - Business hours table (Mon-Sun)
   - Social media icon row

4. EMBEDDED MAP (full-width, 300px height)
   - Static map image or Google Maps iframe

5. FAQ TEASER (3 quick questions + short answers)
   - "See all FAQs" link -> /services

SEO META:
  <title>Contact {{BUSINESS_NAME}} | Get in Touch</title>
  <meta name="description" content="Contact {{BUSINESS_NAME}} by phone, email,
  or visit us in store. We're always happy to help.">

{{SCHEMA_DIRECTIVE}}         types: ContactPage + LocalBusiness
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.7 Terms & Conditions

```
ROLE: You are a legal content specialist and web designer.

TASK: Generate a Terms & Conditions page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE STRUCTURE:

1. PAGE HERO
   - Title: "Terms & Conditions"
   - "Effective date: {{CURRENT_DATE}}"

2. STICKY TABLE OF CONTENTS (left sidebar on desktop, collapsible on mobile)
   - Numbered anchor links to each section below

3. CONTENT SECTIONS
    1.  Introduction & Acceptance of Terms
    2.  Use of the Website
        - Acceptable use, prohibited activities, account responsibilities
    3.  Intellectual Property Rights
    4.  User Accounts & Registration
    5.  Products / Services - Description & Pricing
    6.  Orders, Payment & Cancellation
    7.  Delivery & Shipping Policy
    8.  Returns & Refunds
    9.  Limitation of Liability & Disclaimer of Warranties
    10. Privacy & Data Protection (link to /privacy)
    11. Cookie Policy (link to cookie settings)
    12. Governing Law & Jurisdiction (jurisdiction: {{COUNTRY}})
    13. Changes to These Terms
    14. Contact Information

4. FOOTER CTA
   - "Questions about these terms? Contact us" -> /contact

DESIGN: Max-width prose container (720px), anchored section headings with smooth-scroll nav,
muted alternating section backgrounds, body 17px line-height 1.8.

SEO META:
  <title>Terms & Conditions | {{BUSINESS_NAME}}</title>
  <meta name="robots" content="noindex">

{{SCHEMA_DIRECTIVE}}         type: WebPage
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 2.8 Privacy Policy

```
ROLE: You are a GDPR-compliant legal content specialist and web designer.

TASK: Generate a Privacy Policy page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE STRUCTURE:

1. PAGE HERO
   - Title: "Privacy Policy"
   - "Last updated: {{CURRENT_DATE}}"

2. STICKY TABLE OF CONTENTS (left sidebar on desktop)

3. CONTENT SECTIONS
    1.  Who We Are
        Company name, registered address, contact email, Data Controller identity
    2.  What Data We Collect
        - Personal data: name, email, phone, address
        - Usage data: IP address, browser type, pages visited, time on site
        - Cookie data (see section 10)
        - Payment data: processed by third-party, not stored by us
    3.  How We Collect Data
        Website forms, cookies, analytics tools, third-party integrations
    4.  Why We Use Your Data (Legal Basis - GDPR Art. 6)
        Contractual necessity, legitimate interest, consent, legal obligation
    5.  How We Use Your Data
        Service delivery, communication, personalisation, analytics,
        marketing (with consent only)
    6.  Data Sharing & Third Parties
        List each processor by name with purpose (e.g. Stripe, Google Analytics,
        Mailchimp, Vercel). State: we never sell personal data.
    7.  International Data Transfers
        Standard Contractual Clauses or adequacy decisions
    8.  Data Retention
        Retention period per data category
    9.  Your Rights (GDPR Art. 15-22)
        Access, Rectification, Erasure, Portability, Objection, Withdraw Consent.
        How to exercise: email {{EMAIL}}
    10. Cookie Policy
        Essential, Analytics, Marketing, Functional categories.
        How to manage via the cookie banner or browser settings.
    11. Children's Privacy
        Service not directed to users under 16
    12. Data Security
        Encryption in transit (TLS), access controls, breach notification
        procedure (72-hour supervisory authority reporting)
    13. Changes to This Policy
    14. Contact the Data Controller
        {{BUSINESS_NAME}}, {{ADDRESS}}, {{EMAIL}}
    15. Right to Lodge a Complaint
        Relevant supervisory authority for {{COUNTRY}}

DESIGN: Same as Terms page - max-width prose, anchored nav, muted section separators.

SEO META:
  <title>Privacy Policy | {{BUSINESS_NAME}}</title>
  <meta name="robots" content="noindex">

{{SCHEMA_DIRECTIVE}}         type: WebPage
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

## 3. Landing Page Prompts

### 3.1 Business Overview Landing Page

```
ROLE: You are a conversion copywriter and landing page designer.

TASK: Generate a single-page business overview landing page for {{BUSINESS_NAME}}.
      No site-wide navigation - keep focus entirely on conversion.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. HERO (above the fold — everything needed to convert)
   - Bold H1 value proposition mentioning {{BUSINESS_NAME}}
   - Subheadline: 1-2 sentences expanding the promise
   - Primary CTA: "Get Started" or "Book Now" -> /contact
   - Secondary CTA: "Learn More" -> smooth scroll to features section
   - Background: gradient using {{BRAND_PRIMARY}}
   - Social proof micro-copy: "Trusted by X+ customers · 5-star rated"

2. FEATURES (3-column icon grid)
   - Icon + bold heading + 2-line benefit description
   - Content derived from {{DESCRIPTION}}

3. SOCIAL PROOF (3 testimonial cards)
   - Customer photo, name, role/company, star rating, quote

4. ABOUT SNIPPET
   - 3 sentences - human, brand-voice aligned, builds trust

5. FINAL CTA BANNER
   - Full-width {{BRAND_PRIMARY}} gradient
   - Heading + single action button: "Contact Us Today"

6. MINIMAL FOOTER
   - Logo | Privacy Policy | Terms | Cookie Settings

SEO META + OG TAGS:
  <title>{{BUSINESS_NAME}} | {{TAGLINE}}</title>
  <meta name="description" content="{{DESCRIPTION}}">

{{SCHEMA_DIRECTIVE}}         types: WebPage + LocalBusiness
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 3.2 Lead Capture Landing Page

```
ROLE: You are a growth marketer and landing page specialist.

TASK: Generate a high-converting lead capture landing page for {{BUSINESS_NAME}}.

GOAL: Capture visitor email (and optionally phone) in exchange for a lead magnet
      (free consultation, ebook, discount code, free trial).

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. HERO (above the fold - form must be visible without scrolling)
   - Power headline: problem-aware, outcome-focused
   - Subheadline: what the visitor receives and the specific benefit
   - Lead capture form (right side on desktop, stacked below headline on mobile):
       Fields: First Name, Email, Phone (optional)
       CTA button: "Get Free [Lead Magnet Name]" - high contrast, large (52px height)
   - Trust signals below form:
       Lock icon + "100% secure. No spam. Unsubscribe any time."
       Mini testimonial: one-line quote + customer name

2. SOCIAL PROOF BAR
   - Client logo strip OR customer count + star rating badge

3. WHAT YOU GET (3-5 bullet points or icon cards)
   - Each point: specific, tangible benefit of the lead magnet

4. HOW IT WORKS (3 steps)
   - Step 1: Fill the form
   - Step 2: We get in touch within 24h
   - Step 3: [Specific outcome for the visitor]

5. TESTIMONIALS (2-3 cards focused on the outcome the offer delivers)

6. URGENCY / SCARCITY ELEMENT
   - "Only X spots remaining this month" or countdown timer
   - Colour: amber/orange - distinct from brand-primary - to signal urgency

7. REPEAT CTA (identical form anchored to top form section)
   - "Claim your free [lead magnet]" heading + same form fields

8. MINIMAL FOOTER
   - Privacy Policy | Terms | Cookie Settings

SEO META + OG TAGS:
  <title>[Lead Magnet Name] - Free from {{BUSINESS_NAME}}</title>
  <meta name="description" content="Claim your free [offer] from {{BUSINESS_NAME}}.
  [Specific outcome promise].">

{{SCHEMA_DIRECTIVE}}         types: WebPage + Offer
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 3.3 Promotional / Sale Landing Page

```
ROLE: You are a direct-response copywriter and e-commerce landing page designer.

TASK: Generate an urgency-driven promotional sale landing page for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. ANNOUNCEMENT TOP BAR
   - "Limited Time Offer - [X]% OFF Ends [DATE]"
   - Optional countdown timer inline in the bar

2. HERO
   - Headline: discount + product/service name in bold
   - Before/after pricing: strikethrough original price -> sale price (large, brand colour)
   - Primary CTA: "Shop Now" or "Claim Offer"
   - Urgency copy: "Only X items left" or live "Offer ends in HH:MM:SS" countdown
   - Background: gradient using {{BRAND_PRIMARY}}

3. FEATURED SALE ITEMS (2-4 cards)
   - Product image, name, original price (strikethrough), sale price, "Add to Cart" button

4. WHY BUY NOW (3 trust icon blocks)
   - Free Shipping on orders over [threshold]
   - 30-Day Easy Returns
   - Secure Checkout (SSL)

5. CUSTOMER REVIEWS (3 cards with product photos)
   - Star rating, review text, reviewer name, purchase date

6. FAQ (4-5 questions about the promotion)
   - Eligibility, returns on sale items, stacking discounts, delivery timing

7. FINAL CTA SECTION
   - Countdown timer + "Don't miss out - sale ends soon" + repeat CTA button

8. MINIMAL FOOTER
   - Logo | Privacy Policy | Terms | Cookie Settings

SEO META + OG TAGS:
  <title>[Promotion Name] Sale | {{BUSINESS_NAME}}</title>
  <meta name="description" content="[X]% off [product category] at {{BUSINESS_NAME}}.
  Limited time only - shop the sale now.">

{{SCHEMA_DIRECTIVE}}         types: WebPage + Offer (price, priceCurrency, priceValidUntil, availability, seller)
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 3.4 Product / Service Launch Landing Page

```
ROLE: You are a product marketer and landing page designer.

TASK: Generate an excitement-building product or service launch landing page
      for {{BUSINESS_NAME}}.

BUSINESS CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. LAUNCH HERO
   - Headline: "Introducing [Product / Service Name]"
   - Large product hero image (right side) or hero video embed
   - Subheadline: core benefit in one punchy sentence
   - CTA: "Buy Now" / "Pre-Order Now" with price displayed alongside
   - "Launching [DATE]" countdown badge if pre-launch
   - Email capture below CTA: "Notify me on launch day"

2. THE PROBLEM IT SOLVES (2-column empathy block)
   Left:  "Before [Product]" - pain points (muted/red palette)
   Right: "After [Product]"  - outcomes (green/brand palette)

3. FEATURE DEEP-DIVE (alternating 2-column rows)
   - Image left/text right, then text left/image right alternating
   - Each row: feature name (H3), 2-3 sentence description, specific benefit statement

4. TECHNICAL SPECIFICATIONS TABLE
   - Key specs in clean two-column table

5. COMPARISON TABLE (this product vs competitor or previous version)
   - Feature rows with tick / cross / value per column

6. EARLY ACCESS / PRE-ORDER SECTION
   - Email capture OR direct purchase CTA
   - Scarcity line: "First 100 customers receive [X]% early-bird discount"
   - Trust signal: "30-day money-back guarantee"

7. BETA / EARLY ADOPTER TESTIMONIALS (2-3 quotes)

8. LAUNCH COUNTDOWN TIMER (if pre-launch)
   - Days | Hours | Minutes | Seconds

9. FINAL CTA
   - Price display + "Order Now" button + shipping note

SEO META + OG TAGS:
  <title>Introducing [Product] | {{BUSINESS_NAME}}</title>
  <meta name="description" content="[Product] is here. [One-line value prop].
  Pre-order now from {{BUSINESS_NAME}}.">

{{SCHEMA_DIRECTIVE}}         types: WebPage + Product (offers: { @type: Offer, availability: PreOrder })
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

### 3.5 Event / Webinar Registration Landing Page

```
ROLE: You are an event marketer and landing page designer.

TASK: Generate an event registration landing page for {{BUSINESS_NAME}}.

EVENT CONTEXT: {{BUSINESS_CONTEXT}}

PAGE SECTIONS (in order):

1. EVENT HERO
   - Event name as H1 (large, bold)
   - Date, Time, Location (or "Live Online") - highly prominent, near the top
   - Registration form (right side on desktop, stacked below on mobile):
       Fields: Full Name, Email, Phone (optional), Company (optional)
       CTA button: "Register Now - It's Free" or "Save My Seat"
   - Countdown timer to event date/time
   - High-quality event banner image or branded illustration

2. WHAT YOU'LL LEARN / GAIN (4-6 icon cards)
   - Outcome-focused language: "You will learn...", "You will leave with..."

3. SPEAKERS / HOSTS (2-3 profile cards)
   - Circular photo, name, title, company, 1-line bio

4. AGENDA / SCHEDULE (vertical timeline)
   - Time | Session title | Speaker name per row

5. WHO SHOULD ATTEND (3-4 audience persona blocks)
   - Icon + persona type + 1-line description of why it is relevant for them

6. SOCIAL PROOF FROM PAST EVENTS
   - Attendee count badge, 2-3 testimonial quotes, photo gallery thumbnails

7. SPONSORS / PARTNERS LOGO STRIP (if applicable)

8. FINAL REGISTRATION SECTION
   - Repeat CTA form or button
   - "Only X seats remaining" scarcity line

9. FAQ ACCORDION (4-5 questions)
   - Is it really free?
   - Will it be recorded?
   - What is the format?
   - Can I ask questions live?
   - Where do I get the join link?

SEO META + OG TAGS:
  <title>[Event Name] | [Date] | {{BUSINESS_NAME}}</title>
  <meta name="description" content="Join us at [Event Name] on [date].
  [One-line value prop]. Register for free.">

{{SCHEMA_DIRECTIVE}}         types: WebPage + Event (startDate, endDate, location, organizer, offers)
{{DESIGN_SYSTEM_DIRECTIVE}}
{{COOKIE_CONSENT_DIRECTIVE}}
```

---

## 4. Cookie Consent — Database Schema

### 4.1 SQL Table Definition

```sql
CREATE TABLE cookie_consent_events (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       VARCHAR(255) NOT NULL,
  session_id    UUID         NOT NULL,
  action        VARCHAR(50)  NOT NULL
                             CHECK (action IN (
                               'accept_all',
                               'reject_non_essential',
                               'custom'
                             )),
  essential     BOOLEAN      NOT NULL DEFAULT TRUE,
  analytics     BOOLEAN      NOT NULL DEFAULT FALSE,
  marketing     BOOLEAN      NOT NULL DEFAULT FALSE,
  functional    BOOLEAN      NOT NULL DEFAULT FALSE,
  page          VARCHAR(500),
  user_agent    TEXT,
  country       VARCHAR(10),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_site_id ON cookie_consent_events (site_id);
CREATE INDEX idx_consent_created ON cookie_consent_events (created_at);
CREATE INDEX idx_consent_action  ON cookie_consent_events (action);
```

### 4.2 API Endpoints

**`POST /api/cookie-consent`** — Persist a consent event

Request body:
```json
{
  "siteId":     "string",
  "sessionId":  "uuid-v4",
  "action":     "accept_all | reject_non_essential | custom",
  "essential":  true,
  "analytics":  false,
  "marketing":  false,
  "functional": false,
  "timestamp":  "2026-05-13T10:00:00Z",
  "userAgent":  "Mozilla/5.0 ...",
  "page":       "/shop",
  "country":    "GB"
}
```

Response: `{ "success": true }` · HTTP 201

---

**`GET /api/cookie-consent?siteId=&from=&to=`** — Aggregated stats for Website Stats dashboard

Response:
```json
{
  "siteId": "string",
  "period": { "from": "ISO8601", "to": "ISO8601" },
  "totals": {
    "total": 0,
    "acceptedAll": 0,
    "rejectedNonEssential": 0,
    "custom": 0
  },
  "optInRates": {
    "analytics":  0.0,
    "marketing":  0.0,
    "functional": 0.0
  },
  "byCountry": [
    { "country": "GB", "count": 0, "acceptRate": 0.0 }
  ],
  "byDay": [
    { "date": "YYYY-MM-DD", "acceptedAll": 0, "rejected": 0, "custom": 0 }
  ]
}
```

---

## 5. Variable Reference

| Variable | Source |
|---|---|
| `{{BUSINESS_NAME}}` | Business info form |
| `{{TAGLINE}}` | Business info form |
| `{{DESCRIPTION}}` | Business info form |
| `{{INDUSTRY}}` | Auto-detected from description |
| `{{EMAIL}}` | Business info form |
| `{{PHONE}}` | Business info form |
| `{{ADDRESS}}` | Business address fields |
| `{{STREET}}` | Business address fields |
| `{{CITY}}` | Business address fields |
| `{{STATE}}` | Business address fields |
| `{{ZIP}}` | Business address fields |
| `{{COUNTRY}}` | Business address fields |
| `{{LOGO_URL}}` | Uploaded or AI-generated logo |
| `{{BANNER_URL}}` | Uploaded banner / hero image |
| `{{BRAND_PRIMARY}}` | Selected colour scheme (hex) |
| `{{SITE_URL}}` | Published domain |
| `{{CURRENT_DATE}}` | Server-side timestamp at generation time |
| `{{SOCIAL_PROFILE_URLS}}` | Social links from business profile |
| `{{SCHEMA_TYPES}}` | Auto-detected from `PAGE_SCHEMA_MAP` in `lib/ai-prompts.ts` |
| `{{PRIMARY_SCHEMA_TYPE}}` | Primary type from `PAGE_SCHEMA_MAP` |
| `{{BUSINESS_CONTEXT}}` | All business fields combined into a single block |
| `{{SCHEMA_DIRECTIVE}}` | Compiled schema instruction — Section 1.3 |
| `{{DESIGN_SYSTEM_DIRECTIVE}}` | Shared design system rules — Section 1.1 |
| `{{COOKIE_CONSENT_DIRECTIVE}}` | Cookie banner specification — Section 1.4 |
