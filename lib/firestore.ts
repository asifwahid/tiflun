import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  serverTimestamp,
  runTransaction,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Order, OrderCreate } from '@/types';

// Products collection helpers
export const productsCollection = collection(db, 'products');

export const getProducts = async (
  limitCount = 20,
  lastDoc?: DocumentSnapshot,
  filters?: { status?: string; category?: string }
) => {
  let q = query(
    productsCollection,
    where('status', '==', filters?.status || 'active'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  if (filters?.category) {
    q = query(q, where('categories', 'array-contains', filters.category));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  return {
    products,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === limitCount,
  };
};

export const getProductBySlug = async (slug: string) => {
  const q = query(productsCollection, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Product;
};

export const getProductById = async (id: string) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return { id: docSnap.id, ...docSnap.data() } as Product;
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(productsCollection, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (id: string) => {
  // Soft delete by setting status to archived
  await updateProduct(id, { status: 'archived' });
};

// Orders collection helpers
export const ordersCollection = collection(db, 'orders');

export const createOrder = async (orderData: OrderCreate) => {
  return await runTransaction(db, async (transaction) => {
    // Get and increment order counter
    const counterRef = doc(db, 'counters', 'orders');
    const counterDoc = await transaction.get(counterRef);
    
    let nextOrderNumber = 1;
    if (counterDoc.exists()) {
      const currentCount = counterDoc.data().lastValue || 0;
      nextOrderNumber = currentCount + 1;
    }
    
    // Generate order number
    const orderNumber = `${process.env.ORDER_NUMBER_PREFIX || 'TIF-'}${new Date().getFullYear()}-${String(nextOrderNumber).padStart(6, '0')}`;
    
    // Create order document
    const orderRef = doc(ordersCollection);
    const order: Omit<Order, 'id'> = {
      ...orderData,
      orderNumber,
      currentStatus: 'pending',
      statusTimeline: [{
        status: 'pending',
        at: serverTimestamp(),
        note: 'Order received',
      }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    transaction.set(orderRef, order);
    
    // Update counter
    transaction.set(counterRef, { lastValue: nextOrderNumber }, { merge: true });
    
    return { id: orderRef.id, orderNumber };
  });
};

export const getOrderByNumberAndPhone = async (orderNumber: string, phone: string) => {
  const q = query(
    ordersCollection,
    where('orderNumber', '==', orderNumber),
    where('customer.phone', '==', phone),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Order;
};

export const getOrders = async (
  limitCount = 20,
  lastDoc?: DocumentSnapshot,
  filters?: { status?: string; searchTerm?: string }
) => {
  let q = query(
    ordersCollection,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  if (filters?.status && filters.status !== 'all') {
    q = query(ordersCollection, where('currentStatus', '==', filters.status), orderBy('createdAt', 'desc'), limit(limitCount));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  let orders = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];

  // Client-side search if needed (for small datasets)
  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    orders = orders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customer.phone.includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower)
    );
  }

  return {
    orders,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === limitCount,
  };
};

export const updateOrderStatus = async (
  id: string, 
  newStatus: Order['currentStatus'], 
  note?: string
) => {
  const orderRef = doc(db, 'orders', id);
  
  await runTransaction(db, async (transaction) => {
    const orderDoc = await transaction.get(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }
    
    const order = orderDoc.data() as Order;
    const newTimelineEntry = {
      status: newStatus,
      at: serverTimestamp(),
      ...(note && { note }),
    };
    
    transaction.update(orderRef, {
      currentStatus: newStatus,
      statusTimeline: [...(order.statusTimeline || []), newTimelineEntry],
      updatedAt: serverTimestamp(),
    });
  });
};

// Helper function to validate product stock
export const validateProductStock = async (items: { productId: string; quantity: number }[]) => {
  const validatedItems = [];
  
  for (const item of items) {
    const product = await getProductById(item.productId);
    
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }
    
    if (product.status !== 'active') {
      throw new Error(`Product ${product.title} is not available`);
    }
    
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.title}. Available: ${product.stock}`);
    }
    
    validatedItems.push({
      ...item,
      product,
      unitPrice: product.price.amount,
      subtotal: product.price.amount * item.quantity,
    });
  }
  
  return validatedItems;
};