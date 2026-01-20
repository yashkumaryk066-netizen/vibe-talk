from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/health/', health_check, name='health_check'),  # Health check endpoint
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
