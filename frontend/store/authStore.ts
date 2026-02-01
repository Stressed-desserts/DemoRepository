import { create } from "zustand"
import type { User } from "@/types"
import { getToken, getUser, setToken, setUser, clearAuth } from "@/lib/auth"
import api from "@/lib/api"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  initialize: () => {
    const token = getToken()
    const user = getUser()
    console.log('[AuthStore] initialize called. token:', token, 'user:', user)
    if (token && user) {
      set({ token, user, isAuthenticated: true })
    } else {
      set({ token: null, user: null, isAuthenticated: false })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await api.post("/api/auth/login", { email, password })
      const { token, user } = response.data
      setToken(token)
      setUser(user)
      console.log('[AuthStore] login: set token and user in localStorage', { token, user })
      set({ token, user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signup: async (data) => {
    set({ isLoading: true })
    try {
      // Transform frontend data format to backend format
      const signupData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      }
      await api.post("/api/auth/signup", signupData)
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchUser: async () => {
    try {
      const response = await api.get("/api/users/me")
      const user = response.data
      setUser(user)
      set({ user })
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  },

  logout: () => {
    clearAuth()
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
