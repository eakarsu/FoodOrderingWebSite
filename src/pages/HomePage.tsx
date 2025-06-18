import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Clock, Award, Heart, Brain, Leaf, Star, MessageSquare, Phone, Settings, Search, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Input } from "../components/ui/input";
import { useCart } from "../contexts/CartContext";
import { getAIRecommendations, type AIRecommendation } from "../lib/openai";
import { SECTORS, type Sector, parsePrompt2File, parseRulesFile, type ParsedCategory, type ParsedRule } from "../lib/sectors";
import type { MenuItem } from "@shared/schema";
import ContactUsDirectly from "../components/ContactUsDirectly";
import { parseUniversalSectorData } from "../utils/universalSectorParser";

interface SearchResult {
  type: 'sector' | 'service' | 'item' | 'rule';
  sector: Sector;
  title: string;
  description: string;
  category?: string;
  price?: number;
}

export default function HomePage() {
  const { dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [, setLocation] = useLocation();

  // Enhanced search function
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const searchLower = term.toLowerCase();

    try {
      // Search through all sectors
      for (const sector of SECTORS) {
        // Search sector name and description
        if (sector.displayName.toLowerCase().includes(searchLower) ||
            sector.description.toLowerCase().includes(searchLower)) {
          results.push({
            type: 'sector',
            sector,
            title: sector.displayName,
            description: sector.description
          });
        }

        try {
          // Load and search sector data (services, items, rules)
          const sectorData = await parseUniversalSectorData(sector.id);
          
          // Search through categories and items
          sectorData.categories.forEach(category => {
            // Search category name
            if (category.name.toLowerCase().includes(searchLower)) {
              results.push({
                type: 'service',
                sector,
                title: category.name,
                description: `Service category in ${sector.displayName}`,
                category: category.name
              });
            }

            // Search through items in this category
            category.items.forEach(item => {
              if (item.name.toLowerCase().includes(searchLower) ||
                  (item.description && item.description.toLowerCase().includes(searchLower))) {
                results.push({
                  type: 'item',
                  sector,
                  title: item.name,
                  description: item.description || `Service item in ${category.name}`,
                  category: category.name,
                  price: item.price
                });
              }
            });
          });

          // Search through rules
          if (sectorData.features.hasRules && sectorData.rules) {
            Object.entries(sectorData.rules).forEach(([ruleCategory, rules]) => {
              if (Array.isArray(rules)) {
                rules.forEach(rule => {
                  if (typeof rule === 'string' && rule.toLowerCase().includes(searchLower)) {
                    results.push({
                      type: 'rule',
                      sector,
                      title: `${ruleCategory} Rule`,
                      description: rule,
                      category: ruleCategory
                    });
                  }
                });
              }
            });
          }
        } catch (error) {
          console.warn(`Failed to search sector ${sector.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }

    setSearchResults(results);
    setIsSearching(false);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter sectors based on search results
  const filteredSectors = searchTerm.trim() ? 
    SECTORS.filter(sector => 
      searchResults.some(result => result.sector.id === sector.id)
    ) : SECTORS;


  const handleSectorClick = (sector: Sector) => {
    // Direct to categories page with universal parser
    setSelectedSector(sector);
    localStorage.setItem('selectedSector', sector.id);
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
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  document.getElementById('sectors-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
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
      <section id="sectors-section" className="py-16 bg-white">
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
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search industries, services, items, or rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchTerm.trim() && searchResults.length > 0 && (
              <div className="absolute z-50 w-full max-w-2xl mx-auto mt-2 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto">
                {searchResults.slice(0, 10).map((result, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSectorClick(result.sector)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-primary">
                            {result.type === 'sector' && '🏢 Sector'}
                            {result.type === 'service' && '🔧 Service'}
                            {result.type === 'item' && '📋 Item'}
                            {result.type === 'rule' && '📜 Rule'}
                          </span>
                          <span className="text-xs text-gray-500">
                            in {result.sector.displayName}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {result.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {result.description}
                        </p>
                        {result.price && (
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            ${result.price}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </div>
                ))}
                {searchResults.length > 10 && (
                  <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                    Showing first 10 of {searchResults.length} results
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSectors.map((sector) => (
              <Link key={sector.id} href={`/categories?sector=${sector.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="text-3xl p-3 rounded-lg shadow-sm"
                        style={{ backgroundColor: `${sector.primaryColor}20`, color: sector.primaryColor }}
                      >
                        {sector.icon}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                      {sector.displayName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {sector.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <div 
                        className="text-xs px-2 py-1 rounded-full inline-block"
                        style={{ backgroundColor: `${sector.primaryColor}10`, color: sector.primaryColor }}
                      >
                        AI-Enabled
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full inline-block bg-gray-100 text-gray-600">
                        {sector.sectorType === 'immediate' ? '⚡ Immediate' :
                         sector.sectorType === 'consultation' ? '💼 Consultation' :
                         sector.sectorType === 'product' ? '📦 Product' :
                         sector.sectorType === 'experience' ? '🎯 Experience' : '🔧 Service'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {searchTerm.trim() && filteredSectors.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms to find services, items, or rules.
                </p>
              </div>
            </div>
          )}

          {searchTerm.trim() && searchResults.length > 0 && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Found {searchResults.length} results across {filteredSectors.length} sectors
              </p>
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
