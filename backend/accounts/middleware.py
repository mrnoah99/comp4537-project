from django.urls import resolve
from .models import APIUsage
from django.utils import timezone

class APIUsageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Only track API requests
        if request.path.startswith('/api/'):
            user = request.user if request.user.is_authenticated else None
            resolver_match = resolve(request.path_info)
            endpoint = resolver_match.route  # This gives the URL pattern
            method = request.method.upper()

            if user:
                # Update user's total API calls
                user.api_calls += 1
                user.save()

                # Update APIUsage model
                api_usage, created = APIUsage.objects.get_or_create(
                    user=user,
                    endpoint=endpoint,
                    method=method,
                    defaults={'count': 1}
                )
                if not created:
                    api_usage.count += 1
                    api_usage.last_accessed = timezone.now()
                    api_usage.save()
                else:
                    api_usage.last_accessed = timezone.now()
                    api_usage.save()
            else:
                # Optionally handle anonymous users
                pass

        return response