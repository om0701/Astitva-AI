"""
Astitva AI - Gemini API Integration for Deepfake Detection
Uses Google Gemini for intelligent image analysis.
"""

from PIL import Image
from io import BytesIO
from typing import Tuple, Dict
import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

class GeminiDeepfakeDetector:
    """
    Uses Google Gemini API for deepfake detection.
    Falls back to heuristics if API fails.
    """
    
    def __init__(self):
        # Configure Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self.use_api = True
            print("✓ Gemini API configured and ready")
        else:
            self.use_api = False
            print("⚠ No Gemini API key found, using heuristics only")
    
    def predict(self, image: Image.Image, image_bytes: bytes = None) -> Tuple[float, Dict[str, float]]:
        """
        Predict using Gemini API with fallback to heuristics.
        
        Returns:
            - fake_probability: 0.0 to 1.0
            - breakdown: Individual signals
        """
        
        # Try Gemini API first
        if self.use_api:
            try:
                # Prepare the prompt
                prompt = """Analyze this image carefully and determine if it's AI-generated or a real photograph.

Consider these factors:
1. Image metadata and digital artifacts
2. Unnatural patterns, textures, or consistency
3. Telltale signs of AI generation (overly smooth skin, weird hands, impossible reflections, etc.)
4. Photography characteristics vs AI rendering patterns

Respond in this EXACT format:
VERDICT: [REAL or FAKE]
CONFIDENCE: [number from 0 to 100]
REASON: [brief explanation]

Be decisive - choose either REAL or FAKE based on your analysis."""

                # Call Gemini
                response = self.model.generate_content([prompt, image])
                text = response.text.strip()
                
                # Parse response
                fake_probability = 0.5  # default
                verdict = "UNKNOWN"
                confidence = 50
                reason = ""
                
                for line in text.split('\n'):
                    line = line.strip()
                    if line.startswith('VERDICT:'):
                        verdict = line.split(':', 1)[1].strip().upper()
                    elif line.startswith('CONFIDENCE:'):
                        try:
                            confidence = int(line.split(':', 1)[1].strip())
                        except:
                            confidence = 50
                    elif line.startswith('REASON:'):
                        reason = line.split(':', 1)[1].strip()
                
                # Convert to fake probability
                if verdict == "FAKE":
                    fake_probability = confidence / 100.0
                elif verdict == "REAL":
                    fake_probability = (100 - confidence) / 100.0
                else:
                    fake_probability = 0.5
                
                print(f"\n{'='*60}")
                print(f"🤖 Gemini AI Detection")
                print(f"Image Size: {image.size}")
                print(f"Verdict: {verdict}")
                print(f"Confidence: {confidence}%")
                print(f"Reason: {reason}")
                print(f"Fake Probability: {fake_probability:.3f} → {'FAKE' if fake_probability > 0.5 else 'REAL'}")
                print(f"{'='*60}\n")
                
                return fake_probability, {"gemini_confidence": confidence / 100.0, "gemini_verdict": verdict}
                
            except Exception as e:
                print(f"Gemini API Error: {e}")
                print("Falling back to heuristic detection...")
        
        # Fallback to heuristic detection
        return self._heuristic_detection(image)
    
    def _heuristic_detection(self, image: Image.Image) -> Tuple[float, Dict[str, float]]:
        """
        Fallback heuristic-based detection.
        """
        from PIL.ExifTags import TAGS
        
        width, height = image.size
        fake_score = 0.0
        
        # Check for EXIF camera data
        has_camera_exif = False
        try:
            if hasattr(image, '_getexif') and image._getexif():
                exif = image._getexif()
                if exif:
                    for tag_id in exif.keys():
                        tag = TAGS.get(tag_id, '')
                        if tag in ['Make', 'Model', 'LensMake', 'LensModel']:
                            has_camera_exif = True
                            break
        except:
            pass
        
        if has_camera_exif:
            fake_score -= 0.7
        
        # Check for AI-typical dimensions
        ai_dimensions = [
            (512, 512), (768, 768), (1024, 1024), (512, 768), (768, 512),
            (1024, 1792), (1792, 1024), (1456, 816), (816, 1456), (2048, 2048),
        ]
        
        if image.size in ai_dimensions:
            fake_score += 0.6
        
        # Perfect squares + divisible by 64
        aspect_ratio = width / height if height > 0 else 1.0
        is_square = abs(aspect_ratio - 1.0) < 0.01
        
        if is_square and (width % 64 == 0) and not has_camera_exif:
            fake_score += 0.4
        
        # Irregular dimensions = likely real
        is_irregular = (width < 500 or height < 500 or width > 2100 or height > 2100)
        is_weird_ratio = not any(abs(aspect_ratio - r) < 0.1 for r in [1.0, 16/9, 9/16, 4/3, 3/4, 2/1, 1/2])
        
        if is_irregular or is_weird_ratio:
            fake_score -= 0.4
        
        fake_probability = max(0.0, min(1.0, (fake_score + 0.3)))
        
        print(f"\n{'='*50}")
        print(f"📊 Heuristic Detection (Gemini unavailable)")
        print(f"Image Size: {width}x{height}")
        print(f"Has Camera EXIF: {has_camera_exif}")
        print(f"AI Dimension: {image.size in ai_dimensions}")
        print(f"Result: {'FAKE' if fake_probability > 0.5 else 'REAL'} ({fake_probability:.1%})")
        print(f"{'='*50}\n")
        
        return fake_probability, {}


# Global model instance
_model = None


def get_model() -> GeminiDeepfakeDetector:
    """Get or initialize the model singleton."""
    global _model
    
    if _model is None:
        _model = GeminiDeepfakeDetector()
        print("Model loaded and ready!")
    
    return _model


def predict_image(image_path: str) -> float:
    """
    Predict whether an image is AI-generated/fake from file path.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        float: Probability of image being FAKE (0.0 to 1.0)
    """
    model = get_model()
    
    try:
        image = Image.open(image_path).convert("RGB")
        with open(image_path, 'rb') as f:
            image_bytes = f.read()
    except Exception as e:
        raise ValueError(f"Could not load image: {e}")
    
    fake_probability, _ = model.predict(image, image_bytes)
    return fake_probability


def predict_image_bytes(image_bytes: bytes) -> float:
    """
    Predict whether an image is AI-generated/fake from bytes.
    
    Args:
        image_bytes: Image file bytes
        
    Returns:
        float: Probability of image being FAKE (0.0 to 1.0)
    """
    model = get_model()
    
    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Could not load image: {e}")
    
    fake_probability, _ = model.predict(image, image_bytes)
    return fake_probability


if __name__ == "__main__":
    # Test the model
    print("=" * 60)
    print("Testing Gemini Deepfake Detector")
    print("=" * 60)
    
    model = get_model()
    print("✓ Model initialized successfully")
    
    print("\n✓ Ready to analyze images!")
