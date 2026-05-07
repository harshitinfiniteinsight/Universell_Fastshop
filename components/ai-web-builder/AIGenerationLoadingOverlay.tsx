"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  /** Duration this stage lasts in milliseconds */
  duration: number;
  message: string;
  /** Target percentage at end of this stage */
  targetPct: number;
}

const STAGES: Stage[] = [
  { duration: 5000,  message: "Analyzing your business and products...",       targetPct: 12 },
  { duration: 5000,  message: "Understanding your audience and goals...",       targetPct: 24 },
  { duration: 8000,  message: "Designing a modern, high-converting layout...", targetPct: 41 },
  { duration: 7000,  message: "Generating responsive HTML sections...",         targetPct: 63 },
  { duration: 7000,  message: "Creating persuasive marketing content...",       targetPct: 79 },
  { duration: 8000,  message: "Optimizing mobile responsiveness and SEO...",   targetPct: 92 },
  { duration: 8000,  message: "Finalizing your landing page experience...",     targetPct: 100 },
];

// Total simulated duration = sum of all stage durations = 48 000 ms (48 s).
// Users will see the overlay for the full 48 s before navigating to the result.

const MAX_LOG_LINES = 6;
/** How often a new AI activity log entry appears during the 48 s sequence */
const LOG_INTERVAL_MS = 4400;

const ACTIVITY_LOG = [
  "Generating hero section...",
  "Creating CTA blocks...",
  "Building testimonials section...",
  "Optimizing conversion flow...",
  "Crafting compelling headlines...",
  "Styling mobile layout...",
  "Finalizing color palette...",
  "Adding animations & transitions...",
  "Compiling page structure...",
  "Running conversion optimizations...",
];

interface Props {
  /** Called when the loading sequence has completed and the page should be revealed */
  onComplete: () => void;
}

export function AIGenerationLoadingOverlay({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [msgVisible, setMsgVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const hasCompleted = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Drive the staged progress
  useEffect(() => {
    let cancelled = false;
    let prevPct = 0;

    const runStages = async () => {
      for (let i = 0; i < STAGES.length; i++) {
        if (cancelled) return;
        const stage = STAGES[i];
        const startPct = prevPct;
        const endPct = stage.targetPct;
        const steps = 40;
        const stepDelay = stage.duration / steps;

        // Fade out message before switching
        if (i > 0) {
          setMsgVisible(false);
          await wait(300);
          if (cancelled) return;
        }
        setStageIndex(i);
        setMsgVisible(true);

        for (let s = 1; s <= steps; s++) {
          await wait(stepDelay);
          if (cancelled) return;
          const pct = startPct + Math.round(((endPct - startPct) * s) / steps);
          setProgress(pct);
        }
        prevPct = endPct;
      }

      if (cancelled) return;
      // Show success state
      setDone(true);
      setSuccessVisible(true);
      await wait(1800);
      if (cancelled) return;
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        onCompleteRef.current();
      }
    };

    runStages();
    return () => { cancelled = true; };
  }, []);

  // Append activity log lines on a staggered interval
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= ACTIVITY_LOG.length) { clearInterval(interval); return; }
      setLogLines((prev: string[]) => [ACTIVITY_LOG[idx], ...prev].slice(0, MAX_LOG_LINES));
      idx++;
    }, LOG_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll activity log to top (newest entry)
  useEffect(() => {
    logRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [logLines]);

  const currentMessage = STAGES[stageIndex]?.message ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-orange-50/90">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-300/20 blur-3xl animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative w-full max-w-md mx-4 space-y-6 animate-fade-in-up">
        {/* Header card */}
        <div className="rounded-2xl border border-primary/15 bg-white/90 backdrop-blur-sm shadow-2xl shadow-primary/10 overflow-hidden">
          {/* Top gradient strip */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-orange-400 to-primary bg-[length:200%_100%] animate-[gradient-shift_3s_ease_infinite]" />

          <div className="p-6 space-y-5">
            {/* Icon + title */}
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/25">
                {done ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground leading-tight">
                  {done ? "Your landing page is ready!" : "Universell AI is building your page"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {done ? "Redirecting you now…" : "Premium AI generation in progress"}
                </p>
              </div>
            </div>

            {/* Percentage + progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    "text-xs font-medium transition-opacity duration-500",
                    msgVisible ? "opacity-100" : "opacity-0",
                    "text-primary/80"
                  )}
                >
                  {currentMessage}
                  {!done && <TypingDots />}
                </span>
                <span className="text-sm font-bold text-primary tabular-nums">{progress}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Success message */}
            {done && (
              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-500",
                  successVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Landing page generation complete!
              </div>
            )}
          </div>
        </div>

        {/* AI Activity Log card */}
        {!done && (
          <div className="rounded-2xl border border-border/60 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">AI Activity Log</span>
            </div>
            <div
              ref={logRef}
              className="px-4 py-3 space-y-1.5 min-h-[80px] max-h-[120px] overflow-hidden"
            >
              {logLines.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 italic">Initializing AI engine…</p>
              ) : (
                logLines.map((line, i) => (
                  <div
                    key={line + i}
                    className={cn(
                      "flex items-center gap-2 text-xs transition-all duration-500",
                      i === 0 ? "text-primary font-medium opacity-100" : "text-muted-foreground opacity-60"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", i === 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/40")} />
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Skeleton shimmer preview (only visible in middle stages) */}
        {!done && progress >= 24 && progress < 92 && (
          <div className="rounded-2xl border border-border/40 bg-white/70 backdrop-blur-sm shadow overflow-hidden p-4 space-y-3 animate-fade-in-up">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Page Preview</p>
            {/* Hero shimmer */}
            <div className="h-10 rounded-lg bg-gradient-to-r from-primary/10 via-orange-100 to-primary/10 bg-[length:200%_100%] animate-shimmer" />
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-6 rounded bg-gradient-to-r from-muted/60 via-muted/30 to-muted/60 bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: `${n * 0.15}s` }} />
              ))}
            </div>
            <div className="h-4 w-3/4 rounded bg-gradient-to-r from-muted/60 via-muted/30 to-muted/60 bg-[length:200%_100%] animate-shimmer [animation-delay:0.3s]" />
            <div className="h-4 w-1/2 rounded bg-gradient-to-r from-muted/60 via-muted/30 to-muted/60 bg-[length:200%_100%] animate-shimmer [animation-delay:0.45s]" />
          </div>
        )}

        {/* Bottom tip */}
        {!done && (
          <p className="text-center text-xs text-muted-foreground/70 px-2">
            💡 High-converting pages have a clear headline, strong CTA, and social proof — we're crafting all of that for you.
          </p>
        )}
      </div>
    </div>
  );
}

/** Animated "..." typing dots */
function TypingDots() {
  return (
    <span className="inline-flex gap-0.5 ml-1 align-middle">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1 h-1 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
