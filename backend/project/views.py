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

from core.pagination import LimitOffsetPagination, get_paginated_response
from core.permissions import IsAdminUser

from .mixins import BeneficiaryResolutionMixin, PrefetchBeneficiaryMixin
from .models import Cause, Project
from .selectors import (
    cause_get,
    cause_list,
    project_beneficiary_list,
    project_campaigns,
    project_donations_total_percentage,
    project_get,
    project_list,
)
from .serializers import (
    BeneficiarySerializer,
    CampaignSerializer,
    ProjectAssignmentSerializer,
)
from .services import (
    assign_beneficiary,
    cause_create,
    cause_update,
    causes_resolve,
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

    class ProjectInputSerializer(serializers.ModelSerializer):
        """Project Input Serializer."""

        causes = serializers.SlugRelatedField(
            queryset=Cause.objects.all(),
            slug_field="name",  # Accepts cause names instead of pks
            many=True,
            required=False,
        )

        causes_names = serializers.ListField(
            child=serializers.CharField(),
            required=False,
            write_only=True,
        )

        class Meta:  # noqa
            model = Project
            fields = [
                "name",
                "img",
                "causes",
                "causes_names",
                "target",
                "campaign_limit",
                "city",
                "country",
                "description",
                "status",
            ]

            read_only_fields = ["causes"]

        def create(self, validated_data):  # noqa
            causes_names = validated_data.pop("causes_names", [])
            return project_create(causes=causes_names, **validated_data)

        def update(self, instance, validated_data):  # noqa
            causes_names = validated_data.pop("causes_names", None)

            instance = project_update(
                project=instance,
                data=validated_data,
            )

            if causes_names:
                causes_objects = causes_resolve(causes_names)
                instance.causes.set(causes_objects)

            return instance

    class ProjectOutputSerializer(serializers.ModelSerializer):
        """Project Output Serializer."""

        donation_percentage = serializers.SerializerMethodField()
        causes = CauseListCreateAPI.CauseOutputSerializer(
            many=True,
            read_only=True,
        )

        class Meta:  # noqa
            model = Project
            fields = [
                "id",
                "name",
                "img",
                "causes",
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

    class ProjectFilterSerializer(serializers.Serializer):  # noqa
        name = serializers.CharField(max_length=200, required=False)
        status = serializers.ChoiceField(
            choices=Project.StatusChoices,
            required=False,
        )
        city = serializers.CharField(max_length=200, required=False)
        country = serializers.CharField(max_length=200, required=False)

    class Pagination(LimitOffsetPagination):  # noqa
        pass

    queryset = project_list()
    pagination_class = Pagination

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

    def get(self, request, *args, **kwargs):  # noqa
        filters_serializer = self.ProjectFilterSerializer(
            data=request.query_params,
        )
        filters_serializer.is_valid(raise_exception=True)

        projects = project_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.pagination_class,
            serializer_class=self.ProjectOutputSerializer,
            queryset=projects,
            request=request,
            view=self,
        )


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


@extend_schema_serializer(component_name="ProjectCampaignListAPI")
class ProjectCampaignListAPI(ListAPIView):
    """List all campaigns for a given Project."""

    serializer_class = CampaignSerializer

    def get_queryset(self):  # noqa
        project_id = self.kwargs["project_id"]
        return project_campaigns(project_get(project_id))


@extend_schema_serializer(component_name="ProjectBeneficiaryListAPI")
class ProjectBeneficiaryListAPI(PrefetchBeneficiaryMixin, ListAPIView):
    """List all beneficiaries for a given Project."""

    serializer_class = BeneficiarySerializer

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
