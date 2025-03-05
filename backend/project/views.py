"""Project Views."""

from rest_framework import permissions, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from .models import Cause, Project
from .serializers import CauseSerializer, ProjectSerializer
from .permissions import IsAdminUser


class CauseListCreateView(ListCreateAPIView):
    """List & Create View for Cause."""

    queryset = Cause.objects.all()
    serializer_class = CauseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Ensure only admins can create causes."""
        if self.request.user.groups.filter(name="admin").exists():
            return serializer.save()
        else:
            raise PermissionDenied("Only admins can create causes.")


class CauseRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """Retrieve, Update, and Destroy View for Cause."""

    queryset = Cause.objects.all()
    serializer_class = CauseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def perform_destroy(self, instance):
        """Prevent delete if any project is using this cause."""
        if instance.projects.exists():
            raise serializers.ValidationError(
                "This cause is used by one or more projects and cannot be deleted."
            )
        super().perform_destroy(instance)


class ProjectListCreateView(ListCreateAPIView):
    """List & Create View for Project."""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Ensure only admins can create projects."""
        if self.request.user.groups.filter(name="admin").exists():
            return serializer.save()
        else:
            raise PermissionDenied("Only admins can create projects.")


class ProjectRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """Retrieve, Update, and Destroy View for Project."""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
