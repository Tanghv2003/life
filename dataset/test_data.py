# example_usage.py
from health_data_service import HealthDataService

def main():
    # Initialize the service
    health_service = HealthDataService()
    
    # Example user and record IDs
    user_id = "67671fc9f438338fceba7540"
    record_id = "67797cc2a12f2a39e76cfa5e"
    
    # Get complete health data
    health_data = health_service.get_complete_health_data(user_id, record_id)
    
    if health_data:
        print("Health Data:", health_data)
    else:
        print("Failed to fetch health data")

if __name__ == "__main__":
    main()