import pandas as pd
import joblib
import os

def load_saved_models():
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

def create_sample_data():
    """Create sample data for testing"""
    sample_data = pd.DataFrame([
        {
            'BMI': 28.5,
            'Smoking': 'Yes',
            'AlcoholDrinking': 'No',
            'Stroke': 'No',
            'PhysicalHealth': 2.0,
            'MentalHealth': 2.0,
            'DiffWalking': 'No',
            'Sex': 'Male',
            'AgeCategory': '45-49',
            'Race': 'White',
            'Diabetic': 'No',
            'PhysicalActivity': 'Yes',
            'GenHealth': 'Very good',
            'SleepTime': 7.0,
            'Asthma': 'No',
            'KidneyDisease': 'No',
            'SkinCancer': 'No'
        },
        {
            'BMI': 32.0,
            'Smoking': 'Yes',
            'AlcoholDrinking': 'Yes',
            'Stroke': 'No',
            'PhysicalHealth': 10.0,
            'MentalHealth': 5.0,
            'DiffWalking': 'Yes',
            'Sex': 'Female',
            'AgeCategory': '65-69',
            'Race': 'Black',
            'Diabetic': 'Yes',
            'PhysicalActivity': 'No',
            'GenHealth': 'Fair',
            'SleepTime': 6.0,
            'Asthma': 'Yes',
            'KidneyDisease': 'No',
            'SkinCancer': 'No'
        },
        {
            'BMI': 24.0,
            'Smoking': 'No',
            'AlcoholDrinking': 'No',
            'Stroke': 'No',
            'PhysicalHealth': 0.0,
            'MentalHealth': 0.0,
            'DiffWalking': 'No',
            'Sex': 'Female',
            'AgeCategory': '25-29',
            'Race': 'Asian',
            'Diabetic': 'No',
            'PhysicalActivity': 'Yes',
            'GenHealth': 'Excellent',
            'SleepTime': 8.0,
            'Asthma': 'No',
            'KidneyDisease': 'No',
            'SkinCancer': 'No'
        }
    ])
    return sample_data

def prepare_sample_data(sample_data, encoders, models):
    """Prepare sample data for prediction"""
    prepared_data = sample_data.copy()
    
    # Binary encoding
    binary_cols = ['Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 
                  'Sex', 'PhysicalActivity', 'Asthma', 'KidneyDisease', 'SkinCancer']
    le = encoders['label_encoder']
    for col in binary_cols:
        prepared_data[col] = le.fit_transform(prepared_data[col])
    
    # Ordinal encoding
    ordinal_cols = ['GenHealth', 'AgeCategory']
    oe = encoders['ordinal_encoder']
    prepared_data[ordinal_cols] = oe.transform(prepared_data[ordinal_cols])
    
    # One-hot encoding
    prepared_data = pd.get_dummies(prepared_data, columns=['Race', 'Diabetic'])
    
    # Ensure all feature columns are present
    feature_names = models['Logistic_Regression']['config']['feature_names']
    for col in feature_names:
        if col not in prepared_data.columns:
            prepared_data[col] = 0
            
    # Reorder columns to match training data
    prepared_data = prepared_data[feature_names]
    
    return prepared_data

def make_predictions(prepared_data, models, scaler):
    """Make predictions using both models"""
    # Scale the data
    scaled_data = scaler.transform(prepared_data)
    
    results = []
    for model_name, model_info in models.items():
        model = model_info['model']
        predictions = model.predict(scaled_data)
        probabilities = model.predict_proba(scaled_data)
        
        for i in range(len(predictions)):
            results.append({
                'Model': model_name,
                'Sample': i + 1,
                'Prediction': 'Heart Disease' if predictions[i] == 1 else 'No Heart Disease',
                'Probability': f"{probabilities[i][1]:.2%}"
            })
    
    return pd.DataFrame(results)

def main():
    # Load saved models and components
    print("Loading saved models...")
    models, scaler, encoders = load_saved_models()
    
    # Create sample data
    print("\nCreating sample data...")
    sample_data = create_sample_data()
    print("\nSample data created:")
    print(sample_data)
    
    # Prepare data for prediction
    print("\nPreparing data for prediction...")
    prepared_data = prepare_sample_data(sample_data, encoders, models)
    
    # Make predictions
    print("\nMaking predictions...")
    predictions = make_predictions(prepared_data, models, scaler)
    
    # Display results
    print("\nPrediction Results:")
    print(predictions.to_string(index=False))

if __name__ == "__main__":
    main()