import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, OrdinalEncoder
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, roc_curve, roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE, RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler
import joblib
import os

# Create directories
if not os.path.exists('saved_models'):
    os.makedirs('saved_models')
if not os.path.exists('plots'):
    os.makedirs('plots')

def load_data(file_path):
    data = pd.read_csv(file_path)
    print(f"Data shape: {data.shape}")
    return data

def clean_data(data):
    # Remove duplicates
    data.drop_duplicates(inplace=True)
    
    # Handle outliers in SleepTime
    Q1 = data['SleepTime'].quantile(0.25)
    Q3 = data['SleepTime'].quantile(0.75)
    IQR = Q3 - Q1
    data = data[(data['SleepTime'] >= Q1 - 1.5 * IQR) & 
                (data['SleepTime'] <= Q3 + 1.5 * IQR)]
    
    return data

def encode_features(data):
    encoded_data = data.copy()
    
    # Binary encoding
    binary_cols = ['HeartDisease', 'Smoking', 'AlcoholDrinking', 'Stroke', 
                   'DiffWalking', 'Sex', 'PhysicalActivity', 'Asthma', 
                   'KidneyDisease', 'SkinCancer']
    le = LabelEncoder()
    for col in binary_cols:
        encoded_data[col] = le.fit_transform(encoded_data[col])
    
    # Ordinal encoding
    ordinal_cols = ['GenHealth', 'AgeCategory']
    GenHealth = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']
    AgeCategory = ['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', 
                  '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80 or older']
    oe = OrdinalEncoder(categories=[GenHealth, AgeCategory])
    encoded_data[ordinal_cols] = oe.fit_transform(encoded_data[ordinal_cols])
    
    # One-hot encoding
    encoded_data = pd.get_dummies(encoded_data, columns=['Race', 'Diabetic'])
    
    return encoded_data, le, oe

def apply_sampling(X, y, sampling_technique):
    if sampling_technique == 'oversampling':
        sampler = RandomOverSampler(random_state=42)
    elif sampling_technique == 'undersampling':
        sampler = RandomUnderSampler(random_state=42)
    elif sampling_technique == 'smote':
        sampler = SMOTE(random_state=42)
    else:
        return X, y
    
    X_resampled, y_resampled = sampler.fit_resample(X, y)
    print(f"\nClass distribution after {sampling_technique}:")
    print(pd.Series(y_resampled).value_counts())
    return X_resampled, y_resampled

def train_models(X, y):
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Print original class distribution
    print("\nOriginal class distribution:")
    print(pd.Series(y_train).value_counts())
    
    models = {
        'Logistic_Regression': LogisticRegression(random_state=42),
        'Random_Forest': RandomForestClassifier(random_state=42)
    }
    
    sampling_techniques = ['original', 'oversampling', 'undersampling', 'smote']
    results = {}
    best_configurations = {}
    
    for name, model in models.items():
        print(f"\nEvaluating {name}")
        model_results = {}
        best_score = 0
        best_sampling = None
        best_model = None
        
        for sampling in sampling_techniques:
            # Apply sampling technique
            X_sampled, y_sampled = apply_sampling(X_train_scaled, y_train, sampling)
            
            # Train model
            model.fit(X_sampled, y_sampled)
            
            # Make predictions
            y_pred = model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Store results
            model_results[sampling] = {
                'accuracy': accuracy,
                'report': classification_report(y_test, y_pred)
            }
            
            # Update best configuration for this model
            if accuracy > best_score:
                best_score = accuracy
                best_sampling = sampling
                best_model = model
            
            # Plot confusion matrix
            cm = confusion_matrix(y_test, y_pred)
            plt.figure(figsize=(8, 6))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
            plt.title(f'Confusion Matrix - {name} ({sampling})')
            plt.ylabel('True Label')
            plt.xlabel('Predicted Label')
            plt.savefig(f'plots/confusion_matrix_{name.lower()}_{sampling}.png')
            plt.close()
            
            # Plot ROC curve
            y_prob = model.predict_proba(X_test_scaled)[:, 1]
            fpr, tpr, _ = roc_curve(y_test, y_prob)
            auc = roc_auc_score(y_test, y_prob)
            
            plt.figure(figsize=(8, 6))
            plt.plot(fpr, tpr, label=f'ROC curve (AUC = {auc:.2f})')
            plt.plot([0, 1], [0, 1], 'k--')
            plt.xlabel('False Positive Rate')
            plt.ylabel('True Positive Rate')
            plt.title(f'ROC Curve - {name} ({sampling})')
            plt.legend()
            plt.savefig(f'plots/roc_curve_{name.lower()}_{sampling}.png')
            plt.close()
            
            print(f"\n{name} - {sampling} Results:")
            print(f"Accuracy: {accuracy:.4f}")
            print("Classification Report:")
            print(model_results[sampling]['report'])
        
        results[name] = model_results
        best_configurations[name] = {
            'model': best_model,
            'sampling': best_sampling,
            'accuracy': best_score
        }
    
    return best_configurations, scaler, results

def save_models(best_configurations, scaler, encoders, feature_names):
    # Create a directory for each model
    for model_name, config in best_configurations.items():
        model_dir = f'saved_models/{model_name}'
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
            
        # Save model and its configuration
        joblib.dump(config['model'], f'{model_dir}/model.joblib')
        joblib.dump({
            'sampling': config['sampling'],
            'accuracy': config['accuracy'],
            'feature_names': feature_names
        }, f'{model_dir}/config.joblib')
    
    # Save common components
    joblib.dump(scaler, 'saved_models/scaler.joblib')
    joblib.dump(encoders, 'saved_models/encoders.joblib')

def main():
    # Load and process data
    data = load_data('heart_2020_cleaned.csv')
    cleaned_data = clean_data(data)
    
    # Encode features
    encoded_data, le, oe = encode_features(cleaned_data)
    
    # Prepare features and target
    X = encoded_data.drop('HeartDisease', axis=1)
    y = encoded_data['HeartDisease']
    
    # Train and evaluate models
    best_configurations, scaler, results = train_models(X, y)
    
    # Print results for both models
    print("\nBest configurations for each model:")
    for model_name, config in best_configurations.items():
        print(f"\n{model_name}:")
        print(f"Best sampling technique: {config['sampling']}")
        print(f"Best accuracy: {config['accuracy']:.4f}")
    
    # Save all models and configurations
    encoders = {'label_encoder': le, 'ordinal_encoder': oe}
    save_models(best_configurations, scaler, encoders, X.columns.tolist())
    print("\nAll models and configurations have been saved!")

if __name__ == "__main__":
    main()