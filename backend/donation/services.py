"""Donation services."""

from typing import Optional

from django.contrib.auth import get_user_model
from django.db import transaction

from campaign.models import Campaign
from core.services import Amount, to_money

from .models import Donation

User = get_user_model()


@transaction.atomic
def create_donation(
    *,
    donor: User,
    amount: Amount,
    description: Optional[str] = None,
    campaign: Campaign,
) -> Donation:
    """Create Donation for Campaign."""
    amount = to_money(amount)
    donation = Donation(
        donor=donor,
        amount=amount,
        description=description,
        campaign=campaign,
    )
    donation.full_clean()
    donation.save()

    return donation
