from django.utils.deprecation import MiddlewareMixin
from accounts.models import APIUsage
from django.utils import timezone

class APIUsageMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.path.startswith('/api/'):
            user = request.user if request.user.is_authenticated else None
            endpoint = request.path
            method = request.method

            if user:
                usage, created = APIUsage.objects.get_or_create(
                    user=user,
                    endpoint=endpoint,
                    method=method,
                    defaults={'count': 1, 'last_accessed': timezone.now()}
                )
                if not created:
                    usage.count += 1
                    usage.last_accessed = timezone.now()
                    usage.save()
        return response
