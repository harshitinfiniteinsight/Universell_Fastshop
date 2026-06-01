import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SwimmingClassLandingCtaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-orange-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.2),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(251,146,60,0.18),_transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-100/60 px-3 py-1 text-xs font-semibold text-cyan-800">
                Customer View · CTA Mode
              </span>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Start Your Swimming Journey Today
              </h1>

              <p className="max-w-xl text-base text-slate-600 md:text-lg">
                Beginner-friendly classes, certified coaches, and milestone-based learning plans for every swimmer.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/swimming-class-landing-form" target="_blank" rel="noopener noreferrer">
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline">View Batch Timings</Button>
              </div>

              <p className="text-xs text-slate-500">Clicking "Get Started" opens the registration form in a new tab.</p>
            </div>

            <Card className="rounded-2xl border-cyan-200 bg-white/90 shadow-xl">
              <CardContent className="p-6">
                <p className="text-sm font-semibold text-slate-800">What you get</p>
                <div className="mt-4 space-y-3">
                  {[
                    "Personalized training tracks",
                    "Real-time coach feedback",
                    "Safe, hygienic pool facility",
                    "Flexible weekday & weekend slots",
                  ].map((item) => (
                    <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 md:pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: "4.9/5", label: "Average Parent Rating" },
            { value: "1,200+", label: "Happy Learners" },
            { value: "95%", label: "Completion Success Rate" },
          ].map((stat) => (
            <Card key={stat.label} className="rounded-xl border-slate-200 bg-white/80">
              <CardContent className="p-5 text-center">
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
