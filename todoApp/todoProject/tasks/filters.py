from django_filters import rest_framework as filters
from .models import Tasks

class TaskFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name='due_date',lookup_expr='gte')
    end_date = filters.DateFilter(field_name='due_date',lookup_expr='lte')

    class Meta:
        model = Tasks
        fields = ['status','start_date','end_date']
