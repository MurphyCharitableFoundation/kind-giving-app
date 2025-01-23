from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class UserGroup(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(
        max_length=15,  # Allows for international numbers
        validators=[
            RegexValidator(
                regex=r"^\+?1?\d{9,15}$",
                message=(
                    "Phone number must be entered in the format: '+999999999'. "
                    "Up to 15 digits allowed."
                ),
            )
        ],
        blank=False,
        unique=True,
    )
    interest = models.CharField(max_length=255, blank=True, null=True)
    img = models.ImageField(
        upload_to="usergroup_images/", blank=True, null=True
    )
    bank_account = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    phone_number = models.CharField(
        max_length=15,  # Allows for international numbers
        validators=[
            RegexValidator(
                regex=r"^\+?1?\d{9,15}$",
                message=(
                    "Phone number must be entered in the format: '+999999999'. "
                    "Up to 15 digits allowed."
                ),
            )
        ],
        blank=False,
        unique=True,
    )
    group_membership = models.ForeignKey(
        UserGroup,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="members",
    )
    is_group_leader = models.BooleanField(default=False)

    img = models.ImageField(upload_to="user_images/", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
