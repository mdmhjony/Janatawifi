import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

# Now you can import your models and load data
from stocks.models import StockData
import json
from datetime import datetime

def load_data_from_json(file_path):
    with open(file_path) as f:
        data = json.load(f)
        for item in data:
            StockData.objects.create(
                date=datetime.strptime(item['date'], '%Y-%m-%d').date(),
                trade_code=item['trade_code'],
                high=float(item['high'].replace(',', '')),
                low=float(item['low'].replace(',', '')),
                open=float(item['open'].replace(',', '')),
                close=float(item['close'].replace(',', '')),
                volume=int(item['volume'].replace(',', ''))
            )

if __name__ == "__main__":
    load_data_from_json("stock_market_data.json")  # Replace "data.json" with your JSON file path
