# This script uses only Python standard library modules - no pip install required
import requests
import sys

def disable_pagination_jam():
    """
    Disable the jamPagination fault
    Returns True if successful, False otherwise
    """
    url = "https://glitch-cart-demo.vercel.app/api/faults/jamPagination/disable"
    
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print("✅ Successfully disabled the pagination jam fault")
            return True
        else:
            print(f"❌ Failed to disable pagination jam fault. Status code: {response.status_code}")
            return False
    except requests.RequestException as e:
        print(f"❌ Error occurred: {str(e)}")
        return False

if __name__ == "__main__":
    success = disable_pagination_jam()
    sys.exit(0 if success else 1) 