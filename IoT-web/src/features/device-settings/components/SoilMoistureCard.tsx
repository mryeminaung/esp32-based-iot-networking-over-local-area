import { Droplets, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SoilMoistureStatusBadge from "./SoilMoistureStatusBadge";
import type { SoilMoistureStatus } from "../types";

type SoilMoistureCardProps = {
  moisture: number;
  dryThreshold: number;
  optimalThreshold: number;
  soilStatus: SoilMoistureStatus;
  onThresholdChange: (
    field: "dryThreshold" | "optimalThreshold",
    value: number,
  ) => void;
};

export default function SoilMoistureCard({
  moisture,
  dryThreshold,
  optimalThreshold,
  soilStatus,
  onThresholdChange,
}: SoilMoistureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600">
            <Droplets className="w-4 h-4" />
          </span>
          Soil Moisture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">Current Reading</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-text-primary">
              {moisture}%
            </span>
            <SoilMoistureStatusBadge status={soilStatus} />
          </div>
        </div>

        {/* Dry Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Dry Threshold
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={dryThreshold}
              onChange={(e) =>
                onThresholdChange(
                  "dryThreshold",
                  Math.min(100, Math.max(0, Number(e.target.value))),
                )
              }
              className="w-24"
            />
            <span className="text-sm text-text-muted">%</span>
            <span className="text-xs text-text-muted ml-auto">
              Below this = Dry
            </span>
          </div>
        </div>

        {/* Optimal Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Optimal Threshold
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={optimalThreshold}
              onChange={(e) =>
                onThresholdChange(
                  "optimalThreshold",
                  Math.min(100, Math.max(0, Number(e.target.value))),
                )
              }
              className="w-24"
            />
            <span className="text-sm text-text-muted">%</span>
            <span className="text-xs text-text-muted ml-auto">
              Above this = Wet
            </span>
          </div>
        </div>

        {/* Visual range indicator */}
        <div className="space-y-1.5">
          <div className="h-2 rounded-full bg-gradient-to-r from-orange-400 via-green-500 to-blue-500 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-700 shadow"
              style={{
                left: `${moisture}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>Dry</span>
            <span>Optimal</span>
            <span>Wet</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
