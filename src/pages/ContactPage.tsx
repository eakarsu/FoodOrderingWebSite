import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContactMessage } from "@shared/schema";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: (data: InsertContactMessage) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: ["2807 Hampton Drive", "Henrico VA 23233", "United States"]
    },
    {
      icon: Phone,
      title: "Phone",
      content: ["804-360-1129"]
    },
    {
      icon: Mail,
      title: "Email",
      content: ["support@orderlybite.com"]
    },
    {
      icon: Clock,
      title: "Delivery Hours",
      content: [
        "Monday - Thursday: 11:00 AM - 10:00 PM",
        "Friday - Saturday: 11:00 AM - 11:00 PM", 
        "Sunday: 12:00 PM - 9:00 PM"
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", href: "#" },
    { name: "Instagram", icon: "fab fa-instagram", href: "#" },
    { name: "Twitter", icon: "fab fa-twitter", href: "#" },
    { name: "YouTube", icon: "fab fa-youtube", href: "#" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Get In Touch</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            We'd love to hear from you. Reach out for reservations, catering inquiries, or just to say hello!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-8">Visit Our Kitchen</h2>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary mb-1">{info.title}</h3>
                      <div className="text-gray-600">
                        {info.content.map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <Card className="h-64">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-semibold">Interactive Map</p>
                  <p className="text-sm">2807 Hampton Drive<br />Henrico VA 23233<br />United States</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-8">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Subject
                </label>
                <Select onValueChange={(value) => handleChange("subject", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="catering">Catering Services</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Message
                </label>
                <Textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Social Media */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-bold text-secondary mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
