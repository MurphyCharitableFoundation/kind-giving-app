from django.test import TestCase
from django.core.exceptions import ValidationError
from decimal import Decimal
from .models import Campaign, Project
from django.contrib.auth.models import User

class CampaignModelTest(TestCase):

    def setUp(self):
        """Set up necessary objects before each test."""
        self.user = User.objects.create_user(username='tester', password='password123')
        self.project = Project.objects.create(name='Project A', description='A test project')

        self.campaign = Campaign.objects.create(
            title='Save the Rainforest',
            description='A campaign to protect the Amazon rainforest.',
            target_amount=Decimal('10000.00'),
            project=self.project,
            user=self.user
        )

    def test_campaign_creation(self):
        """Test if the campaign is created successfully."""
        self.assertEqual(self.campaign.title, 'Save the Rainforest')
        self.assertEqual(self.campaign.description, 'A campaign to protect the Amazon rainforest.')
        self.assertEqual(self.campaign.target_amount.amount, Decimal('10000.00'))  # Access amount explicitly
        self.assertEqual(self.campaign.project, self.project)
        self.assertEqual(self.campaign.user, self.user)
        self.assertIsNotNone(self.campaign.created_at)
        self.assertIsNotNone(self.campaign.updated_at)

    def test_campaign_str_representation(self):
        """Test if the string representation of the campaign is correct."""
        self.assertEqual(str(self.campaign), 'Save the Rainforest')

    def test_update_campaign(self):
        """Test if campaign updates are saved correctly."""
        self.campaign.title = 'Save the Ocean'
        self.campaign.save()
        updated_campaign = Campaign.objects.get(id=self.campaign.id)
        self.assertEqual(updated_campaign.title, 'Save the Ocean')

    def test_goal_amount_cannot_be_negative(self):
        """Ensure goal amount cannot be negative."""
        campaign = Campaign(
            title='Invalid Campaign',
            description='This should fail.',
            target_amount=Decimal('-500.00'),
            project=self.project,
            user=self.user
        )
        with self.assertRaises(ValidationError):
            campaign.full_clean()
