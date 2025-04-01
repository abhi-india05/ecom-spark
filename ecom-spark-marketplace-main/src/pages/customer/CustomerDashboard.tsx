
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Heart, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { mockOrders } from "@/data/mockData";
import { Order } from "@/types";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    if (user) {
      // Filter orders for the current customer
      const userOrders = mockOrders
        .filter(order => order.customerId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(userOrders);
    }
  }, [user]);

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

  return (
    <MainLayout>
      <div className="ecom-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-gray-500">Welcome back, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Orders
                  </div>
                  <div className="text-2xl font-bold">
                    {orders.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Cart Items
                  </div>
                  <div className="text-2xl font-bold">
                    {cart.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Wishlist
                  </div>
                  <div className="text-2xl font-bold">
                    {wishlist.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/orders">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-wrap md:flex-nowrap justify-between items-center p-4 border rounded-md"
                      >
                        <div className="w-full md:w-auto mb-3 md:mb-0">
                          <p className="font-medium">Order #{order.id.split('-')[1]}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="w-full md:w-auto mb-3 md:mb-0 text-center">
                          <p className="text-sm text-gray-500">Status</p>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        
                        <div className="w-full md:w-auto mb-3 md:mb-0 text-center">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                        </div>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>You haven't placed any orders yet</p>
                    <Button className="mt-4" asChild>
                      <Link to="/products">Start Shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" asChild>
                      <Link to="/profile/edit">
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Addresses</CardTitle>
                  <Button size="sm" asChild>
                    <Link to="/addresses/new">
                      Add Address
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">Home</p>
                      <Badge variant="outline">Default</Badge>
                    </div>
                    <p className="text-gray-700">
                      John Doe<br />
                      123 Main Street<br />
                      Apt 4B<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200">
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">Work</p>
                    </div>
                    <p className="text-gray-700">
                      John Doe<br />
                      456 Business Ave<br />
                      Suite 200<br />
                      New York, NY 10022<br />
                      United States
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200">
                        Delete
                      </Button>
                      <Button variant="outline" size="sm">
                        Set as Default
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Wishlist Items</CardTitle>
            </CardHeader>
            <CardContent>
              {wishlist.length > 0 ? (
                <div className="space-y-4">
                  {wishlist.slice(0, 3).map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden border">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/product/${item.productId}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  
                  {wishlist.length > 3 && (
                    <div className="pt-2 text-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/wishlist">
                          View All ({wishlist.length}) <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Your wishlist is empty</p>
                  <Button className="mt-4" asChild>
                    <Link to="/products">Explore Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.slice(0, 3).map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden border">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium text-lg">
                        ${cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <Button asChild>
                      <Link to="/cart">
                        View Cart
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Your cart is empty</p>
                  <Button className="mt-4" asChild>
                    <Link to="/products">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper component for order status badge
const OrderStatusBadge = ({ status }: { status: string }) => {
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
  
  return (
    <Badge variant="outline" className={`${backgroundColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Badge component
const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: "default" | "outline"; 
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = 
    variant === "outline" 
      ? "border border-gray-200" 
      : "bg-primary text-white";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export default CustomerDashboard;
