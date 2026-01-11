import { openDB, DBSchema } from 'idb';
import type { Product, CartItem, ParkedOrder } from '@/types';

interface POSDB extends DBSchema {
  orders: {
    key: string;
    value: {
      id: string;
      items: { product_code: string; quantity: number }[];
      createdAt: number;
      synced: boolean;
    };
  };
  products: {
    key: string;
    value: Product;
  };
  parkedOrders: {
    key: string;
    value: ParkedOrder;
  };
}

const DB_NAME = 'pos-db';
const DB_VERSION = 2;

export const initDB = async () => {
  return openDB<POSDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('parkedOrders')) {
        db.createObjectStore('parkedOrders', { keyPath: 'id' });
      }
    },
  });
};

export const saveOfflineOrder = async (items: CartItem[]) => {
  const db = await initDB();
  const orderId = crypto.randomUUID();
  const order = {
    id: orderId,
    items: items.map((item) => ({
      product_code: item.product.id,
      quantity: item.quantity,
    })),
    createdAt: Date.now(),
    synced: false,
  };
  await db.put('orders', order);
  return orderId;
};

export const getOfflineOrders = async () => {
  const db = await initDB();
  return db.getAll('orders');
};

export const deleteOfflineOrder = async (id: string) => {
  const db = await initDB();
  await db.delete('orders', id);
};

export const cacheProducts = async (products: Product[]) => {
  const db = await initDB();
  const tx = db.transaction('products', 'readwrite');
  await Promise.all([
    ...products.map((product) => tx.store.put(product)),
    tx.done,
  ]);
};

export const getCachedProducts = async () => {
  const db = await initDB();
  return db.getAll('products');
};

// Parked Orders Functions
export const saveParkedOrder = async (items: CartItem[], note?: string): Promise<string> => {
  const db = await initDB();
  const orderId = crypto.randomUUID();
  const parkedOrder: ParkedOrder = {
    id: orderId,
    items,
    createdAt: Date.now(),
    note,
  };
  await db.put('parkedOrders', parkedOrder);
  return orderId;
};

export const getParkedOrders = async (): Promise<ParkedOrder[]> => {
  const db = await initDB();
  return db.getAll('parkedOrders');
};

export const deleteParkedOrder = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('parkedOrders', id);
};
