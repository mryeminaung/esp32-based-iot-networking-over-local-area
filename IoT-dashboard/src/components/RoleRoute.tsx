import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/store/auth"
import type { Role } from "@/config/roles"

type RoleRouteProps = {
  allowedRoles: Role[]
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
