"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";

type EditorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LandingDraft = {
  businessName?: string;
  tagline?: string;
  description?: string;
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
  const [messages, setMessages] = useState<EditorMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<LandingDraft>(FALLBACK_DRAFT);
  const [html, setHtml] = useState<string>(buildLandingHtml(FALLBACK_DRAFT));
  const [css, setCss] = useState<string>(baseCss);
  const [isGrapesReady, setIsGrapesReady] = useState(false);

  const grapesContainerRef = useRef<HTMLDivElement>(null);
  const grapesEditorRef = useRef<any>(null);

  useEffect(() => {
    const rawDraft = localStorage.getItem("universell-landing-page-draft");
    if (!rawDraft) return;

    try {
      const parsed = JSON.parse(rawDraft) as LandingDraft;
      const merged = {
        ...FALLBACK_DRAFT,
        ...parsed,
      };
      setDraft(merged);
      setHtml(buildLandingHtml(merged));
    } catch {
      // no-op fallback
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let editorInstance: any;

    const init = async () => {
      if (!grapesContainerRef.current) return;

      const grapesModule = await import("grapesjs");
      if (!isMounted || !grapesContainerRef.current) return;

      const grapesjs = (grapesModule as any).default || grapesModule;

      editorInstance = grapesjs.init({
        container: grapesContainerRef.current,
        height: "100%",
        width: "auto",
        storageManager: false,
        fromElement: false,
        components: html,
        style: css,
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
          <Button variant="outline" size="sm">
            Save Draft
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* 3-column editor */}
      <div className="flex-1 min-h-0 grid grid-cols-[320px_1fr_420px]">
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
            </div>
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
            <h2 className="font-semibold text-foreground">Manual Editor (GrapesJS)</h2>
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {isGrapesReady ? "Ready" : "Loading..."}
            </span>
          </div>

          <div className="flex-1 min-h-0">
            <div ref={grapesContainerRef} className="h-full w-full" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gjs-one-bg,
        .gjs-two-color,
        .gjs-four-color,
        .gjs-three-bg {
          background: #ffffff !important;
          color: #374151 !important;
        }

        .gjs-block {
          width: calc(50% - 8px);
          min-height: 60px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: none;
        }

        .gjs-pn-panel {
          border-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
