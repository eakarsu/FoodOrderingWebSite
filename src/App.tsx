import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ShoppingCart from "./components/ShoppingCart";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import BookingPage from "./pages/BookingPage";
import SectorClassificationPage from "./pages/SectorClassificationPage";

import CategoriesPage from "./pages/CategoriesPage";
import SectorPage from "./pages/SectorPage";
import SectorsPage from "./pages/SectorsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import OffersPage from "./pages/OffersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ReturnsRefundsPage from "./pages/ReturnsRefundsPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/booking" component={BookingPage} />
      <Route path="/sector-classification" component={SectorClassificationPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/sectors" component={SectorsPage} />
      <Route path="/sectors/:sectorId">
        {(params) => <SectorPage sectorId={params.sectorId} />}
      </Route>
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
      <TooltipProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
            <ShoppingCart />
            <Toaster />
          </div>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

