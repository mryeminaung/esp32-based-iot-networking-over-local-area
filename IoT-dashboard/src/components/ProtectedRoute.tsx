import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/store/auth"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute() {
  const { user, initialized } = useAuthStore()

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
