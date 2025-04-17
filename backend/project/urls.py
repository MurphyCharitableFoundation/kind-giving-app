"""Project urls."""

from django.urls import include, path

from .views import (
    AssignBeneficiaryAPI,
    CauseListCreateAPI,
    CauseRetrieveUpdateDestroyAPI,
    ListAssignmentsAPI,
    ProjectListCreateAPI,
    ProjectRetrieveUpdateDestroyAPI,
    UnassignBeneficiaryAPI,
)

cause_patterns = [
    path("", CauseListCreateAPI.as_view(), name="list-create"),
    path(
        "<int:cause_id>/",
        CauseRetrieveUpdateDestroyAPI.as_view(),
        name="detail",
    ),
]

project_patterns = [
    path(
        "",
        ProjectListCreateAPI.as_view(),
        name="list-create",
    ),
    path(
        "<int:project_id>/",
        ProjectRetrieveUpdateDestroyAPI.as_view(),
        name="detail",
    ),
    path(
        "<int:project_id>/assign/",
        AssignBeneficiaryAPI.as_view(),
        name="assign-beneficiary",
    ),
    path(
        "<int:project_id>/unassign/",
        UnassignBeneficiaryAPI.as_view(),
        name="unassign-beneficiary",
    ),
    path(
        "<int:project_id>/assignments/",
        ListAssignmentsAPI.as_view(),
        name="list-beneficiary",
    ),
]

urlpatterns = [
    path("causes/", include((cause_patterns, "causes"))),
    path("projects/", include((project_patterns, "projects"))),
]
