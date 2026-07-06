from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import CustomUser

class AuthenticationAndPermissionsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = CustomUser.objects.create_superuser(
            email='admin@strath.edu',
            password='adminpassword123',
            first_name='Admin',
            last_name='User'
        )
        self.staff_user = CustomUser.objects.create_user(
            email='staff@strath.edu',
            password='staffpassword123',
            role=CustomUser.Role.SERVER
        )
        self.customer = CustomUser.objects.create_user(
            email='student@strath.edu',
            password='studentpassword123',
            role=CustomUser.Role.CUSTOMER
        )
        
        # Endpoints
        self.login_url = reverse('login')
        self.me_url = reverse('me')
        self.users_url = '/api/v1/auth/users/'

    def test_login_success(self):
        response = self.client.post(self.login_url, {
            'email': 'student@strath.edu',
            'password': 'studentpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_failure(self):
        response = self.client.post(self.login_url, {
            'email': 'student@strath.edu',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_access(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.customer.email)

    def test_unauthorized_profile_access(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_only_access_to_users(self):
        # Admin should access
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Staff should be denied
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Customer should be denied
        self.client.force_authenticate(user=self.customer)
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
