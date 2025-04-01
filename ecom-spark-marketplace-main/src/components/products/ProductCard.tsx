
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const isCustomer = user?.role === "customer";
  const isLowStock = product.stock <= 10 && product.stock > 0;
  const isOutOfStock = product.stock === 0;
  const isWishlisted = isInWishlist(product.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    
    if (!isCustomer) {
      toast.error("Only customers can add items to cart");
      return;
    }
    
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    
    addToCart(product, 1);
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to manage your wishlist");
      return;
    }
    
    if (!isCustomer) {
      toast.error("Only customers can use the wishlist");
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative pt-[100%] overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
          />
          
          {isCustomer && (
            <div className="absolute top-2 right-2 space-y-2">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full bg-white ${
                  isWishlisted ? "text-red-500" : "text-gray-500"
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          )}
          
          {isLowStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Only {product.stock} left
            </Badge>
          )}
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg py-1 px-3">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-medium text-lg line-clamp-2 mb-1">{product.name}</h3>
          <div className="text-lg font-bold">₹{product.price.toFixed(2)}</div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          {isCustomer && (
            <Button
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
