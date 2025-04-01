
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import MainLayout from "@/components/layouts/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, ShoppingBag, ArrowRight, ChevronLeft } from "lucide-react";

type PaymentMethod = "credit_card" | "debit_card" | "upi" | "cash_on_delivery";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formStep, setFormStep] = useState<"shipping" | "payment">("shipping");
  
  // Shipping info state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });
  
  // Payment info state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  
  // Calculate order summary
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep("payment");
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    toast.success("Processing your payment...");
    
    setTimeout(() => {
      // In a real app, this would be an API call to process payment
      // and create an order in the database
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      toast.success("Your order has been placed successfully!");
      
      // Redirect to order confirmation
      navigate("/order-success");
    }, 2000);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formType: "shipping" | "payment"
  ) => {
    const { name, value } = e.target;
    
    if (formType === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setCardInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

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
              You need to be logged in as a customer to access checkout.
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
              You can't proceed to checkout with an empty cart.
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center text-sm font-medium">
            <span className={formStep === "shipping" ? "text-primary" : ""}>
              Shipping
            </span>
            <ArrowRight className="h-4 w-4 mx-2" />
            <span className={formStep === "payment" ? "text-primary" : ""}>
              Payment
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {formStep === "shipping" ? (
                // Shipping Form
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/cart")}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Return to Cart
                    </Button>
                    <Button type="submit">
                      Continue to Payment
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </form>
              ) : (
                // Payment Form
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="cursor-pointer flex-1">
                        Credit Card
                      </Label>
                      <div className="flex space-x-1">
                        <CreditCardIcon className="h-6 w-9 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="debit_card" id="debit_card" />
                      <Label htmlFor="debit_card" className="cursor-pointer flex-1">
                        Debit Card
                      </Label>
                      <div className="flex space-x-1">
                        <CreditCardIcon className="h-6 w-9 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="cursor-pointer flex-1">
                        UPI Payment
                      </Label>
                      <div className="flex space-x-1">
                        <UpiIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                      <Label htmlFor="cash_on_delivery" className="cursor-pointer flex-1">
                        Cash on Delivery
                      </Label>
                      <div className="flex space-x-1">
                        <CashIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.cardNumber}
                          onChange={(e) => handleInputChange(e, "payment")}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Cardholder Name</Label>
                        <Input
                          id="cardHolder"
                          name="cardHolder"
                          placeholder="John Doe"
                          value={cardInfo.cardHolder}
                          onChange={(e) => handleInputChange(e, "payment")}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiration Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardInfo.expiryDate}
                            onChange={(e) => handleInputChange(e, "payment")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={cardInfo.cvv}
                            onChange={(e) => handleInputChange(e, "payment")}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="savePaymentInfo"
                          checked={savePaymentInfo}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setSavePaymentInfo(checked);
                            }
                          }}
                        />
                        <Label htmlFor="savePaymentInfo" className="text-sm">
                          Save my payment information for future purchases
                        </Label>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "upi" && (
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "cash_on_delivery" && (
                    <div className="p-4 bg-gray-50 rounded-md mb-6">
                      <p className="text-sm text-gray-600">
                        Pay with cash upon delivery. Please note that the delivery
                        person may ask for identification for verification purposes.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormStep("shipping")}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Shipping
                    </Button>
                    <Button type="submit">
                      Place Order
                      <CreditCard className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex py-3 border-b">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
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
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Simple icon components
const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="1" y="1" width="22" height="14" rx="2" />
    <line x1="1" y1="6" x2="23" y2="6" />
  </svg>
);

const UpiIcon = ({ className }: { className?: string }) => (
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
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M7 7h10" />
    <path d="M7 11h10" />
    <path d="M11 15h6" />
  </svg>
);

const CashIcon = ({ className }: { className?: string }) => (
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
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export default Checkout;
