import { useState } from "react";
import { Link } from "wouter";
import { SECTORS, getSectorById } from "@/lib/sectors";
import { Search, ArrowRight, Building2, Users, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SectorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSectors = SECTORS.filter(
    (sector) =>
      sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose Your <span className="text-yellow-300">Industry</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore AI-powered service platforms tailored for your specific business sector
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-full border-0 shadow-lg text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{SECTORS.length}+</h3>
              <p className="text-gray-600">Industry Sectors</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Business Templates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">Smart Automation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Industry Sectors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select your industry to access customized AI tools, templates, and automation workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSectors.map((sector) => (
              <Link key={sector.id} href={`/categories?sector=${sector.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 hover:border-primary/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="text-3xl p-3 rounded-lg shadow-sm"
                        style={{ backgroundColor: `${sector.primaryColor}20`, color: sector.primaryColor }}
                      >
                        {sector.icon}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {sector.displayName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {sector.description}
                    </CardDescription>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ backgroundColor: `${sector.primaryColor}10`, color: sector.primaryColor }}
                    >
                      AI-Enabled
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredSectors.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sectors found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of businesses already using ServiceHub AI to automate their operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Get Started Today
                </button>
              </Link>
              <Link href="/about">
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}