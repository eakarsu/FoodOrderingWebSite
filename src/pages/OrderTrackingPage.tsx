import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrackOrder = () => {
    // Simulate tracking result for demo
    if (orderNumber) {
      setTrackingResult({
        orderNumber: orderNumber,
        status: "In Transit",
        estimatedDelivery: "Today, 6:30 PM",
        currentLocation: "Local Distribution Center",
        items: [
          { name: "AI Bundle Special", quantity: 1, price: 30.00 },
          { name: "Fresh Salad Bowl", quantity: 2, price: 24.00 }
        ],
        timeline: [
          { status: "Order Placed", time: "2:30 PM", completed: true },
          { status: "Preparing", time: "2:45 PM", completed: true },
          { status: "Out for Delivery", time: "5:15 PM", completed: true },
          { status: "Delivered", time: "6:30 PM (Est.)", completed: false }
        ]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Tracking</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your Orderly Bite order in real-time. Enter your order number below to see the current status and estimated delivery time.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your order number (e.g., ORD-123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrackOrder} className="px-8">
                  Track Order
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Your order number can be found in your confirmation email or SMS
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Button */}
        {!trackingResult && (
          <div className="text-center mb-12">
            <Button 
              onClick={() => {
                setOrderNumber("ORD-123456");
                setTimeout(handleTrackOrder, 100);
              }}
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              Try Demo Order (ORD-123456)
            </Button>
          </div>
        )}

        {/* Tracking Results */}
        {trackingResult && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{trackingResult.orderNumber}</CardTitle>
                    <p className="text-gray-600">Estimated delivery: {trackingResult.estimatedDelivery}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {trackingResult.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Current location: {trackingResult.currentLocation}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-gray-600">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trackingResult.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>${trackingResult.items.reduce((sum: number, item: any) => sum + item.price, 0).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Order Issues</h3>
                  <p className="text-sm text-gray-600 mb-3">Problems with your order or missing items?</p>
                  <Button variant="outline" size="sm">Contact Support</Button>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Delivery Updates</h3>
                  <p className="text-sm text-gray-600 mb-3">Get real-time SMS updates on your delivery</p>
                  <Button variant="outline" size="sm">Enable SMS</Button>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Delivery Time</h3>
                  <p className="text-sm text-gray-600 mb-3">Questions about delivery timing?</p>
                  <Button variant="outline" size="sm">Call Us</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}