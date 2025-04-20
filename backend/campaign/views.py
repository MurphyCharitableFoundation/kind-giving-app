"""Campaign views."""

from django.http import Http404
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_serializer
from rest_framework import permissions, serializers, status
from rest_framework.decorators import api_view
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response

from campaign.models import Campaign, Comment
from campaign.selectors import (
    campaign_comments as campaign_comments_get,
)
from campaign.selectors import (
    campaign_donations,
    campaign_donations_total,
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

    class CampaignInputSerializer(serializers.ModelSerializer):
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

        def create(self, validated_data):  # noqa
            return campaign_create(**validated_data)

        def update(self, instance, validated_data):  # noqa
            return campaign_update(campaign=instance, data=validated_data)

    class CampaignOutputSerializer(serializers.ModelSerializer):
        """Campaign List Create Output Serializer."""

        donations_count = serializers.SerializerMethodField()
        donations_total = serializers.SerializerMethodField()

        class Meta:  # noqa
            model = Campaign
            fields = (
                "id",
                "title",
                "description",
                "target",
                "project",
                "end_date",
                "donations_count",
                "donations_total",
            )

        def get_donations_count(self, campaign):  # noqa
            return campaign_donations(campaign).count()

        def get_donations_total(self, campaign):  # noqa
            total = campaign_donations_total(campaign)
            return {"amount": str(total.amount), "currency": str(total.currency)}

    def get_permissions(self):
        """Get permissions by action."""
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["POST"]:
            return self.CampaignInputSerializer
        return self.CampaignOutputSerializer


@extend_schema_serializer(component_name="CampaignRetrieveUpdateDestroy")
class CampaignRetrieveUpdateDestroyAPI(RetrieveUpdateDestroyAPIView):
    """Campaign Retrieve Update Destroy API."""

    queryset = campaign_list()
    lookup_url_kwarg = "campaign_id"

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["PATCH", "PUT"]:
            return CampaignListCreateAPI.CampaignInputSerializer
        return CampaignListCreateAPI.CampaignOutputSerializer

    @extend_schema(responses={200: CampaignListCreateAPI.CampaignOutputSerializer})
    def get(self, request, campaign_id):  # noqa
        campaign = campaign_get(campaign_id)

        if not campaign:
            raise Http404

        data = CampaignListCreateAPI.CampaignOutputSerializer(campaign).data

        return Response(data)


@extend_schema_serializer(component_name="CommentListCreate")
class CommentListCreateAPI(ListCreateAPIView):
    """Comment List Create API."""

    class CommentInputSerializer(serializers.ModelSerializer):
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

        def create(self, validated_data):  # noqa
            return comment_create(**validated_data)

        def update(self, instance, validated_data):  # noqa
            return comment_update(comment=instance, data=validated_data)

    class CommentOutputSerializer(serializers.ModelSerializer):
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

    def get_permissions(self):
        """Get permissions by action."""
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["POST"]:
            return self.CommentInputSerializer
        return self.CommentOutputSerializer


@extend_schema_serializer(component_name="CommentRetrieveUpdateDestroy")
class CommentRetrieveUpdateDestroyAPI(RetrieveUpdateDestroyAPIView):
    """Comment Detail API."""

    queryset = comment_list()
    lookup_url_kwarg = "comment_id"

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["PATCH", "PUT"]:
            return CommentListCreateAPI.CommentInputSerializer
        return CommentListCreateAPI.CommentOutputSerializer

    @extend_schema(responses={200: CommentListCreateAPI.CommentOutputSerializer})
    def get(self, request, comment_id):  # noqa
        comment = comment_get(comment_id)

        if not comment:
            raise Http404

        data = CommentListCreateAPI.CommentOutputSerializer(comment).data

        return Response(data)


@extend_schema(responses={200: CommentListCreateAPI.CommentOutputSerializer(many=True)})
@api_view(["GET"])
def campaign_comments(request, campaign_id) -> Response:
    """Retrieve comments of campaign by campaign-id."""
    campaign = get_object_or_404(Campaign, id=campaign_id)
    serializer = CommentListCreateAPI.CommentOutputSerializer(campaign_comments_get(campaign), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
