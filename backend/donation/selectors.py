"""Donation selectors."""

from typing import Optional

from django.db.models.query import QuerySet

from core.utils import get_object

from .filters import DonationFilter
from .models import Donation


def donation_get(donation_id) -> Optional[Donation]:
    """Retrieve donation."""
    donation = get_object(Donation, id=donation_id)

    return donation


# TODO: filtering untested
def donation_list(*, filters=None) -> QuerySet[Donation]:
    """Retrieve donation."""
    filters = filters or {}
    qs = Donation.objects.all()
    return DonationFilter(filters, qs).qs
