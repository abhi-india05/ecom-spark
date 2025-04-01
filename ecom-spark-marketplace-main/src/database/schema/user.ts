
import { z } from 'zod';

// User roles

// User roles
export const UserRole = z.enum(['customer', 'seller', 'admin']);
export type UserRole = z.infer<typeof UserRole>;

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
    if (line.includes('CHECK (LENGTH(name) >= 2)')) {
      schema['name'] = schema['name'].min(2);
    }
  });

  return z.object(schema);
};

// SQL Schema for Users
const usersSQL = `
  id VARCHAR2(50) PRIMARY KEY,
  email VARCHAR2(255) UNIQUE NOT NULL,
  name VARCHAR2(255) NOT NULL CHECK (LENGTH(name) >= 2),
  role VARCHAR2(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT NULL,
  avatar VARCHAR2(1000) DEFAULT NULL
`;

// Generate Zod Schema for Users
export const userSchema = createZodSchemaFromSQL('users', usersSQL);

// TypeScript Type derived from the Zod Schema
export type UserSchema = z.infer<typeof userSchema>;

// Debug Output (Remove in Production)
console.log('User Zod Schema:', userSchema);
