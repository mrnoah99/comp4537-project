from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    user_list,
    api_usage_list,
    CookieTokenRefreshView,
    endpoint_stats,
    user_api_consumption,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('users/', user_list, name='user-list'),
    path('api-usage/', api_usage_list, name='api-usage-list'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('endpoint-stats/', endpoint_stats, name='endpoint-stats'),
    path('user-api-consumption/', user_api_consumption, name='user-api-consumption'),
]