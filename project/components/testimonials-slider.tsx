"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, DollarSign, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      name: "Saket Jha",
      role: "HR Director",
      company: "TechCorp India",
      content:
        "HireGenius has completely transformed our recruitment process. We've reduced our hiring costs by 75% and time-to-hire by 60%. The AI screening is incredibly accurate and the smart contract offer letters have eliminated all paperwork delays. ROI achieved in just 3 months!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      savings: "₹45L saved annually",
      metric: "75% cost reduction",
    },
    {
      name: "Rajesh Kumar",
      role: "Talent Acquisition Manager",
      company: "StartupHub Mumbai",
      content:
        "The automated scheduling and smart contract features have saved us over ₹30 lakhs annually. Our recruitment team can now focus on strategic hiring instead of administrative tasks. The blockchain verification gives candidates complete confidence in our offers.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      savings: "₹30L saved annually",
      metric: "80% time saved",
    },
    {
      name: "Vaishnav Tiwari",
      role: "Recruitment Lead",
      company: "InnovateTech Bangalore",
      content:
        "As a growing startup, HireGenius has been a game-changer for our budget. We've cut recruitment costs by 70% while improving candidate quality. The analytics help us make data-driven decisions and the smart contracts ensure complete transparency with candidates.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      savings: "₹25L saved annually",
      metric: "70% cost reduction",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-semibold mb-8 shadow-lg">
            <DollarSign className="w-5 h-5 mr-2" />
            Cost Savings Success Stories
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">
            How Companies Are{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Saving Millions
            </span>
            <br />
            with HireGenius
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Real results from Indian companies that transformed their recruitment process and achieved massive cost
            savings with our AI-powered platform.
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 md:p-16 relative overflow-hidden border border-gray-200">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full -translate-y-24 translate-x-24 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full translate-y-20 -translate-x-20 opacity-60"></div>

            <div className="relative z-10">
              {/* Cost Savings Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-full font-bold text-xl shadow-xl animate-pulse">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  {testimonials[currentSlide].savings}
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center mb-8">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 text-yellow-400 fill-current mx-1" />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-2xl md:text-3xl text-gray-700 text-center mb-10 leading-relaxed font-medium">
                "{testimonials[currentSlide].content}"
              </blockquote>

              {/* Metrics */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-bold text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  {testimonials[currentSlide].metric}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center justify-center space-x-6">
                <img
                  src={testimonials[currentSlide].avatar || "/placeholder.svg"}
                  alt={testimonials[currentSlide].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-cyan-400 to-purple-400 shadow-xl"
                />
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-2xl">{testimonials[currentSlide].name}</div>
                  <div className="text-gray-600 text-xl">
                    {testimonials[currentSlide].role} at {testimonials[currentSlide].company}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border-2 hover:bg-purple-50 hover:border-purple-300 w-14 h-14 shadow-lg"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border-2 hover:bg-purple-50 hover:border-purple-300 w-14 h-14 shadow-lg"
              onClick={nextSlide}
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-10 space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 w-12"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Cost Savings Summary */}
        <div className="mt-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 translate-x-40"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-30 -translate-x-30"></div>

          <div className="relative z-10 text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-8">Total Savings Achieved by Our Clients</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-4">₹100Cr+</div>
                <div className="text-2xl text-emerald-100">Total Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-4">75%</div>
                <div className="text-2xl text-emerald-100">Average Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-4">3 Months</div>
                <div className="text-2xl text-emerald-100">Average ROI Timeline</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
