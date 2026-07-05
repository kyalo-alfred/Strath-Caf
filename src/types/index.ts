export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Role = 'customer' | 'server' | 'admin';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  phone?: string;
  university_id?: string;
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

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  user: string;
  customer_name: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  estimated_ready_time: string;
  payment_status: string | null;
  payment_reference: string | null;
  is_paid: boolean;
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
