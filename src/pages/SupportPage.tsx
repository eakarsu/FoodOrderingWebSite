import { useState } from "react";
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: ""
  });

  const supportOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "804-360-1129",
      hours: "Mon-Sun: 11AM-11PM",
      responseTime: "Immediate",
      action: "Call Now"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through our chat system",
      contact: "Available on website",
      hours: "24/7 Available",
      responseTime: "Under 1 minute",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@orderlybite.com",
      hours: "24/7 Monitoring",
      responseTime: "Within 2 hours",
      action: "Send Email"
    }
  ];

  const issueTypes = [
    "Order Issues",
    "Delivery Problems",
    "Payment Questions",
    "Account Help",
    "Platform Features",
    "Technical Issues",
    "Billing Inquiries",
    "General Questions"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    console.log("Support ticket submitted:", formData);
    alert("Thank you! Your support ticket has been submitted. We'll get back to you within 2 hours.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Need help? Our support team is here to assist you with any questions or issues. Choose your preferred contact method below.
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{option.title}</CardTitle>
                  <p className="text-gray-600">{option.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="font-medium text-primary">{option.contact}</p>
                    <p className="text-sm text-gray-600">{option.hours}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {option.responseTime}
                    </Badge>
                  </div>
                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Support Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submit a Support Ticket
              </CardTitle>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Order Number</label>
                  <Input
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                    placeholder="ORD-123456 (if applicable)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Issue Type *</label>
                  <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>

                <Button type="submit" className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Support Ticket
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="text-gray-600">
                    2807 Hampton Drive<br />
                    Henrico, VA 23233
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-primary font-medium">804-360-1129</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-primary font-medium">support@orderlybite.com</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Business Hours</h4>
                  <div className="text-sm text-gray-600">
                    <p>Monday - Thursday: 11AM - 10PM</p>
                    <p>Friday - Saturday: 11AM - 11PM</p>
                    <p>Sunday: 12PM - 9PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Common Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Order Tracking</h4>
                    <p className="text-sm text-gray-600">Visit our Order Tracking page or check your SMS updates</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Payment Issues</h4>
                    <p className="text-sm text-gray-600">Call us directly for immediate payment assistance</p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold">Delivery Delays</h4>
                    <p className="text-sm text-gray-600">We'll provide updates and compensation when applicable</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Platform Features</h4>
                    <p className="text-sm text-gray-600">Learn about our AI recommendations and SMS ordering</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Phone Support</span>
                    <Badge className="bg-green-100 text-green-800">Immediate</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Live Chat</span>
                    <Badge className="bg-green-100 text-green-800">Under 1 minute</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email/Ticket</span>
                    <Badge className="bg-blue-100 text-blue-800">Within 2 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Complex Issues</span>
                    <Badge className="bg-orange-100 text-orange-800">24-48 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}