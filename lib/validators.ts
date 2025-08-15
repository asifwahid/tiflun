import { z } from 'zod';

// Product validation schemas
export const ProductImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().min(1, 'Alt text is required'),
  aspectRatio: z.number().positive('Aspect ratio must be positive'),
  dominantColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  width: z.number().positive('Width must be positive'),
  height: z.number().positive('Height must be positive'),
  order: z.number().int().min(0, 'Order must be non-negative'),
});

export const ProductVideoSchema = z.object({
  url: z.string().url('Invalid video URL'),
  posterUrl: z.string().url('Invalid poster URL').optional(),
  type: z.enum(['mp4', 'webm']).optional(),
});

export const ProductMediaSchema = z.object({
  images: z.array(ProductImageSchema).min(1, 'At least one image is required'),
  video: ProductVideoSchema.optional(),
});

export const ProductPriceSchema = z.object({
  amount: z.number().positive('Price must be positive'),
  currency: z.enum(['USD', 'EUR', 'BDT']),
});

export const ProductSEOSchema = z.object({
  metaTitle: z.string().max(60, 'Meta title should be under 60 characters'),
  metaDescription: z.string().max(160, 'Meta description should be under 160 characters'),
  keywords: z.array(z.string()),
});

export const ProductCreateSchema = z.object({
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  bulletPoints: z.array(z.string().min(1, 'Bullet point cannot be empty')).max(10, 'Maximum 10 bullet points'),
  price: ProductPriceSchema,
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  status: z.enum(['active', 'draft', 'archived', 'out_of_stock']),
  categories: z.array(z.string().min(1, 'Category cannot be empty')),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')),
  media: ProductMediaSchema,
  featureFlags: z.object({
    isFeatured: z.boolean().optional(),
    isNew: z.boolean().optional(),
  }).optional(),
  seo: ProductSEOSchema.optional(),
  searchKeywords: z.array(z.string()),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

// Order validation schemas
export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  titleSnapshot: z.string().min(1, 'Title snapshot is required'),
  slugSnapshot: z.string().min(1, 'Slug snapshot is required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  quantity: z.number().int().positive('Quantity must be positive'),
  subtotal: z.number().positive('Subtotal must be positive'),
});

export const OrderAddressSchema = z.object({
  line1: z.string().min(5, 'Address line 1 must be at least 5 characters'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2, 'Country must be at least 2 characters'),
});

export const OrderCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format')
    .transform(phone => phone.replace(/[\s\-\(\)]/g, '')), // Normalize phone number
  email: z.string().email('Invalid email format').optional(),
  address: OrderAddressSchema,
});

export const OrderTotalsSchema = z.object({
  itemsTotal: z.number().min(0, 'Items total must be non-negative'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  shipping: z.number().min(0, 'Shipping must be non-negative'),
  discount: z.number().min(0, 'Discount must be non-negative'),
  grandTotal: z.number().positive('Grand total must be positive'),
  currency: z.string().min(1, 'Currency is required'),
});

export const OrderPaymentSchema = z.object({
  method: z.enum(['COD', 'ONLINE', 'PAY_LATER']),
  status: z.enum(['unpaid', 'paid', 'refunded']),
});

export const OrderCreateSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  customer: OrderCustomerSchema,
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
  totals: OrderTotalsSchema,
  payment: OrderPaymentSchema,
}).refine((data) => {
  // Validate that grand total matches calculated total
  const calculatedTotal = data.totals.itemsTotal + data.totals.tax + data.totals.shipping - data.totals.discount;
  return Math.abs(calculatedTotal - data.totals.grandTotal) < 0.01;
}, {
  message: 'Grand total does not match calculated total',
  path: ['totals', 'grandTotal'],
});

// Order tracking schema
export const OrderTrackingSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format')
    .transform(phone => phone.replace(/[\s\-\(\)]/g, '')),
});

// Order status update schema
export const OrderStatusUpdateSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  newStatus: z.enum(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled']),
  note: z.string().max(200, 'Note must be under 200 characters').optional(),
});

// Cart validation
export const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be positive'),
  image: z.string().url('Invalid image URL').optional(),
  slug: z.string().min(1, 'Slug is required'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
});

export const CartValidationSchema = z.object({
  items: z.array(CartItemSchema),
});

// Admin login schema
export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Common validation helpers
export const validateSlugUniqueness = async (slug: string, excludeId?: string) => {
  // This would typically check against the database
  // Implementation depends on your data layer
  return true; // Placeholder
};

export const validateImageUrl = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
};

// Phone number normalization utility
export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

// Order number validation
export const OrderNumberSchema = z.string()
  .regex(/^TIF-\d{4}-\d{6}$/, 'Invalid order number format');

// Generic pagination schema
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  lastDocId: z.string().optional(),
});

// Search and filter schemas
export const ProductFiltersSchema = z.object({
  status: z.enum(['active', 'draft', 'archived', 'out_of_stock']).optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  search: z.string().min(1).optional(),
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: 'Minimum price cannot be greater than maximum price',
  path: ['maxPrice'],
});

export const OrderFiltersSchema = z.object({
  status: z.enum(['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'all']).optional(),
  searchTerm: z.string().min(1).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Error handling types
export type ValidationErrorResponse = {
  success: false;
  error: string;
  details?: z.ZodError;
};

export type SuccessResponse<T = any> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiResponse<T = any> = ValidationErrorResponse | SuccessResponse<T>;