"""Campaign Views."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CampaignViewSet, CommentViewSet

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"comments", CommentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
