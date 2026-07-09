import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'strath_caf_backend.settings')
django.setup()

from orders.models import Order
from payments.models import Payment

print("=== Orders ===")
for o in Order.objects.all():
    print(f"Order {o.id}: Total {o.total_amount}, Status {o.status}")
    if hasattr(o, 'payment'):
        print(f"  Payment {o.payment.id}: Amount {o.payment.amount}, Status {o.payment.status}")
    else:
        print("  No Payment")

print("\n=== Revenue Calculation ===")
from django.db.models import Sum
total = Order.objects.filter(payment__status='success').aggregate(Sum('total_amount'))['total_amount__sum']
print(f"Total Revenue via Query: {total}")
