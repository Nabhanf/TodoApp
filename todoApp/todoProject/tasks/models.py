from django.db import models

class Tasks(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True,null=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='Pending')
    due_date = models.DateField()

    def __str__(self):
        return self.title
    
