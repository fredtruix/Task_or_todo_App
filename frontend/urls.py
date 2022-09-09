
from django.urls import path
from .views import listView


urlpatterns = [
    path('', listView, name="list-view")
]