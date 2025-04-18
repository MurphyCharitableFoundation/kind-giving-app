"""Project services."""

from typing import Iterable, List, Optional, Union

from django.core.files.uploadedfile import UploadedFile
from django.db import transaction

from core.services import Amount, model_update, to_money
from project.models import Cause, Project

from .cause import causes_resolve


@transaction.atomic
def project_create(
    *,
    name: str,
    target: Amount,
    city: str,
    country: str,
    status: str = Project.StatusChoices.DRAFT,
    description: str = "",
    img: Optional[UploadedFile] = None,
    causes: Optional[Iterable[Union[Cause, str]]] = None,
    campaign_limit: Optional[int] = None,
) -> Project:
    """Create Project with optional image and causes."""
    project = Project(
        name=name,
        target=to_money(target),
        city=city,
        country=country,
        status=status,
        description=description,
        img=img,
        campaign_limit=campaign_limit,
    )

    project.full_clean()
    project.save()

    if causes:
        project.causes.set(causes_resolve(causes))

    return project


@transaction.atomic
def project_update(*, project: Project, data) -> Project:
    """Update Project."""
    non_side_effect_fields: List[str] = [
        "name",
        "img",
        "causes",
        "status",
        "target",
        "campaign_limit",
        "description",
        "city",
        "country",
    ]

    project, has_updated = model_update(instance=project, fields=non_side_effect_fields, data=data)

    return project
