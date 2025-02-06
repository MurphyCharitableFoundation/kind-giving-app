from rest_framework import serializers
from .models import Campaign  

class CampaignSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 
            'target_amount', 'target_amount_currency', 
            'project', 'project_name', 'user', 'user_email', 'created_at'
        ]
        read_only_fields = ['project_name', 'user_email', 'created_at']
