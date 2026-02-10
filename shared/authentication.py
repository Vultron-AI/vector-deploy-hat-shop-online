import os

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication


class DevAutoAuthentication(BaseAuthentication):
    """
    DEV-ONLY authentication that auto-authenticates requests in DEBUG mode.

    When DEBUG=True and no other authentication is provided, this authenticator
    creates/retrieves a dev user and authenticates the request automatically.

    The user email is configured via the DEV_USER_EMAIL environment variable.

    This should be listed AFTER other authenticators (like JWTAuthentication)
    so it only activates when no credentials are provided.
    """

    _cached_user = None

    def authenticate(self, request):
        if not settings.DEBUG:
            return None  # Not in debug mode, skip

        # Return cached user if available
        if DevAutoAuthentication._cached_user is not None:
            return (DevAutoAuthentication._cached_user, None)

        User = get_user_model()
        email = os.getenv("DEV_USER_EMAIL", "dev@localhost")

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={"is_active": True},
        )

        # Cache the user for subsequent requests
        DevAutoAuthentication._cached_user = user

        return (user, None)
