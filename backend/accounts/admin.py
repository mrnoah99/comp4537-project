from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser', 'api_calls')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    list_editable = ('api_calls',)
    search_fields = ('username', 'email')
    ordering = ('-api_calls',)

    # Fields to display on the user detail/edit page
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('API Information', {'fields': ('api_calls',)}),  # Include api_calls here
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                    'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fields to display when creating a new user via the admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'api_calls'),
        }),
    )

# Register the CustomUser model with the customized admin interface
admin.site.register(CustomUser, CustomUserAdmin)
