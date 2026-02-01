"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Eye, Pencil, Trash2, Image as ImageIcon } from "lucide-react"
import { PropertyForm } from "@/components/PropertyForm"

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = getUser()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  const fetchProperties = async () => {
    if (!user) return;
    try {
      const res = await api.get("/api/properties/my-properties")
      setProperties(res.data)
    } catch (err: any) {
      setError("Failed to fetch properties.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.replace("/login")
      return
    }
    fetchProperties()
  }, [user, router])

  if (!user) return null

  if (loading) return <div className="p-8">Loading your properties...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">My Properties</h1>
        <Button onClick={() => setShowForm((v) => !v)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 text-lg shadow-md transition-all flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Add Property
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{properties.length}</div>
          <div className="text-gray-500 text-base">Total Properties</div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{properties.filter(p => p.verified).length}</div>
          <div className="text-gray-500 text-base">Verified</div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-yellow-600 mb-1">{properties.filter(p => !p.verified).length}</div>
          <div className="text-gray-500 text-base">Pending</div>
        </div>
      </div>
      {showForm && (
        <div className="mb-8">
          <PropertyForm onSuccess={() => { setShowForm(false); setLoading(true); fetchProperties(); }} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.length === 0 ? (
          <div className="text-gray-500 col-span-full text-center text-lg">You do not own any properties yet.</div>
        ) : (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>
    </div>
  )
} 