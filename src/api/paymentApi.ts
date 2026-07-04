import { axiosInstance } from './axios';
import { Payment } from '../types';

export const paymentApi = {
  initiateMpesaPayment: async (phone: string, amount: number, orderId: string): Promise<Payment> => {
    // Expected endpoint: POST /api/payment/mpesa/
    const response = await axiosInstance.post('payment/mpesa/', { phone, amount, order_id: orderId });
    return response.data;
  },
  getPaymentStatus: async (transactionId: string): Promise<Payment> => {
    const response = await axiosInstance.get(`payment/status/${transactionId}/`);
    return response.data;
  }
};
