"""Project models."""

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from model_utils.models import TimeStampedModel

User = get_user_model()


class Cause(models.Model):
    """
    Represents a cause or category to which a project can belong.

    For example: 'Education', 'Environment', 'Healthcare', etc.
    """

    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Human-readable name of the cause.",
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Longer explanation of the cause.",
    )
    icon = models.ImageField(
        upload_to="causes/",
        blank=True,
        null=True,
        help_text="Optional image or icon representing the cause.",
    )

    def __str__(self):
        """Represent Cause as string."""
        return f"Cause: {self.name}"

    def save(self, *args, **kwargs):
        """
        Save.

        Ensure name is always lowercase.
        """
        if self.name:
            self.name = self.name.lower()
        super().save(*args, **kwargs)


class Project(TimeStampedModel):
    """Represents a fundraising or campaign project."""

    class StatusChoices(models.TextChoices):
        """Represents status choices for a project."""

        DRAFT = "draft", _("Draft")
        ACTIVE = "active", _("Active")
        FUNDED = "funded", _("Funded")
        EXPIRED = "expired", _("Expired")
        CANCELLED = "cancelled", _("Cancelled")

    name = models.CharField(
        max_length=255,
        help_text="Short name or title of the project.",
    )
    img = models.ImageField(
        upload_to="projects/",
        blank=True,
        null=True,
        help_text="Optional main image representing the project.",
    )
    causes = models.ManyToManyField(
        Cause,
        related_name="projects",
        blank=True,
        help_text="One or more causes that this project addresses.",
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.DRAFT,
        help_text="Status of project, default is DRAFT.",
    )
    target = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency="USD",
        validators=[MinMoneyValidator({"USD": 0.01})],
        help_text="Financial target (money) the project aims to raise.",
    )
    campaign_limit = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Maximum number of campaigns or participants allowed.",
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Description of the project.",
    )
    city = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="City of the project.",
    )
    country = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Country of the project.",
    )

    def __str__(self):
        """Represent Project as string."""
        return f"Project: {self.name}"


class ProjectAssignment(models.Model):
    """
    Represent an assignment of a project to an entity.

    (e.g. a User or a UserGroup).

    The 'assignable_type' indicates the type of entity,
    and 'assignable_id' references its primary key.
    """

    ASSIGNABLE_TYPE_CHOICES = [
        ("User", "User"),
        ("UserGroup", "UserGroup"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="assignments",
        help_text="Project to which this assignment belongs.",
    )
    assignable_type = models.CharField(
        max_length=50,
        choices=ASSIGNABLE_TYPE_CHOICES,
        help_text="Whether this assignment is for a User or a UserGroup.",
    )
    assignable_id = models.PositiveIntegerField(help_text="Primary key of the assigned entity (User or UserGroup).")

    def __str__(self):
        """Represent ProjectAssignment as string."""
        return f"ProjectAssignment: '{self.project.name}'"
