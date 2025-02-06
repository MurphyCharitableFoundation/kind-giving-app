from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet

router = DefaultRouter()
router.register(r'', CampaignViewSet) 

urlpatterns = [
    path('', views.campaign_list, name='campaign_list'),
    path('<int:pk>/', views.campaign_detail, name='campaign_detail'),
    path('', include(router.urls)),
]


