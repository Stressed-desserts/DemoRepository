"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Star, MapPin, Home, Layers, Bath, Bed, Building2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useAuthStore from "@/stores/authStore"
import dynamic from "next/dynamic"

const MapSingleProperty = dynamic(() => import("@/components/MapSingleProperty"), { ssr: false })

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [showBooking, setShowBooking] = useState(false)
  const [bookingStart, setBookingStart] = useState("")
  const [bookingEnd, setBookingEnd] = useState("")
  const [bookingMsg, setBookingMsg] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchProperty()
    fetchReviews()
    // eslint-disable-next-line
  }, [id])

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/api/properties/${id}`)
      console.log('Property data:', res.data) // Debug log
      setProperty(res.data)
    } catch (error) {
      console.error('Error fetching property:', error) // Debug log
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/properties/${id}/reviews`)
      console.log('Reviews data:', res.data) // Debug log
      setReviews(res.data)
    } catch (error) {
      console.error('Error fetching reviews:', error) // Debug log
      setReviews([])
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post(`/api/properties/${id}/reviews`, { rating, comment: reviewText })
      toast.success("Review added!")
      setReviewText("")
      setRating(5)
      fetchReviews()
    } catch {
      toast.error("Failed to add review")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert dates to Date objects for comparison
    const startDate = new Date(bookingStart)
    const endDate = new Date(bookingEnd)
    const today = new Date()
    
    // Reset time part to compare only dates
    today.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)
    
    // Validate dates
    if (startDate < today) {
      toast.error("Start date cannot be in the past")
      return
    }
    
    if (endDate < startDate) {
      toast.error("End date cannot be before start date")
      return
    }
    
    setBookingLoading(true)
    try {
      await api.post(`/api/bookings`, {
        propertyId: property.id,
        startDate: bookingStart,
        endDate: bookingEnd,
        status: 'PENDING',
        message: bookingMsg
      })
      toast.success("Booking request sent!")
      setShowBooking(false)
      setBookingStart("")
      setBookingEnd("")
      setBookingMsg("")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send booking request")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
  
  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => router.push('/explore')} 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3"
        >
          Browse Available Properties
        </Button>
      </div>
    </div>
  )

  // Helper function to get display name from user object or review
  const getDisplayName = (item: any) => {
    if (!item) return 'Anonymous User';
    if (item.user?.name) return item.user.name;
    if (item.reviewerName) return item.reviewerName;
    if (item.name) return item.name;
    return 'Anonymous User';
  };

  // Helper function to get owner info
  const getOwnerInfo = () => {
    if (!property) return { name: 'Property Owner', email: '', initial: 'U' };
    
    const owner = property.owner || {};
    const name = owner.name || property.ownerName || 'Property Owner';
    const email = owner.email || property.ownerEmail || '';
    const initial = name.charAt(0).toUpperCase();
    
    return { name, email, initial };
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    // Default to newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-10">
        <div className="flex flex-col lg:flex-row">
          {/* Property Image Gallery */}
          <div className="lg:w-1/2 w-full h-96 lg:h-[32rem] bg-gray-50 relative group">
            <img
              src={property.photoUrl || "/images/properties/office1.jpg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h1 className="text-3xl font-bold mb-1">{property.title}</h1>
              <div className="flex items-center text-yellow-400">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(Number(avgRating || 0)) ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                {avgRating && (
                  <span className="ml-2 text-white/90 text-sm">
                    {avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Property Details */}
          <div className="lg:w-1/2 w-full flex flex-col p-8 md:p-10">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-blue-700 mb-1">Area</div>
                  <div className="text-2xl font-bold text-gray-900">{property.area.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Square Feet</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-green-700 mb-1">Price</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Property</h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description || 'No description available for this property.'}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center"><Building2 className="h-5 w-5 text-blue-600 mr-2" /><span>{property.type}</span></div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm text-gray-600">
                        {property.address || 'Address not specified'}
                        {property.city && `, ${property.city}`}
                        {property.state && `, ${property.state}`}
                        {property.country && `, ${property.country}`}
                        {property.postalCode && ` (${property.postalCode})`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Listed By</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {getOwnerInfo().initial}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{getOwnerInfo().name}</h4>
                    {getOwnerInfo().email && (
                      <p className="text-sm text-gray-500">{getOwnerInfo().email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowBooking(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Book Now
                </Button>
              </div>
          </div>
        </div>
        <div className="p-8 md:p-10 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
            <div className="w-full h-64 rounded-2xl overflow-hidden shadow border">
              <MapSingleProperty
                latitude={property.latitude}
                longitude={property.longitude}
                title={property.title}
              />
            </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book This Property</DialogTitle>
            <DialogDescription>
              Please select your booking dates and add a message for the owner if you wish.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <Input 
                type="date" 
                value={bookingStart} 
                min={new Date().toISOString().split('T')[0]} // Set min to today
                onChange={e => {
                  setBookingStart(e.target.value)
                  // If end date is before new start date, clear it
                  if (e.target.value && bookingEnd && new Date(e.target.value) > new Date(bookingEnd)) {
                    setBookingEnd("")
                  }
                }} 
                required 
              />
            </div>
            <div>
              <label className="block font-medium mb-1">End Date</label>
              <Input 
                type="date" 
                value={bookingEnd} 
                min={bookingStart || new Date().toISOString().split('T')[0]} // Set min to start date or today
                onChange={e => setBookingEnd(e.target.value)} 
                disabled={!bookingStart} // Disable until start date is selected
                required 
              />
              {bookingStart && !bookingEnd && (
                <p className="text-sm text-gray-500 mt-1">Select an end date after {new Date(bookingStart).toLocaleDateString()}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Message (optional)</label>
              <Textarea value={bookingMsg} onChange={e => setBookingMsg(e.target.value)} rows={2} placeholder="Add a note for the owner..." />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={bookingLoading} className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl mt-2">
                {bookingLoading ? "Booking..." : "Book Now"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
            <Card className="rounded-3xl shadow-xl border border-gray-100">
                <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Reviews</CardTitle>
                <div className="mt-2">
                    <label className="mr-2 font-medium">Sort by:</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded px-2 py-1">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    </select>
                </div>
                </CardHeader>
                <CardContent>
                {sortedReviews.length === 0 ? (
                    <div className="text-gray-500">No reviews yet.</div>
                ) : (
                    <div className="space-y-6">
                    {sortedReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="font-semibold text-lg text-gray-900">
                            {getDisplayName(review)}
                          </div>
                        <div className="text-yellow-500 text-base mb-1">{"★".repeat(review.rating)}<span className="text-gray-300">{"★".repeat(5 - review.rating)}</span></div>
                        <div className="text-gray-700 text-base mb-1">{review.comment}</div>
                        <div className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="rounded-3xl shadow-xl border border-gray-100">
                <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Add a Review</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                    <label className="block font-medium mb-3">Rating</label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="text-3xl transition-colors duration-200 hover:scale-110"
                        >
                            <Star 
                            className={`h-8 w-8 ${
                                star <= (hoveredRating || rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                            />
                        </button>
                        ))}
                    </div>
                    </div>
                    <div>
                    <label className="block font-medium mb-1">Comment</label>
                    <Textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        rows={3}
                        placeholder="Write your review..."
                        required
                        className="rounded-xl px-4 py-3 text-base"
                    />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full rounded-xl text-lg py-3 bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
                    {submitting ? "Submitting..." : "Add Review"}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
