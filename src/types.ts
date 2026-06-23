/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductCategory = 'Clothes' | 'Shoes' | 'Slippers';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price_inr: number;
  original_price_inr?: number; // Optional for rendering strike-through sales prices
  stock_count: number;
  image_url: string;
  description?: string;
  badge?: string; // e.g., 'New Arrival', 'Best Seller', 'Sale', 'Premium Collection'
  sizes?: string[]; // e.g., ['S', 'M', 'L', 'XL', 'XXL', 'UK 8']
  colors?: string[]; // hex codes or descriptive colors
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pinCode: string;
  paymentMethod: 'upi' | 'card' | 'cod';
  promoApplied?: string;
}

export interface SalesHistory {
  id: string;
  timestamp: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Paid';
  customer: {
    name: string;
    phone: string;
    address: string;
  };
}
