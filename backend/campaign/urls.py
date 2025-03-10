"""Campaign Views."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CampaignViewSet

router = DefaultRouter()
router.register(r"", CampaignViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
