import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AutomationRule, CreateRuleInput } from "../types"
import { SENSOR_OPTIONS, CONDITION_OPTIONS, ACTION_OPTIONS } from "../types"

type CreateRuleModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateRuleInput) => Promise<void>
  rule?: AutomationRule | null
}

const defaultValues: CreateRuleInput = {
  name: "",
  sensor: "soilMoisture",
  condition: "below",
  threshold: 40,
  action: "pump_on",
  duration: null,
  cooldown: 300,
}

export default function CreateRuleModal({ open, onOpenChange, onSubmit, rule }: CreateRuleModalProps) {
  const [form, setForm] = useState<CreateRuleInput>(defaultValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rule) {
      setForm({
        name: rule.name,
        sensor: rule.sensor,
        condition: rule.condition,
        threshold: rule.threshold,
        action: rule.action,
        duration: rule.duration,
        cooldown: rule.cooldown,
      })
    } else {
      setForm(defaultValues)
    }
  }, [rule, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Rule" : "Create Rule"}</DialogTitle>
          <DialogDescription>
            {rule ? "Update the automation rule settings." : "Define a new automation rule for your sensors."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-text-primary">Rule Name</label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Auto Irrigate When Dry"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Sensor</label>
              <Select
                value={form.sensor}
                onValueChange={(val) => setForm({ ...form, sensor: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENSOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Condition</label>
              <Select
                value={form.condition}
                onValueChange={(val) => setForm({ ...form, condition: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="threshold" className="text-sm font-medium text-text-primary">Threshold</label>
              <Input
                id="threshold"
                type="number"
                step="0.1"
                value={form.threshold}
                onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Action</label>
              <Select
                value={form.action}
                onValueChange={(val) => setForm({ ...form, action: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium text-text-primary">Auto-off (seconds, optional)</label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={form.duration ?? ""}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value ? Number(e.target.value) : null })
                }
                placeholder="Leave empty for manual off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cooldown" className="text-sm font-medium text-text-primary">Cooldown (seconds)</label>
              <Input
                id="cooldown"
                type="number"
                min="60"
                value={form.cooldown}
                onChange={(e) => setForm({ ...form, cooldown: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
