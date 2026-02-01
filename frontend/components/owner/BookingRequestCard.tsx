import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar, User, MessageSquare, Check, X } from "lucide-react"
import type { Booking } from "@/types"
import { cn } from "@/lib/utils"

interface BookingRequestCardProps {
  booking: Booking
  onAccept: (id: number) => void
  onReject: (id: number) => void
}

// Helper function to safely parse and validate dates
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

export function BookingRequestCard({ booking, onAccept, onReject }: BookingRequestCardProps) {
  const startDate = parseDate(booking.start_date)
  const endDate = parseDate(booking.end_date)
  
  // Calculate days difference safely
  let days = 1
  if (startDate && endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime()
    days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) || 1
  }
  
  // Calculate months (round up to nearest month)
  const months = Math.ceil(days / 30.0)
  
  // Use backend's total_price if available, otherwise calculate
  const totalPrice = booking.total_price || (months * (booking.property?.price || 0))
  
  // Format date safely
  const formatDate = (date: Date | null) => {
    if (!date) return 'Invalid date'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="border rounded-lg overflow-hidden border-slate-200 hover:shadow-md transition-shadow bg-white">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-slate-900">{booking.property?.title || 'Property'}</h3>
            <p className="text-sm text-slate-500">{booking.property?.address}</p>
          </div>
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            booking.status === 'PENDING' && "bg-yellow-100 text-yellow-800",
            booking.status === 'ACCEPTED' && "bg-green-100 text-green-800",
            booking.status === 'REJECTED' && "bg-red-100 text-red-800",
            booking.status === 'COMPLETED' && "bg-blue-100 text-blue-800"
          )}>
            {booking.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-600">
            <User className="h-4 w-4 mr-2 text-slate-400" />
            <span>Booked by: {booking.user?.name || 'Guest'}</span>
          </div>
          
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
              <span className="hidden sm:inline">•</span>
              <span>{days} {days === 1 ? 'day' : 'days'}</span>
            </div>
          </div>

          {booking.message && (
            <div className="flex items-start text-sm text-slate-600">
              <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
              <span className="break-words">Message: {booking.message}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Total:</span>
              <span className="font-medium text-slate-900">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(totalPrice)}
                <span className="text-slate-500 text-xs ml-1">({months} {months === 1 ? 'month' : 'months'})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {booking.status === 'PENDING' && (
        <div className="bg-slate-50 px-4 py-3 flex justify-end space-x-2 border-t border-slate-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => onReject(booking.id)}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onAccept(booking.id)}
          >
            <Check className="h-4 w-4 mr-1" /> Accept
          </Button>
        </div>
      )}
    </div>
  )
}
