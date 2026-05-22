import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
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

// Auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import KitchenCapacityPage from "./pages/KitchenCapacityPage";

// Lazy load AI feature pages
import { lazy, Suspense } from "react";
import CodexCustomVizFeature from "./pages/CodexCustomVizFeature";
import CodexOperationsFeature from "./pages/CodexOperationsFeature";

const AIFeaturesPage = lazy(() => import("./pages/AIFeaturesPage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const WorkflowManager = lazy(() => import("./pages/WorkflowManager"));

function Router() {
  return (
    <Switch>
      <Route path="/codex/custom-viz" component={CodexCustomVizFeature} />
      <Route path="/codex/operations" component={CodexOperationsFeature} />
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

      {/* Auth Routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password/:token" component={ResetPasswordPage} />
      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>

      {/* Admin Route */}
      <Route path="/admin">
        <ProtectedRoute roles={["admin", "manager"]}>
          <AdminDashboardPage />
        </ProtectedRoute>
      </Route>

      {/* AI Features Routes */}
      <Route path="/ai-features">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading AI Features...</div>}>
          <AIFeaturesPage />
        </Suspense>
      </Route>
      <Route path="/analytics">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Analytics...</div>}>
          <AnalyticsDashboard />
        </Suspense>
      </Route>
      <Route path="/kitchen-capacity" component={KitchenCapacityPage} />
      <Route path="/workflows">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Workflows...</div>}>
          <WorkflowManager />
        </Suspense>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
                <ShoppingCart />
                <Toaster />
              </div>
            </ErrorBoundary>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
