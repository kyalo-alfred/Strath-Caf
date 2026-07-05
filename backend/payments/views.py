from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
from .services import MpesaService

class PaymentViewSet(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin, viewsets.mixins.RetrieveModelMixin):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all().order_by('-created_at')
        return Payment.objects.filter(user=user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def stk_push(self, request):
        order_id = request.data.get('order_id')
        phone_number = request.data.get('phone_number')

        if not order_id or not phone_number:
            return Response({"error": "order_id and phone_number are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(order, 'payment') and order.payment.status == Payment.Status.SUCCESS:
            return Response({"error": "Order already paid."}, status=status.HTTP_400_BAD_REQUEST)

        # Create or update pending payment record
        payment, _ = Payment.objects.update_or_create(
            order=order,
            defaults={
                'user': request.user,
                'amount': order.total_amount,
                'phone_number': phone_number,
                'status': Payment.Status.PENDING
            }
        )

        daraja_response = MpesaService.initiate_stk_push(phone_number, order.total_amount, order.id)
        
        return Response({
            "message": "Payment initiated.",
            "daraja_response": daraja_response,
            "payment_id": payment.id
        })

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def callback(self, request):
        # MOCK CALLBACK ENDPOINT
        # Normally Daraja hits this endpoint with the result, validating via signatures/whitelisted IPs
        payment_id = request.data.get('payment_id')
        success = request.data.get('success', True)
        transaction_id = request.data.get('transaction_id', f'MOCK{payment_id}XYZ')

        try:
            payment = Payment.objects.get(id=payment_id)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        if success:
            payment.status = Payment.Status.SUCCESS
            payment.transaction_id = transaction_id
        else:
            payment.status = Payment.Status.FAILED
            
        payment.save()
        return Response({"status": "Callback received and processed"})
