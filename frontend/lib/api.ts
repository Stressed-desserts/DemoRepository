// Booking acceptance
export const acceptBooking = (bookingId: number) => api.put(`/bookings/${bookingId}/accept`);
import axios from 'axios'
import { toast } from 'sonner'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token (robust)
api.interceptors.request.use(
  (config) => {
    // Always fetch the latest token from localStorage
    let token = null;
    try {
      token = localStorage.getItem('token');
    } catch (e) {
      // localStorage may not be available (SSR)
      token = null;
    }
    if (token && typeof token === 'string' && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token
      if (config.headers.Authorization) {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.response?.status === 404) {
      toast.error('Resource not found')
    } else if (error.response?.status === 403) {
      // Suppress permission denied toast
      // toast.error('You do not have permission to perform this action')
    } else if (error.response?.status === 400) {
      toast.error('Invalid request. Please check your input.')
    } else {
      console.error('An unexpected error occurred')
    }
    return Promise.reject(error)
  }
)

export default api

// Favorites API
export const getFavorites = () => api.get("/favorites");




// Inquiries API






export const getMyBookings = () => api.get("/bookings/me");
