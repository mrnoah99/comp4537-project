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
    make_llm_api_call,
    create_api_usage,
    update_user,
    delete_user,
    update_user_email,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('users/', user_list, name='user-list'),
    path('users/<int:pk>/update/', update_user, name='update-user'),
    path('users/<int:pk>/delete/', delete_user, name='delete-user'),
    path('api-usage/', api_usage_list, name='api-usage-list'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('endpoint-stats/', endpoint_stats, name='endpoint-stats'),
    path('user-api-consumption/', user_api_consumption, name='user-api-consumption'),
    path('llm-call/', make_llm_api_call, name='llm-call'),
    path('api-usage/create/', create_api_usage, name='api-usage-create'),
    path('user/update-email/', update_user_email, name='update-user-email'),
]