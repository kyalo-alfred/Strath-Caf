import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'strath_caf_backend.settings')
django.setup()

from rest_framework.test import APIClient

from accounts.models import CustomUser
from catalog.models import Category, MenuItem
from orders.models import Order, OrderItem
from payments.models import Payment
from notifications.models import Notification

client = APIClient()

print("Setting up test data...")
admin = CustomUser.objects.create_superuser('admin@strath.edu', 'pass', first_name='Admin')
server = CustomUser.objects.create_user('server@strath.edu', 'pass', role='server', first_name='Server')
customer = CustomUser.objects.create_user('cust@strath.edu', 'pass', role='customer', first_name='Customer')

cat = Category.objects.create(name="Drinks")
item1 = MenuItem.objects.create(category=cat, name="Coke", price=50.00)
item2 = MenuItem.objects.create(category=cat, name="Pepsi", price=45.00)
item3 = MenuItem.objects.create(category=cat, name="Water", price=30.00)

order = Order.objects.create(user=customer, status='pending', total_amount=50.00)
OrderItem.objects.create(order=order, menu_item=item1, quantity=1, price_at_time=50.00)
Payment.objects.create(order=order, user=customer, amount=50.00, status='success', transaction_id='TX123', phone_number='0700000000')

notif = Notification.objects.create(user=customer, title="Test", message="Msg")

def test_endpoint(name, method, url, user, expected_status, kwargs=None):
    if user:
        client.force_authenticate(user=user)
    else:
        client.logout()
        
    func = getattr(client, method.lower())
    res = func(url, **(kwargs or {}), format='json')
    
    status_match = res.status_code == expected_status
    print(f"[{'PASS' if status_match else 'FAIL'}] {name} ({method} {url}) - Expected: {expected_status}, Got: {res.status_code}")
    if not status_match:
        print(f"   Response: {res.content}")
    return res

print("\n--- Running Tests ---")
# 1. /auth/me/
test_endpoint("GET /auth/me/ (Customer)", "GET", "/api/v1/auth/me/", customer, 200)
res = test_endpoint("PATCH /auth/me/ (Customer)", "PATCH", "/api/v1/auth/me/", customer, 200, {"data": {"first_name": "Updated"}})
if res.status_code == 200:
    print(f"   Name updated to: {res.data['first_name']}")

# 2. /auth/me/password/
test_endpoint("POST /auth/me/password/ (Wrong Password)", "POST", "/api/v1/auth/me/password/", customer, 400, {"data": {"current_password": "wrong", "new_password": "newpass"}})
test_endpoint("POST /auth/me/password/ (Right Password)", "POST", "/api/v1/auth/me/password/", customer, 200, {"data": {"current_password": "pass", "new_password": "newpass"}})

# 3. /admin/reports/
test_endpoint("GET /admin/reports/ (Customer - Forbidden)", "GET", "/api/v1/admin/reports/", customer, 403)
res = test_endpoint("GET /admin/reports/ (Admin)", "GET", "/api/v1/admin/reports/", admin, 200)
if res.status_code == 200:
    print(f"   Reports Data: {list(res.data.keys())}")

# 4. Pagination on list endpoints
res = test_endpoint("GET /catalog/menu-items/ (Pagination)", "GET", "/api/v1/catalog/menu-items/", customer, 200)
if res.status_code == 200:
    print(f"   Is Paginated: {'count' in res.data and 'results' in res.data}")

# 5. Filtering, Searching, Ordering
res = test_endpoint("GET /catalog/menu-items/?search=Coke", "GET", "/api/v1/catalog/menu-items/?search=Coke", customer, 200)
if res.status_code == 200:
    print(f"   Search Results Count: {res.data['count']} (Expected: 1)")

res = test_endpoint("GET /catalog/menu-items/?ordering=-price", "GET", "/api/v1/catalog/menu-items/?ordering=-price", customer, 200)
if res.status_code == 200 and res.data['count'] > 0:
    print(f"   Ordering First Item Price: {res.data['results'][0]['price']} (Expected: 50.00)")

# 6. Payment integration on orders
res = test_endpoint("GET /orders/", "GET", "/api/v1/orders/", customer, 200)
if res.status_code == 200 and res.data['count'] > 0:
    order_data = res.data['results'][0]
    print(f"   Order contains payment_status: {'payment_status' in order_data}")
    print(f"   Order contains is_paid: {'is_paid' in order_data}")

# 7. Delete Notification
test_endpoint("DELETE /notifications/ (Admin on Customer notif)", "DELETE", f"/api/v1/notifications/{notif.id}/", admin, 404)
test_endpoint("DELETE /notifications/ (Customer on own notif)", "DELETE", f"/api/v1/notifications/{notif.id}/", customer, 204)

print("\nCleaning up...")
admin.delete()
server.delete()
customer.delete()
cat.delete()
print("Done.")
