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
