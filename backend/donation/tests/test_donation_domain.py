"""Donation tests."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from djmoney.money import Money

from campaign.models import Campaign
from project.models import Project

from ..selectors import campaign_donations, donation_get, donation_list
from ..services import donation_create

User = get_user_model()


class DonationModelTest(TestCase):
    """Test suite for the Donation model."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(email="donor@example.com", password="testpass")

        # Create two separate projects and campaigns
        self.project1, _ = Project.create_project(name="Project A", target=Money(10000, "USD"))
        self.project2, _ = Project.create_project(name="Project B", target=Money(20000, "USD"))

        self.campaign1, _ = Campaign.create_campaign(
            title="Education for All",
            project=self.project1,
            owner=self.user,
            target=Money(5000, "USD"),
        )
        self.campaign2, _ = Campaign.create_campaign(
            title="Clean Water Initiative",
            project=self.project2,
            owner=self.user,
            target=Money(8000, "USD"),
        )

    def test_donation_with_valid_data(self):
        """Test creating a donation with valid data."""
        amount = Money(100.00, "USD")
        description = "Supporting education campaign."
        donation = donation_create(
            donor=self.user,
            amount=amount,
            description=description,
            campaign=self.campaign1,
        )

        self.assertIsNotNone(donation)
        self.assertEqual(donation.donor, self.user)
        self.assertEqual(donation.amount, amount)
        self.assertEqual(donation.description, description)
        self.assertEqual(donation.campaign, self.campaign1)

    def test_donation_with_negative_amount(self):
        """Test that a donation cannot be created with a negative amount."""
        with self.assertRaises(ValidationError):
            donation_create(
                donor=self.user,
                amount=Money(-100.00, "USD"),
                description="Invalid donation",
                campaign=self.campaign1,
            )

    def test_donation_with_no_amount(self):
        """Test that a donation cannot be created with zero amount."""
        with self.assertRaises(ValidationError):
            donation_create(
                donor=self.user,
                amount=Money(0.00, "USD"),
                description="Invalid donation",
                campaign=self.campaign1,
            )

    def test_donation_with_integer_amount(self):
        """Test that a donation can be created with an integer amount."""
        donation = donation_create(
            donor=self.user,
            amount=100,  # Integer amount
            description="Integer amount donation",
            campaign=self.campaign1,
        )

        self.assertEqual(donation.amount, Money(100, "USD"))

    def test_donation_with_float_amount(self):
        """Test that a donation can be created with a float amount."""
        donation = donation_create(
            donor=self.user,
            amount=100.50,  # Float amount
            description="Float amount donation",
            campaign=self.campaign1,
        )

        self.assertEqual(donation.amount, Money(100.50, "USD"))

    def test_donation_with_money_object_amount(self):
        """Test that a donation can be created with a Money object."""
        amount = Money(250.75, "USD")
        donation = donation_create(
            donor=self.user,
            amount=amount,  # Money object
            description="Money object donation",
            campaign=self.campaign1,
        )

        self.assertEqual(donation.amount, amount)


class DonationSelectorTest(TestCase):
    """Test suite for Donation selectors."""

    def setUp(self):
        """Set up test data."""

        self.user = User.objects.create_user(email="donor@example.com", password="testpass")

        self.project1, _ = Project.create_project(name="Project A", target=Money(10000, "USD"))
        self.project2, _ = Project.create_project(name="Project B", target=Money(20000, "USD"))

        self.campaign1, _ = Campaign.create_campaign(
            title="Education for All",
            project=self.project1,
            owner=self.user,
            target=Money(5000, "USD"),
        )
        self.campaign2, _ = Campaign.create_campaign(
            title="Clean Water Initiative",
            project=self.project2,
            owner=self.user,
            target=Money(8000, "USD"),
        )

        # Create donations
        self.donation1 = donation_create(
            donor=self.user,
            amount=Money(100, "USD"),
            description="Donation 1",
            campaign=self.campaign1,
        )
        self.donation2 = donation_create(
            donor=self.user,
            amount=Money(200, "USD"),
            description="Donation 2",
            campaign=self.campaign1,
        )

    def test_donation_get_valid(self):
        """Test retrieving a donation by ID."""
        donation = donation_get(self.donation1.id)
        self.assertIsNotNone(donation)
        self.assertEqual(donation, self.donation1)

    def test_donation_get_invalid(self):
        """Test retrieving a non-existent donation returns None."""
        donation = donation_get(9999)  # Non-existent ID
        self.assertIsNone(donation)

    def test_donation_list_all(self):
        """Test retrieving all donations."""
        donations = donation_list()
        self.assertEqual(donations.count(), 2)
        self.assertIn(self.donation1, donations)
        self.assertIn(self.donation2, donations)

    def test_donation_list_filtered_by_campaign(self):
        """Test retrieving donations filtered by campaign."""
        filters = {"campaign": self.campaign1.id}
        donations = donation_list(filters=filters)

        self.assertEqual(donations.count(), 2)
        self.assertIn(self.donation1, donations)
        self.assertIn(self.donation2, donations)

    def test_retrieve_donations_for_given_campaign(self):
        """Test retrieving donations for a specific campaign."""
        extra_donation = donation_create(
            donor=self.user,
            amount=Money(50.00, "USD"),
            description="Donation 1 for campaign 2",
            campaign=self.campaign2,
        )

        donations_for_campaign_1 = campaign_donations(campaign=self.campaign1)

        self.assertEqual(donations_for_campaign_1.count(), 2)
        self.assertNotIn(extra_donation, donations_for_campaign_1)
