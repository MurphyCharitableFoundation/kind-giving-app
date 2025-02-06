from django.test import TestCase
from django.core.exceptions import ValidationError

# Create your tests here.
from .models import Campaign

class CampaignModelTest(TestCase):

    def setUp(self):
        # Set up a sample campaign before each test with required fields
        self.campaign = Campaign.objects.create(
            title='Save the Rainforest',
            description='A campaign to protect the Amazon rainforest.',
            target_amount=10000.00,
            project_id=1,
            user_id=1
        )

    def test_campaign_creation(self):
        """Test if the campaign is created successfully."""
        self.assertEqual(self.campaign.title, 'Save the Rainforest')
        self.assertEqual(self.campaign.description, 'A campaign to protect the Amazon rainforest.')
        self.assertEqual(float(self.campaign.target_amount), 10000.00)
        self.assertEqual(self.campaign.project_id, 1)
        self.assertEqual(self.campaign.user_id, 1)
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
            target_amount=-500.00,
            project_id=2,
            user_id=2
        )
        with self.assertRaises(ValidationError):
            campaign.full_clean()  # Call full_clean() on the instance, not the class
            campaign.save()  # This will not be reached if the exception is raised

