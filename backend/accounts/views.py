from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, UserListSerializer, APIUsageSerializer
from .models import CustomUser, APIUsage
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.middleware.csrf import get_token
from rest_framework_simplejwt.exceptions import TokenError
from django.db.models import Sum
from django.utils import timezone

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = CustomUser.objects.get(username=request.data['username'])
        refresh = RefreshToken.for_user(user)

        # Set JWT tokens in HTTP-only cookies
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(refresh.access_token),
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=str(refresh),
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        csrf_token = get_token(request)
        response.set_cookie(
            'csrftoken',
            csrf_token,
            max_age=3600,
            httponly=False,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path='/',
        )

        response.data = {'message': 'Registration successful'}
        return response

class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.user
        refresh = serializer.validated_data.get('refresh')
        access = serializer.validated_data.get('access')

        response = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)

        # Set tokens in HTTP-only cookies
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access,
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=refresh,
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        csrf_token = get_token(request)
        response.set_cookie(
            'csrftoken',
            csrf_token,
            max_age=3600,
            httponly=False,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path='/',
        )

        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        response.delete_cookie('csrftoken')  # Delete the CSRF cookie
        return response

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'username': user.username,
            'email': user.email,
            'api_calls': user.api_calls,
            'is_superuser': user.is_superuser,
        }
        return Response(data)

class CookieTokenRefreshView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

        if refresh_token is None:
            return Response({'error': 'No refresh token provided'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = serializer.validated_data['access']

        response = Response({'message': 'Token refreshed successfully'}, status=status.HTTP_200_OK)

        # Set new access token in cookie
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access_token,
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        return response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list(request):
    users = CustomUser.objects.all()
    serializer = UserListSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def api_usage_list(request):
    usages = APIUsage.objects.all()
    serializer = APIUsageSerializer(usages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def endpoint_stats(request):
    endpoints = [
        {'endpoint': 'api/register/', 'method': 'POST'},
        {'endpoint': 'api/login/', 'method': 'POST'},
        {'endpoint': 'api/logout/', 'method': 'POST'},
        {'endpoint': 'api/user/', 'method': 'GET'},
        {'endpoint': 'api/users/', 'method': 'GET'},
        {'endpoint': 'api/users/<int:pk>/update/', 'method': 'PUT'},
        {'endpoint': 'api/users/<int:pk>/delete/', 'method': 'DELETE'},
        {'endpoint': 'api/api-usage/', 'method': 'GET'},
        {'endpoint': 'api/endpoint-stats/', 'method': 'GET'},
        {'endpoint': 'api/user-api-consumption/', 'method': 'GET'},
        {'endpoint': 'api/llm-call/', 'method': 'POST'},
        {'endpoint': 'api/api-usage/create/', 'method': 'POST'},
        {'endpoint': 'api/token/refresh/', 'method': 'POST'},
        {'endpoint': 'api/user/update-email/', 'method': 'PATCH'},
    ]

    stats = []

    for endpoint in endpoints:
        total_requests = APIUsage.objects.filter(
            endpoint=endpoint['endpoint'],
            method=endpoint['method']
        ).aggregate(total=Sum('count'))['total'] or 0
        stats.append({
            'endpoint': endpoint['endpoint'],
            'method': endpoint['method'],
            'total_requests': total_requests,
        })

    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_api_consumption(request):
    # Get all users
    users = CustomUser.objects.all()
    stats = []

    for user in users:
        total_requests = APIUsage.objects.filter(user=user).aggregate(total=Sum('count'))['total'] or 0
        stats.append({
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'total_requests': total_requests,
        })

    return Response(stats)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_llm_api_call(request):
    user = request.user

    # Simulate API call to LLM model
    user.api_calls += 1
    user.save()

    # Record API usage
    api_usage, created = APIUsage.objects.get_or_create(
        user=user,
        endpoint='api/llm-call/',
        method='POST',
        defaults={'count': 1}
    )
    if not created:
        api_usage.count += 1
        api_usage.last_accessed = timezone.now()
        api_usage.save()
    else:
        api_usage.last_accessed = timezone.now()
        api_usage.save()

    response_data = {
        'message': 'LLM model response',
        'data': 'Simulated response from the LLM model.'
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_api_usage(request):
    serializer = APIUsageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update user
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_user(request, pk):
    try:
        user_to_update = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Prevent editing admin users
    if user_to_update.is_superuser:
        return Response({'error': 'Cannot edit admin users'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UserSerializer(user_to_update, data=request.data, partial=False)

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User updated successfully', 'data': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete user
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user_to_delete = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Prevent deleting admin users
    if user_to_delete.is_superuser:
        return Response({'error': 'Cannot delete admin users'}, status=status.HTTP_403_FORBIDDEN)

    user_to_delete.delete()
    return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_email(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    serializer.fields['username'].required = False
    serializer.fields['password'].required = False
    serializer.fields['api_calls'].required = False
    serializer.fields['is_superuser'].required = False

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Email updated successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)