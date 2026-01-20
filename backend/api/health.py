"""
🏥 VibeTalk Health Check Endpoint
Developer: Yash Ankush Mishra (Rangra Developer)
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection
import os

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint for monitoring services
    Returns database status, Redis status, and app info
    """
    health_status = {
        'status': 'healthy',
        'app': 'VibeTalk API',
        'version': '2.0.0',
        'developer': 'Yash Ankush Mishra - Rangra Developer',
        'environment': 'production' if not os.environ.get('DEBUG', 'False') == 'True' else 'development'
    }
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status['database'] = 'connected'
    except Exception as e:
        health_status['database'] = f'error: {str(e)}'
        health_status['status'] = 'unhealthy'
    
    # Check Redis (if configured)
    try:
        from django.core.cache import cache
        cache.set('health_check', 'ok', 10)
        if cache.get('health_check') == 'ok':
            health_status['redis'] = 'connected'
        else:
            health_status['redis'] = 'error'
    except Exception as e:
        health_status['redis'] = f'not configured or error: {str(e)}'
    
    status_code = 200 if health_status['status'] == 'healthy' else 503
    return Response(health_status, status=status_code)
