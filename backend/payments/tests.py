from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from catalog.models import Category, MenuItem
from orders.models import Order, OrderItem
from .models import Payment

class PaymentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = CustomUser.objects.create_user(
            email='customer@example.com', password='password123',
            first_name='John', last_name='Doe', role=CustomUser.Role.CUSTOMER
        )
        self.category = Category.objects.create(name='Drinks')
        self.menu_item = MenuItem.objects.create(category=self.category, name='Coffee', price='150.00')
        
        self.order = Order.objects.create(user=self.customer, total_amount='150.00')
        OrderItem.objects.create(order=self.order, menu_item=self.menu_item, quantity=1, price_at_time='150.00')

    def test_stk_push_initiation(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post('/api/v1/payments/stk_push/', {
            'order_id': self.order.id,
            'phone_number': '254712345678'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('payment_id', response.data)
        
        # Verify payment record was created
        payment = Payment.objects.get(id=response.data['payment_id'])
        self.assertEqual(str(payment.amount), str(self.order.total_amount))
        self.assertEqual(payment.status, Payment.Status.PENDING)

    def test_mock_callback_success(self):
        payment = Payment.objects.create(
            order=self.order, user=self.customer, amount='150.00', phone_number='254712345678'
        )
        
        response = self.client.post('/api/v1/payments/callback/', {
            'payment_id': payment.id,
            'success': True,
            'transaction_id': 'RECEIPT123'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.SUCCESS)
        self.assertEqual(payment.transaction_id, 'RECEIPT123')
