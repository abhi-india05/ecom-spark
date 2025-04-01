
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user || user.role !== "customer") {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              You need to be logged in as a customer to view your wishlist.
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

  if (wishlist.length === 0) {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-500 mb-6">
              Save items you like to your wishlist and they'll appear here.
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
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <Button variant="outline" onClick={clearWishlist}>
            Clear Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <Link to={`/product/${item.productId}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${item.productId}`}>
                  <h3 className="font-medium text-lg mb-1">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                <p className="text-lg font-bold mb-3">${item.product.price.toFixed(2)}</p>

                {item.product.stock <= 10 && item.product.stock > 0 && (
                  <p className="flex items-center text-red-500 text-xs mb-3">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Only {item.product.stock} items left in stock</span>
                  </p>
                )}

                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => addToCart(item.product, 1)}
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {item.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromWishlist(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Wishlist;
