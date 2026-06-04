"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Eye,
  Save,
  Wand2,
  Bot,
  PanelsTopLeft,
  ClipboardList,
  CreditCard,
  UserPlus,
  Ticket,
  QrCode,
  CalendarClock,
  FileText,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Link2,
  Globe,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type EditorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LandingDraft = {
  id?: string;
  businessName?: string;
  tagline?: string;
  description?: string;
  html?: string;
  css?: string;
  updatedAt?: string;
};

type SavedLandingPageDraft = {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  html: string;
  css: string;
  updatedAt: string;
  status: "draft" | "published";
};

const LANDING_PAGE_DRAFT_KEY = "universell-landing-page-draft";
const SAVED_LANDING_PAGES_KEY = "universell-saved-landing-pages";

type FormType = {
  label: string;
  value: string;
  icon: React.ElementType;
  instant?: boolean;
};

const FORM_TYPES: FormType[] = [
  { label: "Custom Form", value: "Add a custom form", icon: FileText },
  { label: "Payment Form", value: "Add a payment form", icon: CreditCard },
  { label: "Lead Form", value: "Add a lead form", icon: UserPlus },
  { label: "Ticket Form", value: "Add a ticket form", icon: Ticket },
  { label: "Product QR Code", value: "Add a product QR code", icon: QrCode },
  { label: "Schedule Me", value: "Add a schedule me booking form", icon: CalendarClock, instant: true },
  { label: "Booking Form", value: "Add a booking form", icon: BookOpen },
  { label: "Fastshop Link", value: "Add a Fastshop link", icon: Link2 },
];

// Merchant inventory items shown under Product QR Code
const MERCHANT_INVENTORY: { id: string; name: string }[] = [
  { id: "inv-1", name: "Espresso" },
  { id: "inv-2", name: "Cappuccino" },
  { id: "inv-3", name: "Croissant" },
  { id: "inv-4", name: "Sourdough Loaf" },
  { id: "inv-5", name: "Blueberry Muffin" },
  { id: "inv-6", name: "Latte" },
];

const EXISTING_FORMS: Record<string, { id: string; name: string }[]> = {
  "Custom Form": [
    { id: "cf-1", name: "Contact Us Form" },
    { id: "cf-2", name: "Feedback Form" },
    { id: "cf-3", name: "Survey Form" },
  ],
  "Payment Form": [
    { id: "pf-1", name: "Checkout Form" },
    { id: "pf-2", name: "Subscription Form" },
  ],
  "Lead Form": [
    { id: "lf-1", name: "Newsletter Signup" },
    { id: "lf-2", name: "Free Trial Request" },
    { id: "lf-3", name: "Demo Request" },
    { id: "lf-4", name: "Furniture Interest" },
  ],
  "Ticket Form": [
    { id: "tf-1", name: "Support Ticket" },
    { id: "tf-2", name: "Event Registration" },
  ],
  "Product QR Code": MERCHANT_INVENTORY,
  "Booking Form": [
    { id: "bf-1", name: "Table Reservation" },
    { id: "bf-2", name: "Appointment Booking" },
  ],
  "Fastshop Link": [
    { id: "fl-1", name: "Main Store" },
    { id: "fl-2", name: "Featured Collection" },
  ],
};

type LeadFormModalStep = "form-selection" | "field-selection" | "form-builder" | "placement";
type LeadPlacementType = "embed" | "cta";

const LEAD_FORM_FIELD_OPTIONS: { id: string; label: string }[] = [
  { id: "full_name", label: "Full Name" },
  { id: "email", label: "Email Address" },
  { id: "phone", label: "Phone Number" },
  { id: "company", label: "Company" },
  { id: "job_title", label: "Job Title" },
  { id: "location", label: "Location" },
];

type LeadFormFieldSchema = {
  id: string;
  label: string;
  type: "text" | "email" | "phone";
};

type LeadFormSchema = {
  id: string;
  name: string;
  fields: LeadFormFieldSchema[];
  submitButtonLabel: string;
};

const LEAD_FIELD_LABEL_MAP: Record<string, string> = {
  full_name: "Full Name",
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  job_title: "Job Title",
  location: "Location",
};

const LEAD_FIELD_INPUT_TYPE_MAP: Record<string, LeadFormFieldSchema["type"]> = {
  full_name: "text",
  first_name: "text",
  last_name: "text",
  email: "email",
  phone: "phone",
  company: "text",
  job_title: "text",
  location: "text",
};

const toLeadFieldSchema = (fieldId: string): LeadFormFieldSchema => ({
  id: fieldId,
  label:
    LEAD_FIELD_LABEL_MAP[fieldId] ||
    fieldId.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
  type: LEAD_FIELD_INPUT_TYPE_MAP[fieldId] || "text",
});

const createLeadFormSchema = (
  id: string,
  name: string,
  fieldIds: string[],
  submitButtonLabel: string
): LeadFormSchema => ({
  id,
  name,
  fields: fieldIds.map(toLeadFieldSchema),
  submitButtonLabel,
});

const LEAD_FORM_SCHEMAS: Record<string, LeadFormSchema> = {
  "lf-1": createLeadFormSchema("lf-1", "Newsletter Signup", ["full_name", "email"], "Subscribe"),
  "lf-2": createLeadFormSchema("lf-2", "Free Trial Request", ["full_name", "email", "phone", "company"], "Start Free Trial"),
  "lf-3": createLeadFormSchema("lf-3", "Demo Request", ["full_name", "email", "phone", "company", "job_title"], "Book Demo"),
  "lf-4": createLeadFormSchema("lf-4", "Furniture Interest", ["first_name", "last_name", "email", "phone"], "Submit Request"),
};

const LEAD_FORM_BUILDER_INIT_KEY = "universell-lead-form-builder-init";
const LEAD_FORM_INSERTION_CONFIG_KEY = "universell-lead-form-insertion-config";

type AttachedLeadFormConfig = {
  landingPageId?: string;
  selectedLeadFormId: string;
  name: string;
  description?: string;
  fieldIds: string[];
  fieldLabels: string[];
  placementType: LeadPlacementType;
  targetSectionId: string;
  targetSectionLabel: string;
  ctaButtonText: string;
  updatedAt: string;
};

type LandingSectionOption = {
  id: string;
  label: string;
};

const DEFAULT_LANDING_SECTIONS: LandingSectionOption[] = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "benefits", label: "Benefits" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Testimonials" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const slugifySection = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const discoverLandingSections = (markup: string): LandingSectionOption[] => {
  if (typeof window === "undefined") {
    return DEFAULT_LANDING_SECTIONS;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "text/html");
    const sectionNodes = Array.from(doc.querySelectorAll("section"));
    const sectionMap = new Map<string, LandingSectionOption>(
      DEFAULT_LANDING_SECTIONS.map((section) => [section.id, section])
    );

    sectionNodes.forEach((node, index) => {
      const explicitId = node.getAttribute("id")?.trim();
      const className = node.getAttribute("class")?.trim();
      const heading =
        node.querySelector("h1, h2, h3")?.textContent?.trim() ||
        explicitId ||
        className?.split(" ")[0] ||
        `Section ${index + 1}`;

      if (!heading) return;
      const label = heading
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const id = explicitId || slugifySection(label) || `section-${index + 1}`;
      sectionMap.set(id, { id, label });
    });

    return Array.from(sectionMap.values());
  } catch {
    return DEFAULT_LANDING_SECTIONS;
  }
};

const resolveLeadFormSchema = (
  selectedLeadFormId: string,
  selectedLeadFields: string[]
): LeadFormSchema => {
  const mapped = LEAD_FORM_SCHEMAS[selectedLeadFormId];
  if (mapped) return mapped;

  return createLeadFormSchema(
    selectedLeadFormId || "lf-new",
    "New Lead Form",
    selectedLeadFields.length ? selectedLeadFields : ["full_name", "email"],
    "Submit Request"
  );
};

function LeadFormPlacementStep({
  placementType,
  targetSectionId,
  ctaButtonText,
  sectionOptions,
  validation,
  onPlacementTypeChange,
  onTargetSectionChange,
  onCtaButtonTextChange,
}: {
  placementType: LeadPlacementType | null;
  targetSectionId: string;
  ctaButtonText: string;
  sectionOptions: LandingSectionOption[];
  validation: {
    placementType?: string;
    targetSectionId?: string;
    ctaButtonText?: string;
  };
  onPlacementTypeChange: (value: LeadPlacementType) => void;
  onTargetSectionChange: (value: string) => void;
  onCtaButtonTextChange: (value: string) => void;
}) {
  return (
    <div className="h-full min-h-0 flex flex-col animate-fade-in-up space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-foreground">How do you want to use this lead form?</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: "embed" as const, label: "Embed the form directly on the page" },
            { id: "cta" as const, label: "Link the form to a CTA button" },
          ].map((option) => {
            const isActive = placementType === option.id;
            return (
              <div
                key={option.id}
                className={cn(
                  "rounded-xl border px-3 py-2.5 transition-colors",
                  isActive
                    ? "border-orange-400 bg-orange-50/70"
                    : "border-border/60 bg-background hover:border-orange-300"
                )}
              >
                <button
                  type="button"
                  onClick={() => onPlacementTypeChange(option.id)}
                  className="w-full flex items-center gap-2 text-left text-sm"
                >
                  <span className={cn("h-4 w-4 rounded-full border flex items-center justify-center shrink-0", isActive ? "border-orange-500" : "border-muted-foreground/40")}>
                    {isActive && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                  </span>
                  <span className={cn(isActive ? "text-foreground font-medium" : "text-muted-foreground")}>{option.label}</span>
                </button>
                {option.id === "cta" && isActive && (
                  <div className="mt-3 border-t border-border/40 pt-3 space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">CTA Button Text</Label>
                    <Input
                      value={ctaButtonText}
                      onChange={(e) => onCtaButtonTextChange(e.target.value)}
                      placeholder="Get Started"
                    />
                    {validation.ctaButtonText && <p className="text-xs text-destructive">{validation.ctaButtonText}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {validation.placementType && <p className="text-xs text-destructive">{validation.placementType}</p>}
      </div>

      <div className="space-y-2">
        <div className="space-y-0.5">
          <Label className="text-xs font-medium text-foreground">Landing Page Section</Label>
          <p className="text-xs text-muted-foreground">Choose where the lead form should appear on the page.</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
          <div className="grid grid-cols-2 gap-2">
            {sectionOptions.map((section) => {
              const isActive = targetSectionId === section.id;
              const isFullWidth = section.id === sectionOptions[0]?.id || section.id === sectionOptions[sectionOptions.length - 1]?.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onTargetSectionChange(section.id)}
                  className={cn(
                    "relative rounded-xl border bg-background p-2.5 text-left transition-all duration-200",
                    "hover:border-orange-400/50 hover:bg-orange-50/40",
                    isActive ? "border-orange-400 bg-orange-50/70 shadow-sm" : "border-border/60",
                    isFullWidth ? "col-span-2" : ""
                  )}
                >
                  {isActive && (
                    <span className="absolute right-2 top-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                    </span>
                  )}
                  <div className="mb-1.5 inline-grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <span
                        key={`${section.id}-${idx}`}
                        className={cn(
                          "h-2 w-2 rounded-[2px] border",
                          isActive ? "border-orange-400/50 bg-orange-200/60" : "border-muted-foreground/30 bg-muted/30"
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn("text-xs font-medium", isActive ? "text-orange-700" : "text-muted-foreground")}>
                    {section.label}
                  </p>
                </button>
              );
            })}
          </div>
          {validation.targetSectionId && <p className="text-xs text-destructive mt-2">{validation.targetSectionId}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Connect Domain feature ───────────────────────────────────────────────────

type DomainFlowStep =
  | "start"
  | "enter-domain"
  | "choose-provider"
  | "show-instructions"
  | "needs-domain-registrar"
  | "buying-guide"
  | "done";

type DomainChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SERVER_IP = "76.76.21.21";
const CNAME_TARGET = "cname.vercel-dns.com";

// Maps domain provider / registrar names to their management URLs
const PROVIDER_URLS: Record<string, string> = {
  GoDaddy: "https://godaddy.com",
  Namecheap: "https://namecheap.com",
  "Google Domains": "https://domains.google",
  Cloudflare: "https://cloudflare.com",
};

const PROVIDER_INSTRUCTIONS: Record<string, { steps: string[]; notes?: string[] }> = {
  GoDaddy: {
    steps: [
      "Log in to GoDaddy → My Products → Domains",
      "Click your domain → Manage DNS",
      `Add A Record: Host = @, Points to = ${SERVER_IP}, TTL = 600`,
      `Add CNAME Record: Host = www, Points to = ${CNAME_TARGET}, TTL = 1 hour`,
      "Click Save",
    ],
  },
  Namecheap: {
    steps: [
      "Log in to Namecheap → Domain List → Manage",
      "Open the Advanced DNS tab",
      `Add A Record: Host = @, Value = ${SERVER_IP}, TTL = Automatic`,
      `Add CNAME Record: Host = www, Value = ${CNAME_TARGET}, TTL = Automatic`,
      "Save all records",
    ],
  },
  "Google Domains": {
    steps: [
      "Go to domains.google.com → My Domains → Manage",
      "Open DNS → Custom records",
      `Add A Record: Name = @, IPv4 address = ${SERVER_IP}`,
      `Add CNAME Record: Name = www, Domain name = ${CNAME_TARGET}`,
      "Save changes",
    ],
  },
  Cloudflare: {
    steps: [
      "Log in to Cloudflare → select your domain",
      "Go to DNS → Records",
      `Add A Record: Name = @, IPv4 = ${SERVER_IP} — set proxy to DNS only (grey cloud)`,
      `Add CNAME Record: Name = www, Target = ${CNAME_TARGET} — DNS only`,
      "Save records",
    ],
    notes: [
      "⚠️ The Cloudflare proxy (orange cloud) must be OFF. Use DNS-only mode.",
    ],
  },
  Other: {
    steps: [
      "Log in to your domain registrar's control panel",
      "Find DNS Management or DNS Zone Editor",
      `Add A Record: Host = @ (or blank), Value = ${SERVER_IP}`,
      `Add CNAME Record: Host = www, Value = ${CNAME_TARGET}`,
      "Save and allow up to 48 hours for propagation",
    ],
  },
};

const BUYING_STEPS: Record<string, string[]> = {
  GoDaddy: [
    "Go to godaddy.com and search your business name",
    "Choose .com, .net, or .store for best results",
    "Add to cart and complete checkout",
    "Come back here once you have it!",
  ],
  Namecheap: [
    "Go to namecheap.com and search your domain",
    ".com domains are typically $8–$12/year",
    "Create an account and complete checkout",
    "Come back here once you have it!",
  ],
  "Google Domains": [
    "Go to domains.google.com",
    "Search for your desired domain name",
    "Select and purchase — clean UI, transparent pricing",
    "Come back here once you have it!",
  ],
  "Not sure": [
    "We recommend Namecheap for affordable pricing",
    "Go to namecheap.com and search your business name",
    "Pick a .com, .store, or .shop domain",
    "Come back here once you have it!",
  ],
};

const initialDomainMessages: DomainChatMessage[] = [
  {
    id: "d0",
    role: "assistant",
    content: "Hi! I'll guide you through connecting your domain step-by-step. Do you already own a domain?",
  },
];

// ─── End Connect Domain constants ─────────────────────────────────────────────

const FALLBACK_DRAFT: LandingDraft = {
  businessName: "Sunrise Cafe & Bakery",
  tagline: "Where every morning starts with warmth",
  description:
    "Fresh baked goods and artisan coffee in the heart of downtown. Crafted daily with local ingredients.",
};

const initialMessages: EditorMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Your landing page is ready. Ask me to refine sections, tone, CTA text, or content hierarchy.",
  },
];

function buildLandingHtml(draft: LandingDraft) {
  return `
  <main>
    <section class="hero">
      <div class="badge">AI Generated Landing Page</div>
      <h1>${draft.businessName || FALLBACK_DRAFT.businessName}</h1>
      <p class="tagline">${draft.tagline || FALLBACK_DRAFT.tagline}</p>
      <p class="description">${draft.description || FALLBACK_DRAFT.description}</p>
      <div class="hero-actions">
        <button class="primary-btn">Get Started</button>
        <button class="secondary-btn">View Menu</button>
      </div>
    </section>

    <section class="features">
      <article class="feature-card">
        <h3>Fresh Daily</h3>
        <p>Baked every morning with premium, locally sourced ingredients.</p>
      </article>
      <article class="feature-card">
        <h3>Quick Ordering</h3>
        <p>Simple mobile-friendly ordering experience with instant confirmation.</p>
      </article>
      <article class="feature-card">
        <h3>Loved by Customers</h3>
        <p>Trusted by our neighborhood for quality, consistency, and taste.</p>
      </article>
    </section>

    <section class="cta">
      <h2>Ready to place your first order?</h2>
      <p>Get artisan quality delivered to your doorstep today.</p>
      <button class="primary-btn">Order Now</button>
    </section>
  </main>
  `;
}

const baseCss = `
  :root {
    --primary: #f04f29;
    --text: #1f2937;
    --muted: #6b7280;
    --bg: #ffffff;
    --surface: #fff7f5;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    background: linear-gradient(180deg, #fff 0%, #fff7f5 100%);
    color: var(--text);
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 24px 64px;
  }

  .hero {
    text-align: center;
    padding: 56px 24px;
    border-radius: 24px;
    background: radial-gradient(circle at top, #ffe3dc 0%, #fff6f3 58%, #ffffff 100%);
    border: 1px solid #fcd5cc;
  }

  .badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary);
    background: rgba(240, 79, 41, 0.1);
    border: 1px solid rgba(240, 79, 41, 0.2);
    border-radius: 999px;
    padding: 6px 12px;
    margin-bottom: 14px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.15;
  }

  .tagline {
    margin: 14px 0 6px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
  }

  .description {
    margin: 0 auto;
    max-width: 720px;
    color: var(--muted);
    line-height: 1.65;
  }

  .hero-actions {
    margin-top: 26px;
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  button {
    font: inherit;
    cursor: pointer;
    border: none;
  }

  .primary-btn {
    background: var(--primary);
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
  }

  .secondary-btn {
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
  }

  .features {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .feature-card {
    background: white;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 18px;
  }

  .feature-card h3 {
    margin: 0 0 8px;
    font-size: 1rem;
  }

  .feature-card p {
    margin: 0;
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .cta {
    margin-top: 24px;
    text-align: center;
    background: #1f2937;
    color: white;
    border-radius: 20px;
    padding: 38px 22px;
  }

  .cta h2 {
    margin: 0;
    font-size: 1.75rem;
  }

  .cta p {
    margin: 10px auto 18px;
    max-width: 620px;
    color: rgba(255, 255, 255, 0.84);
  }

  .cta .primary-btn {
    background: white;
    color: #111827;
  }

  @media (max-width: 900px) {
    .features {
      grid-template-columns: 1fr;
    }
  }
`;

export default function GeneratedLandingPageEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const currentLandingPageId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [messages, setMessages] = useState<EditorMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<LandingDraft>(FALLBACK_DRAFT);
  const [html, setHtml] = useState<string>(buildLandingHtml(FALLBACK_DRAFT));
  const [css, setCss] = useState<string>(baseCss);
  const [isGrapesReady, setIsGrapesReady] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const [selectedExistingForm, setSelectedExistingForm] = useState<string>("");
  const [leadFormModalStep, setLeadFormModalStep] = useState<LeadFormModalStep>("form-selection");
  const [selectedLeadFields, setSelectedLeadFields] = useState<string[]>([]);
  const [leadFormName, setLeadFormName] = useState<string>("");
  const [leadFormDescription, setLeadFormDescription] = useState<string>("");
  const [leadFieldValidationError, setLeadFieldValidationError] = useState<string>("");
  const [showLeadFieldDropdown, setShowLeadFieldDropdown] = useState(false);
  const [selectedLeadFormId, setSelectedLeadFormId] = useState<string>("");
  const [placementType, setPlacementType] = useState<LeadPlacementType | null>(null);
  const [targetSectionId, setTargetSectionId] = useState<string>("");
  const [ctaButtonText, setCtaButtonText] = useState<string>("");
  const [placementBackStep, setPlacementBackStep] = useState<"form-selection" | "form-builder">("form-selection");
  const [placementValidation, setPlacementValidation] = useState<{
    placementType?: string;
    targetSectionId?: string;
    ctaButtonText?: string;
  }>({});
  const [attachedLeadForm, setAttachedLeadForm] = useState<AttachedLeadFormConfig | null>(null);

  // Connect Domain modal state
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domainFlowStep, setDomainFlowStep] = useState<DomainFlowStep>("start");
  const [domainMessages, setDomainMessages] = useState<DomainChatMessage[]>(initialDomainMessages);
  const [domainNameInput, setDomainNameInput] = useState("");
  const [domainName, setDomainName] = useState("");
  const [domainProvider, setDomainProvider] = useState<string | null>(null);
  const [domainBuyingRegistrar, setDomainBuyingRegistrar] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const grapesContainerRef = useRef<HTMLDivElement>(null);
  const grapesBlocksRef = useRef<HTMLDivElement>(null);
  const grapesLayersRef = useRef<HTMLDivElement>(null);
  const grapesStylesRef = useRef<HTMLDivElement>(null);
  const grapesTraitsRef = useRef<HTMLDivElement>(null);
  const grapesEditorRef = useRef<any>(null);
  const leadFieldDropdownRef = useRef<HTMLDivElement>(null);

  const landingSectionOptions = useMemo(() => discoverLandingSections(html), [html]);
  useEffect(() => {
    if (currentLandingPageId && currentLandingPageId !== "new") {
      const rawSavedDrafts = localStorage.getItem(SAVED_LANDING_PAGES_KEY);
      if (!rawSavedDrafts) return;

      try {
        const savedDrafts = JSON.parse(rawSavedDrafts) as SavedLandingPageDraft[];
        const existingDraft = savedDrafts.find((item) => item.id === currentLandingPageId);
        if (!existingDraft) return;

        const merged = {
          ...FALLBACK_DRAFT,
          ...existingDraft,
        };
        setDraft(merged);
        setHtml(existingDraft.html || buildLandingHtml(merged));
        setCss(existingDraft.css || baseCss);
        return;
      } catch {
        // no-op fallback
      }
    }

    const rawDraft = localStorage.getItem(LANDING_PAGE_DRAFT_KEY);
    if (!rawDraft) return;

    try {
      const parsed = JSON.parse(rawDraft) as LandingDraft;
      const merged = {
        ...FALLBACK_DRAFT,
        ...parsed,
      };
      setDraft(merged);
      setHtml(parsed.html || buildLandingHtml(merged));
      setCss(parsed.css || baseCss);
    } catch {
      // no-op fallback
    }
  }, [currentLandingPageId]);

  useEffect(() => {
    const rawLeadFormConfig = localStorage.getItem(LEAD_FORM_INSERTION_CONFIG_KEY);
    if (!rawLeadFormConfig) {
      setAttachedLeadForm(null);
      return;
    }

    try {
      const parsed = JSON.parse(rawLeadFormConfig) as Partial<AttachedLeadFormConfig>;
      if (
        parsed?.landingPageId &&
        currentLandingPageId &&
        parsed.landingPageId !== currentLandingPageId
      ) {
        setAttachedLeadForm(null);
        return;
      }

      const fallbackSchema = resolveLeadFormSchema(parsed.selectedLeadFormId || "", parsed.fieldIds || []);
      const normalizedFields = (parsed.fieldIds?.length ? parsed.fieldIds : fallbackSchema.fields.map((field) => field.id)) || [];
      const normalized: AttachedLeadFormConfig = {
        landingPageId: parsed.landingPageId,
        selectedLeadFormId: parsed.selectedLeadFormId || "",
        name: parsed.name || fallbackSchema.name,
        description: parsed.description || "",
        fieldIds: normalizedFields,
        fieldLabels:
          parsed.fieldLabels?.length
            ? parsed.fieldLabels
            : normalizedFields.map((fieldId) => toLeadFieldSchema(fieldId).label),
        placementType: parsed.placementType === "cta" ? "cta" : "embed",
        targetSectionId: parsed.targetSectionId || "hero",
        targetSectionLabel: parsed.targetSectionLabel || "Hero",
        ctaButtonText: parsed.ctaButtonText || "",
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };

      setAttachedLeadForm(normalized);
    } catch {
      setAttachedLeadForm(null);
    }
  }, [currentLandingPageId]);

  useEffect(() => {
    let isMounted = true;
    let editorInstance: any;

    const init = async () => {
      if (
        !grapesContainerRef.current ||
        !grapesBlocksRef.current ||
        !grapesLayersRef.current ||
        !grapesStylesRef.current ||
        !grapesTraitsRef.current
      ) {
        return;
      }

      const grapesModule = await import("grapesjs");
      if (
        !isMounted ||
        !grapesContainerRef.current ||
        !grapesBlocksRef.current ||
        !grapesLayersRef.current ||
        !grapesStylesRef.current ||
        !grapesTraitsRef.current
      ) {
        return;
      }

      const grapesjs = (grapesModule as any).default || grapesModule;

      editorInstance = grapesjs.init({
        container: grapesContainerRef.current,
        height: "100%",
        width: "auto",
        storageManager: false,
        fromElement: false,
        components: html,
        style: css,
        panels: { defaults: [] },
        blockManager: {
          appendTo: grapesBlocksRef.current,
        },
        layerManager: {
          appendTo: grapesLayersRef.current,
        },
        styleManager: {
          appendTo: grapesStylesRef.current,
        },
        traitManager: {
          appendTo: grapesTraitsRef.current,
        },
      });

      editorInstance.on("update", () => {
        setHtml(editorInstance.getHtml());
        setCss(editorInstance.getCss());
      });

      grapesEditorRef.current = editorInstance;
      setIsGrapesReady(true);
    };

    init();

    return () => {
      isMounted = false;
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leadFieldDropdownRef.current && !leadFieldDropdownRef.current.contains(event.target as Node)) {
        setShowLeadFieldDropdown(false);
      }
    };

    if (showLeadFieldDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showLeadFieldDropdown]);

  const srcDoc = useMemo(
    () => `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `,
    [css, html]
  );

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userText },
    ]);
    setInputMessage("");
    setIsGenerating(true);

    setTimeout(() => {
      if (grapesEditorRef.current) {
        if (/testimonial|review/i.test(userText)) {
          grapesEditorRef.current.addComponents(`
            <section class="feature-card" style="margin-top:16px;">
              <h3>What our customers say</h3>
              <p>“Absolutely fresh, delicious, and always on time.”</p>
            </section>
          `);
        }

        if (/cta|button|call to action/i.test(userText)) {
          const current = grapesEditorRef.current.getCss();
          grapesEditorRef.current.setStyle(`${current}\n.primary-btn{padding:14px 24px;font-size:1rem;}`);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Done. I applied your requested changes. You can review the result in the center preview or fine-tune using the GrapesJS editor on the right.",
        },
      ]);
      setIsGenerating(false);
    }, 1200);
  };

  // ─── Domain flow helpers ─────────────────────────────────────────────────────

  const addDomainMessage = (role: "user" | "assistant", content: string) => {
    setDomainMessages((prev) => [
      ...prev,
      { id: `dm-${Date.now()}-${Math.random()}`, role, content },
    ]);
  };

  const handleDomainModalClose = (open: boolean) => {
    setShowDomainModal(open);
    if (!open) {
      setDomainFlowStep("start");
      setDomainMessages(initialDomainMessages);
      setDomainNameInput("");
      setDomainName("");
      setDomainProvider(null);
      setDomainBuyingRegistrar(null);
      setCopiedValue(null);
    }
  };

  const handleOwnsYes = () => {
    addDomainMessage("user", "Yes, I have a domain");
    addDomainMessage("assistant", "Great! Please type your domain name below (e.g. mybusiness.com).");
    setDomainFlowStep("enter-domain");
  };

  const handleOwnsNo = () => {
    addDomainMessage("user", "No, I need one");
    addDomainMessage("assistant", "No problem! I can guide you to get a domain. Where would you like to buy one?");
    setDomainFlowStep("needs-domain-registrar");
  };

  const handleDomainNameSubmit = () => {
    const name = domainNameInput.trim();
    if (!name) return;
    // Validates domain format: alphanumeric labels (optionally with hyphens) separated by dots, ending with 2+ letter TLD
    const DOMAIN_PATTERN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!DOMAIN_PATTERN.test(name)) {
      addDomainMessage(
        "assistant",
        `"${name}" doesn't look like a valid domain. Please enter it in the format: mybusiness.com`
      );
      return;
    }
    setDomainName(name);
    setDomainNameInput("");
    addDomainMessage("user", name);
    addDomainMessage("assistant", `Got it — ${name}. Who is your domain provider?`);
    setDomainFlowStep("choose-provider");
  };

  const handleProviderSelect = (provider: string) => {
    setDomainProvider(provider);
    addDomainMessage("user", provider);
    addDomainMessage(
      "assistant",
      `Here are the DNS steps for ${provider}. Follow them carefully and click "Mark as Done" when finished.`
    );
    setDomainFlowStep("show-instructions");
  };

  const handleRegistrarSelect = (registrar: string) => {
    setDomainBuyingRegistrar(registrar);
    addDomainMessage("user", registrar);
    addDomainMessage(
      "assistant",
      `Here are the steps to get your domain from ${registrar === "Not sure" ? "Namecheap (our recommendation)" : registrar}. Once purchased, click "I've purchased a domain" to continue.`
    );
    setDomainFlowStep("buying-guide");
  };

  const handlePurchasedDomain = () => {
    addDomainMessage("user", "I've purchased a domain");
    addDomainMessage("assistant", "Excellent! Please type your new domain name so I can guide you through connecting it.");
    setDomainFlowStep("enter-domain");
  };

  const handleMarkAsDone = () => {
    addDomainMessage("user", "Mark as Done");
    addDomainMessage(
      "assistant",
      `🎉 Your domain is connected! DNS changes can take up to 48 hours to propagate. You'll know it's live when your landing page loads at ${domainName || "your domain"}.`
    );
    setDomainFlowStep("done");
  };

  const handleNeedHelp = () => {
    addDomainMessage("user", "I need help");
    addDomainMessage(
      "assistant",
      "No worries! Double-check that you added both the A record and the CNAME record exactly as shown. DNS propagation can take up to 48 hours. You can also select 'Other' to see generic steps, or reach out to your provider's support."
    );
  };

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value).catch(() => {
      addDomainMessage("assistant", `Could not copy automatically. Please copy manually: ${value}`);
    });
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleDomainInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDomainNameSubmit();
  };

  const domainProgressStep =
    domainFlowStep === "start"
      ? 1
      : domainFlowStep === "show-instructions" || domainFlowStep === "done"
      ? 3
      : 2;

  // ─── End domain flow helpers ──────────────────────────────────────────────────

  const persistLandingPage = (status: "draft" | "published") => {
    const draftId = currentLandingPageId && currentLandingPageId !== "new" ? currentLandingPageId : `lp-${Date.now()}`;
    const savedAt = new Date().toISOString();
    const payload: SavedLandingPageDraft = {
      id: draftId,
      businessName: (draft.businessName || FALLBACK_DRAFT.businessName) as string,
      tagline: (draft.tagline || FALLBACK_DRAFT.tagline) as string,
      description: (draft.description || FALLBACK_DRAFT.description) as string,
      html,
      css,
      updatedAt: savedAt,
      status,
    };

    const rawSavedDrafts = localStorage.getItem(SAVED_LANDING_PAGES_KEY);
    const savedDrafts = rawSavedDrafts ? (JSON.parse(rawSavedDrafts) as SavedLandingPageDraft[]) : [];
    const nextDrafts = [payload, ...savedDrafts.filter((item) => item.id !== draftId)];

    localStorage.setItem(SAVED_LANDING_PAGES_KEY, JSON.stringify(nextDrafts));
    localStorage.setItem(
      LANDING_PAGE_DRAFT_KEY,
      JSON.stringify({
        ...draft,
        id: draftId,
        html,
        css,
        status,
        updatedAt: savedAt,
      })
    );

    router.push("/landing-page");
  };

  const handleSaveDraft = () => {
    persistLandingPage("draft");
  };

  const handlePublish = () => {
    persistLandingPage("published");
  };

  const toggleLeadField = (fieldId: string) => {
    setLeadFieldValidationError("");
    setSelectedLeadFields((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
    );
  };

  const resetLeadFormFlowState = () => {
    setLeadFormModalStep("form-selection");
    setSelectedLeadFields([]);
    setLeadFormName("");
    setLeadFormDescription("");
    setLeadFieldValidationError("");
    setSelectedLeadFormId("");
    setPlacementType(null);
    setTargetSectionId("");
    setCtaButtonText("");
    setPlacementBackStep("form-selection");
    setPlacementValidation({});
    setShowLeadFieldDropdown(false);
  };

  const startLeadFormBuilder = (fields: string[]) => {
    localStorage.setItem(
      LEAD_FORM_BUILDER_INIT_KEY,
      JSON.stringify({
        selectedLeadFields: fields,
        createdAt: new Date().toISOString(),
      })
    );

    const activeLeadFormId = selectedLeadFormId || `lf-new-${Date.now()}`;
    const resolvedSchema = resolveLeadFormSchema(activeLeadFormId, fields);

    setSelectedLeadFormId(activeLeadFormId);
    if (!leadFormName.trim()) {
      setLeadFormName(resolvedSchema.name);
    }
    setPlacementBackStep("form-builder");
    setLeadFormModalStep("placement");
  };

  const handleLeadFieldSelectionContinue = () => {
    if (!selectedLeadFields.length) {
      setLeadFieldValidationError("Select at least one field to include in your lead form.");
      return;
    }

    setLeadFieldValidationError("");
    setLeadFormModalStep("form-builder");
  };

  const handlePlacementContinue = () => {
    const nextErrors: {
      placementType?: string;
      targetSectionId?: string;
      ctaButtonText?: string;
    } = {};

    if (!placementType) {
      nextErrors.placementType = "Please choose how to use this form.";
    }
    if (!targetSectionId) {
      nextErrors.targetSectionId = "Please select a landing page section.";
    }
    if (placementType === "cta" && !ctaButtonText.trim()) {
      nextErrors.ctaButtonText = "Please enter CTA button text.";
    }

    setPlacementValidation(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const activePlacementType = placementType as LeadPlacementType;

    const selectedSection =
      landingSectionOptions.find((section) => section.id === targetSectionId)?.label || targetSectionId;

    const resolvedSchema = resolveLeadFormSchema(selectedLeadFormId, selectedLeadFields);
    const fallbackFields = resolvedSchema.fields.map((field) => field.id);
    const activeFieldIds = selectedLeadFields.length ? selectedLeadFields : fallbackFields;
    const activeFieldLabels = activeFieldIds.map((fieldId) => toLeadFieldSchema(fieldId).label);
    const activeFormName =
      leadFormName.trim() ||
      (EXISTING_FORMS["Lead Form"] ?? []).find((form) => form.id === selectedLeadFormId)?.name ||
      resolvedSchema.name;

    const insertionPayload: AttachedLeadFormConfig = {
      landingPageId: currentLandingPageId,
      selectedLeadFormId,
      name: activeFormName,
      description: leadFormDescription.trim(),
      fieldIds: activeFieldIds,
      fieldLabels: activeFieldLabels,
      placementType: activePlacementType,
      targetSectionId,
      targetSectionLabel: selectedSection,
      ctaButtonText: activePlacementType === "cta" ? ctaButtonText.trim() : "",
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(LEAD_FORM_INSERTION_CONFIG_KEY, JSON.stringify(insertionPayload));
    setAttachedLeadForm(insertionPayload);

    const formDescriptor = `the lead form "${activeFormName}" with fields (${activeFieldLabels.join(", ")})`;

    const prompt =
      activePlacementType === "embed"
        ? `Insert ${formDescriptor} directly into the ${selectedSection} section with responsive spacing and current design system styling. Payload: ${JSON.stringify(insertionPayload)}.`
        : `Insert a CTA button in the ${selectedSection} section with text "${ctaButtonText.trim()}" that opens ${formDescriptor} using the existing lead form modal/drawer pattern. Payload: ${JSON.stringify(insertionPayload)}.`;

    setInputMessage(prompt);
    setShowFormModal(false);
    setSelectedFormType(null);
    setSelectedExistingForm("");
    resetLeadFormFlowState();
  };

  const openLeadFormCreationFlow = () => {
    setShowFormModal(true);
    setSelectedFormType("Lead Form");
    setSelectedExistingForm("");
    resetLeadFormFlowState();
    setLeadFormModalStep("field-selection");
  };

  const openLeadFormEditFlow = () => {
    if (!attachedLeadForm) {
      openLeadFormCreationFlow();
      return;
    }

    setShowFormModal(true);
    setSelectedFormType("Lead Form");
    setSelectedExistingForm(attachedLeadForm.selectedLeadFormId || "");
    setLeadFormModalStep("form-builder");
    setSelectedLeadFormId(attachedLeadForm.selectedLeadFormId || "");
    setSelectedLeadFields(attachedLeadForm.fieldIds || []);
    setLeadFormName(attachedLeadForm.name || "");
    setLeadFormDescription(attachedLeadForm.description || "");
    setPlacementType(attachedLeadForm.placementType || null);
    setTargetSectionId(attachedLeadForm.targetSectionId || "");
    setCtaButtonText(attachedLeadForm.ctaButtonText || "");
    setPlacementBackStep("form-builder");
    setLeadFieldValidationError("");
    setPlacementValidation({});
  };

  const handleRemoveLeadForm = () => {
    localStorage.removeItem(LEAD_FORM_INSERTION_CONFIG_KEY);
    setAttachedLeadForm(null);
    setShowFormModal(false);
    resetLeadFormFlowState();
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col -m-6">
      {/* Top header */}
      <div className="h-14 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/landing-pages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-sm md:text-base font-semibold text-foreground">
            AI Landing Page Editor · {draft.businessName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Save className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* 3-column editor */}
      <div className="flex-1 min-h-0 grid grid-cols-[340px_1fr_380px]">
        {/* Left: AI Chat editor */}
        <div className="bg-card border-r border-border flex flex-col min-h-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">AI Chat Editor</h2>
                <p className="text-xs text-muted-foreground">Refine copy, sections and structure</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-xl p-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-6"
                      : "bg-muted mr-6"
                  )}
                >
                  {message.content}
                </div>
              ))}

              {isGenerating && (
                <div className="bg-muted rounded-xl p-3 mr-6">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border space-y-2">
            {attachedLeadForm ? (
              <button
                type="button"
                onClick={openLeadFormEditFlow}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 hover:bg-muted/60 transition-colors"
                title="Edit Lead Form"
              >
                <ClipboardList className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">{attachedLeadForm.name}</span>
                <Pencil className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={openLeadFormCreationFlow}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-orange-400/70 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                title="Add Lead Form"
              >
                <ClipboardList className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">+ Add Lead Form</span>
              </button>
            )}

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder="Ask AI to modify this landing page..."
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["Improve hero copy", "Add testimonials", "Stronger CTA", "Minimal style"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setInputMessage(preset)}
                  className="text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground"
                >
                  {preset}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowFormModal(true);
                  setSelectedFormType(null);
                  setSelectedExistingForm("");
                  setAttachedLeadForm(null);
                  resetLeadFormFlowState();
                }}
                className="text-[11px] px-2 py-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1"
              >
                <ClipboardList className="w-3 h-3" />
                Add Form
              </button>
              <button
                onClick={() => setShowDomainModal(true)}
                className="text-[11px] px-2 py-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Connect Domain
              </button>
            </div>

            <Dialog
              open={showFormModal}
              onOpenChange={(open) => {
                setShowFormModal(open);
                if (!open) {
                  setSelectedFormType(null);
                  setSelectedExistingForm("");
                  resetLeadFormFlowState();
                }
              }}
            >
              <DialogContent
                className={cn(
                  "sm:max-w-sm",
                  selectedFormType === "Lead Form" && leadFormModalStep !== "form-selection"
                    ? "max-h-[85vh] flex flex-col overflow-hidden gap-0 p-0"
                    : ""
                )}
              >
                <DialogHeader className={cn(selectedFormType === "Lead Form" && leadFormModalStep !== "form-selection" ? "shrink-0 px-6 pt-5 pb-3" : "")}>
                  <DialogTitle>
                    {selectedFormType ? (
                      selectedFormType === "Lead Form" && leadFormModalStep !== "form-selection" ? (
                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              if (leadFormModalStep === "field-selection") {
                                setLeadFormModalStep("form-selection");
                                setLeadFieldValidationError("");
                                return;
                              }
                              if (leadFormModalStep === "form-builder") {
                                setLeadFormModalStep("field-selection");
                                return;
                              }
                              if (leadFormModalStep === "placement") {
                                setLeadFormModalStep(placementBackStep);
                                return;
                              }
                            }}
                            className="flex items-center gap-1.5 text-sm font-semibold hover:text-orange-600 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            {attachedLeadForm ? "Edit Lead Form" : "Add Lead Form"}
                          </button>

                          {attachedLeadForm && (
                            <div className="flex items-center gap-3 pt-2 border-t border-border">
                              {["form-builder", "placement"].includes(leadFormModalStep) && (
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center font-medium", leadFormModalStep === "form-builder" || ["placement"].includes(leadFormModalStep) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>1</div>
                                    <span className={leadFormModalStep === "form-builder" ? "font-medium text-foreground" : "text-muted-foreground"}>Basic Information</span>
                                  </div>
                                  <div className={cn("w-8 h-0.5", leadFormModalStep === "placement" ? "bg-primary" : "bg-border")} />
                                  <div className="flex items-center gap-2">
                                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center font-medium", leadFormModalStep === "placement" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>2</div>
                                    <span className={leadFormModalStep === "placement" ? "font-medium text-foreground" : "text-muted-foreground"}>Form Placement</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedFormType(null);
                            setSelectedExistingForm("");
                            resetLeadFormFlowState();
                          }}
                          className="flex items-center gap-1.5 text-sm font-semibold hover:text-orange-600 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          {selectedFormType}
                        </button>
                      )
                    ) : (
                      "Insert a Form"
                    )}
                  </DialogTitle>
                </DialogHeader>

                <div className={cn(selectedFormType === "Lead Form" && leadFormModalStep !== "form-selection" ? "flex-1 min-h-0 overflow-y-auto px-6 pb-4" : "")}>
                  {selectedFormType ? (
                    selectedFormType === "Lead Form" && leadFormModalStep === "field-selection" ? (
                      <div className="space-y-4 pt-1 animate-fade-in-up">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">What information would you like to collect?</h3>
                          <p className="text-xs text-muted-foreground">Select one or more fields for your new lead form.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {LEAD_FORM_FIELD_OPTIONS.map((field) => {
                            const isSelected = selectedLeadFields.includes(field.id);
                            return (
                              <button
                                key={field.id}
                                type="button"
                                onClick={() => toggleLeadField(field.id)}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-left transition-colors",
                                  isSelected
                                    ? "border-orange-400 bg-orange-50 text-orange-700"
                                    : "border-border bg-muted hover:bg-orange-50 hover:border-orange-300"
                                )}
                              >
                                <span className={cn("h-4 w-4 rounded border flex items-center justify-center", isSelected ? "border-orange-500 bg-orange-500" : "border-muted-foreground/40 bg-background")}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </span>
                                <span className="leading-tight">{field.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {leadFieldValidationError && (
                          <p className="text-xs text-destructive">{leadFieldValidationError}</p>
                        )}
                      </div>
                    ) : selectedFormType === "Lead Form" && leadFormModalStep === "placement" ? (
                      <LeadFormPlacementStep
                        placementType={placementType}
                        targetSectionId={targetSectionId}
                        ctaButtonText={ctaButtonText}
                        sectionOptions={landingSectionOptions}
                        validation={placementValidation}
                        onPlacementTypeChange={(value) => {
                          setPlacementType(value);
                          setPlacementValidation((prev) => ({ ...prev, placementType: undefined, ctaButtonText: undefined }));
                        }}
                        onTargetSectionChange={(value) => {
                          setTargetSectionId(value);
                          setPlacementValidation((prev) => ({ ...prev, targetSectionId: undefined }));
                        }}
                        onCtaButtonTextChange={(value) => {
                          setCtaButtonText(value);
                          setPlacementValidation((prev) => ({ ...prev, ctaButtonText: undefined }));
                        }}
                      />
                    ) : selectedFormType === "Lead Form" && leadFormModalStep === "form-builder" ? (
                      <div className="space-y-4 pt-1 animate-fade-in-up">
                        {!attachedLeadForm ? (
                          <>
                            <div className="space-y-1">
                              <h3 className="text-sm font-semibold text-foreground">Lead Form Name</h3>
                              <p className="text-xs text-muted-foreground">Give your lead form a descriptive name.</p>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border bg-background p-3">
                              <div className="space-y-1">
                                <Input
                                  value={leadFormName}
                                  onChange={(e) => setLeadFormName(e.target.value)}
                                  placeholder="e.g. Summer Trial Signup"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-sm font-semibold text-foreground">Description</h3>
                              <p className="text-xs text-muted-foreground">Optional context shown with your lead form.</p>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border bg-background p-3">
                              <div className="space-y-1">
                                <Textarea
                                  value={leadFormDescription}
                                  onChange={(e) => setLeadFormDescription(e.target.value)}
                                  placeholder="Optional context shown with your lead form."
                                  className="min-h-[72px] resize-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-sm font-semibold text-foreground">Catcher Fields</h3>
                              <p className="text-xs text-muted-foreground">Select which fields to collect from your leads.</p>
                            </div>

                            <div className="space-y-2">
                              <div className="relative" ref={leadFieldDropdownRef}>
                                <button
                                  type="button"
                                  onClick={() => setShowLeadFieldDropdown(!showLeadFieldDropdown)}
                                  className="w-full rounded-lg border border-border bg-background p-2.5 text-left text-sm text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-between"
                                >
                                  <span>{selectedLeadFields.length > 0 ? `${selectedLeadFields.length} field${selectedLeadFields.length === 1 ? "" : "s"} selected` : "Select catcher fields"}</span>
                                  <ChevronDown className={cn("w-4 h-4 transition-transform", showLeadFieldDropdown && "rotate-180")} />
                                </button>

                                {showLeadFieldDropdown && (
                                  <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-background shadow-lg">
                                    <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
                                      {LEAD_FORM_FIELD_OPTIONS.map((field) => {
                                        const isSelected = selectedLeadFields.includes(field.id);
                                        return (
                                          <button
                                            key={field.id}
                                            type="button"
                                            onClick={() => toggleLeadField(field.id)}
                                            className={cn(
                                              "w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-left transition-colors",
                                              isSelected
                                                ? "bg-orange-50 text-orange-700"
                                                : "text-foreground hover:bg-muted"
                                            )}
                                          >
                                            <span className={cn("h-4 w-4 rounded border flex items-center justify-center shrink-0", isSelected ? "border-orange-500 bg-orange-500" : "border-muted-foreground/40 bg-background")}>
                                              {isSelected && <Check className="w-3 h-3 text-white" />}
                                            </span>
                                            {field.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {selectedLeadFields.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-muted/50 p-2.5">
                                  {selectedLeadFields.map((fieldId) => {
                                    const fieldLabel = LEAD_FORM_FIELD_OPTIONS.find((field) => field.id === fieldId)?.label ?? fieldId;
                                    return (
                                      <span key={fieldId} className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[11px] font-medium">
                                        {fieldLabel}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              {selectedLeadFields.length === 0 && (
                                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                                  <p className="text-xs text-muted-foreground">Select catcher fields to preview your lead form.</p>
                                </div>
                              )}
                            </div>


                          </>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-foreground">Edit Lead Form</h3>
                                <p className="text-xs text-muted-foreground">Update your lead form configuration.</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={handleRemoveLeadForm}
                                  className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
                                >
                                  Remove Form
                                </button>
                                <div className="group relative">
                                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-popover border border-border rounded-lg shadow-md p-2 w-48 text-[11px] text-foreground z-50">
                                    Unlink this lead form from the landing page. Visitors will no longer see the form or be able to submit their information.
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border bg-background p-3">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-foreground">Form Name</p>
                                <Input
                                  value={leadFormName}
                                  onChange={(e) => setLeadFormName(e.target.value)}
                                  placeholder="Enter lead form name"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-foreground">Description (optional)</p>
                                <Textarea
                                  value={leadFormDescription}
                                  onChange={(e) => setLeadFormDescription(e.target.value)}
                                  placeholder="Describe what this form is for"
                                  className="min-h-[72px] resize-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Selected fields</p>
                                <button
                                  type="button"
                                  onClick={() => setShowLeadFieldDropdown((v) => !v)}
                                  className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                                >
                                  Edit
                                  {showLeadFieldDropdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>

                              {showLeadFieldDropdown && (
                                <div className="rounded-lg border border-border bg-background p-2 space-y-1 max-h-[200px] overflow-y-auto">
                                  {LEAD_FORM_FIELD_OPTIONS.map((field) => {
                                    const isSelected = selectedLeadFields.includes(field.id);
                                    return (
                                      <button
                                        key={field.id}
                                        type="button"
                                        onClick={() => toggleLeadField(field.id)}
                                        className={cn(
                                          "w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-left transition-colors",
                                          isSelected
                                            ? "bg-orange-50 text-orange-700"
                                            : "text-foreground hover:bg-muted"
                                        )}
                                      >
                                        <span className={cn("h-4 w-4 rounded border flex items-center justify-center shrink-0", isSelected ? "border-orange-500 bg-orange-500" : "border-muted-foreground/40 bg-background")}>
                                          {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </span>
                                        {field.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-muted/50 p-2.5 min-h-[36px]">
                                {selectedLeadFields.map((fieldId) => {
                                  const fieldLabel = LEAD_FORM_FIELD_OPTIONS.find((field) => field.id === fieldId)?.label ?? fieldId;
                                  return (
                                    <span key={fieldId} className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[11px] font-medium">
                                      {fieldLabel}
                                    </span>
                                  );
                                })}
                                {selectedLeadFields.length === 0 && (
                                  <span className="text-[11px] text-muted-foreground">No fields selected</span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 pt-1 animate-fade-in-up">
                        <p className="text-xs text-muted-foreground">
                          Select an existing form to embed, or add a new one.
                        </p>
                        <Select
                          value={selectedExistingForm}
                          onValueChange={(value) => {
                            setSelectedExistingForm(value);
                            if (selectedFormType === "Lead Form") {
                              setSelectedLeadFormId(value);
                              const resolved = resolveLeadFormSchema(value, []);
                              setSelectedLeadFields(resolved.fields.map((field) => field.id));
                              setLeadFormName(resolved.name);
                              setLeadFormDescription("");
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a form…" />
                          </SelectTrigger>
                          <SelectContent>
                            {(EXISTING_FORMS[selectedFormType] ?? []).map((form) => (
                              <SelectItem key={form.id} value={form.id}>
                                {form.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedFormType === "Lead Form") {
                                setLeadFormName("");
                                setLeadFormDescription("");
                                setSelectedLeadFields([]);
                                setSelectedLeadFormId("");
                                setLeadFormModalStep("form-builder");
                                setLeadFieldValidationError("");
                                setShowLeadFieldDropdown(false);
                                return;
                              }

                              const formType = FORM_TYPES.find(
                                (f) => f.label === selectedFormType
                              );
                              if (formType) setInputMessage(formType.value);
                              setShowFormModal(false);
                              setSelectedFormType(null);
                              setSelectedExistingForm("");
                            }}
                          >
                            Add New
                          </Button>
                          <Button
                            size="sm"
                            disabled={!selectedExistingForm}
                            onClick={() => {
                              if (selectedFormType === "Lead Form") {
                                setSelectedLeadFormId(selectedExistingForm);
                                const resolved = resolveLeadFormSchema(selectedExistingForm, []);
                                setSelectedLeadFields(resolved.fields.map((field) => field.id));
                                setLeadFormName(resolved.name);
                                setLeadFormDescription("");
                                setPlacementBackStep("form-selection");
                                setLeadFormModalStep("placement");
                                return;
                              }

                              const form = (EXISTING_FORMS[selectedFormType] ?? []).find((f) => f.id === selectedExistingForm);
                              if (form) {
                                setInputMessage(`Embed the existing "${form.name}" form`);
                              }

                              setShowFormModal(false);
                              setSelectedFormType(null);
                              setSelectedExistingForm("");
                              resetLeadFormFlowState();
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Use this form
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {FORM_TYPES.map(({ label, value, icon: Icon, instant }) => (
                        <button
                          key={label}
                          onClick={() => {
                            if (instant) {
                              setInputMessage(value);
                              setShowFormModal(false);
                              setSelectedFormType(null);
                              setSelectedExistingForm("");
                              resetLeadFormFlowState();
                            } else {
                              setSelectedFormType(label);
                              setSelectedExistingForm("");
                              resetLeadFormFlowState();
                            }
                          }}
                          className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg border border-border bg-muted hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 text-left transition-colors"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedFormType === "Lead Form" && leadFormModalStep !== "form-selection" && (
                  <div className="shrink-0 border-t border-border px-6 py-3 flex items-center justify-end gap-2 bg-background">
                    {leadFormModalStep === "field-selection" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLeadFormModalStep("form-selection");
                            setLeadFieldValidationError("");
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleLeadFieldSelectionContinue}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Continue
                        </Button>
                      </>
                    ) : leadFormModalStep === "form-builder" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (attachedLeadForm) {
                              setLeadFormModalStep("placement");
                            } else {
                              setShowFormModal(false);
                              setSelectedFormType(null);
                              setSelectedExistingForm("");
                              resetLeadFormFlowState();
                            }
                          }}
                        >
                          {attachedLeadForm ? "Back" : "Close"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!attachedLeadForm) {
                              // New form - save and move to placement
                              if (!leadFormName.trim()) {
                                alert("Please enter a lead form name.");
                                return;
                              }
                              if (selectedLeadFields.length === 0) {
                                alert("Please select at least one catcher field.");
                                return;
                              }
                              const activeLeadFormId = `lf-new-${Date.now()}`;
                              setSelectedLeadFormId(activeLeadFormId);
                              setPlacementBackStep("form-selection");
                              setLeadFormModalStep("placement");
                            } else {
                              // Existing form - save changes
                              setLeadFormModalStep("placement");
                            }
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {attachedLeadForm ? "Save Changes" : "Save"}
                        </Button>
                      </>
                    ) : leadFormModalStep === "placement" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLeadFormModalStep(placementBackStep)}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          onClick={handlePlacementContinue}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {attachedLeadForm ? "Save Changes" : "Insert Form"}
                        </Button>
                      </>
                    ) : null}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Connect Domain modal */}
            <Dialog open={showDomainModal} onOpenChange={handleDomainModalClose}>
              <DialogContent className="sm:max-w-md p-0 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-border shrink-0">
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <DialogTitle className="text-base font-semibold leading-tight">
                          Connect Your Domain
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Let AI guide you step-by-step
                        </p>
                      </div>
                    </div>
                  </DialogHeader>
                  {/* Progress bar */}
                  <div className="mt-4 flex items-center gap-1.5">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all duration-300",
                          domainProgressStep >= n ? "bg-blue-500" : "bg-muted"
                        )}
                      />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1 shrink-0">
                      Step {domainProgressStep} of 3
                    </span>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                  {domainMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-blue-500 text-white ml-8"
                          : "bg-muted text-foreground mr-8"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))}

                  {/* Inline DNS instructions card */}
                  {domainFlowStep === "show-instructions" && domainProvider && (
                    <div className="mr-8 rounded-xl border border-border bg-card p-3 space-y-2.5">
                      {/* Copyable values */}
                      <div className="space-y-1.5">
                        {[
                          { label: "A Record (IP)", value: SERVER_IP },
                          { label: "CNAME Target", value: CNAME_TARGET },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex items-center justify-between gap-2 rounded-lg bg-muted px-2.5 py-1.5"
                          >
                            <div>
                              <p className="text-[10px] text-muted-foreground">{label}</p>
                              <p className="text-xs font-mono font-medium">{value}</p>
                            </div>
                            <button
                              onClick={() => handleCopyValue(value)}
                              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy"
                            >
                              {copiedValue === value ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Step list */}
                      <ol className="space-y-1.5 list-none">
                        {(PROVIDER_INSTRUCTIONS[domainProvider]?.steps ?? []).map((step, i) => (
                          <li key={i} className="flex gap-2 text-xs text-foreground">
                            <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {/* Provider notes */}
                      {PROVIDER_INSTRUCTIONS[domainProvider]?.notes?.map((note, i) => (
                        <p key={i} className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2.5 py-2">
                          {note}
                        </p>
                      ))}

                      {/* Open provider link */}
                      {domainProvider !== "Other" && (
                        <a
                          href={PROVIDER_URLS[domainProvider] ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open {domainProvider}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Inline buying guide card */}
                  {domainFlowStep === "buying-guide" && domainBuyingRegistrar && (
                    <div className="mr-8 rounded-xl border border-border bg-card p-3 space-y-2">
                      <ol className="space-y-1.5 list-none">
                        {(BUYING_STEPS[domainBuyingRegistrar] ?? BUYING_STEPS["Not sure"]).map((step, i) => (
                          <li key={i} className="flex gap-2 text-xs text-foreground">
                            <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                      {domainBuyingRegistrar !== "Not sure" && (
                        <a
                          href={PROVIDER_URLS[domainBuyingRegistrar] ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Go to {domainBuyingRegistrar}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Success state */}
                  {domainFlowStep === "done" && (
                    <div className="mr-8 rounded-xl bg-green-50 border border-green-200 p-4 text-center space-y-1">
                      <p className="text-2xl">🎉</p>
                      <p className="text-sm font-semibold text-green-700">Domain connected!</p>
                      <p className="text-xs text-green-600">
                        Allow up to 48 hours for DNS to propagate globally.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom action area */}
                <div className="px-4 pb-4 pt-3 border-t border-border shrink-0 space-y-2">
                  {domainFlowStep === "start" && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleOwnsYes}
                        className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-muted hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        Yes, I have a domain
                      </button>
                      <button
                        onClick={handleOwnsNo}
                        className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-muted hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        No, I need one
                      </button>
                    </div>
                  )}

                  {domainFlowStep === "enter-domain" && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={domainNameInput}
                        onChange={(e) => setDomainNameInput(e.target.value)}
                        onKeyDown={handleDomainInputKeyDown}
                        placeholder="e.g. mybusiness.com"
                        className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                      />
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white shrink-0" onClick={handleDomainNameSubmit}>
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}

                  {domainFlowStep === "choose-provider" && (
                    <div className="grid grid-cols-2 gap-2">
                      {["GoDaddy", "Namecheap", "Google Domains", "Cloudflare", "Other"].map((p) => (
                        <button
                          key={p}
                          onClick={() => handleProviderSelect(p)}
                          className="text-sm px-3 py-2 rounded-lg border border-border bg-muted hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 text-left transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  {domainFlowStep === "show-instructions" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleMarkAsDone}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Mark as Done
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={handleNeedHelp}
                      >
                        I need help
                      </Button>
                    </div>
                  )}

                  {domainFlowStep === "needs-domain-registrar" && (
                    <div className="grid grid-cols-2 gap-2">
                      {["GoDaddy", "Namecheap", "Google Domains", "Not sure"].map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRegistrarSelect(r)}
                          className="text-sm px-3 py-2 rounded-lg border border-border bg-muted hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 text-left transition-colors"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  {domainFlowStep === "buying-guide" && (
                    <button
                      onClick={handlePurchasedDomain}
                      className="w-full text-sm px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      I&apos;ve purchased a domain →
                    </button>
                  )}

                  {domainFlowStep === "done" && (
                    <Button
                      size="sm"
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleDomainModalClose(false)}
                    >
                      Close
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Center: Live landing page preview */}
        <div className="bg-muted/30 min-h-0 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="h-10 bg-muted border-b border-border flex items-center gap-2 px-3">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <div className="mx-3 flex-1 h-7 rounded-md bg-white border border-border text-xs text-muted-foreground flex items-center px-3">
                  /landing-pages/edit/{params?.id || "ai-generated"}
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" />
                  AI Generated
                </span>
              </div>

              <iframe
                title="Landing page live preview"
                className="w-full min-h-[820px] bg-white"
                srcDoc={srcDoc}
              />
            </div>
          </div>
        </div>

        {/* Right: GrapesJS manual editor */}
        <div className="bg-card border-l border-border min-h-0 flex flex-col">
          <div className="h-14 px-4 border-b border-border flex items-center gap-2 shrink-0">
            <PanelsTopLeft className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Page Editor</h2>
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {isGrapesReady ? "Ready" : "Loading..."}
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Hidden GrapesJS engine mount (canvas kept off-screen to avoid duplicate preview) */}
            <div className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden pointer-events-none">
              <div ref={grapesContainerRef} className="h-full w-full" />
            </div>

            {/* Visible GrapesJS panels */}
            <div className="h-full grid grid-rows-[150px_170px_1fr_220px]">
              <section className="border-b border-border min-h-0">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Blocks</div>
                <div ref={grapesBlocksRef} className="h-[calc(100%-33px)] overflow-auto px-2 pb-2 grapes-panel-host" />
              </section>

              <section className="border-b border-border min-h-0">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Layers</div>
                <div ref={grapesLayersRef} className="h-[calc(100%-33px)] overflow-auto px-2 pb-2 grapes-panel-host" />
              </section>

              <section className="border-b border-border min-h-0">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Style Manager</div>
                <div ref={grapesStylesRef} className="h-[calc(100%-33px)] overflow-auto px-2 pb-2 grapes-panel-host" />
              </section>

              <section className="min-h-0">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Traits</div>
                <div ref={grapesTraitsRef} className="h-[calc(100%-33px)] overflow-auto px-2 pb-2 grapes-panel-host" />
              </section>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .grapes-panel-host .gjs-blocks-c,
        .grapes-panel-host .gjs-sm-sectors,
        .grapes-panel-host .gjs-trt-traits,
        .grapes-panel-host .gjs-layers {
          padding: 0 !important;
        }

        .grapes-panel-host .gjs-block {
          width: calc(50% - 8px);
          min-height: 56px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: none;
          margin: 4px;
          background: #fff;
        }

        .grapes-panel-host .gjs-sm-sector {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 8px;
          overflow: hidden;
          background: #fff;
        }

        .grapes-panel-host .gjs-sm-title,
        .grapes-panel-host .gjs-layer-title,
        .grapes-panel-host .gjs-trt-trait {
          color: #111827;
        }

        .grapes-panel-host .gjs-layer-item,
        .grapes-panel-host .gjs-sm-property {
          border-color: #f3f4f6;
        }

        .gjs-one-bg,
        .gjs-two-color,
        .gjs-four-color,
        .gjs-three-bg {
          background: #ffffff !important;
          color: #374151 !important;
        }

        .gjs-pn-panel {
          border-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
