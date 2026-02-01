export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'OWNER' | 'CUSTOMER'
}

export interface Property {
  id: number
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  country: string
  verified: boolean
  type: 'OFFICE' | 'SHOP' | 'WAREHOUSE' | 'LAND'
  area: number
  latitude: number
  longitude: number
  photoUrl?: string
  owner: {
    id: number
    name: string
    email: string
    imageUrl?: string
  }
}

export interface PropertyRequest {
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  country: string
  type: 'OFFICE' | 'SHOP' | 'WAREHOUSE' | 'LAND'
  area: number
  latitude: number
  longitude: number
}

export interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  user: {
    id: number
    name: string
  }
  property_id: number
}

export interface Booking {
  id: number
  property_id: number
  property?: {
    id: number
    title: string
    address: string
    price: number
  }
  customer_id: number
  owner_id: number
  user?: {
    id: number
    name: string
    email: string
  }
  start_date: string
  end_date: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  created_at: string
  total_price?: number
  days?: number
  months?: number
}


export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  role: "CUSTOMER" | "OWNER"
}

export interface PropertyFormData {
  title: string
  description: string
  price: number
  type: "OFFICE" | "SHOP" | "WAREHOUSE" | "LAND"
  address: string
  state: string
  country: string
  area: number
  latitude: number
  longitude: number
  city: string;
  photoUrl?: string;
}
