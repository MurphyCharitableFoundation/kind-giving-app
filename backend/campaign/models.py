"""Campaign models."""

from django.contrib.auth import get_user_model
from django.db import models
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from djmoney.money import Money
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
    project = models.ForeignKey("project.Project", on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        """Represent Campaign as string."""
        return f"Campaign: {self.title}"

    @classmethod
    def create_campaign(cls, title, project, owner, target, **extra_fields):
        """
        Create a campaign for a project by an owner.

        - Prevents a user from having multiple campaigns in the same project.
        - Extra fields like `end_date` and `description` can
        be passed via `**extra_fields`.

        Returns (campaign, created), where 'created' is
        True if a new instance was created.
        Raises ValueError if the user already has a campaign for the project.
        """
        if cls.objects.filter(project=project, owner=owner).exists():
            raise ValueError("User already has a campaign for given project.")

        campaign, created = cls.objects.get_or_create(
            title=title,
            project=project,
            owner=owner,
            defaults={
                "target": (target if isinstance(target, Money) else Money(target, "USD")),
                **extra_fields,
            },
        )
        return campaign, created

    class Meta:
        unique_together = ("project", "owner")


class Comment(TimeStampedModel):
    """Representation of a comment."""

    content = models.TextField()
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
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

    def is_reply(self):
        """Return True if this comment is a reply to another comment."""
        return self.parent is not None

    @classmethod
    def create_comment(cls, content, campaign, author, parent=None):
        """
        Add a comment to a campaign.

        Optionally as a reply to another comment.
        Returns the created comment instance.
        """
        comment = cls.objects.create(campaign=campaign, author=author, content=content, parent=parent)
        return comment

    @classmethod
    def get_comments(cls, campaign, include_replies=False):
        """
        Retrieve all comments for a given campaign.

        If `top_level_only=True`, only return parent comments (no replies).
        """
        if include_replies:
            return cls.objects.filter(campaign=campaign)
        return cls.objects.filter(campaign=campaign, parent__isnull=True)
