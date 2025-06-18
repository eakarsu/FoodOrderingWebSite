import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Settings } from "lucide-react";
import { useCart, getTotalItems } from "../contexts/CartContext";
import { Button } from "./ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, dispatch } = useCart();
  const [location] = useLocation();

  const navigation = [
    { name: "Home", path: "/" },
    { name: "AI Features", path: "/ai-features" },
    { name: "Analytics", path: "/analytics" },
    { name: "Workflows", path: "/workflows" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const totalItems = getTotalItems(state.items);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Settings className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-secondary">
              ServiceHub AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch({ type: "TOGGLE_CART" })}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block py-2 transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
