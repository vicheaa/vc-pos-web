// API Product types (matches backend response)
export interface UOM {
  id: number;
  name: string;
  name_kh: string;
  symbol: string | null;
}

export interface ApiProduct {
  code: string;
  name: string;
  name_kh: string;
  thumbnail: string;
  description: string;
  cost_price: number;
  selling_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  uom_id: number;
  category_code: string;
  created_by: number | null;
  uom: UOM;
  category: Category;
}

export interface ProductsResponse {
  total: number;
  next: string | null;
  previous: string | null;
  data: ApiProduct[];
}

export interface Category {
  code: string;
  name: string;
  name_kh: string;
  thumnail: string; // Note: API has typo "thumnail" instead of "thumbnail"
  description: string;
}

// Legacy Product type (for compatibility)
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageHint: string;
  uom: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: "Pending" | "Completed" | "Cancelled";
  date: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderHistory: Order[];
};

// =====================
// =====================

export interface Root {
  success: boolean;
  message: string;
  data: Profile;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role_id?: number;
  created_at?: string;
  updated_at?: string;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  display_name_kh: string;
  restricted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
}
