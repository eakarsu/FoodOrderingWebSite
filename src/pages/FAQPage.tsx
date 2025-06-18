import { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories = [
    { id: "all", name: "All Questions", count: 24 },
    { id: "ordering", name: "Ordering", count: 8 },
    { id: "delivery", name: "Delivery", count: 6 },
    { id: "payment", name: "Payment", count: 4 },
    { id: "platform", name: "Platform Features", count: 6 }
  ];

  const faqs = [
    {
      id: 1,
      category: "ordering",
      question: "How do I place an order using SMS?",
      answer: "Simply text your order to our SMS number at 804-360-1129. Include the item names and quantities. Our AI system will process your order and send you a confirmation with the total price and estimated delivery time. You can also call us directly for voice ordering assistance."
    },
    {
      id: 2,
      category: "ordering",
      question: "Can I customize my order with special dietary requirements?",
      answer: "Yes! Our AI-powered platform allows extensive customization. You can specify dietary restrictions, allergies, spice levels, and ingredient modifications. Use our Build Your Own feature on the website, or mention your requirements when ordering via SMS or phone."
    },
    {
      id: 3,
      category: "ordering",
      question: "What are AI recommendations and how do they work?",
      answer: "Our AI analyzes your order history, preferences, and dietary needs to suggest personalized meal combinations. These recommendations are displayed on your homepage and can be accessed through any ordering channel - web, SMS, or voice calls."
    },
    {
      id: 4,
      category: "delivery",
      question: "What are your delivery hours?",
      answer: "We deliver Monday through Sunday from 11AM to 11PM. For late-night tech workers, we offer special deals for orders placed after 9 PM until 2 AM with our Late Night Tech Special promotion."
    },
    {
      id: 5,
      category: "delivery",
      question: "How can I track my order?",
      answer: "You'll receive real-time SMS updates about your order status. You can also visit our Order Tracking page and enter your order number. Our system provides live updates from preparation to delivery."
    },
    {
      id: 6,
      category: "delivery",
      question: "What if I'm not available when the delivery arrives?",
      answer: "Please ensure someone is available at the delivery address. If no one is available, our driver will attempt to contact you via phone. Orders cannot be left unattended for food safety reasons."
    },
    {
      id: 7,
      category: "payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, digital wallets (Apple Pay, Google Pay), and cash on delivery. For SMS orders, you can provide payment details over the phone or pay upon delivery."
    },
    {
      id: 8,
      category: "payment",
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and secure payment processing. Your payment information is never stored on our servers and is processed through certified payment gateways."
    },
    {
      id: 9,
      category: "platform",
      question: "What makes Orderly Bite different from other food delivery services?",
      answer: "Orderly Bite is an AI-powered platform that offers multiple ordering channels - web, SMS, and voice calls. Our unique features include AI meal recommendations, real-time customization, and seamless integration across all communication methods."
    },
    {
      id: 10,
      category: "platform",
      question: "Can restaurants customize this platform for their business?",
      answer: "Yes! Orderly Bite is a white-label solution that can be fully customized for any restaurant or food service business. Restaurants can customize menus, branding, rules, and ordering workflows to match their specific needs."
    },
    {
      id: 11,
      category: "ordering",
      question: "How do voice orders work?",
      answer: "Call us at 804-360-1129 and our voice ordering system will help you place your order. You can speak with our staff or use our automated voice recognition system. Voice orders include our exclusive Voice Call Combo discounts."
    },
    {
      id: 12,
      category: "delivery",
      question: "Do you deliver to my area?",
      answer: "We currently deliver within a 15-mile radius of our location at 2807 Hampton Drive, Henrico VA 23233. Enter your address during checkout to confirm delivery availability and see estimated delivery times."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about ordering, delivery, and our AI-powered platform features.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedItems.includes(faq.id) && (
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse by category.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Still Need Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Still Need Help?</CardTitle>
              <p className="text-center text-gray-600">
                Can't find what you're looking for? Our support team is here to help.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-primary font-medium">804-360-1129</p>
                  <p className="text-sm text-gray-600">Mon-Sun: 11AM-11PM</p>
                  <Button className="mt-3 w-full">Call Now</Button>
                </div>
                
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-primary font-medium">support@orderlybite.com</p>
                  <p className="text-sm text-gray-600">Response within 2 hours</p>
                  <Button variant="outline" className="mt-3 w-full">Send Email</Button>
                </div>
                
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-gray-600">Available 24/7</p>
                  <p className="text-sm text-gray-600">Instant responses</p>
                  <Button variant="outline" className="mt-3 w-full">Start Chat</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}