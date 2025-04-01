
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, CreditCard, AlertTriangle, ArrowRight, ChevronLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Promo code invalid",
      description: "The promo code you entered is not valid or has expired.",
      variant: "destructive",
    });
    setPromoCode("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    navigate("/checkout");
  };

  // Calculate order summary
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (!user || user.role !== "customer") {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              You need to be logged in as a customer to view your cart.
            </p>
            <div className="space-x-4">
              <Button asChild variant="outline">
                <Link to="/">Go Home</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="ecom-container py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flow-root">
                  <ul className="divide-y">
                    {cart.map((item) => (
                      <li key={item.productId} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-medium text-gray-900">
                                <Link to={`/product/${item.productId}`}>
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-lg font-medium">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.product.category}
                            </p>
                          </div>

                          <div className="mt-auto flex justify-between items-center">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.product.stock <= item.quantity
                                }
                              >
                                +
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>

                          {item.product.stock <= 10 && (
                            <div className="mt-2 flex items-center text-red-500 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              <span>
                                Only {item.product.stock} items left in stock
                              </span>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between">
                  <Link to="/products">
                    <Button variant="outline" className="flex items-center">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      "Free"
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <div className="flex items-center py-2 px-3 bg-green-50 text-green-700 rounded-md text-sm">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>Free shipping on orders over $50!</span>
                  </div>
                )}

                <Separator className="my-3" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handlePromoCodeSubmit} className="mt-6">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button type="submit" variant="outline">
                    Apply
                  </Button>
                </div>
              </form>

              <div className="mt-6 space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>

                <div className="text-center text-sm text-gray-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Secure checkout</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>
                  By proceeding to checkout, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// A simple shield icon component
const Shield = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default Cart;
