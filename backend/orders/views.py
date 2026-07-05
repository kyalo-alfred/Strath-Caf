from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order
from .serializers import OrderSerializer
from accounts.models import CustomUser

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == CustomUser.Role.ADMIN:
            return Order.objects.all().order_by('-created_at')
        elif user.role == CustomUser.Role.SERVER:
            # Servers see all orders that need attention (not completed/cancelled)
            return Order.objects.exclude(status__in=[Order.Status.COMPLETED, Order.Status.CANCELLED]).order_by('created_at')
        else:
            # Customers only see their own orders
            return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """ Allow servers or admins to update order status """
        order = self.get_object()
        user = request.user
        
        if user.role not in [CustomUser.Role.SERVER, CustomUser.Role.ADMIN]:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
            
        new_status = request.data.get('status')
        if new_status not in dict(Order.Status.choices):
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
            
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
