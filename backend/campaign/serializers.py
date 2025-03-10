"""Campaign serializers."""

from django.utils.timezone import now
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError

from .models import Campaign, Comment


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Campaign Comments."""

    class Meta:
        model = Comment
        fields = ["id", "content", "campaign", "author", "parent", "created"]
        read_only_fields = ["author"]  # The author is automatically assigned

    def create(self, validated_data):
        """Create a comment."""
        request = self.context["request"]
        author = request.user

        campaign = validated_data.pop("campaign")
        parent = validated_data.pop("parent", None)

        comment = Comment.create_comment(
            content=validated_data["content"],
            campaign=campaign,
            author=author,
            parent=parent,
        )
        return comment


class CampaignSerializer(serializers.ModelSerializer):
    """Serializer for Campaigns, using `create_campaign()`."""

    comments = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            "id",
            "title",
            "description",
            "target",
            "project",
            "end_date",
            "comments",
        ]

    def get_comments(self, obj):
        """Retrieve all comments for the campaign, including replies."""
        comments = Comment.get_comments(obj, include_replies=True)
        return CommentSerializer(comments, many=True).data

    def create(self, validated_data):
        """Create a campaign."""
        request = self.context["request"]
        owner = request.user

        project = validated_data.pop("project")
        target = validated_data.pop("target")
        end_date = validated_data.pop("end_date", now().replace(year=2025, month=12, day=31))

        try:
            campaign, _ = Campaign.create_campaign(
                owner=owner,
                project=project,
                target=target,
                end_date=end_date,
                **validated_data,
            )
            return campaign
        except ValueError as e:
            raise ValidationError(detail={"non_field_errors": e}, code=status.HTTP_403_FORBIDDEN)
