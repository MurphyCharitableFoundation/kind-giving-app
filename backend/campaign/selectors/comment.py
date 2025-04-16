"""Comment selectors."""

from typing import Optional

from django.db.models.query import QuerySet

from campaign.filters import CommentFilter
from campaign.models import Comment
from core.utils import get_object


def comment_get(comment_id: int) -> Optional[Comment]:
    """Retrieve comment."""
    c = get_object(Comment, id=comment_id)

    return c


# TODO: filtering untested
def comment_list(*, filters=None) -> QuerySet[Comment]:
    """Retrieve comments."""
    filters = filters or {}
    qs = Comment.objects.all()
    return CommentFilter(filters, qs).qs


def comment_is_reply(comment: Comment) -> bool:
    """Comment is a reply."""
    return comment.parent is not None
