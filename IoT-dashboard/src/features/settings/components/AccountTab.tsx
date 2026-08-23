import { useAuthStore } from "@/store/use-auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const roleLabels: Record<string, string> = {
 farm_manager: "Farm Manager",
 farm_worker: "Farm Worker",
 technician: "Technician",
}

export default function AccountTab() {
 const { user } = useAuthStore()

 return (
 <Card className="space-y-5">
 <CardContent className="space-y-5">
 <div>
 <h2 className="text-base font-semibold text-text-primary">
 Account Information
 </h2>
 <p className="text-sm text-text-muted mt-0.5">
 Your account details and role information.
 </p>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between py-3">
 <span className="text-sm text-text-muted">Email</span>
 <span className="text-sm font-medium text-text-primary">
 {user?.email}
 </span>
 </div>
 <Separator />
 <div className="flex items-center justify-between py-3">
 <span className="text-sm text-text-muted">Role</span>
 <span className="text-sm font-medium text-text-primary">
 {roleLabels[user?.role || ""] || user?.role}
 </span>
 </div>
 <Separator />
 <div className="flex items-center justify-between py-3">
 <span className="text-sm text-text-muted">Member since</span>
 <span className="text-sm font-medium text-text-primary">
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
 </CardContent>
 </Card>
 )
}
