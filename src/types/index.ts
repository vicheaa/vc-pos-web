export type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Cashier" | "Manager";
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageHint: string;
  uom: string; // Unit of Measurement
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
