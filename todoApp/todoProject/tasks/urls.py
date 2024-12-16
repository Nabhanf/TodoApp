from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet,CalendarTasksView

router = DefaultRouter()
router.register(r'tasks',TaskViewSet, basename='task')

urlpatterns = [
    path('v2/',include(router.urls)),
    path('tasks/calendar/',CalendarTasksView.as_view(),name='calendar')
]
