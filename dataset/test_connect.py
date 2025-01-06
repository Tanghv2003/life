# test_connect.py
import requests
from typing import Dict, Any, Optional
import logging
from datetime import datetime

class HealthDataService:
    """Service class to handle health data operations"""
    
    def __init__(self, base_url: str = "http://localhost:3001"):
        """Initialize the service with base URL"""
        self.base_url = base_url
        self.medical_url = f"{base_url}/medical"
        self.daily_check_url = f"{base_url}/daily-check"
        self.user_url = f"{base_url}/users"
        
        # Setup logging
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)
    
    def calculate_age_category(self, birth_date_str: str) -> str:
        """Calculate age category based on birth date."""
        try:
            birth_date = datetime.fromisoformat(birth_date_str.replace('Z', '+00:00'))
            current_date = datetime.now()
            age = current_date.year - birth_date.year - (
                (current_date.month, current_date.day) < (birth_date.month, birth_date.day)
            )
            
            age_ranges = [
                (0, 24, '18-24'),
                (25, 29, '25-29'),
                (30, 34, '30-34'),
                (35, 39, '35-39'),
                (40, 44, '40-44'),
                (45, 49, '45-49'),
                (50, 54, '50-54'),
                (55, 59, '55-59'),
                (60, 64, '60-64'),
                (65, 69, '65-69'),
                (70, 74, '70-74'),
                (75, 79, '75-79'),
                (80, float('inf'), '80 or older')
            ]
            
            for min_age, max_age, category in age_ranges:
                if min_age <= age <= max_age:
                    return category
            return '18-24'  # Default category if no match found
        except Exception as e:
            self.logger.error(f"Error calculating age category: {str(e)}")
            return '18-24'  # Return default category on error

    def get_health_record(self, record_id: str) -> Dict[str, Any]:
        """Get health record by ID"""
        try:
            response = requests.get(f"{self.medical_url}/{record_id}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error getting health record: {str(e)}")
            return {}

    def get_user(self, user_id: str) -> Dict[str, Any]:
        """Get user information by ID"""
        try:
            response = requests.get(f"{self.user_url}/{user_id}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error getting user info: {str(e)}")
            return {}

    def get_user_bmi(self, user_id: str) -> Dict[str, Any]:
        """Get user BMI data by ID"""
        try:
            response = requests.get(f"{self.user_url}/{user_id}/bmi")
            response.raise_for_status()
            data = response.json()
            if isinstance(data, dict) and 'bmi' in data:
                return {'bmi': float(data['bmi'])}
            return {'bmi': 0.0}
        except (requests.exceptions.RequestException, ValueError) as e:
            self.logger.error(f"Error getting BMI data: {str(e)}")
            return {'bmi': 0.0}

    def get_good_physical_health_days(self) -> int:
        """
        Get the number of good physical health days in the last 30 days
        Returns:
            int: Number of good physical health days, or 0 if there's an error
        """
        try:
            response = requests.get(f"{self.daily_check_url}/physical-health/good-days/last-30-days")
            response.raise_for_status()
            data = response.json()
            return data
        except (requests.exceptions.RequestException, ValueError, KeyError) as e:
            self.logger.error(f"Error fetching good physical health days: {str(e)}")
            return 0

    def get_good_mental_health_days(self) -> int:
        """
        Get the number of good mental health days in the last 30 days
        Returns:
            int: Number of good mental health days, or 0 if there's an error
        """
        try:
            response = requests.get(f"{self.daily_check_url}/mental-health/good-days/last-30-days")
            response.raise_for_status()
            data = response.json()
            return data
        except (requests.exceptions.RequestException, ValueError, KeyError) as e:
            self.logger.error(f"Error fetching good mental health days: {str(e)}")
            return 0

    def convert_health_data(
        self,
        medical_record: Dict[str, Any],
        user_info: Dict[str, Any],
        physical_health_days: int,
        mental_health_days: int,
        bmi_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Convert health data from the original format to the desired format."""
        try:
            def bool_to_yes_no(value: bool) -> str:
                return 'Yes' if value else 'No'
            
            bmi_value = float(bmi_data.get('bmi', 0.0))
            
            return {
                'BMI': bmi_value,
                'Smoking': bool_to_yes_no(medical_record.get('smoking', False)),
                'AlcoholDrinking': bool_to_yes_no(medical_record.get('alcoholDrinking', False)),
                'Stroke': bool_to_yes_no(medical_record.get('stroke', False)),
                'PhysicalHealth': float(physical_health_days),
                'MentalHealth': float(mental_health_days),
                'DiffWalking': bool_to_yes_no(medical_record.get('diffWalking', False)),
                'Sex': user_info.get('gender', 'Male'),
                'AgeCategory': self.calculate_age_category(user_info.get('dateOfBirth', '2000-01-01')),
                'Race': medical_record.get('race', 'White'),
                'Diabetic': bool_to_yes_no(medical_record.get('diabetic', False)),
                'PhysicalActivity': bool_to_yes_no(medical_record.get('physicalActivity', False)),
                'GenHealth': medical_record.get('genHealth', 'Very good'),
                'SleepTime': float(medical_record.get('sleepTime', 7)),
                'Asthma': bool_to_yes_no(medical_record.get('asthma', False)),
                'KidneyDisease': bool_to_yes_no(medical_record.get('kidneyDisease', False)),
                'SkinCancer': bool_to_yes_no(medical_record.get('skinCancer', False))
            }
        except Exception as e:
            self.logger.error(f"Error converting health data: {str(e)}")
            return {}

    def get_complete_health_data(self, user_id: str, record_id: str) -> Optional[Dict[str, Any]]:
        """
        Get and convert complete health data for a user.
        Returns None if any required data is missing.
        """
        try:
            # Fetch all required data
            record = self.get_health_record(record_id)
            user = self.get_user(user_id)
            bmi_data = self.get_user_bmi(user_id)
            physical_health_days = self.get_good_physical_health_days()
            mental_health_days = self.get_good_mental_health_days()
            
            # Check if we have minimum required data
            if not record or not user:
                self.logger.error("Missing required data: health record or user info")
                return None
            
            # Convert and return the data
            return self.convert_health_data(
                record,
                user,
                physical_health_days,
                mental_health_days,
                bmi_data
            )
            
        except Exception as e:
            self.logger.error(f"Error getting complete health data: {str(e)}")
            return None