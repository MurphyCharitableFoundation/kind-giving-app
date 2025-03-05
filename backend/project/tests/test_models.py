"""Project tests."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.core.exceptions import ValidationError

from djmoney.money import Money

from user.models import UserGroup
from ..models import Cause, Project, ProjectAssignment


User = get_user_model()


class CauseModelTest(TestCase):
    def test_cause_name_saved_lowercase(self):
        # Create a cause with mixed-case name
        cause, created = Cause.create_cause(
            name="Education", description="A test cause"
        )
        self.assertTrue(created)
        self.assertEqual(cause.name, "education")


class ProjectModelTest(TestCase):
    def test_create_project_with_causes(self):
        # Create a cause and then create a project associated with that cause
        cause, _ = Cause.create_cause(
            name="environment", description="Environment cause"
        )
        target = Money(10000, "USD")
        project, created = Project.create_project(
            name="Tree Planting", target=target, causes=[cause]
        )
        self.assertTrue(created)
        self.assertEqual(project.name, "Tree Planting")
        self.assertEqual(project.target, target)
        self.assertIn(cause, project.causes.all())

    def test_get_project_by_name(self):
        target = Money(5000, "USD")
        project, created = Project.create_project(
            name="Solar Energy", target=target
        )
        self.assertIsNotNone(
            Project.objects.filter(name="Solar Energy").first()
        )

    def test_target_minimum_validator(self):
        """Test target minimum amount."""
        project = Project(name="Test Project", target=Money(0, "USD"))
        with self.assertRaises(ValidationError) as context:
            project.full_clean()  # This triggers field validation

        # Check that the error message includes 'target'
        self.assertIn("target", context.exception.message_dict)

        # Now create a project with a valid target amount
        valid_project = Project(
            name="Valid Project", target=Money(0.01, "USD")
        )
        try:
            valid_project.full_clean()  # Should not raise an error
        except ValidationError:
            self.fail(
                "Project with valid target raised a ValidationError unexpectedly."
            )


class ProjectAssignmentTest(TestCase):
    def setUp(self):
        # Create a dummy project
        self.target = Money(5000, "USD")
        self.project, _ = Project.create_project(
            name="Water Conservation", target=self.target
        )
        # Create dummy users and a custom UserGroup
        self.user1 = User.objects.create_user(
            email="user1@example.com", password="testpass"
        )
        self.user2 = User.objects.create_user(
            email="user2@example.com", password="testpass"
        )
        self.group = UserGroup.objects.create(name="Group A")

    def test_parse_beneficiary_user(self):
        """Parse a User beneficiary."""
        type, id = ProjectAssignment._parse_beneficiary(self.user1)
        self.assertEqual(type, "User")
        self.assertEqual(id, self.user1.pk)

    def test_parse_beneficiary_usergroup(self):
        """Parse a UserGroup beneficiary."""
        type, id = ProjectAssignment._parse_beneficiary(self.group)
        self.assertEqual(type, "UserGroup")
        self.assertEqual(id, self.group.pk)

    def test_assign_beneficiary_user(self):
        """Assign a user beneficiary."""
        assignment, created = ProjectAssignment.assign_beneficiary(
            self.project, self.user1
        )
        self.assertTrue(created)
        self.assertEqual(assignment.assignable_type, "User")
        self.assertEqual(assignment.assignable_id, self.user1.pk)

    def test_assign_beneficiary_usergroup(self):
        """Assign a UserGroup beneficiary."""
        assignment, created = ProjectAssignment.assign_beneficiary(
            self.project, self.group
        )
        self.assertTrue(created)
        self.assertEqual(assignment.assignable_type, "UserGroup")
        self.assertEqual(assignment.assignable_id, self.group.pk)

    def test_duplicate_assignment(self):
        """
        Assign the same beneficiary twice.

        The second time should not create a duplicate.
        """
        assignment1, created1 = ProjectAssignment.assign_beneficiary(
            self.project, self.user1
        )
        assignment2, created2 = ProjectAssignment.assign_beneficiary(
            self.project, self.user1
        )
        self.assertFalse(created2)
        self.assertEqual(assignment1.pk, assignment2.pk)

    def test_unassign_beneficiary(self):
        """Unassign a beneficiary."""
        ProjectAssignment.assign_beneficiary(self.project, self.user1)
        result = ProjectAssignment.unassign_beneficiary(
            self.project, self.user1
        )
        self.assertTrue(result)
        self.assertFalse(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type="User",
                assignable_id=self.user1.pk,
            ).exists()
        )

    def test_reassign_beneficiary(self):
        """Assign a user, then reassign to a different user."""
        assignment, created = ProjectAssignment.assign_beneficiary(
            self.project, self.user1
        )
        updated = ProjectAssignment.reassign(
            self.project, self.user1, self.user2
        )
        self.assertIsNotNone(updated)
        self.assertEqual(updated.assignable_type, "User")
        self.assertEqual(updated.assignable_id, self.user2.pk)

    def test_invalid_beneficiary(self):
        """Passing an invalid beneficiary should raise ValueError."""
        with self.assertRaises(ValueError):
            ProjectAssignment.assign_beneficiary(
                self.project, "invalid beneficiary"
            )
