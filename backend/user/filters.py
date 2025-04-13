"""User filters."""

import django_filters

from .models import User


class UserFilter(django_filters.FilterSet):
    """User Filter."""

    class Meta:
        model = User
        fields = ("id", "email", "is_admin", "is_group_leader")
