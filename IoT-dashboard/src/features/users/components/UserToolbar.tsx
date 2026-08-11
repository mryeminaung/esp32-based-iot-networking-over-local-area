import { Search } from "lucide-react"
import { ALL_ROLES } from "./types"

interface UserToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: string | null
  onRoleFilterChange: (role: string | null) => void
}

export default function UserToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UserToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="relative flex-1 w-full sm:w-auto">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onRoleFilterChange(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            roleFilter === null
              ? "bg-green-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}
