    {
      id: 1,
      name: "Build Your Own Breakfast",
      basePrice: 2.60,
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      category: "breakfast",
      description: "Create your perfect breakfast with our fresh ingredients",
      rules: [
        {
          name: "Breakfast Bread",
          type: "select_one",
          options: [
            { name: "Roll", price: 0.00, size: "Medium" },
            { name: "Hero", price: 1.00, size: "Medium" },
            { name: "Whole Wheat Wrap", price: 1.00, size: "Medium" },
            { name: "Everything Bagel", price: 0.50, size: "Medium" },
            { name: "Plain Bagel", price: 0.50, size: "Medium" },
            { name: "English Muffin", price: 0.50, size: "Medium" }
          ]
        },
        {
          name: "Breakfast Egg Quantity",
          type: "select_one",
          options: [
            { name: "1 Egg", price: 0.75, size: "Small" },
            { name: "2 Eggs", price: 1.50, size: "Small" },
            { name: "3 Eggs", price: 2.25, size: "Small" }
          ]
        },
        {
          name: "Breakfast Egg Option",
          type: "select_one",
          options: [
            { name: "Scrambled", price: 0.00, size: "Small" },
            { name: "Over Easy", price: 0.00, size: "Small" },
            { name: "Over Hard", price: 0.00, size: "Small" },
            { name: "Egg Whites", price: 0.00, size: "Small" }
          ]
        },
        {
          name: "Breakfast Meat",
          type: "select_one",
          options: [
            { name: "No Meat", price: 0.00, size: "Small" },
            { name: "Bacon", price: 2.00, size: "Small" },
            { name: "Sausage", price: 1.50, size: "Small" },
            { name: "Ham", price: 1.50, size: "Small" },
            { name: "Turkey", price: 2.00, size: "Small" }
          ]
        },
        {
          name: "Breakfast Cheese",
          type: "select_multiple",
          max_selections: 2,
          options: [
            { name: "American Cheese", price: 1.00, size: "Medium" },
            { name: "Cheddar", price: 1.00, size: "Medium" },
            { name: "Swiss", price: 1.00, size: "Medium" },
            { name: "Mozzarella", price: 1.00, size: "Medium" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Build Your Own Sandwich",
      basePrice: 16.00,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      category: "sandwiches",
      description: "Craft your ideal sandwich with premium ingredients",
      rules: [
        {
          name: "Bread",
          type: "select_one",
          options: [
            { name: "Roll", price: 0.00, size: "Medium" },
            { name: "Hero", price: 1.00, size: "Medium" },
            { name: "Whole Wheat Wrap", price: 1.00, size: "Medium" },
            { name: "Everything Bagel", price: 0.50, size: "Medium" },
            { name: "Rye Bread (sliced)", price: 0.00, size: "Medium" }
          ]
        },
        {
          name: "Protein",
          type: "select_multiple",
          max_selections: 5,
          options: [
            { name: "House Roast Turkey", price: 2.00, size: "Medium" },
            { name: "Ham", price: 2.00, size: "Medium" },
            { name: "Roast Beef", price: 3.00, size: "Medium" },
            { name: "Grilled Chicken", price: 2.00, size: "Medium" },
            { name: "Tuna Salad", price: 2.00, size: "Medium" },
            { name: "Chicken Salad", price: 2.00, size: "Medium" }
          ]
        },
        {
          name: "Cheese",
          type: "select_multiple",
          max_selections: 5,
          options: [
            { name: "American Cheese", price: 1.00, size: "Medium" },
            { name: "Cheddar", price: 1.00, size: "Medium" },
            { name: "Swiss", price: 1.00, size: "Medium" },
            { name: "Provolone", price: 1.00, size: "Medium" },
            { name: "Fresh Mozzarella", price: 1.00, size: "Medium" }
          ]
        },
        {
          name: "Toppings",
          type: "select_multiple",
          max_selections: 10,
          options: [
            { name: "Lettuce", price: 1.00, size: "Medium" },
            { name: "Tomato", price: 1.00, size: "Medium" },
            { name: "Onion", price: 0.75, size: "Medium" },
            { name: "Avocado", price: 1.50, size: "Medium" },
            { name: "Roasted Red Peppers", price: 1.00, size: "Medium" },
            { name: "Cucumber", price: 0.75, size: "Medium" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Build Your Own Salad",
      basePrice: 9.95,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      category: "salads",
      description: "Create a fresh, healthy salad with your favorite ingredients",
      rules: [
        {
          name: "Salad Base",
          type: "select_one",
          options: [
            { name: "Mixed Greens", price: 0.00, size: "Small" },
            { name: "Romaine", price: 0.00, size: "Small" },
            { name: "Spinach", price: 0.00, size: "Small" }
          ]
        },
        {
          name: "Salad Add-ons",
          type: "select_multiple",
          max_selections: 10,
          options: [
            { name: "Grilled Chicken", price: 2.00, size: "Small" },
            { name: "Grilled Salmon", price: 3.00, size: "Small" },
            { name: "Marinated Steak", price: 3.00, size: "Small" },
            { name: "Feta Cheese", price: 2.00, size: "Small" },
            { name: "Cheddar Cheese", price: 2.00, size: "Small" },
            { name: "Almonds", price: 2.00, size: "Small" },
            { name: "Walnuts", price: 2.00, size: "Small" },
            { name: "Cranberries (dried)", price: 0.50, size: "Small" },
            { name: "Tomatoes", price: 0.50, size: "Small" },
            { name: "Cucumber", price: 0.50, size: "Small" }
          ]
        },
        {
          name: "Salad Dressing",
          type: "select_multiple",
          max_selections: 3,
          options: [
            { name: "Ranch", price: 0.00, size: "Small" },
            { name: "Caesar", price: 0.00, size: "Small" },
            { name: "Balsamic Vinaigrette", price: 0.00, size: "Small" },
            { name: "Italian", price: 0.00, size: "Small" },
            { name: "Oil & Vinegar", price: 0.00, size: "Small" }
          ]
        }
      ]
    }
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "breakfast", name: "Breakfast" },
    { id: "sandwiches", name: "Sandwiches" },
    { id: "salads", name: "Salads" }
  ];

  // Function to filter rules and options based on search term
  const getFilteredRules = (item: CustomizableItem, searchTerm: string) => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    if (searchLower === "") {
      return item.rules; // No search, return all rules
    }
    
    return item.rules
      .map(rule => {
        const ruleNameMatch = rule.name.toLowerCase().includes(searchLower);
        const filteredOptions = rule.options.filter(option => 
          option.name.toLowerCase().includes(searchLower) ||
          option.size.toLowerCase().includes(searchLower)
        );
        
        // Include rule if rule name matches OR if it has matching options
        if (ruleNameMatch || filteredOptions.length > 0) {
          return {
            ...rule,
            options: ruleNameMatch ? rule.options : filteredOptions // Show all options if rule name matches, otherwise filtered options
          };
        }
        return null;
      })
      .filter(rule => rule !== null) as Rule[];
  };

  const filteredItems = customizableItems.filter((item) => {
    // Comprehensive search that looks through name, description, category, rules, and rule options
    const searchLower = searchTerm.toLowerCase().trim();
    
    if (searchLower === "") {
      // If not searching, apply category filter
      if (activeCategory === "all") return true;
      return item.category === activeCategory;
    }
    
    // Search through all possible text fields
    const itemNameMatch = item.name.toLowerCase().includes(searchLower);
    const itemDescMatch = item.description.toLowerCase().includes(searchLower);
    const itemCatMatch = item.category.toLowerCase().includes(searchLower);
    
    // Search through rule names and all option names
    const ruleMatch = item.rules.some(rule => {
      const ruleNameMatch = rule.name.toLowerCase().includes(searchLower);
      const optionMatch = rule.options.some(option => {
        const optionNameMatch = option.name.toLowerCase().includes(searchLower);
        const optionSizeMatch = option.size.toLowerCase().includes(searchLower);
        return optionNameMatch || optionSizeMatch;
      });
      return ruleNameMatch || optionMatch;
    });
    
    return itemNameMatch || itemDescMatch || itemCatMatch || ruleMatch;
  });

  const handleCustomizationChange = (itemId: number, ruleName: string, optionName: string, isChecked: boolean, ruleType: string) => {
    setCustomizations(prev => {
      const itemCustomizations = prev[itemId] || {};
      
      if (ruleType === "select_one") {
        return {
          ...prev,
          [itemId]: {
            ...itemCustomizations,
            [ruleName]: isChecked ? optionName : null
          }
        };
      } else {
        const currentSelections = itemCustomizations[ruleName] || [];
        const newSelections = isChecked
          ? [...currentSelections, optionName]
          : currentSelections.filter((name: string) => name !== optionName);
        
        return {
          ...prev,
          [itemId]: {
            ...itemCustomizations,
            [ruleName]: newSelections
          }
        };
      }
    });
  };

  const calculateTotalPrice = (item: CustomizableItem) => {
    const itemCustomizations = customizations[item.id] || {};
    let totalPrice = item.basePrice;

    item.rules.forEach(rule => {
      const selections = itemCustomizations[rule.name];
      if (selections) {
        if (rule.type === "select_one" && selections) {
          const option = rule.options.find(opt => opt.name === selections);
          if (option) totalPrice += option.price;
        } else if (rule.type === "select_multiple" && Array.isArray(selections)) {
          selections.forEach((selectionName: string) => {
            const option = rule.options.find(opt => opt.name === selectionName);
            if (option) totalPrice += option.price;
          });
        }
      }
    });

    return totalPrice;
  };

  const handleAddToCart = (item: CustomizableItem) => {
    const totalPrice = calculateTotalPrice(item);
    const itemCustomizations = customizations[item.id] || {};
    
    // Create description with customizations
    let customDescription = item.description;
    const customizationText = Object.entries(itemCustomizations)
      .filter(([_, value]) => value && (typeof value === 'string' || Array.isArray(value) && value.length > 0))
      .map(([key, value]) => {
        if (typeof value === 'string') return `${key}: ${value}`;
        if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
        return '';
      })
      .join(' | ');
    
    if (customizationText) {
      customDescription += ` (${customizationText})`;
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id + Math.random(), // Ensure unique ID for customized items
        name: item.name,
        price: totalPrice,
        image: item.image,
      },
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Build Your Own</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Customize your perfect meal with our extensive selection of fresh ingredients and options.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search customizable items..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "secondary"}
                  className={activeCategory === category.id ? "bg-primary hover:bg-primary/90" : ""}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Customizable Items */}
        <div className="space-y-12">
          {filteredItems.map((item) => {
            const totalPrice = calculateTotalPrice(item);
            
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  
                  <div className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${totalPrice.toFixed(2)}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="mt-2 bg-primary hover:bg-primary/90 text-white"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    {/* Customization Rules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getFilteredRules(item, searchTerm).map((rule) => (
                        <div key={rule.name} className="space-y-3">
                          <h4 className="font-semibold text-secondary">
                            {rule.name}
                            {rule.type === "select_one" && " (Choose 1)"}
                            {rule.type === "select_multiple" && rule.max_selections && ` (Up to ${rule.max_selections})`}
                          </h4>
                          
                          {rule.type === "select_one" ? (
                            <RadioGroup
                              value={customizations[item.id]?.[rule.name] || ""}
                              onValueChange={(value) => handleCustomizationChange(item.id, rule.name, value, true, rule.type)}
                            >
                              {rule.options.map((option) => (
                                <div key={option.name} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.name} id={`${item.id}-${rule.name}-${option.name}`} />
                                  <Label htmlFor={`${item.id}-${rule.name}-${option.name}`} className="flex-1 flex justify-between">
                                    <span>{option.name}</span>
                                    <span className="text-primary font-semibold">
                                      {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <div className="space-y-2">
                              {rule.options.map((option) => {
                                const isChecked = customizations[item.id]?.[rule.name]?.includes(option.name) || false;
                                
                                return (
                                  <div key={option.name} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${item.id}-${rule.name}-${option.name}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) => 
                                        handleCustomizationChange(item.id, rule.name, option.name, checked as boolean, rule.type)
                                      }
                                    />
                                    <Label htmlFor={`${item.id}-${rule.name}-${option.name}`} className="flex-1 flex justify-between">
                                      <span>{option.name}</span>
                                      <span className="text-primary font-semibold">
                                        {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                                      </span>
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No customizable items found matching your search criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
