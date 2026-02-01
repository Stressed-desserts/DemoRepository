"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAuthStore from '@/stores/authStore'

const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password']

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized, token, user } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!isInitialized) return

    const isPublicPath = publicPaths.includes(pathname)
    const isExplore = pathname === '/explore'

    // Redirect to login if trying to access protected route without auth
    if (!token && !isPublicPath && !isExplore) {
      router.push('/login')
      return
    }

    // Redirect to appropriate dashboard if accessing public routes while logged in
    if (token && isPublicPath) {
      if (user?.role === 'OWNER') {
        router.push('/dashboard/owner')
      } else if (user?.role === 'ADMIN') {
        router.push('/dashboard/admin')
      } else {
        router.push('/explore')
      }
      return
    }

    // Role-based route protection
    if (token && user) {
      const ownerPaths = ['/dashboard/owner', '/dashboard/my-properties']
      const adminPaths = ['/dashboard/admin']
      const customerPaths = ['/dashboard', '/dashboard/favorites']

      if (
        (user.role === 'CUSTOMER' && (ownerPaths.some(p => pathname.startsWith(p)) || adminPaths.some(p => pathname.startsWith(p)))) ||
        (user.role === 'OWNER' && (customerPaths.some(p => pathname.startsWith(p)) || adminPaths.some(p => pathname.startsWith(p)))) ||
        (user.role === 'ADMIN' && (customerPaths.some(p => pathname.startsWith(p)) || ownerPaths.some(p => pathname.startsWith(p))))
      ) {
        router.push(user.role === 'OWNER' ? '/dashboard/owner' : user.role === 'ADMIN' ? '/dashboard/admin' : '/explore')
      }
    }
  }, [isInitialized, token, user, pathname, router])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return children
}
