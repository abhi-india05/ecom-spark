
// Database table definition for products
export const productTable = {
  name: 'products',
  columns: {
    id: 'text primary key',
    name: 'text not null',
    description: 'text not null',
    price: 'numeric not null',
    stock: 'integer not null',
    images: 'text[] not null', // Array of image URLs
    category: 'text not null',
    sellerId: 'text not null references users(id)',
    sellerName: 'text not null',
    createdAt: 'timestamp not null default now()',
    updatedAt: 'timestamp',
  },
  relations: {
    seller: {
      table: 'users',
      column: 'sellerId',
      foreignColumn: 'id',
    },
  },
};
