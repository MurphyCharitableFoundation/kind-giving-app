"""Campaign Views."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CampaignViewSet, CommentViewSet, campaign_comments

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"comments", CommentViewSet)

urlpatterns = [
    # order matters!
    path(
        "campaigns/<int:campaign_id>/comments/",
        campaign_comments,
        name="campaign-comments-list",
    ),
    path("", include(router.urls)),
]
