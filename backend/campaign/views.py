
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Campaign
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import CampaignSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

# View all campaigns
def campaign_list(request):
    campaigns = Campaign.objects.all()
    return render(request, 'campaign/campaign_list.html', {'campaigns': campaigns})

def campaign_detail(request, pk):
    campaign = get_object_or_404(Campaign, pk=pk)
    return render(request, 'campaign/campaign_detail.html', {'campaign': campaign})



def home(request):
    return HttpResponse("Welcome to the Kind Giving App!")  

