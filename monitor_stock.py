# This script uses only Python standard library modules - no pip install required
import requests
import sys
import time

def check_fakeoutofstock_status():
    """
    Check if the fakeOutOfStock fault is enabled
    Returns True if fault is enabled, False if disabled
    """
    url = "http://localhost:3130/api/faults"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            faults = response.json()
            return faults.get('fakeOutOfStock', False)
        return False
    except requests.RequestException:
        return False

def monitor_stock(max_retries=1):
    """
    Monitor the stock fault status
    Args:
        max_retries: Number of times to retry before exiting with failure
    Returns:
        True if fault is not enabled (healthy state), False if fault is enabled
    """
    print("🔍 Starting Stock Fault Monitoring")
    print(f"Will exit on failure after {max_retries} {'retry' if max_retries == 1 else 'retries'}")
    print("-" * 50)

    try:
        retry_count = 0
        while retry_count < max_retries:
            if not check_fakeoutofstock_status():
                print("✅ Stock system healthy - fakeOutOfStock fault is disabled")
                return True
                
            print("❌ Stock fault detected - fakeOutOfStock is enabled")
            retry_count += 1
            
            if retry_count < max_retries:
                print(f"Retrying in 1 second... (Attempt {retry_count + 1}/{max_retries})")
                time.sleep(1)
        
        return False
    
    except KeyboardInterrupt:
        print("\n✋ Monitoring stopped by user")
        return False

if __name__ == "__main__":
    success = monitor_stock(max_retries=1)
    sys.exit(0 if success else 1) 