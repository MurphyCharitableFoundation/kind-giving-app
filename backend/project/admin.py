"""Project admin."""

from django.contrib import admin
from .models import Cause, Project, ProjectAssignment


@admin.register(Cause)
class CauseAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "icon")
    search_fields = ("name",)
    ordering = ("name",)
    list_filter = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "target",
        "campaign_limit",
        "city",
        "country",
        "created",
        "modified",
    )
    search_fields = ("name", "city", "country")
    ordering = ("-created",)
    list_filter = ("city", "country", "created")


@admin.register(ProjectAssignment)
class ProjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "assignable_type", "assignable_id")
    search_fields = ("project__name",)
    list_filter = ("assignable_type", "project")
    ordering = ("id",)
