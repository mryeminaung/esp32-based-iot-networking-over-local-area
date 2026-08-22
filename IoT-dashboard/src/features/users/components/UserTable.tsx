import { Pencil, Trash2, Calendar } from "lucide-react"
import type { User } from "../types"
import { roleBadgeColors, roleLabels } from "../types"
import UserAvatar from "./UserAvatar"

export type ViewMode = "grid" | "table"

interface UserTableProps {
  users: User[]
  view: ViewMode
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}


function ActionButtons({ user, onEdit, onDelete }: { user: User; onEdit: (u: User) => void; onDelete: (u: User) => void }) {
  if (user.role === "farm_manager") return null
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onEdit(user)}
        title="Edit user"
        className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-light transition-colors cursor-pointer"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={() => onDelete(user)}
        title="Delete user"
        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function GridView({ users, onEdit, onDelete }: Omit<UserTableProps, "view">) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 p-4 rounded-xl bg-bg-muted border border-border hover:border-border-strong transition-colors"
        >
          <div className="flex items-start gap-3">
            <UserAvatar name={user.name} email={user.email} imageUrl={user.image} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary truncate">
                {user.name || "—"}
              </p>
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            </div>
          </div>

          <span
            className={`self-start text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full ${
              roleBadgeColors[user.role] || "bg-bg-card text-text-muted"
            }`}
          >
            {roleLabels[user.role] || user.role}
          </span>

          <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
            <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted">
              <Calendar size={11} />
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <ActionButtons user={user} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TableView({ users, onEdit, onDelete }: Omit<UserTableProps, "view">) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wide">
              User
            </th>
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wide">
              Role
            </th>
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wide hidden sm:table-cell">
              Joined
            </th>
            <th className="text-right text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border last:border-0 hover:bg-bg-muted transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} email={user.email} imageUrl={user.image} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {user.name || "—"}
                    </p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full ${
                    roleBadgeColors[user.role] || "bg-bg-card text-text-muted"
                  }`}
                >
                  {roleLabels[user.role] || user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-text-muted hidden sm:table-cell">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <ActionButtons user={user} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function UserTable({ users, view, onEdit, onDelete }: UserTableProps) {
  return view === "grid"
    ? <GridView users={users} onEdit={onEdit} onDelete={onDelete} />
    : <TableView users={users} onEdit={onEdit} onDelete={onDelete} />
}
