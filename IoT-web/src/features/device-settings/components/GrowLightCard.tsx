import { Sun, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type GrowLightCardProps = {
  currentLight: number;
  lowThreshold: number;
  onThresholdChange: (field: "lowThreshold", value: number) => void;
};

export default function GrowLightCard({
  currentLight,
  lowThreshold,
  onThresholdChange,
}: GrowLightCardProps) {
  const isOn = currentLight < lowThreshold;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600">
            <Lightbulb className="w-4 h-4" />
          </span>
          Grow Light
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">Current Light</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-text-primary">
              {currentLight}%
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isOn
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isOn ? "Grow ON" : "Sufficient"}
            </span>
          </div>
        </div>

        {/* Low Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Low Light Threshold
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={lowThreshold}
              onChange={(e) =>
                onThresholdChange(
                  "lowThreshold",
                  Math.min(100, Math.max(0, Number(e.target.value))),
                )
              }
              className="w-24"
            />
            <span className="text-sm text-text-muted">%</span>
            <span className="text-xs text-text-muted ml-auto">
              Below this = Grow light ON
            </span>
          </div>
        </div>

        {/* Visual indicator */}
        <div className="space-y-1.5">
          <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 via-amber-400 to-green-500 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-700 shadow"
              style={{
                left: `${currentLight}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-border"
              style={{ left: `${lowThreshold}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>Dark (Grow ON)</span>
            <span>Bright (Off)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
