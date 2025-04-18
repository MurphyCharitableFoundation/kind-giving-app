"""Project Serializers."""

from rest_framework import serializers

from .models import ProjectAssignment


class ProjectAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for ProjectAssignment."""

    assignable_type = serializers.ChoiceField(choices=ProjectAssignment.ASSIGNABLE_TYPE_CHOICES)
    assignable_id = serializers.IntegerField()

    class Meta:  # noqa
        model = ProjectAssignment
        fields = ["id", "project", "assignable_type", "assignable_id"]
        read_only_fields = ["id", "project"]
