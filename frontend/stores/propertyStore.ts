import { create } from 'zustand'
import api from '@/lib/api'
import type { Property, PropertyRequest, Review, Booking } from '@/types'
import { toast } from 'sonner'
import useAuthStore from './authStore' // Import the auth store

interface PropertyState {
  properties: Property[]
  myProperties: Property[]
  selectedProperty: Property | null
  bookings: Booking[]
  reviews: Review[]
  isLoading: boolean
  error: string | null

  // Properties
  fetchProperties: (search?: string) => Promise<void>
  fetchMyProperties: () => Promise<void>
  fetchPropertyById: (id: number) => Promise<Property | undefined>
  createProperty: (data: PropertyRequest) => Promise<Property | undefined>
  setSelectedProperty: (property: Property | null) => void

  // Reviews
  addReview: (propertyId: number, rating: number, comment: string) => Promise<void>
  fetchReviews: (propertyId: number) => Promise<void>

  // Bookings
  createBooking: (propertyId: number, startDate: string, endDate: string) => Promise<Booking>
  fetchMyBookings: () => Promise<Booking[]>
  fetchOwnerBookings: () => Promise<Booking[]>
  acceptBooking: (bookingId: number) => Promise<Booking>

  clearError: () => void
}

const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  myProperties: [],
  selectedProperty: null,
  bookings: [],
  reviews: [],
  isLoading: false,
  error: null,

  // Properties
  fetchProperties: async (search?: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.get<Property[]>('/api/properties', {
        params: search ? { search } : undefined
      })
      set({ properties: response.data, isLoading: false })
    } catch (error: any) {
      const errorMessage = 'We had trouble loading properties. Please check your internet connection and try again.'
      set({
        error: errorMessage,
        isLoading: false
      })
      toast.error(errorMessage)
      console.error('Error fetching properties:', error)
      throw new Error(errorMessage)
    }
  },
  fetchMyProperties: async () => {
    try {
      // Get the current user from the auth store
      const { user } = useAuthStore.getState();

      // Prevent API call if the user is an ADMIN
      if (user?.role === 'ADMIN') {
        set({ myProperties: [], isLoading: false });
        return;
      }

      set({ isLoading: true, error: null });
      const response = await api.get<Property[]>('/api/properties/my-properties');
      set({ myProperties: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = 'We couldn\'t load your properties. Please refresh the page and try again.';
      set({
        error: errorMessage,
        isLoading: false
      });
      toast.error(errorMessage);
      console.error('Error fetching user properties:', error);
      throw new Error(errorMessage);
    }
  },
  fetchPropertyById: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Property>(`/api/properties/${id}`);
      set({ selectedProperty: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.status === 404 
        ? 'The property you\'re looking for cannot be found. It may have been removed.'
        : 'We couldn\'t load the property details. Please try again later.';
      
      set({
        error: errorMessage,
        isLoading: false
      });
      toast.error(errorMessage);
      console.error('Error fetching property by ID:', error);
      throw new Error(errorMessage);
    }
  },
  createProperty: async (data: PropertyRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<Property>('/api/properties', data);
      
      set(state => ({ 
        myProperties: [...state.myProperties, response.data],
        isLoading: false 
      }));
      
      toast.success('Property created successfully!');
      return response.data;
    } catch (error: any) {
      let errorMessage = 'We couldn\'t create your property. ';
      
      if (error.response?.status === 400) {
        errorMessage = 'Please check all the property details and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You need to be signed in to add a property.';
      } else if (error.response?.data?.message?.toLowerCase().includes('validation')) {
        errorMessage = 'Please check all the property details and try again.';
      } else {
        errorMessage += 'Please try again in a few minutes.';
      }
      
      set({
        error: errorMessage,
        isLoading: false
      });
      
      toast.error(errorMessage);
      console.error('Error creating property:', error);
      throw new Error(errorMessage);
    }
  },
  setSelectedProperty: (property: Property | null) => set({ selectedProperty: property }),

  // Reviews
  addReview: async (propertyId: number, rating: number, comment: string) => {
    try {
      set({ isLoading: true, error: null })
      await api.post(`/api/properties/${propertyId}/reviews`, { rating, comment })
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = 'We couldn\'t add your review. Please try again.';
      set({
        error: errorMessage,
        isLoading: false
      })
      toast.error(errorMessage);
      console.error('Error adding review:', error);
      throw new Error(errorMessage);
    }
  },
  fetchReviews: async (propertyId: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.get<Review[]>(`/api/properties/${propertyId}/reviews`)
      set({ reviews: response.data, isLoading: false })
    } catch (error: any) {
      const errorMessage = 'We couldn\'t load the reviews. Please try refreshing the page.';
      set({
        error: errorMessage,
        isLoading: false
      })
      toast.error(errorMessage);
      console.error('Error fetching reviews:', error);
      throw new Error(errorMessage);
    }
  },

  // Bookings
  createBooking: async (propertyId: number, startDate: string, endDate: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Client-side validations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Reset time portions for accurate date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Date validations
      if (start < today) {
        throw new Error('Start date cannot be in the past.');
      }
      
      if (end < start) {
        throw new Error('End date must be after start date.');
      }
      
      // Maximum booking period: 1 year
      const maxDate = new Date(today);
      maxDate.setFullYear(today.getFullYear() + 1);
      
      if (end > maxDate) {
        throw new Error('Bookings can only be made up to one year in advance.');
      }
      
      // Minimum booking duration: 1 day
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const diffDays = Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay)) + 1;
      
      if (diffDays < 1) {
        throw new Error('Minimum booking duration is 1 day.');
      }
      
      // Maximum booking duration: 30 days
      if (diffDays > 30) {
        throw new Error('Maximum booking duration is 30 days.');
      }
      
      const response = await api.post<Booking>('/api/bookings', {
        propertyId,
        startDate: start.toISOString().split('T')[0], // Ensure YYYY-MM-DD format
        endDate: end.toISOString().split('T')[0]     // Ensure YYYY-MM-DD format
      });
      
      set(state => ({
        bookings: [...state.bookings, response.data],
        isLoading: false
      }));
      
      toast.success('Booking created successfully!');
      return response.data;
      
    } catch (error: any) {
      let errorMessage = 'Failed to create booking. ';
      
      // Handle validation errors
      if (error instanceof Error) {
        errorMessage = error.message;
      } 
      // Handle API errors
      else if (error.response?.status === 400) {
        if (error.response.data?.message?.toLowerCase().includes('already booked')) {
          errorMessage = 'The selected dates are not available. Please choose different dates.';
        } else if (error.response.data?.message?.toLowerCase().includes('invalid date')) {
          errorMessage = 'Please select valid dates for your booking.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage += 'Please check your selected dates and try again.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'You need to be logged in to make a booking.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You cannot book your own property.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Property not found. It may have been removed.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please try again later.';
      } else {
        errorMessage += 'Please try again later.';
      }
      
      set({
        error: errorMessage,
        isLoading: false
      });
      
      // Only show error toast if it's not a validation error (validation errors are shown in the form)
      if (!(error instanceof Error) || error.message.startsWith('Failed to create booking')) {
        toast.error(errorMessage);
      }
      
      console.error('Error creating booking:', error);
      throw new Error(errorMessage);
    }
  },
  fetchMyBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Booking[]>('/api/bookings/me');
      set({ bookings: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = 'We couldn\'t load your bookings. Please refresh the page and try again.';
      
      set({
        error: errorMessage,
        isLoading: false,
        bookings: []
      });
      
      toast.error(errorMessage);
      console.error('Error fetching my bookings:', error);
      throw new Error(errorMessage);
    }
  },
  fetchOwnerBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Booking[]>('/api/bookings/owner');
      set({ bookings: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = 'We couldn\'t load the booking requests. Please refresh the page and try again.';
      
      set({
        error: errorMessage,
        isLoading: false,
        bookings: []
      });
      
      toast.error(errorMessage);
      console.error('Error fetching owner bookings:', error);
      throw new Error(errorMessage);
    }
  },
  acceptBooking: async (bookingId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.patch<Booking>(`/api/bookings/${bookingId}/accept`);
      
      set(state => ({
        bookings: state.bookings.map(booking => 
          booking.id === bookingId ? response.data : booking
        ),
        isLoading: false
      }));
      
      toast.success('Booking accepted successfully!');
      return response.data;
    } catch (error: any) {
      let errorMessage = 'We couldn\'t accept this booking. ';
      
      if (error.response?.status === 400) {
        errorMessage = 'This booking can\'t be accepted. It may have been modified or canceled.';
      } else if (error.response?.status === 404) {
        errorMessage = 'This booking can\'t be found. It may have been canceled.';
      } else if (error.response?.data?.message) {
        errorMessage = 'There was a problem accepting this booking. Please try again.';
      } else {
        errorMessage += 'Please try again in a few minutes.';
      }
      
      set({
        error: errorMessage,
        isLoading: false
      });
      
      toast.error(errorMessage);
      console.error('Error accepting booking:', error);
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null })
}))

export default usePropertyStore
