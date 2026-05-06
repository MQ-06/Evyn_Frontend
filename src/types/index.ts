// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'seller' | 'buyer';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  businessName: string | null;
  isActive: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  categoryId: string | null;
  category: Category | null;
  sellerId: string;
  seller: Pick<AuthUser, 'id' | 'name' | 'businessName'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  buyerId: string | null;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  trackingNote: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface SellerWithStats extends AuthUser {
  _count?: { products: number };
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
