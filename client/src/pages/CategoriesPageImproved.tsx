import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ShoppingCart, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import CustomizationModal from "@/components/CustomizationModal";
import { getSectorById, parsePrompt2File, parseRulesFile, type ParsedCategory, type ParsedRule } from "@/lib/sectors";
import { Link } from "wouter";

// Helper function to get service image based on item name and category
const getServiceImage = (itemName: string, categoryName: string, sectorId?: string): string => {
  const name = itemName.toLowerCase();
  const category = categoryName.toLowerCase();
  
  // Auto Repair Services
  if (sectorId === "auto_repair" || category.includes("engine") || category.includes("brake") || category.includes("tire") || category.includes("electrical") || category.includes("air conditioning")) {
    if (category.includes("engine") || name.includes("oil") || name.includes("tune")) return "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop&auto=format";
    if (category.includes("brake") || name.includes("brake")) return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&auto=format";
    if (category.includes("tire") || name.includes("tire") || name.includes("wheel")) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format";
    if (category.includes("electrical") || name.includes("battery") || name.includes("alternator")) return "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=300&fit=crop&auto=format";
    if (category.includes("air conditioning") || name.includes("ac")) return "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&auto=format";
  }
  
  // Beauty Salon Services
  if (sectorId === "beauty_salon" || category.includes("hair") || category.includes("nail") || category.includes("facial") || category.includes("massage")) {
    if (category.includes("hair") || name.includes("haircut") || name.includes("color")) return "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format";
    if (category.includes("nail") || name.includes("manicure") || name.includes("pedicure")) return "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&auto=format";
    if (category.includes("facial") || name.includes("facial") || name.includes("skin")) return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&auto=format";
    if (category.includes("massage") || name.includes("massage")) return "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop&auto=format";
  }
  
  // Education & Tutoring Services
  if (sectorId === "education_tutoring" || category.includes("tutoring") || category.includes("lesson") || category.includes("course")) {
    if (name.includes("math") || name.includes("algebra") || name.includes("calculus")) return "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop&auto=format";
    if (name.includes("english") || name.includes("writing") || name.includes("literature")) return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format";
    if (name.includes("science") || name.includes("chemistry") || name.includes("physics")) return "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop&auto=format";
    if (name.includes("computer") || name.includes("coding") || name.includes("programming")) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop&auto=format";
  }
  
  // Healthcare Services
  if (sectorId === "healthcare" || category.includes("medical") || category.includes("dental") || category.includes("therapy")) {
    if (category.includes("dental") || name.includes("dental") || name.includes("teeth")) return "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop&auto=format";
    if (category.includes("therapy") || name.includes("therapy") || name.includes("physical")) return "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format";
    if (name.includes("checkup") || name.includes("consultation")) return "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format";
  }
  
  // Event Planning Services
  if (sectorId === "event_planning" || category.includes("event") || category.includes("wedding") || category.includes("party")) {
    if (category.includes("wedding") || name.includes("wedding")) return "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&auto=format";
    if (category.includes("party") || name.includes("birthday") || name.includes("celebration")) return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop&auto=format";
    if (name.includes("corporate") || name.includes("conference")) return "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop&auto=format";
  }
  
  // Financial Services
  if (sectorId === "financial_services" || category.includes("financial") || category.includes("investment") || category.includes("insurance")) {
    if (name.includes("investment") || name.includes("portfolio")) return "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&auto=format";
    if (name.includes("insurance") || name.includes("policy")) return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop&auto=format";
    if (name.includes("loan") || name.includes("mortgage")) return "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format";
  }
  
  // Default service image
  return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format";
};

// Function to load sector-specific content
const loadSectorContent = async (sectorId: string): Promise<{ categories: ParsedCategory[], rules: Record<string, ParsedRule[]> }> => {
  try {
    let prompt2Content = "";
    let rulesContent = "";
    
    // Try to load sector-specific files directly from sectors folder
    try {
      const prompt2Response = await fetch(`/sectors/${sectorId}_prompt2.txt`);
      if (prompt2Response.ok) {
        prompt2Content = await prompt2Response.text();
        console.log(`Loaded prompt2 for ${sectorId}`);
      }
    } catch (error) {
      console.log(`No prompt2 file found for ${sectorId}`);
    }
    
    try {
      const rulesResponse = await fetch(`/sectors/${sectorId}_rules.txt`);
      if (rulesResponse.ok) {
        rulesContent = await rulesResponse.text();
        console.log(`Loaded rules for ${sectorId}`);
      }
    } catch (error) {
      console.log(`No rules file found for ${sectorId}`);
    }
    
    // If no sector-specific files found, try with attached_assets folder and timestamps
    if (!prompt2Content) {
      const timestamps = ['1749900541844', '1749900541845', '1749900541846', '1749900541841'];
      
      for (const timestamp of timestamps) {
        try {
          const prompt2Response = await fetch(`/attached_assets/${sectorId}_prompt2_${timestamp}.txt`);
          if (prompt2Response.ok) {
            prompt2Content = await prompt2Response.text();
            console.log(`Loaded prompt2 for ${sectorId} with timestamp ${timestamp}`);
            break;
          }
        } catch (error) {
          // Continue to next timestamp
        }
      }
    }
    
    if (!rulesContent) {
      const timestamps = ['1749900541844', '1749900541845', '1749900541846', '1749900541841'];
      
      for (const timestamp of timestamps) {
        try {
          const rulesResponse = await fetch(`/attached_assets/${sectorId}_rules_${timestamp}.txt`);
          if (rulesResponse.ok) {
            rulesContent = await rulesResponse.text();
            console.log(`Loaded rules for ${sectorId} with timestamp ${timestamp}`);
            break;
          }
        } catch (error) {
          // Continue to next timestamp
        }
      }
    }
    
    // If still no files found, try default files
    if (!prompt2Content) {
      try {
        const defaultResponse = await fetch('/attached_assets/prompt2.txt');
        if (defaultResponse.ok) {
          prompt2Content = await defaultResponse.text();
          console.log('Loaded default prompt2.txt');
        }
      } catch (error) {
        console.error('Error loading default prompt2.txt:', error);
      }
    }
    
    if (!rulesContent) {
      try {
        const defaultResponse = await fetch('/attached_assets/rules.txt');
        if (defaultResponse.ok) {
          rulesContent = await defaultResponse.text();
          console.log('Loaded default rules.txt');
        }
      } catch (error) {
        console.error('Error loading default rules.txt:', error);
      }
    }
    
    const categories = prompt2Content ? parsePrompt2File(prompt2Content) : [];
    const rules = rulesContent ? parseRulesFile(rulesContent) : {};
    
    console.log(`Parsed ${categories.length} categories for ${sectorId}`);
    
    return { categories, rules };
  } catch (error) {
    console.error('Error loading sector content:', error);
    return { categories: [], rules: {} };
  }
};

interface CategoryItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Rule {
  name: string;
  type: "select_one" | "select_multiple";
  max_selections?: number;
  options: RuleOption[];
}

interface RuleOption {
  name: string;
  price: number;
  size: string;
}

interface Category {
  name: string;
  image: string;
  hasRules?: boolean;
  rules?: Rule[];
  items: CategoryItem[];
}

export default function CategoriesPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    item?: CategoryItem;
    category?: Category;
  }>({ isOpen: false });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSector, setCurrentSector] = useState<string>("");
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [location] = useLocation();

  // Extract sector from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sectorParam = urlParams.get('sector');
    if (sectorParam) {
      setCurrentSector(sectorParam);
      loadSectorData(sectorParam);
    } else {
      // Default to food service if no sector specified
      loadSectorData('food_service');
    }
  }, [location]);

  const loadSectorData = async (sectorId: string) => {
    setLoading(true);
    try {
      const { categories: parsedCategories, rules } = await loadSectorContent(sectorId);
      
      // Convert parsed categories to the expected format
      const formattedCategories: Category[] = parsedCategories.map(category => ({
        name: category.name,
        image: "🔧", // Default icon for services
        hasRules: category.hasRules,
        rules: category.rules ? category.rules.map(rule => ({
          name: rule.name,
          type: rule.type,
          max_selections: rule.max_selections,
          options: rule.options
        })) : undefined,
        items: category.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description
        }))
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error loading sector data:', error);
      toast({
        title: "Error",
        description: "Failed to load sector data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleAddToCart = (item: CategoryItem, category: Category) => {
    if (category.hasRules && category.rules) {
      setModalData({
        isOpen: true,
        item,
        category
      });
    } else {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: getServiceImage(item.name, category.name, currentSector),
        },
      });
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const currentSectorInfo = getSectorById(currentSector);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/sectors">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sectors
              </Button>
            </Link>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentSectorInfo ? currentSectorInfo.displayName : "Our Services"}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {currentSectorInfo ? currentSectorInfo.description : "Explore our comprehensive service offerings"}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-full border-0 shadow-lg text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search terms or check back later for new services.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.name);
              
              return (
                <Card key={category.name} className="shadow-lg hover:shadow-xl transition-shadow">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{category.image}</div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary">{category.name}</h3>
                        <p className="text-gray-600">{category.items.length} services available</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {category.hasRules && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          Customizable
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="space-y-4">
                        {category.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                          >
                            <img 
                              src={getServiceImage(item.name, category.name, currentSector)}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format";
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-secondary">{item.name}</h4>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                              )}
                              <p className="text-primary font-bold mt-2">${item.price.toFixed(2)}</p>
                            </div>
                            <Button
                              onClick={() => handleAddToCart(item, category)}
                              size="sm"
                              className="ml-4 bg-primary hover:bg-primary/90 flex-shrink-0"
                            >
                              <ShoppingCart size={16} className="mr-1" />
                              {category.hasRules ? "Customize" : "Add"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Customization Modal */}
      {modalData.isOpen && modalData.item && modalData.category && (
        <CustomizationModal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ isOpen: false })}
          item={modalData.item}
          category={{
            name: modalData.category.name,
            image: getServiceImage(modalData.item.name, modalData.category.name, currentSector)
          }}
          rules={modalData.category.rules || []}
          itemImage={getServiceImage(modalData.item.name, modalData.category.name, currentSector)}
        />
      )}
    </div>
  );
}
