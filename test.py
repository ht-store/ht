import pandas as pd
import random
import string

def generate_serial_number(length=12):
    """Generate a random serial number for iPhone."""
    return f'DYMX{random.randint(1000,9999)}{random.choice(string.ascii_uppercase)}'

def create_iphone_sku_serial_demo(num_entries=50):
    """
    Create a demo spreadsheet of iPhone SKUs and Serial Numbers
    
    Args:
        num_entries (int): Number of entries to generate
    """
    # iPhone models
    models = ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15']
    
    # Generate data
    data = {
        'SKU ID': [f"SKU-IPHONE-{model.replace(' ', '')}-{random.randint(1000,9999)}" for model in random.choices(models, k=num_entries)],
        'Serial Number': [generate_serial_number() for _ in range(num_entries)]
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to Excel
    df.to_excel('iphone_sku_serial_demo.xlsx', index=False)
    
    return df

# Generate and display the demo
result = create_iphone_sku_serial_demo()
print(result)