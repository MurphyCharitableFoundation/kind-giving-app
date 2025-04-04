"""User managers."""

from typing import Optional

from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    User manager where email is the unique id.

    - email is used for authentication instead of usernames.
    """

    def create_user(
        self,
        email: str,
        is_active: bool = True,
        is_staff: bool = False,
        is_group_leader: bool = False,
        phone_number: Optional[str] = None,
        password: Optional[str] = None,
    ):
        """Create and save a user with the given email and password."""
        if not email:
            raise ValueError(_("Users must have an email address."))

        user = self.model(
            email=self.normalize_email(email.lower()),
            is_active=is_active,
            is_staff=is_staff,
            is_group_leader=is_group_leader,
            phone_number=phone_number,
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.full_clean()
        user.save(self._db)
        return user

    def create_superuser(self, email, password=None):
        """Create and save a SuperUser with the given email and password."""
        user = self.create_user(
            email=email,
            is_active=True,
            is_admin=True,
            password=password,
        )

        user.is_superuser = True
        user.save(using=self._db)

        return user
