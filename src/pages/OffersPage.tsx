import { useState } from "react";
import { Clock, Star, Gift, Percent, Users, Calendar, Tag, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

export default function OffersPage() {
  const { dispatch } = useCart();
  const [activeTab, setActiveTab] = useState('all');

  const offers = [
    {
      id: 1,
      title: "AI Bundle Special",
      description: "Get 3 AI-recommended meals for the price of 2. Our smart system picks the perfect combination based on your preferences.",
      discount: "33% OFF",
      category: "ai-special",
      validUntil: "2024-12-31",
      originalPrice: 45.00,
      offerPrice: 30.00,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      features: ["AI-curated selection", "Nutritionally balanced", "Personalized for you"],
      isPopular: true
    },
    {
      id: 2,
      title: "SMS Order Discount",
      description: "Order via SMS and get instant savings! Text us your order and receive automated confirmation.",
      discount: "15% OFF",
      category: "sms-special",
      validUntil: "2024-12-25",
      originalPrice: 25.00,
      offerPrice: 21.25,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      features: ["Text-to-order system", "Instant confirmation", "Voice call support"],
      isNew: true
    },
    {
      id: 3,
      title: "Voice Call Combo",
      description: "Call us directly and get our premium voice ordering experience with exclusive deals.",
      discount: "20% OFF",
      category: "voice-special",
      validUntil: "2024-12-30",
      originalPrice: 35.00,
      offerPrice: 28.00,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      features: ["Personal service", "Custom modifications", "Real-time support"]
    },
    {
      id: 4,
      title: "Platform Demo Special",
      description: "Experience our full AI platform capabilities with this comprehensive meal package.",
      discount: "25% OFF",
      category: "demo-special",
      validUntil: "2024-12-31",
      originalPrice: 60.00,
      offerPrice: 45.00,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      features: ["Multi-channel ordering", "AI recommendations", "Real-time tracking"],
      isPopular: true
    },
    {
      id: 5,
      title: "Family Bundle AI",
      description: "Our AI creates the perfect family meal combination with options for everyone's dietary preferences.",
      discount: "30% OFF",
      category: "family",
      validUntil: "2024-12-28",
      originalPrice: 80.00,
      offerPrice: 56.00,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      features: ["Serves 4-6 people", "Dietary customization", "Kid-friendly options"]
    },
    {
      id: 6,
      title: "Late Night Tech Special",
      description: "Perfect for developers and night owls! Order after 9 PM using our platform demo features.",
      discount: "18% OFF",
      category: "late-night",
      validUntil: "2024-12-31",
      originalPrice: 22.00,
      offerPrice: 18.04,
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      features: ["Available 9 PM - 2 AM", "Quick delivery", "Energy-boosting meals"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Offers', icon: Gift },
    { id: 'ai-special', name: 'AI Specials', icon: Star },
    { id: 'sms-special', name: 'SMS Orders', icon: Users },
    { id: 'voice-special', name: 'Voice Orders', icon: Trophy },
    { id: 'demo-special', name: 'Demo Features', icon: Tag },
    { id: 'family', name: 'Family Deals', icon: Users },
    { id: 'late-night', name: 'Late Night', icon: Clock }
  ];

  const filteredOffers = activeTab === 'all' ? offers : offers.filter(offer => offer.category === activeTab);

  const handleAddToCart = (offer: typeof offers[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: offer.id,
        name: offer.title,
        price: offer.offerPrice,
        image: offer.image
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Platform Demo Offers
            </h1>
            <p className="text-xl mb-6 max-w-3xl mx-auto">
              Explore exclusive deals that showcase our AI-powered ordering system, SMS integration, and voice calling features. Experience the future of food ordering!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                AI-Curated Deals
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                SMS & Voice Orders
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Gift className="h-4 w-4 mr-2" />
                Platform Features
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Category Filters */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Demo Features</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  onClick={() => setActiveTab(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              {offer.isPopular && (
                <Badge className="absolute top-4 left-4 z-10 bg-primary">
                  <Trophy className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              {offer.isNew && (
                <Badge className="absolute top-4 left-4 z-10 bg-green-600">
                  <Star className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
              
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full font-bold">
                  {offer.discount}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{offer.title}</CardTitle>
                <p className="text-gray-600">{offer.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-2">Demo Features:</h4>
                    <ul className="space-y-1">
                      {offer.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">${offer.offerPrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${offer.originalPrice}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleAddToCart(offer)}
                    className="w-full"
                  >
                    Try This Demo Deal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Features Showcase */}
        <section className="mt-20 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our AI Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Recommendations</h3>
              <p className="text-gray-600">Smart algorithms analyze your preferences to suggest perfect meal combinations and deals.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Channel Ordering</h3>
              <p className="text-gray-600">Order through web, SMS, or voice calls - all integrated into one seamless experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dynamic Promotions</h3>
              <p className="text-gray-600">Real-time offer generation based on demand, time, and customer behavior patterns.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}