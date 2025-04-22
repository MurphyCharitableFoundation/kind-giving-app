"""Cause services."""

from typing import Iterable, List, Optional, Union

from django.core.files.uploadedfile import UploadedFile
from django.db import transaction

from core.services import model_update
from project.models import Cause


@transaction.atomic
def cause_create(
    *,
    name: str,
    description: Optional[str] = None,
    icon: Optional[UploadedFile] = None,
) -> Cause:
    """Create Cause."""
    cause = Cause(
        name=name.lower(),
        description=description,
        icon=icon,
    )

    cause.full_clean()
    cause.save()

    return cause


@transaction.atomic
def causes_resolve(causes: Iterable[Union[Cause, str]]) -> List[Cause]:
    """Given a mix of Cause instances and names, return a Cause instances."""
    resolved = []
    new_causes = []

    def resolve(cause: Union[Cause, str]) -> None:
        if isinstance(cause, Cause):
            resolved.append(cause)
        else:
            cause = cause.lower()
            existing = Cause.objects.filter(name=cause).first()
            if existing:
                resolved.append(existing)
            else:
                new_cause = Cause(name=cause)
                new_cause.full_clean()
                new_causes.append(new_cause)

    for cause in causes:
        resolve(cause)

    if new_causes:
        Cause.objects.bulk_create(new_causes, batch_size=50)
        resolved.extend(new_causes)

    return resolved


@transaction.atomic
def cause_update(*, cause: Cause, data) -> Cause:
    """Update Cause."""
    non_side_effect_fields: List[str] = [
        "name",
        "description",
        "icon",
    ]

    cause, has_updated = model_update(instance=cause, fields=non_side_effect_fields, data=data)

    return cause
