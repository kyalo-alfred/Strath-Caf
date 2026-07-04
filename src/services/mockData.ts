import { MenuItem, Order, Notification, User } from '../types';

export const mockUsers: User[] = [
  { id: '1', first_name: 'Student', last_name: 'One', email: 'student@demo.com', role: 'customer' },
  { id: '2', first_name: 'Cafeteria', last_name: 'Staff', email: 'staff@demo.com', role: 'staff' },
  { id: '3', first_name: 'System', last_name: 'Admin', email: 'admin@demo.com', role: 'admin' },
];

export const mockMeals: MenuItem[] = [
  {
    id: 'm1',
    name: 'Grilled Chicken & Rice',
    description: 'Tender grilled chicken served with a side of steamed rice and fresh veggies.',
    price: 350,
    category: 'Lunch',
    image_url: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_available: true,
    prep_time_minutes: 15,
    ingredients: ['Chicken breast', 'Rice', 'Broccoli', 'Carrots', 'Soy sauce'],
    nutrition: { calories: 550, protein: 45, carbs: 60, fat: 12 }
  },
  {
    id: 'm2',
    name: 'Beef Burger & Fries',
    description: 'Juicy beef patty with cheese, lettuce, and our special sauce, served with crispy fries.',
    price: 450,
    category: 'Lunch',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_available: true,
    prep_time_minutes: 20,
    ingredients: ['Beef patty', 'Burger bun', 'Cheese', 'Lettuce', 'Tomato', 'Fries'],
    nutrition: { calories: 850, protein: 35, carbs: 80, fat: 45 }
  },
  {
    id: 'm3',
    name: 'Vegetable Salad',
    description: 'Fresh mixed greens with cherry tomatoes, cucumbers, and a light vinaigrette.',
    price: 250,
    category: 'Lunch',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_available: true,
    prep_time_minutes: 5,
    ingredients: ['Lettuce', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Vinegar'],
    nutrition: { calories: 150, protein: 5, carbs: 10, fat: 10 }
  },
  {
    id: 'm4',
    name: 'Chapati & Beans (Madondo)',
    description: 'Classic local favorite: soft chapati served with rich, hearty bean stew.',
    price: 150,
    category: 'Lunch',
    image_url: 'https://images.unsplash.com/photo-1627308595229-7830f5c92f4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_available: true,
    prep_time_minutes: 10,
    ingredients: ['Wheat flour', 'Kidney beans', 'Onions', 'Tomatoes', 'Spices'],
    nutrition: { calories: 450, protein: 15, carbs: 70, fat: 12 }
  },
  {
    id: 'm5',
    name: 'Fresh Mango Juice',
    description: 'Freshly squeezed sweet mango juice.',
    price: 100,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_available: true,
    prep_time_minutes: 3,
  }
];

export let mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    user: '1',
    customer_name: 'Student One',
    items: [
      { menu_item: mockMeals[0], quantity: 1 },
      { menu_item: mockMeals[4], quantity: 2 },
    ],total_amount: 450,
    status: 'Pending',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    estimated_ready_time: new Date(Date.now() + 15 * 60000).toISOString(),
  },
  {
    id: 'ORD-1002',
    user: '1',
    customer_name: 'Student One',
    items: [
      { menu_item: mockMeals[1], quantity: 1 },
    ],total_amount: 300,
    status: 'Preparing',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    estimated_ready_time: new Date(Date.now() + 5 * 60000).toISOString(),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    user: '1',
    title: 'Order Received',
    message: 'Your order ORD-1001 has been received and is waiting to be processed.',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  }
];
