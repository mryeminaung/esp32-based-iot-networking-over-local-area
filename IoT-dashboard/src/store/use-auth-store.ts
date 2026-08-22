import { create } from "zustand"
import {
  type User,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
} from "@/api/auth"

type AuthState = {
  user: User | null
  accessToken: string | null
  initialized: boolean
  loading: boolean
  error: string | null
}

type AuthActions = {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
}

const TOKEN_KEY = "accessToken"

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  accessToken: getStoredToken(),
  initialized: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { user, accessToken } = await apiLogin(email, password)
      storeToken(accessToken)
      set({ user, accessToken, loading: false })
    } catch (err: unknown) {
      clearStoredToken()
      const message =
        err instanceof Error ? err.message : "Login failed"
      // Extract API error message if available
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || message
      set({ user: null, accessToken: null, loading: false, error: apiMessage })
      throw err
    }
  },

  logout: async () => {
    try {
      await apiLogout()
    } catch {
      // ignore logout errors — clear local state regardless
    }
    clearStoredToken()
    set({ user: null, accessToken: null })
  },

  initialize: async () => {
    const token = getStoredToken()
    if (!token) {
      set({ initialized: true })
      return
    }
    try {
      const user = await getCurrentUser()
      set({ user, accessToken: token, initialized: true })
    } catch {
      clearStoredToken()
      set({ user: null, accessToken: null, initialized: true })
    }
  },

  setUser: (user) => set({ user }),
  setAccessToken: (token) => {
    storeToken(token)
    set({ accessToken: token })
  },
  clearAuth: () => {
    clearStoredToken()
    set({ user: null, accessToken: null })
  },
}))
