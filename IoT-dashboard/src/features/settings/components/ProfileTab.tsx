import { Loader2, Camera, Save } from "lucide-react"
import { useState, useRef } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import UserAvatar from "@/features/users/components/UserAvatar"
import { updateProfile, uploadAvatar } from "../services/setting.service"

export default function ProfileTab() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name || "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError("Avatar must be less than 2MB")
      return
    }

    setUploadingAvatar(true)
    setError(null)
    try {
      const updatedUser = await uploadAvatar(file)
      setUser(updatedUser)
      setSuccess("Avatar updated")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload avatar"
      setError(msg)
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const updatedUser = await updateProfile(name)
      setUser(updatedUser)
      setSuccess("Profile updated successfully")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile"
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Profile
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your avatar and display name.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-lg px-4 py-3">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <UserAvatar
            name={user?.name || null}
            email={user?.email || ""}
            imageUrl={user?.image}
            size="lg"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer disabled:cursor-not-allowed"
          >
            {uploadingAvatar ? (
              <Loader2 size={18} className="text-white animate-spin" />
            ) : (
              <Camera size={18} className="text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || "No name set"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
          <p className="text-[0.65rem] text-gray-400 dark:text-gray-500 mt-1">
            Click avatar to change. Max 2MB. JPG, PNG, GIF, WebP.
          </p>
        </div>
      </div>

      {/* Name form */}
      <form onSubmit={handleSave} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
