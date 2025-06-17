import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Clock, Award, Heart, Brain, Leaf, Star, MessageSquare, Phone, Settings, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { getAIRecommendations, type AIRecommendation } from "@/lib/openai";
import { SECTORS, type Sector, parsePrompt2File, parseRulesFile, type ParsedCategory, type ParsedRule } from "@/lib/sectors";
import type { MenuItem } from "@shared/schema";
import ContactUsDirectly from "@/components/ContactUsDirectly";

export default function HomePage() {
  const { dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [, setLocation] = useLocation();

  // Filter sectors based on search
  const filteredSectors = SECTORS.filter(sector =>
    sector.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to load sector-specific content - SECTORS FOLDER ONLY
  const loadSectorContent = async (sectorId: string): Promise<{ categories: ParsedCategory[], rules: Record<string, ParsedRule[]> }> => {
    console.log(`=== HOME PAGE LOADING SECTOR: ${sectorId} ===`);
    
    let prompt2Content = "";
    let rulesContent = "";
    
    // ONLY load from /sectors/ directory - NO FALLBACKS
    const prompt2Url = `/sectors/${sectorId}_prompt2.txt`;
    const rulesUrl = `/sectors/${sectorId}_rules.txt`;
    
    console.log(`HOME: Fetching prompt2 from: ${prompt2Url}`);
    try {
      const prompt2Response = await fetch(prompt2Url);
      if (prompt2Response.ok) {
        prompt2Content = await prompt2Response.text();
        console.log(`HOME ✅: Loaded prompt2 for ${sectorId} (${prompt2Content.length} chars)`);
      } else {
        console.error(`HOME ❌: prompt2 for ${sectorId} - Status: ${prompt2Response.status}`);
      }
    } catch (error) {
      console.error(`HOME ❌: Loading prompt2 for ${sectorId}:`, error);
    }
    
    console.log(`HOME: Fetching rules from: ${rulesUrl}`);
    try {
      const rulesResponse = await fetch(rulesUrl);
      if (rulesResponse.ok) {
        rulesContent = await rulesResponse.text();
        console.log(`HOME ✅: Loaded rules for ${sectorId} (${rulesContent.length} chars)`);
      } else {
        console.error(`HOME ❌: rules for ${sectorId} - Status: ${rulesResponse.status}`);
      }
    } catch (error) {
      console.error(`HOME ❌: Loading rules for ${sectorId}:`, error);
    }
    
    // Parse the content
    const categories = prompt2Content ? parsePrompt2File(prompt2Content) : [];
    const rules = rulesContent ? parseRulesFile(rulesContent) : {};
    
    console.log(`HOME: Parsed ${categories.length} categories for ${sectorId}`);
    
    return { categories, rules };
  };

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    // Store selected sector in localStorage for persistence
    localStorage.setItem('selectedSector', sector.id);
    
    console.log(`Navigating to sector: ${sector.id}`);
    
    // Navigate to categories page with sector parameter
    setLocation(`/categories?sector=${sector.id}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-4xl">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
              🚀 DEMO SITE - Multi-Sector AI Service Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              AI-Powered<br />
              <span className="text-accent">Service Platform</span>
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Experience our comprehensive AI-powered service platform with SMS integration, voice calls, and intelligent recommendations across multiple industries. From auto repair to beauty salons, education to financial services.
            </p>
            <p className="text-lg mb-8 text-gray-300 bg-black bg-opacity-30 p-4 rounded-lg">
              <strong>Try the Demo:</strong> Send real SMS messages, make actual voice calls, and explore AI recommendations across all service sectors. This platform adapts to any service industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Choose Your Service Sector
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sector Selection Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Choose Your Service Sector
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select from our comprehensive range of service industries. Each sector is powered by AI with SMS integration and voice call capabilities.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search service sectors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSectors.map((sector) => (
              <Card 
                key={sector.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => handleSectorSelect(sector)}
              >
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
                    style={{ backgroundColor: `${sector.primaryColor}20` }}
                  >
                    {sector.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: sector.primaryColor }}>
                    {sector.displayName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {sector.description}
                  </p>
                  <Button 
                    className="w-full"
                    style={{ 
                      backgroundColor: sector.primaryColor,
                      borderColor: sector.primaryColor 
                    }}
                  >
                    Select Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSectors.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No sectors found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms to find the service sector you're looking for.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Us Directly Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ContactUsDirectly />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the features that make our multi-sector service platform stand out across all industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SMS Integration</h3>
              <p className="text-gray-600">Real SMS messaging capabilities across all service sectors.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Calls</h3>
              <p className="text-gray-600">Direct voice communication with service providers.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
              <p className="text-gray-600">Smart suggestions tailored to each service industry.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">Fully adaptable to any service industry requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Multi-Sector Service Technology</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Our cutting-edge platform combines artificial intelligence with seamless communication technology to revolutionize service delivery across all industries.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6">Platform Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-600">For Service Providers:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete service catalog management with customization rules</li>
                  <li>• Real-time booking and appointment processing</li>
                  <li>• Customer communication via SMS and voice</li>
                  <li>• AI-driven analytics and insights</li>
                  <li>• Multi-channel booking (web, SMS, phone)</li>
                  <li>• Automated scheduling and notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-green-600">For Customers:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personalized service recommendations</li>
                  <li>• Flexible booking through multiple channels</li>
                  <li>• Real-time appointment tracking and updates</li>
                  <li>• Custom service builder with smart suggestions</li>
                  <li>• Seamless payment and service coordination</li>
                  <li>• AI-powered service matching</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Info */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the Future of Service Industries</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our platform transforms how service businesses operate and how customers connect with them across all sectors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Brain className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-300">Intelligent recommendations and matching across all service sectors</p>
            </div>
            <div>
              <MessageSquare className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Real Communication</h3>
              <p className="text-gray-300">Actual SMS and voice integration for genuine customer interaction</p>
            </div>
            <div>
              <Settings className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fully Customizable</h3>
              <p className="text-gray-300">Adapts to any service industry with sector-specific features</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
