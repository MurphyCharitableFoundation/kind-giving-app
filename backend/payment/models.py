"""Payment models."""

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.money import Money
from model_utils.models import TimeStampedModel


class Payment(TimeStampedModel):
    """Represent a Payment from a number of 3rd Party Platforms."""

    class Status(models.TextChoices):
        """Status choices."""

        PENDING = "PENDING", _("Pending")  # Payment not yet processed
        COMPLETED = "COMPLETED", _("Completed")
        FAILED = "FAILED", _("Failed")  # Payment attempt failed
        REFUNDED = "REFUNDED", _("Refunded")  # Payment was refunded
        CANCELED = "CANCELLED", _("Cancelled")
        ON_HOLD = "ON_HOLD", _("On Hold")
        CHARGEBACK = "CHARGEBACK", _("Chargeback")  # Disputed payment

    class Platforms(models.TextChoices):
        """Platform choices."""

        PAYPAL = "PAYPAL", "PayPal"
        STRIPE = "STRIPE", "Stripe"
        OTHER = "OTHER", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
        help_text="The user who initiated the payment.",
    )
    platform = models.CharField(
        max_length=20,
        default=Platforms.PAYPAL,
        choices=Platforms.choices,
        help_text="The external payment platform used.",
    )
    gateway_payment_id = models.CharField(max_length=255, unique=True)
    amount = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency="USD",
        validators=[MinValueValidator(Money(0.01, "USD"))],
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        help_text="The status of the payment.",
    )

    class Meta:  # noqa
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ["-created"]

    def __str__(self):  # noqa
        return "Payment: %s payment by %s - %s" % (
            self.platform,
            self.user,
            self.gateway_payment_id,
        )
