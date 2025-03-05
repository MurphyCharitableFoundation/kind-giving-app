"""Project urls."""

from django.urls import path
from .views import CauseListCreateView, CauseRetrieveUpdateDestroyView

urlpatterns = [
    # Cause endpoints
    path("causes/", CauseListCreateView.as_view(), name="cause-list-create"),
    path(
        "causes/<int:pk>/",
        CauseRetrieveUpdateDestroyView.as_view(),
        name="cause-detail",
    ),
]
