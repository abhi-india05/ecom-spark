
# Database Structure

This directory contains the database schema definitions and query functions for the application.

## Structure

- `schema/`: Contains TypeScript type definitions and Zod validation schemas
- `tables/`: Contains database table definitions
- `queries/`: Contains functions to interact with the database
- `migrations/`: Contains database migration scripts (when needed)
- `seeds/`: Contains seed data for development and testing

## Usage

Import schema types from the schema directory, table definitions from the tables directory, and query functions from the queries directory.

Example:
```typescript
import { ProductSchema } from '@/database/schema/product';
import { productTable } from '@/database/tables/product';
import { getProducts } from '@/database/queries/products';
```

