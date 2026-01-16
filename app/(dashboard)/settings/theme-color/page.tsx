"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const presetColors = [
  { name: "Orange", value: "#F04F29" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Indigo", value: "#6366F1" },
];

export default function ThemeColorPage() {
  const [selectedColor, setSelectedColor] = useState("#F04F29");
  const [customColor, setCustomColor] = useState("#F04F29");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Change Theme Color
        </h1>
        <p className="text-muted-foreground">
          Customize the primary color of your Fast Shop
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Preset Colors */}
          <div>
            <Label className="text-base font-medium">Preset Colors</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose from our curated color palette
            </p>
            <div className="grid grid-cols-4 gap-3">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setSelectedColor(color.value);
                    setCustomColor(color.value);
                  }}
                  className={cn(
                    "relative h-16 rounded-lg border-2 transition-all",
                    selectedColor === color.value
                      ? "border-foreground scale-105 shadow-lg"
                      : "border-transparent hover:scale-102"
                  )}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  )}
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div>
            <Label className="text-base font-medium">Custom Color</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Or enter your own hex color code
            </p>
            <div className="flex gap-4 items-center">
              <div
                className="w-16 h-16 rounded-lg border-2 border-border"
                style={{ backgroundColor: customColor }}
              />
              <div className="flex-1">
                <Input
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setSelectedColor(e.target.value);
                    }
                  }}
                  placeholder="#F04F29"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-border">
            <Label className="text-base font-medium">Preview</Label>
            <div className="mt-4 p-6 bg-muted/30 rounded-lg">
              <div className="flex gap-4 items-center">
                <Button style={{ backgroundColor: selectedColor }}>
                  Primary Button
                </Button>
                <Button variant="outline" style={{ borderColor: selectedColor, color: selectedColor }}>
                  Outline Button
                </Button>
                <div
                  className="px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: selectedColor }}
                >
                  Badge
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button style={{ backgroundColor: selectedColor }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
