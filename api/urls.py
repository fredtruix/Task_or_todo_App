from django.urls import path
from .apis import (ApiOverview, taskCreate, taskDelete, taskDetail, taskUpdate, tasklist)

urlpatterns = [
    path('', ApiOverview),
    path('task-list/', tasklist),
    path('task-detail/<str:pk>/', taskDetail),
    path('task-create/', taskCreate),
    path('task-update/<str:pk>/', taskUpdate),
    path('task-delete/<str:pk>/', taskDelete),
]
