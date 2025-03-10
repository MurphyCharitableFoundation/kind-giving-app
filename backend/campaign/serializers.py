"""Campaign serializers."""

from rest_framework import serializers

from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    """Campaign Serializer."""

    project_name = serializers.CharField(source="project.name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id",
            "title",
            "description",
            "target",
            "project",
            "project_name",
            "user",
            "user_email",
            "created",
            "modified",
        ]
        read_only_fields = [
            "project_name",
            "user_email",
            "created",
            "modified",
        ]
