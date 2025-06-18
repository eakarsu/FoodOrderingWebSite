import { RefreshCw, DollarSign, Clock, AlertCircle, CheckCircle2, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to be completely satisfied with your Orderly Bite experience. Review our return and refund policies below.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Request Return</h3>
              <p className="text-gray-600 mb-4">Start a return process for your recent order</p>
              <Button className="w-full">Start Return</Button>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">Check Refund Status</h3>
              <p className="text-gray-600 mb-4">Track the status of your refund request</p>
              <Button variant="outline" className="w-full">Check Status</Button>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
              <p className="text-gray-600 mb-4">Speak with our customer service team</p>
              <Button variant="outline" className="w-full">Call Support</Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Refund Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  We offer full refunds for orders that don't meet your expectations or arrive damaged.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Eligible for Full Refund:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Order arrived damaged or spoiled
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Wrong items delivered
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Missing items from order
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Order cancelled before preparation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Delivery delayed beyond 2 hours
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Refund Timeline:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">1-2 hours</Badge>
                      <span className="text-sm">Request processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">3-5 days</Badge>
                      <span className="text-sm">Credit card refunds</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">1-2 days</Badge>
                      <span className="text-sm">Digital wallet refunds</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Instant</Badge>
                      <span className="text-sm">Orderly Bite credit</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                How to Return an Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Contact Us</h4>
                  <p className="text-sm text-gray-600">Call or message within 2 hours of delivery</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Provide Details</h4>
                  <p className="text-sm text-gray-600">Share your order number and reason for return</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Get Approved</h4>
                  <p className="text-sm text-gray-600">We'll review and approve eligible returns</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">Receive Refund</h4>
                  <p className="text-sm text-gray-600">Refund processed to original payment method</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Special Circumstances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">Partial Refunds:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Orders with minor quality issues</li>
                    <li>• Customization errors (our fault)</li>
                    <li>• Temperature issues upon delivery</li>
                    <li>• Packaging concerns</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">No Refund Cases:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Customer unavailable for delivery</li>
                    <li>• Wrong delivery address provided</li>
                    <li>• Order consumed before complaint</li>
                    <li>• Personal taste preferences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Customer Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Phone Support</h4>
                  <p className="text-lg font-medium text-primary">804-360-1129</p>
                  <p className="text-sm text-gray-600">Mon-Sun: 11AM-11PM</p>
                </div>
                
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-lg font-medium text-primary">support@orderlybite.com</p>
                  <p className="text-sm text-gray-600">Response within 2 hours</p>
                </div>
                
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <Button className="mt-2">Start Chat</Button>
                  <p className="text-sm text-gray-600 mt-2">Available 24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}