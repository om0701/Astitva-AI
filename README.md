## Demo Video
https://www.loom.com/share/72002d87c81e47598e3804228f716874

## PROJECT DEPLOYED LINK
https://astitva-ai.vercel.app


# Astitva AI

AI-powered photo authenticity checker that detects deepfakes and AI-generated images.

# Problem Statement

With the rise of AI-generated images and deepfakes, it has become increasingly difficult for users to verify the authenticity of online media. This creates opportunities for misinformation, fraud, and loss of digital trust. Astitva AI aims to provide a simple and accessible solution for detecting manipulated and AI-generated images.

## Overview

Astitva AI is a full-stack application that allows users to:
- Upload any image
- Get an instant **REAL** or **FAKE** verdict
- View a confidence score (0-100%)

The system uses a deep learning model based on EfficientNet-B0 to analyze images and determine their authenticity.

## Features

- **AI Image Detection**: Advanced neural network trained to identify AI-generated and manipulated images
- **Confidence Scoring**: Detailed confidence score showing likelihood of image authenticity
- **Simple Interface**: Drag-and-drop upload with instant results
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Python 3.8+
- FastAPI
- PyTorch
- torchvision
- Pillow

## Project Structure

```
astitva-ai/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Detector.jsx
│   │   └── components/
│   │       ├── UploadBox.jsx
│   │       ├── ResultCard.jsx
│   │       └── ConfidenceBar.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── main.py
│   ├── model.py
│   └── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- pip

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd astitva-ai/backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python main.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd astitva-ai/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Reference

### Health Check

```http
GET /
```

Returns service status.

### Predict Image Authenticity

```http
POST /predict
```

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` - Image file (JPEG, PNG, WebP, GIF, BMP)

**Response:**
```json
{
  "label": "FAKE",
  "confidence": 0.73
}
```

**Response Fields:**
- `label`: Either "REAL" or "FAKE"
- `confidence`: Float between 0.0 and 1.0 indicating confidence in the prediction

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    FastAPI      │────▶│   ML Model      │
│    (React)      │     │    Backend      │     │  (EfficientNet) │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Port 3000              Port 8000
```

### ML Model Details

- **Architecture**: EfficientNet-B0 with custom binary classification head
- **Input**: 224x224 RGB images
- **Normalization**: ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- **Output**: Sigmoid probability (>0.5 = FAKE, ≤0.5 = REAL)

## Environment Variables

### Frontend

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Production Deployment

### Backend

For production, configure CORS properly in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    # ...
)
```

Run with:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be served by any static file server.

## Limitations

- The model uses pretrained ImageNet weights without fine-tuning on deepfake-specific data
- For production use, the model should be trained on a dataset of real and AI-generated images
- Results should be used as one factor in determining image authenticity, not as definitive proof

## Future Improvements

- [ ] Fine-tune model on deepfake datasets (e.g., FaceForensics++, DFDC)
- [ ] Add support for video analysis
- [ ] Implement batch processing
- [ ] Add detailed analysis explanations (heatmaps, attention visualization)
- [ ] Support more image formats

## Prompt Template

System Prompt
You are an AI-powered Deepfake Detection Assistant.

Your role is to analyze uploaded images or videos and determine whether the content is REAL or AI-GENERATED.

You must behave as a forensic AI system:
- Remain neutral and unbiased
- Never claim 100% certainty
- Provide probability-based results
- Clearly explain detection indicators
- Avoid accusations against individuals

Your analysis should consider:

1. Facial landmark inconsistencies  
2. Skin texture artifacts  
3. Eye blinking irregularities  
4. Lighting and shadow mismatches  
5. Edge blending artifacts  
6. GAN fingerprint patterns  
7. Temporal instability across frames (for video)

Always produce structured output.

Output format
Classification: REAL / FAKE
Confidence Score: XX%

Technical Indicators:
- Facial Artifact Score
- Texture Anomaly Score
- Lighting Consistency Score
- Temporal Stability Score (if video)

Explanation:
Brief human-readable summary of findings (3–5 lines).

Recommendation:
Trust Level: Low / Medium / High
Suggested Next Steps: Verification guidance.


Safety Constraints
- Never state absolute certainty.
- Do not identify or accuse individuals.
- Do not generate deepfake content.
- Do not provide instructions for creating deepfakes.
- Maintain professional forensic tone.



## License

MIT License

---

Built for detecting deepfakes and protecting digital authenticity.
