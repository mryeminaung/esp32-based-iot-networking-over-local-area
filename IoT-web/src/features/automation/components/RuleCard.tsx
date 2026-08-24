import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Droplets, Thermometer, Sun, Wind, Waves, Clock } from "lucide-react"
import type { AutomationRule } from "../types"
import { SENSOR_OPTIONS, ACTION_OPTIONS, SENSOR_UNITS } from "../types"

const SENSOR_ICONS: Record<string, typeof Droplets> = {
  soilMoisture: Droplets,
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
  airQuality: Wind,
  waterLevel: Waves,
}

type RuleCardProps = {
  rule: AutomationRule
  onToggle: (id: number, enabled: boolean) => void
  onEdit: (rule: AutomationRule) => void
  onDelete: (id: number) => void
}

export default function RuleCard({ rule, onToggle, onEdit, onDelete }: RuleCardProps) {
  const SensorIcon = SENSOR_ICONS[rule.sensor] || Droplets
  const sensorLabel = SENSOR_OPTIONS.find((s) => s.value === rule.sensor)?.label || rule.sensor
  const actionLabel = ACTION_OPTIONS.find((a) => a.value === rule.action)?.label || rule.action
  const unit = SENSOR_UNITS[rule.sensor] || ""

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-green-light flex items-center justify-center">
              <SensorIcon className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-text-primary">{rule.name}</h3>
              <p className="text-xs text-text-muted mt-0.5">
                {sensorLabel} {rule.condition} {rule.threshold}{unit}
              </p>
            </div>
          </div>
          <Switch
            size="sm"
            checked={rule.enabled}
            onCheckedChange={(checked) => onToggle(rule.id, checked)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Action</span>
            <Badge variant="secondary" className="text-xs font-normal">
              {actionLabel}
            </Badge>
          </div>

          {rule.duration && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Auto-off</span>
              <span className="flex items-center gap-1 text-text-secondary">
                <Clock className="size-3" />
                {rule.duration}s
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Cooldown</span>
            <span className="text-text-secondary">{rule.cooldown}s</span>
          </div>

          {rule.lastTriggered && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Last triggered</span>
              <span className="text-text-secondary">
                {new Date(rule.lastTriggered).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => onEdit(rule)}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDelete(rule.id)}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
