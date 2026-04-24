import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Settings, LogIn, UserPlus, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart, getTotalItems } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, dispatch } = useCart();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "AI Features", path: "/ai-features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const totalItems = getTotalItems(state.items);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin" || user?.role === "manager";

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
            {isAdmin && (
              <Link
                href="/admin"
                className={`font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                  isActive("/admin") ? "text-primary" : "text-gray-700"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Cart, Auth, and Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
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

            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">{user.firstName}</span>
                      <Badge variant={user.role === "admin" ? "destructive" : user.role === "manager" ? "default" : "secondary"} className="text-xs">
                        {user.role}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Button>
                  <Button size="sm" onClick={() => navigate("/register")}>
                    <UserPlus className="h-4 w-4 mr-1" /> Register
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
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
            {isAdmin && (
              <Link
                href="/admin"
                className={`block py-2 transition-colors hover:text-primary flex items-center gap-1 ${
                  isActive("/admin") ? "text-primary" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" /> Admin
              </Link>
            )}
            <div className="border-t pt-2 mt-2 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="block py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="block py-2 text-gray-700 hover:text-primary w-full text-left"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" /> Login
                    </span>
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-primary font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" /> Register
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
