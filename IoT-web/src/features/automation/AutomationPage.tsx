import { useState, useEffect, useCallback, useMemo } from "react"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Bot, Search } from "lucide-react"
import AutomationTable, { type ViewMode } from "./components/AutomationTable"
import AutomationToolbar from "./components/AutomationToolbar"
import CreateRuleModal from "./components/CreateRuleModal"
import {
  getRules,
  createRule,
  updateRule,
  deleteRule,
} from "./services/automation.service"
import type { AutomationRule, CreateRuleInput } from "./types"
import { useToastManager } from "@/components/ui/toast"

export default function AutomationPage() {
  useHeader("Automation")

  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
  const toast = useToastManager()

  // Filter/search
  const [search, setSearch] = useState("")
  const [sensorFilter, setSensorFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem("automation-view") as ViewMode) ?? "grid"
  )

  const handleViewChange = (v: ViewMode) => {
    setViewMode(v)
    localStorage.setItem("automation-view", v)
  }

  const fetchRules = useCallback(async () => {
    try {
      const data = await getRules()
      setRules(data)
    } catch {
      toast.add({ title: "Failed to load rules", type: "error" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
      const matchesSensor = !sensorFilter || r.sensor === sensorFilter
      return matchesSearch && matchesSensor
    })
  }, [rules, search, sensorFilter])

  const handleCreate = async (data: CreateRuleInput) => {
    try {
      await createRule(data)
      toast.add({ title: "Rule created", type: "success" })
      await fetchRules()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create rule"
      toast.add({ title: msg, type: "error" })
      throw err
    }
  }

  const handleEdit = async (data: CreateRuleInput) => {
    if (!editingRule) return
    try {
      await updateRule(editingRule.id, data)
      toast.add({ title: "Rule updated", type: "success" })
      setEditingRule(null)
      await fetchRules()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update rule"
      toast.add({ title: msg, type: "error" })
      throw err
    }
  }

  const handleToggle = async (id: number, enabled: boolean) => {
    try {
      await updateRule(id, { enabled })
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled } : r))
      )
      toast.add({
        title: enabled ? "Rule enabled" : "Rule disabled",
        type: "success",
      })
    } catch {
      toast.add({ title: "Failed to update rule", type: "error" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this rule?")) return
    try {
      await deleteRule(id)
      toast.add({ title: "Rule deleted", type: "success" })
      await fetchRules()
    } catch {
      toast.add({ title: "Failed to delete rule", type: "error" })
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <PageHeader
        title="Automation Rules"
        description="Configure automatic actions based on sensor readings"
      >
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setEditingRule(null)
            setModalOpen(true)
          }}
        >
          <Plus className="size-4" />
          Create Rule
        </Button>
      </PageHeader>

      {loading ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-text-muted">Loading rules...</p>
          </CardContent>
        </Card>
      ) : rules.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bot className="w-12 h-12 text-border mx-auto mb-3" />
            <p className="text-text-muted">No automation rules yet</p>
            <p className="text-xs text-text-muted mt-1">
              Create a rule to automate device actions based on sensor readings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-xl bg-bg-card overflow-hidden">
          <AutomationToolbar
            search={search}
            onSearchChange={setSearch}
            sensorFilter={sensorFilter}
            onSensorFilterChange={setSensorFilter}
            view={viewMode}
            onViewChange={handleViewChange}
          />

          <div className="p-0">
            {filteredRules.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-border mx-auto mb-3" />
                <p className="text-text-muted">No rules match your search</p>
              </div>
            ) : (
              <AutomationTable
                rules={filteredRules}
                view={viewMode}
                onToggle={handleToggle}
                onEdit={(r) => {
                  setEditingRule(r)
                  setModalOpen(true)
                }}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      )}

      <CreateRuleModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingRule(null)
        }}
        onSubmit={editingRule ? handleEdit : handleCreate}
        rule={editingRule}
      />
    </div>
  )
}
