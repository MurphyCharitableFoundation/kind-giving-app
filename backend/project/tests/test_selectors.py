"""Project selector tests."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from djmoney.money import Money

from campaign.services import campaign_create
from donation.services import donation_create
from project.selectors import (
    cause_get,
    cause_list,
    project_beneficiary_list,
    project_donations,
    project_donations_total,
    project_donations_total_percentage,
    project_get,
    project_list,
)
from project.services import (
    assign_beneficiary,
    cause_create,
    project_create,
)
from user.models import UserGroup

User = get_user_model()


class ProjectSelectorTest(TestCase):
    def setUp(self):
        self.cause = cause_create(name="education")
        self.project = project_create(
            name="School Build",
            target=1000,
            city="Kigali",
            country="Rwanda",
            causes=[self.cause],
        )
        self.user = User.objects.create_user(email="test@example.com", password="testpass")
        self.fundraiser = User.objects.create_user(email="fundraiser@example.com", password="fundpass")

        self.donor = User.objects.create_user(email="donor@example.com", password="donorpass")

        self.group = UserGroup.objects.create(name="Team Alpha")
        assign_beneficiary(project=self.project, beneficiary=self.user)
        assign_beneficiary(project=self.project, beneficiary=self.group)

    def test_project_get_returns_project(self):
        result = project_get(self.project.id)
        self.assertEqual(result, self.project)

    def test_project_list_with_no_filters(self):
        result = project_list()
        self.assertIn(self.project, result)

    def test_project_beneficiary_list_user_filter(self):
        result = project_beneficiary_list(self.project.id, filters={"assignable_type": "User"})
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first().assignable_type, "User")

    def test_project_beneficiary_list_group_filter(self):
        result = project_beneficiary_list(self.project.id, filters={"assignable_type": "UserGroup"})
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first().assignable_type, "UserGroup")

    def test_project_donations_empty(self):
        result = project_donations(self.project)
        self.assertEqual(result.count(), 0)

    def test_project_donations_total_empty(self):
        result = project_donations_total(self.project)
        self.assertEqual(result.amount, 0)

    def test_project_donations_percentage_empty(self):
        result = project_donations_total_percentage(self.project)
        self.assertEqual(result, 0)

    def test_project_donations_total_with_donations(self):
        donation_create(
            campaign=campaign_create(
                title="Phase 1",
                description="Phase 1.",
                owner=self.fundraiser,
                project=self.project,
                target=200,
                end_date=None,
            ),
            amount=200,
            donor=self.donor,
        )

        result = project_donations_total(self.project)
        self.assertEqual(result, Money(200, "USD"))

    def test_project_donations_percentage_with_donations(self):
        donation_create(
            campaign=campaign_create(
                title="Phase 2",
                description="Phase 2.",
                project=self.project,
                owner=self.fundraiser,
                target=500,
                end_date=None,
            ),
            amount=500,
            donor=self.donor,
        )
        percent = project_donations_total_percentage(self.project)
        self.assertEqual(percent, 50)


class CauseSelectorTest(TestCase):
    def setUp(self):
        self.cause = cause_create(name="health")

    def test_cause_get_returns_cause(self):
        result = cause_get(self.cause.id)
        self.assertEqual(result, self.cause)

    def test_cause_list_with_no_filters(self):
        result = cause_list()
        self.assertIn(self.cause, result)
