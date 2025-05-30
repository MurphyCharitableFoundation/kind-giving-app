"""Project filters."""

import django_filters

from .models import Cause, Project, ProjectAssignment


class CauseFilter(django_filters.FilterSet):
    """Cause Filter."""

    class Meta:  # noqa
        model = Cause
        fields = (
            "id",
            "name",
            "description",
        )


class ProjectFilter(django_filters.FilterSet):
    """Project Filter."""

    name = django_filters.CharFilter(lookup_expr="icontains")
    city = django_filters.CharFilter(lookup_expr="icontains")
    country = django_filters.CharFilter(lookup_expr="icontains")
    description = django_filters.CharFilter(lookup_expr="icontains")

    class Meta:  # noqa
        model = Project
        fields = (
            "id",
            "name",
            "causes",
            "status",
            "target",
            "campaign_limit",
            "description",
            "city",
            "country",
        )


class ProjectAssignmentFilter(django_filters.FilterSet):
    """ProjectAssignment Filter."""

    class Meta:  # noqa
        model = ProjectAssignment
        fields = (
            "id",
            "project",
            "assignable_type",
            "assignable_id",
        )
