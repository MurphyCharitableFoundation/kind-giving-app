"""Donation filters."""

import django_filters

from .models import Donation


class DonationFilter(django_filters.FilterSet):
    """Donation Filter."""

    class Meta:
        model = Donation
        fields = ("id", "donor", "amount", "description", "campaign")
