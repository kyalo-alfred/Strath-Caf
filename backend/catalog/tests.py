from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from accounts.models import CustomUser
from .models import Category, MenuItem

class CatalogTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = CustomUser.objects.create_superuser(
            email='admin@strath.edu', password='adminpassword'
        )
        self.customer = CustomUser.objects.create_user(
            email='customer@strath.edu', password='customerpassword',
            first_name='John', last_name='Doe', role=CustomUser.Role.CUSTOMER
        )
        self.category = Category.objects.create(name='Drinks', description='Beverages')
        self.menu_item = MenuItem.objects.create(
            category=self.category,
            name='Coffee',
            price='150.00'
        )

    def test_customer_can_read_catalog(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.get('/api/v1/catalog/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_customer_cannot_create_category(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post('/api/v1/catalog/categories/', {'name': 'Snacks'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_category(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/v1/catalog/categories/', {'name': 'Snacks'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
