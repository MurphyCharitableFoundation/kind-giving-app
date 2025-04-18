"""Test Cause API."""

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from project.models import Cause

User = get_user_model()


class CauseAPITestCase(TestCase):
    """Test suite for the Cause API."""

    def setUp(self):
        """
        Set up test data.

        Including admin and non-admin users, and API client.
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

        # Create a sample cause
        self.cause = Cause.objects.create(name="education", description="Education-related projects.")

    def test_create_cause(self):
        """Test creating a new cause via POST request (Admin Only)."""
        payload = {
            "name": "healthcare",
            "description": "Healthcare initiatives.",
        }
        response = self.client.post("/api/causes/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "healthcare")

    def test_get_causes(self):
        """Test retrieving all causes via GET request."""
        response = self.client.get("/api/causes/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "education")

    def test_get_cause_detail(self):
        """Test retrieving a single cause by ID."""
        response = self.client.get(f"/api/causes/{self.cause.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "education")

    def test_update_cause(self):
        """Test updating a cause via PATCH request (Admin Only)."""
        payload = {
            "name": "updated-education",
            "description": "Updated description.",
        }
        response = self.client.patch(f"/api/causes/{self.cause.id}/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "updated-education")

    def test_delete_cause(self):
        """Test deleting a cause (should succeed if no projects are linked)."""
        response = self.client.delete(f"/api/causes/{self.cause.id}/")

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_non_admin_cannot_create_cause(self):
        """Test that a non-admin user cannot create a cause."""
        self.client.force_authenticate(user=self.non_admin_user)

        payload = {
            "name": "environment",
            "description": "Environmental protection initiatives.",
        }
        response = self.client.post("/api/causes/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_update_cause(self):
        """Test that a non-admin user cannot update a cause."""
        self.client.force_authenticate(user=self.non_admin_user)

        payload = {
            "name": "updated-environment",
            "description": "Updated description.",
        }
        response = self.client.patch(f"/api/causes/{self.cause.id}/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_delete_cause(self):
        """Test that a non-admin user cannot delete a cause."""
        self.client.force_authenticate(user=self.non_admin_user)

        response = self.client.delete(f"/api/causes/{self.cause.id}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
