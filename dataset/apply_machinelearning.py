import time
import pandas as pd
import joblib
from pymongo import MongoClient
from datetime import datetime
from connect import HealthDataService

class HealthMLService:
    def __init__(self, base_url="http://localhost:3001", mongo_url="mongodb+srv://tanghvinfo:bhXe73BqgvB2QgTk@clusterlife.kc56d.mongodb.net/hust_life"):
        """Initialize the service with models, health data connection, and MongoDB Atlas"""
        self.health_service = HealthDataService(base_url=base_url)
        self.models, self.scaler, self.encoders = self.load_saved_models()
        self.mongo_client = MongoClient(mongo_url)
        self.db = self.mongo_client["hust_life"]

    def load_saved_models(self):
        """Load all saved models and components"""
        models = {}
        for model_name in ['Logistic_Regression', 'Random_Forest']:
            model_path = f'saved_models/{model_name}'
            models[model_name] = {
                'model': joblib.load(f'{model_path}/model.joblib'),
                'config': joblib.load(f'{model_path}/config.joblib')
            }
        
        scaler = joblib.load('saved_models/scaler.joblib')
        encoders = joblib.load('saved_models/encoders.joblib')
        return models, scaler, encoders

    def prepare_health_data(self, health_data):
        """Convert health service data to model-compatible format"""
        formatted_data = pd.DataFrame([{
            'BMI': float(health_data['BMI']),
            'Smoking': health_data['Smoking'],
            'AlcoholDrinking': health_data['AlcoholDrinking'],
            'Stroke': health_data['Stroke'],
            'PhysicalHealth': float(health_data['PhysicalHealth']),
            'MentalHealth': float(health_data['MentalHealth']),
            'DiffWalking': health_data['DiffWalking'],
            'Sex': health_data['Sex'],
            'AgeCategory': health_data['AgeCategory'],
            'Race': health_data['Race'],
            'Diabetic': health_data['Diabetic'],
            'PhysicalActivity': health_data['PhysicalActivity'],
            'GenHealth': health_data['GenHealth'],
            'SleepTime': float(health_data['SleepTime']),
            'Asthma': health_data['Asthma'],
            'KidneyDisease': health_data['KidneyDisease'],
            'SkinCancer': health_data['SkinCancer']
        }])
        return formatted_data

    def prepare_for_prediction(self, data):
        """Prepare data for model prediction"""
        prepared_data = data.copy()
        
        # Binary encoding
        binary_cols = ['Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 
                      'Sex', 'PhysicalActivity', 'Asthma', 'KidneyDisease', 'SkinCancer']
        le = self.encoders['label_encoder']
        for col in binary_cols:
            prepared_data[col] = le.fit_transform(prepared_data[col])
        
        # Ordinal encoding
        ordinal_cols = ['GenHealth', 'AgeCategory']
        oe = self.encoders['ordinal_encoder']
        prepared_data[ordinal_cols] = oe.transform(prepared_data[ordinal_cols])
        
        # One-hot encoding
        prepared_data = pd.get_dummies(prepared_data, columns=['Race', 'Diabetic'])
        
        # Ensure all feature columns are present
        feature_names = self.models['Logistic_Regression']['config']['feature_names']
        for col in feature_names:
            if col not in prepared_data.columns:
                prepared_data[col] = 0
                
        # Reorder columns to match training data
        prepared_data = prepared_data[feature_names]
        
        return prepared_data

    def predict_heart_disease(self, prepared_data):
        """Make predictions using both models"""
        # Scale the data
        scaled_data = self.scaler.transform(prepared_data)
        
        results = []
        for model_name, model_info in self.models.items():
            model = model_info['model']
            predictions = model.predict(scaled_data)
            probabilities = model.predict_proba(scaled_data)
            
            results.append({
                'model': model_name,
                'prediction': 'Heart Disease' if predictions[0] == 1 else 'No Heart Disease',
                'probability': f"{probabilities[0][1]:.2%}"
            })
        
        return results

    def save_predictions_to_mongodb(self, predictions, user_id, collection_name="new_predictions"):
        """Save the predictions into a specified MongoDB collection"""
        collection = self.db[collection_name]
        
        # Remove old predictions for the same user
        collection.delete_many({"user_id": user_id})
        
        # Insert new predictions
        record = {
            "user_id": user_id,
            "predictions": predictions,
            "created_at": datetime.utcnow().isoformat()  # Save current UTC time in ISO 8601 format
        }
        result = collection.insert_one(record)
        print(f"Prediction saved to MongoDB in collection '{collection_name}' with ID: {result.inserted_id}")

    def analyze_health_data(self, user_id, record_id, collection_name="new_predictions"):
        """Fetch health data, perform heart disease prediction, and save results"""
        try:
            # Get health data from service
            health_data = self.health_service.get_complete_health_data(user_id, record_id)
            
            if not health_data:
                raise ValueError("Failed to fetch health data")

            print("\nRetrieved health data:")
            for key, value in health_data.items():
                print(f"{key}: {value}")

            # Prepare data for prediction
            formatted_data = self.prepare_health_data(health_data)
            prepared_data = self.prepare_for_prediction(formatted_data)
            
            # Make predictions
            predictions = self.predict_heart_disease(prepared_data)
            
            # Save predictions to MongoDB
            self.save_predictions_to_mongodb(predictions, user_id, collection_name)
            
            return {
                'predictions': predictions
            }
        
        except Exception as e:
            raise Exception(f"Analysis failed: {str(e)}")