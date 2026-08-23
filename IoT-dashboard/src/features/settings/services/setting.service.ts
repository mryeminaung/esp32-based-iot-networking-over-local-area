import { backendClient } from "@/api/auth"

export type User = {
 id: number
 email: string
 name: string | null
 image: string | null
 role: string
 createdAt: string
}

export async function updateProfile(name: string): Promise<User> {
 const { data } = await backendClient.patch("/users/me", { name })
 return data.data.user
}

export async function uploadAvatar(file: File): Promise<User> {
 const formData = new FormData()
 formData.append("image", file)
 const { data } = await backendClient.post("/users/me/avatar", formData, {
 headers: { "Content-Type": "multipart/form-data" },
 })
 return data.data.user
}

export async function changePassword(
 currentPassword: string,
 newPassword: string
): Promise<void> {
 await backendClient.patch("/users/me/password", {
 currentPassword,
 newPassword,
 })
}
