"""Project Serializers."""

from rest_framework import serializers

from .models import Cause, Project, ProjectAssignment
from .selectors import project_donations_total_percentage


class CauseSerializer(serializers.ModelSerializer):
    """Cause Serializer."""

    class Meta:  # noqa
        model = Cause
        fields = ["id", "name", "description", "icon"]

    def validate_name(self, value):
        """Ensure name is always lowercase."""
        return value.lower()


class ProjectSerializer(serializers.ModelSerializer):
    """Project Serializer."""

    donation_percentage = serializers.SerializerMethodField()

    # Read-only: Display causes as a list of names
    causes = serializers.SlugRelatedField(
        many=True,
        queryset=Cause.objects.all(),
        slug_field="name",
        required=False,
    )

    # Write-only: Accept cause names for creation/update
    causes_names = serializers.ListField(child=serializers.CharField(), required=False, write_only=True)

    class Meta:  # noqa
        model = Project
        fields = [
            "id",
            "name",
            "img",
            "causes",  # Read-only
            "causes_names",  # Write-only
            "target",
            "campaign_limit",
            "city",
            "country",
            "description",
            "status",
            "donation_percentage",
        ]
        read_only_fields = ["causes"]

    def get_donation_percentage(self, project):  # noqa
        return project_donations_total_percentage(project)

    def create(self, validated_data):
        """Ensure causes exist before creating a project."""
        causes_names = validated_data.pop("causes_names", [])

        # Use existing method to create project and ensure causes exist
        project, _ = Project.create_project(
            causes=causes_names,
            **validated_data,
        )
        return project

    def update(self, instance, validated_data):
        """Update project details and causes if provided."""
        causes_names = validated_data.pop("causes_names", None)

        # Update the fields that were provided in the request
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If causes_names is provided, update the causes relationship
        if causes_names is not None:
            cause_objects = [Cause.create_cause(name)[0] for name in causes_names]
            instance.causes.set(cause_objects)

        instance.save()
        return instance


class ProjectAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for ProjectAssignment."""

    assignable_type = serializers.ChoiceField(choices=ProjectAssignment.ASSIGNABLE_TYPE_CHOICES)
    assignable_id = serializers.IntegerField()

    class Meta:  # noqa
        model = ProjectAssignment
        fields = ["id", "project", "assignable_type", "assignable_id"]
        read_only_fields = ["id", "project"]
