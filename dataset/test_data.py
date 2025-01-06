# test_data.py
from test_connect import HealthDataService

def main():
    # Initialize the service
    health_service = HealthDataService(base_url="http://localhost:3001")
    
    # Example user and record IDs
    user_id = "67671fc9f438338fceba7540"
    record_id = "67797cc2a12f2a39e76cfa5e"
    
    try:
        # Get complete health data
        health_data = health_service.get_complete_health_data(user_id, record_id)
        
        if health_data:
            print("Successfully retrieved health data:")
            for key, value in health_data.items():
                print(f"{key}: {value}")
        else:
            print("Failed to fetch health data")
            
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    main()