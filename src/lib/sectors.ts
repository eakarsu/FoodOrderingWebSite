export interface Sector {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  heroImage: string;
  sectorType: 'immediate' | 'consultation' | 'product' | 'experience';
  features: SectorFeatures;
}

export interface SectorFeatures {
  hasBooking: boolean;
  hasRatings: boolean;
  hasGallery: boolean;
  hasInventory: boolean;
  hasConsultation: boolean;
  hasScheduling: boolean;
  
  // Immediate service features
  hasRealTimeBooking?: boolean;
  hasServiceDuration?: boolean;
  hasEmergencyFlag?: boolean;
  
  // Consultation-based features
  hasAppointmentScheduling?: boolean;
  hasDocumentUpload?: boolean;
  hasSecureCommunication?: boolean;
  
  // Product/retail features
  hasProductCatalog?: boolean;
  hasInventoryManagement?: boolean;
  hasOrderProcessing?: boolean;
  
  // Experience-based features
  hasEventScheduling?: boolean;
  hasProgressTracking?: boolean;
  hasCommunityFeatures?: boolean;
}

export const SECTORS: Sector[] = [
  {
    id: "auto_repair",
    name: "auto_repair",
    displayName: "Auto Repair",
    description: "Professional automotive repair and maintenance services",
    icon: "🚗",
    primaryColor: "#FF6B35",
    secondaryColor: "#1A1A1A",
    heroImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: true
    }
  },
  {
    id: "beauty_salon",
    name: "beauty_salon", 
    displayName: "Beauty Salon",
    description: "Full-service beauty treatments and styling services",
    icon: "💄",
    primaryColor: "#FF69B4",
    secondaryColor: "#8B4B8C",
    heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: false
    }
  },
  {
    id: "education_tutoring",
    name: "education_tutoring",
    displayName: "Education & Tutoring", 
    description: "Personalized tutoring and educational support services",
    icon: "📚",
    primaryColor: "#4A90E2",
    secondaryColor: "#2C5F2D",
    heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'experience',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasEventScheduling: true,
      hasProgressTracking: true,
      hasCommunityFeatures: true
    }
  },
  {
    id: "event_planning",
    name: "event_planning",
    displayName: "Event Planning",
    description: "Complete event planning and coordination services",
    icon: "🎉",
    primaryColor: "#FFD700",
    secondaryColor: "#8B4513",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'experience',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasEventScheduling: true,
      hasProgressTracking: false,
      hasCommunityFeatures: false
    }
  },
  {
    id: "financial_services",
    name: "financial_services",
    displayName: "Financial Services",
    description: "Comprehensive financial planning and investment services",
    icon: "💰",
    primaryColor: "#228B22",
    secondaryColor: "#2F4F4F",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'consultation',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasAppointmentScheduling: true,
      hasDocumentUpload: true,
      hasSecureCommunication: true
    }
  },
  {
    id: "fitness_gym",
    name: "fitness_gym",
    displayName: "Fitness & Gym",
    description: "Personal training and fitness coaching services",
    icon: "💪",
    primaryColor: "#FF4500",
    secondaryColor: "#1C1C1C",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'experience',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasEventScheduling: true,
      hasProgressTracking: true,
      hasCommunityFeatures: true
    }
  },
  {
    id: "food_delivery",
    name: "food_delivery",
    displayName: "Food Delivery",
    description: "Gourmet food delivery and catering services",
    icon: "🍽️",
    primaryColor: "#E74C3C",
    secondaryColor: "#2C3E50",
    heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'product',
    features: {
      hasBooking: false,
      hasRatings: true,
      hasGallery: true,
      hasInventory: true,
      hasConsultation: false,
      hasScheduling: false,
      hasProductCatalog: true,
      hasInventoryManagement: true,
      hasOrderProcessing: true
    }
  },
  {
    id: "healthcare",
    name: "healthcare",
    displayName: "Healthcare",
    description: "Medical consultations and healthcare services",
    icon: "🏥",
    primaryColor: "#2E8B57",
    secondaryColor: "#4682B4",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: true
    }
  },
  {
    id: "home_services",
    name: "home_services",
    displayName: "Home Services",
    description: "Professional home maintenance and repair services",
    icon: "🏠",
    primaryColor: "#8B4513",
    secondaryColor: "#556B2F",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: true
    }
  },
  {
    id: "insurance",
    name: "insurance",
    displayName: "Insurance",
    description: "Comprehensive insurance coverage and planning",
    icon: "🛡️",
    primaryColor: "#4169E1",
    secondaryColor: "#191970",
    heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'consultation',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasAppointmentScheduling: true,
      hasDocumentUpload: true,
      hasSecureCommunication: true
    }
  },
  {
    id: "it_services",
    name: "it_services",
    displayName: "IT Services",
    description: "Technology consulting and IT support services",
    icon: "💻",
    primaryColor: "#6A5ACD",
    secondaryColor: "#2F4F4F",
    heroImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'consultation',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasAppointmentScheduling: true,
      hasDocumentUpload: false,
      hasSecureCommunication: true
    }
  },
  {
    id: "laundry_services",
    name: "laundry_services",
    displayName: "Laundry Services",
    description: "Professional laundry and dry cleaning services",
    icon: "👔",
    primaryColor: "#20B2AA",
    secondaryColor: "#708090",
    heroImage: "https://images.unsplash.com/photo-1517677129300-07b130802f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'product',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: true,
      hasConsultation: false,
      hasScheduling: true,
      hasProductCatalog: true,
      hasInventoryManagement: true,
      hasOrderProcessing: true
    }
  },
  {
    id: "legal_services",
    name: "legal_services",
    displayName: "Legal Services",
    description: "Professional legal consultation and representation",
    icon: "⚖️",
    primaryColor: "#8B0000",
    secondaryColor: "#2F4F4F",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'consultation',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasAppointmentScheduling: true,
      hasDocumentUpload: true,
      hasSecureCommunication: true
    }
  },
  {
    id: "moving_services",
    name: "moving_services",
    displayName: "Moving Services",
    description: "Professional moving and relocation services",
    icon: "📦",
    primaryColor: "#FF8C00",
    secondaryColor: "#8B4513",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: false
    }
  },
  {
    id: "pet_services",
    name: "pet_services",
    displayName: "Pet Services",
    description: "Professional pet care and grooming services",
    icon: "🐕",
    primaryColor: "#32CD32",
    secondaryColor: "#228B22",
    heroImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: true
    }
  },
  {
    id: "photography",
    name: "photography",
    displayName: "Photography",
    description: "Professional photography and videography services",
    icon: "📸",
    primaryColor: "#FF1493",
    secondaryColor: "#483D8B",
    heroImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'experience',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: false,
      hasConsultation: true,
      hasScheduling: true,
      hasEventScheduling: true,
      hasProgressTracking: false,
      hasCommunityFeatures: false
    }
  },
  {
    id: "real_estate",
    name: "real_estate",
    displayName: "Real Estate",
    description: "Real estate services and property management",
    icon: "🏡",
    primaryColor: "#B8860B",
    secondaryColor: "#8B4513",
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'consultation',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: true,
      hasConsultation: true,
      hasScheduling: true,
      hasAppointmentScheduling: true,
      hasDocumentUpload: true,
      hasSecureCommunication: true
    }
  },
  {
    id: "transportation",
    name: "transportation",
    displayName: "Transportation",
    description: "Professional transportation and logistics services",
    icon: "🚛",
    primaryColor: "#1E90FF",
    secondaryColor: "#2F4F4F",
    heroImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'immediate',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: false,
      hasInventory: false,
      hasConsultation: false,
      hasScheduling: true,
      hasRealTimeBooking: true,
      hasServiceDuration: true,
      hasEmergencyFlag: false
    }
  },
  {
    id: "travel_hotel",
    name: "travel_hotel",
    displayName: "Travel & Hotel",
    description: "Travel planning and hospitality services",
    icon: "✈️",
    primaryColor: "#FF6347",
    secondaryColor: "#4682B4",
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    sectorType: 'experience',
    features: {
      hasBooking: true,
      hasRatings: true,
      hasGallery: true,
      hasInventory: true,
      hasConsultation: false,
      hasScheduling: true,
      hasEventScheduling: true,
      hasProgressTracking: false,
      hasCommunityFeatures: true
    }
  }
];

export function getSectorById(sectorId: string): Sector | undefined {
  return SECTORS.find(sector => sector.id === sectorId);
}

export function getSectorByName(sectorName: string): Sector | undefined {
  return SECTORS.find(sector => sector.name === sectorName);
}

export interface ParsedCategory {
  name: string;
  items: ParsedItem[];
  hasRules?: boolean;
  rules?: ParsedRule[];
}

export interface ParsedItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  rules?: string[];
}

export interface ParsedRule {
  name: string;
  type: "select_one" | "select_multiple";
  max_selections?: number;
  options: ParsedRuleOption[];
}

export interface ParsedRuleOption {
  name: string;
  price: number;
  size: string;
}

export function parsePrompt2File(content: string): ParsedCategory[] {
  console.log(`🔍 PARSE_PROMPT2: Starting to parse content (${content.length} chars)`);
  console.log(`🔍 PARSE_PROMPT2: Content preview:`, content.substring(0, 200));
  
  const categories: ParsedCategory[] = [];
  const lines = content.split('\n');
  let currentCategory: ParsedCategory | null = null;
  let itemId = 1;

  console.log(`🔍 PARSE_PROMPT2: Split into ${lines.length} lines`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    console.log(`🔍 PARSE_PROMPT2: Line ${i + 1}: "${trimmedLine}"`);
    
    if (trimmedLine.startsWith('[Begin Category]')) {
      const categoryName = trimmedLine.replace('[Begin Category]', '').trim();
      console.log(`📂 PARSE_PROMPT2: Found category: "${categoryName}"`);
      currentCategory = {
        name: categoryName,
        items: []
      };
      categories.push(currentCategory);
    } else if (trimmedLine.startsWith('[End Category]')) {
      console.log(`📂 PARSE_PROMPT2: End category, items found: ${currentCategory?.items.length || 0}`);
      currentCategory = null;
    } else if (currentCategory && trimmedLine.startsWith('-') && trimmedLine.includes(':')) {
      // Parse item line
      console.log(`🔍 PARSE_PROMPT2: Parsing item line: "${trimmedLine}"`);
      const itemMatch = trimmedLine.match(/^- (.+?): \$(.+?)(?:, select rules (.+?))?(?:\s+(.*))?$/);
      if (itemMatch) {
        const [, name, priceStr, rulesStr, description] = itemMatch;
        const item: ParsedItem = {
          id: itemId++,
          name: name.trim(),
          price: parseFloat(priceStr.trim()),
          description: description?.trim() || undefined,
          rules: rulesStr ? rulesStr.split(',').map(r => r.trim()) : undefined
        };
        currentCategory.items.push(item);
        console.log(`✅ PARSE_PROMPT2: Added item: ${item.name} - $${item.price}`);
      } else {
        console.warn(`⚠️ PARSE_PROMPT2: Failed to match item pattern: "${trimmedLine}"`);
      }
    } else if (currentCategory && trimmedLine && !trimmedLine.startsWith('[') && trimmedLine.includes(' ')) {
      // Parse item description on separate line
      const lastItem = currentCategory.items[currentCategory.items.length - 1];
      if (lastItem && !lastItem.description) {
        lastItem.description = trimmedLine;
        console.log(`📝 PARSE_PROMPT2: Added description to ${lastItem.name}: "${trimmedLine}"`);
      }
    }
  }

  console.log(`🎯 PARSE_PROMPT2: Finished parsing. Found ${categories.length} categories`);
  categories.forEach((cat, index) => {
    console.log(`📂 PARSE_PROMPT2: Category ${index + 1}: "${cat.name}" with ${cat.items.length} items`);
  });

  return categories;
}

export function parseRulesFile(content: string): Record<string, ParsedRule[]> {
  const rules: Record<string, ParsedRule[]> = {};
  const lines = content.split('\n');
  let currentRuleCategory: string | null = null;
  let currentRule: ParsedRule | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('[Begin Rule]')) {
      currentRuleCategory = trimmedLine.replace('[Begin Rule]', '').trim();
      if (!rules[currentRuleCategory]) {
        rules[currentRuleCategory] = [];
      }
    } else if (trimmedLine.startsWith('[End Rule]')) {
      currentRuleCategory = null;
      currentRule = null;
    } else if (currentRuleCategory && trimmedLine.includes('(Rule:')) {
      // Parse rule definition
      const ruleMatch = trimmedLine.match(/^(.+?)\s*\(Rule: (.+?)\)$/);
      if (ruleMatch) {
        const [, ruleName, ruleType] = ruleMatch;
        const type = ruleType.toLowerCase().includes('select 1') ? 'select_one' : 'select_multiple';
        const maxMatch = ruleType.match(/select (?:1 to |up to )?(\d+)/);
        
        currentRule = {
          name: ruleName.trim(),
          type,
          max_selections: maxMatch ? parseInt(maxMatch[1]) : undefined,
          options: []
        };
        rules[currentRuleCategory].push(currentRule);
      }
    } else if (currentRule && trimmedLine.startsWith('-')) {
      // Parse rule option
      const optionMatch = trimmedLine.match(/^- (.+?) - \$(.+)$/);
      if (optionMatch) {
        const [, optionName, priceStr] = optionMatch;
        const sizeMatch = optionName.match(/\((.+?)\)$/);
        const size = sizeMatch ? sizeMatch[1] : 'Medium';
        const name = optionName.replace(/\s*\(.+?\)$/, '').trim();
        
        currentRule.options.push({
          name,
          price: parseFloat(priceStr.trim()),
          size
        });
      }
    }
  }

  return rules;
}
