# stocks/urls.py
from django.urls import path
from .views import (
    StockDataListAPIView,
    StockDataCreateAPIView,
    StockDataUpdateAPIView,
    StockDataDeleteAPIView,
)

urlpatterns = [
    path('api/stocks/', StockDataListAPIView.as_view(), name='stock-data-list'),
    path('api/stocks/create/', StockDataCreateAPIView.as_view(), name='stock-data-create'),
    path('api/stocks/<int:pk>/update/', StockDataUpdateAPIView.as_view(), name='stock-data-update'),
    path('api/stocks/<int:pk>/delete/', StockDataDeleteAPIView.as_view(), name='stock-data-delete'),
]
