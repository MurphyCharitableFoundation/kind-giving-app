"""ProjectAssignment services."""

from typing import Optional, Tuple, Union

from django.apps import apps
from django.db import transaction

from project.models import Project, ProjectAssignment
from user.models import User, UserGroup

Beneficiary = Union[User, UserGroup]
BENEFICIARY_MODEL_MAP = {
    "User": User,
    "UserGroup": apps.get_model("user", "UserGroup"),
}


def _parse_beneficiary(beneficiary: Beneficiary) -> Tuple[str, int]:
    """Deduce the assignable_type and assignable_id for a beneficiary."""
    for key, model_class in BENEFICIARY_MODEL_MAP.items():
        if isinstance(beneficiary, model_class):
            return key, beneficiary.pk
    raise ValueError(f"Beneficiary must be an instance of {BENEFICIARY_MODEL_MAP.keys()}.")


@transaction.atomic
def assign_beneficiary(
    project: Project,
    beneficiary: Beneficiary,
) -> Tuple[ProjectAssignment, bool]:
    """Assign a beneficiary to a project."""
    assignable_type, assignable_id = _parse_beneficiary(beneficiary)
    return ProjectAssignment.objects.get_or_create(
        project=project,
        assignable_type=assignable_type,
        assignable_id=assignable_id,
    )


@transaction.atomic
def unassign_beneficiary(
    project: Project,
    beneficiary: Beneficiary,
) -> bool:
    """Remove an assignment for a project and beneficiary."""
    assignable_type, assignable_id = _parse_beneficiary(beneficiary)
    qs = ProjectAssignment.objects.filter(
        project=project,
        assignable_type=assignable_type,
        assignable_id=assignable_id,
    )
    deleted, _ = qs.delete()
    return deleted > 0


@transaction.atomic
def reassign_beneficiary(
    *,
    project: Project,
    old_beneficiary: Beneficiary,
    new_beneficiary: Beneficiary,
) -> Optional[ProjectAssignment]:
    """Reassign a project from one beneficiary to another."""
    old_type, old_id = _parse_beneficiary(old_beneficiary)
    new_type, new_id = _parse_beneficiary(new_beneficiary)

    try:
        assignment = ProjectAssignment.objects.get(
            project=project,
            assignable_type=old_type,
            assignable_id=old_id,
        )
        assignment.assignable_type = new_type
        assignment.assignable_id = new_id
        assignment.full_clean()
        assignment.save()
        return assignment
    except ProjectAssignment.DoesNotExist:
        return None
