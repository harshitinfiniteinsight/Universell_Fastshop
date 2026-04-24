"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const FORM_TYPES = [
  { label: "Custom Form", value: "Add a custom form", icon: FileText },
  { label: "Payment Form", value: "Add a payment form", icon: CreditCard },
  { label: "Lead Form", value: "Add a lead form", icon: UserPlus },
  { label: "Ticket Form", value: "Add a ticket form", icon: Ticket },
  { label: "Product QR Code", value: "Add a product QR code", icon: QrCode },
  { label: "Schedule Me", value: "Add a schedule me booking form", icon: CalendarClock },
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
  ],
  "Ticket Form": [
    { id: "tf-1", name: "Support Ticket" },
    { id: "tf-2", name: "Event Registration" },
  ],
  "Product QR Code": [
    { id: "qr-1", name: "Menu QR Code" },
    { id: "qr-2", name: "Product Catalog QR" },
  ],
  "Schedule Me": [
    { id: "sm-1", name: "Consultation Booking" },
    { id: "sm-2", name: "Service Appointment" },
  ],
};

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

  const grapesContainerRef = useRef<HTMLDivElement>(null);
  const grapesBlocksRef = useRef<HTMLDivElement>(null);
  const grapesLayersRef = useRef<HTMLDivElement>(null);
  const grapesStylesRef = useRef<HTMLDivElement>(null);
  const grapesTraitsRef = useRef<HTMLDivElement>(null);
  const grapesEditorRef = useRef<any>(null);

  useEffect(() => {
    const currentId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    if (currentId && currentId !== "new") {
      const rawSavedDrafts = localStorage.getItem(SAVED_LANDING_PAGES_KEY);
      if (!rawSavedDrafts) return;

      try {
        const savedDrafts = JSON.parse(rawSavedDrafts) as SavedLandingPageDraft[];
        const existingDraft = savedDrafts.find((item) => item.id === currentId);
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
  }, [params?.id]);

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

  const persistLandingPage = (status: "draft" | "published") => {
    const currentId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const draftId = currentId && currentId !== "new" ? currentId : `lp-${Date.now()}`;
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
                onClick={() => setShowFormModal(true)}
                className="text-[11px] px-2 py-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1"
              >
                <ClipboardList className="w-3 h-3" />
                Add Form
              </button>
            </div>

            <Dialog
              open={showFormModal}
              onOpenChange={(open) => {
                setShowFormModal(open);
                if (!open) {
                  setSelectedFormType(null);
                  setSelectedExistingForm("");
                }
              }}
            >
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>
                    {selectedFormType ? (
                      <button
                        onClick={() => {
                          setSelectedFormType(null);
                          setSelectedExistingForm("");
                        }}
                        className="flex items-center gap-1.5 text-sm font-semibold hover:text-orange-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {selectedFormType}
                      </button>
                    ) : (
                      "Insert a Form"
                    )}
                  </DialogTitle>
                </DialogHeader>

                {selectedFormType ? (
                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-muted-foreground">
                      Select an existing form to embed, or create a new one.
                    </p>
                    <Select
                      value={selectedExistingForm}
                      onValueChange={setSelectedExistingForm}
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
                          const formType = FORM_TYPES.find(
                            (f) => f.label === selectedFormType
                          );
                          if (formType) setInputMessage(formType.value);
                          setShowFormModal(false);
                          setSelectedFormType(null);
                          setSelectedExistingForm("");
                        }}
                      >
                        Create new
                      </Button>
                      <Button
                        size="sm"
                        disabled={!selectedExistingForm}
                        onClick={() => {
                          const form = (
                            EXISTING_FORMS[selectedFormType] ?? []
                          ).find((f) => f.id === selectedExistingForm);
                          if (form) {
                            setInputMessage(
                              `Embed the existing "${form.name}" form`
                            );
                          }
                          setShowFormModal(false);
                          setSelectedFormType(null);
                          setSelectedExistingForm("");
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Use this form
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {FORM_TYPES.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setSelectedFormType(label);
                          setSelectedExistingForm("");
                        }}
                        className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg border border-border bg-muted hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 text-left transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
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
