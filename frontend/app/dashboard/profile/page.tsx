"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Calendar, Clock, CheckCircle, MapPin, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/stores/authStore"
import usePropertyStore from "@/stores/propertyStore"
import { format } from "date-fns"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import { Booking } from "@/types"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { bookings, fetchMyBookings } = usePropertyStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadBookings()
  }, [user, router])

  const loadBookings = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      await fetchMyBookings()
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const upcomingBookings = bookings.filter((b: Booking) => new Date(b.endDate) >= new Date())
  const pastBookings = bookings.filter((b: Booking) => new Date(b.endDate) < new Date())

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {user?.name?.[0] || <User className="w-10 h-10" />}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-slate-600">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="text-rose-600 hover:bg-rose-50">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{bookings.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming Stays</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{upcomingBookings.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Past Stays</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{pastBookings.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Upcoming Stays</h2></div>
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                  <div className="p-8 text-center">Loading...</div>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                  <div key={booking.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{booking.property?.title}</h3>
                          <p className="text-sm text-slate-500 flex items-center mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-1.5" />
                              {booking.property?.address}
                          </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                          <div><p className="text-slate-500">From</p><p className="font-medium">{format(new Date(booking.startDate), 'MMM d, yyyy')}</p></div>
                          <div><p className="text-slate-500">To</p><p className="font-medium">{format(new Date(booking.endDate), 'MMM d, yyyy')}</p></div>
                          <div><p className="text-slate-500">Total</p><p className="font-medium">{formatPrice(booking.totalPrice || 0)}</p></div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {booking.status}
                          </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No upcoming stays</h3>
                  <p className="text-slate-500 mt-1">Your upcoming bookings will appear here</p>
                  <Button className="mt-4" onClick={() => router.push('/explore')}>Browse Properties</Button>
                </div>
              )}
            </div>
          </div>

          {pastBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Past Stays</h2></div>
              <div className="divide-y divide-slate-100">
                {pastBookings.slice(0, 3).map(booking => (
                  <div key={`past-${booking.id}`} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{booking.property?.title}</h3>
                        <p className="text-sm text-slate-500 flex items-center mt-1"><MapPin className="h-3.5 w-3.5 mr-1.5" />{booking.property?.address}</p>
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="text-sm"><p className="text-slate-500">Stayed</p><p className="font-medium">{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</p></div>
                          <div className="text-sm"><p className="text-slate-500">Total</p><p className="font-medium">{formatPrice(booking.totalPrice || 0)}</p></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Book Again</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pastBookings.length > 3 && (
                <div className="px-6 py-4 border-t border-slate-100 text-center">
                  <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">View all past stays ({pastBookings.length - 3} more)</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
