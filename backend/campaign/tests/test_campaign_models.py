"""Test Campaign models."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from djmoney.money import Money

from campaign.models import Campaign, Comment
from project.models import Project

User = get_user_model()


class CampaignModelTestCase(TestCase):
    """Test suite for the Campaign model."""

    def setUp(self):
        """Set up test data."""
        self.user_a = User.objects.create_user(
            email="a@example.com", password="password123"
        )
        self.user_b = User.objects.create_user(
            email="b@example.com", password="password123"
        )
        self.user_c = User.objects.create_user(
            email="c@example.com", password="password123"
        )

        self.project, _ = Project.create_project(
            name="Project A",
            target=Money(10000, "USD"),
            campaign_limit=2,
        )

    def test_create_campaign_success(self):
        """Test creating a campaign successfully."""
        campaign, created = Campaign.create_campaign(
            title="Education for All",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        self.assertTrue(created)
        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user_a)
        self.assertEqual(campaign.target, Money(5000, "USD"))

    def test_campaign_with_integer_target(self):
        """Test that a Campaign can be created with an integer target."""
        campaign, created = Campaign.create_campaign(
            title="Education for All",
            project=self.project,
            owner=self.user,
            target=5000,
        )

        self.assertTrue(created)
        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user)
        self.assertEqual(campaign.target, Money(5000, "USD"))

    def test_campaign_with_float_target(self):
        """Test that a Campaign can be created with a float target."""
        campaign, created = Campaign.create_campaign(
            title="Education for All",
            project=self.project,
            owner=self.user,
            target=5000.50,
        )

        self.assertTrue(created)
        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user)
        self.assertEqual(campaign.target, Money(5000.50, "USD"))

    def test_campaign_with_money_object_target(self):
        """Test that a Campaign can be created with a Money-object target."""
        campaign, created = Campaign.create_campaign(
            title="Education for All",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
        )

        self.assertTrue(created)
        self.assertEqual(campaign.title, "Education for All")
        self.assertEqual(campaign.project, self.project)
        self.assertEqual(campaign.owner, self.user)
        self.assertEqual(campaign.target, Money(5000, "USD"))

    def test_create_duplicate_campaign_fails(self):
        """Test that a user cannot create multiple campaigns for the same project."""
        Campaign.create_campaign(
            title="First Campaign",
            project=self.project,
            owner=self.user_a,
            target=Money(10000, "USD"),
        )

        with self.assertRaises(ValueError) as context:
            Campaign.create_campaign(
                title="Duplicate Campaign",
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
        campaign, created = Campaign.create_campaign(
            title="Health Initiative",
            project=self.project,
            owner=self.user_a,
            target=Money(15000, "USD"),
            end_date=end_date,
            description="Providing healthcare services.",
        )

        self.assertTrue(created)
        self.assertEqual(campaign.description, "Providing healthcare services.")
        self.assertEqual(campaign.end_date, end_date)
        self.assertEqual(campaign.target, Money(15000, "USD"))

    def test_create_campaign_respects_limit(self):
        """Test that campaigns can be created up to the project limit."""
        campaign1, created1 = Campaign.create_campaign(
            title="First Campaign",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        campaign2, created2 = Campaign.create_campaign(
            title="Second Campaign",
            project=self.project,
            owner=self.user_b,
            target=Money(5000, "USD"),
        )

        self.assertTrue(created1)
        self.assertTrue(created2)
        self.assertEqual(self.project.campaigns.count(), 2)

    def test_create_campaign_exceeds_limit(self):
        """Test that creating more campaigns than the limit is prevented."""
        Campaign.create_campaign(
            title="First Campaign",
            project=self.project,
            owner=self.user_a,
            target=Money(5000, "USD"),
        )

        Campaign.create_campaign(
            title="Second Campaign",
            project=self.project,
            owner=self.user_b,
            target=Money(5000, "USD"),
        )

        with self.assertRaises(ValueError) as context:
            Campaign.create_campaign(
                title="Third Campaign",
                project=self.project,
                owner=self.user_c,
                target=Money(5000, "USD"),
            )

        self.assertEqual(
            str(context.exception),
            "Project already has enough campaigns.",
        )

        self.assertEqual(self.project.campaigns.count(), 2)


class CommentModelTestCase(TestCase):
    """Test suite for the Comment model."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="user@example.com", password="password123")
        self.project, _ = Project.create_project(name="Project A", target=Money(10000, "USD"))
        self.campaign = Campaign.create_campaign(
            title="Education for All",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
        )[0]

    def test_create_comment(self):
        """Test adding a comment to a campaign."""
        comment = Comment.create_comment(
            content="This is a test comment.",
            campaign=self.campaign,
            author=self.user,
        )

        self.assertEqual(comment.content, "This is a test comment.")
        self.assertEqual(comment.campaign, self.campaign)
        self.assertEqual(comment.author, self.user)

    def test_create_comment_reply(self):
        """Test creating a reply to a comment."""
        parent_comment = Comment.create_comment(content="Parent comment.", campaign=self.campaign, author=self.user)
        reply = Comment.create_comment(
            content="This is a reply.",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )

        self.assertEqual(reply.parent, parent_comment)
        self.assertTrue(reply.is_reply())

    def test_get_top_level_comments(self):
        """Test retrieving only top-level comments (no replies)."""
        parent_comment = Comment.create_comment(content="Parent comment.", campaign=self.campaign, author=self.user)
        Comment.create_comment(
            content="Reply 1",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )

        comments = Comment.get_comments(self.campaign, include_replies=False)
        self.assertEqual(comments.count(), 1)  # Only the parent comment should be retrieved

    def test_get_all_comments(self):
        """Test retrieving all comments including replies."""
        parent_comment = Comment.create_comment(content="Parent comment.", campaign=self.campaign, author=self.user)
        Comment.create_comment(
            content="Reply 1",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )
        Comment.create_comment(
            content="Reply 2",
            campaign=self.campaign,
            author=self.user,
            parent=parent_comment,
        )

        comments = Comment.get_comments(self.campaign, include_replies=True)
        self.assertEqual(comments.count(), 3)  # Parent + 2
