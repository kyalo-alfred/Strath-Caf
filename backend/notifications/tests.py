from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from catalog.models import Category, MenuItem
from orders.models import Order, OrderItem
from payments.models import Payment
from .models import Notification

class NotificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = CustomUser.objects.create_user(
            email='customer@example.com', password='password123',
            first_name='John', last_name='Doe', role=CustomUser.Role.CUSTOMER
        )
        self.category = Category.objects.create(name='Drinks')
        self.menu_item = MenuItem.objects.create(category=self.category, name='Coffee', price='150.00')
        self.order = Order.objects.create(user=self.customer, total_amount='150.00', status=Order.Status.PENDING)
        
    def test_order_status_change_creates_notification(self):
        # Change order status
        self.order.status = Order.Status.READY
        self.order.save()
        
        # Check if notification was created via signals
        notifications = Notification.objects.filter(user=self.customer)
        self.assertEqual(notifications.count(), 1)
        self.assertIn('Ready', notifications.first().message)

    def test_payment_success_creates_notification(self):
        payment = Payment.objects.create(
            order=self.order, user=self.customer, amount='150.00', 
            phone_number='254712345678', status=Payment.Status.PENDING
        )
        
        payment.status = Payment.Status.SUCCESS
        payment.save()
        
        notifications = Notification.objects.filter(user=self.customer, title="Payment Successful")
        self.assertEqual(notifications.count(), 1)
        
    def test_mark_notification_read(self):
        notification = Notification.objects.create(
            user=self.customer, title="Test", message="Test Message"
        )
        
        self.client.force_authenticate(user=self.customer)
        response = self.client.patch(f'/api/v1/notifications/{notification.id}/mark_read/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)
