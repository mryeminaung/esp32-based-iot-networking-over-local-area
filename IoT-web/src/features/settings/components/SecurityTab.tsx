import { Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { changePassword } from "../services/setting.service"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SecurityTab() {
 const [currentPassword, setCurrentPassword] = useState("")
 const [newPassword, setNewPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")
 const [showCurrent, setShowCurrent] = useState(false)
 const [showNew, setShowNew] = useState(false)
 const [saving, setSaving] = useState(false)
 const [success, setSuccess] = useState<string | null>(null)
 const [error, setError] = useState<string | null>(null)

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError(null)
 setSuccess(null)

 if (newPassword !== confirmPassword) {
 setError("New passwords do not match")
 return
 }
 if (newPassword.length < 8) {
 setError("New password must be at least 8 characters")
 return
 }

 setSaving(true)
 try {
 await changePassword(currentPassword, newPassword)
 setSuccess("Password changed successfully")
 setCurrentPassword("")
 setNewPassword("")
 setConfirmPassword("")
 setTimeout(() => setSuccess(null), 3000)
 } catch (err: unknown) {
 const msg =
 (err as { response?: { data?: { message?: string } } })?.response?.data
 ?.message || "Failed to change password"
 setError(msg)
 } finally {
 setSaving(false)
 }
 }

 return (
 <Card className="space-y-5">
 <CardContent className="space-y-5">
 <div>
 <h2 className="text-base font-semibold text-text-primary">
 Security
 </h2>
 <p className="text-sm text-text-muted mt-0.5">
 Update your password to keep your account secure.
 </p>
 </div>

 {success && (
 <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
 {success}
 </div>
 )}
 {error && (
 <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-3">
 {/* Current password */}
 <div>
 <label className="block text-sm font-medium text-text-secondary mb-1.5">
 Current Password
 </label>
 <div className="relative">
 <Input
 type={showCurrent ? "text" : "password"}
 required
 value={currentPassword}
 onChange={(e) => setCurrentPassword(e.target.value)}
 className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm pr-10"
 />
 {showCurrent ? (
 <EyeOff
 onClick={() => setShowCurrent(false)}
 className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
 />
 ) : (
 <Eye
 onClick={() => setShowCurrent(true)}
 className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
 />
 )}
 </div>
 </div>

 {/* New password */}
 <div>
 <label className="block text-sm font-medium text-text-secondary mb-1.5">
 New Password
 </label>
 <div className="relative">
 <Input
 type={showNew ? "text" : "password"}
 required
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 minLength={8}
 className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm pr-10"
 />
 {showNew ? (
 <EyeOff
 onClick={() => setShowNew(false)}
 className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
 />
 ) : (
 <Eye
 onClick={() => setShowNew(true)}
 className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
 />
 )}
 </div>
 </div>

 {/* Confirm password */}
 <div>
 <label className="block text-sm font-medium text-text-secondary mb-1.5">
 Confirm New Password
 </label>
 <Input
 type="password"
 required
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 minLength={8}
 className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
 />
 </div>

 <Button
 type="submit"
 disabled={saving}
 className="flex items-center gap-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
 >
 {saving ? (
 <Loader2 size={14} className="animate-spin" />
 ) : (
 <Lock size={14} />
 )}
 {saving ? "Updating..." : "Update Password"}
 </Button>
 </form>
 </CardContent>
 </Card>
 )
}
