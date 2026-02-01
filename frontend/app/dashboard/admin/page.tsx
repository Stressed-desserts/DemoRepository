"use client"

import { useState, useEffect, Fragment } from "react"
import "@/styles/dashboard-theme.css"
import { useRouter } from "next/navigation"
import { Building2, Users, AlertTriangle, MapPin, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAuthStore from "@/stores/authStore"
import usePropertyStore from "@/stores/propertyStore"
import { toast } from "sonner"
import api from "@/lib/api"
import { Property } from "@/types"
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { properties, isLoading } = usePropertyStore()
  
  const [isVerifying, setIsVerifying] = useState<number | null>(null)
  const [expandedProperty, setExpandedProperty] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const fetchAllProperties = async () => {
    try {
      // Use the admin endpoint to get all properties with owner information
      console.log('Fetching properties from /api/admin/properties...');
      const response = await api.get('/api/admin/properties');
      console.log('Properties response:', response.data);
      
      usePropertyStore.setState({ 
        properties: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      console.error(error?.response?.data?.message)
      usePropertyStore.setState({ isLoading: false });
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchAllProperties()
  }, [user, router])

  const handleVerifyProperty = async (propertyId: number, verified: boolean) => {
    setIsVerifying(propertyId)
    try {
      await api.patch(`/api/properties/${propertyId}/verify`, { verified })
      toast.success(`Property ${verified ? "verified" : "unverified"} successfully`)
      usePropertyStore.setState(state => ({
        properties: state.properties.map(p => 
          p.id === propertyId ? { ...p, verified } : p
        )
      }))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update property verification")
    } finally {
      setIsVerifying(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "OFFICE": return "bg-blue-100 text-blue-800 border-blue-200"
      case "SHOP": return "bg-green-100 text-green-800 border-green-200"
      case "WAREHOUSE": return "bg-orange-100 text-orange-800 border-orange-200"
      case "LAND": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const uniqueOwners = new Set(properties.filter(p => p.owner?.id).map(p => p.owner.id)).size
  const unverifiedCount = properties.filter((p) => !p.verified).length

  const filteredProperties = properties.filter(property => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchLower) ||
      (property.address && property.address.toLowerCase().includes(searchLower)) ||
      (property.city && property.city.toLowerCase().includes(searchLower))
    const matchesType = !selectedType || property.type === selectedType
    return matchesSearch && matchesType
  })

  if (!user) return null

  const renderPropertyDetails = (property: any) => {
    // Safely access owner information with fallbacks
    const ownerName = property.owner?.name || property.ownerName || 'N/A';
    const ownerEmail = property.owner?.email || property.ownerEmail || 'N/A';
    
    return (
      <TableRow className="bg-slate-50 hover:bg-slate-50">
        <TableCell colSpan={7} className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Property Details</h4>
                <div className="space-y-3 text-sm text-gray-600 border p-4 rounded-lg bg-white">
                  <p><strong className="text-gray-700">Description:</strong> {property.description }</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                    <p><strong className="text-gray-700">Type:</strong> {property.type}</p>
                    <p><strong className="text-gray-700">Area:</strong> {property.area} sq ft</p>
                    <p><strong className="text-gray-700">Owner:</strong> {ownerName}</p>
                    <p><strong className="text-gray-700">Email:</strong> {ownerEmail}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                <div className="space-y-2 text-sm text-gray-600 border p-4 rounded-lg bg-white">
                  <p>{property.address || 'N/A'}, {property.city || 'N/A'}</p>
                  <p>{property.state || 'N/A'}, {property.country || 'N/A'}</p>
                  {property.latitude && property.longitude && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600"
                      asChild
                    >
                      <a 
                        href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center"
                      >
                        <MapPin className="h-4 w-4 mr-1" /> View on Map
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {property.photoUrl && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 mb-2">Image</h4>
                <div className="aspect-video overflow-hidden rounded-lg border bg-white">
                  <img 
                    src={property.photoUrl} 
                    alt={property.title} 
                    className="h-full w-full object-cover" 
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg' }} 
                  />
                </div>
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <Button variant="ghost" size="sm" onClick={() => { useAuthStore.getState().logout(); router.push('/login'); }}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="w-full mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-base text-slate-500">Manage all properties, owners, and verifications.</p>
        </section>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="properties" className="mt-6">
            <div className="space-y-6">
              <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-slate-100"><div className="p-4 bg-blue-100 rounded-full"><Building2 className="h-7 w-7 text-blue-600" /></div><div><div className="text-3xl font-bold text-slate-900">{properties.length}</div><div className="text-sm font-medium text-slate-600">Total Properties</div></div></div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-slate-100"><div className="p-4 bg-green-100 rounded-full"><Users className="h-7 w-7 text-green-600" /></div><div><div className="text-3xl font-bold text-slate-900">{uniqueOwners}</div><div className="text-sm font-medium text-slate-600">Unique Owners</div></div></div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-slate-100"><div className="p-4 bg-orange-100 rounded-full"><AlertTriangle className="h-7 w-7 text-orange-600" /></div><div><div className="text-3xl font-bold text-slate-900">{unverifiedCount}</div><div className="text-sm font-medium text-slate-600">Pending Verifications</div></div></div>
              </section>

              <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <Input placeholder="Search by title, address, or city..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="max-w-xs bg-slate-50" />
                  <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400" value={selectedType || ''} onChange={e => setSelectedType(e.target.value || null)}>
                    <option value="">All Types</option>
                    <option value="OFFICE">Office</option>
                    <option value="SHOP">Shop</option>
                    <option value="WAREHOUSE">Warehouse</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-x-auto">
                {isLoading ? (
                  <div className="text-center py-20">Loading...</div>
                ) : filteredProperties.length === 0 ? (
                  <div className="text-center py-20"><h3 className="text-lg font-medium">No properties found</h3><p className="text-slate-500">Try adjusting your search or filters.</p></div>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Property</TableHead><TableHead>Type</TableHead><TableHead>Location</TableHead><TableHead>Area</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <Fragment key={property.id}>
                          <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedProperty(expandedProperty === property.id ? null : property.id)}>
                            <TableCell><div className="flex items-center gap-2"><span className="transition-transform" style={{ transform: expandedProperty === property.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>►</span><div><p className="font-medium">{property.title}</p><p className="text-sm text-gray-600">{property.owner?.name }</p></div></div></TableCell>
                            <TableCell><Badge className={getTypeColor(property.type)}>{property.type}</Badge></TableCell>
                            <TableCell>{property.address}, {property.city}</TableCell>
                            <TableCell>{property.area.toLocaleString()} sq ft</TableCell>
                            <TableCell className="font-medium">{formatPrice(property.price)}</TableCell>
                            <TableCell><Badge variant={property.verified ? "default" : "secondary"}>{property.verified ? "Verified" : "Pending"}</Badge></TableCell>
                            <TableCell><div className="flex space-x-2" onClick={e => e.stopPropagation()}>{property.verified ? (<Button variant="outline" size="sm" onClick={() => handleVerifyProperty(property.id, false)} disabled={isVerifying === property.id} className="text-xs h-8">Unverify</Button>) : (<Button size="sm" onClick={() => handleVerifyProperty(property.id, true)} disabled={isVerifying === property.id} className="text-xs h-8 bg-green-600 hover:bg-green-700">{isVerifying === property.id ? '...' : 'Verify'}</Button>)}</div></TableCell>
                          </TableRow>
                          {expandedProperty === property.id && renderPropertyDetails(property)}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
