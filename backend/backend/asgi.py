import os
import django  # ✅ Import this
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()  # ✅ Initialize Django apps

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import base.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            base.routing.websocket_urlpatterns
        )
    ),
})
