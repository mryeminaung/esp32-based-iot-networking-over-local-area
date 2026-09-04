import { Droplets, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type WaterLevelCardProps = {
  lowThreshold: number;
  criticalThreshold: number;
  warningEnabled: boolean;
  onThresholdChange: (
    field: "lowThreshold" | "criticalThreshold",
    value: number,
  ) => void;
  onWarningToggle: (val: boolean) => void;
};

export default function WaterLevelCard({
  lowThreshold,
  criticalThreshold,
  warningEnabled,
  onThresholdChange,
  onWarningToggle,
}: WaterLevelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
            <Droplets className="w-4 h-4" />
          </span>
          Water Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Warning Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">Low Water Warning</span>
          </div>
          <Switch
            size="sm"
            checked={warningEnabled}
            onCheckedChange={onWarningToggle}
          />
        </div>

        {/* Low Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Low Water Threshold
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
              Warning level
            </span>
          </div>
        </div>

        {/* Critical Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Critical Water Threshold
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={criticalThreshold}
              onChange={(e) =>
                onThresholdChange(
                  "criticalThreshold",
                  Math.min(100, Math.max(0, Number(e.target.value))),
                )
              }
              className="w-24"
            />
            <span className="text-sm text-text-muted">%</span>
            <span className="text-xs text-text-muted ml-auto">
              Critical level
            </span>
          </div>
        </div>

        {/* Status preview */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <span className="text-xs text-text-muted">
            Normal → Low Warning → Critical
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
