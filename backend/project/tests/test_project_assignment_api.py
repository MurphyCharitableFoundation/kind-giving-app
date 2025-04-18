"""ProjectAssignment View."""

from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from project.models import Cause, Project, ProjectAssignment
from project.services import assign_beneficiary

User = get_user_model()
UserGroup = apps.get_model("user", "UserGroup")


class ProjectAssignmentAPITestCase(TestCase):
    """Test suite for the Project Assignment API."""

    def setUp(self):
        """
        Set up test data.

        Include admin and non-admin users, and API client.
        """
        self.client = APIClient()

        # Create an admin user
        self.admin_user = User.objects.create_user(email="admin@example.com", password="adminpass")
        admin_group, _ = Group.objects.get_or_create(name="admin")
        self.admin_user.groups.add(admin_group)

        # Create a non-admin user
        self.non_admin_user = User.objects.create_user(email="user@example.com", password="userpass")

        # Create sample causes
        self.cause1 = Cause.objects.create(name="education")
        self.cause2 = Cause.objects.create(name="healthcare")

        # Create a sample project
        self.project = Project.objects.create(
            name="Clean Water Project",
            target=5000,
            city="Nairobi",
            country="Kenya",
        )

        # Create a user and user group for assignments
        self.beneficiary_user = User.objects.create_user(email="beneficiary@example.com", password="testpass")
        self.beneficiary_group = UserGroup.objects.create(name="TestGroup")

        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)

    def test_assign_user_to_project(self):
        """Test assigning a User to a Project."""
        payload = {
            "assignable_type": "User",
            "assignable_id": self.beneficiary_user.id,
        }
        response = self.client.post(f"/api/projects/{self.project.id}/assign/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type="User",
                assignable_id=self.beneficiary_user.id,
            ).exists()
        )

    def test_assign_usergroup_to_project(self):
        """Test assigning a UserGroup to a Project."""
        payload = {
            "assignable_type": "UserGroup",
            "assignable_id": self.beneficiary_group.id,
        }
        response = self.client.post(f"/api/projects/{self.project.id}/assign/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type="UserGroup",
                assignable_id=self.beneficiary_group.id,
            ).exists()
        )

    def test_list_project_assignments(self):
        """Test retrieving all assignments for a project."""
        assign_beneficiary(self.project, self.beneficiary_user)

        response = self.client.get(f"/api/projects/{self.project.id}/assignments/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["assignable_type"], "User")
        self.assertEqual(response.data[0]["assignable_id"], self.beneficiary_user.id)

    def test_unassign_user_from_project(self):
        """Test unassigning a User from a Project."""
        assign_beneficiary(self.project, self.beneficiary_user)

        payload = {
            "assignable_type": "User",
            "assignable_id": self.beneficiary_user.id,
        }
        response = self.client.delete(
            f"/api/projects/{self.project.id}/unassign/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type="User",
                assignable_id=self.beneficiary_user.id,
            ).exists()
        )

    def test_unassign_usergroup_from_project(self):
        """Test unassigning a UserGroup from a Project."""
        assign_beneficiary(self.project, self.beneficiary_group)

        payload = {
            "assignable_type": "UserGroup",
            "assignable_id": self.beneficiary_group.id,
        }
        response = self.client.delete(
            f"/api/projects/{self.project.id}/unassign/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type="UserGroup",
                assignable_id=self.beneficiary_group.id,
            ).exists()
        )

    def test_cannot_assign_same_user_twice(self):
        """Test that assigning the same User to a project twice does not create duplicates."""
        assign_beneficiary(self.project, self.beneficiary_user)

        payload = {
            "assignable_type": "User",
            "assignable_id": self.beneficiary_user.id,
        }
        response = self.client.post(f"/api/projects/{self.project.id}/assign/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Should not create duplicate
        self.assertEqual(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type="User",
                assignable_id=self.beneficiary_user.id,
            ).count(),
            1,
        )

    def test_cannot_assign_same_usergroup_twice(self):
        """Test that assigning the same UserGroup to a project twice does not create duplicates."""
        assignable_type = "UserGroup"
        assign_beneficiary(self.project, self.beneficiary_group)

        payload = {
            "assignable_type": assignable_type,
            "assignable_id": self.beneficiary_group.id,
        }
        response = self.client.post(f"/api/projects/{self.project.id}/assign/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Should not create duplicate
        self.assertEqual(
            ProjectAssignment.objects.filter(
                project=self.project,
                assignable_type=assignable_type,
                assignable_id=self.beneficiary_group.id,
            ).count(),
            1,
        )

    def test_non_admin_cannot_assign(self):
        """Test that a non-admin user cannot assign a beneficiary."""
        self.client.force_authenticate(user=self.non_admin_user)

        payload = {
            "assignable_type": "User",
            "assignable_id": self.beneficiary_user.id,
        }
        response = self.client.post(f"/api/projects/{self.project.id}/assign/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_unassign(self):
        """Test that a non-admin user cannot unassign a beneficiary."""
        self.client.force_authenticate(user=self.non_admin_user)

        payload = {
            "assignable_type": "User",
            "assignable_id": self.beneficiary_user.id,
        }
        response = self.client.delete(
            f"/api/projects/{self.project.id}/unassign/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
