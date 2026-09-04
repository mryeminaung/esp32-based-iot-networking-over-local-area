import { Fan, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

type FanConfigCardProps = {
  enabled: boolean;
  speed: number;
  onEnabledChange: (val: boolean) => void;
  onSpeedChange: (val: number) => void;
};

export default function FanConfigCard({
  enabled,
  speed,
  onEnabledChange,
  onSpeedChange,
}: FanConfigCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600">
            <Fan className="w-4 h-4" />
          </span>
          Fan Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">
              Fan Enable / Disable
            </span>
          </div>
          <Switch size="sm" checked={enabled} onCheckedChange={onEnabledChange} />
        </div>

        {/* Speed Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              PWM Speed
            </label>
            <span className="text-lg font-bold text-cyan-600">{speed}%</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(val) => onSpeedChange(val[0])}
            min={0}
            max={100}
            disabled={!enabled}
          />
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>0% (Off)</span>
            <span>50%</span>
            <span>100% (Max)</span>
          </div>
        </div>

        {/* Current Display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 border border-cyan-200">
          <span className="text-sm text-cyan-700">Current Fan Speed</span>
          <div className="flex items-center gap-2">
            <Fan
              className={`w-4 h-4 text-cyan-600 ${enabled ? "animate-spin" : ""}`}
              style={{
                animationDuration: `${2 - (speed / 100) * 1.5}s`,
              }}
            />
            <span className="text-lg font-bold text-cyan-700">
              {enabled ? `${speed}%` : "OFF"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
