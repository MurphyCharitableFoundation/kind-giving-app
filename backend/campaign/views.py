"""Campaign views."""

from django.http import Http404
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_serializer
from rest_framework import permissions, serializers, status
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from campaign.models import Campaign, Comment
from campaign.selectors import (
    campaign_comments as campaign_comments_get,
)
from campaign.selectors import (
    campaign_get,
    campaign_list,
    comment_get,
    comment_list,
)
from campaign.services import (
    campaign_create,
    campaign_update,
    comment_create,
    comment_update,
)


@extend_schema_serializer(component_name="CampaignListCreate")
class CampaignListCreateAPI(ListCreateAPIView):
    """Campaign List Create API."""

    class InputSerializer(serializers.ModelSerializer):
        """Campaign Create Input Serializer."""

        class Meta:  # noqa
            model = Campaign
            fields = [
                "title",
                "description",
                "target",
                "project",
                "owner",
            ]

    class OutputSerializer(serializers.ModelSerializer):
        """Campaign List Create Output Serializer."""

        class Meta:  # noqa
            model = Campaign
            fields = (
                "id",
                "title",
                "description",
                "target",
                "project",
                "end_date",
            )

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["POST"]:
            return self.InputSerializer
        return self.OutputSerializer

    @extend_schema(responses={200: OutputSerializer})
    def list(self, request, *args, **kwargs):  # noqa
        queryset = campaign_list()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.OutputSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.OutputSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=InputSerializer,
        responses={201: OutputSerializer},
    )
    def post(self, request):  # noqa
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        c = campaign_create(**serializer.validated_data)

        data = self.OutputSerializer(c).data

        return Response(data)

    def get_permissions(self):
        """Get permissions by action."""
        return [permissions.AllowAny()]


@extend_schema_serializer(component_name="CampaignRetrieveUpdateDestroy")
class CampaignRetrieveUpdateDestroyAPI(RetrieveUpdateDestroyAPIView):
    """Campaign Retrieve Update Destroy API."""

    queryset = campaign_list()
    lookup_url_kwarg = "campaign_id"

    class UpdateSerializer(serializers.ModelSerializer):
        """Campaign Update Serializer."""

        class Meta:  # noqa
            model = Campaign
            fields = ["title", "description", "target", "end_date"]
            extra_kwargs = {
                "title": {"required": False},
                "description": {"required": False},
                "target": {"required": False},
                "end_date": {"required": False},
            }

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["PATCH", "PUT"]:
            return self.UpdateSerializer
        return CampaignListCreateAPI.OutputSerializer

    @extend_schema(responses={200: CampaignListCreateAPI.OutputSerializer})
    def get(self, request, campaign_id):  # noqa
        campaign = campaign_get(campaign_id)

        if not campaign:
            raise Http404

        data = CampaignListCreateAPI.OutputSerializer(campaign).data

        return Response(data)

    def update(self, request, *args, **kwargs):  # noqa
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.UpdateSerializer(
            instance,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)

        updated_instance = campaign_update(campaign=instance, data=serializer.validated_data)

        output_serializer = self.get_serializer(updated_instance)
        return Response(output_serializer.data, status=status.HTTP_200_OK)


@extend_schema_serializer(component_name="CommentListCreate")
class CommentListCreateAPI(APIView):
    """Comment List API."""

    class InputSerializer(serializers.ModelSerializer):
        """Comment Create Input Serializer."""

        class Meta:  # noqa
            model = Comment
            fields = (
                "content",
                "campaign",
                "author",
                "parent",
                "created",
            )

    class OutputSerializer(serializers.ModelSerializer):
        """Comment List Output Serializer."""

        class Meta:  # noqa
            model = Comment
            fields = (
                "id",
                "content",
                "campaign",
                "author",
                "parent",
                "created",
            )

    @extend_schema(responses={200: OutputSerializer})
    def list(self, request, *args, **kwargs):  # noqa
        queryset = comment_list()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.OutputSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.OutputSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=InputSerializer,
        responses={201: OutputSerializer},
    )
    def post(self, request):  # noqa
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        c = comment_create(**serializer.validated_data)

        data = self.OutputSerializer(c).data

        return Response(data)

    def get_permissions(self):
        """Get permissions by action."""
        return [permissions.AllowAny()]


@extend_schema_serializer(component_name="CommentRetrieveUpdateDestroy")
class CommentRetrieveUpdateDestroyAPI(RetrieveUpdateDestroyAPIView):
    """Comment Detail API."""

    queryset = comment_list()
    lookup_url_kwarg = "comment_id"

    class UpdateSerializer(serializers.ModelSerializer):
        """Comment Update Serializer."""

        class Meta:  # noqa
            model = Comment
            fields = ["content", "campaign", "author", "parent"]
            extra_kwargs = {
                "content": {"required": False},
                "campaign": {"required": False},
                "author": {"required": False},
                "parent": {"required": False},
            }

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["PATCH", "PUT"]:
            return self.UpdateSerializer
        return CommentListCreateAPI.OutputSerializer

    def update(self, request, *args, **kwargs):  # noqa
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.UpdateSerializer(
            instance,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)

        updated_instance = comment_update(comment=instance, data=serializer.validated_data)

        output_serializer = self.get_serializer(updated_instance)
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses={200: CommentListCreateAPI.OutputSerializer})
    def get(self, request, comment_id):  # noqa
        comment = comment_get(comment_id)

        if not comment:
            raise Http404

        data = CommentListCreateAPI.OutputSerializer(comment).data

        return Response(data)


@extend_schema(responses={200: CommentListCreateAPI.OutputSerializer(many=True)})
@api_view(["GET"])
def campaign_comments(request, campaign_id) -> Response:
    """Retrieve comments of campaign by campaign-id."""
    campaign = get_object_or_404(Campaign, id=campaign_id)
    serializer = CommentListCreateAPI.OutputSerializer(campaign_comments_get(campaign), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
