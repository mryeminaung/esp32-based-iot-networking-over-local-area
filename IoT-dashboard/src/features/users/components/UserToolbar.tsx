import { LayoutGrid, List, Search } from "lucide-react"
import { ALL_ROLES } from "../types"
import type { ViewMode } from "./UserTable"

interface UserToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: string | null
  onRoleFilterChange: (role: string | null) => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}

export default function UserToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  view,
  onViewChange,
}: UserToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-border">
      {/* Search */}
      <div className="relative flex-1 w-full sm:w-auto">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
        />
      </div>

      {/* Role filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onRoleFilterChange(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            roleFilter === null
              ? "bg-accent text-white"
              : "bg-bg-muted text-text-muted hover:bg-border"
          }`}
        >
          All
        </button>
        {ALL_ROLES.map((r) => (
          <button
            key={r.value}
            onClick={() => onRoleFilterChange(roleFilter === r.value ? null : r.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              roleFilter === r.value
                ? "bg-accent text-white"
                : "bg-bg-muted text-text-muted hover:bg-border"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-bg-muted border border-border shrink-0">
        <button
          onClick={() => onViewChange("grid")}
          title="Grid view"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            view === "grid"
              ? "bg-bg-card text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <LayoutGrid size={15} />
        </button>
        <button
          onClick={() => onViewChange("table")}
          title="Table view"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            view === "table"
              ? "bg-bg-card text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <List size={15} />
        </button>
      </div>
    </div>
  )
}
