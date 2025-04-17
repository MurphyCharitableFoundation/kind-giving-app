"""Cause selectors."""

from typing import Optional

from django.db.models.query import QuerySet

from core.utils import get_object
from project.filters import CauseFilter
from project.models import Cause


def cause_get(cause_id: int) -> Optional[Cause]:
    """Retrieve cause."""
    c = get_object(Cause, id=cause_id)

    return c


def cause_list(*, filters=None) -> QuerySet[Cause]:
    """Retrieve causes."""
    filters = filters or {}
    qs = Cause.objects.all()
    return CauseFilter(filters, qs).qs
