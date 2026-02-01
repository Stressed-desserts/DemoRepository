"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Building2, Users, Shield, Star, ArrowRight, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { LucideIcon } from 'lucide-react'

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5
    }
  }
}

const scaleUp: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
}

  const featuredProperties = [
    {
      id: 1,
      title: "Modern Office Space",
    location: "Downtown Business District, Mumbai",
    image: "/images/properties/office1.jpg",
    type: "Office",
    price: "₹75,000/mo",
    rating: "4.9",
    reviews: "128"
    },
    {
      id: 2,
    title: "Retail Store Front",
    location: "Market Square, Delhi",
    image: "/images/properties/retail1.jpg",
    type: "Retail",
    price: "₹95,000/mo",
    rating: "4.8",
    reviews: "96"
    },
    {
      id: 3,
      title: "Industrial Warehouse",
    location: "Industrial Zone, Pune",
    image: "/images/properties/warehouse1.jpg",
    type: "Industrial",
    price: "₹1,50,000/mo",
    rating: "4.7",
    reviews: "75"
    }
  ]

  const testimonials = [
    {
    name: "Rajesh Kumar",
      role: "Business Owner",
    content: "Found the perfect office space for my growing team within a week. The platform made everything so simple and transparent.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
    },
    {
    name: "Priya Sharma",
    role: "Startup Founder",
    content: "The best platform for finding commercial properties. Their verification process gives you complete peace of mind.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
    },
    {
    name: "Amit Patel",
    role: "Real Estate Investor",
    content: "As a property owner, I love how easy it is to list and manage my properties. The support team is always helpful.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
    }
  ]

  const stats = [
  { number: "1000+", label: "Properties Listed" },
  { number: "500+", label: "Happy Clients" },
  { number: "50+", label: "Cities Covered" },
  { number: "24/7", label: "Support" }
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900">
          {/* Stars */}
          <div className="absolute inset-0 bg-[url('/images/stars.svg')] opacity-50 animate-twinkle"></div>
          
          {/* Buildings - Back Layer */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 h-64 bg-[url('/images/buildings-back.svg')] bg-repeat-x bg-bottom opacity-30"
          ></motion.div>

          {/* Buildings - Middle Layer */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 h-96 bg-[url('/images/buildings-middle.svg')] bg-repeat-x bg-bottom opacity-50"
          ></motion.div>

          {/* Buildings - Front Layer */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [-20, 20, -20] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 h-128 bg-[url('/images/buildings-front.svg')] bg-repeat-x bg-bottom"
          ></motion.div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="space-y-8"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            >
                Find Your Perfect
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                Urban Lease
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
            >
                Discover, list, and manage commercial properties with our trusted platform. 
                Connect with verified property owners and find your ideal business location.
            </motion.p>
              
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
                <Link href="/explore">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    <Search className="mr-2 h-5 w-5" />
                    Explore Properties
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                  className="text-white border-2 border-white hover:bg-white hover:text-blue-600 bg-transparent text-lg px-8 py-6 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Get Started Free
                  </Button>
                </Link>
            </motion.div>

              {/* Search Bar */}
            <motion.div 
              variants={scaleUp}
              className="max-w-2xl mx-auto mt-12"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-2xl">
  <div className="flex flex-col md:flex-row gap-2">
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search by location, property type..."
        className="w-full px-12 py-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow focus:shadow-lg text-lg"
      />
    </div>
    <Button className="md:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
      <Search className="mr-2 h-5 w-5" />
      Search
    </Button>
  </div>
</div>

            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium flex flex-col items-center"
        >
          <span className="mb-2">Scroll to explore</span>
          <ArrowRight className="h-5 w-5 transform rotate-90" />
        </motion.div>
      </section>

      {/* Stats Section with Vibrant Gradient */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={scaleUp}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-20">
            <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Why Choose Urban Lease?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              The most trusted platform for commercial real estate with advanced features and security
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Building2 className="h-8 w-8 text-blue-600" />,
                title: "Verified Properties",
                description: "All properties are thoroughly verified and authenticated for your peace of mind",
                color: "blue"
              },
              {
                icon: <Users className="h-8 w-8 text-green-600" />,
                title: "Trusted Community",
                description: "Connect with verified property owners and trusted tenants in our secure network",
                color: "green"
              },
              {
                icon: <Shield className="h-8 w-8 text-purple-600" />,
                title: "Secure Platform",
                description: "Advanced security measures to protect your data and ensure safe transactions",
                color: "purple"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:-translate-y-2"
              >
                <div className={`bg-${feature.color}-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
              </div>
                <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-blue-50"></div>
        
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>


        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-20">
            <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Featured Properties
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600"
            >
              Discover some of our most popular Urban Leases
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={scaleUp}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {property.type}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 shadow-lg">
                    {property.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-gray-500 ml-1">({property.reviews} reviews)</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:-translate-y-1 transition-transform duration-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/explore">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
<section className="py-32 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">


  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerChildren}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    {/* Header */}
    <div className="text-center mb-20">
      <motion.h2
        variants={fadeIn}
        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
      >
        What Our Users Say
      </motion.h2>
      <motion.p
        variants={fadeIn}
        className="text-xl text-gray-600"
      >
        Real experiences from property owners and tenants
      </motion.p>
    </div>

    {/* Scrolling Testimonials */}
    <div className="relative">

      {/* Auto-scroll Row */}
      <motion.div
        animate={{ x: [0, -2880, 0] }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex gap-8"
      >
        {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
          <div
            key={idx}
            className="flex-none w-[340px] sm:w-[360px] lg:w-[400px] bg-white rounded-3xl shadow-xl p-6 sm:p-8 hover:scale-[1.03] transition-transform duration-300"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                {/* Avatar Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="relative w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                <span className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full mt-1">
                  {testimonial.role}
                </span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-gray-700 text-[15px] leading-relaxed italic mb-5">
              "{testimonial.content}"
            </blockquote>

            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.div>
</section>


      {/* How It Works Section */}
      <section className="py-28 bg-gradient-to-b from-gray-50 to-white relative">


  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerChildren}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    {/* Section Header */}
    <div className="text-center mb-20">
      <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        How It Works
      </motion.h2>
      <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-600">
        Simple steps to find or list your Urban Lease
      </motion.p>
    </div>

    {/* Steps */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 relative">
      {[
        {
          step: 1,
          title: "Search & Browse",
          description: "Find properties by location, type, and price range",
          icon: Search,
          gradient: "from-blue-500 to-blue-600"
        },
        {
          step: 2,
          title: "Connect",
          description: "Contact property owners directly through our platform",
          icon: Users,
          gradient: "from-purple-500 to-purple-600"
        },
        {
          step: 3,
          title: "Verify & Visit",
          description: "Schedule viewings and verify property details",
          icon: Shield,
          gradient: "from-pink-500 to-pink-600"
        },
        {
          step: 4,
          title: "Secure Deal",
          description: "Complete transactions safely with our secure payment system",
          icon: Building2,
          gradient: "from-indigo-500 to-indigo-600"
        }
      ].map((step, idx) => (
        <motion.div
          key={step.title}
          variants={fadeIn}
          className="text-center relative z-10 flex flex-col items-center"
        >
          {/* Numbered Square */}
          <div className={`mb-6 w-24 h-24 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}>
            <span className="text-white text-3xl font-bold">{step.step}</span>
          </div>

          {/* Icon */}
          <div className="mb-4 -mt-10 bg-white p-3 rounded-xl shadow-md">
            <step.icon className="w-6 h-6 text-blue-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>

          {/* Description */}
          <p className="text-gray-600 text-base max-w-xs mx-auto">{step.description}</p>

          {/* Arrow (not for last) */}
          {idx < 3 && (
            <div className="absolute right-[-24px] top-12 hidden md:block">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-md">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
</section>



      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">

        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of property owners and tenants on our trusted platform. 
            Start your journey today with our free signup.
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-2 border-white hover:bg-white hover:text-blue-600 bg-transparent text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Browse Properties
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Urban Lease</span>
              </div>
              <p className="text-gray-400 mb-6">
                The trusted platform for commercial real estate. Connect with verified property owners and find your ideal business location.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-200" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  ["Browse Properties", "/explore"],
                  ["List Property", "/signup"],
                  ["About Us", "/about"],
                  ["Contact", "/contact"]
                ].map(([text, href]) => (
                  <li key={text}>
                    <Link 
                      href={href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-2 transition-transform duration-200" />
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                {[
                  ["Help Center", "/help"],
                  ["FAQ", "/faq"],
                  ["Terms of Service", "/terms"],
                  ["Privacy Policy", "/privacy"]
                ].map(([text, href]) => (
                  <li key={text}>
                    <Link 
                      href={href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-2 transition-transform duration-200" />
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <div className="space-y-4 text-gray-400">
                {([
                  [Phone as LucideIcon, "+91-9370434363"],
                  [Mail as LucideIcon, "202301100047@mitaoe.ac.in"],
                  [MapPin as LucideIcon, "MIT Academy of Engineering College"]
                ] as const).map(([Icon, text], i) => (
                  <div key={i} className="flex items-center group">
                    <Icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                    <span className="group-hover:text-white transition-colors duration-200">{text}</span>
                </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Urban Lease. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
