import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

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

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    name: string;
    price: number;
    description?: string;
  };
  category: {
    name: string;
    image: string;
  };
  rules: Rule[];
  itemImage: string;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  item,
  category,
  rules,
  itemImage
}: CustomizationModalProps) {
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleSelectionChange = (ruleName: string, optionName: string, isSelected: boolean) => {
    setSelections(prev => {
      const currentSelections = prev[ruleName] || [];
      const rule = rules.find(r => r.name === ruleName);
      
      if (!rule) return prev;
      
      if (rule.type === "select_one") {
        return {
          ...prev,
          [ruleName]: isSelected ? [optionName] : []
        };
      } else {
        const maxSelections = rule.max_selections || Infinity;
        let newSelections;
        
        if (isSelected) {
          if (currentSelections.length < maxSelections) {
            newSelections = [...currentSelections, optionName];
          } else {
            newSelections = currentSelections;
          }
        } else {
          newSelections = currentSelections.filter(name => name !== optionName);
        }
        
        return {
          ...prev,
          [ruleName]: newSelections
        };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = item.price;
    
    Object.entries(selections).forEach(([ruleName, selectedOptions]) => {
      const rule = rules.find(r => r.name === ruleName);
      if (rule) {
        selectedOptions.forEach(optionName => {
          const option = rule.options.find(o => o.name === optionName);
          if (option) {
            total += option.price;
          }
        });
      }
    });
    
    return total;
  };

  const handleAddToCart = () => {
    // Create customized item name
    const selectedOptionsText = Object.entries(selections)
      .filter(([_, options]) => options.length > 0)
      .map(([ruleName, options]) => `${ruleName}: ${options.join(", ")}`)
      .join(" | ");
    
    const customizedName = selectedOptionsText 
      ? `${item.name} (${selectedOptionsText})`
      : item.name;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: Date.now(), // Use timestamp to ensure unique ID for customized items
        name: customizedName,
        price: calculateTotalPrice(),
        image: itemImage
      }
    });

    toast({
      title: "Added to cart",
      description: `Customized ${item.name} has been added to your cart.`,
    });

    onClose();
    setSelections({});
  };

  const isValidSelection = () => {
    return rules.every(rule => {
      const ruleSelections = selections[rule.name] || [];
      if (rule.type === "select_one") {
        return ruleSelections.length <= 1;
      }
      return ruleSelections.length <= (rule.max_selections || Infinity);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customize {item.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={itemImage}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  )}
                  <p className="text-primary font-bold mt-1">Base Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Rules */}
          {rules.map((rule) => (
            <Card key={rule.name}>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">
                  {rule.name}
                  {rule.type === "select_one" && " (Choose 1)"}
                  {rule.type === "select_multiple" && rule.max_selections && 
                    ` (Choose up to ${rule.max_selections})`}
                </h4>

                {rule.type === "select_one" ? (
                  <RadioGroup
                    value={selections[rule.name]?.[0] || ""}
                    onValueChange={(value) => {
                      const currentSelection = selections[rule.name]?.[0];
                      if (currentSelection) {
                        handleSelectionChange(rule.name, currentSelection, false);
                      }
                      if (value) {
                        handleSelectionChange(rule.name, value, true);
                      }
                    }}
                  >
                    {rule.options.map((option) => (
                      <div key={option.name} className="flex items-center space-x-2 p-2 border rounded">
                        <RadioGroupItem value={option.name} id={`${rule.name}-${option.name}`} />
                        <Label 
                          htmlFor={`${rule.name}-${option.name}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.name}</span>
                            <span className="font-semibold">
                              {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                            </span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {rule.options.map((option) => {
                      const isSelected = selections[rule.name]?.includes(option.name) || false;
                      const currentCount = selections[rule.name]?.length || 0;
                      const maxReached = rule.max_selections && currentCount >= rule.max_selections;
                      const isDisabled = !isSelected && maxReached;

                      return (
                        <div key={option.name} className="flex items-center space-x-2 p-2 border rounded">
                          <Checkbox
                            id={`${rule.name}-${option.name}`}
                            checked={isSelected}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => 
                              handleSelectionChange(rule.name, option.name, Boolean(checked))
                            }
                          />
                          <Label 
                            htmlFor={`${rule.name}-${option.name}`}
                            className={`flex-1 cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{option.name}</span>
                              <span className="font-semibold">
                                {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                              </span>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Total and Add to Cart */}
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-xl font-bold text-primary">
                  ${calculateTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button 
                onClick={handleAddToCart}
                disabled={!isValidSelection()}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}