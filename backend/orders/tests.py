from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import CustomUser
from catalog.models import Category, MenuItem
from orders.models import Order, OrderItem

class OrderProcessingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = CustomUser.objects.create_user(
            email='student@strath.edu',
            password='studentpassword123',
            role=CustomUser.Role.CUSTOMER
        )
        self.staff_user = CustomUser.objects.create_user(
            email='staff@strath.edu',
            password='staffpassword123',
            role=CustomUser.Role.SERVER
        )
        
        self.category = Category.objects.create(name='Snacks')
        self.menu_item = MenuItem.objects.create(
            category=self.category,
            name='Samosa',
            price=50.00
        )
        
        self.orders_url = '/api/v1/orders/'

    def test_create_order_success(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(self.orders_url, {
            'items': [
                {'menu_item_id': self.menu_item.id, 'quantity': 2}
            ]
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)
        
        order = Order.objects.first()
        self.assertEqual(order.user, self.customer)
        self.assertEqual(order.total_amount, 100.00)  # 2 * 50

    def test_status_transition_rules(self):
        # Create an order
        order = Order.objects.create(user=self.customer, total_amount=50.00)
        
        self.client.force_authenticate(user=self.staff_user)
        update_url = f'{self.orders_url}{order.id}/update_status/'

        # Valid transition: Pending -> Preparing
        response = self.client.patch(update_url, {'status': 'preparing'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'preparing')

        # Invalid transition: Preparing -> Pending
        response = self.client.patch(update_url, {'status': 'pending'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        order.refresh_from_db()
        self.assertEqual(order.status, 'preparing')  # Unchanged

        # Valid transition: Preparing -> Ready
        response = self.client.patch(update_url, {'status': 'ready'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_customer_cannot_update_status(self):
        order = Order.objects.create(user=self.customer, total_amount=50.00)
        self.client.force_authenticate(user=self.customer)
        
        update_url = f'{self.orders_url}{order.id}/update_status/'
        response = self.client.patch(update_url, {'status': 'preparing'})
        
        # Depending on permissions setup, could be 403 or not found if scoped out
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
