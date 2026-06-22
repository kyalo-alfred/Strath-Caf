import { Meal, Order, Notification, User } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Student One', email: 'student@strathmore.edu', role: 'customer', studentNumber: '123456' },
  { id: '2', name: 'Cafeteria Staff', email: 'staff@strathmore.edu', role: 'staff' },
  { id: '3', name: 'System Admin', email: 'admin@strathmore.edu', role: 'admin' },
];

export const mockMeals: Meal[] = [
  {
    id: 'm1',
    name: 'Grilled Chicken & Rice',
    description: 'Tender grilled chicken served with a side of steamed rice and fresh veggies.',
    price: 350,
    category: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 15,
    ingredients: ['Chicken breast', 'Rice', 'Broccoli', 'Carrots', 'Soy sauce'],
    nutrition: { calories: 550, protein: 45, carbs: 60, fat: 12 }
  },
  {
    id: 'm2',
    name: 'Beef Burger & Fries',
    description: 'Juicy beef patty with cheese, lettuce, and our special sauce, served with crispy fries.',
    price: 450,
    category: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 20,
    ingredients: ['Beef patty', 'Burger bun', 'Cheese', 'Lettuce', 'Tomato', 'Fries'],
    nutrition: { calories: 850, protein: 35, carbs: 80, fat: 45 }
  },
  {
    id: 'm3',
    name: 'Vegetable Salad',
    description: 'Fresh mixed greens with cherry tomatoes, cucumbers, and a light vinaigrette.',
    price: 250,
    category: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    ingredients: ['Lettuce', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Vinegar'],
    nutrition: { calories: 150, protein: 5, carbs: 10, fat: 10 }
  },
  {
    id: 'm4',
    name: 'Chapati & Beans (Madondo)',
    description: 'Classic local favorite: soft chapati served with rich, hearty bean stew.',
    price: 150,
    category: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830f5c92f4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 10,
    ingredients: ['Wheat flour', 'Kidney beans', 'Onions', 'Tomatoes', 'Spices'],
    nutrition: { calories: 450, protein: 15, carbs: 70, fat: 12 }
  },
  {
    id: 'm5',
    name: 'Fresh Mango Juice',
    description: 'Freshly squeezed sweet mango juice.',
    price: 100,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
  }
];

export let mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    userId: '1',
    customerName: 'Student One',
    items: [{ meal: mockMeals[0], quantity: 1 }, { meal: mockMeals[4], quantity: 1 }],
    totalAmount: 450,
    status: 'Pending',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedReadyTime: new Date(Date.now() + 15 * 60000).toISOString(),
  },
  {
    id: 'ORD-1002',
    userId: '1',
    customerName: 'Student One',
    items: [{ meal: mockMeals[3], quantity: 2 }],
    totalAmount: 300,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedReadyTime: new Date(Date.now() + 5 * 60000).toISOString(),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    title: 'Order Received',
    message: 'Your order ORD-1001 has been received and is waiting to be processed.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  }
];
