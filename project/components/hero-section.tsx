"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Play } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-24 lg:pb-20 overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Glowing Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-8 shadow-2xl">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Next-Gen AI Recruitment Platform
            <div className="ml-2 px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs rounded-full animate-bounce">
              LIVE
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Revolutionize Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Hiring Process
            </span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
              with Smart AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Transform recruitment with AI-powered screening, automated workflows, and real-time collaboration.
            <br />
            <span className="text-cyan-300 font-semibold">
              Reduce hiring time by 80% and find perfect candidates instantly.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 group transform hover:scale-105 border border-white/20"
            >
              🚀 Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md px-10 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 group hover:shadow-xl"
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                1000+
              </div>
              <div className="text-gray-200 font-medium text-lg">Companies Trust Us</div>
              <div className="w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-4 opacity-60"></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-3">
                80%
              </div>
              <div className="text-gray-200 font-medium text-lg">Faster Hiring Process</div>
              <div className="w-full h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mt-4 opacity-60"></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                99%
              </div>
              <div className="text-gray-200 font-medium text-lg">AI Match Accuracy</div>
              <div className="w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-4 opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
