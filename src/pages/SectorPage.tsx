import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, ArrowLeft, Phone, MessageSquare, Star, Calendar, Clock, Award } from "lucide-react";
import { getSectorById, type Sector, type ParsedCategory } from "../lib/sectors";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks/use-toast";
import { parseUniversalSectorData, getSectorFeatures, getSectorServiceImage, type UniversalSectorData, type SectorFeatures } from "../utils/universalSectorParser";

interface SectorPageProps {
  sectorId?: string;
}

export default function SectorPage({ sectorId }: SectorPageProps) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorData, setSectorData] = useState<UniversalSectorData | null>(null);
  const [sectorFeatures, setSectorFeatures] = useState<SectorFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();
  const { toast } = useToast();

  // Get sector from URL params if not provided
  const urlParams = new URLSearchParams(window.location.search);
  const currentSectorId = sectorId || urlParams.get('sector') || 'food_delivery';
  const sector = getSectorById(currentSectorId);

  useEffect(() => {
    loadSectorData();
  }, [currentSectorId]);

  const loadSectorData = async () => {
    if (!sector) {
      setError("Sector not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔥 SECTOR PAGE: Loading data for ${currentSectorId} using universal parser`);
      
      // Use universal parser
      const data = await parseUniversalSectorData(currentSectorId);
      const features = getSectorFeatures(currentSectorId);
      
      console.log(`🔍 SECTOR PAGE: Universal parser returned:`, data);
      
      setSectorData(data);
      setSectorFeatures(features);
      
      if (data.errorMessage) {
        console.warn(`⚠️ SECTOR PAGE: ${data.errorMessage}`);
      }
      
      console.log(`🎯 SECTOR PAGE: Successfully loaded ${data.categories.length} categories for ${currentSectorId}`);
      console.log(`🎯 SECTOR PAGE: Categories:`, data.categories);
      
    } catch (error) {
      console.error(`❌ SECTOR PAGE: Error loading sector data for ${currentSectorId}:`, error);
      setError("Failed to load sector data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: any, category: ParsedCategory) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: getSectorServiceImage(item.name, category.name, currentSectorId)
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const filteredCategories = sectorData?.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  // Debug logging
  console.log(`🔍 SECTOR PAGE DEBUG: ${currentSectorId}`, {
    sectorData: sectorData,
    hasData: sectorData?.hasData,
    categoriesCount: sectorData?.categories.length,
    filteredCount: filteredCategories.length,
    searchTerm
  });

  if (!sector) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Sector Not Found</h1>
          <Button onClick={() => setLocation('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url('${sector.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => setLocation('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sectors
            </Button>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{sector.icon}</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{sector.displayName}</h1>
                <p className="text-xl text-gray-200">{sector.description}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Services</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadSectorData} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
                <div className="text-6xl mb-4">{sector?.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No matching services found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse all services below.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => window.open('tel:+18043601129', '_self')}
                    style={{ backgroundColor: sector?.primaryColor }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call for Service
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/contact')}
                  >
                    Request Service
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold text-secondary mb-6">{category.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img 
                            src={getSectorServiceImage(item.name, category.name, currentSectorId)}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-secondary mb-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold" style={{ color: sector.primaryColor }}>
                              ${item.price.toFixed(2)}
                            </p>
                            <Button
                              onClick={() => handleAddToCart(item, category)}
                              style={{ 
                                backgroundColor: sector.primaryColor,
                                borderColor: sector.primaryColor 
                              }}
                              className="hover:opacity-90"
                            >
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
