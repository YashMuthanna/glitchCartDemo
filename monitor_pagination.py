# This script uses only Python standard library modules - no pip install required
import requests
import sys
import time

def test_pagination(page=2):
    """
    Test the pagination functionality
    Returns True if successful (200 status code), False otherwise
    """
    url = "https://glitch-cart-demo.vercel.app/api/products"
    params = {"page": page}

    try:
        response = requests.get(url, params=params)
        if response.status_code == 503 and response.json().get("code") == "PAGINATION_JAMMED":
            print("❌ Pagination is jammed - Service degraded")
            return False
        return response.status_code == 200
    except requests.RequestException:
        return False

def monitor_pagination(max_retries=1):
    """
    Monitor the pagination functionality
    Args:
        max_retries: Number of times to retry before exiting with failure
    Returns:
        True if all checks pass, False if any check fails
    """
    print("🔍 Starting Pagination Monitoring")
    print(f"Will exit on failure after {max_retries} {'retry' if max_retries == 1 else 'retries'}")
    print("-" * 50)

    try:
        retry_count = 0
        while retry_count < max_retries:
            if test_pagination():
                print("✅ Pagination system healthy - Page 2 accessible")
                return True
                
            print("❌ Pagination fault detected - Cannot access page 2")
            retry_count += 1
            
            if retry_count < max_retries:
                print(f"Retrying in 1 second... (Attempt {retry_count + 1}/{max_retries})")
                time.sleep(1)
        
        return False
    
    except KeyboardInterrupt:
        print("\n✋ Monitoring stopped by user")
        return False

if __name__ == "__main__":
    success = monitor_pagination(max_retries=1)
    sys.exit(0 if success else 1) 