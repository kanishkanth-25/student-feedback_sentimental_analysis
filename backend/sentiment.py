from transformers import pipeline


try:
    classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    print(f"Error loading model: {e}")
    classifier = None

def analyze_sentiment(text: str):
    if not classifier:
        return {"label": "NEUTRAL", "score": 0.5, "aspects": ""}
    
    result = classifier(text)[0]
    
    
    aspects = []
    keywords = {
        "teaching": ["professor", "teacher", "teaching", "lecture"],
        "facility": ["room", "lab", "canteen", "library"],
        "curriculum": ["syllabus", "course", "subject", "topics"]
    }
    
    text_lower = text.lower()
    for category, keys in keywords.items():
        if any(k in text_lower for k in keys):
            
            aspects.append(f"{category}:{result['label']}")
            
    return {
        "label": result["label"],
        "score": result["score"],
        "aspects": ",".join(aspects)
    }
