"""Project models."""

from django.contrib.auth import get_user_model
from django.db import models
from djmoney.models.fields import MoneyField
from model_utils.models import TimeStampedModel
from user.models import UserGroup

User = get_user_model()


class Cause(models.Model):
    """
    Represents a cause or category to which a project can belong.

    For example: 'Education', 'Environment', 'Healthcare', etc.
    """

    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Human-readable name of the cause.",
    )
    description = models.TextField(
        blank=True, null=True, help_text="Longer explanation of the cause."
    )
    icon = models.ImageField(
        upload_to="causes/",
        blank=True,
        null=True,
        help_text="Optional image or icon representing the cause.",
    )

    def __str__(self):
        return f"Cause: {self.name}"

    def save(self, *args, **kwargs):
        """
        Save.

        Ensure name is always lowercase.
        """
        if self.name:
            self.name = self.name.lower()
        super().save(*args, **kwargs)

    @classmethod
    def create_cause(cls, name, description="", icon=None):
        """
        Create or retrieve a Cause instance with the given name,
        ensuring the name is always saved in lowercase.

        Returns a tuple (cause, created),
        where 'created' is a boolean indicating
        whether a new instance was created.
        """
        name_lower = name.lower()
        defaults = {"description": description}
        if icon:
            defaults["icon"] = icon
        cause, created = cls.objects.get_or_create(
            name=name_lower, defaults=defaults
        )
        return cause, created


class Project(TimeStampedModel):
    """Represents a fundraising or campaign project."""

    name = models.CharField(
        max_length=255, help_text="Short name or title of the project."
    )
    img = models.ImageField(
        upload_to="projects/",
        blank=True,
        null=True,
        help_text="Optional main image representing the project.",
    )
    causes = models.ManyToManyField(
        Cause,
        related_name="projects",
        blank=True,
        help_text="One or more causes that this project addresses.",
    )
    target = MoneyField(
        max_digits=14,
        decimal_places=2,
        default_currency="USD",
        help_text="Financial target (money) the project aims to raise.",
    )
    campaign_limit = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Maximum number of campaigns or participants allowed.",
    )
    city = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="City of the project.",
    )
    country = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Country of the project.",
    )

    def __str__(self):
        return f"Project: {self.name}"

    @classmethod
    def create_project(cls, name, target, causes=None, **kwargs):
        """
        Create or retrieve a project with a given ID, name, and target amount.

        'causes' can be Union[List[str], List[Cause]]
        Additional fields (e.g., campaign_limit, location) can be passed in
        kwargs.
        Returns (project, created).
        """
        project, created = cls.objects.get_or_create(
            name=name, defaults={"target": target, **kwargs}
        )
        if created and causes:
            cause_objects = []
            for c in causes:
                if isinstance(c, Cause):
                    cause_objects.append(c)
                else:
                    try:
                        cause_obj, _ = Cause.create_cause(name=name)
                        cause_objects.append(cause_obj)
                    except Cause.DoesNotExist:
                        pass
            project.causes.set(cause_objects)
            project.save()

        return project, created


class ProjectAssignment(models.Model):
    """
    Represent an assignment of a project to an entity.
    (e.g. a User or a UserGroup).

    The 'assignable_type' indicates the type of entity,
    and 'assignable_id' references its primary key.
    """

    ASSIGNABLE_TYPE_CHOICES = [
        ("User", "User"),
        ("UserGroup", "UserGroup"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="assignments",
        help_text="Project to which this assignment belongs.",
    )
    assignable_type = models.CharField(
        max_length=50,
        choices=ASSIGNABLE_TYPE_CHOICES,
        help_text="Whether this assignment is for a User or a UserGroup.",
    )
    assignable_id = models.PositiveIntegerField(
        help_text="Primary key of the assigned entity (User or UserGroup)."
    )

    def __str__(self):
        return f"ProjectAssignment: '{self.project.name}'"

    @classmethod
    def assign_beneficiary(cls, project, beneficiary):
        """
        Assigns a beneficiary to a project.

        The beneficiary must be an instance of either
        User or UserGroup. Assumes the beneficiary exists.
        Should prevent duplicate assignments for the same project
        and beneficiary.

        Returns a tuple (assignment, created), where 'created' is True
        if a new assignment was created, or False if one already existed.
        """
        if isinstance(beneficiary, User):
            assignable_type = "User"
            assignable_id = beneficiary.pk
        elif isinstance(beneficiary, UserGroup):
            assignable_type = "UserGroup"
            assignable_id = beneficiary.pk
        else:
            raise ValueError(
                "Beneficiary must be an instance of User or UserGroup."
            )

        assignment, created = cls.objects.get_or_create(
            project=project,
            assignable_type=assignable_type,
            assignable_id=assignable_id,
        )
        return assignment, created

    @classmethod
    def unassign_beneficiary(cls, project, beneficiary):
        """
        Removes an assignment for the given project and beneficiary.

        Returns True if an assignment was found and deleted, otherwise False.
        """
        if isinstance(beneficiary, User):
            assignable_type = "User"
            assignable_id = beneficiary.pk
        elif isinstance(beneficiary, UserGroup):
            assignable_type = "UserGroup"
            assignable_id = beneficiary.pk
        else:
            raise ValueError(
                "Beneficiary must be an instance of User or UserGroup."
            )

        qs = cls.objects.filter(
            project=project,
            assignable_type=assignable_type,
            assignable_id=assignable_id,
        )
        if qs.exists():
            qs.delete()
            return True
        return False

    @classmethod
    def assignments_for(cls, project):
        """Retrieves all assignments for a given project."""
        return cls.objects.filter(project=project)

    @classmethod
    def reassign(cls, project, old_beneficiary, new_beneficiary):
        """
        Updates the assignment from one beneficiary to another.

        Returns the updated assignment or None if not found.
        """
        if isinstance(old_beneficiary, User):
            old_type = "User"
            old_id = old_beneficiary.pk
        elif isinstance(old_beneficiary, UserGroup):
            old_type = "UserGroup"
            old_id = old_beneficiary.pk
        else:
            raise ValueError(
                "Old beneficiary must be an instance of User or UserGroup."
            )

        if isinstance(new_beneficiary, User):
            new_type = "User"
            new_id = new_beneficiary.pk
        elif isinstance(new_beneficiary, UserGroup):
            new_type = "UserGroup"
            new_id = new_beneficiary.pk
        else:
            raise ValueError(
                "New beneficiary must be an instance of User or UserGroup."
            )

        try:
            assignment = cls.objects.get(
                project=project,
                assignable_type=old_type,
                assignable_id=old_id,
            )
            assignment.assignable_type = new_type
            assignment.assignable_id = new_id
            assignment.save()
            return assignment
        except cls.DoesNotExist:
            return None
