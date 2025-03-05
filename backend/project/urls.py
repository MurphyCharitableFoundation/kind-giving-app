"""Project urls."""

from django.urls import path
from .views import (
    CauseListCreateView,
    CauseRetrieveUpdateDestroyView,
    ProjectListCreateView,
    ProjectRetrieveUpdateDestroyView,
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
]
