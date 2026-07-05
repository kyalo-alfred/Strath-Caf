from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from catalog.models import Category, MenuItem
from .models import Order, OrderItem

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = CustomUser.objects.create_user(
            email='customer@example.com', password='password123',
            first_name='John', last_name='Doe', role=CustomUser.Role.CUSTOMER
        )
        self.server = CustomUser.objects.create_user(
            email='server@example.com', password='password123',
            first_name='Jane', last_name='Doe', role=CustomUser.Role.SERVER
        )
        
        self.category = Category.objects.create(name='Drinks')
        self.menu_item = MenuItem.objects.create(category=self.category, name='Coffee', price='150.00')

    def test_customer_can_create_order(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post('/api/v1/orders/', {
            'items': [
                {'menu_item_id': self.menu_item.id, 'quantity': 2}
            ]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['total_amount'], '300.00')
        self.assertEqual(response.data['status'], Order.Status.PENDING)

    def test_server_can_update_status(self):
        order = Order.objects.create(user=self.customer, total_amount='150.00')
        OrderItem.objects.create(order=order, menu_item=self.menu_item, quantity=1, price_at_time='150.00')
        
        self.client.force_authenticate(user=self.server)
        response = self.client.patch(f'/api/v1/orders/{order.id}/update_status/', {
            'status': Order.Status.PREPARING
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.PREPARING)
