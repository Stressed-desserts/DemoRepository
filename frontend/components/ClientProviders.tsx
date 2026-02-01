"use client"

import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import AuthWrapper from "@/components/AuthWrapper"

export default function ClientProviders({
  children
}: {
  children: React.ReactNode
}) {
  // Remove server-side injected CSS
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <AuthWrapper>
      <Navbar />
      {children}
    </AuthWrapper>
  )
} 