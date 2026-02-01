"use client"

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Building2, MapPin, Star, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Property {
  id: number
  title: string
  description: string
  price: number
  type: string
  address: string
  city: string
  latitude: number
  longitude: number
  verified: boolean
  area: number
  owner?: {
    name: string
    email: string
  }
}

interface MapProps {
  properties: Property[]
  selectedProperty?: Property | null
  onMarkerClick?: (property: Property) => void
  onMapReady?: () => void
}

// Custom marker icon
const createCustomIcon = (type: string) => {
  const colors = {
    OFFICE: '#3B82F6',
    SHOP: '#10B981',
    WAREHOUSE: '#F59E0B',
    LAND: '#8B5CF6'
  }
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${colors[type as keyof typeof colors] || '#6B7280'};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${type.charAt(0)}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

// Map controller component
function MapController({ selectedProperty }: { selectedProperty?: Property | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedProperty) {
      map.flyTo([selectedProperty.latitude, selectedProperty.longitude], 15, {
        duration: 1.5
      })
    }
  }, [selectedProperty, map])
  
  return null
}

export default function Map({ properties, selectedProperty, onMarkerClick, onMapReady }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (onMapReady) {
      onMapReady()
    }
  }, [onMapReady])

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
        return "bg-blue-100 text-blue-800"
      case "SHOP":
        return "bg-green-100 text-green-800"
      case "WAREHOUSE":
        return "bg-orange-100 text-orange-800"
      case "LAND":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedProperty={selectedProperty} />
        
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createCustomIcon(property.type)}
            eventHandlers={{
              click: () => onMarkerClick?.(property),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-4 max-w-xs">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {property.title}
                  </h3>
                  {property.verified && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {property.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {property.address}, {property.city}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getTypeColor(property.type)} text-xs`}>
                    {property.type}
                  </Badge>
                  <span className="font-bold text-blue-600 text-sm">
                    {formatPrice(property.price)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <img
                    src={property.owner?.imageUrl || "/images/default-avatar.png"}
                    alt={property.owner?.name || "Owner"}
                    className="w-5 h-5 rounded-full object-cover border"
                  />
                  <span>{property.area} sq ft</span>
                </div>
                
                <Link href={`/explore/${property.id}`}>
                  <Button className="w-full text-xs py-1 bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 