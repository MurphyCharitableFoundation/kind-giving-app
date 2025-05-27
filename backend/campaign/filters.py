"""Campaign filters."""

import django_filters

from .models import Campaign, Comment


class CampaignFilter(django_filters.FilterSet):
    """Campaign Filter."""

    class Meta:  # noqa
        model = Campaign
        fields = (
            "id",
            "title",
            "description",
            "target",
            "project",
            "owner",
            "end_date",
        )


class CommentFilter(django_filters.FilterSet):
    """Comment Filter."""

    class Meta:  # noqa
        model = Comment
        fields = (
            "id",
            "content",
            "campaign",
            "author",
            "parent",
        )
