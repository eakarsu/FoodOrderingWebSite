import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Award, Heart, Brain, MessageSquare, Phone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem } from "@shared/schema";
import ContactUsDirectly from "@/components/ContactUsDirectly";

export default function HomePage() {
  const { dispatch } = useCart();

  // Fetch featured dishes (first 3 main courses)
  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const featuredDishes = menuItems?.filter(item => item.category === "mains").slice(0, 3) || [];

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
              🚀 DEMO SITE - Test Our AI-Powered Food Ordering Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Next-Generation<br />
              <span className="text-accent">Food Ordering Platform</span>
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Experience our AI-powered food ordering system with SMS integration, voice calls, and intelligent menu recommendations. This demo showcases Orderly Bite - a customizable solution for restaurants and food establishments.
            </p>
            <p className="text-lg mb-8 text-gray-300 bg-black bg-opacity-30 p-4 rounded-lg">
              <strong>Try the Demo:</strong> Send real SMS messages, make actual voice calls, and explore our AI recommendations. This platform can be fully customized for any restaurant or food business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Explore Menu
                </Button>
              </Link>
              <Link href="/offers">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 font-semibold">
                  View Offers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Directly Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ContactUsDirectly />
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Featured Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our chef's signature creations, made with the finest ingredients and culinary expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
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
              ))
            ) : (
              featuredDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-secondary mb-2">{dish.name}</h3>
                    <p className="text-gray-600 mb-4">{dish.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${dish.price}</span>
                      <Button
                        onClick={() => handleAddToCart(dish)}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* AI-Powered Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">AI-Powered Food Ordering Technology</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Our cutting-edge platform combines artificial intelligence with seamless communication technology to revolutionize the food ordering experience for restaurants and customers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
              <p className="text-gray-600">AI analyzes preferences and order history to suggest personalized menu items</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">SMS Integration</h3>
              <p className="text-gray-600">Real-time SMS ordering and customer communication with automated responses</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Voice Ordering</h3>
              <p className="text-gray-600">Integrated voice calling system for direct customer-restaurant communication</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Custom Solutions</h3>
              <p className="text-gray-600">Fully customizable platform tailored to any restaurant or food business needs</p>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6">Platform Capabilities Showcase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-600">For Restaurant Owners:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete menu management with customization rules</li>
                  <li>• Real-time order processing and notifications</li>
                  <li>• Customer communication via SMS and voice</li>
                  <li>• AI-driven sales analytics and insights</li>
                  <li>• Multi-channel ordering (web, SMS, phone)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-green-600">For Customers:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personalized menu recommendations</li>
                  <li>• Flexible ordering through multiple channels</li>
                  <li>• Real-time order tracking and updates</li>
                  <li>• Custom meal builder with smart suggestions</li>
                  <li>• Seamless payment and delivery coordination</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Native AI order-planning workspace */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              <Brain className="inline-block mr-3 text-primary" />
              AI Order Planning
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prepare a dietary review, a group order, or a pickup checklist with three complete examples and a separate Generate with OpenRouter action.
            </p>
          </div>

          <Card className="mx-auto max-w-2xl p-6 text-center">
            <p className="mb-4 text-gray-600">
              Automated personalized dish recommendations are unavailable here. In AI Operations, review your request and generate a saved planning report; confirm ingredients, allergies, availability, and payment with the restaurant.
            </p>
            <Link href="/ai-operations">
              <Button className="bg-primary hover:bg-primary/90 text-white">Open AI Operations</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Fresh meals delivered in 30-45 minutes or less</p>
            </div>
            <div>
              <Award className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Chef Quality</h3>
              <p className="text-gray-300">Every dish crafted by our award-winning culinary team</p>
            </div>
            <div>
              <Heart className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-300">Locally sourced, organic ingredients in every meal</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
