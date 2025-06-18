import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { parseUniversalSectorData, getSectorServiceImage, type UniversalSectorData } from "@/utils/universalSectorParser";

interface CategoryItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface RuleOption {
  name: string;
  price: number;
  size: string;
}

interface Rule {
  name: string;
  type: "select_one" | "select_multiple";
  max_selections?: number;
  options: RuleOption[];
}

interface Category {
  name: string;
  image: string;
  hasRules?: boolean;
  rules?: Rule[];
  items: CategoryItem[];
}

export default function CategoriesPage() {
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    category?: Category;
  }>({ isOpen: false });
  const [customizationModal, setCustomizationModal] = useState<{
    isOpen: boolean;
    item?: CategoryItem;
    category?: Category;
  }>({ isOpen: false });
  const [loading, setLoading] = useState(true);
  const [sectorData, setSectorData] = useState<UniversalSectorData | null>(null);
  const [currentSector, setCurrentSector] = useState<string>('food_delivery');
  const { dispatch } = useCart();
  const { toast } = useToast();

  // Get sector from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sectorParam = urlParams.get('sector');

  useEffect(() => {
    if (sectorParam) {
      setCurrentSector(sectorParam);
      loadSectorData(sectorParam);
    } else {
      setLoading(false);
      // Don't load any sector data if no sector is specified
    }
  }, [sectorParam]);

  const loadSectorData = async (sectorId: string) => {
    setLoading(true);
    try {
      console.log(`📋 CATEGORIES: Loading data for ${sectorId} using universal parser`);
      
      // Use universal parser
      const data = await parseUniversalSectorData(sectorId);
      setSectorData(data);
      
      if (data.errorMessage) {
        console.warn(`⚠️ CATEGORIES: ${data.errorMessage}`);
      }
      
      console.log(`✅ CATEGORIES: Successfully loaded ${data.categories.length} categories for ${sectorId}`);
      
    } catch (error) {
      console.error(`❌ CATEGORIES: Error loading sector data for ${sectorId}:`, error);
      // Set empty data as fallback
      setSectorData({
        sectorId,
        categories: [],
        rules: {},
        hasData: false,
        errorMessage: "Failed to load sector data"
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert universal sector data to display format
  const displayData = sectorParam && sectorData ? sectorData.categories.map(cat => ({
    name: cat.name,
    image: "🔧", // Default icon
    hasRules: cat.hasRules,
    rules: cat.rules,
    items: cat.items
  })) : [];

  const handleCategoryClick = (categoryName: string) => {
    const category = displayData.find(cat => cat.name === categoryName);
    if (category) {
      setCategoryModal({
        isOpen: true,
        category: category
      });
    }
  };

  const handleAddToCart = (item: CategoryItem, category: Category) => {
    // Check if item has rules (customizable)
    if (category.hasRules) {
      setCustomizationModal({
        isOpen: true,
        item,
        category
      });
      return;
    }
    
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: getSectorServiceImage(item.name, category.name, currentSector)
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {sectorParam ? `${sectorParam.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Services` : 'Service Categories'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {sectorParam 
              ? `Explore our ${sectorParam.replace(/_/g, ' ')} services organized by categories. Click on any category to see all available items.`
              : 'Select a sector to view available services and categories.'
            }
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : !sectorParam ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Sector</h2>
            <p className="text-gray-600 mb-6">Please choose a sector from the home page to view available services.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Home Page
            </Button>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No services found for this sector.</p>
            <p className="text-sm text-gray-500">
              {sectorData?.errorMessage || "Please try again later or contact support."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayData.map((category) => (
              <Card key={category.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div 
                    className="cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{category.image}</div>
                        <div>
                          <h3 className="text-xl font-bold text-secondary">{category.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                            {category.hasRules && " • Customizable"}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {categoryModal.isOpen && categoryModal.category && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setCategoryModal({ isOpen: false })}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{categoryModal.category.image}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary">{categoryModal.category.name}</h2>
                    <p className="text-gray-600">
                      {categoryModal.category.items.length} items available
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCategoryModal({ isOpen: false })}
                >
                  ✕ Close
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModal.category.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={getSectorServiceImage(item.name, categoryModal.category!.name, currentSector)}
                        alt={item.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
                        }}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-secondary mb-1 text-sm">{item.name}</h4>
                      {item.description && (
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                        <Button
                          onClick={() => handleAddToCart(item, categoryModal.category!)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-xs"
                        >
                          <ShoppingCart size={12} className="mr-1" />
                          {categoryModal.category!.hasRules ? "Customize" : "Add"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {customizationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Customize {customizationModal.item?.name}</h3>
            <p className="text-gray-600 mb-4">Customization options will be available soon.</p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCustomizationModal({ isOpen: false })}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (customizationModal.item && customizationModal.category) {
                    dispatch({
                      type: "ADD_ITEM",
                      payload: {
                        id: customizationModal.item.id,
                        name: customizationModal.item.name,
                        price: customizationModal.item.price,
                        image: getSectorServiceImage(customizationModal.item.name, customizationModal.category.name, currentSector)
                      }
                    });
                    
                    toast({
                      title: "Added to cart",
                      description: `${customizationModal.item.name} has been added to your cart.`,
                    });
                  }
                  setCustomizationModal({ isOpen: false });
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
