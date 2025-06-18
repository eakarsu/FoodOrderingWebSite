import { Link } from "wouter";
import { Settings, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Sectors", path: "/sectors" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const customerService = [
    { name: "Order Tracking", path: "/order-tracking" },
    { name: "Returns & Refunds", path: "/returns-refunds" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ServiceHub AI</span>
            </div>
            <p className="text-gray-300 mb-4">
              Revolutionizing service industries with AI-powered platforms, SMS integration, and voice communication across all sectors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300">
              {customerService.map((service) => (
                <li key={service.name}>
                  <a href={service.path} className="hover:text-white transition-colors">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="text-gray-300 space-y-2">
              <p className="flex items-start">
                <span className="text-primary mr-2">📍</span>
                2807 Hampton Drive Henrico VA 23233
              </p>
              <p className="flex items-center">
                <span className="text-primary mr-2">📞</span>
                804-360-1129
              </p>
              <p className="flex items-center">
                <span className="text-primary mr-2">✉️</span>
                support@orderlybite.com
              </p>
              <p className="flex items-start">
                <span className="text-primary mr-2">🕒</span>
                <span>
                  Mon-Thu: 11AM-10PM<br />
                  Fri-Sat: 11AM-11PM<br />
                  Sun: 12PM-9PM
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; 2024 Orderly Bite. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
