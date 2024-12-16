from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Tasks
from .serializers import TaskSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import TaskFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import NotFound
from datetime import datetime,timedelta
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Q
class SearchFilter(SearchFilter):
    def get_search_results(self, request, queryset, serach_terms):
        if not serach_terms:
            return queryset, False
        serach_terms = serach_terms.split()
        queries = Q()
        for term in serach_terms:
            queries |= Q(title__icontains=term)
            queryset = queryset.filter(queries)
            return queryset, False

class TaskViewSet(ModelViewSet):
    queryset = Tasks.objects.all().order_by('due_date')
    serializer_class = TaskSerializer
    lookup_field = 'pk'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title']
    ordering_fields = ['due_date']
    ordering = ['due_date']

    def get_object(self):
        try:
            task = Tasks.objects.get(pk=self.kwargs['pk'])
            return task
        except Tasks.DoesNotExist:
            raise NotFound(detail="Task Not Found")
        
    def retrieve(self, request, *args, **kwargs):
        task = self.get_object()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    

class CalendarTasksView(APIView):
    def get(self,request,*args, **kwargs):
        year = request.GET.get('year')
        month = request.GET.get('month')

        try:
            year = int(year)
            month = int(month)
        except ValueError:
            return Response({"error":"Invalid year or month"},status=status.HTTP_400_BAD_REQUEST)

        first_day = datetime(year, month, 1)
        if month == 12:
            last_day = datetime(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = datetime(year, month+1, 1) - timedelta(days=1)

        tasks = Tasks.objects.filter(due_date__gte=first_day, due_date__lte=last_day)
        serializer = TaskSerializer(tasks,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)
        
         