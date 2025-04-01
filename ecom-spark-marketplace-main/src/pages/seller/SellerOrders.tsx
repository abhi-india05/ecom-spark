
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Search, Filter, Eye, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders, mockProducts } from "@/data/mockData";
import { Order } from "@/types";

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  useEffect(() => {
    if (user) {
      // Filter orders that contain products from this seller
      const sellerProductIds = mockProducts
        .filter(product => product.sellerId === user.id)
        .map(product => product.id);
      
      const relevantOrders = mockOrders.filter(order => 
        order.items.some(item => sellerProductIds.includes(item.productId))
      );
      
      setOrders(relevantOrders);
      setFilteredOrders(relevantOrders);
    }
  }, [user]);
  
  useEffect(() => {
    if (orders.length > 0) {
      let filtered = [...orders];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          order => 
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(order => order.status === statusFilter);
      }
      
      // Apply date filter
      const now = new Date();
      if (dateFilter === "today") {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        });
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          order => new Date(order.createdAt) >= weekAgo
        );
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          order => new Date(order.createdAt) >= monthAgo
        );
      }
      
      setFilteredOrders(filtered);
    }
  }, [orders, searchQuery, statusFilter, dateFilter]);

  if (!user || user.role !== "seller") {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              You need to be logged in as a seller to access this page.
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
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-gray-500">Manage customer orders for your products</p>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID or customer..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.split('-')[1]}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <OrderDetailsDialog order={order} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Package className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters or search query"
                  : "You don't have any orders yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Order status badge
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

// Payment status badge
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
    <Badge variant="outline" className={`${backgroundColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Order details dialog
const OrderDetailsDialog = ({ order }: { order: Order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order #{order.id.split('-')[1]}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p className="font-medium">{order.shippingAddress}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
            <p className="font-medium capitalize">
              {order.paymentMethod.replace(/_/g, ' ')}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Order Items</p>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Select defaultValue={order.status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerOrders;
