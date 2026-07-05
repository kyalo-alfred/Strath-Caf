from rest_framework import serializers
from .models import Category, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class CategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
