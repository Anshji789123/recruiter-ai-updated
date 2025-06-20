import { Users, Clock, TrendingUp } from "lucide-react"

export default function WhyHireGenius() {
  const benefits = [
    {
      icon: Clock,
      title: "Save 80% Time",
      description: "Reduce manual screening time",
    },
    {
      icon: Users,
      title: "Better Matches",
      description: "AI-driven candidate matching",
    },
    {
      icon: TrendingUp,
      title: "Faster Hiring",
      description: "Accelerate your recruitment pipeline",
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HireGenius?
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                In today's competitive hiring landscape, manual screening and scheduling can slow you down. HireGenius
                empowers recruiters to focus on what matters — building great teams. Our AI-driven automation reduces
                bias, accelerates hiring, and improves candidate experience, making recruitment smarter and simpler.
              </p>

              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                        <benefit.icon className="h-8 w-8 text-cyan-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-lg">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 rounded-3xl p-10 relative overflow-hidden shadow-xl">
                <div className="absolute top-6 right-6 w-24 h-24 bg-cyan-200/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-6 left-6 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-gray-900 text-xl">Recruitment Pipeline</h4>
                      <span className="text-emerald-600 text-lg font-bold">+95% Efficiency</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Resume Screening</span>
                        <div className="w-32 h-3 bg-gray-200 rounded-full">
                          <div className="w-full h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Interview Scheduling</span>
                        <div className="w-32 h-3 bg-gray-200 rounded-full">
                          <div className="w-5/6 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Candidate Matching</span>
                        <div className="w-32 h-3 bg-gray-200 rounded-full">
                          <div className="w-11/12 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        2.5x
                      </div>
                      <div className="text-gray-600 font-medium">Faster Hiring</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        99%
                      </div>
                      <div className="text-gray-600 font-medium">Accuracy Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
