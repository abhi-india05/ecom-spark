
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductGrid from "@/components/products/ProductGrid";
import { mockProducts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const SellerProducts = () => {
  const [products, setProducts] = useState(mockProducts.slice(0, 3));
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddProduct = () => {
    // Navigate to a new product form page
    // Since we don't have an actual form page yet, we'll show a toast
    toast({
      title: "Adding new product",
      description: "This would navigate to a product form in a real app",
    });
    
    // For demo purposes, add a mock product to the list
    const newProduct = {
      id: `product-${Date.now()}`,
      name: "New Product",
      description: "This is a newly added product",
      price: 999,
      stock: 25,
      images: ["/placeholder.svg"],
      category: "Other",
      sellerId: "seller-1",
      sellerName: "Demo Seller",
      createdAt: new Date().toISOString()
    };
    
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't added any products yet.</p>
          <Button className="mt-4" onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Product
          </Button>
        </div>
      ) : (
        <div>
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
