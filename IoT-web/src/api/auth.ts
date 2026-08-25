import axios from "axios"
import apiClient from "./client"

// Re-export the single client for backward compatibility
export const backendClient = apiClient

export type User = {
  id: number
  email: string
  name: string | null
  image: string | null
  role: string
  createdAt: string
}

type LoginResponse = {
  success: boolean
  message: string
  data: { user: User; accessToken: string }
}

type MeResponse = {
  success: boolean
  data: { user: User }
}

const TOKEN_KEY = "accessToken"

// ── Auth client (for /api/auth endpoints) ──

const authClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; accessToken: string }> {
  const { data } = await authClient.post<LoginResponse>("/login", {
    email,
    password,
  })
  return data.data
}

export async function logout(): Promise<void> {
  await authClient.post("/logout")
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  const { data } = await authClient.post<{ success: boolean; data: { accessToken: string } }>(
    "/refresh",
  )
  return data.data
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await authClient.get<MeResponse>("/me")
  return data.data.user
}

