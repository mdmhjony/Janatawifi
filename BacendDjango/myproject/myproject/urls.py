# myproject/urls.py
from django.urls import path, include

urlpatterns = [
    path('stocks/', include('stocks.urls')),
]
