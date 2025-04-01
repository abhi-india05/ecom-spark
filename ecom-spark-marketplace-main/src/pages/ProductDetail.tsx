
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Truck, ShieldCheck, RefreshCw, Heart, Minus, Plus, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layouts/MainLayout";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { mockProducts } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const isCustomer = user?.role === "customer";
  const isLowStock = product?.stock && product.stock <= 10 && product.stock > 0;
  const isOutOfStock = product?.stock === 0;
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    // Simulate API call to fetch product
    setLoading(true);
    
    // Find product in mock data
    const foundProduct = mockProducts.find((p) => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.images[0]);
      
      // Get related products from same category
      const related = mockProducts
        .filter(
          (p) => p.category === foundProduct.category && p.id !== foundProduct.id
        )
        .slice(0, 4);
      setRelatedProducts(related);
    }
    
    setLoading(false);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (product) {
      const newQuantity = Math.max(1, Math.min(value, product.stock));
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
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
    
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please log in to manage your wishlist");
      return;
    }
    
    if (!isCustomer) {
      toast.error("Only customers can use the wishlist");
      return;
    }
    
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-xl text-gray-500">Loading product...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-gray-500 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="ecom-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square overflow-hidden rounded-md border ${
                    selectedImage === image
                      ? "ring-2 ring-primary"
                      : "hover:ring-1 hover:ring-primary"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className="mr-2">
                  {product.category}
                </Badge>
                <span className="text-sm text-gray-500">
                  Sold by {product.sellerName}
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold">₹{product.price.toFixed(2)}</div>

            {isLowStock && (
              <div className="flex items-center text-red-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Hurry up! Only {product.stock} items left in stock
                </span>
              </div>
            )}

            {isOutOfStock ? (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-medium text-red-800">
                    This product is currently out of stock
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {isCustomer && (
                  <>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">Quantity:</span>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={product.stock <= quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className={isWishlisted ? "text-red-500" : ""}
                        onClick={handleWishlistToggle}
                      >
                        <Heart
                          className={`mr-2 h-5 w-5 ${
                            isWishlisted ? "fill-current" : ""
                          }`}
                        />
                        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-start">
                <Truck className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <span className="font-medium">Free Delivery</span>
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over ₹1000
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <span className="font-medium">Secure Payment</span>
                  <p className="text-sm text-gray-500">
                    Safe & secure checkout
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <RefreshCw className="h-5 w-5 mr-2 text-gray-600 mt-0.5" />
                <div>
                  <span className="font-medium">Easy Returns</span>
                  <p className="text-sm text-gray-500">
                    30-day easy return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 p-4 border rounded-md">
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Category</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Brand</span>
                    <span>Premium Brand</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Material</span>
                    <span>High Quality</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Warranty</span>
                    <span>1 Year</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">In Stock</span>
                    <span>{product.stock} Items</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Shipping</span>
                    <span>Nationwide</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
