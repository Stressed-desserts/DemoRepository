"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, Lock, ArrowRight } from "lucide-react"
import useAuthStore from "@/stores/authStore"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, isInitialized } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleSubmitForm = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success("Login successful!")
      const redirectPath =
        user?.role === "ADMIN" ? "/dashboard/admin" : user?.role === "OWNER" ? "/dashboard/owner" : "/explore"
      router.push(redirectPath)
    } catch (error: any) {
      toast.error(error?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isInitialized && user) {
      const redirectPath =
        user?.role === "ADMIN"
          ? "/dashboard/admin"
          : user?.role === "OWNER"
          ? "/dashboard/owner"
          : "/explore"
      router.push(redirectPath)
    }
  }, [isInitialized, user, router])

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24">
        <div className="max-w-sm w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-8">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">Urban Lease</span>
        </div>

            <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600 mb-8">
              Please enter your details to sign in
            </p>

            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 py-6"
                    {...register("email")}
                  />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Enter your password" 
                    className="pl-10 py-6"
                    {...register("password")}
                  />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-8">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-blue-600">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">

        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white max-w-lg"
          >
            <h2 className="text-3xl font-bold mb-6">
              Find Your Perfect Urban Lease
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of businesses who trust us to find their ideal commercial property. 
              Our platform makes it easy to discover, connect, and secure your next business location.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[
                  "/images/avatar1.jpg",
                  "/images/avatar2.jpg",
                  "/images/avatar3.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`User ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">Join 2,000+ businesses</div>
                <div className="text-blue-200">who trust our platform</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/images/testimonial-avatar.jpg"
                alt="Testimonial"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-white">Sarah Johnson</div>
                <div className="text-sm text-blue-200">Business Owner</div>
            </div>
          </div>
            <p className="text-blue-100 italic">
              "Finding our new office space was a breeze with Urban Lease. 
              The platform is intuitive, and the team was incredibly helpful throughout the process."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
