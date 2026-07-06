import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'strath_caf_backend.settings')
django.setup()

from catalog.models import Category, MenuItem
from decimal import Decimal

def seed():
    print("Clearing existing catalog data...")
    Category.objects.all().delete()
    MenuItem.objects.all().delete()

    print("Creating categories...")
    categories_data = [
        {'name': 'Breakfast', 'description': 'Start your day right'},
        {'name': 'Lunch', 'description': 'Hearty midday meals'},
        {'name': 'Dinner', 'description': 'Evening specials'},
        {'name': 'Snacks', 'description': 'Quick bites'},
        {'name': 'Drinks', 'description': 'Refreshments'}
    ]
    
    categories = {}
    for cat_data in categories_data:
        cat, created = Category.objects.get_or_create(**cat_data)
        categories[cat.name] = cat

    print("Creating menu items...")
    meals_data = [
        {
            'category': categories['Breakfast'],
            'name': 'Pancakes & Syrup',
            'description': 'Fluffy pancakes served with maple syrup and butter.',
            'price': Decimal('250.00'),
            'prep_time_minutes': 10,
            'is_available': True,
            'image_url': 'https://images.unsplash.com/photo-1528207776546-382949cb3765?auto=format&fit=crop&w=500&q=60'
        },
        {
            'category': categories['Lunch'],
            'name': 'Beef Burger with Fries',
            'description': 'Juicy beef patty with cheese, lettuce, and tomatoes, served with crispy fries.',
            'price': Decimal('450.00'),
            'prep_time_minutes': 15,
            'is_available': True,
            'image_url': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60'
        },
        {
            'category': categories['Dinner'],
            'name': 'Grilled Chicken & Rice',
            'description': 'Tender grilled chicken breast served with steamed rice and vegetables.',
            'price': Decimal('550.00'),
            'prep_time_minutes': 20,
            'is_available': True,
            'image_url': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=60'
        },
        {
            'category': categories['Snacks'],
            'name': 'Samosa',
            'description': 'Crispy pastry filled with spiced minced meat.',
            'price': Decimal('50.00'),
            'prep_time_minutes': 5,
            'is_available': True,
            'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=60'
        },
        {
            'category': categories['Drinks'],
            'name': 'Mango Smoothie',
            'description': 'Freshly blended mango smoothie with yogurt.',
            'price': Decimal('150.00'),
            'prep_time_minutes': 5,
            'is_available': True,
            'image_url': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=60'
        }
    ]

    for meal_data in meals_data:
        MenuItem.objects.create(**meal_data)
        
    print("Successfully seeded catalog data!")

if __name__ == '__main__':
    seed()
