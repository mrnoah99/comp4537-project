from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserRole, APIUsage

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser', 'api_calls', 'role')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'role')
    list_editable = ('api_calls', 'role')
    search_fields = ('username', 'email')
    ordering = ('-api_calls',)

    # Fields to display on the user detail/edit page
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('API Information', {'fields': ('api_calls',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                    'groups', 'user_permissions', 'role')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fields to display when creating a new user via the admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'api_calls', 'role'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserRole)
admin.site.register(APIUsage)