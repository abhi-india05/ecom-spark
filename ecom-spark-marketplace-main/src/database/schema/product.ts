
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
    if (line.includes('CHECK (LENGTH(name) >= 3)')) {
      schema['name'] = schema['name'].min(3);
    }
    if (line.includes('CHECK (LENGTH(description) >= 10)')) {
      schema['description'] = schema['description'].min(10);
    }
    if (line.includes('CHECK (price >= 1)')) {
      schema['price'] = schema['price'].min(1);
    }
    if (line.includes('CHECK (stock >= 0)')) {
      schema['stock'] = schema['stock'].min(0);
    }
  });

  return z.object(schema);
};

// SQL Schema for Products
const productsSQL = `
  id VARCHAR2(50) PRIMARY KEY,
  name VARCHAR2(255) NOT NULL CHECK (LENGTH(name) >= 3),
  description VARCHAR2(1000) NOT NULL CHECK (LENGTH(description) >= 10),
  price NUMBER(10,2) NOT NULL CHECK (price >= 1),
  stock NUMBER(10) NOT NULL CHECK (stock >= 0),
  category VARCHAR2(100) NOT NULL,
  seller_id VARCHAR2(50) NOT NULL,
  seller_name VARCHAR2(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT NULL
`;

// SQL Schema for Product Images
const productImagesSQL = `
  id VARCHAR2(50) PRIMARY KEY,
  product_id VARCHAR2(50) NOT NULL,
  image_url VARCHAR2(1000) NOT NULL
`;

// Generate Zod Schemas
export const productSchema = createZodSchemaFromSQL('products', productsSQL).extend({
  images: z.array(z.string()).min(1),
});

export const productImageSchema = createZodSchemaFromSQL('product_images', productImagesSQL);

// TypeScript Types
export type ProductSchema = z.infer<typeof productSchema>;
export type ProductImageSchema = z.infer<typeof productImageSchema>;

// Debug Output (Remove in Production)
console.log('Product Zod Schema:', productSchema);
console.log('Product Image Zod Schema:', productImageSchema);

