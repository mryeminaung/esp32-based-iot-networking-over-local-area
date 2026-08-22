import { useAuthStore } from "@/store/use-auth-store"

const roleLabels: Record<string, string> = {
  farm_manager: "Farm Manager",
  farm_worker: "Farm Worker",
  technician: "Technician",
}

export default function AccountTab() {
  const { user } = useAuthStore()

  return (
    <div className="card space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Account Information
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Your account details and role information.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.email}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {roleLabels[user?.role || ""] || user?.role}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Member since</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>
      </div>
    </div>
  )
}
