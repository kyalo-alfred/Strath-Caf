from rest_framework import permissions
from .models import CustomUser

class IsCustomer(permissions.BasePermission):
    """
    Allows access only to customer users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == CustomUser.Role.CUSTOMER)

class IsServer(permissions.BasePermission):
    """
    Allows access only to server users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == CustomUser.Role.SERVER)

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == CustomUser.Role.ADMIN)

class IsServerOrAdmin(permissions.BasePermission):
    """
    Allows access to server or admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [CustomUser.Role.SERVER, CustomUser.Role.ADMIN])

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to access it,
    unless the user is an admin.
    Assumes the model instance has a 'user' attribute.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == CustomUser.Role.ADMIN:
            return True
        return hasattr(obj, 'user') and obj.user == request.user
