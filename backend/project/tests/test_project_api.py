from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from ..models import Cause, Project

User = get_user_model()


class ProjectAPITestCase(TestCase):
    """Test suite for the Project API."""

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

        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)

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
        self.project.causes.add(self.cause1)

    def test_create_project(self):
        """Test creating a new project via POST request."""
        payload = {
            "name": "New Project",
            "target": "10000.00",
            "causes_names": ["education", "healthcare"],  # Using cause names
            "city": "Lagos",
            "country": "Nigeria",
        }
        response = self.client.post("/api/projects/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Project")
        self.assertListEqual(response.data["causes"], ["education", "healthcare"])

    def test_get_projects(self):
        """Test retrieving all projects via GET request."""
        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Clean Water Project")

    def test_get_project_detail(self):
        """Test retrieving a single project by ID."""
        response = self.client.get(f"/api/projects/{self.project.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Clean Water Project")

    def test_update_project(self):
        """Test updating a project via PATCH request."""
        payload = {
            "name": "Updated Water Project",
            "target": "7500.00",
            "causes_names": ["healthcare"],
        }
        response = self.client.patch(f"/api/projects/{self.project.id}/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Updated Water Project")
        self.assertEqual(response.data["target"], "7500.00")
        self.assertListEqual(response.data["causes"], ["healthcare"])

    def test_delete_project(self):
        """Test deleting a project."""
        response = self.client.delete(f"/api/projects/{self.project.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_non_admin_cannot_create_project(self):
        """Test that a non-admin user cannot create a project."""
        self.client.force_authenticate(user=self.non_admin_user)

        payload = {
            "name": "Unauthorized Project",
            "target": "2000.00",
            "causes_names": ["education"],
            "city": "Accra",
            "country": "Ghana",
        }
        response = self.client.post("/api/projects/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_update_project(self):
        """Test that a non-admin user cannot update a project."""
        self.client.force_authenticate(user=self.non_admin_user)

        payload = {"name": "Hacked Project"}
        response = self.client.patch(f"/api/projects/{self.project.id}/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_delete_project(self):
        """Test that a non-admin user cannot delete a project."""
        self.client.force_authenticate(user=self.non_admin_user)

        response = self.client.delete(f"/api/projects/{self.project.id}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
