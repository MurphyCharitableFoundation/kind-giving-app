from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, ProjectListView

router = DefaultRouter()
router.register(r'', CampaignViewSet) 
router.register(r'projects', ProjectListView)  # Register ProjectViewSet for /projects/ endpoint

urlpatterns = [
    path('', views.campaign_list, name='campaign_list'),
    path('<int:pk>/', views.campaign_detail, name='campaign_detail'),
    path('', include(router.urls)),
]


