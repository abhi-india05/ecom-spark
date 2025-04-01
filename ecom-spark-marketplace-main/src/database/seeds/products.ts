
import { ProductSchema } from '../schema/product';

/**
 * Sample product data for development and testing
 */
export const sampleProducts: Omit<ProductSchema, 'id' | 'createdAt'>[] = [
  {
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features and long battery life.',
    price: 49999,
    stock: 50,
    images: ['/images/smartphone-x.jpg', '/images/smartphone-x-2.jpg'],
    category: 'Electronics',
    sellerId: 'seller-1',
    sellerName: 'TechStore',
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear.',
    price: 999,
    stock: 150,
    images: ['/images/cotton-tshirt.jpg'],
    category: 'Clothing',
    sellerId: 'seller-2',
    sellerName: 'FashionHub',
  },
  // Add more sample products as needed
];

/**
 * Function to seed the database with sample products
 */
export async function seedProducts(): Promise<void> {
  // In a real implementation, this would:
  // 1. Check if products already exist
  // 2. Insert the sample products into the database
  
  // Placeholder for future implementation
  console.log('Seeding database with sample products');
}
