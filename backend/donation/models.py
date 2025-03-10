"""Donation models."""

from django.contrib.auth import get_user_model
from django.db import models
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from djmoney.money import Money
from model_utils.models import TimeStampedModel

User = get_user_model()


class Donation(TimeStampedModel):
    """
    Represent a donation that has been made to a campaign.
    *campaign will be adjusted to a foreign key type as soon as the Campaign app is created.
    """

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

    @classmethod
    def create_donation(cls, donor, amount, description, campaign):
        """
        Create a donation with a given donor, amount, description and campaign.
        Also ensure amount is Money Instance and > 0
        """
        if not isinstance(amount, Money):
            amount = Money(amount, "USD")

        if amount.amount <= 0:
            raise ValueError("Donation amount must be positive.")

        donation = cls.objects.create(
            donor=donor,
            amount=amount,
            description=description,
            campaign=campaign,
        )
        return donation

    @classmethod
    def retrieve_donations(cls, campaign):
        """Retrieve all donations for a given campaign."""
        return cls.objects.filter(campaign=campaign)
