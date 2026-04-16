/**
 * Database Schema Interfaces
 * Based on the defined Entity Relationship Diagram.
 */

export interface User {
  id: string; // PK
  name: string;
  email?: string;
  password?: string;
  phone: string;
  address?: string;
  created_at: Date;
}

export interface Category {
  id: string; // PK
  name: string;
  created_at: Date;
}

export interface Product {
  id: string; // PK
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: string; // FK to Categories.id
  created_at: Date;
}

export interface Order {
  id: string; // PK
  user_id: string; // FK to Users.id
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed';
  created_at: Date;
}

export interface OrderItem {
  id: string; // PK
  order_id: string; // FK to Orders.id
  product_id: string; // FK to Products.id
  quantity: number;
  price: number; // Snapshot of the price at the time of order
}

export interface Cart {
  id: string; // PK
  user_id: string; // FK to Users.id
  created_at: Date;
}

export interface CartItem {
  id: string; // PK
  cart_id: string; // FK to Cart.id
  product_id: string; // FK to Products.id
  quantity: number;
}
