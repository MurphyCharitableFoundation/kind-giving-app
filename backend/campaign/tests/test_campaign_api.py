"""Test Campaign & Comment JSON API."""

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.timezone import now
from djmoney.money import Money
from rest_framework import status
from rest_framework.test import APITestCase

from campaign.models import Campaign, Comment
from campaign.services import campaign_create, comment_create
from project.services import project_create

User = get_user_model()


class CampaignAPITestCase(APITestCase):
    """Test suite for the Campaign API."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="user@example.com", password="password123")
        self.client.force_authenticate(user=self.user)

        self.project = project_create(
            name="Green Transport",
            target=Money(20000, "USD"),
            campaign_limit=2,
            city="City",
            country="Country",
        )

        self.campaign = campaign_create(
            title="Eco Buses",
            description="AI Farming",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
            end_date=now().replace(year=2025, month=12, day=31),
        )

    def test_create_campaign_success(self):
        """Test creating a campaign via API."""
        user_1 = User.objects.create_user(email="user1@example.com", password="password123")
        self.client.force_authenticate(user=user_1)
        payload = {
            "title": "New Solar Initiative",
            "description": "Investing in solar buses.",
            "target": "10000.00",
            "project": self.project.id,
            "end_date": "2026-01-01T00:00:00Z",
            "owner": user_1.id,
        }

        response = self.client.post(reverse("campaigns:list-create"), payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Solar Initiative")

    def test_create_campaign_exceeds_limit(self):
        """Test that exceeding campaign limit raises an error."""
        user2 = User.objects.create_user(email="user2@example.com", password="password123")
        campaign_create(
            title="Another Campaign",
            description="Another Campaign",
            project=self.project,
            owner=user2,
            target=Money(5000, "USD"),
        )

        user3 = User.objects.create_user(email="user3@example.com", password="password123")
        self.client.force_authenticate(user=user3)

        payload = {
            "title": "Excess Campaign",
            "target": "5000.00",
            "description": "Excess campaign description.",
            "project": self.project.id,
            "owner": user3.id,
        }

        response = self.client.post(
            reverse("campaigns:list-create"),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "Project already has enough campaigns.",
            response.data["__all__"],
        )

    def test_get_campaign_list(self):
        """Test retrieving the list of campaigns."""
        response = self.client.get(reverse("campaigns:list-create"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertIn("title", response.data[0])

    def test_get_campaign_detail(self):
        """Test retrieving a campaign by ID."""
        response = self.client.get(
            reverse(
                "campaigns:detail",
                kwargs={"campaign_id": self.campaign.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Eco Buses")

    def test_update_campaign(self):
        """Test updating a campaign."""
        payload = {"title": "Updated Campaign"}
        response = self.client.patch(
            reverse(
                "campaigns:detail",
                kwargs={"campaign_id": self.campaign.id},
            ),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Campaign")

    def test_delete_campaign(self):
        """Test deleting a campaign."""
        response = self.client.delete(reverse("campaigns:detail", kwargs={"campaign_id": self.campaign.id}))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Campaign.objects.filter(id=self.campaign.id).exists())


class CommentAPITestCase(APITestCase):
    """Test suite for the Comment API."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="user@example.com", password="password123")
        self.client.force_authenticate(user=self.user)

        self.project = project_create(
            name="Smart Farming",
            target=Money(15000, "USD"),
            city="City",
            country="Country",
        )

        self.campaign = campaign_create(
            title="AI Farming",
            description="AI Farming",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
        )

        self.comment = comment_create(
            content="Great initiative!",
            campaign=self.campaign,
            author=self.user,
        )

    def test_create_comment_success(self):
        """Test creating a comment via API."""
        payload = {
            "content": "I love this!",
            "campaign": self.campaign.id,
            "author": self.user.id,
        }
        response = self.client.post(
            reverse("comments:list-create"),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "I love this!")

    def test_create_comment_reply(self):
        """Test creating a reply to a comment."""
        payload = {
            "content": "This is a reply!",
            "campaign": self.campaign.id,
            "parent": self.comment.id,
            "author": self.user.id,
        }
        response = self.client.post(
            reverse("comments:list-create"),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "This is a reply!")
        self.assertEqual(response.data["parent"], self.comment.id)

    def test_get_comment_list(self):
        """Test retrieving the list of comments."""
        response = self.client.get(reverse("comments:list-create"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertIn("content", response.data[0])

    def test_get_comment_detail(self):
        """Test retrieving a comment by ID."""
        response = self.client.get(reverse("comments:detail", kwargs={"comment_id": self.comment.id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Great initiative!")

    def test_update_comment(self):
        """Test updating a comment."""
        payload = {"content": "Updated Comment"}
        response = self.client.patch(
            reverse(
                "comments:detail",
                kwargs={"comment_id": self.comment.id},
            ),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Updated Comment")

    def test_delete_comment(self):
        """Test deleting a comment."""
        response = self.client.delete(reverse("comments:detail", kwargs={"comment_id": self.comment.id}))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())


class CampaignCommentsAPITestCase(APITestCase):
    """Test suite for the campaign_comments API view."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="test@example.com", password="password123")

        self.project = project_create(
            name="Smart Farming",
            target=Money(15000, "USD"),
            city="City",
            country="Country",
        )

        self.campaign = campaign_create(
            title="AI Farming",
            description="AI Farming",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
        )

        # Create some comments
        self.comment1 = comment_create(
            content="Great campaign!",
            campaign=self.campaign,
            author=self.user,
        )
        self.comment2 = comment_create(
            content="I support this initiative!",
            campaign=self.campaign,
            author=self.user,
        )

    def test_get_comments_success(self):
        """Test retrieving comments of a campaign successfully."""
        response = self.client.get(reverse("campaigns:comments-list", args=[self.campaign.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure both comments are returned
        self.assertEqual(len(response.data), 2)
        self.assertCountEqual(
            map(lambda p: p["content"], response.data),
            ["Great campaign!", "I support this initiative!"],
        )

    def test_get_comments_campaign_not_found(self):
        """Test retrieving comments for a non-existent campaign."""
        response = self.client.get(reverse("campaigns:comments-list", args=[999]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
