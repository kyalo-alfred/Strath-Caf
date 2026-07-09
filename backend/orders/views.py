from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Order
from .serializers import OrderSerializer
from accounts.models import CustomUser
from accounts.permissions import IsAdmin

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'user']
    ordering_fields = ['created_at', 'total_amount']
    search_fields = ['id', 'user__first_name', 'user__last_name']

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()
            
        user = self.request.user
        if user.role in [CustomUser.Role.ADMIN, CustomUser.Role.SERVER]:
            return Order.objects.all()
        else:
            return Order.objects.filter(user=user)

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

        # Enforce valid forward state transitions
        valid_transitions = {
            'pending': ['preparing', 'cancelled'],
            'preparing': ['ready', 'cancelled'],
            'ready': ['completed'],
            'completed': [],
            'cancelled': []
        }
        
        if new_status not in valid_transitions.get(order.status, []):
            return Response(
                {"detail": f"Invalid state transition from {order.status} to {new_status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        order.status = new_status
        order.save()
        
        if new_status == 'cancelled' and hasattr(order, 'payment'):
            order.payment.status = 'cancelled'
            order.payment.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def export(self, request):
        """ Export the last 30 days of orders as a CSV """
        from django.http import HttpResponse
        import csv
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        orders = Order.objects.filter(created_at__gte=thirty_days_ago).order_by('-created_at')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="cafeteria_30day_report.csv"'

        writer = csv.writer(response)
        writer.writerow(['Order ID', 'Customer Name', 'Status', 'Total Amount', 'Created At'])

        for order in orders:
            dt = timezone.localtime(order.created_at).strftime('%d/%m/%Y %I:%M %p')
            customer_name = f"{order.user.first_name} {order.user.last_name}".strip() or order.user.email
            writer.writerow([
                order.id,
                customer_name,
                order.status.capitalize(),
                f"KES {order.total_amount}",
                dt
            ])

        return response

from datetime import timedelta
from django.db.models.functions import TruncDate

class AdminReportsView(views.APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        today = timezone.now().date()
        today_orders = Order.objects.filter(created_at__date=today)
        
        total_revenue = Order.objects.filter(payment__status='success').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        today_revenue = today_orders.filter(payment__status='success').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Generate 7-day rolling chart data
        start_date = today - timedelta(days=6)
        daily_revenue_qs = (
            Order.objects.filter(created_at__date__gte=start_date, payment__status='success')
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(revenue=Sum('total_amount'))
            .order_by('date')
        )
        
        revenue_dict = {item['date']: item['revenue'] or 0 for item in daily_revenue_qs}
        
        chart_data = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            day_name = current_date.strftime('%a')
            revenue = revenue_dict.get(current_date, 0)
            chart_data.append({'name': day_name, 'revenue': float(revenue)})
        
        recent_orders = OrderSerializer(Order.objects.all().order_by('-created_at')[:5], many=True).data
        
        return Response({
            "summary": {
                "total_orders": Order.objects.count(),
                "today_orders": today_orders.count(),
                "total_revenue": total_revenue,
                "today_revenue": today_revenue
            },
            "chart_data": chart_data,
            "recent_orders": recent_orders
        })
