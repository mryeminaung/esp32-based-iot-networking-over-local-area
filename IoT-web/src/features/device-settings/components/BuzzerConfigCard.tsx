import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import CheckboxItem from "./CheckboxItem";

type BuzzerConfigCardProps = {
  enabled: boolean;
  lowWater: boolean;
  drySoil: boolean;
  sensorError: boolean;
  onEnabledChange: (val: boolean) => void;
  onConditionChange: (
    field: "lowWater" | "drySoil" | "sensorError",
    val: boolean,
  ) => void;
};

export default function BuzzerConfigCard({
  enabled,
  lowWater,
  drySoil,
  sensorError,
  onEnabledChange,
  onConditionChange,
}: BuzzerConfigCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600">
            <Bell className="w-4 h-4" />
          </span>
          Buzzer Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">
              Buzzer Enable / Disable
            </span>
          </div>
          <Switch
            size="sm"
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        </div>

        {/* Alert Conditions */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">
            Alert Conditions
          </label>
          <div className="space-y-2">
            <CheckboxItem
              label="Low water level"
              checked={lowWater}
              onChange={(val) => onConditionChange("lowWater", val)}
              disabled={!enabled}
            />
            <CheckboxItem
              label="Dry soil condition"
              checked={drySoil}
              onChange={(val) => onConditionChange("drySoil", val)}
              disabled={!enabled}
            />
            <CheckboxItem
              label="Sensor error"
              checked={sensorError}
              onChange={(val) => onConditionChange("sensorError", val)}
              disabled={!enabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
