from django.urls import path
from .views import LoginView, RegisterView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
