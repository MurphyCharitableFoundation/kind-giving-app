"""Comment services."""

from typing import List, Optional

from django.contrib.auth import get_user_model
from django.db import transaction

from campaign.models import Campaign, Comment
from core.services import model_update

User = get_user_model()


@transaction.atomic
def comment_create(
    *,
    author: User,
    content: str,
    campaign: Campaign,
    parent: Optional[Comment] = None,
) -> Comment:
    """Create Comment."""
    comment = Comment(
        author=author,
        content=content,
        parent=parent,
        campaign=campaign,
    )

    comment.full_clean()
    comment.save()

    return comment


@transaction.atomic
def comment_update(*, comment: Comment, data) -> Comment:
    """Update Comment."""
    non_side_effect_fields: List[str] = [
        "content",
        "campaign",
        "author",
        "parent",
    ]

    c, has_updated = model_update(instance=comment, fields=non_side_effect_fields, data=data)

    return c
