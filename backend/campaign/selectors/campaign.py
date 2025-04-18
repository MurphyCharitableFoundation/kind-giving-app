"""Campaign selectors."""

from typing import Optional

from django.db.models.query import QuerySet

from campaign.filters import CampaignFilter
from campaign.models import Campaign, Comment
from core.utils import get_object
from donation.models import Donation


def campaign_get(campaign_id: int) -> Optional[Campaign]:
    """Retrieve campaign."""
    c = get_object(Campaign, id=campaign_id)

    return c


# TODO: filtering untested
def campaign_list(*, filters=None) -> QuerySet[Campaign]:
    """Retrieve campaigns."""
    filters = filters or {}
    qs = Campaign.objects.all()
    return CampaignFilter(filters, qs).qs


def campaign_donations(campaign: Campaign) -> QuerySet[Donation]:
    """Retrieve donations for a given Campaign."""
    return Donation.objects.filter(campaign=campaign)


def campaign_comments(
    campaign: Campaign,
    include_replies=False,
) -> QuerySet[Comment]:
    """Retrieve comments for a given Campaign."""
    if include_replies:
        return campaign.comments.all()
    return campaign.comments.filter(parent__isnull=True)
