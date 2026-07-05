from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order
from payments.models import Payment
from .models import Notification

@receiver(post_save, sender=Order)
def order_status_changed(sender, instance, created, **kwargs):
    if not created:
        Notification.objects.create(
            user=instance.user,
            title=f"Order #{instance.id} Update",
            message=f"Your order is now {instance.get_status_display()}."
        )

@receiver(post_save, sender=Payment)
def payment_status_changed(sender, instance, created, **kwargs):
    if not created and instance.status in [Payment.Status.SUCCESS, Payment.Status.FAILED]:
        title = "Payment Successful" if instance.status == Payment.Status.SUCCESS else "Payment Failed"
        Notification.objects.create(
            user=instance.user,
            title=title,
            message=f"Your payment for Order #{instance.order.id} was marked as {instance.get_status_display()}."
        )
