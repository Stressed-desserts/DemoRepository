import type { User } from "@/types"

export const setToken = (token: string) => {
  localStorage.setItem("token", token)
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const removeToken = () => {
  localStorage.removeItem("token")
}

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  if (!user || user === "undefined") return null
  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export const removeUser = () => {
  localStorage.removeItem("user")
}

export const clearAuth = () => {
  removeToken()
  removeUser()
}
