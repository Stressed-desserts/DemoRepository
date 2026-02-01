"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Calendar, Star, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAuthStore from "@/stores/authStore"
import usePropertyStore from "@/stores/propertyStore"
import { useBookingStore } from "@/stores/bookingStore"
import { BookingRequestCard } from "@/components/owner/BookingRequestCard"
import { toast } from "sonner"
import "@/styles/dashboard-theme.css"

export default function OwnerDashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { 
    myProperties, 
    reviews, 
    fetchMyProperties
  } = usePropertyStore()
  
  const { 
    bookings, 
    fetchOwnerBookings, 
    acceptBooking, 
    rejectBooking 
  } = useBookingStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadData()
  }, [user, router])
  
  const loadData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([
        fetchMyProperties(),
        fetchOwnerBookings()
      ])
    } catch (error) {
      console.error('Failed to load data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAcceptBooking = async (bookingId: number) => {
    try {
      setIsLoading(true)
      await acceptBooking(bookingId)
      await fetchOwnerBookings() // Refresh the bookings list
      toast.success('Booking request accepted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept booking')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRejectBooking = async (bookingId: number) => {
    try {
      setIsLoading(true)
      await rejectBooking(bookingId)
      await fetchOwnerBookings() // Refresh the bookings list
      toast.success('Booking request rejected successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject booking')
    } finally {
      setIsLoading(false)
    }
  }

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Property Owner Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name || 'Owner'}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                useAuthStore.getState().logout()
                router.push('/login')
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Owner'}</h1>
            <p className="text-base text-slate-500 mb-6">Manage your commercial properties and track your business performance.</p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md" 
                onClick={() => router.push('/properties/new')}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Property
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
                onClick={() => router.push('/explore')}
              >
                Browse Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow p-6 flex flex-col items-center border border-blue-100">
                <div className="p-3 bg-blue-100 rounded-full mb-4"><Building2 className="h-6 w-6 text-blue-600" /></div>
                <div className="text-3xl font-bold text-slate-900">{myProperties.length}</div>
                <div className="text-sm font-medium text-slate-600 mt-2">Listed Properties</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 via-white to-green-50 rounded-2xl shadow p-6 flex flex-col items-center border border-green-100">
                <div className="p-3 bg-green-100 rounded-full mb-4"><Calendar className="h-6 w-6 text-green-600" /></div>
                <div className="text-3xl font-bold text-slate-900">{bookings.length}</div>
                <div className="text-sm font-medium text-slate-600 mt-2">Total Bookings</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-2xl shadow p-6 flex flex-col items-center border border-amber-100">
                <div className="p-3 bg-amber-100 rounded-full mb-4"><Star className="h-6 w-6 text-amber-600" /></div>
                <div className="text-3xl font-bold text-slate-900">{averageRating}<span className="text-sm font-normal text-slate-400">/5</span></div>
                <div className="text-sm font-medium text-slate-600 mt-2">Average Rating</div>
            </div>
        </section>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">
              <div className="flex items-center gap-2">
                <span>Booking Requests</span>
                {bookings.filter(b => b.status === 'PENDING').length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {bookings.filter(b => b.status === 'PENDING').length} New
                  </span>
                )}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-900">My Properties</h2>
                </div>
                <div className="p-6">
                  {myProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No properties yet</h3>
                      <p className="text-slate-500 mb-6">Add your first property to get started</p>
                      <Button onClick={() => router.push('/properties/new')} className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myProperties.slice(0, 5).map(property => (
                        <div key={property.id} className="group p-4 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => router.push(`/explore/${property.id}`)}>
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 relative">
                              {property.photoUrl ? (
                                <div className="h-16 w-16 rounded-lg overflow-hidden">
                                  <img 
                                    src={property.photoUrl} 
                                    alt={property.title} 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      // Fallback to default image if the image fails to load
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.src = '/placeholder-property.jpg';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${property.verified ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                  <Building2 className="h-5 w-5" />
                                </div>
                              )}
                              {!property.verified && (
                                <div className="absolute -top-1 -right-1 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">
                                  Pending
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-medium text-slate-900 truncate">{property.title}</h3>
                              <p className="text-xs text-slate-500 truncate">{property.address}, {property.city}</p>
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {property.verified ? 'Verified' : 'Pending Verification'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(property.price)}
                              </p>
                              <p className="text-xs text-slate-500">per month</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2></div>
                <div className="p-6">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No recent activity</h3>
                      <p className="text-slate-500">Your booking activity will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {bookings.slice(0, 5).map(booking => {
                        const property = myProperties.find(p => p.id === booking.property_id)
                        return (
                          <div key={booking.id} className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="flex-shrink-0 mt-1"><div className={`h-10 w-10 rounded-full flex items-center justify-center ${booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}><Calendar className="h-4 w-4" /></div></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-sm font-medium text-slate-900">{booking.status === 'ACCEPTED' ? 'Booking Confirmed' : booking.status === 'PENDING' ? 'Booking Request' : 'Booking Cancelled'}</h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{booking.status}</span>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">{property?.title || 'A property'} - {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}</p>
                              <p className="text-xs text-slate-500 mt-2">{new Date(booking.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-8">
            {bookings.filter(b => b.status === 'PENDING').length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No pending booking requests</h3>
                <p className="text-slate-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.filter(b => b.status === 'PENDING').map(booking => (
                  <BookingRequestCard key={booking.id} booking={booking} onAccept={handleAcceptBooking} onReject={handleRejectBooking}/>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
