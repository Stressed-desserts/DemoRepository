"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Building2,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import useAuthStore from "@/stores/authStore"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()

  // Don't show navbar on auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/reset-password")
  ) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">Urban Lease</span>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/explore"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Explore
            </Link>

            {user?.role === "OWNER" && (
              <Link
                href="/dashboard/owner"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/dashboard/owner"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                href="/dashboard/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/dashboard/admin"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Admin Dashboard
              </Link>
                    )}

            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard/profile" passHref legacyBehavior>
                    <DropdownMenuItem asChild>
                      <a>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          </div>
        </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
      >
            <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/explore"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              pathname === "/explore"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Explore
          </Link>

          {user?.role === "OWNER" && (
            <Link
              href="/dashboard/owner"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname === "/dashboard/owner"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname === "/dashboard/admin"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <>
              <div className="px-3 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
              <button
                    onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                Sign out
              </button>
                </>
              ) : (
                <>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="block px-3 py-2 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Get started
              </Link>
                </>
              )}
            </div>
      </motion.div>
    </nav>
  )
}
