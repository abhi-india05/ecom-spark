import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  BarChart,
  PieChart,
  ChevronRight,
  AlertTriangle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart as RechartBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from "recharts";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts, mockOrders } from "@/data/mockData";

// Generate some mock data for charts
const generateSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    name: month,
    sales: Math.floor(Math.random() * 5000) + 1000,
  }));
};

const generateCategoryData = () => {
  const categories = ['Electronics', 'Clothing', 'Footwear', 'Accessories'];
  const colors = ['#4F46E5', '#10B981', '#F97316', '#8B5CF6'];
  
  return categories.map((category, index) => ({
    name: category,
    value: Math.floor(Math.random() * 30) + 10,
    color: colors[index],
  }));
};

const SellerDashboard = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState(generateSalesData());
  const [categoryData, setCategoryData] = useState(generateCategoryData());
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  
  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    
    // Filter products belonging to the current seller with low stock
    if (user) {
      const lowStock = mockProducts
        .filter(product => product.sellerId === user.id && product.stock <= 10)
        .slice(0, 5);
      setLowStockProducts(lowStock);
      
      // Get recent orders for products from this seller
      const sellerProductIds = mockProducts
        .filter(product => product.sellerId === user.id)
        .map(product => product.id);
      
      const filteredOrders = mockOrders
        .filter(order => 
          order.items.some(item => sellerProductIds.includes(item.productId))
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setRecentOrders(filteredOrders);
    }
  }, [user]);

  if (!user || user.role !== "seller") {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              You need to be logged in as a seller to access this dashboard.
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
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Total Products
                  </div>
                  <div className="text-2xl font-bold">
                    {mockProducts.filter(product => product.sellerId === user.id).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Total Orders
                  </div>
                  <div className="text-2xl font-bold">
                    {recentOrders.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Customers
                  </div>
                  <div className="text-2xl font-bold">
                    {/* Get unique customer IDs from orders for this seller's products */}
                    {new Set(recentOrders.map(order => order.customerId)).size}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Revenue
                  </div>
                  <div className="text-2xl font-bold">
                    ₹12,450
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart data={salesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales ($)" fill="#4F46E5" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Category Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
                    <Legend />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Low Stock Products</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/seller/products">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden border">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center text-red-500 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>Only {product.stock} left</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/seller/products/${product.id}/edit`}>
                          Restock
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No products with low stock</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/seller/orders">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 border rounded-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Order #{order.id.split('-')[1]}</p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="font-medium">₹{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No recent orders</p>
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
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${backgroundColor} ${textColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default SellerDashboard;
