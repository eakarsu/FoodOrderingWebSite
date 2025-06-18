import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CreditCard, Wallet, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart, getTotalPrice } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/queryClient";
import type { InsertOrder } from "@shared/schema";

export default function CheckoutPage() {
  const { toast } = useToast();
  const { state, dispatch } = useCart();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    instructions: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const subtotal = getTotalPrice(state.items);
  const deliveryFee = 3.99;
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + deliveryFee + tax;

  const orderMutation = useMutation({
    mutationFn: (orderData: InsertOrder) => apiRequest("POST", "/api/orders", orderData),
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      dispatch({ type: "CLEAR_CART" });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    const orderData: InsertOrder = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      items: state.items,
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      deliveryFee: deliveryFee.toString(),
      total: total.toString(),
      paymentMethod: formData.paymentMethod,
      instructions: formData.instructions || null,
    };

    orderMutation.mutate(orderData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (state.items.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart to continue with checkout.</p>
          <Button onClick={() => setLocation("/menu")} className="bg-primary hover:bg-primary/90 text-white">
            Browse Menu
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">Checkout</h1>
          <p className="text-gray-600">Complete your order and get ready for an amazing meal!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-secondary mb-6">Delivery Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-secondary">First Name</Label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary">Last Name</Label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-secondary">Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-secondary">Phone Number</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-secondary">Delivery Address</Label>
                    <Input
                      type="text"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-secondary">City</Label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary">State</Label>
                      <Select onValueChange={(value) => handleChange("state", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary">ZIP Code</Label>
                      <Input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => handleChange("zip", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-secondary">
                      Delivery Instructions (Optional)
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder="Any special delivery instructions..."
                      value={formData.instructions}
                      onChange={(e) => handleChange("instructions", e.target.value)}
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-bold text-secondary mb-4">Payment Method</h3>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleChange("paymentMethod", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center space-x-2">
                          <Wallet className="h-4 w-4 text-blue-600" />
                          <span>PayPal</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>Cash on Delivery</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Card Details */}
                    {formData.paymentMethod === "card" && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label className="text-sm font-semibold text-secondary">Card Number</Label>
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleChange("cardNumber", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-semibold text-secondary">Expiry Date</Label>
                            <Input
                              type="text"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => handleChange("expiryDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-secondary">CVV</Label>
                            <Input
                              type="text"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleChange("cvv", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-secondary mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee:</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-secondary">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="text-primary mr-2">🕒</span>
                    Estimated delivery: 30-45 minutes
                  </div>
                  <Button
                    type="submit"
                    form="checkoutForm"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={orderMutation.isPending}
                    onClick={handleSubmit}
                  >
                    {orderMutation.isPending ? "Processing..." : "Place Order"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
