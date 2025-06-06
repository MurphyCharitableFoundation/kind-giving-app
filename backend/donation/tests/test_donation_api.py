"""Test Donation APIs."""

from django.contrib.auth import get_user_model
from django.urls import reverse
from djmoney.money import Money
from rest_framework import status
from rest_framework.test import APITestCase

from campaign.services import campaign_create
from core.services import to_money
from donation.models import Donation
from donation.services import donation_create
from project.services import project_create

User = get_user_model()


class DonationAPITestCase(APITestCase):
    """Test suite for Donation API views."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="donor@example.com", password="testpass")

        # Create a project and campaign
        self.project = project_create(
            name="Project A",
            target=Money(10000, "USD"),
            city="City",
            country="Country",
        )
        self.campaign = campaign_create(
            title="Education for All",
            description="Education for All",
            project=self.project,
            owner=self.user,
            target=Money(5000, "USD"),
        )

        # Create a donation
        self.donation = donation_create(
            donor=self.user,
            amount=Money(100.00, "USD"),
            campaign=self.campaign,
        )

    def test_list_donations(self):
        """Test retrieving all donations."""
        url = reverse("list-create")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.donation.id)

    def test_retrieve_donation_detail(self):
        """Test retrieving a specific donation."""
        url = reverse("detail", kwargs={"donation_id": self.donation.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.donation.id)
        self.assertEqual(response.data["donor"], self.donation.donor.id)
        self.assertEqual(
            to_money(float(response.data["amount"])),
            to_money(self.donation.amount),
        )

    def test_retrieve_nonexistent_donation(self):
        """Test retrieving a donation that does not exist should return 404."""
        url = reverse("detail", args=[9999])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_donation_unauthenticated(self):
        """Test creating a new donation via API."""
        url = reverse("list-create")
        payload = {
            "donor": self.user.id,
            "amount": "150.00",
            "campaign": self.campaign.id,
        }
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_donation_authenticated(self):
        """Test creating a new donation with an authenticated user."""
        self.client.force_authenticate(user=self.user)
        url = reverse("list-create")
        payload = {
            "donor": self.user.id,
            "amount": "150.00",
            "campaign": self.campaign.id,
        }
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Donation.objects.count(), 2)

    def test_create_donation_with_invalid_data(self):
        """Test that invalid donation creation fails."""
        self.client.force_authenticate(user=self.user)
        url = reverse("list-create")
        payload = {
            "donor": self.user.id,
            "amount": "-100.00",  # Invalid negative amount
            "campaign": self.campaign.id,
        }
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
