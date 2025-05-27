"""Test Services."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from djmoney.money import Money

from project.models import ProjectAssignment
from project.services import (
    assign_beneficiary,
    cause_create,
    cause_update,
    causes_resolve,
    project_create,
    project_update,
    reassign_beneficiary,
    unassign_beneficiary,
)
from user.models import UserGroup

User = get_user_model()


class CauseServiceTest(TestCase):
    def test_cause_name_saved_lowercase(self):
        cause = cause_create(name="Education", description="A test cause")
        self.assertEqual(cause.name, "education")

    def test_causes_resolve_creates_and_reuses(self):
        existing = cause_create(name="health")
        result = causes_resolve(["Health", "Education", existing])
        names = sorted([c.name for c in result])
        self.assertEqual(names, ["education", "health", "health"])  # one reused

    def test_cause_update_fields(self):
        cause = cause_create(name="Healthcare", description="Old description")
        self.assertEqual(cause.name, "healthcare")
        self.assertEqual(cause.description, "Old description")
        updated = cause_update(
            cause=cause,
            data={
                "name": "Health",
                "description": "Updated description",
            },
        )
        self.assertEqual(updated.name, "health")
        self.assertEqual(updated.description, "Updated description")


class ProjectServiceTest(TestCase):
    def test_create_project_with_causes(self):
        target = Money(10000, "USD")
        project = project_create(
            name="Tree Planting",
            target=target,
            city="Toronto",
            country="Canada",
            causes=["environment"],
        )
        self.assertEqual(project.name, "Tree Planting")
        self.assertEqual(project.target, target)
        self.assertTrue(project.causes.filter(name="environment").exists())

        def test_project_update_fields(self):
            project = project_create(
                name="Original Name",
                target=Money(1000, "USD"),
                city="City A",
                country="Country A",
            )
            updated = project_update(
                project=project,
                data={
                    "name": "Updated Name",
                    "target": Money(2000, "USD"),
                    "city": "City B",
                    "country": "Country B",
                },
            )
            self.assertEqual(updated.name, "Updated Name")
            self.assertEqual(updated.target, Money(2000, "USD"))
            self.assertEqual(updated.city, "City B")
            self.assertEqual(updated.country, "Country B")

    def test_target_minimum_validator(self):
        with self.assertRaises(ValidationError):
            project = project_create(
                name="Too Low",
                target=Money(0, "USD"),
                city="Nairobi",
                country="Kenya",
            )
            project.full_clean()

    def test_valid_target_passes(self):
        try:
            project = project_create(
                name="Just Enough",
                target=Money(0.01, "USD"),
                city="Nairobi",
                country="Kenya",
            )
            project.full_clean()
        except ValidationError:
            self.fail("Valid project target raised ValidationError.")

    def test_create_with_integer_target(self):
        project = project_create(
            name="Integer Target",
            target=100,
            city="Paris",
            country="France",
        )
        self.assertEqual(project.target, Money(100, "USD"))

    def test_create_with_float_target(self):
        project = project_create(
            name="Float Target",
            target=100.50,
            city="Berlin",
            country="Germany",
        )
        self.assertEqual(project.target, Money(100.50, "USD"))

    def test_create_with_money_target(self):
        project = project_create(
            name="Money Target",
            target=Money(250.75, "USD"),
            city="Lagos",
            country="Nigeria",
        )
        self.assertEqual(project.target, Money(250.75, "USD"))


class ProjectAssignmentServiceTest(TestCase):
    def setUp(self):
        self.project = project_create(
            name="Water Project",
            target=Money(5000, "USD"),
            city="Accra",
            country="Ghana",
        )
        self.user1 = User.objects.create_user(email="user1@example.com", password="test")
        self.user2 = User.objects.create_user(email="user2@example.com", password="test")
        self.group = UserGroup.objects.create(name="Group A")

    def test_assign_user(self):
        assignment, created = assign_beneficiary(project=self.project, beneficiary=self.user1)
        self.assertTrue(created)
        self.assertEqual(assignment.assignable_type, "User")
        self.assertEqual(assignment.assignable_id, self.user1.pk)

    def test_assign_usergroup(self):
        assignment, created = assign_beneficiary(project=self.project, beneficiary=self.group)
        self.assertTrue(created)
        self.assertEqual(assignment.assignable_type, "UserGroup")
        self.assertEqual(assignment.assignable_id, self.group.pk)

    def test_duplicate_assignment(self):
        assign_beneficiary(project=self.project, beneficiary=self.user1)
        assignment2, created2 = assign_beneficiary(project=self.project, beneficiary=self.user1)
        self.assertFalse(created2)
        self.assertEqual(ProjectAssignment.objects.count(), 1)

    def test_unassign_user(self):
        assign_beneficiary(project=self.project, beneficiary=self.user1)
        deleted = unassign_beneficiary(project=self.project, beneficiary=self.user1)
        self.assertTrue(deleted)
        self.assertFalse(ProjectAssignment.objects.exists())

    def test_reassign_user(self):
        assign_beneficiary(project=self.project, beneficiary=self.user1)
        updated = reassign_beneficiary(
            project=self.project,
            old_beneficiary=self.user1,
            new_beneficiary=self.user2,
        )
        self.assertIsNotNone(updated)
        self.assertEqual(updated.assignable_id, self.user2.pk)

    def test_invalid_beneficiary_raises(self):
        with self.assertRaises(ValueError):
            assign_beneficiary(project=self.project, beneficiary="invalid")
