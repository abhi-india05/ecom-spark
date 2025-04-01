import { z } from 'zod';

// SQL to Zod Type Mapping
const sqlToZodMapping: Record<string, any> = {
  'VARCHAR2': (length: number) => z.string().max(length),
  'NUMBER': (precision: number, scale?: number) => 
    scale ? z.number().min(0).max(10 ** precision - 1) : z.number().int(),
  'TIMESTAMP': () => z.string().datetime().default(new Date().toISOString()),
};

// Function to Convert SQL to Zod Schema
const createZodSchemaFromSQL = (tableName: string, sql: string) => {
  const lines = sql.split('\n').map(line => line.trim()).filter(line => line);
  
  let schema: Record<string, any> = {};

  lines.forEach(line => {
    const match = line.match(/^(\w+)\s+(\w+)(?:\((\d+)(?:,(\d+))?\))?/);
    if (match) {
      const [, column, type, precision, scale] = match;
      if (sqlToZodMapping[type]) {
        schema[column] = sqlToZodMapping[type](Number(precision), scale ? Number(scale) : undefined);
      }
    }

    // Handle NOT NULL Constraints
    if (line.includes('NOT NULL')) {
      schema[match?.[1] || ''] = schema[match?.[1] || ''].nonempty();
    }

    // Handle DEFAULT values (like CURRENT_TIMESTAMP)
    if (line.includes('DEFAULT CURRENT_TIMESTAMP')) {
      schema[match?.[1] || ''] = schema[match?.[1] || ''].default(new Date().toISOString());
    }

    // Handle NULLABLE Fields
    if (line.includes('DEFAULT NULL')) {
      schema[match?.[1] || ''] = schema[match?.[1] || ''].optional().nullable();
    }

    // Handle CHECK Constraints
    if (line.includes('CHECK (quantity >= 1)')) {
      schema['quantity'] = schema['quantity'].min(1);
    }
  });

  return z.object(schema);
};

// SQL Schema for Orders
const ordersSQL = `
  id VARCHAR2(50) PRIMARY KEY,
  customer_id VARCHAR2(50) NOT NULL,
  status VARCHAR2(50) NOT NULL,
  total NUMBER(10,2) NOT NULL,
  shipping_address VARCHAR2(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT NULL
`;

// SQL Schema for Order Items
const orderItemsSQL = `
  id VARCHAR2(50) PRIMARY KEY,
  order_id VARCHAR2(50) NOT NULL,
  product_id VARCHAR2(50) NOT NULL,
  product_name VARCHAR2(255) NOT NULL,
  price NUMBER(10,2) NOT NULL,
  quantity NUMBER(10) CHECK (quantity >= 1) NOT NULL,
  subtotal NUMBER(10,2) NOT NULL
`;

// Generate Zod Schemas
export const orderSchema = createZodSchemaFromSQL('orders', ordersSQL);
export const orderItemSchema = createZodSchemaFromSQL('order_items', orderItemsSQL);

// Combined Schema for Orders with Items
export const fullOrderSchema = orderSchema.extend({
  items: z.array(orderItemSchema),
});

// TypeScript Types
export type OrderSchema = z.infer<typeof orderSchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type FullOrderSchema = z.infer<typeof fullOrderSchema>;

// Debug Output (Remove in Production)
console.log('Orders Zod Schema:', orderSchema);
console.log('Order Items Zod Schema:', orderItemSchema);
console.log('Full Order Schema:', fullOrderSchema);
