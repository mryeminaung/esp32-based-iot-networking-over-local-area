import { useState, useEffect, useCallback, useMemo } from "react"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Bot, Search, RefreshCw } from "lucide-react"
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
import LoadingState from "@/components/LoadingState"
import EmptyState from "@/components/EmptyState"
import ErrorState from "@/components/ErrorState"

export default function AutomationPage() {
  useHeader("Automation")

  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    setLoading(true)
    setError(null)
    try {
      const data = await getRules()
      setRules(data)
    } catch {
      setError("Failed to load automation rules")
    } finally {
      setLoading(false)
    }
  }, [])

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
          size="lg"
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

      {error && (
        <ErrorState
          message={error}
          action={
            <button onClick={fetchRules} className="mt-2 inline-flex items-center gap-1.5 text-sm text-green hover:text-green/80">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          }
        />
      )}

      {loading ? (
        <LoadingState message="Loading rules..." />
      ) : rules.length === 0 ? (
        <EmptyState
          icon={<Bot className="w-12 h-12" />}
          title="No automation rules yet"
          description="Create a rule to automate device actions based on sensor readings."
          action={
            <Button
              size="lg"
              className="gap-1.5"
              onClick={() => {
                setEditingRule(null)
                setModalOpen(true)
              }}
            >
              <Plus className="size-4" />
              Create Rule
            </Button>
          }
        />
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
              <EmptyState
                icon={<Search className="w-10 h-10" />}
                title="No rules match your search"
              />
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
