
// Database table definition for users
export const userTable = {
  name: 'users',
  columns: {
    id: 'text primary key',
    email: 'text not null unique',
    name: 'text not null',
    role: 'text not null',
    password: 'text not null', // Password hash, not included in the schema
    createdAt: 'timestamp not null default now()',
    updatedAt: 'timestamp',
    avatar: 'text',
  },
};
