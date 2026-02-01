import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface User {
  id: number
  name: string
  email: string
  role: 'CUSTOMER' | 'OWNER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<User>
  signup: (data: SignupRequest) => Promise<User>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

interface SignupRequest {
  name: string
  email: string
  password: string
  role: 'CUSTOMER' | 'OWNER'
}

interface LoginRequest {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

interface ForgotPasswordRequest {
  email: string
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      initialize: async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            set({ isInitialized: true })
            return
          }

          const response = await api.get<User>('/api/users/me')
          set({ 
            token, 
            user: response.data,
            isInitialized: true,
            error: null
          })
        } catch (error: any) {
          localStorage.removeItem('token')
          const errorMessage = 'Your session has expired. Please log in again.'
          set({ 
            token: null, 
            user: null,
            error: errorMessage,
            isInitialized: true 
          })
          console.error('Session initialization error:', error)
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          // Basic client-side validation
          if (!email || !email.includes('@')) {
            throw new Error('Please enter a valid email address')
          }
          if (!password) {
            throw new Error('Please enter your password')
          }
          
          const response = await api.post<AuthResponse>('/api/auth/login', { email, password })
          const { token, user } = response.data
          localStorage.setItem('token', token)
          set({ 
            token, 
            user, 
            isLoading: false, 
            error: null 
          })
          return user
        } catch (error: any) {
          let errorMessage = 'Failed to sign in. Please try again.'
          
          if (error.response) {
            if (error.response.status === 401) {
              errorMessage = 'Incorrect email or password. Please try again.'
            } else if (error.response.status === 403) {
              errorMessage = 'Your account is not active. Please contact support.'
            } else if (error.response.status === 429) {
              errorMessage = 'Too many login attempts. Please wait a few minutes and try again.'
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
          } else if (!navigator.onLine) {
            errorMessage = 'No internet connection. Please check your network and try again.'
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            token: null,
            user: null
          })
          
          throw new Error(errorMessage)
        }
      },

      signup: async (data: SignupRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          // Client-side validation
          if (!data.name || data.name.trim().length < 2) {
            throw new Error('Please enter a valid name (at least 2 characters)')
          }
          if (!data.email || !data.email.includes('@')) {
            throw new Error('Please enter a valid email address')
          }
          if (!data.password || data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long')
          }
          
          const response = await api.post<AuthResponse>('/api/auth/signup', data)
          const { token, user } = response.data
          
          localStorage.setItem('token', token)
          set({ 
            token, 
            user, 
            isLoading: false, 
            error: null 
          })
          
          return user
        } catch (error: any) {
          let errorMessage = 'Failed to create your account. Please try again.'
          
          if (error.response) {
            if (error.response.status === 400) {
              errorMessage = 'Please check your information and try again.'
            } else if (error.response.status === 409) {
              errorMessage = 'An account with this email already exists. Try logging in instead.'
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
          } else if (!navigator.onLine) {
            errorMessage = 'No internet connection. Please check your network and try again.'
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            token: null,
            user: null
          })
          
          throw new Error(errorMessage)
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null })
          
          if (!email || !email.includes('@')) {
            throw new Error('Please enter a valid email address')
          }
          
          await api.post('/api/auth/forgot-password', { email })
          set({ 
            isLoading: false,
            error: null 
          })
          
          return true
        } catch (error: any) {
          let errorMessage = 'We couldn\'t send the reset email. Please try again.'
          
          if (error.response) {
            if (error.response.status === 404) {
              errorMessage = 'No account found with this email address.'
            } else if (error.response.status === 429) {
              errorMessage = 'Too many attempts. Please wait before trying again.'
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
          } else if (!navigator.onLine) {
            errorMessage = 'No internet connection. Please check your network and try again.'
          }
          
          set({
            error: errorMessage,
            isLoading: false
          })
          
          throw new Error(errorMessage)
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null })
          
          if (!newPassword || newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long')
          }
          
          await api.post('/api/auth/reset-password', { token, newPassword })
          set({ 
            isLoading: false,
            error: null 
          })
          
          return true
        } catch (error: any) {
          let errorMessage = 'Failed to reset your password. Please try again.'
          
          if (error.response) {
            if (error.response.status === 400) {
              errorMessage = 'The password reset link is invalid or has expired.'
            } else if (error.response.status === 401) {
              errorMessage = 'Your session has expired. Please request a new password reset.'
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
          } else if (!navigator.onLine) {
            errorMessage = 'No internet connection. Please check your network and try again.'
          }
          
          set({
            error: errorMessage,
            isLoading: false
          })
          
          throw new Error(errorMessage)
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null })
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)

export default useAuthStore 