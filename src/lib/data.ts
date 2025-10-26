import type { Product } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

const productsData: Omit<Product, 'imageUrl' | 'imageHint'>[] = [
    { id: "prod_1", name: "Classic Coffee Beans", category: "Coffee", price: 12.99, stock: 100, uom: "bag" },
    { id: "prod_2", name: "Butter Croissant", category: "Pastries", price: 3.50, stock: 50, uom: "pc" },
    { id: "prod_3", name: "Home Espresso Machine", category: "Equipment", price: 299.99, stock: 15, uom: "unit" },
    { id: "prod_4", name: "Organic Milk", category: "Groceries", price: 4.25, stock: 80, uom: "carton" },
    { id: "prod_5", name: "Everything Bagel", category: "Pastries", price: 2.75, stock: 60, uom: "pc" },
    { id: "prod_6", name: "Blueberry Muffin", category: "Pastries", price: 3.25, stock: 40, uom: "pc" },
    { id: "prod_7", name: "English Breakfast Tea", category: "Tea", price: 8.99, stock: 75, uom: "box" },
    { id: "prod_8", name: "Turkey Club Sandwich", category: "Food", price: 9.50, stock: 25, uom: "pc" },
    { id: "prod_9", name: "Fresh Orange Juice", category: "Beverages", price: 5.00, stock: 90, uom: "bottle" },
    { id: "prod_10", name: "Chocolate Cupcake", category: "Pastries", price: 4.00, stock: 45, uom: "pc" },
    { id: "prod_11", name: "Glazed Donut", category: "Pastries", price: 2.50, stock: 120, uom: "pc" },
    { id: "prod_12", name: "Mineral Water", category: "Beverages", price: 2.00, stock: 200, uom: "bottle" },
];

export const products: Product[] = productsData.map(product => {
  const placeholder = PlaceHolderImages.find(p => p.id === product.id);
  return {
    ...product,
    imageUrl: placeholder?.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`,
    imageHint: placeholder?.imageHint || 'product image'
  };
});
