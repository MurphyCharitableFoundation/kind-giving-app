"""Campaign Views."""

from django.urls import include, path

from .views import (
    CampaignListCreateAPI,
    CampaignRetrieveUpdateDestroyAPI,
    CommentListCreateAPI,
    CommentRetrieveUpdateDestroyAPI,
    campaign_comments,
)

campaign_patterns = [
    path("", CampaignListCreateAPI.as_view(), name="list-create"),
    path(
        "<int:campaign_id>/",
        CampaignRetrieveUpdateDestroyAPI.as_view(),
        name="detail",
    ),
    path(
        "<int:campaign_id>/comments/",
        campaign_comments,
        name="comments-list",
    ),
]

comment_patterns = [
    path("", CommentListCreateAPI.as_view(), name="list-create"),
    path(
        "<int:comment_id>/",
        CommentRetrieveUpdateDestroyAPI.as_view(),
        name="detail",
    ),
]


urlpatterns = [
    path("campaigns/", include((campaign_patterns, "campaigns"))),
    path("comments/", include((comment_patterns, "comments"))),
]
