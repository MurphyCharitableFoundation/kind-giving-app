from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from .managers import UserManager

class BankAccount(models.Model):
    class AccountStatus(models.TextChoices):
        VERIFIED = "VERIFIED", _("Verified")
        PENDING = "PENDING", _("Pending")
        FAILED = "FAILED", _("Failed")

    bank_account_token_id = models.CharField(max_length=255, blank=True, null=True)
    account_status = models.CharField(
        max_length=10,
        choices=AccountStatus.choices,
        default=AccountStatus.PENDING.value
    )
    last_payout = models.DateTimeField()

    def __str__(self):
        return f"BankAccount: {self.bank_account_token_id}"

class UserGroup(models.Model):
    name = models.CharField(max_length=255)
    phone_number = PhoneNumberField(blank=True, null=True)
    interest = models.CharField(max_length=255, blank=True, null=True)
    img = models.ImageField(
        upload_to="usergroup_images/", blank=True, null=True
    )

    bank_account = models.OneToOneField(
        BankAccount,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        unique=True,
    )

    def __str__(self):
        return f"UserGroup: {self.name}"


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    phone_number = PhoneNumberField(blank=True, null=True)
    group_membership = models.ForeignKey(
        UserGroup,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="members",
    )
    is_group_leader = models.BooleanField(default=False)

    img = models.ImageField(upload_to="user_images/", blank=True, null=True)

    bank_account = models.OneToOneField(
        BankAccount,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        unique=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"User: {self.email}"
