"""Donation models."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from model_utils.models import TimeStampedModel

from core.services import to_money

User = get_user_model()


class Donation(TimeStampedModel):
    """Represent a donation that has been made to a campaign."""

    donor = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        help_text="Donor user who made the donation",
    )
    amount = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency="USD",
        currency_choices=[("USD", "USD")],
        help_text="Amount of money donated",
        validators=[MinMoneyValidator({"USD": 0.01})],
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Description of the donation",
    )
    campaign = models.ForeignKey(
        "campaign.Campaign",
        on_delete=models.CASCADE,
        help_text="Campaign supported by donation.",
        related_name="donations",
    )
    payment = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Reference of the payment transaction from PayPal/Stripe",
    )

    def __str__(self):
        """Represent Donation as string."""
        return f"Donation: {self.amount} USD by {self.donor.email}."

    def clean(self):
        """
        Validate model data before saving.

        Ensure to use services, so that validation is performed.
        """
        if self.donor.groups.filter(name="beneficiary").exists():
            raise ValidationError({"donor": "Donor cannot be a beneficiary."})

        if self.amount <= to_money(0):
            raise ValidationError({"amount": "Amount cannot be negative or zero."})
