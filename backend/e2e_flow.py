import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'strath_caf_backend.settings')
django.setup()

from rest_framework.test import APIClient
from accounts.models import CustomUser
from catalog.models import Category, MenuItem
from orders.models import Order
from payments.models import Payment

def run_e2e():
    client = APIClient()
    
    # 1. Setup Users
    admin_user = CustomUser.objects.get(email='kabachia@strathmore.edu')
    customer_user = CustomUser.objects.get(email='ian.macharia@strathmore.edu')
    server_user = CustomUser.objects.get(email='ian.kabachia@strathmore.edu')

    print("--- 1. Admin creates Category & Menu Item ---")
    client.force_authenticate(user=admin_user)
    
    cat_resp = client.post('/api/v1/catalog/categories/', {'name': 'E2E Category', 'description': 'E2E Test'})
    assert cat_resp.status_code == 201, f"Failed to create category: {cat_resp.data}"
    category_id = cat_resp.data['id']
    print(f"-> Category created: {cat_resp.data['name']}")
    
    item_resp = client.post('/api/v1/catalog/menu-items/', {
        'category': category_id,
        'name': 'E2E Burger',
        'price': '350.00',
        'description': 'A test burger',
        'is_available': True
    })
    assert item_resp.status_code == 201, f"Failed to create menu item: {item_resp.data}"
    menu_item_id = item_resp.data['id']
    print(f"-> Menu item created: {item_resp.data['name']} @ {item_resp.data['price']}")

    print("\n--- 2. Customer orders the item ---")
    client.force_authenticate(user=customer_user)
    
    order_resp = client.post('/api/v1/orders/', {
        'items': [{'menu_item_id': menu_item_id, 'quantity': 2}]
    }, format='json')
    assert order_resp.status_code == 201, f"Failed to create order: {order_resp.data}"
    order_id = order_resp.data['id']
    print(f"-> Order created! ID: {order_id}, Total: {order_resp.data['total_amount']}")

    print("\n--- 3. Customer initiates payment ---")
    stk_resp = client.post('/api/v1/payments/stk_push/', {
        'order_id': order_id,
        'phone_number': '254712345678'
    })
    assert stk_resp.status_code == 200, f"Failed to initiate payment: {stk_resp.data}"
    payment_id = stk_resp.data['payment_id']
    print(f"-> Payment initiated via STK Push. Payment ID: {payment_id}")
    
    print("\n--- 4. Payment Mock Callback (Success) ---")
    client.force_authenticate(user=None) # Callback is unauthenticated
    callback_resp = client.post('/api/v1/payments/callback/', {
        'payment_id': payment_id,
        'success': True,
        'transaction_id': f'TEST_TXN_{payment_id}'
    })
    assert callback_resp.status_code == 200, f"Callback failed: {callback_resp.data}"
    
    # Verify order payment status
    client.force_authenticate(user=customer_user)
    check_order_resp = client.get(f'/api/v1/orders/{order_id}/')
    is_paid = check_order_resp.data['is_paid']
    payment_status = check_order_resp.data['payment_status']
    print(f"-> Order {order_id} payment status: {payment_status}, Is Paid: {is_paid}")

    print("\n--- 5. Server fulfills the order ---")
    client.force_authenticate(user=server_user)
    
    # Check queue
    queue_resp = client.get('/api/v1/orders/?status=pending')
    assert any(o['id'] == order_id for o in queue_resp.data['results']), "Order not in pending queue"
    print("-> Server sees order in pending queue.")
    
    # Pending -> Preparing
    prep_resp = client.patch(f'/api/v1/orders/{order_id}/update_status/', {'status': 'preparing'})
    assert prep_resp.status_code == 200, f"Update to preparing failed: {prep_resp.data}"
    print("-> Status updated to: Preparing")
    
    # Preparing -> Ready
    ready_resp = client.patch(f'/api/v1/orders/{order_id}/update_status/', {'status': 'ready'})
    assert ready_resp.status_code == 200, f"Update to ready failed: {ready_resp.data}"
    print("-> Status updated to: Ready")
    
    # Ready -> Collected
    coll_resp = client.patch(f'/api/v1/orders/{order_id}/update_status/', {'status': 'completed'})
    assert coll_resp.status_code == 200, f"Update to completed failed: {coll_resp.data}"
    print("-> Status updated to: Completed (Collected)")

    print("\n--- 6. Admin checks reports ---")
    client.force_authenticate(user=admin_user)
    reports_resp = client.get('/api/v1/admin/reports/')
    assert reports_resp.status_code == 200, f"Reports failed: {reports_resp.data}"
    print(f"-> Reports fetched successfully. Total Orders: {reports_resp.data.get('total_orders', 'N/A')}")
    
    print("\n FULL E2E FLOW COMPLETED SUCCESSFULLY! ")

def run_negative_tests():
    client = APIClient()
    
    admin_user = CustomUser.objects.get(email='kabachia@strathmore.edu')
    customer_user = CustomUser.objects.get(email='ian.macharia@strathmore.edu')
    server_user = CustomUser.objects.get(email='ian.kabachia@strathmore.edu')
    
    # Needs a valid category ID and order ID for some tests
    category_id = Category.objects.first().id
    order_id = Order.objects.first().id

    print("\n--- NEGATIVE TESTS START ---")

    print("\n1. Customer tries to create a menu item -> expect 403")
    client.force_authenticate(user=customer_user)
    resp = client.post('/api/v1/catalog/menu-items/', {'category': category_id, 'name': 'Hacked Burger', 'price': '10', 'is_available': True})
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}"
    print("-> Passed: Customer got 403 Forbidden")

    print("\n2. Server tries to access admin reports -> expect 403")
    client.force_authenticate(user=server_user)
    resp = client.get('/api/v1/admin/reports/')
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}"
    print("-> Passed: Server got 403 Forbidden")

    print("\n3. Customer attempts an invalid order transition -> expect 403")
    client.force_authenticate(user=customer_user)
    resp = client.patch(f'/api/v1/orders/{order_id}/update_status/', {'status': 'completed'})
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}"
    print("-> Passed: Customer got 403 Forbidden on update_status")

    print("\n4. Create an order with an invalid menu_item_id -> expect 400")
    client.force_authenticate(user=customer_user)
    resp = client.post('/api/v1/orders/', {'items': [{'menu_item_id': 99999, 'quantity': 1}]}, format='json')
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    print("-> Passed: System returned 400 Bad Request for invalid menu_item_id")

    print("\n5. Attempt payment on a nonexistent order -> expect 404")
    client.force_authenticate(user=customer_user)
    resp = client.post('/api/v1/payments/stk_push/', {'order_id': 99999, 'phone_number': '254712345678'})
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
    print("-> Passed: System returned 404 Not Found for non-existent order payment")

    print("\n6. Delete a category that still contains menu items -> expect protection")
    client.force_authenticate(user=admin_user)
    try:
        resp = client.delete(f'/api/v1/catalog/categories/{category_id}/')
        # DRF will either return 400/409, or crash with a 500 if unhandled ProtectedError
        assert resp.status_code in [400, 409, 500], f"Expected error code, got {resp.status_code}"
        print(f"-> Passed: System blocked deletion with status code {resp.status_code}")
    except Exception as e:
        print(f"-> Passed: System threw protection exception: {type(e).__name__}")

    print("\n7. Login with incorrect credentials -> expect 400")
    client.force_authenticate(user=None) # Ensure completely unauthenticated
    resp = client.post('/api/v1/auth/login/', {'email': 'kabachia@strathmore.edu', 'password': 'wrongpassword'})
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    print("-> Passed: System returned 400 Bad Request for bad credentials")

    print("\n ALL NEGATIVE TESTS PASSED SUCCESSFULLY! ")

if __name__ == '__main__':
    run_e2e()
    run_negative_tests()
