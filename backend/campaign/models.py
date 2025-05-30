"""Campaign models."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from model_utils.models import TimeStampedModel

User = get_user_model()


# TODO:
# what happens when Project is deleted?
class Campaign(TimeStampedModel):
    """Representation of Campaign."""

    title = models.CharField(max_length=255)
    description = models.TextField()
    target = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency="USD",
        validators=[MinMoneyValidator({"USD": 0.01})],
        help_text="Financial target (money) the project aims to raise.",
    )
    project = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE,
        related_name="campaigns",
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    end_date = models.DateTimeField(null=True, blank=True)
    img = models.ImageField(
        upload_to="campaigns/",
        blank=True,
        null=True,
        help_text="Optional main image representing the campaign.",
    )

    def __str__(self):
        """Represent Campaign as string."""
        return f"Campaign: {self.title}"

    def clean(self):
        """Validate model data before saving."""

        def _is_new_campaign():
            return self.pk is None

        if _is_new_campaign():
            if Campaign.objects.filter(project=self.project, owner=self.owner).exists():
                raise ValueError("User already has a campaign for given project.")

            if self.project.campaign_limit:
                if self.project.campaigns.count() >= self.project.campaign_limit:
                    raise ValidationError("Project already has enough campaigns.")

    class Meta:  # noqa
        ordering = ["-created"]


class Comment(TimeStampedModel):
    """Representation of a comment."""

    content = models.TextField()
    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies",
    )

    def __str__(self):
        """Represent Comment as string."""
        return f"Comment: {self.content[:30]}"

    class Meta:  # noqa
        ordering = ["-created"]
