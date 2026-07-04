export type Role = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  phone?: string;
  student_number?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; 
  image_url: string;
  is_available: boolean;
  prep_time_minutes: number;
  ingredients?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface OrderItem {
  id?: string;
  order?: string;
  menu_item: MenuItem;
  quantity: number;
  price_at_time?: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Collected' | 'Cancelled';

export interface Order {
  id: string;
  user: string;
  customer_name: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  estimated_ready_time: string;
}

export interface Payment {
  id: string;
  order: string;
  transaction_id: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  phone_number: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
