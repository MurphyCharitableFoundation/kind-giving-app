"""Campaign Views."""

from rest_framework import viewsets

from .models import Campaign
from .serializers import CampaignSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    """
    Campaign ViewSet.

    Includes list and detail GET, POST, PATCH, UPDATE & DELETE endpoints.
    """

    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
