"""Project selectors."""

from typing import Optional

from django.db.models import Sum
from django.db.models.query import QuerySet

from campaign.models import Campaign
from core.services import Amount, to_money
from core.utils import get_object
from donation.models import Donation
from project.filters import ProjectAssignmentFilter, ProjectFilter
from project.models import Project, ProjectAssignment


def project_get(project_id: int) -> Optional[Project]:
    """Retrieve project."""
    c = get_object(Project, id=project_id)

    return c


def project_list(*, filters=None) -> QuerySet[Project]:
    """Retrieve projects."""
    filters = filters or {}
    qs = Project.objects.all()
    return ProjectFilter(filters, qs).qs


def project_beneficiary_list(project_id: int, filters=None) -> QuerySet[ProjectAssignment]:
    """
    Retrieve beneficiaries of project.

    Example:
    project_beneficiary_list(
        project_id=5,
        filters={"assignable_type": "User"},
    )
    -> User beneficiaries for project 5.
    """
    filters = filters or {}
    qs = ProjectAssignment.objects.filter(project_id=project_id)
    return ProjectAssignmentFilter(filters, qs).qs


def project_campaigns(project: Project) -> QuerySet[Campaign]:
    """Campaigns for project."""
    return project.campaigns.all()


def project_donations(project: Project) -> QuerySet[Donation]:
    """Donations for project."""
    return Donation.objects.filter(campaign__project=project)


def project_donations_total(project: Project) -> Amount:
    """Total donations for project."""
    total = project_donations(project).aggregate(total=Sum("amount"))["total"] or 0

    return to_money(total)


def project_donations_total_percentage(project: Project) -> int:
    """Total donations percentage of project target."""
    total_donated = project_donations_total(project)

    if total_donated:
        percentage = (total_donated / project.target) * 100
        return min(int(percentage), 100)

    return 0
