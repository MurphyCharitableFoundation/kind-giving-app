"""Project Views."""

from django.contrib.auth import get_user_model
from django.http import Http404
from drf_spectacular.utils import (
    OpenApiResponse,
    extend_schema,
    extend_schema_serializer,
)
from rest_framework import permissions, serializers, status
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdminUser

from .mixins import BeneficiaryResolutionMixin
from .models import Cause, Project
from .selectors import (
    cause_get,
    cause_list,
    project_beneficiary_list,
    project_donations_total_percentage,
    project_get,
    project_list,
)
from .serializers import (
    ProjectAssignmentSerializer,
)
from .services import (
    assign_beneficiary,
    cause_create,
    cause_update,
    project_create,
    project_update,
    unassign_beneficiary,
)

User = get_user_model()


@extend_schema_serializer(component_name="CauseListCreateAPI")
class CauseListCreateAPI(ListCreateAPIView):
    """List & Create View for Cause."""

    queryset = cause_list()

    class CauseInputSerializer(serializers.ModelSerializer):
        """Cause Input Serializer."""

        class Meta:  # noqa
            model = Cause
            fields = ["name", "description", "icon"]

        def create(self, validated_data):  # noqa
            return cause_create(**validated_data)

        def update(self, instance, validated_data):  # noqa
            return cause_update(cause=instance, data=validated_data)

    class CauseOutputSerializer(serializers.ModelSerializer):
        """Cause Output Serializer."""

        class Meta:  # noqa
            model = Cause
            fields = ["id", "name", "description", "icon"]

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["POST"]:
            return self.CauseInputSerializer
        return self.CauseOutputSerializer

    def get_permissions(self):
        """Get permissions by action."""
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminUser()]

    @extend_schema(responses={200: CauseOutputSerializer})
    def list(self, request, *args, **kwargs):  # noqa
        queryset = cause_list()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.CauseOutputSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.CauseOutputSerializer(queryset, many=True)
        return Response(serializer.data)


@extend_schema_serializer(component_name="CauseRetrieveUpdateAPI")
class CauseRetrieveUpdateAPI(RetrieveUpdateAPIView):
    """Retrieve, Update, and Destroy View for Cause."""

    queryset = cause_list()
    lookup_url_kwarg = "cause_id"

    def get_permissions(self):
        """Get permissions by action."""
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminUser()]

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["PATCH", "PUT"]:
            return CauseListCreateAPI.CauseInputSerializer
        return CauseListCreateAPI.CauseOutputSerializer

    @extend_schema(responses={200: CauseListCreateAPI.CauseOutputSerializer})
    def get(self, request, cause_id):  # noqa
        cause = cause_get(cause_id)

        if not cause:
            raise Http404

        data = CauseListCreateAPI.CauseOutputSerializer(cause).data

        return Response(data)


@extend_schema_serializer(component_name="ProjectListCreateAPI")
class ProjectListCreateAPI(ListCreateAPIView):
    """List & Create View for Project."""

    queryset = project_list()

    class ProjectInputSerializer(serializers.ModelSerializer):
        """Project Input Serializer."""

        causes = serializers.SlugRelatedField(
            queryset=Cause.objects.all(),
            slug_field="name",  # Accepts cause names instead of pks
            many=True,
            required=False,
        )

        class Meta:  # noqa
            model = Project
            fields = [
                "name",
                "img",
                "causes",
                "target",
                "campaign_limit",
                "city",
                "country",
                "description",
                "status",
            ]

        def create(self, validated_data):
            """Ensure causes exist before creating a project."""
            return project_create(**validated_data)

        def update(self, instance, validated_data):  # noqa
            return project_update(project=instance, data=validated_data)

    class ProjectOutputSerializer(serializers.ModelSerializer):
        """Project Output Serializer."""

        donation_percentage = serializers.SerializerMethodField()

        class Meta:  # noqa
            model = Project
            fields = [
                "id",
                "name",
                "img",
                "causes",  # Read-only
                "target",
                "campaign_limit",
                "city",
                "country",
                "description",
                "status",
                "donation_percentage",
            ]

        def get_donation_percentage(self, project) -> int:  # noqa
            return project_donations_total_percentage(project)

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["POST"]:
            return self.ProjectInputSerializer
        return self.ProjectOutputSerializer

    def get_permissions(self):
        """Get permissions by action."""
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminUser()]

    @extend_schema(responses={200: ProjectOutputSerializer})
    def list(self, request, *args, **kwargs):  # noqa
        queryset = project_list()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.ProjectOutputSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.ProjectOutputSerializer(queryset, many=True)
        return Response(serializer.data)


@extend_schema_serializer(component_name="ProjectRetrieveUpdateDestroyAPI")
class ProjectRetrieveUpdateDestroyAPI(RetrieveUpdateDestroyAPIView):
    """Retrieve, Update, and Destroy View for Project."""

    queryset = project_list()
    lookup_url_kwarg = "project_id"

    def get_permissions(self):
        """Get permissions by action."""
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminUser()]

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["PATCH", "PUT"]:
            return ProjectListCreateAPI.ProjectInputSerializer
        return ProjectListCreateAPI.ProjectOutputSerializer

    @extend_schema(responses={200: ProjectListCreateAPI.ProjectOutputSerializer})
    def get(self, request, project_id):  # noqa
        project = project_get(project_id)

        if not project:
            raise Http404

        data = ProjectListCreateAPI.ProjectOutputSerializer(project).data

        return Response(data)


@extend_schema_serializer(component_name="ProjectBeneficiaryListAPI")
class ProjectBeneficiaryListAPI(ListAPIView):
    """List all beneficiaries for a given Project."""

    serializer_class = ProjectAssignmentSerializer

    def get_queryset(self):  # noqa
        project_id = self.kwargs["project_id"]
        return project_beneficiary_list(project_id)


@extend_schema_serializer(component_name="AssignBeneficiaryAPI")
class AssignBeneficiaryAPI(BeneficiaryResolutionMixin, APIView):
    """Assign a User or UserGroup to a Project."""

    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @extend_schema(
        request=ProjectAssignmentSerializer,
        responses={
            201: OpenApiResponse(description="Beneficiary assigned successfully."),
            200: OpenApiResponse(description="Beneficiary already assigned."),
            400: OpenApiResponse(description="Validation error."),
        },
    )
    def post(self, request, project_id):
        """Create project assignment for beneficiary."""
        project = self.get_project(project_id)
        serializer = ProjectAssignmentSerializer(data=request.data)

        if serializer.is_valid():
            beneficiary = self.get_beneficiary(
                assignable_type=serializer.validated_data["assignable_type"],
                assignable_id=serializer.validated_data["assignable_id"],
            )
            assignment, created = assign_beneficiary(project=project, beneficiary=beneficiary)

            return Response(
                {"message": ("Beneficiary assigned successfully." if created else "Beneficiary already assigned.")},
                status=(status.HTTP_201_CREATED if created else status.HTTP_200_OK),
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_serializer(component_name="UnassignBeneficiaryAPI")
class UnassignBeneficiaryAPI(BeneficiaryResolutionMixin, APIView):
    """Unassign a User or UserGroup from a Project."""

    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @extend_schema(
        request=ProjectAssignmentSerializer,
        responses={
            204: OpenApiResponse(description="Beneficiary unassigned successfully."),
            400: OpenApiResponse(description="No assignment found or validation error."),
        },
    )
    def delete(self, request, project_id):
        """Delete project assignment for beneficiary."""
        project = self.get_project(project_id)
        serializer = ProjectAssignmentSerializer(data=request.data)

        if serializer.is_valid():
            beneficiary = self.get_beneficiary(
                assignable_type=serializer.validated_data["assignable_type"],
                assignable_id=serializer.validated_data["assignable_id"],
            )
            deleted = unassign_beneficiary(project=project, beneficiary=beneficiary)

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
