import { NextRequest, NextResponse } from "next/server";
import type { CookieConsentEvent } from "@/lib/ai-prompts";

/**
 * POST /api/cookie-consent
 *
 * Persists a cookie consent event from a generated website page.
 * Data is surfaced in the Website Stats dashboard under "Cookie Consent".
 *
 * Body: CookieConsentEvent (see lib/ai-prompts.ts for schema)
 *
 * Persistence:
 *   - In production: write to `cookie_consent_events` table via your DB client.
 *   - In development / when DB is unavailable: log to console and return 200
 *     so the client-side retry logic does not loop indefinitely.
 *
 * To connect a real database, replace the TODO block below with your ORM
 * call (e.g. Prisma, Drizzle, Supabase, PlanetScale, etc.).
 */

export async function POST(req: NextRequest) {
  let body: CookieConsentEvent;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic validation
  const { siteId, sessionId, choice, categories, timestamp, userAgent, page } = body;
  if (!siteId || !sessionId || !choice || !categories || !timestamp) {
    return NextResponse.json(
      { error: "Missing required fields: siteId, sessionId, choice, categories, timestamp" },
      { status: 400 }
    );
  }

  if (!["accepted_all", "rejected_non_essential", "custom"].includes(choice)) {
    return NextResponse.json({ error: "Invalid choice value" }, { status: 400 });
  }

  try {
    // -----------------------------------------------------------------------
    // TODO: Replace this block with your actual DB write.
    //
    // Example with Prisma:
    //   await prisma.cookieConsentEvent.create({
    //     data: {
    //       siteId,
    //       sessionId,
    //       choice,
    //       essential: categories.essential,
    //       analytics: categories.analytics,
    //       marketing: categories.marketing,
    //       page: page ?? "",
    //       userAgent: userAgent ?? "",
    //       createdAt: new Date(timestamp),
    //     },
    //   });
    //
    // Example with Supabase:
    //   const { error } = await supabase
    //     .from("cookie_consent_events")
    //     .insert({
    //       site_id: siteId,
    //       session_id: sessionId,
    //       choice,
    //       essential: categories.essential,
    //       analytics: categories.analytics,
    //       marketing: categories.marketing,
    //       page: page ?? "",
    //       user_agent: userAgent ?? "",
    //       created_at: timestamp,
    //     });
    //   if (error) throw error;
    // -----------------------------------------------------------------------

    // Development fallback: log the event so it's visible in server logs.
    console.log("[cookie-consent]", {
      siteId,
      sessionId,
      choice,
      categories,
      page,
      timestamp,
      userAgent: userAgent?.substring(0, 80),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[cookie-consent] DB write failed:", err);
    return NextResponse.json({ error: "Failed to persist consent event" }, { status: 500 });
  }
}

/**
 * GET /api/cookie-consent?siteId=<slug>&from=<ISO>&to=<ISO>
 *
 * Returns aggregated consent stats for the Website Stats dashboard.
 *
 * Response shape:
 * {
 *   total: number,
 *   acceptedAll: number,
 *   rejectedNonEssential: number,
 *   custom: number,
 *   analyticsOptIn: number,
 *   marketingOptIn: number,
 * }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");
  const from   = searchParams.get("from");
  const to     = searchParams.get("to");

  if (!siteId) {
    return NextResponse.json({ error: "siteId query param is required" }, { status: 400 });
  }

  try {
    // -----------------------------------------------------------------------
    // TODO: Replace with real DB aggregation query.
    //
    // Example with Prisma:
    //   const where = {
    //     siteId,
    //     ...(from && to ? { createdAt: { gte: new Date(from), lte: new Date(to) } } : {}),
    //   };
    //   const [total, acceptedAll, rejected, custom, analyticsOptIn, marketingOptIn] =
    //     await Promise.all([
    //       prisma.cookieConsentEvent.count({ where }),
    //       prisma.cookieConsentEvent.count({ where: { ...where, choice: "accepted_all" } }),
    //       prisma.cookieConsentEvent.count({ where: { ...where, choice: "rejected_non_essential" } }),
    //       prisma.cookieConsentEvent.count({ where: { ...where, choice: "custom" } }),
    //       prisma.cookieConsentEvent.count({ where: { ...where, analytics: true } }),
    //       prisma.cookieConsentEvent.count({ where: { ...where, marketing: true } }),
    //     ]);
    //   return NextResponse.json({ total, acceptedAll, rejectedNonEssential: rejected,
    //                              custom, analyticsOptIn, marketingOptIn });
    // -----------------------------------------------------------------------

    // Development stub — returns zeroed stats until DB is connected.
    void from; void to; // suppress unused-var warnings
    return NextResponse.json({
      total: 0,
      acceptedAll: 0,
      rejectedNonEssential: 0,
      custom: 0,
      analyticsOptIn: 0,
      marketingOptIn: 0,
      _stub: true,
    });
  } catch (err) {
    console.error("[cookie-consent] DB read failed:", err);
    return NextResponse.json({ error: "Failed to fetch consent stats" }, { status: 500 });
  }
}
