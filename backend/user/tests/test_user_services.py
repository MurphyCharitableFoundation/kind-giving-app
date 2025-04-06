"""User services tests."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models import UserGroup
from ..services import user_create, user_update

User = get_user_model()


class UserServiceTests(TestCase):
    def test_user_without_password_is_created_with_unusable_one(self):
        user = user_create(email="random_user@example.com")

        self.assertFalse(user.has_usable_password())

    def test_user_with_capitalized_email_cannot_be_created(self):
        user_create(email="random_user@example.com")

        with self.assertRaises(ValidationError):
            user_create(email="RANDOM_user@example.com")

        self.assertEqual(1, User.objects.count())

    def test_user_create_with_all_fields(self):
        user = user_create(
            email="user2@example.com",
            password="secure123",
        )

        self.assertEqual(user.email, "user2@example.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_group_leader)
        self.assertTrue(user.check_password("secure123"))

    def test_user_update_non_side_effect_fields(self):
        user = user_create(email="user3@example.com")
        group = UserGroup.objects.create(name="Group A")

        updated_user = user_update(
            user=user,
            data={
                "phone_number": "+19059629763",
                "group_membership": group,
                "is_group_leader": True,
            },
        )

        self.assertEqual(updated_user.phone_number.as_e164, "+19059629763")
        self.assertEqual(updated_user.group_membership, group)
        self.assertTrue(updated_user.is_group_leader)

    def test_user_update_skips_unrelated_fields(self):
        user = user_create(email="user4@example.com")

        updated_user = user_update(
            user=user,
            data={
                "email": "new@example.com",  # ignored field
                "nonexistent": "value",  # invalid field
            },
        )

        self.assertEqual(updated_user.email, "user4@example.com")
