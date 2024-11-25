from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserProfileView, user_list, api_usage_list, CookieTokenRefreshView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserProfileView.as_view(), name='user_profile'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    
    path('users/', user_list, name='user_list'),
    path('api-usage/', api_usage_list, name='api_usage_list'),
]