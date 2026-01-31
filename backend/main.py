"""
Astitva AI - FastAPI Backend Server
Provides API endpoint for deepfake/AI-generated image detection.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import tempfile
import os
from PIL import Image
from PIL.ExifTags import TAGS

from model import predict_image, predict_image_bytes, get_model


# Initialize FastAPI app
app = FastAPI(
    title="Astitva AI",
    description="AI-powered photo authenticity checker for detecting deepfakes and AI-generated images",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint."""
    label: str
    confidence: float
    metadata: Optional[Dict[str, Any]] = None


@app.on_event("startup")
async def startup_event():
    """Load the ML model on startup."""
    print("Loading ML model...")
    get_model()
    print("Model loaded and ready!")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Astitva AI",
        "description": "AI-powered photo authenticity checker"
    }


@app.get("/health")
async def health_check():
    """Health check for monitoring."""
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Analyze an uploaded image for authenticity.
    
    - **file**: Image file (JPEG, PNG, WebP, etc.)
    
    Returns:
    - **label**: "REAL" or "FAKE"
    - **confidence**: Confidence score (0.0 to 1.0)
    - **metadata**: Additional image metadata
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid file type",
                "message": f"File type {file.content_type} not supported. Please upload JPEG, PNG, WebP, GIF, or BMP.",
                "allowed_types": allowed_types
            }
        )
    
    try:
        # Read file contents
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(
                status_code=400, 
                detail={"error": "Empty file", "message": "The uploaded file is empty. Please select a valid image."}
            )
        
        # Extract basic metadata
        try:
            from io import BytesIO
            img = Image.open(BytesIO(contents))
            metadata = {
                "width": img.width,
                "height": img.height,
                "format": img.format,
                "mode": img.mode,
                "size_bytes": len(contents)
            }
            
            # Try to extract EXIF data
            exif_data = {}
            if hasattr(img, '_getexif') and img._getexif():
                exif = img._getexif()
                for tag_id, value in exif.items():
                    tag = TAGS.get(tag_id, tag_id)
                    if isinstance(tag, str) and tag in ['Make', 'Model', 'DateTime', 'Software']:
                        exif_data[tag] = str(value)
            
            metadata['exif'] = exif_data if exif_data else None
        except Exception:
            metadata = None
        
        # Run prediction
        fake_probability = predict_image_bytes(contents)
        
        # Determine label based on probability threshold
        # >0.5 = FAKE, <=0.5 = REAL
        if fake_probability > 0.5:
            label = "FAKE"
            confidence = fake_probability
        else:
            label = "REAL"
            confidence = 1.0 - fake_probability
        
        return PredictionResponse(
            label=label,
            confidence=round(confidence, 2),
            metadata=metadata
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/file", response_model=PredictionResponse)
async def predict_from_path(image_path: str):
    """
    Analyze an image from a file path (for testing).
    
    - **image_path**: Path to the image file
    """
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    try:
        fake_probability = predict_image(image_path)
        
        if fake_probability > 0.5:
            label = "FAKE"
            confidence = fake_probability
        else:
            label = "REAL"
            confidence = 1.0 - fake_probability
        
        return PredictionResponse(
            label=label,
            confidence=round(confidence, 2)
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
