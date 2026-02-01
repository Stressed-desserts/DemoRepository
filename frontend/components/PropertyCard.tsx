import type { Property } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Square, Star, Heart, Eye, Calendar, Building2, CheckCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

import { useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PropertyCardProps {
  property: Property
  onVerify?: (id: string) => void
  onInquire?: (property: Property) => void
}

export function PropertyCard({ property, onVerify, onInquire }: PropertyCardProps) {

  const [isHovered, setIsHovered] = useState(false)
  const [chatOpen, setChatOpen] = useState(false);





  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "OFFICE":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SHOP":
        return "bg-green-100 text-green-800 border-green-200"
      case "WAREHOUSE":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "LAND":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "OFFICE":
        return "🏢"
      case "SHOP":
        return "🛍️"
      case "WAREHOUSE":
        return "🏭"
      case "LAND":
        return "🌍"
      default:
        return "🏠"
    }
  }


  // Use property image if available, else owner image, else fallback
  const getPropertyImage = () => {
    if (property.photoUrl) return property.photoUrl;
    if (property.owner?.imageUrl) return property.owner.imageUrl;
    return "/images/default-avatar.png";
  }

  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image Section */}
      <div className="relative h-48 overflow-hidden flex items-center justify-center bg-gray-100">
        <img
          src={getPropertyImage()}
          alt={property.title || property.owner?.name || "Property"}
          className="w-full h-48 object-cover"
        />
        
        {/* Overlay with actions */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-4 right-4 flex space-x-2">

            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
              onClick={() => onInquire && onInquire(property)}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Property type badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getTypeColor(property.type)} border`}>
            <span className="mr-1">{getTypeIcon(property.type)}</span>
            {property.type}
          </Badge>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-white/95 text-gray-900 font-semibold border-0 shadow-lg">
            {formatPrice(property.price)}
          </Badge>
        </div>

        {/* Verified badge */}
        {property.verified && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-green-500 text-white border-0 shadow-lg">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Title and rating */}
        <div className="flex justify-between items-start mb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {property.title}
          </CardTitle>
          {/* Rating and reviews removed: averageRating/reviewCount not in Property type */}
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="font-medium">N/A</span>
            <span className="text-gray-500 ml-1">(0)</span>
          </div>
        </div>

        {/* Location: use address/city/state/country */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm">{property.address}, {property.city}, {property.state}, {property.country}</span>
        </div>

        {/* Owner info */}
        <div className="flex items-center text-xs text-gray-500 mb-2 gap-2">
          <img
            src={property.owner?.imageUrl || "/images/default-avatar.png"}
            alt={property.owner?.name || "Owner"}
            className="w-6 h-6 rounded-full object-cover border"
          />
          <span>Listed by: {property.owner?.name || 'Unknown'} ({property.owner?.email || 'N/A'})</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* Property details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Square className="h-4 w-4 mr-2 text-gray-400" />
            <span>{property.area.toLocaleString()} sq ft</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            {/* Optionally show property type icon or just text */}
            <span className="mr-2">🏷️</span>
            <span>{property.type}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Link href={`/explore/${property.id}`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="px-3" onClick={() => setChatOpen(true)}>
            Contact
          </Button>
          <Dialog open={chatOpen} onOpenChange={setChatOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chat with Owner</DialogTitle>
              </DialogHeader>
              {/* Chat UI placeholder */}
              <div className="h-64 flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto mb-4">Chat history will appear here.</div>
                <form className="flex gap-2">
                  <input className="flex-1 border rounded px-2 py-1" placeholder="Type your message..." />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
          {onVerify && !property.verified && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
              onClick={() => onVerify(property.id.toString())}
            >
              Verify
            </Button>
          )}
        </div>

        {/* Posted date: createdAt not in Property type, so omit */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Property ID: {property.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
