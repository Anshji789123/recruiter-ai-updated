import { Brain, Calendar, FileText, BarChart3, Shield, Zap } from "lucide-react"

export default function FeaturesOverview() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Resume Screening",
      description:
        "Advanced machine learning algorithms analyze resumes, match skills, and rank candidates with 99% accuracy using natural language processing.",
      gradient: "from-cyan-500 to-blue-500",
      highlight: "99% Accuracy",
      bgGlow: "cyan",
    },
    {
      icon: Shield,
      title: "Smart Contract Offer Letters",
      description:
        "Blockchain-secured offer letters with automated verification, digital signatures, and immutable records for complete transparency.",
      gradient: "from-purple-500 to-violet-500",
      highlight: "Blockchain Secured",
      bgGlow: "purple",
    },
    {
      icon: Calendar,
      title: "Automated Interview Scheduling",
      description:
        "AI-powered calendar sync with automatic timezone detection, conflict resolution, and personalized interview reminders.",
      gradient: "from-pink-500 to-rose-500",
      highlight: "Zero Conflicts",
      bgGlow: "pink",
    },
    {
      icon: FileText,
      title: "Smart Document Management",
      description:
        "Encrypted document storage with AI-powered verification, automated compliance checks, and instant approval workflows.",
      gradient: "from-emerald-500 to-teal-500",
      highlight: "Bank-Level Security",
      bgGlow: "emerald",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics & Insights",
      description:
        "Advanced dashboards with predictive analytics, hiring trends, and AI-powered recommendations for better decisions.",
      gradient: "from-orange-500 to-amber-500",
      highlight: "Predictive AI",
      bgGlow: "orange",
    },
    {
      icon: Zap,
      title: "Lightning-Fast Automation",
      description:
        "Complete recruitment workflows automated in seconds with smart triggers, notifications, and seamless integrations.",
      gradient: "from-indigo-500 to-blue-500",
      highlight: "10x Faster",
      bgGlow: "indigo",
    },
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-sm font-semibold mb-8 shadow-lg">
            <Zap className="w-5 h-5 mr-2" />
            Powerful AI Features
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">
            Next-Generation
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Recruitment Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Revolutionary features powered by AI, blockchain, and smart automation to transform your hiring process
            completely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${feature.bgGlow}-500/5 to-${feature.bgGlow}-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Floating Badge */}
              <div className="absolute -top-2 -right-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                {feature.highlight}
              </div>

              {/* Icon */}
              <div
                className={`relative w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
              >
                <feature.icon className="h-10 w-10 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>

              {/* Hover Line */}
              <div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
