# This script uses only Python standard library modules - no pip install required
import requests
import sys
import time

def test_add_to_cart(product_id="2", quantity=1):
    """
    Test the add to cart functionality
    Returns True if successful (200 status code), False otherwise
    """
    url = "http://localhost:3130/api/cart"
    payload = {
        "productId": product_id,
        "quantity": quantity
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.status_code == 200
    except requests.RequestException:
        return False

def monitor_cart(max_retries=1):
    """
    Monitor the add to cart functionality
    Args:
        max_retries: Number of times to retry before exiting with failure
    Returns:
        True if all checks pass, False if any check fails
    """
    print("🔍 Starting Add to Cart Monitoring")
    print(f"Will exit on failure after {max_retries} {'retry' if max_retries == 1 else 'retries'}")
    print("-" * 50)

    try:
        retry_count = 0
        while retry_count < max_retries:
            if test_add_to_cart():
                return True
            retry_count += 1
            if retry_count < max_retries:
                time.sleep(1)
        return False
    
    except KeyboardInterrupt:
        print("\n✋ Monitoring stopped by user")
        return False

if __name__ == "__main__":
    sys.exit(0 if monitor_cart() else 1) 