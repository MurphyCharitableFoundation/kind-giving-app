"""User Group Services Tests."""

from django.test import TestCase

from ..models import UserGroup
from ..services import user_group_create


class UserGroupServiceTests(TestCase):
    def test_user_group_create_with_required_fields(self):
        group = user_group_create(name="Community Builders")

        self.assertIsInstance(group, UserGroup)
        self.assertEqual(group.name, "Community Builders")
        self.assertIsNone(group.phone_number)
        self.assertIsNone(group.interest)

    def test_user_group_create_with_all_fields(self):
        group = user_group_create(
            name="Green Farmers",
            phone_number="+19059629763",
            interest="Agriculture",
        )

        self.assertEqual(group.name, "Green Farmers")
        self.assertEqual(group.phone_number.as_e164, "+19059629763")
        self.assertEqual(group.interest, "Agriculture")
