import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ESP32_API_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
  headers: { "Content-Type": "application/json" },
})

export default apiClient
