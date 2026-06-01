import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SwimmingClassLandingFormPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        <Card className="rounded-2xl border-orange-200 shadow-lg">
          <CardContent className="space-y-4 p-6 md:p-8">
            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Swimming Class · Form
            </span>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Book Your Free Trial Class</h1>
            <p className="text-sm text-slate-600">Please fill in your details. Our team will contact you shortly.</p>

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
      </section>
    </main>
  );
}
