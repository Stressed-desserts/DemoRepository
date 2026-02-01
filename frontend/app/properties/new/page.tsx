"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, MapPin, Landmark, Globe, IndianRupee, Ruler, FileText, Home } from "lucide-react"
import useAuthStore from "@/stores/authStore"
import usePropertyStore from "@/stores/propertyStore"

export default function NewPropertyPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { createProperty } = usePropertyStore()
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    price: "",
    area: "",
    type: "OFFICE",
    latitude: "",
    longitude: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      await createProperty({
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        type: form.type as "OFFICE" | "SHOP" | "WAREHOUSE" | "LAND"
      })
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/owner'), 1200)
    } catch (err: any) {
      setError(err.message || "Failed to create property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex flex-col items-center justify-center py-12 px-4 pt-24">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-2xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-8 border border-blue-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none select-none">
            <Building2 className="w-40 h-40 text-blue-200" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-500" /> Add a New Property
          </h1>
          <p className="text-gray-500 mb-6">Fill in the details below to list your commercial property. Make it stand out!</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><FileText className="w-4 h-4" /> Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Modern Office Space" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><FileText className="w-4 h-4" /> Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the property, amenities, highlights..." className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 min-h-[90px]" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Landmark className="w-4 h-4" /> City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Landmark className="w-4 h-4" /> State</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Globe className="w-4 h-4" /> Country</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><IndianRupee className="w-4 h-4" /> Price (₹/mo)</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder="2500" type="number" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Ruler className="w-4 h-4" /> Area (sq ft)</label>
              <input name="area" value={form.area} onChange={handleChange} placeholder="e.g. 1200" type="number" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Home className="w-4 h-4" /> Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300">
                <option value="OFFICE">Office</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="SHOP">Shop</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Latitude</label>
              <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g. 28.6139" type="number" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Longitude</label>
              <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g. 77.2090" type="number" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300" required />
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
              {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm font-semibold">Property added! Redirecting...</motion.div>}
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
                {loading ? "Adding..." : <><Home className="w-5 h-5" /> Add Property</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
