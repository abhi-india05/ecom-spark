
export interface User {
  id: string;
  name: string;
  email: string;
  role: "seller" | "customer";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "upi" | "credit_card" | "debit_card" | "cash_on_delivery";
  paymentStatus: "pending" | "completed" | "failed";
  shippingAddress: string;
  createdAt: string;
}
