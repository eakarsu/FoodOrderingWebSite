import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { parsePrompt2File } from "@/lib/sectors";

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
  
  // Salads
  if (category.includes("salad")) return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format";
  
  // Coffee
  if (category.includes("coffee")) return "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&auto=format";
  
  // Tea
  if (category.includes("tea")) return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format";
  
  // Desserts
  if (category.includes("dessert") || name.includes("cookie") || name.includes("pudding")) {
    if (name.includes("cookie")) return "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format";
    if (name.includes("pudding")) return "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format";
  }
  
  // Grill items
  if (category.includes("grill")) {
    if (name.includes("gyro")) return "https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=400&h=300&fit=crop&auto=format";
    if (name.includes("philly")) return "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&auto=format";
    if (name.includes("falafel")) return "https://images.unsplash.com/photo-1615937691194-97dbd5ba1086?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&auto=format";
  }
  
  // Muffins & Pastries
  if (category.includes("muffin") || category.includes("pastries")) {
    if (name.includes("muffin")) return "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop&auto=format";
    if (name.includes("danish")) return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format";
    if (name.includes("croissant")) return "https://images.unsplash.com/photo-1555507036-ab794f4d9f53?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop&auto=format";
  }
  
  // Cold cuts
  if (category.includes("cold cuts") || category.includes("sliced")) {
    if (name.includes("cheese")) return "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=300&fit=crop&auto=format";
    if (name.includes("turkey") || name.includes("ham")) return "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format";
  }
  
  // Snacks
  if (category.includes("snack")) {
    if (name.includes("yogurt") || name.includes("parfait")) return "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format";
    if (name.includes("oats")) return "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format";
  }
  
  // Iced tea and lemonade
  if (category.includes("iced tea") || category.includes("lemonade")) {
    if (name.includes("lemonade")) return "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=300&fit=crop&auto=format";
  }
  
  // Default food image
  return "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
};

// Rules data from rules.txt
const rulesData: Record<string, Rule[]> = {
  "BYO Breakfast": [
    {
      name: "Bagel Options",
      type: "select_one",
      options: [
        { name: "Cinnamon Raisin", price: 1.50, size: "Small" },
        { name: "Egg", price: 1.50, size: "Small" },
        { name: "Everything", price: 1.50, size: "Small" },
        { name: "Plain", price: 1.50, size: "Small" },
        { name: "Whole Wheat", price: 1.50, size: "Small" }
      ]
    },
    {
      name: "Bagel Spreads",
      type: "select_multiple",
      max_selections: 6,
      options: [
        { name: "Butter", price: 1.00, size: "Small" },
        { name: "Cream Cheese", price: 2.00, size: "Small" },
        { name: "Bacon", price: 4.00, size: "Small" },
        { name: "Lox", price: 6.00, size: "Small" }
      ]
    }
  ],
  "BYO Sandwiches": [
    {
      name: "Bread",
      type: "select_one",
      options: [
        { name: "Hero", price: 1.00, size: "Medium" },
        { name: "Roll", price: 0.00, size: "Medium" },
        { name: "White Wrap", price: 1.00, size: "Medium" },
        { name: "Whole Wheat Wrap", price: 1.00, size: "Medium" }
      ]
    },
    {
      name: "Protein",
      type: "select_multiple",
      max_selections: 3,
      options: [
        { name: "Grilled chicken", price: 2.00, size: "Medium" },
        { name: "Turkey", price: 2.00, size: "Medium" },
        { name: "Ham", price: 2.00, size: "Medium" },
        { name: "Roast beef", price: 3.00, size: "Medium" }
      ]
    },
    {
      name: "Toppings",
      type: "select_multiple",
      max_selections: 5,
      options: [
        { name: "Lettuce", price: 1.00, size: "Medium" },
        { name: "Tomato", price: 1.00, size: "Medium" },
        { name: "Onion", price: 0.75, size: "Medium" },
        { name: "Cheese", price: 1.00, size: "Medium" }
      ]
    }
  ],
  "Chopped Salad": [
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
      max_selections: 5,
      options: [
        { name: "Grilled chicken", price: 2.00, size: "Small" },
        { name: "Feta cheese", price: 2.00, size: "Small" },
        { name: "Tomatoes", price: 0.50, size: "Small" },
        { name: "Cucumber", price: 0.50, size: "Small" }
      ]
    }
  ],
  "Coffee": [
    {
      name: "Coffee Creamers",
      type: "select_one",
      options: [
        { name: "Milk", price: 0.00, size: "Small" },
        { name: "Half and Half", price: 0.00, size: "Small" },
        { name: "French Vanilla", price: 0.00, size: "Small" },
        { name: "Hazelnut", price: 0.00, size: "Small" }
      ]
    }
  ]
};

// Category data extracted from prompt2.txt  
const categoriesData = [
  {
    name: "Acai Bowls",
    image: "🥣",
    items: [
      {
        id: 1,
        name: "Acai Bowl",
        price: 12.97,
        description: "Acai, Banana, Blueberry, Strawberry, Granola, Coconut, Honey"
      }
    ]
  },
  {
    name: "Bottled Drinks",
    image: "🥤",
    items: [
      { id: 2, name: "Apple Juice", price: 3.59 },
      { id: 3, name: "Arizona Iced Cold Brew Green Tea", price: 4.09 },
      { id: 4, name: "Arizona Iced Cold Brew Iced Tea", price: 4.09 },
      { id: 5, name: "Arizona Iced Cold Brew Sweet Tea", price: 4.09 },
      { id: 6, name: "Arizona Iced Cold Brew Unsweet Tea", price: 4.09 },
      { id: 7, name: "Arizona Iced Tea 16 oz Arnold Palmer", price: 3.59 },
      { id: 8, name: "Arizona Iced Tea 16 oz Diet Green Tea", price: 3.59 },
      { id: 9, name: "Arizona Iced Tea 16 oz Diet Iced Tea", price: 3.59 },
      { id: 10, name: "Arizona Iced Tea 16 oz Green Tea", price: 3.59 },
      { id: 11, name: "Arizona Iced Tea 16 oz Iced Tea", price: 3.59 },
      { id: 12, name: "Coke 20oz soda", price: 3.59 },
      { id: 13, name: "Cranberry Juice", price: 3.59 },
      { id: 14, name: "Diet Coke 20oz soda", price: 3.59 },
      { id: 15, name: "Diet Dr. Pepper 20oz soda", price: 3.59 },
      { id: 16, name: "Diet Pepsi 20oz soda", price: 3.59 },
      { id: 17, name: "Diet Sprite 20oz soda", price: 3.59 },
      { id: 18, name: "Dr. Pepper 20oz soda", price: 3.59 },
      { id: 19, name: "Essentia 1 L", price: 4.89 },
      { id: 20, name: "Gatorade Cool Blue", price: 3.59 },
      { id: 21, name: "Gatorade Frost", price: 3.59 },
      { id: 22, name: "Gatorade Fruit Punch", price: 3.59 },
      { id: 23, name: "Gatorade Fruit Punch Zero", price: 3.59 },
      { id: 24, name: "Gatorade Glacier Cherry", price: 3.59 },
      { id: 25, name: "Gatorade Glacier Cherry Zero", price: 3.59 },
      { id: 26, name: "Gatorade Iceberg", price: 3.59 },
      { id: 27, name: "Gatorade Lemon Lime", price: 3.59 },
      { id: 28, name: "Gatorade Lemon Lime Zero", price: 3.59 },
      { id: 29, name: "Gatorade Orange", price: 3.59 },
      { id: 30, name: "Grape Juice", price: 3.59 },
      { id: 31, name: "Grapefruit Juice", price: 3.59 },
      { id: 32, name: "Monster", price: 3.50 },
      { id: 33, name: "Monster Rehab", price: 3.50 },
      { id: 34, name: "Monster Zero Sugar", price: 3.50 },
      { id: 35, name: "Orange Juice", price: 3.59, description: "OJ" },
      { id: 36, name: "Orange Mango Juice", price: 3.59 },
      { id: 37, name: "Orange Pineapple Juice", price: 3.59 },
      { id: 38, name: "Pepsi 20oz soda", price: 3.59 },
      { id: 39, name: "Poland Spring Water 1 L", price: 4.23 },
      { id: 40, name: "Poland Spring Water 1.5 L", price: 4.89 },
      { id: 41, name: "Poland Spring Water 500 mL", price: 2.55 },
      { id: 42, name: "Poland Spring Water 700 mL Sport Bottle", price: 3.59 },
      { id: 43, name: "Red Bull 8.4 oz.", price: 2.95 },
      { id: 44, name: "Red Bull Sugar Free 8.4 oz", price: 2.95 },
      { id: 45, name: "Snapple 16 oz Fruit Punch", price: 2.75 },
      { id: 46, name: "Snapple 16 oz Grapeade", price: 2.75 },
      { id: 47, name: "Snapple 16 oz Green Tea", price: 2.75 },
      { id: 48, name: "Snapple 16 oz Half and Half", price: 2.75 },
      { id: 49, name: "Snapple 16 oz Half and Half Zero Sugar", price: 2.75 },
      { id: 50, name: "Snapple 16 oz Honey Sweet Tea", price: 2.75 },
      { id: 51, name: "Snapple 16 oz Kiwi Strawberry", price: 2.75 },
      { id: 52, name: "Snapple 16 oz Lemon Tea", price: 2.75 },
      { id: 53, name: "Snapple 16 oz Mango Madness", price: 2.75 },
      { id: 54, name: "Snapple 16 oz Mango Tea", price: 2.75 },
      { id: 55, name: "Snapple 16 oz Orangeade", price: 2.75 },
      { id: 56, name: "Snapple 16 oz Peach Tea", price: 2.75 },
      { id: 57, name: "Snapple 16 oz Raspberry Peach", price: 2.75 },
      { id: 58, name: "Snapple 16 oz Raspberry Tea", price: 2.75 },
      { id: 59, name: "Snapple 16 oz Snapple Apple", price: 2.75 },
      { id: 60, name: "Snapple 16 oz Zero Sugar Lemon Tea", price: 2.75 },
      { id: 61, name: "Snapple 16 oz Zero Sugar Peach Tea", price: 2.75 },
      { id: 62, name: "Snapple 16 oz Zero Sugar Raspberry Tea", price: 2.75 },
      { id: 63, name: "Sprite 20oz soda", price: 3.59 },
      { id: 64, name: "Vegetable Juice", price: 3.59 },
      { id: 65, name: "Vitamin Water Energy (Tropical Citrus)", price: 3.59 },
      { id: 66, name: "Vitamin Water Essential (Orange)", price: 3.59 },
      { id: 67, name: "Vitamin Water Focus (Kiwi Strawberry)", price: 3.59 },
      { id: 68, name: "Vitamin Water Power-C (Dragonfruit)", price: 3.59 },
      { id: 69, name: "Vitamin Water Rise (Orange, Zero Sugar)", price: 3.59 },
      { id: 70, name: "Vitamin Water Squeezed (Lemonade, Zero Sugar)", price: 3.59 },
      { id: 71, name: "Vitamin Water XXX (Acai Blueberry Pomegranate)", price: 3.59 }
    ]
  },
  {
    name: "Breakfast Combos",
    image: "🍳",
    items: [
      { id: 72, name: "French Toast", price: 9.95, description: "Texas style french toast served with butter and syrup" },
      { id: 73, name: "Healthy One", price: 11.64, description: "Three egg whites, turkey, spinach, Alpine Lace Swiss, in a whole wheat wrap." },
      { id: 74, name: "Hungry Man", price: 12.95, description: "Three eggs, ham, bacon, sausage, and cheese on a hero." },
      { id: 75, name: "Melville Platter", price: 12.95, description: "Two eggs, ham, bacon, sausage, home-fries, and toast." },
      { id: 76, name: "Protein Slammer", price: 12.94, description: "Five egg whites, extra turkey, Alpine Lace Swiss cheese, on a whole wheat wrap." },
      { id: 77, name: "Super Thing", price: 12.94, description: "Two eggs, extra bacon, extra sausage, onions, and American cheese." }
    ]
  },
  {
    name: "BYO Breakfast",
    image: "🥯",
    hasRules: true,
    rules: rulesData["BYO Breakfast"],
    items: [
      { id: 78, name: "Bagel", price: 0.00, description: "Build your own bagel with spreads" },
      { id: 79, name: "Breakfast", price: 2.60, description: "Build your own breakfast with eggs, meat, and more" }
    ]
  },
  {
    name: "BYO Sandwiches",
    image: "🥪",
    hasRules: true,
    rules: rulesData["BYO Sandwiches"],
    items: [
      { id: 80, name: "BYO Sandwiches", price: 16.00, description: "Build your own sandwich with bread, protein, cheese, and toppings" }
    ]
  },
  {
    name: "Chips",
    image: "🍟",
    items: [
      { id: 81, name: "Classic Lays", price: 3.24 },
      { id: 82, name: "Cool Ranch Doritos", price: 3.24 },
      { id: 83, name: "Nacho Cheese Doritos", price: 3.24 },
      { id: 84, name: "Spicy Sweet Chili Doritos", price: 3.24 }
    ]
  },
  {
    name: "Chopped Salad",
    image: "🥗",
    hasRules: true,
    rules: rulesData["Chopped Salad"],
    items: [
      { id: 85, name: "BYO Salad", price: 9.95, description: "Build your own salad with fresh ingredients" }
    ]
  },
  {
    name: "Coffee",
    image: "☕",
    hasRules: true,
    rules: rulesData["Coffee"],
    items: [
      { id: 86, name: "Cappuccino, Columbian Coffee, Large", price: 2.76 },
      { id: 87, name: "Cappuccino, Columbian Coffee, Medium", price: 2.25 },
      { id: 88, name: "Cappuccino, Columbian Coffee, Small", price: 1.76 },
      { id: 89, name: "French Vanilla, Columbian Coffee, Large", price: 2.76 },
      { id: 90, name: "French Vanilla, Columbian Coffee, Medium", price: 2.25 },
      { id: 91, name: "French Vanilla, Columbian Coffee, Small", price: 1.76 },
      { id: 92, name: "Columbian Coffee, Large", price: 2.76 },
      { id: 93, name: "Columbian Coffee, Medium", price: 2.25 },
      { id: 94, name: "Columbian Coffee, Small", price: 1.76 },
      { id: 95, name: "Hot Coffee, Columbian Coffee, Large", price: 2.76 },
      { id: 96, name: "Hot Coffee, Columbian Coffee, Medium", price: 2.25 },
      { id: 97, name: "Hot Coffee, Columbian Coffee, Small", price: 1.76 },
      { id: 98, name: "Hot Decaf Coffee, Columbian Coffee, Large", price: 2.76 },
      { id: 99, name: "Hot Decaf Coffee, Columbian Coffee, Medium", price: 2.25 },
      { id: 100, name: "Hot Decaf Coffee, Columbian Coffee, Small", price: 1.76 }
    ]
  },
  {
    name: "Tea",
    image: "🍵",
    items: [
      { id: 101, name: "Green Decaf Tea, Large", price: 2.76 },
      { id: 102, name: "Green Decaf Tea, Medium", price: 2.25 },
      { id: 103, name: "Green Decaf Tea, Small", price: 1.76 },
      { id: 104, name: "Green Tea, Large", price: 2.76 },
      { id: 105, name: "Green Tea, Medium", price: 2.25 },
      { id: 106, name: "Green Tea, Small", price: 1.76 },
      { id: 107, name: "Hot Coffee, Large", price: 2.76 },
      { id: 108, name: "Hot Coffee, Medium", price: 2.25 },
      { id: 109, name: "Hot Coffee, Small", price: 1.76 },
      { id: 110, name: "Hot Decaf Tea, Large", price: 2.76 },
      { id: 111, name: "Hot Decaf Tea, Medium", price: 2.25 },
      { id: 112, name: "Hot Decaf Tea, Small", price: 1.76 },
      { id: 113, name: "Hot Tea, Large", price: 2.76 },
      { id: 114, name: "Hot Tea, Medium", price: 2.25 },
      { id: 115, name: "Hot Tea, Small", price: 1.76 }
    ]
  },
  {
    name: "Cold Sandwiches",
    image: "🥙",
    items: [
      { id: 116, name: "Balsamic Avocado Hero", price: 17.95, description: "Turkey breast, avocado, tomato, romaine lettuce and balsamic vinaigrette." },
      { id: 117, name: "Cajun Roast Beef Hero", price: 17.95, description: "Cajun roast beef, Cheddar cheese, lettuce, roasted red peppers and creole mayo." },
      { id: 118, name: "California Hero", price: 17.95, description: "Turkey breast, avocado, lettuce, tomatoes and Russian dressing." },
      { id: 119, name: "Chicken Knock Out Hero", price: 17.95, description: "Fried chicken cutlet, hot cherry peppers, jalapeño Jack cheese, lettuce, tomato, and horseradish dressing." },
      { id: 120, name: "Dagwood Hero", price: 17.95, description: "Roast beef, turkey, ham, American, Swiss, lettuce, tomato, and mayo." },
      { id: 121, name: "Grandpa Ted Hero", price: 17.95, description: "Turkey breast, Genoa salami, cole-slaw and mustard." },
      { id: 122, name: "Honey Dipped Chicken Hero", price: 17.95, description: "Chicken cutlet, Cheddar cheese, romaine lettuce, tomato, and honey dip sauce." },
      { id: 123, name: "Italian Grilled Chicken Hero", price: 17.95, description: "Grilled chicken, lettuce, roasted red peppers, fresh Mozzarella and pesto sauce." },
      { id: 124, name: "Italian Hero", price: 17.95, description: "Capicola ham, salami, pepperoni, lettuce, tomato, Provolone cheese and Italian dressing on a hero" },
      { id: 125, name: "Monte Christo Hero", price: 17.95, description: "Turkey breast, ham, Swiss cheese, lettuce, tomato and Russian dressing." },
      { id: 126, name: "Nazareth Hero", price: 17.95, description: "Fried chicken cutlet, bacon, Swiss cheese, cole-slaw and Russian dressing." },
      { id: 127, name: "Roast Beef Deluxe Hero", price: 17.95, description: "Roast beef, bacon, Cheddar, lettuce, tomato and mayo." },
      { id: 128, name: "Turkey Club Hero", price: 17.95, description: "Roast turkey breast, bacon, lettuce, tomato and mayo on a hero." }
    ]
  },
  {
    name: "Desserts",
    image: "🍪",
    items: [
      { id: 129, name: "Chocolate Chip Cookies", price: 2.29 },
      { id: 130, name: "Chocolate Pudding", price: 3.89 },
      { id: 131, name: "Rice Pudding", price: 4.54 }
    ]
  },
  {
    name: "Grill Menu",
    image: "🔥",
    items: [
      { id: 132, name: "Beef gyro", price: 12.94, description: "Lettuce, tomato, cucumbers, onions, gyro sauce." },
      { id: 133, name: "Cuban Sandwich", price: 18.12, description: "Pulled pork, ham, Swiss cheese, pickles and tomatoes on a garlic bread hero." },
      { id: 134, name: "Falafel Wrap", price: 11.64, description: "Falafel, lettuce, onion, cucumber, tomato and tahini sauce." },
      { id: 135, name: "Grilled Monte Cristo", price: 16.84, description: "Ham, turkey, Swiss cheese, Russian dressing and tomato on Texas style bread." },
      { id: 136, name: "Philly Cheese Steak", price: 14.24, description: "Tender rib-eye steak, sautéed peppers, onions, and mixed Cheese." },
      { id: 137, name: "Wrap Supreme", price: 11.64, description: "Chicken tenders, lettuce, tomato, cheese, and ranch dressing." }
    ]
  },
  {
    name: "Hot Sandwiches",
    image: "🌭",
    items: [
      { id: 138, name: "Chicken Fiesta Hero", price: 17.95, description: "Fried chicken cutlet, fresh mozzarella, roasted red peppers and spicy mayo on a toasted hero." },
      { id: 139, name: "Chicken Italian Melt Hero", price: 17.95, description: "Fried chicken cutlet, mozzarella cheese, lettuce, tomato, onions, oil, vinegar on a toasted hero." },
      { id: 140, name: "Dare Devil Hero", price: 17.95, description: "Fried chicken cutlet, cheddar cheese, potato salad, lettuce and Russian dressing on a toasted hero" },
      { id: 141, name: "Half Hollow Hero", price: 17.95, description: "Sliced buffalo chicken, bacon, mozzarella, lettuce, tomato and Bleu cheese on a toasted garlic hero." },
      { id: 142, name: "Mac-Truck Hero", price: 17.95, description: "Fried chicken cutlet. Mozzarella, mac salad, bacon and honey mustard on a toasted garlic hero." },
      { id: 143, name: "Melville Spice Hero", price: 17.95, description: "Fried cajun chicken cutlet, bacon, cheddar cheese, lettuce, tomato, and Russian dressing on a toasted hero." },
      { id: 144, name: "Original Hero", price: 17.95, description: "Fried chicken cutlet, cucumber, lettuce, tomato, Mozzarella, ranch and hot sauce on a toasted hero." },
      { id: 145, name: "Passport Hero", price: 17.95, description: "Fried chicken cutlet, bacon, lettuce, ranch, barbeque sauce, American cheese on a toasted hero." },
      { id: 146, name: "Pat's Fiesta Hero", price: 17.95, description: "Fried chicken cutlet, roasted red peppers, Pecorino cheese, fresh Mozzarella, pesto sauce, toasted hero." },
      { id: 147, name: "Route 110 Hero", price: 17.95, description: "Grilled chicken, turkey, roasted red pepper, Jack cheese, lettuce and pesto sauce on a toasted hero." },
      { id: 148, name: "Southern Ranch Hero", price: 17.95, description: "Roast beef, roasted red peppers, Jack cheese, lettuce and ranch dressing on a toasted garlic hero." },
      { id: 149, name: "Spicy CAB Ride Hero", price: 17.95, description: "Fried chicken cutlet, avocado, bacon, mozzarella, cheddar, lettuce, tomato and spicy mayo on a toasted hero." },
      { id: 150, name: "Sweet Hills Hero", price: 17.95, description: "Honey turkey, bacon, Cheddar, Mozzarella, lettuce, and honey mustard on a toasted hero." },
      { id: 151, name: "Texas Hero", price: 17.95, description: "Fried chicken cutlet, bacon, fried onions, Mozzarella, Cheddar and barbeque sauce on a toasted garlic hero." },
      { id: 152, name: "X-Factor Hero", price: 17.95, description: "Fried chicken cutlet, mozzarella cheese, bacon, cole-slaw and Russian dressing on a toasted garlic hero." }
    ]
  },
  {
    name: "Iced Tea and Lemonade",
    image: "🧊",
    items: [
      { id: 153, name: "Home-Made Iced Tea, Large", price: 3.50 },
      { id: 154, name: "Home-Made Iced Tea, Medium", price: 2.76 },
      { id: 155, name: "Home-Made Lemonade, Large", price: 3.50 },
      { id: 156, name: "Home-Made Lemonade, Medium", price: 2.76 },
      { id: 157, name: "Unsweetened Iced Tea, Large", price: 3.50 },
      { id: 158, name: "Unsweetened Iced Tea, Medium", price: 2.76 }
    ]
  },
  {
    name: "Muffins & Pastries",
    image: "🧁",
    items: [
      { id: 159, name: "Apple Turnover", price: 3.59 },
      { id: 160, name: "Banana Nut Muffin", price: 3.59 },
      { id: 161, name: "Blueberry Muffin", price: 3.59 },
      { id: 162, name: "Bran Muffin", price: 3.59 },
      { id: 163, name: "Cheese Danish", price: 3.59 },
      { id: 164, name: "Chocolate Chip Muffin", price: 3.59 },
      { id: 165, name: "Chocolate Chocolate Muffin", price: 3.59 },
      { id: 166, name: "Corn Muffin", price: 3.59 },
      { id: 167, name: "Croissant", price: 3089.00 },
      { id: 168, name: "Strawberry Cheese Danish", price: 3.59 }
    ]
  },
  {
    name: "Omelets",
    image: "🍳",
    items: [
      { id: 169, name: "American Omelet", price: 10.32, description: "ham, American cheese, and tomato." },
      { id: 170, name: "Mexican Omelet", price: 10.32, description: "mushrooms, tomato, onions, jalapeño, and cheese." },
      { id: 171, name: "Sausage & Potato Omelet", price: 10.32, description: "sausage, home-fries, and cheddar cheese." },
      { id: 172, name: "Simon's Omelet", price: 11.64, description: "avocado, spinach, Feta cheese and salsa." },
      { id: 173, name: "Western Omelet", price: 10.32, description: "peppers, onions, and ham." }
    ]
  },
  {
    name: "Paninis",
    image: "🥖",
    items: [
      { id: 174, name: "California Panini", price: 15.95, description: "Turkey breast, tomato, avocado, Mozzarella cheese and Russian dressing." },
      { id: 175, name: "Caprese Style Panini", price: 15.95, description: "Grilled chicken, mozzarella cheese, roasted red peppers, pesto sauce" },
      { id: 176, name: "Chicken Fiesta Panini", price: 15.95, description: "Fried chicken cutlet, fresh mozzarella, roasted red peppers and spicy mayo." },
      { id: 177, name: "Chicken Margherita Panini", price: 15.95, description: "Grilled chicken, tomatoes, fresh mozzarella, fresh basil and red onions." },
      { id: 178, name: "Delightful Panini", price: 15.95, description: "Turkey breast, Swiss cheese, honey mustard and cole-slaw." },
      { id: 179, name: "Desire Panini", price: 15.95, description: "House roast turkey breast, Swiss cheese, cole-slaw and Russian." },
      { id: 180, name: "Italian Chicken Panini", price: 15.95, description: "Grilled chicken, pesto sauce, roasted red pepper, and fresh mozzarella." },
      { id: 181, name: "Manhattan Panini", price: 15.95, description: "Roast beef, tomato, onions, bacon, Mozzarella cheese and Russian dressing." },
      { id: 182, name: "Monterey Panini", price: 15.95, description: "Virginia ham, sharp Cheddar cheese, plum tomato and bacon, and Russian dressing." },
      { id: 183, name: "Smokey Joe Panini", price: 15.95, description: "Smoked turkey, Cheddar cheese, bacon, crispy fried onions and Russian." },
      { id: 184, name: "Sunset Paninic", price: 15.95, description: "Turkey, mozzarella, tomato, avocado, ranch dressing." },
      { id: 185, name: "Texas Panini", price: 15.95, description: "Fried chicken cutlet, bacon, fried onions, cheddar cheese and barbeque sauce." },
      { id: 186, name: "Torino Panini", price: 15.95, description: "Fried chicken cutlet, Mozzarella, sundried tomato and pesto sauce." },
      { id: 187, name: "Tuna Cheddar Panini", price: 15.95, description: "Tuna, Cheddar cheese and tomatoes." }
    ]
  },
  {
    name: "Salads",
    image: "🥗",
    items: [
      { id: 188, name: "Chef Salad", price: 15.95, description: "Mixed lettuce, ham, eggs, turkey, carrots, Cheddar cheese, cucumber, tomatoes and green peppers." },
      { id: 189, name: "Cobb Salad", price: 15.95, description: "Mixed lettuce, bacon, chicken, Provolone cheese, eggs, tomatoes, and black olives." },
      { id: 190, name: "Greek Salad", price: 15.95, description: "Romaine lettuce, tomatoes, stuffed grape leaves, green peppers, Feta cheese and black olives." },
      { id: 191, name: "Grilled Chicken Caesar Salad", price: 15.95, description: "Romaine lettuce, tomatoes, grilled chicken, Parmigiano cheese, croutons, and caesar dressing." },
      { id: 192, name: "Grilled Chicken Salad", price: 15.95, description: "Romaine lettuce, tomatoes, grilled chicken, green bell peppers, shredded carrots and cucumbers." },
      { id: 193, name: "Santa Fe Salad", price: 15.95, description: "Mixed lettuce, grilled chicken, beans, corn, Cheddar cheese, and crunchy cheese tortilla strips, and Santa Fe dressing." }
    ]
  },
  {
    name: "Sliced Cold Cuts",
    image: "🍖",
    items: [
      { id: 194, name: "American cheese 1 lb.", price: 11.98 },
      { id: 195, name: "American cheese 1/2 lb.", price: 5.99 },
      { id: 196, name: "American cheese 1/4 lb.", price: 2.99 },
      { id: 197, name: "American cheese 3/4 lb.", price: 8.98 },
      { id: 198, name: "Boars Head Bologna 1 lb.", price: 11.98 },
      { id: 199, name: "Boars Head Bologna 1/2 lb.", price: 5.99 },
      { id: 200, name: "Boars Head Bologna 1/4 lb.", price: 2.99 },
      { id: 201, name: "Boars Head Bologna 3/4 lb.", price: 8.98 },
      { id: 202, name: "Boars Head Buffalo Chicken 1 lb.", price: 15.98 },
      { id: 203, name: "Boars Head Buffalo Chicken 1/2 lb.", price: 7.99 },
      { id: 204, name: "Boars Head Buffalo Chicken 1/4 lb.", price: 3.99 },
      { id: 205, name: "Boars Head Buffalo Chicken 3/4 lb.", price: 11.98 },
      { id: 206, name: "Boars Head Honey Turkey 1 lb.", price: 15.98 },
      { id: 207, name: "Boars Head Honey Turkey 1/2 lb.", price: 7.99 },
      { id: 208, name: "Boars Head Honey Turkey 1/4 lb.", price: 3.99 },
      { id: 209, name: "Boars Head Honey Turkey 3/4 lb.", price: 11.98 },
      { id: 210, name: "Boars Head Liverwurst 1 lb.", price: 11.98 },
      { id: 211, name: "Boars Head Liverwurst 1/2 lb.", price: 5.99 },
      { id: 212, name: "Boars Head Liverwurst 1/4 lb.", price: 2.99 },
      { id: 213, name: "Boars Head Liverwurst 3/4 lb.", price: 8.98 },
      { id: 214, name: "Boars Head Oven Roast Chicken 1 lb.", price: 15.98 },
      { id: 215, name: "Boars Head Oven Roast Chicken 1/2 lb.", price: 7.99 },
      { id: 216, name: "Boars Head Oven Roast Chicken 1/4 lb.", price: 3.99 },
      { id: 217, name: "Boars Head Oven Roast Chicken 3/4 lb.", price: 11.98 },
      { id: 218, name: "Boars Head Pastrami 1 lb.", price: 17.98 },
      { id: 219, name: "Boars Head Pastrami 1/2 lb.", price: 8.98 },
      { id: 220, name: "Boars Head Pastrami 1/4 lb.", price: 4.49 },
      { id: 221, name: "Boars Head Pastrami 3/4 lb.", price: 13.49 },
      { id: 222, name: "Boars Head Pepper Turkey 1 lb.", price: 15.98 },
      { id: 223, name: "Boars Head Pepper Turkey 1/2 lb.", price: 7.99 },
      { id: 224, name: "Boars Head Pepper Turkey 1/4 lb.", price: 3.99 },
      { id: 225, name: "Boars Head Pepper Turkey 3/4 lb.", price: 11.98 },
      { id: 226, name: "Boars Head Pepperoni 1 lb.", price: 15.98 },
      { id: 227, name: "Boars Head Pepperoni 1/2 lb.", price: 7.99 },
      { id: 228, name: "Boars Head Pepperoni 1/4 lb.", price: 3.99 },
      { id: 229, name: "Boars Head Pepperoni 3/4 lb.", price: 11.98 },
      { id: 230, name: "Boars Head Salami 1 lb.", price: 15.98 },
      { id: 231, name: "Boars Head Salami 1/2 lb.", price: 7.99 },
      { id: 232, name: "Boars Head Salami 1/4 lb.", price: 3.99 },
      { id: 233, name: "Boars Head Salami 3/4 lb.", price: 11.98 },
      { id: 234, name: "Boars Head Smoked Turkey 1 lb.", price: 15.98 },
      { id: 235, name: "Boars Head Smoked Turkey 1/2 lb.", price: 7.99 },
      { id: 236, name: "Boars Head Smoked Turkey 1/4 lb.", price: 3.99 },
      { id: 237, name: "Boars Head Smoked Turkey 3/4 lb.", price: 11.98 },
      { id: 238, name: "Boars Head Virginia Ham 1 lb.", price: 15.98 },
      { id: 239, name: "Boars Head Virginia Ham 1/2 lb.", price: 7.99 },
      { id: 240, name: "Boars Head Virginia Ham 1/4 lb.", price: 3.99 },
      { id: 241, name: "Boars Head Virginia Ham 3/4 lb.", price: 11.98 },
      { id: 242, name: "Cheddar cheese 1 lb.", price: 11.98 },
      { id: 243, name: "Cheddar cheese 1/2 lb.", price: 5.99 },
      { id: 244, name: "Cheddar cheese 1/4 lb.", price: 2.99 },
      { id: 245, name: "Cheddar cheese 3/4 lb.", price: 8.98 },
      { id: 246, name: "Fresh Mozzarella cheese 1 lb.", price: 11.98 },
      { id: 247, name: "Fresh Mozzarella cheese 1/2 lb.", price: 5.99 },
      { id: 248, name: "Fresh Mozzarella cheese 1/4 lb.", price: 2.99 },
      { id: 249, name: "Fresh Mozzarella cheese 3/4 lb.", price: 8.98 },
      { id: 250, name: "House Roast Beef 1 lb.", price: 17.98 },
      { id: 251, name: "House Roast Beef 1/2 lb.", price: 8.98 },
      { id: 252, name: "House Roast Beef 1/4 lb.", price: 4.49 },
      { id: 253, name: "House Roast Beef 3/4 lb.", price: 13.49 },
      { id: 254, name: "House Roast Turkey 1 lb.", price: 15.98 },
      { id: 255, name: "House Roast Turkey 1/2 lb.", price: 7.99 },
      { id: 256, name: "House Roast Turkey 1/4 lb.", price: 3.99 },
      { id: 257, name: "House Roast Turkey 3/4 lb.", price: 11.98 },
      { id: 258, name: "Mozzarella cheese 1 lb.", price: 11.98 },
      { id: 259, name: "Mozzarella cheese 1/2 lb.", price: 5.99 },
      { id: 260, name: "Mozzarella cheese 1/4 lb.", price: 2.99 },
      { id: 261, name: "Mozzarella cheese 3/4 lb.", price: 8.98 },
      { id: 262, name: "Muenster cheese 1 lb.", price: 11.98 },
      { id: 263, name: "Muenster cheese 1/2 lb.", price: 5.99 },
      { id: 264, name: "Muenster cheese 1/4 lb.", price: 2.99 },
      { id: 265, name: "Muenster cheese 3/4 lb.", price: 8.98 },
      { id: 266, name: "Pepper Jack cheese 1 lb.", price: 11.98 },
      { id: 267, name: "Pepper Jack cheese 1/2 lb.", price: 5.99 },
      { id: 268, name: "Pepper Jack cheese 1/4 lb.", price: 2.99 },
      { id: 269, name: "Pepper Jack cheese 3/4 lb.", price: 8.98 },
      { id: 270, name: "Provolone cheese 1 lb.", price: 11.98 },
      { id: 271, name: "Provolone cheese 1/2 lb.", price: 5.99 },
      { id: 272, name: "Provolone cheese 1/4 lb.", price: 2.99 },
      { id: 273, name: "Provolone cheese 3/4 lb.", price: 8.98 },
      { id: 274, name: "Swiss cheese 1 lb.", price: 11.98 },
      { id: 275, name: "Swiss cheese 1/2 lb.", price: 5.99 },
      { id: 276, name: "Swiss cheese 1/4 lb.", price: 2.99 },
      { id: 277, name: "Swiss cheese 3/4 lb.", price: 8.98 }
    ]
  },
  {
    name: "Snacks & Light Meals",
    image: "🥨",
    items: [
      { id: 278, name: "Yogurt Parfait", price: 6.99 },
      { id: 279, name: "Overnight Oats & Berries", price: 6.99 },
      { id: 280, name: "Peanut Butter & Chocolate Overnight Oats", price: 6.99 },
      { id: 281, name: "Strawberry Yogurt Parfait", price: 6.99 }
    ]
  }
];

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
  const [sectorData, setSectorData] = useState<Category[]>([]);
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
    }
  }, [sectorParam]);

  const loadSectorData = async (sectorId: string) => {
    setLoading(true);
    try {
      console.log(`📋 CATEGORIES: Loading data for ${sectorId}`);
      
      const cacheBuster = Date.now();
      const prompt2Url = `/sectors/${sectorId}_prompt2.txt?v=${cacheBuster}`;
      
      let prompt2Content = "";
      
      try {
        const prompt2Response = await fetch(prompt2Url, { cache: 'no-cache' });
        if (prompt2Response.ok) {
          prompt2Content = await prompt2Response.text();
          console.log(`✅ CATEGORIES: Loaded prompt2 for ${sectorId} (${prompt2Content.length} chars)`);
        }
      } catch (error) {
        console.warn(`⚠️ CATEGORIES: Error loading prompt2 for ${sectorId}:`, error);
      }
      
      // Parse data or use defaults
      if (prompt2Content) {
        const parsedCategories = parsePrompt2File(prompt2Content);
        const convertedCategories = parsedCategories.map(cat => ({
          name: cat.name,
          image: "🔧", // Default icon
          hasRules: cat.hasRules,
          rules: cat.rules,
          items: cat.items
        }));
        setSectorData(convertedCategories);
      } else {
        // Use default food delivery data if no sector-specific data
        setSectorData(categoriesData);
      }
      
    } catch (error) {
      console.error(`❌ CATEGORIES: Error loading sector data for ${sectorId}:`, error);
      setSectorData(categoriesData); // Fallback to default data
    } finally {
      setLoading(false);
    }
  };

  const displayData = sectorParam ? sectorData : categoriesData;

  const handleCategoryClick = (categoryName: string) => {
    const category = categoriesData.find(cat => cat.name === categoryName);
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
        image: getServiceImage(item.name, category.name)
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
            Menu Categories
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our complete menu organized by categories. Click on any category to see all available items.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
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
                        src={getServiceImage(item.name, categoryModal.category!.name)}
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
                        image: getServiceImage(customizationModal.item.name, customizationModal.category.name)
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
