import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { CartProvider } from "@/lib/cart-context";
import { OrderProvider } from "@/lib/order-context";
import ShopownerGuard from "@/components/ShopownerGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Marketplace from "./pages/Marketplace";
import ShopPage from "./pages/ShopPage";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Help from "./pages/Help";
import RegisterShop from "./pages/RegisterShop";
import ShopLogin from "./pages/ShopLogin";
import ChotuChatbot from "./components/ChotuChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<ShopownerGuard><Index /></ShopownerGuard>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/marketplace" element={<ShopownerGuard><Marketplace /></ShopownerGuard>} />
                  <Route path="/shop/:id" element={<ShopownerGuard><ShopPage /></ShopownerGuard>} />
                  <Route path="/cart" element={<ShopownerGuard><Cart /></ShopownerGuard>} />
                  <Route path="/orders" element={<ShopownerGuard><Orders /></ShopownerGuard>} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/help" element={<ShopownerGuard><Help /></ShopownerGuard>} />
                  <Route path="/register-shop" element={<RegisterShop />} />
                  <Route path="/shop-login" element={<ShopLogin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ChotuChatbot />
              </BrowserRouter>
            </TooltipProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
