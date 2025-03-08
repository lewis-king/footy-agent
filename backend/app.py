import os
import sys
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Add the current directory to the path
sys.path.append(str(Path(__file__).parent))

# Import routes
from routes.fixtures import fixtures_bp
from routes.analysis import analysis_bp
from routes.fpl import fpl_bp
from utils.data_utils import create_sample_fixtures

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, 
            static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static'),
            template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates'))
CORS(app)

# Register blueprints
app.register_blueprint(fixtures_bp, url_prefix='/api/fixtures')
app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
app.register_blueprint(fpl_bp, url_prefix='/api/fpl')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "FootyAgent Backend"})

if __name__ == '__main__':
    # Create sample fixtures for development if needed
    create_sample_fixtures()
    
    # Run the Flask app
    port = int(os.environ.get('FLASK_PORT', os.environ.get('PORT', 5050)))
    app.run(host='0.0.0.0', port=port, debug=True)
