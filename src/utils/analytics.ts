import { Order, User } from '../types';

export const calculateTotalRevenue = (orders: Order[]): number => {
  return orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + Number(order.total_amount), 0);
};

export const calculateTotalOrders = (orders: Order[]): number => {
  return orders.length;
};

export const calculateActiveUsers = (users: User[]): number => {
  // Assuming we might add is_active to the User type later.
  // For now, we'll just count all fetched users.
  return users.length;
};

export const calculateAvgWaitTime = (orders: Order[]): string => {
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  if (completedOrders.length === 0) return '0 mins';
  
  let totalMinutes = 0;
  completedOrders.forEach(order => {
    const created = new Date(order.created_at);
    if (order.estimated_ready_time) {
      const ready = new Date(order.estimated_ready_time);
      const diffMs = ready.getTime() - created.getTime();
      totalMinutes += Math.max(0, diffMs / 1000 / 60);
    } else {
      totalMinutes += 15;
    }
  });
  
  const avg = Math.round(totalMinutes / completedOrders.length);
  return `${avg} mins`;
};
