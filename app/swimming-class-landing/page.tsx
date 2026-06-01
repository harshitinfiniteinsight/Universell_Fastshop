import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SwimmingClassLandingPage() {
  const highlights = [
    "Certified coaches for kids & adults",
    "Heated indoor pool with safety lifeguards",
    "Flexible weekday and weekend batches",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.25),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(251,146,60,0.22),_transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                Customer View · Embedded Form Experience
              </span>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Learn Swimming with Confidence
              </h1>

              <p className="max-w-xl text-base text-slate-200/90 md:text-lg">
                Build real water confidence with structured programs, certified trainers, and progress tracking for every age group.
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Book Free Trial</Button>
                <Button variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10">
                  View Batch Timings
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "4.9/5", label: "Google Rating" },
                { value: "1,200+", label: "Students Trained" },
                { value: "12", label: "Weekly Batches" },
              ].map((stat) => (
                <Card key={stat.label} className="border-white/15 bg-white/10 text-white shadow-none">
                  <CardContent className="p-4 text-center">
                    <p className="text-xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-slate-200">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-100 md:text-3xl">Why families choose our academy</h2>
            <p className="text-slate-300">
              Our programs combine technique, endurance, and safety-first coaching in a motivating environment.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Small batch sizes",
                "Progress reports every 2 weeks",
                "Beginner to advanced curriculum",
                "Separate lanes by skill level",
              ].map((point) => (
                <div key={point} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {point}
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-2xl border-orange-300/40 bg-white text-slate-900 shadow-2xl shadow-cyan-950/20">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-xl font-semibold">Get a Free Trial Class</h3>
              <p className="text-sm text-slate-600">Share your details and our team will contact you within 24 hours.</p>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Submit Request</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
