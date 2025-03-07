from flask import Blueprint, jsonify, request
import json
import os
from datetime import datetime, timedelta
import sys
import pathlib

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent.parent.parent))

from utils.data_utils import load_fixtures, save_fixtures

fixtures_bp = Blueprint('fixtures', __name__)

@fixtures_bp.route('/', methods=['GET'])
def get_fixtures():
    """
    Get all upcoming Premier League fixtures
    Optional query param: limit (int) - Limit the number of fixtures returned
    """
    try:
        fixtures = load_fixtures()
        
        # Filter to only include upcoming fixtures
        today = datetime.now().date()
        upcoming_fixtures = [f for f in fixtures if datetime.strptime(f['date'], '%Y-%m-%d').date() >= today]
        
        # Sort by date (ascending)
        upcoming_fixtures.sort(key=lambda x: x['date'])
        
        # Apply limit if provided
        limit = request.args.get('limit', default=None, type=int)
        if limit:
            upcoming_fixtures = upcoming_fixtures[:limit]
            
        return jsonify(upcoming_fixtures)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@fixtures_bp.route('/<fixture_id>', methods=['GET'])
def get_fixture(fixture_id):
    """Get a specific fixture by ID"""
    try:
        fixtures = load_fixtures()
        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
        
        if not fixture:
            return jsonify({"error": "Fixture not found"}), 404
            
        return jsonify(fixture)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@fixtures_bp.route('/refresh', methods=['POST'])
def refresh_fixtures():
    """
    Endpoint to refresh fixtures data from external sources
    This would typically call a scraper or API integration
    For MVP, we'll just return a message
    """
    # In a real implementation, this would call a scraper or API
    # For now, we'll just return a success message
    return jsonify({"message": "Fixtures refresh triggered. This is a placeholder for MVP."})
