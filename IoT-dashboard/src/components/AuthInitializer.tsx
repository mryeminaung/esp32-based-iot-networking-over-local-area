import { useEffect } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { Loader2 } from "lucide-react"

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const { initialized, initialize } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return <>{children}</>
}
