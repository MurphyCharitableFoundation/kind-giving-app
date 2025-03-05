"""Project permisssions."""

from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Allow only users in 'admin' group."""

    def has_permission(self, request, view):
        return request.user.groups.filter(name="admin").exists()
