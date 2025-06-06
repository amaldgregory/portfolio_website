from django.urls import path
from .views import community_wall

urlpatterns = [
    path('', community_wall, name='community_wall'),
]
