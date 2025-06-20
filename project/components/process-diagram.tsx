"use client"

import { ArrowRight, Upload, Brain, Shield, CheckCircle, Users, FileText, Clock, TrendingUp, Zap } from "lucide-react"

export default function ProcessDiagram() {
  const steps = [
    {
      icon: Upload,
      title: "Profile Creation",
      description: "Candidates create detailed profiles with skills and experience",
      color: "from-cyan-500 to-blue-500",
      manualTime: "Manual: 30 mins",
      automatedTime: "AI: 2 mins",
    },
    {
      icon: Brain,
      title: "AI Screening",
      description: "Advanced AI analyzes and ranks candidates",
      color: "from-purple-500 to-violet-500",
      manualTime: "Manual: 4 hours",
      automatedTime: "AI: 5 minutes",
    },
    {
      icon: Users,
      title: "Interview Scheduling",
      description: "Automated calendar sync and scheduling",
      color: "from-pink-500 to-rose-500",
      manualTime: "Manual: 2 hours",
      automatedTime: "Auto: 2 minutes",
    },
    {
      icon: Shield,
      title: "Smart Contract",
      description: "Blockchain-secured offer letter generation",
      color: "from-emerald-500 to-teal-500",
      manualTime: "Manual: 1 day",
      automatedTime: "Smart: 10 minutes",
    },
    {
      icon: FileText,
      title: "Digital Signing",
      description: "Secure digital signature and verification",
      color: "from-orange-500 to-amber-500",
      manualTime: "Manual: 3 days",
      automatedTime: "Digital: 1 hour",
    },
    {
      icon: CheckCircle,
      title: "Onboarding",
      description: "Automated onboarding workflow activation",
      color: "from-indigo-500 to-blue-500",
      manualTime: "Manual: 2 days",
      automatedTime: "Auto: 30 minutes",
    },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-700 text-sm font-semibold mb-8 shadow-lg">
            <Zap className="w-5 h-5 mr-2" />
            Lightning-Fast Pipeline
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">
            Complete Recruitment Pipeline
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              With AI Automation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            See how our AI-powered smart contract system transforms every step of recruitment with incredible speed and
            efficiency.
          </p>
        </div>

        {/* Process Flow */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 z-0">
                    <ArrowRight className="absolute -right-2 -top-2 h-5 w-5 text-purple-500" />
                  </div>
                )}

                {/* Step Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 border border-gray-100 relative z-10 overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl relative`}
                  >
                    <step.icon className="h-10 w-10 text-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">{step.description}</p>

                  {/* Time Comparison */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                      <span className="text-red-600 font-semibold">Traditional:</span>
                      <span className="text-red-700 font-bold">{step.manualTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-emerald-600 font-semibold">HireGenius:</span>
                      <span className="text-emerald-700 font-bold">{step.automatedTime}</span>
                    </div>
                  </div>

                  {/* Bottom Glow Line */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.color} w-0 group-hover:w-full transition-all duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Savings Summary */}
          <div className="mt-24 bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 translate-x-40"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-30 -translate-x-30"></div>

            <div className="relative z-10">
              <div className="text-center mb-16">
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Complete Pipeline Transformation</h3>
                <p className="text-2xl text-purple-200 max-w-4xl mx-auto">
                  From manual processes to AI-powered automation - experience the dramatic speed improvement.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-3xl font-bold mb-3">15 Days → 2 Days</h4>
                  <p className="text-purple-200 text-lg">Time to hire reduction</p>
                  <div className="mt-4 text-cyan-300 font-bold text-xl">87% Faster</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-3xl font-bold mb-3">99% Accuracy</h4>
                  <p className="text-purple-200 text-lg">AI screening precision</p>
                  <div className="mt-4 text-emerald-300 font-bold text-xl">Industry Leading</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-3xl font-bold mb-3">24/7 Automation</h4>
                  <p className="text-purple-200 text-lg">Continuous processing</p>
                  <div className="mt-4 text-pink-300 font-bold text-xl">Never Stops</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
