from flask import Blueprint, request, jsonify
import requests
import os
from config import Config

# Create Blueprint
api = Blueprint('api', __name__)

# Configuration
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_API_URL = Config.GROQ_API_URL
GROQ_MODEL = Config.GROQ_MODEL


@api.route('/api/generate-sentences', methods=['POST'])
def generate_sentences():
    """
    Generate example sentences using Groq AI
    
    Request body:
        {
            "word": "string",
            "maxSentences": number (optional, default: 10)
        }
    
    Response:
        [
            {
                "text": "sentence text",
                "vietnamese": "bản dịch tiếng Việt",
                "context": "context category",
                "contextVietnamese": "ngữ cảnh tiếng Việt"
            }
        ]
    """
    try:
        # Validate API key
        if not GROQ_API_KEY:
            return jsonify({
                'error': 'Server configuration error: API key not set'
            }), 500
        
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Invalid request: JSON body required'
            }), 400
        
        word = data.get('word', '').strip()
        max_sentences = data.get('maxSentences', 10)
        topic = data.get('topic', 'All Topics').strip()
        
        # Log the request for debugging
        print(f'📝 Request: word="{word}", maxSentences={max_sentences}, topic="{topic}"')
        
        # Validate input
        if not word:
            return jsonify({
                'error': 'Invalid request: "word" field is required'
            }), 400
        
        if not isinstance(max_sentences, int) or max_sentences < 1 or max_sentences > 20:
            return jsonify({
                'error': 'Invalid request: "maxSentences" must be between 1 and 20'
            }), 400
        
        # Create context instruction based on topic
        if topic == 'All Topics':
            # For All Topics, allow random contexts
            prompt = f"""Generate exactly {max_sentences} example sentences using the word "{word}". 

IMPORTANT STRUCTURE: Each sentence MUST follow this exact pattern:
"... because ..., so ..., but ..., and ..."

Requirements for each sentence:
1. Use the word "{word}" naturally within the sentence structure
2. Follow the pattern: [statement] because [reason], so [consequence], but [contrast], and [addition]
3. Be in different random contexts (e.g., business, education, personal development, travel, technology, health, entertainment, etc.)
4. Be clear and easy to understand for English learners
5. Make logical sense with smooth transitions between clauses

Format your response as a JSON array with this structure:
[
  {{
    "text": "The sentence using the word {word} following the 'because, so, but, and' pattern",
    "vietnamese": "Bản dịch tiếng Việt của câu trên",
    "context": "Brief context category",
    "contextVietnamese": "Bản dịch tiếng Việt của context"
  }}
]

IMPORTANT: 
- Every sentence MUST contain "because", "so", "but", and "and" in that order
- Provide accurate Vietnamese translations for both the sentence and the context category

Return ONLY the JSON array, no additional text or explanation."""
        else:
            # For specific topic, create VERY STRONG topic-specific prompt
            topic_clean = topic.split()[0] if topic else topic
            
            # Create topic-specific context examples
            topic_contexts_map = {
                "Travel": '"Airport Security", "Hotel Check-in", "Sightseeing Tour", "Cultural Exchange", "Adventure Trip", "Travel Planning", "Tourist Attraction", "Local Cuisine", "Flight Booking", "Vacation Planning"',
                "Business": '"Board Meeting", "Sales Negotiation", "Marketing Campaign", "Team Management", "Client Presentation", "Business Strategy", "Product Launch", "Quarterly Review", "Networking Event", "Contract Signing"',
                "Technology": '"Software Development", "Cybersecurity", "AI Innovation", "Cloud Computing", "Mobile App", "Data Analysis", "Tech Startup", "System Upgrade", "Code Review", "Digital Transformation"',
                "Education": '"Classroom Learning", "University Lecture", "Research Project", "Student Life", "Academic Writing", "Exam Preparation", "Study Group", "Thesis Defense", "Online Course", "Educational Workshop"',
                "Food": '"Restaurant Dining", "Cooking Class", "Recipe Development", "Food Tasting", "Culinary Arts", "Meal Preparation", "Food Festival", "Kitchen Management", "Nutrition Planning", "Gourmet Experience"',
                "Lifestyle": '"Daily Routine", "Personal Growth", "Wellness Practice", "Hobby Activity", "Work-Life Balance", "Mindfulness Session", "Home Organization", "Self-Care", "Community Event", "Leisure Time"',
                "Health": '"Fitness Training", "Medical Checkup", "Wellness Program", "Exercise Routine", "Health Consultation", "Nutrition Plan", "Mental Health", "Physical Therapy", "Gym Session", "Healthy Lifestyle"',
                "Entertainment": '"Movie Premiere", "Concert Performance", "Theater Show", "Music Festival", "TV Series", "Gaming Session", "Celebrity Interview", "Live Performance", "Entertainment News", "Fan Event"',
                "Sports": '"Training Session", "Championship Match", "Team Practice", "Athletic Competition", "Sports Event", "Coaching Session", "Fitness Challenge", "Tournament Game", "Sports Strategy", "Victory Celebration"',
                "Environment": '"Conservation Project", "Recycling Initiative", "Climate Action", "Wildlife Protection", "Eco-friendly Practice", "Sustainability Program", "Environmental Awareness", "Green Energy", "Nature Preservation", "Pollution Control"',
                "Shopping": '"Online Shopping", "Store Visit", "Product Comparison", "Sale Event", "Customer Service", "Shopping Mall", "Brand Selection", "Price Negotiation", "Product Review", "Purchase Decision"',
                "Weather": '"Weather Forecast", "Storm Warning", "Climate Change", "Seasonal Transition", "Temperature Monitoring", "Weather Planning", "Natural Phenomenon", "Atmospheric Condition", "Weather Impact", "Climate Pattern"'
            }
            
            # Get topic-specific contexts or use generic ones
            topic_contexts = topic_contexts_map.get(topic_clean, '"Professional Setting", "Daily Activity", "Social Interaction", "Personal Experience", "Work Environment"')
            
            prompt = f"""⚠️ CRITICAL INSTRUCTION - READ CAREFULLY ⚠️

You are generating {max_sentences} example sentences for the word "{word}".
The user has selected the topic: "{topic}"

🚨 ABSOLUTE REQUIREMENT - NO EXCEPTIONS:
Every single sentence's "context" field MUST be directly related to {topic_clean}.
DO NOT use contexts from other topics. DO NOT use generic contexts.
ONLY use contexts that are clearly and specifically related to {topic_clean}.

SENTENCE STRUCTURE: Each sentence MUST follow this pattern:
"... because ..., so ..., but ..., and ..."

CONTEXT REQUIREMENTS FOR "{topic}":
✓ ALLOWED contexts (use ONLY these types): {topic_contexts}
✗ FORBIDDEN: Any context not related to {topic_clean}

EXAMPLE - If topic is "{topic}":
- ✓ CORRECT: "context": "Airport Security" (for Travel topic)
- ✗ WRONG: "context": "Business Meeting" (for Travel topic)
- ✗ WRONG: "context": "Daily Life" (too generic)

YOUR TASK:
1. Create {max_sentences} sentences using "{word}"
2. Each sentence follows: [statement] because [reason], so [consequence], but [contrast], and [addition]
3. EVERY "context" field MUST be a specific {topic_clean}-related scenario
4. Make sentences natural and educational for English learners
5. Provide Vietnamese translations

JSON FORMAT (return ONLY this, no other text):
[
  {{
    "text": "Sentence with {word} using 'because, so, but, and' pattern",
    "vietnamese": "Bản dịch tiếng Việt",
    "context": "MUST be {topic_clean}-specific context from allowed list above",
    "contextVietnamese": "Bản dịch tiếng Việt của context"
  }}
]

🔴 FINAL WARNING: If even ONE context is not {topic_clean}-related, the entire response is REJECTED.
All {max_sentences} contexts MUST be {topic_clean}-specific. No exceptions."""
        
        # Create prompt for Groq AI (prompt variable is now set above)
        
        # Call Groq API
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_API_KEY}'
        }
        
        payload = {
            'model': GROQ_MODEL,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.9,
            'max_tokens': 2048,
            'top_p': 0.95
        }
        
        # Make request to Groq
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # Check response status
        if not response.ok:
            error_data = response.json() if response.text else {}
            error_message = error_data.get('error', {}).get('message', 'Failed to generate sentences')
            return jsonify({
                'error': f'Groq API error: {error_message}'
            }), response.status_code
        
        # Parse response
        response_data = response.json()
        generated_text = response_data['choices'][0]['message']['content']
        
        # Extract JSON array from response
        import re
        json_match = re.search(r'\[[\s\S]*\]', generated_text)
        
        if not json_match:
            return jsonify({
                'error': 'Invalid response format from AI'
            }), 500
        
        # Parse sentences
        import json
        sentences = json.loads(json_match.group(0))
        
        # Validate sentences
        if not isinstance(sentences, list) or len(sentences) == 0:
            return jsonify({
                'error': 'No sentences generated'
            }), 500
        
        # Return sentences (limit to max_sentences)
        return jsonify(sentences[:max_sentences]), 200
        
    except requests.exceptions.Timeout:
        return jsonify({
            'error': 'Request timeout: Groq API took too long to respond'
        }), 504
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f'Network error: {str(e)}'
        }), 503
        
    except json.JSONDecodeError as e:
        return jsonify({
            'error': f'Failed to parse AI response: {str(e)}'
        }), 500
        
    except Exception as e:
        # Log error (in production, use proper logging)
        print(f'Error in generate_sentences: {str(e)}')
        return jsonify({
            'error': 'Internal server error'
        }), 500


@api.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'English Practice API',
        'version': '1.0.0'
    }), 200
