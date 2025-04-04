"""User services."""

from typing import List, Optional

from django.db import transaction

from core.services import model_update

from .models import User, UserGroup


@transaction.atomic
def user_create(
    *,
    email: str,
    is_active: bool = True,
    is_staff: bool = False,
    is_group_leader: bool = False,
    phone_number: Optional[str] = None,
    password: Optional[str] = None,
) -> User:
    """Create User."""
    user = User.objects.create_user(
        email=email,
        is_active=is_active,
        is_staff=is_staff,
        phone_number=phone_number,
        password=password,
    )

    return user


@transaction.atomic
def user_update(*, user: User, data) -> User:
    """Update User."""
    non_side_effect_fields: List[str] = [
        # "first_name",
        # "last_name",
        # ---------
        # "email",
        # --- email is the User ID field, extra logic before changing;
        # e.g it must be unique.
        "phone_number",
        "img",
        "is_group_leader",
        "group_membership",
    ]
    user, has_updated = model_update(instance=user, fields=non_side_effect_fields, data=data)

    # side-effect fields update here
    # (e.g username is generated based on first & last name)

    return user


@transaction.atomic
def user_group_create(
    *,
    name: str,
    phone_number: Optional[str] = None,
    interest: Optional[str] = None,
) -> User:
    """Create UserGroup."""
    group = UserGroup(
        name=name,
        phone_number=phone_number,
        interest=interest,
    )

    group.full_clean()
    group.save()

    return group
