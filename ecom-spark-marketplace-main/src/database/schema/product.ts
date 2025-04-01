
import { z } from 'zod';

// Product schema validation with Zod
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
  stock: z.number().min(0).int(),
  images: z.array(z.string()).min(1),
  category: z.string(),
  sellerId: z.string(),
  sellerName: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// TypeScript type derived from the schema
export type ProductSchema = z.infer<typeof productSchema>;
