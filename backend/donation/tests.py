from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money
from .models import Donation

User = get_user_model()

class DonationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="donor@example.com", password="testpass"
        )

    def test_donation_with_valid_data(self): 
        amount = Money(100.00, "USD")
        description = "Supporting education campaign."
        campaign = 1 
        donation = Donation.create_donation(
            donor=self.user,
            amount=amount,
            description=description,
            campaign = campaign
        )

        self.assertIsNotNone(donation)
        self.assertEqual(donation.donor, self.user)
        self.assertEqual(donation.amount, amount)
        self.assertEqual(donation.description, description)
        self.assertEqual(donation.campaign, campaign)

    def test_retrieve_donations_for_given_campaign(self):
        donation1 = Donation.create_donation(
                donor=self.user,
                amount=Money(100.00, "USD"),
                description="Donation 1 for campaign 1",
                campaign=1
        )
        donation2 = Donation.create_donation(
                donor=self.user,
                amount=Money(200.00, "USD"),
                description="Donation 2 for campaign 1",
                campaign=1
        )

        donation3 = Donation.create_donation(
                donor=self.user,
                amount=Money(50.00, "USD"),
                description="Donation 1 for campaign 2",
                campaign=2
        )
        donations_for_campaign_1 = Donation.retrieve_donations(campaign=1)

        self.assertEqual(donations_for_campaign_1.count(), 2)
        self.assertIn(donation1, donations_for_campaign_1)
        self.assertIn(donation2, donations_for_campaign_1)
        self.assertNotIn(donation3, donations_for_campaign_1)

    def test_donation_with_negative_amount(self):
        with self.assertRaises(ValueError):
            Donation.create_donation(
                donor=self.user,
                amount=Money(-100.00, "USD"),
                description="Invalid donation",
                campaign=1
            )

    def test_donation_with_no_amount(self):
        with self.assertRaises(ValueError):
            Donation.create_donation(
                donor=self.user,
                amount=Money(0.00, "USD"),
                description="Invalid donation",
                campaign=1
            )