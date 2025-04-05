"""Campaign views."""

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from campaign.models import Campaign, Comment
from campaign.serializers import CampaignSerializer, CommentSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    """Campaign views."""

    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentViewSet(viewsets.ModelViewSet):
    """Comment views."""

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(responses={200: CommentSerializer(many=True)})
@api_view(["GET"])
def campaign_comments(request, campaign_id) -> Response:
    """Retrieve comments of campaign by campaign-id."""
    campaign = get_object_or_404(Campaign, id=campaign_id)
    serializer = CommentSerializer(campaign.comments.all(), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
