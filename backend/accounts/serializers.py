from rest_framework import serializers
from .models import CustomUser, UserRole, APIUsage
from django.contrib.auth.hashers import make_password

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['id', 'role_name']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = UserRoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=UserRole.objects.all(), source='role', write_only=True, required=False
    )

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'api_calls', 'is_superuser', 'role', 'role_id')

    def create(self, validated_data):
        role = validated_data.pop('role', None)
        validated_data['password'] = make_password(validated_data['password'])
        user = CustomUser.objects.create(**validated_data)
        user.role = role
        user.save()
        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'api_calls']


class APIUsageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = APIUsage
        fields = '__all__'