"""Campaign admin."""

from django.contrib import admin
from .models import Campaign, Comment


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    """Campaign Admin."""

    list_display = ("title", "target", "created", "modified")
    search_fields = ("title", "description")
    list_filter = ("created", "modified", "end_date")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Comment Admin."""

    list_display = ("__str__", "author", "content", "created", "modified")
    search_fields = ("author",)
    list_filter = (
        "created",
        "modified",
    )
