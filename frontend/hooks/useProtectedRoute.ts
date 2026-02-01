"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./useAuth"

export const useProtectedRoute = (allowedRoles?: string[]) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/explore")
        return
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router])

  return { isAuthenticated, user, isLoading }
}
