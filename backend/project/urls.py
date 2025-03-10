"""Project urls."""

from django.urls import path

from .views import (
    AssignBeneficiaryView,
    CauseListCreateView,
    CauseRetrieveUpdateDestroyView,
    ListAssignmentsView,
    ProjectListCreateView,
    ProjectRetrieveUpdateDestroyView,
    UnassignBeneficiaryView,
)

urlpatterns = [
    # Cause endpoints
    path("causes/", CauseListCreateView.as_view(), name="cause-list-create"),
    path(
        "causes/<int:pk>/",
        CauseRetrieveUpdateDestroyView.as_view(),
        name="cause-detail",
    ),
    # Project endpoints
    path(
        "projects/",
        ProjectListCreateView.as_view(),
        name="project-list-create",
    ),
    path(
        "projects/<int:pk>/",
        ProjectRetrieveUpdateDestroyView.as_view(),
        name="project-detail",
    ),
    path(
        "projects/<int:project_id>/assign/",
        AssignBeneficiaryView.as_view(),
        name="assign-beneficiary",
    ),
    path(
        "projects/<int:project_id>/unassign/",
        UnassignBeneficiaryView.as_view(),
        name="unassign-beneficiary",
    ),
    path(
        "projects/<int:project_id>/assignments/",
        ListAssignmentsView.as_view(),
        name="list-assignments",
    ),
]
