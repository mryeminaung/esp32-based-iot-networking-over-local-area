import type { User } from "./types"

interface DeleteUserDialogProps {
  user: User | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteUserDialog({ user, onClose, onConfirm }: DeleteUserDialogProps) {
  if (!user) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Delete User
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
