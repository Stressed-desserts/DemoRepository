"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Building2, Mail, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthStore from "@/stores/authStore"
import { toast } from "sonner"

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CUSTOMER", "OWNER"])
})

type SignupData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "OWNER">("CUSTOMER")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "CUSTOMER"
    }
  })

  const onSubmit = async (data: SignupData) => {
    try {
      await signup(data)
      toast.success("Account created successfully!")
      router.push(data.role === "OWNER" ? "/dashboard/owner" : "/explore")
    } catch (error: any) {
      // Error is handled by the API interceptor
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-gray-600 mt-2">
              Join our platform to find or list commercial properties
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Type */}
            <div className="space-y-4">
              <Label>Account Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("CUSTOMER")
                    setValue("role", "CUSTOMER")
                  }}
                  className={`relative p-4 border rounded-xl text-left transition-all ${
                    selectedRole === "CUSTOMER"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User className="h-5 w-5 mb-2 text-blue-500" />
                  <div className="font-medium">Customer</div>
                  <div className="text-sm text-gray-600">Looking for space</div>
                  {selectedRole === "CUSTOMER" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("OWNER")
                    setValue("role", "OWNER")
                  }}
                  className={`relative p-4 border rounded-xl text-left transition-all ${
                    selectedRole === "OWNER"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Building2 className="h-5 w-5 mb-2 text-blue-500" />
                  <div className="font-medium">Property Owner</div>
                  <div className="text-sm text-gray-600">List your space</div>
                  {selectedRole === "OWNER" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  type="text"
                  className="pl-10"
                  placeholder="your Name"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image and content */}
      <div className="hidden lg:flex flex-1 bg-blue-600 text-white p-8 items-center justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            List Your Property or Find Your Next Business Location
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Whether you're a property owner looking to list your space or a
            business searching for the perfect location, we make the process
            simple, secure, and efficient.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <Building2 className="h-6 w-6" />
          </div>
          <div>
                <h3 className="font-semibold">Property Listings</h3>
                <p className="text-blue-100">1000+ verified properties</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <User className="h-6 w-6" />
          </div>
          <div>
                <h3 className="font-semibold">Active Users</h3>
                <p className="text-blue-100">2000+ satisfied customers</p>
              </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  )
}
