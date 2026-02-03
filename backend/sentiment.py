from transformers import pipeline

# Initialize the sentiment analysis pipeline
# We'll use a standard multi-lingual or English sentiment model
try:
    classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    print(f"Error loading model: {e}")
    classifier = None

def analyze_sentiment(text: str):
    if not classifier:
        return {"label": "NEUTRAL", "score": 0.5, "aspects": ""}
    
    result = classifier(text)[0]
    
    # Basic aspect detection logic (can be improved)
    # Looking for keywords related to common feedback categories
    aspects = []
    keywords = {
        "teaching": ["professor", "teacher", "teaching", "lecture"],
        "facility": ["room", "lab", "canteen", "library"],
        "curriculum": ["syllabus", "course", "subject", "topics"]
    }
    
    text_lower = text.lower()
    for category, keys in keywords.items():
        if any(k in text_lower for k in keys):
            # Simple simulation of aspect sentiment - usually tied to overall
            aspects.append(f"{category}:{result['label']}")
            
    return {
        "label": result["label"],
        "score": result["score"],
        "aspects": ",".join(aspects)
    }
