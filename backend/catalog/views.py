from rest_framework import viewsets, permissions
from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer
from accounts.permissions import IsAdmin

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return Category.objects.all()
        return super().get_queryset()

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return MenuItem.objects.all()
        return super().get_queryset()
