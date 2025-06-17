import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import BuildYourOwnPage from "@/pages/BuildYourOwnPage";
import CategoriesPage from "@/pages/CategoriesPageImproved";
import SectorPage from "@/pages/SectorPage";
import SectorsPage from "@/pages/SectorsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OffersPage from "@/pages/OffersPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ReturnsRefundsPage from "@/pages/ReturnsRefundsPage";
import FAQPage from "@/pages/FAQPage";
import SupportPage from "@/pages/SupportPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/services" component={CategoriesPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/sector" component={SectorPage} />
      <Route path="/sectors" component={SectorsPage} />
      <Route path="/build-your-own" component={BuildYourOwnPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/offers" component={OffersPage} />
      <Route path="/order-tracking" component={OrderTrackingPage} />
      <Route path="/returns-refunds" component={ReturnsRefundsPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
            <ShoppingCart />
            <Toaster />
          </div>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
