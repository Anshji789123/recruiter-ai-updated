import { Check, Star, Zap, Crown, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  const plans = [
    {
      name: "Startup",
      icon: Rocket,
      price: "₹9,999",
      period: "/month",
      description: "Perfect for growing startups and small teams",
      features: [
        "Up to 50 candidates/month",
        "AI Resume Screening",
        "Basic Interview Scheduling",
        "Standard Support",
        "Basic Analytics",
        "Email Integration",
      ],
      color: "from-cyan-500 to-blue-500",
      popular: false,
      buttonText: "Start Free Trial",
    },
    {
      name: "Professional",
      icon: Star,
      price: "₹24,999",
      period: "/month",
      description: "Ideal for mid-size companies and HR teams",
      features: [
        "Up to 200 candidates/month",
        "Advanced AI Screening",
        "Smart Contract Offer Letters",
        "Automated Interview Scheduling",
        "Priority Support",
        "Advanced Analytics & Reports",
        "Calendar Integration",
        "Custom Workflows",
      ],
      color: "from-purple-500 to-pink-500",
      popular: true,
      buttonText: "Start Free Trial",
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "₹49,999",
      period: "/month",
      description: "Complete solution for large enterprises",
      features: [
        "Unlimited candidates",
        "Full AI Automation Suite",
        "Blockchain Smart Contracts",
        "Advanced Document Management",
        "24/7 Premium Support",
        "Custom Analytics Dashboard",
        "API Access",
        "White-label Solution",
        "Dedicated Account Manager",
        "Custom Integrations",
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false,
      buttonText: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold mb-8 shadow-lg">
            <Zap className="w-5 h-5 mr-2" />
            Simple & Transparent Pricing
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start with a 14-day free trial. No setup fees, no hidden costs. Scale as you grow with our flexible pricing
            plans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:-translate-y-4 border ${
                plan.popular ? "border-purple-200 ring-4 ring-purple-100 scale-105" : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-8 py-3 rounded-full text-sm font-bold shadow-xl animate-pulse">
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              <div className="p-10">
                {/* Plan Header */}
                <div className="text-center mb-10">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${plan.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl`}
                  >
                    <plan.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  <p className="text-gray-600 mb-8 text-lg">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      <span
                        className={`text-6xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-3 text-xl">{plan.period}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-3 font-medium">14-day free trial included</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-5 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-4">
                      <div
                        className={`flex-shrink-0 w-7 h-7 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mt-0.5 shadow-lg`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 text-xl font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white"
                      : `bg-gradient-to-r ${plan.color} hover:shadow-2xl text-white`
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-200 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">All Plans Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600">
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-emerald-500" />
                <span className="text-lg font-medium">SSL Security & Encryption</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-emerald-500" />
                <span className="text-lg font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-emerald-500" />
                <span className="text-lg font-medium">Regular Updates</span>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-gray-600 text-lg">
                Need a custom solution?{" "}
                <a
                  href="#"
                  className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold hover:underline"
                >
                  Contact our sales team
                </a>{" "}
                for enterprise pricing and features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
