"""Campaign views."""

from rest_framework import viewsets, permissions
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
