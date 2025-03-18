"""Donation selectors."""

from django.db.models import QuerySet

from campaign.models import Campaign

from .models import Donation


def campaign_donations(campaign: Campaign) -> QuerySet[Donation]:
    """Retrieve donations for a given Campaign."""
    return Donation.objects.filter(campaign=campaign)
