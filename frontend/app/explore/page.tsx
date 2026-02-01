"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { 
  Search, MapPin, Building2, Filter,
  ChevronDown, Heart, Star, Square,
  DollarSign, Home, Briefcase, Package,
  X, CheckCircle, ArrowUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import usePropertyStore from "@/stores/propertyStore"
import { useDebounce } from "@/hooks/useDebounce"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
})

const propertyTypes = [
  { icon: Home, label: "OFFICE", color: "blue" },
  { icon: Briefcase, label: "SHOP", color: "green" },
  { icon: Package, label: "WAREHOUSE", color: "orange" },
  { icon: Building2, label: "LAND", color: "purple" }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 500)

  const { 
    properties, 
    selectedProperty,
    reviews,
    isLoading,
    fetchProperties,
    fetchPropertyById,
    fetchReviews,
    setSelectedProperty
  } = usePropertyStore()

  // Initial fetch
  useEffect(() => {
    fetchProperties()
  }, [])

  // Handle search
  useEffect(() => {
    if (debouncedSearch) {
      fetchProperties(debouncedSearch)
    }
  }, [debouncedSearch])

  // Fetch reviews when property is selected
  useEffect(() => {
    if (selectedProperty) {
      fetchReviews(selectedProperty.id)
    }
  }, [selectedProperty])

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesType = !selectedType || property.type === selectedType
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
    return matchesType && matchesPrice
  })

  // Get property reviews
  const getPropertyReviews = (propertyId: number) => {
    return reviews.filter(review => review.property_id === propertyId)
    }

  // Calculate average rating
  const getAverageRating = (propertyId: number) => {
    const propertyReviews = getPropertyReviews(propertyId)
    if (propertyReviews.length === 0) return 0
    const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / propertyReviews.length
  }

  const handleMarkerClick = (property: any) => {
    setSelectedProperty(property)
  }

  const handleMapReady = () => {
    // Map is ready
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Property Listings */}
      <div className="w-[45%] h-screen overflow-hidden flex flex-col border-r border-gray-200">
        {/* Search Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore Properties</h1>

          {/* Search Bar */}
          <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                placeholder="Search by location or property name..."
                className="pl-10 pr-4 py-6 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            {/* Property Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <Building2 className="mr-2 h-4 w-4" />
                  {selectedType || "Property Type"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {propertyTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.label}
                    onClick={() => setSelectedType(type.label)}
                    className="flex items-center gap-2"
                  >
                    <type.icon className={`h-4 w-4 text-${type.color}-500`} />
                    {type.label}
                    {selectedType === type.label && (
                      <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Price Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Price Range
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Price Range</span>
                    <span className="text-sm text-gray-500">
                      ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={500000}
                    step={10000}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
        </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {(selectedType || searchQuery) && (
            <div className="flex items-center gap-2 mt-4">
              {selectedType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedType}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedType(null)}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {searchQuery}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedType(null)
                  setSearchQuery("")
                  setPriceRange([0, 500000])
                }}
              >
                Clear all
              </Button>
            </div>
            )}
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Search className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
            <AnimatePresence>
              {filteredProperties.map((property, idx) => (
                <Link href={`/explore/${property.id}`} key={property.id} legacyBehavior>
                  <a>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border`}
                    >
                      <div className="flex">
                        {/* Property Image */}
                        <div className="relative w-48 h-48">
                          {property.photoUrl ? (
                            <img
                              src={property.photoUrl}
                              alt={property.title}
                              className="w-full h-full object-cover rounded-l-2xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-l-2xl flex items-center justify-center">
                              <Building2 className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Property Details */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                              <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.address}, {property.city}
                              </div>
                            </div>
                            <Badge className={`bg-${
                              property.type === "OFFICE" ? "blue" :
                              property.type === "SHOP" ? "green" :
                              property.type === "WAREHOUSE" ? "orange" : "purple"
                            }-100 text-${
                              property.type === "OFFICE" ? "blue" :
                              property.type === "SHOP" ? "green" :
                              property.type === "WAREHOUSE" ? "orange" : "purple"
                            }-700`}>
                              {property.type}
                            </Badge>
          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center">
                              <Square className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-600">{property.area} sq ft</span>
                            </div>
                            {getPropertyReviews(property.id).length > 0 && (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-gray-600">
                                  {getAverageRating(property.id).toFixed(1)}
                                </span>
                                <span className="text-gray-400 ml-1">
                                  ({getPropertyReviews(property.id).length} reviews)
                                </span>
          </div>
        )}
      </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {property.verified && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xl font-bold text-blue-600">₹{property.price.toLocaleString()}/mo</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </a>
                </Link>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 h-full">
        <MapComponent
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onMarkerClick={handleMarkerClick}
          onMapReady={handleMapReady}
        />
      </div>
    </div>
  )
}
