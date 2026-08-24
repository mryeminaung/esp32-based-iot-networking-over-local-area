import axios from "axios"

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

// ── Backend API client (for /api/users, etc.) ──

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const backendClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Attach token to every request
backendClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
backendClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip if not 401, or already retried, or is the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error)
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return backendClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { accessToken } = await refreshToken()
      localStorage.setItem(TOKEN_KEY, accessToken)
      processQueue(null, accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return backendClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem(TOKEN_KEY)
      // Redirect to login
      window.location.href = "/login"
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
