"""Project selectors."""

from django.db.models import Sum
from django.db.models.query import QuerySet

from core.services import Amount, to_money
from donation.models import Donation

from .models import Project


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
