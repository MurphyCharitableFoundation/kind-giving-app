# Generated by Django 4.2.19 on 2025-02-25 00:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import djmoney.models.fields
import djmoney.models.validators
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Donation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "amount_currency",
                    djmoney.models.fields.CurrencyField(
                        choices=[("USD", "USD")],
                        default="USD",
                        editable=False,
                        max_length=3,
                    ),
                ),
                (
                    "amount",
                    djmoney.models.fields.MoneyField(
                        currency_choices=[("USD", "USD")],
                        decimal_places=2,
                        default_currency="USD",
                        help_text="Amount of money donated",
                        max_digits=14,
                        validators=[
                            djmoney.models.validators.MinMoneyValidator({"USD": 0.01})
                        ],
                    ),
                ),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        help_text="Description of the donation",
                        max_length=255,
                        null=True,
                    ),
                ),
                (
                    "campaign",
                    models.PositiveIntegerField(
                        help_text="Primary key of the campaign being donated to."
                    ),
                ),
                (
                    "payment",
                    models.CharField(
                        blank=True,
                        help_text="Reference of the payment transaction from PayPal/Stripe",
                        max_length=255,
                        null=True,
                    ),
                ),
                (
                    "donor",
                    models.ForeignKey(
                        help_text="Donor user who made the donation",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
