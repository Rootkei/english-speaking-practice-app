from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from config import config

# Import routes
from routes.api import api as api_blueprint


def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['ALLOWED_ORIGINS'],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Initialize rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[app.config['RATELIMIT_DEFAULT']],
        storage_uri=app.config['RATELIMIT_STORAGE_URL']
    )
    
    # Register blueprints
    app.register_blueprint(api_blueprint)
    
    # Root endpoint
    @app.route('/')
    def index():
        return {
            'message': 'English Speaking Practice API',
            'version': '1.0.0',
            'endpoints': {
                'generate_sentences': '/api/generate-sentences (POST)',
                'health': '/api/health (GET)'
            }
        }
    
    return app


# Create app instance for Gunicorn
# This allows Gunicorn to import with: gunicorn app:app
app = create_app(os.environ.get('FLASK_ENV', 'production'))


if __name__ == '__main__':
    # Get environment
    env = os.environ.get('FLASK_ENV', 'development')
    
    # Create app
    app = create_app(env)
    
    # Get port
    port = int(os.environ.get('PORT', 5000))
    
    # Run app
    print(f'🚀 Starting Flask server in {env} mode...')
    print(f'📍 Server running on http://127.0.0.1:{port}')
    print(f'🔑 API Key configured: {"✓" if os.environ.get("GROQ_API_KEY") else "✗ (Please set GROQ_API_KEY in .env)"}')
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=(env == 'development')
    )
