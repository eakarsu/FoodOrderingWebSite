import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, getTotalPrice } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ShoppingCart() {
  const { state, dispatch } = useCart();
  const [, setLocation] = useLocation();

  const totalPrice = getTotalPrice(state.items);

  const handleProceedToCheckout = () => {
    if (state.items.length > 0) {
      setLocation("/checkout");
      dispatch({ type: "CLOSE_CART" });
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl cart-slide-in">
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary">Your Order</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm">Add some delicious items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary">{item.name}</h4>
                      <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {state.items.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
