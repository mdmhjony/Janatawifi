# stocks/views.py
from rest_framework import generics
from .models import StockData
from .serializers import StockDataSerializer

class StockDataListAPIView(generics.ListAPIView):
    queryset = StockData.objects.all()
    serializer_class = StockDataSerializer

class StockDataCreateAPIView(generics.CreateAPIView):
    queryset = StockData.objects.all()
    serializer_class = StockDataSerializer

class StockDataUpdateAPIView(generics.UpdateAPIView):
    queryset = StockData.objects.all()
    serializer_class = StockDataSerializer
    lookup_field = 'pk'  # Specify the lookup field for the update operation
    
class StockDataDeleteAPIView(generics.DestroyAPIView):
    queryset = StockData.objects.all()
    serializer_class = StockDataSerializer
    lookup_field = 'pk'  # Specify the lookup field for the delete operation