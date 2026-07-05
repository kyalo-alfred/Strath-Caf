from rest_framework import serializers
from .models import Order, OrderItem
from catalog.serializers import MenuItemSerializer
from catalog.models import MenuItem

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.filter(is_available=True), 
        source='menu_item', 
        write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item_detail', 'menu_item_id', 'quantity', 'price_at_time']
        read_only_fields = ['price_at_time']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user_email = serializers.ReadOnlyField(source='user.email')
    customer_name = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    payment_reference = serializers.SerializerMethodField()
    is_paid = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'customer_name', 'status', 'total_amount', 'items', 'created_at', 'updated_at', 'payment_status', 'payment_reference', 'is_paid']
        read_only_fields = ['user', 'total_amount', 'status', 'created_at', 'updated_at', 'payment_status', 'payment_reference', 'is_paid']

    def get_customer_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    def get_payment_status(self, obj):
        return obj.payment.status if hasattr(obj, 'payment') else None

    def get_payment_reference(self, obj):
        return obj.payment.transaction_id if hasattr(obj, 'payment') else None

    def get_is_paid(self, obj):
        return obj.payment.status == 'success' if hasattr(obj, 'payment') else False

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        order = Order.objects.create(user=user, status=Order.Status.PENDING, total_amount=0, **validated_data)
        
        total = 0
        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = item_data['quantity']
            price = menu_item.price
            
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price_at_time=price
            )
            total += (price * quantity)
            
        order.total_amount = total
        order.save()
        return order
