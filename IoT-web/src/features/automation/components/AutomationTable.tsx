import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2, Droplets, Thermometer, Sun, Wind, Waves, Clock } from "lucide-react"
import type { AutomationRule } from "../types"
import { SENSOR_OPTIONS, CONDITION_OPTIONS, ACTION_OPTIONS, SENSOR_UNITS } from "../types"

export type ViewMode = "grid" | "table"

interface AutomationTableProps {
  rules: AutomationRule[]
  view: ViewMode
  onToggle: (id: number, enabled: boolean) => void
  onEdit: (rule: AutomationRule) => void
  onDelete: (id: number) => void
}

const SENSOR_ICONS: Record<string, typeof Droplets> = {
  soilMoisture: Droplets,
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
  airQuality: Wind,
  waterLevel: Waves,
}

function GridView({ rules, onToggle, onEdit, onDelete }: Omit<AutomationTableProps, "view">) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {rules.map((rule) => {
        const SensorIcon = SENSOR_ICONS[rule.sensor] || Droplets
        const sensorLabel = SENSOR_OPTIONS.find((s) => s.value === rule.sensor)?.label || rule.sensor
        const actionLabel = ACTION_OPTIONS.find((a) => a.value === rule.action)?.label || rule.action
        const unit = SENSOR_UNITS[rule.sensor] || ""

        return (
          <div
            key={rule.id}
            className="flex flex-col gap-3 p-4 rounded-xl bg-bg-muted border border-border hover:border-border-strong transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-green-light flex items-center justify-center shrink-0">
                  <SensorIcon className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{rule.name}</p>
                  <p className="text-xs text-text-muted truncate">
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

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {actionLabel}
              </Badge>
              {rule.duration && (
                <Badge variant="outline" className="text-xs font-normal flex items-center gap-1">
                  <Clock className="size-3" />
                  {rule.duration}s auto-off
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <span className="text-[0.65rem] text-text-muted">
                Cooldown: {rule.cooldown}s
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(rule)}
                  title="Edit rule"
                  className="h-8 w-8 text-text-muted hover:text-green-600 hover:bg-green-50">
                  <Pencil size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(rule.id)}
                  title="Delete rule"
                  className="h-8 w-8 text-text-muted hover:text-red-600 hover:bg-red-50">
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TableView({ rules, onToggle, onEdit, onDelete }: Omit<AutomationTableProps, "view">) {
  return (
    <div className="overflow-hidden">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-bg-muted border-b border-border text-xs font-medium text-text-muted uppercase tracking-wider">
        <div className="col-span-3">Rule</div>
        <div className="col-span-2">Sensor</div>
        <div className="col-span-2">Condition</div>
        <div className="col-span-2">Action</div>
        <div className="col-span-1">Enabled</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border">
        {rules.map((rule) => {
          const SensorIcon = SENSOR_ICONS[rule.sensor] || Droplets
          const sensorLabel = SENSOR_OPTIONS.find((s) => s.value === rule.sensor)?.label || rule.sensor
          const conditionLabel = CONDITION_OPTIONS.find((c) => c.value === rule.condition)?.label || rule.condition
          const actionLabel = ACTION_OPTIONS.find((a) => a.value === rule.action)?.label || rule.action
          const unit = SENSOR_UNITS[rule.sensor] || ""

          return (
            <div
              key={rule.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3 hover:bg-bg-muted transition-colors items-center">
              {/* Rule */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-green-light flex items-center justify-center shrink-0">
                  <SensorIcon className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{rule.name}</p>
                  {rule.duration && (
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="size-3" />
                      {rule.duration}s auto-off
                    </p>
                  )}
                </div>
              </div>

              {/* Sensor */}
              <div className="col-span-2 flex items-center">
                <Badge variant="outline" className="text-xs font-normal">
                  {sensorLabel}
                </Badge>
              </div>

              {/* Condition */}
              <div className="col-span-2 flex items-center text-sm text-text-secondary">
                {conditionLabel} {rule.threshold}{unit}
              </div>

              {/* Action */}
              <div className="col-span-2 flex items-center">
                <Badge variant="secondary" className="text-xs font-normal">
                  {actionLabel}
                </Badge>
              </div>

              {/* Enabled */}
              <div className="col-span-1 flex items-center">
                <Switch
                  size="sm"
                  checked={rule.enabled}
                  onCheckedChange={(checked) => onToggle(rule.id, checked)}
                />
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(rule)}
                  title="Edit rule"
                  className="h-8 w-8 text-text-muted hover:text-green-600 hover:bg-green-50">
                  <Pencil size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(rule.id)}
                  title="Delete rule"
                  className="h-8 w-8 text-text-muted hover:text-red-600 hover:bg-red-50">
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AutomationTable({
  rules,
  view,
  onToggle,
  onEdit,
  onDelete,
}: AutomationTableProps) {
  return view === "grid" ? (
    <GridView rules={rules} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
  ) : (
    <TableView rules={rules} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
  )
}
