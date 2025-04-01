
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import { Separator } from "@/components/ui/separator";

const OrderSuccess = () => {
  // Generate a mock order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <MainLayout>
      <div className="ecom-container py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-lg text-gray-700">
              Your order has been placed successfully.
            </p>
          </div>
          
          <div className="rounded-md bg-gray-50 p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-bold">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-bold">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="text-green-600 font-medium">Paid</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Order Summary</h2>
            <div className="flex flex-col space-y-3">
              <p className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>$329.97</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span>Free</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>$26.40</span>
              </p>
              <Separator />
              <p className="flex justify-between font-bold">
                <span>Total:</span>
                <span>$356.37</span>
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Delivery Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="font-medium">John Doe</p>
                <p className="text-gray-700">
                  123 Main Street
                  <br />
                  Apt 4B
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - 
                  {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  You will receive shipping confirmation and tracking information
                  by email once your order ships.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/orders">
                  <Package className="h-4 w-4 mr-2" />
                  View Order Details
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Have a question about your order?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccess;
