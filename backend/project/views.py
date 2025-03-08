"""Project Views."""

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.apps import apps

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from .models import Cause, Project, ProjectAssignment
from .serializers import (
    CauseSerializer,
    ProjectSerializer,
    ProjectAssignmentSerializer,
)
from .permissions import IsAdminUser


User = get_user_model()


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


class AssignBeneficiaryView(APIView):
    """Assign a User or UserGroup to a Project."""

    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def post(self, request, project_id):
        """Create project assignment for beneficiary."""
        project = get_object_or_404(Project, id=project_id)
        serializer = ProjectAssignmentSerializer(data=request.data)

        if serializer.is_valid():
            assignable_type = serializer.validated_data["assignable_type"]
            assignable_id = serializer.validated_data["assignable_id"]

            # Get beneficiary model dynamically
            beneficiary_model = (
                User
                if assignable_type == "User"
                else apps.get_model("user", "UserGroup")
            )
            beneficiary = get_object_or_404(
                beneficiary_model, id=assignable_id
            )

            # Assign the beneficiary
            assignment, created = ProjectAssignment.assign_beneficiary(
                project, beneficiary
            )
            return Response(
                {
                    "message": (
                        "Beneficiary assigned successfully."
                        if created
                        else "Beneficiary already assigned."
                    )
                },
                status=(
                    status.HTTP_201_CREATED if created else status.HTTP_200_OK
                ),
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnassignBeneficiaryView(APIView):
    """Unassign a User or UserGroup from a Project."""

    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def delete(self, request, project_id):
        """Delete project assignment for beneficiary."""
        project = get_object_or_404(Project, id=project_id)
        serializer = ProjectAssignmentSerializer(data=request.data)

        if serializer.is_valid():
            assignable_type = serializer.validated_data["assignable_type"]
            assignable_id = serializer.validated_data["assignable_id"]

            beneficiary_model = (
                User
                if assignable_type == "User"
                else apps.get_model("user", "UserGroup")
            )
            beneficiary = get_object_or_404(
                beneficiary_model, id=assignable_id
            )

            deleted = ProjectAssignment.unassign_beneficiary(
                project, beneficiary
            )

            if deleted:
                return Response(
                    {"message": "Beneficiary unassigned successfully."},
                    status=status.HTTP_204_NO_CONTENT,
                )
            return Response(
                {"error": "No assignment found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListAssignmentsView(ListAPIView):
    """List all assignments for a given Project."""

    serializer_class = ProjectAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return ProjectAssignment.assignments_for(
            get_object_or_404(Project, id=project_id)
        )
