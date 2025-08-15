import { Timestamp } from 'firebase/firestore';

// Product types
export interface ProductImage {
  url: string;
  alt: string;
  aspectRatio: number;
  dominantColor: string;
  width: number;
  height: number;
  order: number;
}

export interface ProductVideo {
  url: string;
  posterUrl?: string;
  type?: 'mp4' | 'webm';
}

export interface ProductMedia {
  images: ProductImage[];
  video?: ProductVideo;
}

export interface ProductPrice {
  amount: number;
  currency: 'USD' | 'EUR' | 'BDT';
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ProductFeatureFlags {
  isFeatured?: boolean;
  isNew?: boolean;
}

export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock';

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  bulletPoints: string[];
  price: ProductPrice;
  stock: number;
  status: ProductStatus;
  categories: string[];
  tags: string[];
  media: ProductMedia;
  featureFlags?: ProductFeatureFlags;
  seo?: ProductSEO;
  searchKeywords: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Order types
export interface OrderItem {
  productId: string;
  titleSnapshot: string;
  slugSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
}

export interface OrderTotals {
  itemsTotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  currency: string;
}

export interface OrderPayment {
  method: 'COD' | 'ONLINE' | 'PAY_LATER';
  status: 'unpaid' | 'paid' | 'refunded';
}

export type OrderStatus = 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusTimelineEntry {
  status: OrderStatus;
  at: Timestamp;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingCode?: string;
  items: OrderItem[];
  customer: OrderCustomer;
  notes?: string;
  totals: OrderTotals;
  payment: OrderPayment;
  currentStatus: OrderStatus;
  statusTimeline: OrderStatusTimelineEntry[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastPublicLookupAt?: Timestamp;
}

export interface OrderCreate {
  items: OrderItem[];
  customer: OrderCustomer;
  notes?: string;
  totals: OrderTotals;
  payment: OrderPayment;
}

// Cart types
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common types
export interface PaginationOptions {
  limit?: number;
  lastDocId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDocId?: string;
}

// Admin types
export interface AdminSession {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
  };
  token?: string;
}

// UI State types
export interface UIState {
  cartDrawerOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Search and Filter types
export interface ProductFilters {
  status?: ProductStatus;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus | 'all';
  searchTerm?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Analytics types (for future use)
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}