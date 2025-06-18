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
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
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
              Choose Your Service Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select from our 4 main service categories. Each category contains multiple sectors powered by AI with SMS integration and voice call capabilities.
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

          {/* Service Classifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Immediate Services */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 hover:border-orange-500/50"
              onClick={() => setLocation('/sector-classification?type=immediate')}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3">
                  Immediate Services
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  AI-powered predictive scheduling, emergency triage, and real-time optimization for urgent service needs.
                </p>
                <div className="text-xs px-3 py-1 rounded-full inline-block bg-orange-100 text-orange-700 font-medium mb-4">
                  {SECTORS.filter(s => s.sectorType === 'immediate').length} Sectors • AI-Enhanced
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Auto Repair • Healthcare • Beauty • Home Services
                </div>
                <div className="text-xs bg-orange-50 p-2 rounded-lg text-orange-800 mb-3">
                  🤖 Smart Scheduling • 🚨 Emergency Triage • 📊 Predictive Analytics
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors mx-auto mt-4" />
              </CardContent>
            </Card>

            {/* Consultation Services */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 hover:border-blue-500/50"
              onClick={() => setLocation('/sector-classification?type=consultation')}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  Consultation Services
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  AI document analysis, automated compliance checking, and intelligent case management with multilingual support.
                </p>
                <div className="text-xs px-3 py-1 rounded-full inline-block bg-blue-100 text-blue-700 font-medium mb-4">
                  {SECTORS.filter(s => s.sectorType === 'consultation').length} Sectors • AI-Enhanced
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Legal • Financial • Insurance • IT Services
                </div>
                <div className="text-xs bg-blue-50 p-2 rounded-lg text-blue-800 mb-3">
                  📄 Document AI • 🌐 Translation • ⚖️ Compliance Automation
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors mx-auto mt-4" />
              </CardContent>
            </Card>

            {/* Product & Retail */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 hover:border-green-500/50"
              onClick={() => setLocation('/sector-classification?type=product')}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-3">
                  Product & Retail
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Intelligent inventory management, automated email processing, and AI-powered sales optimization systems.
                </p>
                <div className="text-xs px-3 py-1 rounded-full inline-block bg-green-100 text-green-700 font-medium mb-4">
                  {SECTORS.filter(s => s.sectorType === 'product').length} Sectors • AI-Enhanced
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Food Delivery • Laundry Services
                </div>
                <div className="text-xs bg-green-50 p-2 rounded-lg text-green-800 mb-3">
                  📧 Email AI • 💰 Revenue Intelligence • 🔄 Workflow Automation
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors mx-auto mt-4" />
              </CardContent>
            </Card>

            {/* Experience Services */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 hover:border-purple-500/50"
              onClick={() => setLocation('/sector-classification?type=experience')}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-3">
                  Experience Services
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Collaborative AI agents, multi-modal interactions, and autonomous task execution for enhanced experiences.
                </p>
                <div className="text-xs px-3 py-1 rounded-full inline-block bg-purple-100 text-purple-700 font-medium mb-4">
                  {SECTORS.filter(s => s.sectorType === 'experience').length} Sectors • AI-Enhanced
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Education • Events • Photography • Travel
                </div>
                <div className="text-xs bg-purple-50 p-2 rounded-lg text-purple-800 mb-3">
                  🤝 Collaborative AI • 🎭 Multi-Modal • 🧠 Self-Learning
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors mx-auto mt-4" />
              </CardContent>
            </Card>
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

      {/* Live AI Features Demo Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🚀 Try Our AI Features Live
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Experience the power of our AI-driven platform with real-time demos and interactive features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">AI Features Dashboard</h3>
                <p className="text-purple-100 mb-4">
                  Explore predictive scheduling, email automation, document processing, and more
                </p>
                <Link href="/ai-features">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    Try AI Features →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
                <p className="text-purple-100 mb-4">
                  View real-time metrics, predictive analytics, and business intelligence
                </p>
                <Link href="/analytics">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    View Analytics →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Workflow Automation</h3>
                <p className="text-purple-100 mb-4">
                  Create and manage automated workflows with collaborative AI agents
                </p>
                <Link href="/workflows">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    Manage Workflows →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🎯 What You Can Do Right Now:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="font-semibold mb-2">✨ AI-Powered Features:</h4>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• Test predictive scheduling algorithms</li>
                    <li>• Try automated email categorization</li>
                    <li>• Experience real-time translation</li>
                    <li>• Interact with collaborative AI agents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Live Analytics:</h4>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• View real-time performance metrics</li>
                    <li>• Generate predictive business reports</li>
                    <li>• Analyze customer behavior patterns</li>
                    <li>• Monitor workflow automation status</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Directly Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ContactUsDirectly />
        </div>
      </section>

      {/* Advanced AI Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Advanced AI-Powered Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Experience next-generation AI capabilities that transform how businesses operate and serve customers across all sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Scheduling</h3>
              <p className="text-gray-600 text-sm">AI learns preferences to optimize scheduling, reducing conflicts by 16% and improving efficiency.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Email Management</h3>
              <p className="text-gray-600 text-sm">AI categorizes, prioritizes, and responds to emails, saving 30+ minutes daily.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Modal AI</h3>
              <p className="text-gray-600 text-sm">Visual, spatial, and gestural inputs with real-time translation across 50+ languages.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Call Handling</h3>
              <p className="text-gray-600 text-sm">AI answers every call, handles inquiries, books appointments, and converts leads automatically.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
              <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workflow Automation</h3>
              <p className="text-gray-600 text-sm">Multi-step process automation for approvals, submissions, and complex business workflows.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <div className="bg-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-gray-600 text-sm">Advanced insights into customer behavior, service efficiency, and business optimization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sector-Specific AI Enhancements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Sector-Specific AI Intelligence
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Specialized AI capabilities tailored for each industry sector, providing deep domain expertise and automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">🏥</div>
                <h3 className="font-bold text-lg mb-3 text-green-700">Healthcare AI</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Patient triage & symptom assessment</li>
                  <li>• Medical appointment optimization</li>
                  <li>• Insurance verification automation</li>
                  <li>• Prescription refill management</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">⚖️</div>
                <h3 className="font-bold text-lg mb-3 text-blue-700">Legal AI</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Case research & document analysis</li>
                  <li>• Automated billing & time tracking</li>
                  <li>• Client intake automation</li>
                  <li>• Court date management</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold text-lg mb-3 text-purple-700">Financial AI</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Portfolio analysis & recommendations</li>
                  <li>• Compliance checking automation</li>
                  <li>• Risk assessment for applications</li>
                  <li>• Personalized financial planning</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="font-bold text-lg mb-3 text-orange-700">Service AI</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Emergency response prioritization</li>
                  <li>• Resource optimization</li>
                  <li>• Quality assurance automation</li>
                  <li>• Performance monitoring</li>
                </ul>
              </div>
            </Card>
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
