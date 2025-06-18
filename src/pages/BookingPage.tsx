import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { SECTORS } from "../lib/sectors";

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    urgency: 'normal'
  });

  // Get sector from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sectorId = urlParams.get('sector');
  const featureType = urlParams.get('feature');
  
  const sector = SECTORS.find(s => s.id === sectorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${getFeatureTitle()} request submitted successfully!\n\nWe'll contact you shortly to confirm your ${featureType}.`);
    setLocation('/');
  };

  const getFeatureTitle = () => {
    switch (featureType) {
      case 'booking': return 'Real-Time Booking';
      case 'consultation': return 'Consultation Scheduling';
      case 'document': return 'Document Upload';
      case 'chat': return 'Secure Communication';
      case 'catalog': return 'Product Catalog Request';
      case 'order': return 'Order Processing';
      case 'event': return 'Event Scheduling';
      case 'progress': return 'Progress Tracking Setup';
      case 'community': return 'Community Access';
      case 'emergency': return 'Emergency Service';
      default: return 'Service Request';
    }
  };

  const getFeatureDescription = () => {
    switch (featureType) {
      case 'booking': return 'Schedule your appointment with real-time availability';
      case 'consultation': return 'Book a professional consultation session';
      case 'document': return 'Securely upload and share your documents';
      case 'chat': return 'Start encrypted communication with our team';
      case 'catalog': return 'Request access to our complete product catalog';
      case 'order': return 'Place your order with tracking information';
      case 'event': return 'Schedule events, classes, or sessions';
      case 'progress': return 'Set up progress tracking for your goals';
      case 'community': return 'Join our community platform';
      case 'emergency': return 'Request immediate emergency assistance';
      default: return 'Submit your service request';
    }
  };

  const renderFeatureSpecificFields = () => {
    switch (featureType) {
      case 'booking':
      case 'consultation':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select onValueChange={(value) => setFormData({...formData, time: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="service">Service Type</Label>
              <Select onValueChange={(value) => setFormData({...formData, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Service</SelectItem>
                  <SelectItem value="standard">Standard Service</SelectItem>
                  <SelectItem value="premium">Premium Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'emergency':
        return (
          <>
            <div>
              <Label htmlFor="urgency">Emergency Level</Label>
              <Select onValueChange={(value) => setFormData({...formData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High - Immediate Response</SelectItem>
                  <SelectItem value="medium">Medium - Within 1 Hour</SelectItem>
                  <SelectItem value="low">Low - Within 4 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Emergency Hotline:</strong> For immediate assistance, call (555) 911-HELP
              </p>
            </div>
          </>
        );
      
      case 'document':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-type">Document Type</Label>
              <Select onValueChange={(value) => setFormData({...formData, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="financial">Financial Records</SelectItem>
                  <SelectItem value="legal">Legal Documents</SelectItem>
                  <SelectItem value="medical">Medical Records</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Supported formats:</strong> PDF, DOC, DOCX, JPG, PNG, XLS, CSV<br/>
                <strong>Security:</strong> 256-bit encryption and secure cloud storage
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sector not found</h1>
          <Button onClick={() => setLocation('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <div 
                className="text-2xl p-2 rounded-lg"
                style={{ backgroundColor: `${sector.primaryColor}20`, color: sector.primaryColor }}
              >
                {sector.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold">{sector.displayName}</h1>
                <p className="text-sm text-gray-600">{getFeatureTitle()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {featureType === 'booking' && <Calendar className="h-5 w-5" />}
                {featureType === 'consultation' && <User className="h-5 w-5" />}
                {featureType === 'chat' && <MessageSquare className="h-5 w-5" />}
                {featureType === 'emergency' && <Phone className="h-5 w-5 text-red-600" />}
                {getFeatureTitle()}
              </CardTitle>
              <p className="text-gray-600">{getFeatureDescription()}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Feature-specific fields */}
                {renderFeatureSpecificFields()}

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or special requirements..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    style={{ backgroundColor: sector.primaryColor }}
                  >
                    Submit {getFeatureTitle()}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
