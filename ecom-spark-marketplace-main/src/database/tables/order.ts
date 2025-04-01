
// Database table definitions for orders and order items
export const orderTable = {
  name: 'orders',
  columns: {
    id: 'text primary key',
    customerId: 'text not null references users(id)',
    status: 'text not null',
    total: 'numeric not null',
    shippingAddress: 'text not null',
    createdAt: 'timestamp not null default now()',
    updatedAt: 'timestamp',
  },
  relations: {
    customer: {
      table: 'users',
      column: 'customerId',
      foreignColumn: 'id',
    },
    items: {
      table: 'order_items',
      column: 'id',
      foreignColumn: 'orderId',
    },
  },
};

export const orderItemTable = {
  name: 'order_items',
  columns: {
    id: 'text primary key',
    orderId: 'text not null references orders(id)',
    productId: 'text not null references products(id)',
    productName: 'text not null',
    price: 'numeric not null',
    quantity: 'integer not null',
    subtotal: 'numeric not null',
  },
  relations: {
    order: {
      table: 'orders',
      column: 'orderId',
      foreignColumn: 'id',
    },
    product: {
      table: 'products',
      column: 'productId',
      foreignColumn: 'id',
    },
  },
};
