import axios from "axios"

const TOKEN_KEY = "accessToken"
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`

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

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — try refresh, then redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(
        `${API_BASE}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      const { accessToken } = data.data
      localStorage.setItem(TOKEN_KEY, accessToken)
      processQueue(null, accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = "/login"
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
