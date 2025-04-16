"""Test Campaign models."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from djmoney.money import Money

from campaign.selectors import campaign_comments, comment_is_reply
from campaign.services import (
    campaign_create,
    comment_create,
)
from project.models import Project

User = get_user_model()


class CampaignModelTestCase(TestCase):
    """Test suite for the Campaign model."""

    def setUp(self):
        """Set up test data."""
        self.user_a = User.objects.create_user(email="a@example.com", password="password123")
        self.user_b = User.objects.create_user(email="b@example.com", password="password123")
        self.user_c = User.objects.create_user(email="c@example.com", password="password123")

        self.project, _ = Project.create_project(
            name="Project A",
            target=Money(10000, "USD"),
            campaign_limit=2,
        )

    def test_create_campaign_success(self):
        """Test creating a campaign successfully."""
        campaign = campaign_create(
            title="Education for All",
            description="Education for All",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user_a)
        self.assertEqual(campaign.target, Money(5000, "USD"))

    def test_campaign_with_integer_target(self):
        """Test that a Campaign can be created with an integer target."""
        campaign = campaign_create(
            title="Education for All",
            description="Education for All",
            project=self.project,
            owner=self.user_a,
            target=5000,
        )

        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user_a)
        self.assertEqual(campaign.target, Money(5000, "USD"))

    def test_campaign_with_float_target(self):
        """Test that a Campaign can be created with a float target."""
        campaign = campaign_create(
            title="Education for All",
            description="Education for All",
            project=self.project,
            owner=self.user_a,
            target=5000.50,
        )

        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user_a)
        self.assertEqual(campaign.target, Money(5000.50, "USD"))

    def test_campaign_with_money_object_target(self):
        """Test that a Campaign can be created with a Money-object target."""
        campaign = campaign_create(
            title="Education for All",
            description="Education for All",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user_a)
        self.assertEqual(campaign.target, Money(5000, "USD"))

    def test_create_duplicate_campaign_fails(self):
        """Test that a user cannot create multiple campaigns for the same project."""
        campaign_create(
            title="First Campaign",
            description="First",
            project=self.project,
            owner=self.user_a,
            target=Money(10000, "USD"),
        )

        with self.assertRaises(ValueError) as context:
            campaign_create(
                title="Duplicate Campaign",
                description="Dupe",
                project=self.project,
                owner=self.user_a,
                target=Money(5000, "USD"),
            )

        self.assertEqual(
            str(context.exception),
            "User already has a campaign for given project.",
        )

    def test_create_campaign_with_extra_fields(self):
        """Test that extra fields like end_date and description are set correctly."""
        end_date = timezone.now() + timezone.timedelta(days=30)
        campaign = campaign_create(
            title="Health Initiative",
            description="Providing healthcare services.",
            project=self.project,
            owner=self.user_a,
            target=Money(15000, "USD"),
            end_date=end_date,
        )

        self.assertEqual(campaign.description, "Providing healthcare services.")
        self.assertEqual(campaign.end_date, end_date)
        self.assertEqual(campaign.target, Money(15000, "USD"))

    def test_create_campaign_respects_limit(self):
        """Test that campaigns can be created up to the project limit."""
        campaign_create(
            title="First Campaign",
            description="First.",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        campaign_create(
            title="Second Campaign",
            description="Second.",
            project=self.project,
            owner=self.user_b,
            target=Money(5000, "USD"),
        )

        self.assertEqual(self.project.campaigns.count(), 2)

    def test_create_campaign_exceeds_limit(self):
        """Test that creating more campaigns than the limit is prevented."""
        campaign_create(
            title="First Campaign",
            description="First.",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        campaign_create(
            title="Second Campaign",
            description="Second.",
            project=self.project,
            owner=self.user_b,
            target=Money(5000, "USD"),
        )

        with self.assertRaises(ValidationError):
            campaign_create(
                title="Third Campaign",
                description="Third.",
                project=self.project,
                owner=self.user_c,
                target=Money(5000, "USD"),
            )

        self.assertEqual(self.project.campaigns.count(), 2)


class CommentModelTestCase(TestCase):
    """Test suite for the Comment model."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="user@example.com", password="password123")
        self.project, _ = Project.create_project(name="Project A", target=Money(10000, "USD"))
        self.campaign = campaign_create(
            title="Education for All",
            description="Education for All",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
        )

    def test_create_comment(self):
        """Test adding a comment to a campaign."""
        comment = comment_create(
            content="This is a test comment.",
            campaign=self.campaign,
            author=self.user,
        )

        self.assertEqual(comment.content, "This is a test comment.")
        self.assertEqual(comment.campaign, self.campaign)
        self.assertEqual(comment.author, self.user)

    def test_create_comment_reply(self):
        """Test creating a reply to a comment."""
        parent_comment = comment_create(content="Parent comment.", campaign=self.campaign, author=self.user)
        reply = comment_create(
            content="This is a reply.",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )

        self.assertEqual(reply.parent, parent_comment)
        self.assertTrue(comment_is_reply(reply))

    def test_get_top_level_comments(self):
        """Test retrieving only top-level comments (no replies)."""
        parent_comment = comment_create(content="Parent comment.", campaign=self.campaign, author=self.user)
        comment_create(
            content="Reply 1",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )

        comments = campaign_comments(self.campaign, include_replies=False)
        self.assertEqual(comments.count(), 1)  # Only the parent comment should be retrieved

    def test_get_all_comments(self):
        """Test retrieving all comments including replies."""
        parent_comment = comment_create(content="Parent comment.", campaign=self.campaign, author=self.user)
        comment_create(
            content="Reply 1",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )
        comment_create(
            content="Reply 2",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )

        comments = campaign_comments(self.campaign, include_replies=True)

        self.assertEqual(comments.count(), 3)  # Parent + 2
