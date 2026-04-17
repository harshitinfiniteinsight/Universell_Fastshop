import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPageTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-3">
            <Link href="/landing-page">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Select a Template</h1>
          <p className="text-muted-foreground mt-1">
            Choose a template to get started with your landing page.
          </p>
        </div>

        <Button asChild className="self-start sm:mt-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/landing-page">Generate template with AI</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden shadow-sm">
        <Image
          src="/Select Template.png"
          alt="Select Template"
          width={1400}
          height={900}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
