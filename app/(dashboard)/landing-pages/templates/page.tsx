import { Card } from "@/components/ui/card";

export default function LandingPageTemplatesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Landing Page Templates</h1>
        <p className="text-muted-foreground mt-1">
          Template-based manual creation space for landing pages.
        </p>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Template selection flow will be added here.
      </Card>
    </div>
  );
}
