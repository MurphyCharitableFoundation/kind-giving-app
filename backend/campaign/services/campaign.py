"""Campaign services."""

from datetime import datetime
from typing import List, Optional

from django.contrib.auth import get_user_model
from django.db import transaction

from campaign.models import Campaign
from core.services import Amount, model_update, to_money
from project.models import Project

User = get_user_model()


@transaction.atomic
def campaign_create(
    *,
    title: str,
    description: str = "",
    project: Project,
    owner: User,
    target: Amount,
    end_date: Optional[datetime] = None,
) -> Campaign:
    """Create Campaign."""
    target = to_money(target)
    campaign = Campaign(
        title=title,
        project=project,
        description=description,
        owner=owner,
        target=target,
        end_date=end_date,
    )

    campaign.full_clean()
    campaign.save()

    return campaign


@transaction.atomic
def campaign_update(*, campaign: Campaign, data) -> Campaign:
    """Update Campaign."""
    non_side_effect_fields: List[str] = [
        "title",
        "description",
        "target",
        "project",
        "owner",
        "end_date",
    ]

    c, has_updated = model_update(instance=campaign, fields=non_side_effect_fields, data=data)

    return c
