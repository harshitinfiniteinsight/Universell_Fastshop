# FastShop AI Website Builder - Implementation Specification

**Module:** FastShop AI Website Builder  
**Platform:** Universell  
**Version:** 1.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Onboarding Flow](#2-onboarding-flow)
3. [AI Chat Integration](#3-ai-chat-integration)
4. [AI Page Generation](#4-ai-page-generation)
5. [DALL-E 3 Image Generation](#5-dall-e-3-image-generation)
6. [Website Scraping System](#6-website-scraping-system)
7. [GrapeJS Page Builder](#7-grapejs-page-builder)
8. [Menu Builder](#8-menu-builder)
9. [API Endpoints](#9-api-endpoints)
10. [Cost Estimation](#10-cost-estimation)

---

## 1. Executive Summary

### 1.1 Product Overview

Universell FastShop is an AI-powered website builder module that enables users to create fully customized online stores through intelligent automation and visual editing tools. The system combines conversational AI for design consultation with automated content generation and a visual page builder.

### 1.2 Key Features

| Feature | Description |
|---------|-------------|
| **Conversational AI Onboarding** | GPT-5 powered design consultation that guides users through brand setup |
| **Reference Website Analysis** | Scrape and learn from inspiration sites (WordPress, Shopify, custom) |
| **Automated Page Generation** | AI creates complete page structures with content and styling |
| **AI Image Generation** | DALL-E 3 integration for custom hero images, products, and banners |
| **Visual Page Builder** | GrapeJS-based drag-and-drop editor with custom blocks |
| **Smart Menu Builder** | Drag-and-drop navigation management for header and footer |

### 1.3 Target Users

- Small business owners creating their first online store
- Entrepreneurs launching new brands
- Existing businesses migrating to a modern platform
- Users with no technical or design experience

### 1.4 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  (Onboarding Wizard, Dashboard, Page Editor, Menu Builder)       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│              (REST API with JWT Authentication)                  │
└──────────┬──────────────────┬───────────────────┬───────────────┘
           │                  │                   │
           ▼                  ▼                   ▼
┌──────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│   AI SERVICES    │ │  CORE SERVICES  │ │    EXTERNAL SERVICES    │
│                  │ │                 │ │                         │
│ • GPT-5 Chat     │ │ • Site Manager  │ │ • OpenAI API (GPT-5)    │
│ • Page Generator │ │ • Page Manager  │ │ • OpenAI DALL-E 3       │
│ • Content Writer │ │ • Menu Manager  │ │ • CDN Storage           │
│ • Site Analyzer  │ │ • Brand Vault   │ │                         │
└──────────────────┘ └─────────────────┘ └─────────────────────────┘
           │                  │
           ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE                            │
│                    (MySQL Database + File Storage)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Onboarding Flow

### 2.1 Overview

The onboarding wizard guides users through a 7-step process to collect business information, establish brand identity, and generate their initial website structure.

### 2.2 Step-by-Step Flow

```
┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌───────────┐
│ Welcome │───▶│ Brand Vault │───▶│ AI Chat  │───▶│ Shop Type │
└─────────┘    └─────────────┘    └──────────┘    └───────────┘
                                                        │
┌─────────────┐    ┌────────────┐    ┌─────────────────┐│
│   Review    │◀───│  Generate  │◀───│ Select Products ││
│  & Launch   │    │   Pages    │    │   / Services    │◀┘
└─────────────┘    └────────────┘    └─────────────────┘
```

### 2.3 Step Details

#### Step 1: Welcome
**Purpose:** Initial greeting and business basics

**Data Collected:**
- Business name
- Tagline
- Brief description
- Logo upload (optional)
- Banner image upload (optional)

**Behavior:**
- Pre-fill data from user signup if available
- Extract colors from uploaded logo automatically
- Show animated feature cards showcasing platform capabilities

---

#### Step 2: Brand Vault
**Purpose:** Comprehensive brand configuration

**Sub-steps:**

**2a. Core Assets**
| Field | Type | Description |
|-------|------|-------------|
| Inspiration Links | Array of URLs | Reference websites for design inspiration |
| Logo | File Upload | Brand logo image |
| Primary Color | Hex Color | Main brand color |
| Secondary Color | Hex Color | Supporting color |
| Accent Color | Hex Color | Highlight/CTA color |

**2b. Brand Style**
| Field | Options | Description |
|-------|---------|-------------|
| Design Styles | Modern, Minimal, Playful, Elegant, Bold | Multiple selection allowed |
| Typography | Clean & Modern, Classic & Professional, Fun & Friendly | Single selection |

**2c. Personality**
| Field | Type | Description |
|-------|------|-------------|
| Brand Tones | Friendly, Professional, Premium, Playful, Trustworthy | Multiple selection |
| Target Audience | Free text | Description of ideal customers |

**2d. Extras**
| Field | Type | Description |
|-------|------|-------------|
| Social Links | Array of URLs | Instagram, Facebook, Twitter, etc. |
| Brand Guidelines URL | URL | Link to existing brand guidelines |
| Notes for AI | Free text | Special instructions for content generation |
| Do's & Don'ts | Free text | Things to include/avoid |

---

#### Step 3: AI Chat Design
**Purpose:** Conversational design consultation

**Features:**
- Real-time chat with AI design consultant
- Color palette suggestions and selection
- Shop type recommendation
- Page structure recommendations
- Custom prompts for each page

**See Section 3 for complete AI Chat specification.**

---

#### Step 4: Shop Type Selection
**Purpose:** Define business model

**Options:**
| Type | Description | Example |
|------|-------------|---------|
| Products | Physical or digital goods | E-commerce store |
| Services | Service-based business | Consulting, agency |
| Booking | Appointment-based | Salon, restaurant |
| Hybrid | Combination of above | Spa with products |

---

#### Step 5: Select Products/Services
**Purpose:** Choose items to feature on website

**Behavior:**
- Display existing inventory items from Universell
- Allow selection of items to showcase
- Support category-based selection
- Preview selected items

---

#### Step 6: AI Page Generation
**Purpose:** Automatically generate website pages

**Process:**
1. Display selected pages with progress indicators
2. Generate content for each page using AI
3. Generate images where needed (hero, banners)
4. Show real-time generation progress
5. Allow regeneration of individual pages

**See Section 4 for complete AI Page Generation specification.**

---

#### Step 7: Review & Launch
**Purpose:** Final review before publishing

**Features:**
- Preview all generated pages
- Edit page order
- Quick edit page content
- Publish or save as draft
- Redirect to dashboard on completion

---

## 3. AI Chat Integration

### 3.1 Feature Overview

The AI Chat provides conversational design consultation during onboarding. It helps users define their brand identity, select colors, choose page structures, and customize content through natural language interaction.

### 3.2 Conversation Flow

```
┌────────────┐     ┌───────────┐     ┌─────────────┐
│ Inspiration│────▶│   Color   │────▶│ Color Shade │
└────────────┘     └───────────┘     └─────────────┘
                                            │
┌───────────┐     ┌────────────┐     ┌──────▼──────┐
│  Complete │◀────│   Pages    │◀────│  Shop Type  │
└───────────┘     └────────────┘     └─────────────┘
```

### 3.3 Conversation States

| State | Purpose | User Action | AI Response |
|-------|---------|-------------|-------------|
| `inspiration` | Collect reference websites | Share URLs or skip | Acknowledge and analyze |
| `color` | Primary color selection | Choose from palette | Present shade options |
| `color-shade` | Refine primary color | Select shade | Confirm and ask for secondary |
| `secondary-color` | Secondary color selection | Choose color | Show combined preview |
| `shop-type` | Business model selection | Select type | Recommend pages |
| `pages` | Page structure selection | Select/customize pages | Generate prompts per page |
| `complete` | Ready for generation | Confirm | Transition to generation |

### 3.4 System Prompt: Design Consultant

```
You are FastShop AI, an expert website design consultant helping users create 
their perfect online store. You guide users through brand discovery and website 
configuration with friendly, professional dialogue.

CONTEXT:
- Business Name: {{businessName}}
- Business Description: {{businessDescription}}
- Brand Colors: Primary: {{primaryColor}}, Secondary: {{secondaryColor}}, Accent: {{accentColor}}
- Design Style: {{designStyles}}
- Brand Tone: {{brandTones}}
- Target Audience: {{targetAudience}}
- Shop Type: {{shopType}}

CAPABILITIES:
1. Help users refine their brand identity
2. Suggest color palettes based on industry and brand personality
3. Recommend page structures for their business type
4. Generate content prompts for each page
5. Provide design style recommendations

CONVERSATION FLOW:
1. Acknowledge user's brand and show understanding
2. Ask clarifying questions about their vision
3. Offer specific, actionable suggestions
4. Confirm choices before proceeding

OUTPUT FORMAT:
- Keep responses concise (2-3 sentences max)
- Use encouraging, supportive tone
- Include specific examples when suggesting options
- End with clear next step or question

CONSTRAINTS:
- Never generate code directly in chat
- Focus on design and content decisions
- Defer technical implementation to the page generator
```

### 3.5 Color Palette System

**Primary Colors Available:**
| Color | Hex | Description |
|-------|-----|-------------|
| Red | #EF4444 | Bold, energetic, urgent |
| Orange | #F97316 | Friendly, creative, confident |
| Yellow | #EAB308 | Optimistic, cheerful, warm |
| Green | #22C55E | Growth, health, nature |
| Teal | #14B8A6 | Professional, calm, trustworthy |
| Blue | #3B82F6 | Trust, stability, professional |
| Indigo | #6366F1 | Creative, luxury, innovative |
| Purple | #A855F7 | Creative, premium, unique |
| Pink | #EC4899 | Playful, feminine, modern |
| Gray | #6B7280 | Neutral, professional, minimal |

**Shade Variations:**
Each primary color has 5 shade options:
- Lightest (100)
- Light (300)
- Medium (500) - Default
- Dark (700)
- Darkest (900)

### 3.6 Page Suggestions by Shop Type

**Products Shop:**
- Homepage, About, Products, Contact, Terms, Privacy

**Services Shop:**
- Homepage, About, Services, Portfolio, Contact, Terms, Privacy

**Booking Shop:**
- Homepage, About, Services, Booking, Gallery, Contact, Terms, Privacy

**Hybrid Shop:**
- Homepage, About, Products, Services, Booking, Contact, Terms, Privacy

### 3.7 Request/Response Format

**Chat Request:**
```json
{
  "message": "User's message text",
  "conversationId": "unique-conversation-id",
  "context": {
    "businessInfo": {
      "name": "Business Name",
      "description": "Business description",
      "tagline": "Tagline"
    },
    "brandVault": {
      "primaryColor": "#hex",
      "secondaryColor": "#hex",
      "designStyles": ["modern", "minimal"],
      "brandTones": ["professional", "friendly"]
    },
    "currentStep": "color",
    "previousChoices": {}
  }
}
```

**Chat Response (Streaming):**
```json
{
  "token": "partial response text",
  "done": false
}
// Final message:
{
  "token": "",
  "done": true,
  "metadata": {
    "nextStep": "color-shade",
    "suggestions": [],
    "actions": []
  }
}
```

### 3.8 Streaming Implementation

The chat interface uses Server-Sent Events (SSE) for real-time token streaming:

1. Client opens EventSource connection to `/api/ai/chat`
2. Server streams tokens as they are generated
3. Client updates UI incrementally
4. Connection closes when `done: true` received
5. Typing indicator shows during generation

---

## 4. AI Page Generation

### 4.1 Feature Overview

The AI Page Generator creates complete website pages with structured content, appropriate sections, and styling based on the user's brand configuration and business context.

### 4.2 Generation Workflow

```
┌──────────────────┐
│  Load Context    │
│  (Business Info, │
│   Brand Vault)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Has Reference    │─Yes─▶│ Enhance Prompt   │
│ Site Analysis?   │      │ with Patterns    │
└────────┬─────────┘      └────────┬─────────┘
         │No                       │
         ▼                         │
┌──────────────────┐◀──────────────┘
│ Generate Page    │
│ Structure        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate Section │
│ Content          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Need Images?     │─Yes─▶│ Generate Images  │
│                  │      │ (DALL-E 3)       │
└────────┬─────────┘      └────────┬─────────┘
         │No                       │
         ▼                         │
┌──────────────────┐◀──────────────┘
│ Assemble &       │
│ Validate HTML    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save Page        │
└──────────────────┘
```

### 4.3 System Prompt: Page Generator

```
You are FastShop Page Generator, an AI that creates complete website page 
structures and content based on business context and user preferences.

INPUTS:
- businessInfo: {name, tagline, description, contact details, address}
- brandVault: {colors, styles, typography, tones, target audience}
- pageType: homepage | about | shop | services | contact | booking | terms | privacy
- customPrompt: User's specific requirements for this page

TASK: Generate a complete page structure with:

1. PAGE_METADATA:
   - title: SEO-optimized page title
   - description: Meta description (150-160 chars)
   - slug: URL-friendly slug

2. SECTIONS: Array of page sections, each containing:
   - sectionType: hero | text | features | gallery | testimonials | cta | contact | products | services | faq
   - headline: Section headline
   - subheadline: Supporting text
   - content: Detailed content blocks
   - ctaText: Call-to-action button text (if applicable)
   - ctaLink: CTA destination
   - style: {backgroundColor, textColor, layout}

3. DESIGN_TOKENS:
   - Apply brand colors throughout
   - Match typography preference
   - Align with selected design style

OUTPUT FORMAT: Structured JSON matching the page schema

QUALITY GUIDELINES:
- Content must be specific to the business, not generic
- Headlines should be compelling and benefit-focused
- Include social proof elements where appropriate
- Ensure mobile-responsive layout recommendations
- Follow accessibility best practices
```

### 4.4 Section Types

| Section Type | Purpose | Required Fields |
|--------------|---------|-----------------|
| `hero` | Full-width hero banner | headline, subheadline, ctaText, backgroundImage |
| `text` | Text content block | headline, content |
| `features` | Feature highlights | headline, features[] with icon, title, description |
| `gallery` | Image gallery | headline, images[] |
| `testimonials` | Customer reviews | headline, testimonials[] with quote, author, role |
| `cta` | Call to action | headline, subheadline, ctaText, ctaLink |
| `contact` | Contact information | headline, address, phone, email, formEnabled |
| `products` | Product showcase | headline, productIds[], layout |
| `services` | Service listing | headline, serviceIds[], layout |
| `faq` | FAQ accordion | headline, questions[] with question, answer |
| `team` | Team members | headline, members[] with name, role, image |
| `pricing` | Pricing tables | headline, plans[] with name, price, features |

### 4.5 Page Generation Output Schema

```json
{
  "metadata": {
    "title": "Welcome to Sunrise Cafe & Bakery",
    "description": "Fresh baked goods and artisan coffee in downtown. Visit us for the best pastries and coffee experience.",
    "slug": "home"
  },
  "sections": [
    {
      "id": "hero-1",
      "sectionType": "hero",
      "headline": "Where Every Morning Starts with Warmth",
      "subheadline": "Fresh baked goods and artisan coffee crafted with love",
      "ctaText": "View Our Menu",
      "ctaLink": "/products",
      "style": {
        "backgroundColor": "{{primaryColor}}",
        "textColor": "#ffffff",
        "layout": "center"
      },
      "backgroundImage": {
        "generate": true,
        "prompt": "Warm bakery interior with fresh bread and pastries, morning light"
      }
    },
    {
      "id": "features-1",
      "sectionType": "features",
      "headline": "Why Choose Us",
      "features": [
        {
          "icon": "coffee",
          "title": "Fresh Daily",
          "description": "Everything baked fresh every morning"
        },
        {
          "icon": "leaf",
          "title": "Local Ingredients",
          "description": "Sourced from local farms and suppliers"
        },
        {
          "icon": "heart",
          "title": "Made with Love",
          "description": "Family recipes passed down generations"
        }
      ],
      "style": {
        "backgroundColor": "#ffffff",
        "textColor": "{{textColor}}",
        "layout": "grid-3"
      }
    }
  ],
  "designTokens": {
    "primaryColor": "#F97316",
    "secondaryColor": "#FED7AA",
    "accentColor": "#EA580C",
    "fontFamily": "Inter, system-ui, sans-serif"
  }
}
```

### 4.6 Content Refinement Prompt (Editor AI)

```
You are FastShop Editor AI, helping users refine and modify their generated 
pages in real-time.

CONTEXT:
- Current page structure: {{pageJSON}}
- User's brand vault: {{brandVault}}
- Current section selected: {{selectedSection}}

CAPABILITIES:
1. Modify text content in any section
2. Rearrange section order
3. Add/remove sections
4. Change styling (colors, fonts, spacing)
5. Generate new content blocks
6. Suggest improvements based on best practices

RESPONSE FORMAT:
1. Acknowledge the user's request
2. Describe the changes made
3. Return updated section JSON if applicable

EXAMPLE:
User: "Make the hero section more exciting"
Response: "I've updated your hero with a more dynamic headline and added an 
animated background gradient. The CTA now uses action-oriented language."
{updatedSectionJSON}
```

---

## 5. DALL-E 3 Image Generation

### 5.1 Feature Overview

AI-powered image generation creates custom visuals for hero sections, product placeholders, team photos, banners, and background patterns tailored to the user's brand.

### 5.2 Image Generation Workflow

```
┌──────────────────┐
│ Image Request    │
│ (type, context)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Build Prompt     │
│ with Brand       │
│ Context          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Call DALL-E 3    │
│ API              │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Receive Temp URL │
│ (expires ~1hr)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Download Image   │
│ Binary           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Optimize for Web │
│ (resize, compress)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Upload to CDN    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save Metadata    │
│ Return Perm URL  │
└──────────────────┘
```

### 5.3 API Configuration

**Endpoint:** `https://api.openai.com/v1/images/generations`

**Model:** `dall-e-3`

**Parameters:**
| Parameter | Value | Description |
|-----------|-------|-------------|
| model | `dall-e-3` | Latest DALL-E model |
| n | `1` | DALL-E 3 only supports 1 image per request |
| size | See below | Image dimensions |
| quality | `standard` or `hd` | HD for higher detail |
| style | `vivid` or `natural` | Vivid = hyper-real, Natural = more realistic |

### 5.4 Size Selection by Image Type

| Image Type | Size | Aspect Ratio |
|------------|------|--------------|
| Hero Image | `1792x1024` | Landscape (16:9) |
| Product Image | `1024x1024` | Square (1:1) |
| Banner | `1792x1024` | Landscape (16:9) |
| Social Media | `1024x1024` | Square (1:1) |
| Vertical Banner | `1024x1792` | Portrait (9:16) |
| Background Pattern | `1024x1024` | Square (1:1) |

### 5.5 Prompt Templates

#### Hero Image
```
Professional hero image for {{businessName}}, a {{businessDescription}}. 
{{styleDescriptors}} aesthetic, {{brandTones}} mood. 
High-quality commercial photography style. 
No text or logos in the image.
```

**Variables:**
- `businessName`: User's business name
- `businessDescription`: Brief description of business
- `styleDescriptors`: Design styles (Modern, Elegant, etc.)
- `brandTones`: Brand personality (Professional, Friendly, etc.)

#### Product Image
```
Product photography of {{productName}} for {{businessName}}. 
Clean {{styleDescriptors}} aesthetic, studio lighting, 
professional e-commerce style, white or neutral background.
No text or watermarks.
```

#### Team/About Photo
```
Professional team photo placeholder for {{businessName}}. 
{{brandTones}} atmosphere, modern office or workspace setting.
Diverse group of professionals, natural poses, warm lighting.
```

#### Banner Image
```
Marketing banner for {{businessName}} {{campaignName}}. 
{{styleDescriptors}} design, promotional, eye-catching, 
{{primaryColor}} color accents. No text.
```

#### Background Pattern
```
Abstract background pattern for {{businessName}} website. 
Subtle {{styleDescriptors}} style, {{primaryColor}} and {{secondaryColor}} tones, 
seamless texture, minimal, suitable for text overlay.
```

### 5.6 Cost Optimization

| Quality | Size | Cost per Image |
|---------|------|----------------|
| Standard | 1024x1024 | $0.040 |
| Standard | 1792x1024 | $0.080 |
| Standard | 1024x1792 | $0.080 |
| HD | 1024x1024 | $0.080 |
| HD | 1792x1024 | $0.120 |
| HD | 1024x1792 | $0.120 |

**Optimization Strategy:**
- Use `standard` quality for initial drafts and previews
- Use `hd` quality only for final published hero images
- Cache generated images to avoid regeneration
- Store the `revised_prompt` from API response for reproducibility

### 5.7 Image Storage

**Workflow:**
1. Receive temporary URL from DALL-E (expires in ~1 hour)
2. Download image binary immediately
3. Resize/optimize for web delivery
4. Upload to CDN/file storage with unique filename
5. Store metadata in database:
   - Original prompt
   - Revised prompt (from DALL-E)
   - Image type
   - Dimensions
   - CDN URL
   - Site/page association
6. Return permanent CDN URL to frontend

---

## 6. Website Scraping System

### 6.1 Feature Overview

The scraping system analyzes reference websites provided by users during onboarding. It extracts design patterns, content structure, color palettes, and navigation to inform AI-generated content.

### 6.2 Scraping Architecture

```
┌─────────────────┐
│ Reference URL   │
│ Input           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate URL    │
│ Check robots.txt│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Detect Platform │
│ (WP/Shopify/etc)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Queue Background│
│ Scraping Job    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│              BACKGROUND WORKER               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐     ┌─────────────┐        │
│  │   Sitemap   │────▶│    DOM      │        │
│  │   Parser    │     │   Scraper   │        │
│  └─────────────┘     └──────┬──────┘        │
│                             │               │
│         ┌───────────────────┼───────────────┤
│         ▼                   ▼               │
│  ┌─────────────┐     ┌─────────────┐        │
│  │   Asset     │     │  Content    │        │
│  │  Extractor  │     │  Analyzer   │        │
│  └──────┬──────┘     └──────┬──────┘        │
│         │                   │               │
│         └─────────┬─────────┘               │
│                   ▼                         │
│         ┌─────────────────┐                 │
│         │  AI Analysis    │                 │
│         │  (GPT-5)        │                 │
│         └────────┬────────┘                 │
│                  │                          │
└──────────────────┼──────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  Store Results  │
         │  Return to User │
         └─────────────────┘
```

### 6.3 Platform Detection

| Platform | Detection Method | Sitemap Location |
|----------|------------------|------------------|
| WordPress | Meta generator tag containing "WordPress", `/wp-content/` paths, `/wp-json/` API | `/wp-sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml` |
| Shopify | `cdn.shopify.com` URLs, `/cart.js` endpoint, Shopify cookies | `/sitemap.xml` (auto-generated) |
| WooCommerce | WordPress detection + WooCommerce-specific paths (`/product/`, `/shop/`) | WordPress sitemap + `/product-sitemap.xml` |
| Generic | Fallback when no platform detected | `/sitemap.xml`, `/sitemap-index.xml`, parse `robots.txt` |

### 6.4 Sitemap Parsing

**WordPress Sitemap Structure:**
- Main index: `/wp-sitemap.xml`
- Posts: `/wp-sitemap-posts-post-1.xml`
- Pages: `/wp-sitemap-posts-page-1.xml`
- Products (WooCommerce): `/wp-sitemap-posts-product-1.xml`

**Shopify Sitemap Structure:**
- Main index: `/sitemap.xml`
- Products: `/sitemap_products_1.xml`
- Pages: `/sitemap_pages_1.xml`
- Collections: `/sitemap_collections_1.xml`
- Blogs: `/sitemap_blogs_1.xml`

**Parsing Priority:**
1. Homepage (highest priority)
2. Main pages (About, Contact, Services)
3. Product/Collection pages
4. Blog posts (lowest priority)

### 6.5 Data Extraction

**DOM Scraper Extracts:**
- Page title and meta description
- Heading hierarchy (H1-H6)
- Section structure and content
- Navigation menus (header/footer)
- Images and media assets
- Color values from CSS
- Font families from stylesheets

**Asset Extractor Collects:**
- Logo images
- Hero/banner images
- Favicon
- Primary colors (by frequency)
- Font families used

### 6.6 AI Analysis Prompts

#### Structure Analysis Prompt
```
You are a website structure analyst. Given the scraped content from a reference 
website, analyze and extract a normalized structure.

INPUT:
- sitemap_urls: [list of discovered URLs]
- page_contents: {url: {title, headings, sections, meta}}
- navigation: {main_menu, footer_menu}

TASK: Create a normalized site structure that can be replicated.

OUTPUT JSON:
{
  "recommended_pages": [
    {
      "page_type": "homepage|about|products|services|contact|blog|custom",
      "suggested_name": "Page name",
      "sections_detected": ["hero", "features", "testimonials"],
      "content_summary": "Brief description of page purpose",
      "priority": 1-10
    }
  ],
  "navigation_structure": {
    "header": [{"label": "Link text", "url": "/path", "children": []}],
    "footer": [{"label": "Link text", "url": "/path"}]
  },
  "content_patterns": ["pattern descriptions for AI page generation"]
}
```

#### Design Pattern Extraction Prompt
```
You are a design system analyst. Extract design tokens and patterns from 
the scraped website data.

INPUT:
- colors_found: [hex codes with frequency]
- fonts_detected: [font families]
- spacing_patterns: [common margin/padding values]
- component_styles: {buttons, cards, headers}

OUTPUT JSON:
{
  "color_palette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "typography": {
    "heading_font": "Font Family",
    "body_font": "Font Family",
    "scale": "modular|linear"
  },
  "design_style": ["modern", "minimal", "bold"],
  "component_patterns": {
    "buttons": "style description",
    "cards": "style description",
    "sections": "layout patterns"
  }
}
```

#### Content Rewriting Prompt
```
You are a content strategist. Given extracted content from a reference site, 
generate NEW original content for the user's business.

IMPORTANT: Never copy content directly. Use the reference only for:
- Understanding content structure and flow
- Identifying effective messaging patterns
- Recognizing section purposes

INPUT:
- reference_content: {sections with text}
- user_business: {name, description, industry, target_audience}
- brand_voice: {tones, personality}

OUTPUT: New, original content tailored to the user's brand that follows 
similar structural patterns but is completely unique.
```

### 6.7 Rate Limiting & Ethics

**Rules:**
- Check `robots.txt` before scraping any URL
- Respect `Crawl-delay` directive if present
- Maximum 1 request per second per domain
- Set proper User-Agent: `UniversellBot/1.0 (FastShop Reference Analyzer)`
- Cache responses to avoid duplicate requests
- Timeout: 30 seconds per page
- Maximum: 50 pages per reference site
- Do not scrape password-protected content

**Job Queue:**
- Scraping runs as background job
- Return job ID immediately to frontend
- Frontend polls for status updates
- Store results for future reference

---

## 7. GrapeJS Page Builder

### 7.1 Feature Overview

GrapeJS provides a visual drag-and-drop page editor allowing users to customize AI-generated pages or build new pages from scratch using pre-built blocks.

### 7.2 Editor Components

```
┌────────────────────────────────────────────────────────────────────┐
│                         EDITOR HEADER                               │
│  [← Back] [Page Name]                    [Preview] [Save] [Publish] │
├─────────────┬──────────────────────────────────────────┬───────────┤
│             │                                          │           │
│   AI CHAT   │            VISUAL CANVAS                 │  BLOCKS   │
│   SIDEBAR   │                                          │  PANEL    │
│             │     ┌────────────────────────────┐       │           │
│  [Describe  │     │                            │       │  [Hero]   │
│   changes]  │     │     Page Preview           │       │  [Text]   │
│             │     │     with Live Editing      │       │  [Image]  │
│  [AI       │     │                            │       │  [Gallery]│
│   Response] │     │                            │       │  [CTA]    │
│             │     └────────────────────────────┘       │  [Contact]│
│             │                                          │  [...]    │
├─────────────┴──────────────────────────────────────────┴───────────┤
│                         STYLE MANAGER                               │
│  [Typography] [Colors] [Spacing] [Layout] [Effects]                 │
└────────────────────────────────────────────────────────────────────┘
```

### 7.3 Custom Block Categories

#### FastShop Blocks
| Block | Description |
|-------|-------------|
| Hero Section | Full-width banner with headline, subheadline, CTA button |
| Text Block | Rich text content with formatting options |
| Image | Single image with caption and link options |
| Image Gallery | Grid or carousel of images |
| Features Grid | 3-4 column feature highlights with icons |
| Testimonials | Customer review carousel or grid |
| Call to Action | Prominent CTA section with button |
| Contact Form | Customizable contact form |
| Products Grid | Dynamic product display from inventory |
| Services List | Service offerings with descriptions |
| FAQ Accordion | Expandable Q&A section |
| Team Grid | Team member profiles |
| Pricing Table | Pricing plan comparison |
| Social Links | Social media icon links |
| Map | Embedded location map |
| Video | Embedded video player |

### 7.4 Block HTML Templates

#### Hero Section
```html
<section class="hero-section" data-gjs-type="fastshop-hero">
  <div class="hero-content">
    <h1 class="hero-headline" data-gjs-editable="true">
      Your Headline Here
    </h1>
    <p class="hero-subheadline" data-gjs-editable="true">
      Supporting text that explains your value proposition
    </p>
    <a href="#" class="hero-cta" data-gjs-editable="true">
      Call to Action
    </a>
  </div>
</section>
```

#### Features Grid
```html
<section class="features-section" data-gjs-type="fastshop-features">
  <h2 class="section-headline" data-gjs-editable="true">
    Why Choose Us
  </h2>
  <div class="features-grid">
    <div class="feature-item">
      <div class="feature-icon" data-gjs-editable="true">★</div>
      <h3 class="feature-title" data-gjs-editable="true">Feature One</h3>
      <p class="feature-description" data-gjs-editable="true">
        Description of this feature and its benefits.
      </p>
    </div>
    <!-- Repeat for additional features -->
  </div>
</section>
```

#### Testimonials
```html
<section class="testimonials-section" data-gjs-type="fastshop-testimonials">
  <h2 class="section-headline" data-gjs-editable="true">
    What Our Customers Say
  </h2>
  <div class="testimonials-grid">
    <div class="testimonial-item">
      <p class="testimonial-quote" data-gjs-editable="true">
        "Amazing service and quality products!"
      </p>
      <div class="testimonial-author">
        <span class="author-name" data-gjs-editable="true">John Doe</span>
        <span class="author-role" data-gjs-editable="true">Customer</span>
      </div>
    </div>
  </div>
</section>
```

### 7.5 AI Block Generation

**Workflow:**
1. User opens AI sidebar in editor
2. Describes desired section: "Add a section showing our 3 main services with icons"
3. AI generates appropriate HTML block with content
4. Block inserted at cursor position in canvas
5. User can further customize visually

**AI Block Generation Prompt:**
```
You are a FastShop Block Generator. Generate semantic HTML for website sections.

REQUIREMENTS:
- Use semantic HTML5 elements
- Include data-gjs-editable="true" on text elements for inline editing
- Use CSS variables for brand colors: var(--primary), var(--secondary), var(--accent)
- Ensure responsive design with mobile-first approach
- Include placeholder content specific to the business

INPUT:
- Block description: {{userDescription}}
- Business context: {{businessInfo}}
- Brand colors: {{colors}}

OUTPUT: Clean HTML string only, no markdown formatting.
```

### 7.6 Brand Color Injection

When editor loads, inject brand colors as CSS variables:

```css
:root {
  --primary: #F97316;
  --secondary: #FED7AA;
  --accent: #EA580C;
  --text: #1F2937;
  --background: #FFFFFF;
  --muted: #9CA3AF;
}
```

All block templates reference these variables, ensuring consistent branding.

### 7.7 Editor Save/Export

**Save Formats:**
- **HTML**: Rendered page HTML for display
- **CSS**: Custom styles applied to page
- **JSON**: GrapeJS component structure for continued editing

**Export Options:**
- Save to database (default)
- Download as HTML file
- Publish to live site

---

## 8. Menu Builder

### 8.1 Feature Overview

The Menu Builder allows users to create and manage navigation menus for their website header and footer through a visual drag-and-drop interface.

### 8.2 Menu Structure

```
HEADER MENU                          FOOTER MENU
├── Home                             ├── Privacy Policy
├── Products ▼                       ├── Terms of Service
│   ├── Category 1                   ├── Contact Us
│   ├── Category 2                   └── FAQ
│   └── Category 3
├── Services
├── About Us
└── Contact
```

### 8.3 Menu Item Types

| Type | Description | Properties |
|------|-------------|------------|
| `page` | Internal page link | label, pageId, url |
| `category` | Product/service category | label, categoryId, url |
| `product` | Single product link | label, productId, url |
| `custom` | Custom URL | label, url, openInNewTab |
| `dropdown` | Parent with children | label, children[] |

### 8.4 Menu Item Data Structure

```json
{
  "id": "unique-id",
  "label": "Display Text",
  "url": "/page-slug",
  "itemType": "page|category|product|custom",
  "referenceId": "linked-entity-id",
  "parentId": null,
  "sortOrder": 1,
  "isVisible": true,
  "openInNewTab": false,
  "children": []
}
```

### 8.5 Menu Operations

| Operation | Description |
|-----------|-------------|
| Add Item | Add new menu item from available sources |
| Remove Item | Delete item (and children if dropdown) |
| Reorder | Drag and drop to change position |
| Nest | Drag item onto another to create dropdown |
| Unnest | Drag nested item to top level |
| Edit | Inline edit label and properties |
| Toggle Visibility | Show/hide item without deleting |

### 8.6 Available Sources

**Pages:**
- All published website pages
- Draft pages (marked as such)

**Categories:**
- Product categories from inventory
- Service categories

**Products/Services:**
- Individual products
- Individual services

**Custom Links:**
- External URLs
- Anchor links
- Email/phone links

### 8.7 Menu Preview

The builder includes a live preview showing how the menu appears on the website, updating in real-time as changes are made.

---

## 9. API Endpoints

### 9.1 Authentication

All API endpoints require JWT Bearer token authentication:

```
Authorization: Bearer <jwt_token>
```

### 9.2 Site Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sites` | List user's sites |
| POST | `/api/v1/sites` | Create new site |
| GET | `/api/v1/sites/{id}` | Get site details |
| PUT | `/api/v1/sites/{id}` | Update site |
| DELETE | `/api/v1/sites/{id}` | Delete site |
| POST | `/api/v1/sites/{id}/publish` | Publish site |

**Create Site Request:**
```json
{
  "name": "My Store",
  "subdomain": "mystore"
}
```

**Site Response:**
```json
{
  "id": 1,
  "userId": 123,
  "name": "My Store",
  "subdomain": "mystore",
  "customDomain": null,
  "status": "draft",
  "brandVaultId": 1,
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

### 9.3 Brand Vault

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sites/{id}/brand` | Get brand vault |
| PUT | `/api/v1/sites/{id}/brand` | Update brand vault |
| POST | `/api/v1/sites/{id}/brand/extract-colors` | Extract colors from image |

**Brand Vault Request:**
```json
{
  "primaryColor": "#F97316",
  "secondaryColor": "#FED7AA",
  "accentColor": "#EA580C",
  "designStyles": ["modern", "minimal"],
  "typographyPreference": "clean-modern",
  "brandTones": ["friendly", "professional"],
  "targetAudience": "Young professionals aged 25-40",
  "inspirationLinks": ["https://example.com"],
  "socialLinks": ["https://instagram.com/mybrand"],
  "notesForAi": "Focus on sustainability messaging"
}
```

### 9.4 Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sites/{id}/pages` | List site pages |
| POST | `/api/v1/sites/{id}/pages` | Create page |
| GET | `/api/v1/sites/{id}/pages/{pageId}` | Get page with content |
| PUT | `/api/v1/sites/{id}/pages/{pageId}` | Update page |
| DELETE | `/api/v1/sites/{id}/pages/{pageId}` | Delete page |
| PUT | `/api/v1/sites/{id}/pages/reorder` | Reorder pages |

**Create Page Request:**
```json
{
  "name": "About Us",
  "slug": "about",
  "pageType": "about",
  "status": "draft"
}
```

**Page Response:**
```json
{
  "id": 1,
  "siteId": 1,
  "name": "About Us",
  "slug": "about",
  "pageType": "about",
  "contentHtml": "<section>...</section>",
  "contentCss": ".hero { ... }",
  "contentJson": {},
  "seoTitle": "About Us | My Store",
  "seoDescription": "Learn about our story...",
  "status": "draft",
  "sortOrder": 2,
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

### 9.5 Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sites/{id}/menu/{location}` | Get menu (header/footer) |
| PUT | `/api/v1/sites/{id}/menu/{location}` | Update menu structure |

**Menu Request:**
```json
{
  "items": [
    {
      "id": "1",
      "label": "Home",
      "url": "/",
      "itemType": "page",
      "referenceId": "home",
      "sortOrder": 1,
      "isVisible": true,
      "children": []
    },
    {
      "id": "2",
      "label": "Products",
      "url": "/products",
      "itemType": "page",
      "referenceId": "products",
      "sortOrder": 2,
      "isVisible": true,
      "children": [
        {
          "id": "2-1",
          "label": "Bakery",
          "url": "/products/bakery",
          "itemType": "category",
          "referenceId": "bakery",
          "sortOrder": 1,
          "isVisible": true
        }
      ]
    }
  ]
}
```

### 9.6 AI Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/chat` | Send chat message (SSE stream) |

**Chat Request:**
```json
{
  "message": "I want a modern, professional look",
  "conversationId": "conv-123",
  "context": {
    "businessInfo": {
      "name": "Sunrise Cafe",
      "description": "Artisan bakery and coffee shop"
    },
    "brandVault": {
      "primaryColor": "#F97316",
      "designStyles": ["modern"],
      "brandTones": ["friendly"]
    },
    "currentStep": "style"
  }
}
```

**Response:** Server-Sent Events stream

### 9.7 AI Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/generate-page` | Generate full page |
| POST | `/api/v1/ai/generate-section` | Generate single section |
| POST | `/api/v1/ai/generate-content` | Generate text content |

**Generate Page Request:**
```json
{
  "siteId": 1,
  "pageType": "homepage",
  "customPrompt": "Focus on our fresh daily baked goods",
  "includeImages": true
}
```

**Generate Page Response:**
```json
{
  "success": true,
  "page": {
    "metadata": {
      "title": "Sunrise Cafe & Bakery",
      "description": "Fresh baked goods daily...",
      "slug": "home"
    },
    "sections": [...],
    "designTokens": {...}
  },
  "generatedImages": [
    {
      "id": 1,
      "url": "https://cdn.example.com/image.jpg",
      "type": "hero"
    }
  ]
}
```

### 9.8 Image Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/images/generate` | Generate AI image |
| GET | `/api/v1/images/{id}` | Get image details |
| DELETE | `/api/v1/images/{id}` | Delete image |

**Generate Image Request:**
```json
{
  "siteId": 1,
  "imageType": "hero",
  "customPrompt": "Warm bakery interior with fresh bread",
  "size": "1792x1024",
  "quality": "standard"
}
```

**Generate Image Response:**
```json
{
  "success": true,
  "image": {
    "id": 1,
    "url": "https://cdn.example.com/generated/abc123.jpg",
    "prompt": "Warm bakery interior...",
    "revisedPrompt": "A warm, inviting bakery...",
    "type": "hero",
    "width": 1792,
    "height": 1024
  }
}
```

### 9.9 Website Scraping

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/scrape` | Start scraping job |
| GET | `/api/v1/scrape/{jobId}` | Get job status |
| GET | `/api/v1/scrape/{jobId}/results` | Get scraping results |
| DELETE | `/api/v1/scrape/{jobId}` | Cancel/delete job |

**Start Scrape Request:**
```json
{
  "url": "https://example-bakery.com",
  "siteId": 1
}
```

**Scrape Status Response:**
```json
{
  "jobId": "job-123",
  "status": "processing",
  "progress": {
    "pagesFound": 15,
    "pagesScraped": 8,
    "currentPage": "https://example.com/about"
  },
  "startedAt": "2026-01-15T10:00:00Z"
}
```

**Scrape Results Response:**
```json
{
  "jobId": "job-123",
  "status": "completed",
  "results": {
    "platformDetected": "wordpress",
    "pagesAnalyzed": 15,
    "structure": {
      "recommendedPages": [...],
      "navigationStructure": {...}
    },
    "design": {
      "colorPalette": {...},
      "typography": {...},
      "designStyle": [...]
    },
    "contentPatterns": [...]
  },
  "completedAt": "2026-01-15T10:05:00Z"
}
```

---

## 10. Cost Estimation

### 10.1 OpenAI API Pricing (GPT-5 / GPT-4o)

| Operation | Input Tokens | Output Tokens | Estimated Cost |
|-----------|--------------|---------------|----------------|
| Chat message (avg) | ~500 | ~300 | $0.008 |
| Page generation | ~2,000 | ~4,000 | $0.06 |
| Section generation | ~800 | ~1,500 | $0.023 |
| Site analysis | ~5,000 | ~2,000 | $0.07 |
| Content refinement | ~1,000 | ~1,000 | $0.02 |

### 10.2 DALL-E 3 Pricing

| Quality | Size | Cost per Image |
|---------|------|----------------|
| Standard | 1024x1024 | $0.040 |
| Standard | 1792x1024 | $0.080 |
| Standard | 1024x1792 | $0.080 |
| HD | 1024x1024 | $0.080 |
| HD | 1792x1024 | $0.120 |
| HD | 1024x1792 | $0.120 |

### 10.3 Typical User Journey Cost

| Step | Operations | Estimated Cost |
|------|------------|----------------|
| Onboarding chat | 10 messages | $0.08 |
| Reference site analysis | 1 job | $0.07 |
| Page generation | 5 pages | $0.30 |
| Image generation | 3 images (standard) | $0.15 |
| Content refinement | 5 refinements | $0.10 |
| **Total per user** | | **~$0.70** |

### 10.4 Cost Optimization Strategies

| Strategy | Expected Savings | Implementation |
|----------|-----------------|----------------|
| Semantic caching | 40-50% | Cache similar prompt responses |
| Prompt optimization | 20-30% | Shorter, focused prompts |
| Model routing | 50-70% | Use GPT-4o-mini for simple tasks |
| Batch processing | 15-25% | Combine related requests |
| Image quality tiering | 40-50% | Standard for drafts, HD for final |
| Response caching | 100% on repeats | Cache scraped site analysis |

### 10.5 Monthly Cost Projections

| Users/Month | Avg Cost/User | Monthly AI Cost |
|-------------|---------------|-----------------|
| 100 | $0.70 | $70 |
| 1,000 | $0.60 (with caching) | $600 |
| 10,000 | $0.50 (optimized) | $5,000 |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Brand Vault** | Collection of brand assets, colors, styles, and preferences |
| **Block** | Reusable page section component in GrapeJS |
| **SSE** | Server-Sent Events for real-time streaming |
| **Sitemap** | XML file listing all pages on a website |
| **Design Tokens** | Reusable design values (colors, fonts, spacing) |
| **CDN** | Content Delivery Network for fast asset delivery |

---

## Appendix B: Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `AI_001` | AI service unavailable | Retry with exponential backoff |
| `AI_002` | Rate limit exceeded | Wait and retry |
| `AI_003` | Content policy violation | Modify prompt and retry |
| `SCRAPE_001` | URL not accessible | Verify URL is public |
| `SCRAPE_002` | Blocked by robots.txt | Cannot scrape this site |
| `SCRAPE_003` | Timeout | Site too slow, try again |
| `IMG_001` | Image generation failed | Modify prompt and retry |
| `IMG_002` | Invalid image size | Use supported dimensions |

---

*End of Implementation Specification Document*
