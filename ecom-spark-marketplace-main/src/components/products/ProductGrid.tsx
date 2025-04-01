
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

const ProductGrid = ({ products, emptyMessage = "No products found" }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
