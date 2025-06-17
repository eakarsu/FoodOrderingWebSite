import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Phone, MessageSquare, Star } from "lucide-react";
import { getSectorById, type Sector, type ParsedCategory, type ParsedRule, parsePrompt2File, parseRulesFile } from "@/lib/sectors";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface SectorPageProps {
  sectorId?: string;
}

export default function SectorPage({ sectorId }: SectorPageProps) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<ParsedCategory[]>([]);
  const [rules, setRules] = useState<Record<string, ParsedRule[]>>({});
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
      console.log(`🔥 SECTOR PAGE: Loading data for ${currentSectorId}`);
      
      const cacheBuster = Date.now();
      const prompt2Url = `/sectors/${currentSectorId}_prompt2.txt?v=${cacheBuster}`;
      const rulesUrl = `/sectors/${currentSectorId}_rules.txt?v=${cacheBuster}`;
      
      let prompt2Content = "";
      let rulesContent = "";
      
      // Load prompt2 file
      try {
        const prompt2Response = await fetch(prompt2Url, { cache: 'no-cache' });
        if (prompt2Response.ok) {
          prompt2Content = await prompt2Response.text();
          console.log(`✅ Loaded prompt2 for ${currentSectorId} (${prompt2Content.length} chars)`);
        } else {
          console.warn(`⚠️ No prompt2 file for ${currentSectorId}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error loading prompt2 for ${currentSectorId}:`, error);
      }
      
      // Load rules file
      try {
        const rulesResponse = await fetch(rulesUrl, { cache: 'no-cache' });
        if (rulesResponse.ok) {
          rulesContent = await rulesResponse.text();
          console.log(`✅ Loaded rules for ${currentSectorId} (${rulesContent.length} chars)`);
        } else {
          console.warn(`⚠️ No rules file for ${currentSectorId}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error loading rules for ${currentSectorId}:`, error);
      }
      
      // Parse data
      const parsedCategories = prompt2Content ? parsePrompt2File(prompt2Content) : generateDefaultServices(sector);
      const parsedRules = rulesContent ? parseRulesFile(rulesContent) : {};
      
      setCategories(parsedCategories);
      setRules(parsedRules);
      
      console.log(`🎯 SECTOR PAGE: Loaded ${parsedCategories.length} categories for ${currentSectorId}`);
      
    } catch (error) {
      console.error(`❌ Error loading sector data for ${currentSectorId}:`, error);
      setError("Failed to load sector data");
      // Generate default services as fallback
      setCategories(generateDefaultServices(sector));
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultServices = (sector: Sector): ParsedCategory[] => {
    // Generate realistic default services based on sector type
    const serviceTemplates: Record<string, ParsedCategory[]> = {
      auto_repair: [
        {
          name: "Engine Services",
          items: [
            { id: 1, name: "Oil Change", price: 45.99, description: "Full synthetic oil change with filter replacement" },
            { id: 2, name: "Engine Tune-Up", price: 189.99, description: "Complete engine tune-up and inspection" },
            { id: 3, name: "Engine Diagnostics", price: 99.99, description: "Computer diagnostic scan and analysis" }
          ]
        },
        {
          name: "Brake Services",
          items: [
            { id: 4, name: "Brake Pad Replacement", price: 159.99, description: "Front or rear brake pad replacement" },
            { id: 5, name: "Brake Inspection", price: 29.99, description: "Complete brake system inspection" },
            { id: 6, name: "Brake Fluid Change", price: 79.99, description: "Brake fluid flush and replacement" }
          ]
        }
      ],
      beauty_salon: [
        {
          name: "Hair Services",
          items: [
            { id: 7, name: "Haircut & Style", price: 65.00, description: "Professional cut and styling" },
            { id: 8, name: "Hair Color", price: 120.00, description: "Full color treatment" },
            { id: 9, name: "Hair Highlights", price: 95.00, description: "Partial or full highlights" }
          ]
        },
        {
          name: "Nail Services",
          items: [
            { id: 10, name: "Manicure", price: 35.00, description: "Classic manicure with polish" },
            { id: 11, name: "Pedicure", price: 45.00, description: "Relaxing pedicure treatment" },
            { id: 12, name: "Gel Nails", price: 55.00, description: "Long-lasting gel nail application" }
          ]
        }
      ]
    };

    // Return sector-specific services or generate generic ones
    if (serviceTemplates[sector.id]) {
      return serviceTemplates[sector.id];
    }

    // Generate generic services for other sectors
    return [
      {
        name: `${sector.displayName} Services`,
        items: [
          { id: 100 + Math.random(), name: `Basic ${sector.displayName} Service`, price: 99.99, description: `Professional ${sector.displayName.toLowerCase()} service` },
          { id: 101 + Math.random(), name: `Premium ${sector.displayName} Package`, price: 199.99, description: `Comprehensive ${sector.displayName.toLowerCase()} solution` },
          { id: 102 + Math.random(), name: `${sector.displayName} Consultation`, price: 49.99, description: `Expert consultation for ${sector.displayName.toLowerCase()}` }
        ]
      }
    ];
  };

  const getServiceImage = (serviceName: string, categoryName: string): string => {
    const name = serviceName.toLowerCase();
    const category = categoryName.toLowerCase();
    
    // Sector-specific images
    if (sector?.id === "auto_repair") {
      if (name.includes("oil") || name.includes("engine")) return "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop&auto=format";
      if (name.includes("brake")) return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&auto=format";
      if (name.includes("tire")) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format";
      return "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&auto=format";
    }
    
    if (sector?.id === "beauty_salon") {
      if (name.includes("hair")) return "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format";
      if (name.includes("nail")) return "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&auto=format";
      if (name.includes("facial")) return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&auto=format";
      return "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop&auto=format";
    }
    
    // Default service image
    return sector?.heroImage || "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
  };

  const handleAddToCart = (item: any, category: ParsedCategory) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: getServiceImage(item.name, category.name)
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
              <div className="bg-gray-50 rounded-lg p-8">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search terms.</p>
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
                            src={getServiceImage(item.name, category.name)}
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
