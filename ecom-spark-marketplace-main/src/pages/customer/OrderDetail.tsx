
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Truck, Package, ShoppingBag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders, mockProducts } from "@/data/mockData";
import { Order } from "@/types";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user && id) {
      // Find the order with the given ID
      const foundOrder = mockOrders.find(order => order.id === id);
      
      if (foundOrder && foundOrder.customerId === user.id) {
        setOrder(foundOrder);
      }
      
      setLoading(false);
    }
  }, [user, id]);

  if (!user || user.role !== "customer") {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              You need to be logged in as a customer to access this page.
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

  if (loading) {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="text-center">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-gray-500 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button asChild>
              <Link to="/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get order items with full product details (normally this would come from the API)
  const orderItemsWithProducts = order.items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  });

  return (
    <MainLayout>
      <div className="ecom-container py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            asChild
          >
            <Link to="/orders">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id.split('-')[1]}</h1>
              <p className="text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <OrderStatusBadge status={order.status} large />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-6">Order Progress</h2>
              <OrderProgress status={order.status} />
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderItemsWithProducts.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start py-4 border-b last:border-0"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden border mr-4">
                      <img
                        src={item.product?.images[0] || `https://images.unsplash.com/photo-${index + 1}?w=100&h=100`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.productName}
                      </Link>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-gray-700">
                    {order.shippingAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Method</p>
                  <p className="font-medium">Standard Shipping</p>
                  <p className="text-gray-700">
                    Estimated delivery: 
                    {order.status === "delivered" ? (
                      " Delivered"
                    ) : (
                      ` ${new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - 
                      ${new Date(new Date(order.createdAt).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                    )}
                  </p>
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
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.total * 0.08).toFixed(2)}</span>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(order.total + order.total * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      Track Package
                    </Button>
                  </div>
                )}
                
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <div>
                    <Button variant="outline" className="w-full text-red-500 border-red-200">
                      Cancel Order
                    </Button>
                  </div>
                )}
                
                <div>
                  <Button variant="outline" className="w-full">
                    Need Help?
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Badge component for order status
const OrderStatusBadge = ({ status, large = false }: { status: string; large?: boolean }) => {
  let backgroundColor = "";
  let textColor = "";
  
  switch (status) {
    case "pending":
      backgroundColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "processing":
      backgroundColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "shipped":
      backgroundColor = "bg-purple-100";
      textColor = "text-purple-800";
      break;
    case "delivered":
      backgroundColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "cancelled":
      backgroundColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    default:
      backgroundColor = "bg-gray-100";
      textColor = "text-gray-800";
  }
  
  const sizeClasses = large 
    ? "text-sm px-3 py-1" 
    : "text-xs px-2.5 py-0.5";
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${backgroundColor} ${textColor} ${sizeClasses}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Badge component for payment status
const PaymentStatusBadge = ({ status }: { status: string }) => {
  let backgroundColor = "";
  let textColor = "";
  
  switch (status) {
    case "pending":
      backgroundColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "completed":
      backgroundColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "failed":
      backgroundColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    default:
      backgroundColor = "bg-gray-100";
      textColor = "text-gray-800";
  }
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${backgroundColor} ${textColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Order progress component
const OrderProgress = ({ status }: { status: string }) => {
  const steps = [
    { key: "pending", label: "Order Placed", icon: ShoppingBag },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Package },
  ];
  
  // If order is cancelled, show a different view
  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-md">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
        <span className="text-lg font-medium text-red-700">
          This order has been cancelled
        </span>
      </div>
    );
  }
  
  // Get the current step index
  const currentStepIndex = steps.findIndex(step => step.key === status);
  
  return (
    <div className="relative">
      <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{
            width: currentStepIndex >= 0 
              ? `${Math.min(100, (currentStepIndex / (steps.length - 1)) * 100)}%` 
              : "0%",
          }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isCompleted 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-400"}
                  ${isCurrent ? "ring-4 ring-primary/30" : ""}
                `}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={`
                  mt-2 text-sm font-medium
                  ${isCompleted ? "text-gray-900" : "text-gray-500"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetail;
