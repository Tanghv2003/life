from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from apply_machinelearning import HealthMLService

# Initialize FastAPI app
app = FastAPI(
    title="Health Prediction API",
    description="API for heart disease prediction using machine learning models",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the ML service
health_ml_service = HealthMLService()

# Pydantic models for request/response validation
class PredictionRequest(BaseModel):
    user_id: str
    record_id: str
    collection_name: Optional[str] = "predictions_analysis"

class PredictionResult(BaseModel):
    model: str
    prediction: str
    probability: str

class PredictionResponse(BaseModel):
    predictions: List[PredictionResult]
    timestamp: datetime
    user_id: str

@app.get("/")
async def root():
    
    return {"status": "healthy", "service": "Health Prediction API"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_heart_disease(request: PredictionRequest):
    
    try:
        # Get predictions using the ML service
        results = health_ml_service.analyze_health_data(
            request.user_id,
            request.record_id,
            request.collection_name
        )
        
        # Format response
        response = PredictionResponse(
            predictions=results['predictions'],
            timestamp=datetime.utcnow(),
            user_id=request.user_id
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@app.get("/predictions/{user_id}", response_model=List[PredictionResponse])
async def get_user_predictions(user_id: str, collection_name: str = "predictions_analysis"):
    """
    Retrieve prediction history for a user
    """
    try:
        # Get predictions from MongoDB
        collection = health_ml_service.db[collection_name]
        # Convert cursor to list and process synchronously
        predictions_docs = list(collection.find({"user_id": user_id}))
        
        predictions = []
        for doc in predictions_docs:
            predictions.append(
                PredictionResponse(
                    predictions=doc["predictions"],
                    timestamp=datetime.fromisoformat(doc["created_at"]),
                    user_id=doc["user_id"]
                )
            )
        
        return predictions
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve predictions: {str(e)}"
        )

# Sửa lại phần này
if __name__ == "__main__":
    import uvicorn
    # Sử dụng string path thay vì truyền app trực tiếp
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)