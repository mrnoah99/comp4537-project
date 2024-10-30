from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, user_list

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserProfileView.as_view(), name='user_profile'),
    path('users/', user_list, name='user_list'),
]