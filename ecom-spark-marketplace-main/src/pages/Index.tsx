
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import MainLayout from "@/components/layouts/MainLayout";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { mockProducts } from "@/data/mockData";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  // Categories to display
  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      name: "Clothing",
      image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      name: "Footwear",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1613594539484-65c531f0b653?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  // Banner slides
  const banners = [
    {
      title: "Summer Collection",
      description: "Discover our latest summer styles and trends",
      buttonText: "Shop Now",
      link: "/category/clothing",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      title: "Electronics Sale",
      description: "Up to 30% off on premium electronics",
      buttonText: "View Offers",
      link: "/category/electronics",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      title: "Accessories Collection",
      description: "Complete your look with our accessories",
      buttonText: "Explore",
      link: "/category/accessories",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  useEffect(() => {
    // Simulate loading product data
    // In a real app, this would be an API call
    
    // Get random products for featured section
    const randomProducts = [...mockProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
    setFeaturedProducts(randomProducts);
    
    // Sort products by date for new arrivals
    const sortedByDate = [...mockProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 8);
    setNewArrivals(sortedByDate);
    
    // For demo, just use some of the products as "best sellers"
    const dummyBestSellers = mockProducts.filter((p) => 
      ["product-1", "product-2", "product-5", "product-7"].includes(p.id)
    );
    setBestSellers(dummyBestSellers);
  }, []);

  return (
    <MainLayout>
      {/* Hero Banner */}
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                      {banner.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white mb-6 max-w-2xl">
                      {banner.description}
                    </p>
                    <Link to={banner.link}>
                      <Button size="lg">{banner.buttonText}</Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="ecom-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg h-40 md:h-64"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="ecom-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="ecom-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link to="/products?sort=newest">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="ecom-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Best Sellers</h2>
            <Link to="/products?sort=popular">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="ecom-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of sellers on our platform and reach millions of
            customers worldwide.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Become a Seller
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
