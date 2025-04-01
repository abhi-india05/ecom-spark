
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on init
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      // Clear cart when logged out
      setCart([]);
    }
  }, [user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);
  
  const addToCart = (product: Product, quantity = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    
    setCart((prevCart) => {
      // Check if item is already in cart
      const existingItem = prevCart.find((item) => item.productId === product.id);
      
      if (existingItem) {
        // If already in cart, update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (newQuantity > product.stock) {
          toast.error(`Sorry, only ${product.stock} items available in stock`);
          return prevCart;
        }
        
        const updatedCart = prevCart.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQuantity } : item
        );
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedCart;
      } else {
        // If not in cart, add new item
        // Check stock availability
        if (quantity > product.stock) {
          toast.error(`Sorry, only ${product.stock} items available in stock`);
          return prevCart;
        }
        
        toast.success(`${product.name} added to cart`);
        return [...prevCart, { productId: product.id, quantity, product }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.productId === productId);
      if (item) {
        toast.success(`${item.product.name} removed from cart`);
      }
      return prevCart.filter((item) => item.productId !== productId);
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.productId === productId);
      
      if (!item) return prevCart;
      
      // Check stock availability
      if (quantity > item.product.stock) {
        toast.error(`Sorry, only ${item.product.stock} items available in stock`);
        return prevCart;
      }
      
      if (quantity <= 0) {
        toast.success(`${item.product.name} removed from cart`);
        return prevCart.filter((item) => item.productId !== productId);
      }
      
      return prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };
  
  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };
  
  // Calculate total price of items in cart
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  // Calculate total number of items in cart
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
