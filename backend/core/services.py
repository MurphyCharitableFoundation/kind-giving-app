"""Core services."""

from decimal import Decimal
from typing import Any, Dict, List, Tuple, Union

from django.db import models
from djmoney.money import Money
from typing_extensions import TypeAlias

from .types import DjangoModelType

Amount: TypeAlias = Union[Decimal, int, float, Money]


def to_money(amount: Amount) -> Money:
    """Convert amount to Money if possible or raise ValueError."""
    CURRENCY = "USD"

    if isinstance(amount, (Decimal, int, float)):
        return Money(amount, CURRENCY)
    elif isinstance(amount, Money):
        return amount
    else:
        raise ValueError(f"Invalid type for amount: {type(amount)}")


def model_update(
    *,
    instance: DjangoModelType,
    fields: List[str],
    data: Dict[str, Any],
) -> Tuple[DjangoModelType, bool]:
    """
    Update service to be reused in local update services.

    For example:

    def user_update(*, user: User, data) -> User:
        fields = ['first_name', 'last_name']
        user, has_updated = model_update(instance=user, fields=fields, data=data)

        // Do other actions with the user here

        return user

    Return value: Tuple with the following elements:
        1. The instance we updated.
        2. A boolean value representing whether we performed an update or not.

    Some important notes:

    - Only keys present in `fields` will be taken from `data`.
    - If something is present in `fields` but not present in `data`,
      we simply skip.
    - There's a strict assertion that all values in `fields` are
      actual fields in `instance`.
    - `fields` can support m2m fields, which are handled after the
      update on `instance`.
    """
    has_updated = False
    m2m_data = {}
    update_fields = []

    model_fields = {field.name: field for field in instance._meta.get_fields()}

    for field in fields:
        # Skip if a field is not present in the actual data
        if field not in data:
            continue

        # If field is not an actual model field, raise an error
        model_field = model_fields.get(field)

        assert model_field is not None, f"{field} is not part of {instance.__class__.__name__} fields."

        # If we have m2m field, handle differently
        if isinstance(model_field, models.ManyToManyField):
            m2m_data[field] = data[field]
            continue

        if getattr(instance, field) != data[field]:
            has_updated = True
            update_fields.append(field)
            setattr(instance, field, data[field])

    # Perform an update only if any of the fields were actually changed
    if has_updated:
        instance.full_clean()
        # Update only the fields that are meant to be updated.
        # Django docs reference:
        # https://docs.djangoproject.com/en/dev/ref/models/instances/#specifying-which-fields-to-save
        instance.save(update_fields=update_fields)

    for field_name, value in m2m_data.items():
        related_manager = getattr(instance, field_name)
        related_manager.set(value)

        # Still not sure about this.
        # What if we only update m2m relations & nothing on the model?
        # Is this still considered as updated?
        has_updated = True

    return instance, has_updated
