import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  const footerLinks = {
    Product: ["Features", "Smart Contracts", "AI Screening", "Pricing", "API", "Integrations"],
    Company: ["About Us", "Careers", "Press", "Blog", "Partners"],
    Resources: ["Help Center", "Documentation", "Tutorials", "Community", "Webinars"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Smart Contract Terms"],
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="absolute top-20 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-xl">HG</span>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                HireGenius
              </span>
            </div>
            <p className="text-gray-300 mb-10 leading-relaxed text-lg">
              Revolutionizing recruitment with AI automation and smart technology. The future of hiring is intelligent,
              efficient, and transparent.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 group shadow-lg"
                  aria-label={social.label}
                >
                  <social.icon className="h-7 w-7 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-2xl mb-8 text-white">{category}</h3>
              <ul className="space-y-5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-lg hover:translate-x-2 transform inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Enhanced Contact Info */}
        <div className="border-t border-white/20 mt-20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="flex items-center space-x-5 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-gray-300 text-sm">Email Us</div>
                <div className="text-white font-semibold text-lg">contact@hiregenius.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-5 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-gray-300 text-sm">Call Us</div>
                <div className="text-white font-semibold text-lg">+91 7900636588</div>
              </div>
            </div>
            <div className="flex items-center space-x-5 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-gray-300 text-sm">Visit Us</div>
                <div className="text-white font-semibold text-lg">Dehradun, India</div>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/20">
            <p className="text-gray-300 text-lg">
              © 2025 HireGenius. Developed by{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
                Ansh Chauhan
              </span>
              . All rights reserved.
            </p>
            <div className="flex space-x-10 mt-8 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-lg transition-colors hover:underline">
                Smart Contract Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
