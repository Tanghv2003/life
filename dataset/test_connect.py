import requests
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

BASE_URL = "http://localhost:3001/medical"
DAILY_CHECK_URL = "http://localhost:3001/daily-check"
USER_URL = "http://localhost:3001/users"

def get_health_record_by_id(record_id: str, base_url: str = BASE_URL) -> Dict[str, Any]:
    try:
        response = requests.get(f"{base_url}/{record_id}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching health record with ID {record_id}: {str(e)}")
        raise

def get_user(user_id: str) -> Dict[str, Any]:
    try:
        response = requests.get(f"{USER_URL}/{user_id}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching user with ID {user_id}: {str(e)}")
        raise

def get_user_bmi(user_id: str) -> Dict[str, Any]:
    try:
        response = requests.get(f"{USER_URL}/{user_id}/bmi")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching BMI for user {user_id}: {str(e)}")
        raise

def get_good_physical_health_days() -> Dict[str, Any]:
    try:
        response = requests.get(f"{DAILY_CHECK_URL}/physical-health/good-days/last-30-days")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching good physical health days: {str(e)}")
        raise

def get_good_mental_health_days() -> Dict[str, Any]:
    try:
        response = requests.get(f"{DAILY_CHECK_URL}/mental-health/good-days/last-30-days")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching good mental health days: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        record_id = "67797cc2a12f2a39e76cfa5e"
        record = get_health_record_by_id(record_id)
        print("Fetched record:", record)
        
        user_id = "67671fc9f438338fceba7540"
        user = get_user(user_id)
        print("User information:", user)
        
        physical_health_days = get_good_physical_health_days()
        print("Good physical health days:", physical_health_days)

        mental_health_days = get_good_mental_health_days()
        print("Good mental health days:", mental_health_days)
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {str(e)}")
