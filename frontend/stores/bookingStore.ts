import { create } from 'zustand'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Booking } from '@/types'

interface BookingState {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  createBooking: (propertyId: number, startDate: string, endDate: string) => Promise<void>
  fetchMyBookings: () => Promise<void>
  fetchOwnerBookings: () => Promise<void>
  acceptBooking: (bookingId: number) => Promise<void>
  rejectBooking: (bookingId: number) => Promise<void>
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  createBooking: async (propertyId, startDate, endDate) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/api/bookings', {
        propertyId,
        startDate,
        endDate,
        status: 'PENDING'
      })
      toast.success('Booking request sent!')
      await get().fetchMyBookings()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create booking', isLoading: false })
      toast.error(error.response?.data?.message || 'Failed to create booking')
      throw error
    }
  },

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/api/bookings/me')
      set({ bookings: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch bookings', isLoading: false })
      toast.error(error.response?.data?.message || 'Failed to fetch bookings')
      throw error
    }
  },

  fetchOwnerBookings: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/api/bookings/owner')
      set({ bookings: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch owner bookings', isLoading: false })
      toast.error(error.response?.data?.message || 'Failed to fetch owner bookings')
      throw error
    }
  },

  acceptBooking: async (bookingId) => {
    set({ isLoading: true, error: null })
    try {
      await api.put(`/api/bookings/${bookingId}/accept`)
      toast.success('Booking accepted!')
      await get().fetchOwnerBookings()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to accept booking', isLoading: false })
      toast.error(error.response?.data?.message || 'Failed to accept booking')
      throw error
    }
  },

  rejectBooking: async (bookingId) => {
    set({ isLoading: true, error: null })
    try {
      await api.put(`/api/bookings/${bookingId}/reject`)
      toast.success('Booking rejected!')
      await get().fetchOwnerBookings()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to reject booking', isLoading: false })
      toast.error(error.response?.data?.message || 'Failed to reject booking')
      throw error
    }
  }
}))




