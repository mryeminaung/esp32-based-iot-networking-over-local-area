import axios from "axios"

const TOKEN_KEY = "accessToken"

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
  headers: { "Content-Type": "application/json" },
})

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
