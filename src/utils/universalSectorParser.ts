import { parsePrompt2File, parseRulesFile, type ParsedCategory, type ParsedRule } from "../lib/sectors";

export interface UniversalSectorData {
  sectorId: string;
  categories: ParsedCategory[];
  rules: Record<string, ParsedRule[]>;
  hasData: boolean;
  errorMessage?: string;
}

export interface SectorFeatures {
  hasBooking: boolean;
  hasRatings: boolean;
  hasGallery: boolean;
  hasInventory: boolean;
  hasConsultation: boolean;
  hasScheduling: boolean;
  sectorType: 'service' | 'product' | 'professional' | 'experience';
}

// Universal sector data parser that works for ALL sectors
export const parseUniversalSectorData = async (sectorId: string): Promise<UniversalSectorData> => {
  console.log(`🔄 UNIVERSAL PARSER: Starting parse for sector ${sectorId}`);
  
  // Always generate default services first as a fallback
  const defaultCategories = generateDefaultSectorServices(sectorId);
  
  try {
    const cacheBuster = Date.now();
    const prompt2Url = `/sectors/${sectorId}_prompt2.txt?v=${cacheBuster}`;
    const rulesUrl = `/sectors/${sectorId}_rules.txt?v=${cacheBuster}`;
    
    let prompt2Content = "";
    let rulesContent = "";
    let categories: ParsedCategory[] = defaultCategories; // Start with defaults
    
    // Try to load prompt2 file with error handling
    try {
      const prompt2Response = await fetch(prompt2Url, { 
        cache: 'no-cache',
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      if (prompt2Response.ok) {
        prompt2Content = await prompt2Response.text();
        console.log(`✅ UNIVERSAL PARSER: Loaded prompt2 for ${sectorId}`);
        
        // Try to parse the loaded content
        try {
          const parsedCategories = parsePrompt2File(prompt2Content);
          if (parsedCategories && parsedCategories.length > 0) {
            categories = parsedCategories;
            console.log(`✅ UNIVERSAL PARSER: Successfully parsed ${categories.length} categories from prompt2`);
          } else {
            console.warn(`⚠️ UNIVERSAL PARSER: parsePrompt2File returned empty, keeping defaults`);
          }
        } catch (parseError) {
          console.warn(`⚠️ UNIVERSAL PARSER: Failed to parse prompt2 content:`, parseError.message);
        }
      }
    } catch (fetchError) {
      console.log(`📝 UNIVERSAL PARSER: Could not fetch prompt2 for ${sectorId}, using defaults`);
    }
    
    // Try to load rules file with error handling
    try {
      const rulesResponse = await fetch(rulesUrl, { 
        cache: 'no-cache',
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      if (rulesResponse.ok) {
        rulesContent = await rulesResponse.text();
        console.log(`✅ UNIVERSAL PARSER: Loaded rules for ${sectorId}`);
      }
    } catch (fetchError) {
      console.log(`📝 UNIVERSAL PARSER: Could not fetch rules for ${sectorId}`);
    }
    
    const rules = rulesContent ? parseRulesFile(rulesContent) : {};
    
    // Ensure we always have valid categories
    if (!categories || categories.length === 0) {
      console.log(`🔄 UNIVERSAL PARSER: No valid categories, using defaults for ${sectorId}`);
      categories = defaultCategories;
    }
    
    console.log(`✅ UNIVERSAL PARSER: Completed for ${sectorId}: ${categories.length} categories with ${categories.reduce((total, cat) => total + cat.items.length, 0)} total items`);
    
    return {
      sectorId,
      categories,
      rules,
      hasData: true, // Always true since we have defaults
      errorMessage: categories === defaultCategories ? `Using default services for ${sectorId}` : undefined,
    };
    
  } catch (error) {
    console.error(`❌ UNIVERSAL PARSER: Critical error for ${sectorId}:`, error);
    
    // Always return valid data, even in case of critical error
    console.log(`🔄 UNIVERSAL PARSER: Returning fallback data for ${sectorId}`);
    
    return {
      sectorId,
      categories: defaultCategories,
      rules: {},
      hasData: true,
      errorMessage: `Using default services for ${sectorId} (error occurred)`,
    };
  }
};

// Generate realistic default services based on sector type
export const generateDefaultSectorServices = (sectorId: string): ParsedCategory[] => {
  const sectorTemplates: Record<string, ParsedCategory[]> = {
    // Service-Based Sectors
    auto_repair: [
      {
        name: "Engine Services",
        items: [
          { id: 1001, name: "Oil Change & Filter", price: 45.99, description: "Full synthetic oil change with premium filter replacement" },
          { id: 1002, name: "Engine Tune-Up", price: 189.99, description: "Complete engine tune-up including spark plugs and diagnostics" },
          { id: 1003, name: "Engine Diagnostics", price: 99.99, description: "Computer diagnostic scan with detailed analysis report" },
          { id: 1004, name: "Transmission Service", price: 149.99, description: "Transmission fluid change and inspection" }
        ]
      },
      {
        name: "Brake Services",
        items: [
          { id: 1005, name: "Brake Pad Replacement", price: 159.99, description: "Front or rear brake pad replacement with inspection" },
          { id: 1006, name: "Brake System Inspection", price: 29.99, description: "Complete brake system safety inspection" },
          { id: 1007, name: "Brake Fluid Service", price: 79.99, description: "Brake fluid flush and replacement" },
          { id: 1008, name: "Brake Rotor Resurfacing", price: 89.99, description: "Professional brake rotor resurfacing service" }
        ]
      },
      {
        name: "Tire Services",
        items: [
          { id: 1009, name: "Tire Installation", price: 25.99, description: "Professional tire mounting and balancing per tire" },
          { id: 1010, name: "Wheel Alignment", price: 89.99, description: "4-wheel computerized alignment service" },
          { id: 1011, name: "Tire Rotation", price: 19.99, description: "Complete tire rotation and pressure check" }
        ]
      }
    ],
    
    beauty_salon: [
      {
        name: "Hair Services",
        items: [
          { id: 2001, name: "Haircut & Style", price: 65.00, description: "Professional cut and styling consultation" },
          { id: 2002, name: "Hair Color Treatment", price: 120.00, description: "Full color treatment with premium products" },
          { id: 2003, name: "Hair Highlights", price: 95.00, description: "Partial or full highlights with toner" },
          { id: 2004, name: "Hair Extensions", price: 200.00, description: "Premium hair extension application" }
        ]
      },
      {
        name: "Nail Services",
        items: [
          { id: 2005, name: "Classic Manicure", price: 35.00, description: "Classic manicure with polish and hand massage" },
          { id: 2006, name: "Spa Pedicure", price: 45.00, description: "Relaxing spa pedicure with foot massage" },
          { id: 2007, name: "Gel Nail Application", price: 55.00, description: "Long-lasting gel nail application" },
          { id: 2008, name: "Nail Art Design", price: 25.00, description: "Custom nail art and design service" }
        ]
      },
      {
        name: "Facial Services",
        items: [
          { id: 2009, name: "Deep Cleansing Facial", price: 85.00, description: "Deep pore cleansing facial treatment" },
          { id: 2010, name: "Anti-Aging Facial", price: 110.00, description: "Advanced anti-aging facial with serums" },
          { id: 2011, name: "Hydrating Facial", price: 75.00, description: "Moisturizing facial for dry skin" }
        ]
      }
    ],
    
    healthcare: [
      {
        name: "General Medicine",
        items: [
          { id: 3001, name: "Annual Physical Exam", price: 150.00, description: "Comprehensive annual health examination" },
          { id: 3002, name: "Urgent Care Visit", price: 120.00, description: "Same-day urgent care consultation" },
          { id: 3003, name: "Preventive Screening", price: 80.00, description: "Health screening and wellness check" },
          { id: 3004, name: "Vaccination Services", price: 45.00, description: "Immunization and vaccination services" }
        ]
      },
      {
        name: "Specialist Consultations",
        items: [
          { id: 3005, name: "Cardiology Consultation", price: 200.00, description: "Heart health specialist consultation" },
          { id: 3006, name: "Dermatology Exam", price: 180.00, description: "Skin health examination and treatment" },
          { id: 3007, name: "Orthopedic Consultation", price: 190.00, description: "Bone and joint specialist consultation" }
        ]
      }
    ],
    
    education_tutoring: [
      {
        name: "Academic Tutoring",
        items: [
          { id: 4001, name: "Math Tutoring", price: 60.00, description: "One-on-one mathematics tutoring session" },
          { id: 4002, name: "Science Tutoring", price: 65.00, description: "Physics, chemistry, and biology tutoring" },
          { id: 4003, name: "English & Writing", price: 55.00, description: "English language and writing skills tutoring" },
          { id: 4004, name: "Test Prep (SAT/ACT)", price: 80.00, description: "Standardized test preparation sessions" }
        ]
      },
      {
        name: "Language Learning",
        items: [
          { id: 4005, name: "Spanish Lessons", price: 50.00, description: "Conversational Spanish language lessons" },
          { id: 4006, name: "French Lessons", price: 50.00, description: "French language instruction and practice" },
          { id: 4007, name: "ESL Tutoring", price: 45.00, description: "English as Second Language tutoring" }
        ]
      }
    ],
    
    financial_services: [
      {
        name: "Investment Services",
        items: [
          { id: 5001, name: "Portfolio Review", price: 150.00, description: "Comprehensive investment portfolio analysis" },
          { id: 5002, name: "Retirement Planning", price: 200.00, description: "Retirement strategy consultation and planning" },
          { id: 5003, name: "Tax Planning", price: 120.00, description: "Tax optimization strategy consultation" },
          { id: 5004, name: "Estate Planning", price: 250.00, description: "Estate planning and wealth transfer strategies" }
        ]
      },
      {
        name: "Insurance Services",
        items: [
          { id: 5005, name: "Life Insurance Quote", price: 0.00, description: "Free life insurance consultation and quote" },
          { id: 5006, name: "Auto Insurance Review", price: 0.00, description: "Auto insurance policy review and optimization" },
          { id: 5007, name: "Home Insurance Assessment", price: 50.00, description: "Home insurance needs assessment" }
        ]
      }
    ],
    
    legal_services: [
      {
        name: "Legal Consultations",
        items: [
          { id: 6001, name: "Initial Legal Consultation", price: 200.00, description: "One-hour initial legal consultation" },
          { id: 6002, name: "Contract Review", price: 150.00, description: "Legal contract review and analysis" },
          { id: 6003, name: "Document Preparation", price: 100.00, description: "Legal document drafting and preparation" },
          { id: 6004, name: "Court Representation", price: 300.00, description: "Legal representation in court proceedings" }
        ]
      },
      {
        name: "Specialized Legal Services",
        items: [
          { id: 6005, name: "Family Law Consultation", price: 180.00, description: "Family law matters consultation" },
          { id: 6006, name: "Business Law Advice", price: 220.00, description: "Business legal matters consultation" },
          { id: 6007, name: "Real Estate Legal Review", price: 160.00, description: "Real estate transaction legal review" }
        ]
      }
    ],
    
    home_services: [
      {
        name: "Cleaning Services",
        items: [
          { id: 7001, name: "Deep House Cleaning", price: 150.00, description: "Comprehensive deep cleaning service" },
          { id: 7002, name: "Regular House Cleaning", price: 80.00, description: "Weekly or bi-weekly house cleaning" },
          { id: 7003, name: "Move-in/Move-out Cleaning", price: 200.00, description: "Thorough cleaning for moving" },
          { id: 7004, name: "Post-Construction Cleanup", price: 250.00, description: "Construction debris and dust cleanup" }
        ]
      },
      {
        name: "Maintenance & Repair",
        items: [
          { id: 7005, name: "Plumbing Repair", price: 120.00, description: "General plumbing repair services" },
          { id: 7006, name: "Electrical Work", price: 100.00, description: "Electrical installation and repair" },
          { id: 7007, name: "HVAC Maintenance", price: 90.00, description: "Heating and cooling system maintenance" },
          { id: 7008, name: "Handyman Services", price: 60.00, description: "General home repair and maintenance" }
        ]
      }
    ],
    
    fitness_gym: [
      {
        name: "Personal Training",
        items: [
          { id: 8001, name: "One-on-One Training", price: 75.00, description: "Personal training session with certified trainer" },
          { id: 8002, name: "Group Fitness Class", price: 25.00, description: "Group fitness class participation" },
          { id: 8003, name: "Nutrition Consultation", price: 60.00, description: "Personalized nutrition planning session" },
          { id: 8004, name: "Fitness Assessment", price: 40.00, description: "Comprehensive fitness evaluation" }
        ]
      },
      {
        name: "Specialized Programs",
        items: [
          { id: 8005, name: "Weight Loss Program", price: 200.00, description: "12-week weight loss program" },
          { id: 8006, name: "Strength Training Program", price: 180.00, description: "Customized strength training program" },
          { id: 8007, name: "Yoga Classes", price: 20.00, description: "Yoga class session" }
        ]
      }
    ]
  };

  // Return sector-specific services or generate generic ones
  if (sectorTemplates[sectorId]) {
    return sectorTemplates[sectorId];
  }

  // Generate generic services for sectors not yet defined
  const sectorDisplayNames: Record<string, string> = {
    event_planning: "Event Planning",
    it_services: "IT Services", 
    laundry_services: "Laundry Services",
    moving_services: "Moving Services",
    pet_services: "Pet Services",
    photography: "Photography",
    real_estate: "Real Estate",
    transportation: "Transportation",
    travel_hotel: "Travel & Hotel",
    insurance: "Insurance",
    food_delivery: "Food Delivery",
    education_tutoring: "Education & Tutoring"
  };

  const displayName = sectorDisplayNames[sectorId] || sectorId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  console.log(`🎯 UNIVERSAL PARSER: Generating default services for ${sectorId} (${displayName})`);

  const defaultServices = [
    {
      name: `${displayName} Services`,
      items: [
        { id: 9001 + Math.floor(Math.random() * 1000), name: `Basic ${displayName} Service`, price: 99.99, description: `Professional ${displayName.toLowerCase()} service` },
        { id: 9002 + Math.floor(Math.random() * 1000), name: `Premium ${displayName} Package`, price: 199.99, description: `Comprehensive ${displayName.toLowerCase()} solution` },
        { id: 9003 + Math.floor(Math.random() * 1000), name: `${displayName} Consultation`, price: 49.99, description: `Expert consultation for ${displayName.toLowerCase()}` },
        { id: 9004 + Math.floor(Math.random() * 1000), name: `Emergency ${displayName} Service`, price: 149.99, description: `Urgent ${displayName.toLowerCase()} assistance` }
      ]
    },
    {
      name: `Advanced ${displayName}`,
      items: [
        { id: 9005 + Math.floor(Math.random() * 1000), name: `Custom ${displayName} Solution`, price: 299.99, description: `Tailored ${displayName.toLowerCase()} solution` },
        { id: 9006 + Math.floor(Math.random() * 1000), name: `${displayName} Maintenance`, price: 79.99, description: `Ongoing ${displayName.toLowerCase()} maintenance` }
      ]
    }
  ];
  
  return defaultServices;
};

// Get sector-specific features based on sector type
export const getSectorFeatures = (sectorId: string): SectorFeatures => {
  const serviceBasedSectors = ['auto_repair', 'beauty_salon', 'home_services', 'healthcare', 'fitness_gym'];
  const productBasedSectors = ['food_delivery', 'laundry_services', 'pet_services'];
  const professionalSectors = ['legal_services', 'financial_services', 'real_estate', 'it_services'];
  const experienceBasedSectors = ['education_tutoring', 'event_planning', 'photography', 'travel_hotel'];

  let sectorType: 'service' | 'product' | 'professional' | 'experience' = 'service';
  
  if (productBasedSectors.includes(sectorId)) sectorType = 'product';
  else if (professionalSectors.includes(sectorId)) sectorType = 'professional';
  else if (experienceBasedSectors.includes(sectorId)) sectorType = 'experience';

  return {
    hasBooking: serviceBasedSectors.includes(sectorId) || professionalSectors.includes(sectorId),
    hasRatings: true, // All sectors can have ratings
    hasGallery: ['beauty_salon', 'photography', 'event_planning', 'home_services'].includes(sectorId),
    hasInventory: productBasedSectors.includes(sectorId),
    hasConsultation: professionalSectors.includes(sectorId),
    hasScheduling: !productBasedSectors.includes(sectorId),
    sectorType
  };
};

// Get appropriate service image based on sector and service
export const getSectorServiceImage = (serviceName: string, categoryName: string, sectorId: string): string => {
  const name = serviceName.toLowerCase();
  const category = categoryName.toLowerCase();
  
  // Sector-specific image mappings
  const sectorImages: Record<string, Record<string, string>> = {
    auto_repair: {
      'oil': "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop&auto=format",
      'engine': "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop&auto=format",
      'brake': "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&auto=format",
      'tire': "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format",
      'transmission': "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&auto=format"
    },
    beauty_salon: {
      'hair': "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format",
      'nail': "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&auto=format",
      'facial': "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&auto=format",
      'massage': "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&auto=format"
    },
    healthcare: {
      'exam': "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop&auto=format",
      'consultation': "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format",
      'vaccination': "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
    },
    education_tutoring: {
      'math': "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop&auto=format",
      'science': "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop&auto=format",
      'english': "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
      'language': "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop&auto=format"
    },
    financial_services: {
      'investment': "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&auto=format",
      'insurance': "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop&auto=format",
      'planning': "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&auto=format"
    }
  };

  // Check for sector-specific images
  if (sectorImages[sectorId]) {
    for (const [keyword, imageUrl] of Object.entries(sectorImages[sectorId])) {
      if (name.includes(keyword) || category.includes(keyword)) {
        return imageUrl;
      }
    }
  }

  // Default sector images
  const defaultSectorImages: Record<string, string> = {
    auto_repair: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop&auto=format",
    beauty_salon: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop&auto=format",
    healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format",
    education_tutoring: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop&auto=format",
    financial_services: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
    legal_services: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&auto=format",
    home_services: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format",
    fitness_gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&auto=format"
  };

  return defaultSectorImages[sectorId] || "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
};
