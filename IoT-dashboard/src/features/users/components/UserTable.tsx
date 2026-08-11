import { Pencil, Trash2 } from "lucide-react"
import type { User } from "./types"
import { roleBadgeColors, roleLabels } from "./types"
import UserAvatar from "./UserAvatar"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100 dark:border-gray-800">
          <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2.5">
            User
          </th>
          <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2.5">
            Role
          </th>
          <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2.5">
            Created
          </th>
          <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2.5">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td className="px-4 py-2.5">
              <div className="flex items-center gap-3">
                <UserAvatar name={user.name} email={user.email} imageUrl={user.image} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name || "—"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-4 py-2.5">
              <span
                className={`inline-block text-[0.7rem] font-semibold px-2 py-0.5 rounded-full ${
                  roleBadgeColors[user.role] || "bg-gray-100 text-gray-600"
                }`}
              >
                {roleLabels[user.role] || user.role}
              </span>
            </td>
            <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-2.5">
              {user.role !== "farm_manager" && (
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    title="Edit user"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete user"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
