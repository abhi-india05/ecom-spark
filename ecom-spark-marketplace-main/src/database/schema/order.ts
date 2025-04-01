
import { z } from 'zod';

// Order status
export const OrderStatus = z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export type OrderStatus = z.infer<typeof OrderStatus>;

// Order item schema
export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
  subtotal: z.number(),
});

// Order schema validation with Zod
export const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: OrderStatus,
  total: z.number(),
  items: z.array(orderItemSchema),
  shippingAddress: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// TypeScript types derived from the schemas
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
