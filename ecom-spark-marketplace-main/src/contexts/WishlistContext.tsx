
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WishlistItem, Product } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  
  // Load wishlist from localStorage on init
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist-${user.id}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } else {
      // Clear wishlist when logged out
      setWishlist([]);
    }
  }, [user]);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist-${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);
  
  const addToWishlist = (product: Product) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }
    
    setWishlist((prevWishlist) => {
      // Check if product is already in wishlist
      if (prevWishlist.some((item) => item.productId === product.id)) {
        toast.info(`${product.name} is already in your wishlist`);
        return prevWishlist;
      }
      
      toast.success(`${product.name} added to wishlist`);
      return [...prevWishlist, { productId: product.id, product }];
    });
  };
  
  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      const item = prevWishlist.find((item) => item.productId === productId);
      if (item) {
        toast.success(`${item.product.name} removed from wishlist`);
      }
      return prevWishlist.filter((item) => item.productId !== productId);
    });
  };
  
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };
  
  const clearWishlist = () => {
    setWishlist([]);
    toast.success("Wishlist cleared");
  };
  
  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
