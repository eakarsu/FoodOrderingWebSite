import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem } from "@shared/schema";

export default function MenuPage() {
  const { dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const handleAddToCart = (item: MenuItem) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price.toString()),
        image: item.image,
      },
    });
  };

  const filteredItems = menuItems?.filter((item) => {
    // Comprehensive search that looks through name, description, category, and tags
    const searchLower = searchTerm.toLowerCase().trim();
    
    let matchesSearch = true;
    if (searchLower !== "") {
      matchesSearch = item.name.toLowerCase().includes(searchLower) ||
                     item.description.toLowerCase().includes(searchLower) ||
                     item.category.toLowerCase().includes(searchLower) ||
                     (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)));
    }
    
    // If searching, only apply search filter, ignore category filter to show all relevant results
    if (searchLower !== "") {
      return matchesSearch;
    }
    
    // If not searching, apply category filter
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "healthy") return matchesSearch && item.tags?.includes("healthy");
    if (activeFilter === "spicy") return matchesSearch && item.tags?.includes("spicy");
    if (activeFilter === "vegetarian") return matchesSearch && item.tags?.includes("vegetarian");
    if (activeFilter === "vegan") return matchesSearch && item.tags?.includes("vegan");
    
    return matchesSearch && item.category === activeFilter;
  });

  const categories = [
    { id: "all", name: "All", icon: null },
    { id: "acai-bowls", name: "Acai Bowls", icon: null },
    { id: "breakfast-combos", name: "Breakfast Combos", icon: null },
    { id: "cold-sandwiches", name: "Cold Sandwiches", icon: null },
    { id: "hot-sandwiches", name: "Hot Sandwiches", icon: null },
    { id: "paninis", name: "Paninis", icon: null },
    { id: "salads", name: "Salads", icon: null },
    { id: "omelets", name: "Omelets", icon: null },
    { id: "grill-menu", name: "Grill Menu", icon: null },
    { id: "desserts", name: "Desserts", icon: null },
    { id: "bottled-drinks", name: "Drinks", icon: null },
    { id: "healthy", name: "Healthy Options", icon: Leaf },
    { id: "spicy", name: "Spicy", icon: Sprout },
  ];

  const groupedItems = filteredItems?.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Our Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated selection of gourmet dishes, crafted with passion and the finest ingredients.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1"></div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeFilter === category.id ? "default" : "secondary"}
                    className={activeFilter === category.id ? "bg-primary hover:bg-primary/90" : ""}
                    onClick={() => setActiveFilter(category.id)}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-1" />}
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="space-y-16">
            {["Appetizers", "Main Courses", "Desserts"].map((categoryName) => (
              <div key={categoryName}>
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedItems || {}).map(([category, items]) => {
              const categoryName = category === "acai-bowls" ? "Acai Bowls" :
                                  category === "breakfast-combos" ? "Breakfast Combos" :
                                  category === "cold-sandwiches" ? "Cold Sandwiches" :
                                  category === "hot-sandwiches" ? "Hot Sandwiches" :
                                  category === "grill-menu" ? "Grill Menu" :
                                  category === "bottled-drinks" ? "Drinks" :
                                  category.charAt(0).toUpperCase() + category.slice(1);
              
              return (
                <div key={category}>
                  <h2 className="text-3xl font-bold text-secondary mb-8 border-b-2 border-primary pb-2">
                    {categoryName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-secondary mb-2">{item.name}</h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-primary">${item.price}</span>
                            <Button
                              onClick={() => handleAddToCart(item)}
                              className="bg-primary hover:bg-primary/90 text-white"
                            >
                              Add to Cart
                            </Button>
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag === "vegetarian" && <Leaf className="h-3 w-3 mr-1" />}
                                  {tag === "vegan" && <Sprout className="h-3 w-3 mr-1" />}
                                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredItems && filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No dishes found matching your search criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
