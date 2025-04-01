
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import CategoryPage from "./pages/CategoryPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/category/:category" element={<CategoryPage />} />

                {/* Customer Routes */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />

                {/* Seller Routes */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/orders" element={<SellerOrders />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryClientProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
