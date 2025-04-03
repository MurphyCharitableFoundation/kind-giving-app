"""Model Update Service Tests."""

from django.contrib.auth import get_user_model
from django.test import TestCase

from ..services import model_update

User = get_user_model()


class ModelUpdateUserTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            password="pass1234",
            phone_number="+19059629763",
            is_group_leader=False,
        )

    def test_updates_fields_successfully(self):
        updated_user, has_updated = model_update(
            instance=self.user,
            fields=["phone_number", "is_staff", "is_group_leader"],
            data={
                "phone_number": "+19059629764",
                "is_staff": True,
                "is_group_leader": True,
            },
        )

        self.assertTrue(has_updated)
        self.assertTrue(updated_user.is_staff)
        self.assertTrue(updated_user.is_group_leader)
        self.assertEqual(updated_user.phone_number.as_e164, "+19059629764")

    def test_skips_unchanged_fields(self):
        updated_user, has_updated = model_update(
            instance=self.user,
            fields=["phone_number", "is_group_leader"],
            data={
                "phone_number": "+19059629763",
                "is_group_leader": False,
            },
        )

        self.assertFalse(has_updated)

    def test_ignores_fields_not_in_data(self):
        updated_user, has_updated = model_update(
            instance=self.user,
            fields=["phone_number", "is_group_leader"],
            data={"is_group_leader": True},  # no phone_number in data
        )

        self.assertTrue(has_updated)
        self.assertTrue(updated_user.is_group_leader)
        self.assertEqual(updated_user.phone_number.as_e164, "+19059629763")

    def test_raises_error_on_invalid_field(self):
        with self.assertRaises(AssertionError):
            model_update(
                instance=self.user,
                fields=["invalid_field"],
                data={"invalid_field": "whatever"},
            )
