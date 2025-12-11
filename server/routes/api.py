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
        
        # Validate input
        if not word:
            return jsonify({
                'error': 'Invalid request: "word" field is required'
            }), 400
        
        if not isinstance(max_sentences, int) or max_sentences < 1 or max_sentences > 20:
            return jsonify({
                'error': 'Invalid request: "maxSentences" must be between 1 and 20'
            }), 400
        
        # Create prompt for Groq AI
        prompt = f"""Generate exactly {max_sentences} example sentences using the word "{word}". 
Each sentence should:
1. Use the word "{word}" in a natural, contextual way
2. Be in different contexts (e.g., business, education, personal development, travel, technology, etc.)
3. Be clear and easy to understand for English learners
4. Be between 10-20 words long

Format your response as a JSON array with this structure:
[
  {{
    "text": "The sentence using the word {word}",
    "vietnamese": "Bản dịch tiếng Việt của câu trên",
    "context": "Brief context category (e.g., Business, Education, Travel)",
    "contextVietnamese": "Bản dịch tiếng Việt của context (ví dụ: Kinh doanh, Giáo dục, Du lịch)"
  }}
]

IMPORTANT: You must provide accurate Vietnamese translations for both the sentence and the context category.

Return ONLY the JSON array, no additional text or explanation."""
        
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
