
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get products by category
    setLoading(true);
    setTimeout(() => {
      const filteredProducts = mockProducts.filter(
        (product) => product.category.toLowerCase() === category?.toLowerCase()
      );
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [category]);

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <ProductGrid 
                products={products} 
                emptyMessage={`No products found in ${categoryName} category`} 
              />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
