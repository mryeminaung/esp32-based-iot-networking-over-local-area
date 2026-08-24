import { LayoutGrid, List, Search } from "lucide-react"
import { ALL_ROLES, roleLabels } from "../types"
import type { ViewMode } from "./UserTable"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
 <Input
 type="text"
 value={search}
 onChange={(e) => onSearchChange(e.target.value)}
 placeholder="Search by name or email..."
 className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
 />
 </div>

 {/* Role filter dropdown */}
 <Select
 value={roleFilter ?? "all"}
 onValueChange={(v) => onRoleFilterChange(v === "all" ? null : v)}>
 <SelectTrigger className="h-9 text-sm shrink-0">
 <SelectValue placeholder="All Roles">{roleFilter ? (roleLabels[roleFilter] || "All Roles") : "All Roles"}</SelectValue>
 </SelectTrigger>
 <SelectContent alignItemWithTrigger={false}>
 <SelectItem value="all">All Roles</SelectItem>
 {ALL_ROLES.map((r) => (
 <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
 ))}
 </SelectContent>
 </Select>

 {/* View toggle */}
 <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-bg-muted border border-border shrink-0">
 <Button
 variant="ghost"
 size="icon"
 onClick={() => onViewChange("grid")}
 title="Grid view"
 className={`h-8 w-8 ${
 view === "grid"
 ? "bg-bg-card text-text-primary shadow-sm"
 : "text-text-muted hover:text-text-primary"
 }`}>
 <LayoutGrid size={15} />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 onClick={() => onViewChange("table")}
 title="Table view"
 className={`h-8 w-8 ${
 view === "table"
 ? "bg-bg-card text-text-primary shadow-sm"
 : "text-text-muted hover:text-text-primary"
 }`}>
 <List size={15} />
 </Button>
 </div>
 </div>
 )
}
