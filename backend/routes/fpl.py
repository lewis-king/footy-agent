import os
import json
from flask import Blueprint, jsonify, request
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

from tools.fpl_content_generator import FPLContentGenerator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
fpl_bp = Blueprint('fpl', __name__)

# Initialize the FPL content generator
fpl_content_generator = FPLContentGenerator()

# Data directory for storing generated content
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
FPL_CONTENT_DIR = os.path.join(DATA_DIR, 'fpl_content')

# Ensure directories exist
os.makedirs(FPL_CONTENT_DIR, exist_ok=True)

def get_gameweeks() -> List[Dict[str, Any]]:
    """Get all gameweeks with their status"""
    # This is a simplified implementation - in a real app, you'd fetch this from an API or database
    current_gameweek = 29  # Example: current gameweek is 28 (as of March 2025)
    
    gameweeks = []
    for i in range(1, 39):  # Premier League has 38 gameweeks
        status = 'completed' if i < current_gameweek else 'upcoming' if i == current_gameweek else 'future'
        
        # Check if content exists for this gameweek
        content_file = os.path.join(FPL_CONTENT_DIR, f'gameweek_{i}.json')
        content_generated = os.path.exists(content_file)
        
        gameweek = {
            'id': f'gw-{i}',
            'number': i,
            'name': f'Gameweek {i}',
            'status': status,
            'deadline': f'2025-03-{10 + i} 11:00:00',  # Simplified deadline
            'content_generated': content_generated
        }
        gameweeks.append(gameweek)
    
    return gameweeks

def get_next_upcoming_gameweek() -> Optional[Dict[str, Any]]:
    """Get the next upcoming gameweek"""
    gameweeks = get_gameweeks()
    for gameweek in gameweeks:
        if gameweek['status'] == 'upcoming':
            return gameweek
    return None

def get_gameweek_by_id(gameweek_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific gameweek by ID"""
    gameweeks = get_gameweeks()
    for gameweek in gameweeks:
        if gameweek['id'] == gameweek_id:
            return gameweek
    return None

def get_gameweek_content(gameweek_id: str) -> Optional[Dict[str, Any]]:
    """Get content for a specific gameweek"""
    gameweek = get_gameweek_by_id(gameweek_id)
    if not gameweek:
        return None
    
    content_file = os.path.join(FPL_CONTENT_DIR, f"gameweek_{gameweek['number']}.json")
    if not os.path.exists(content_file):
        return None
    
    try:
        with open(content_file, 'r') as f:
            content = json.load(f)
        
        return {
            'gameweek_id': gameweek_id,
            'gameweek_number': gameweek['number'],
            'generated_at': content.get('lastUpdated', datetime.now().isoformat()),
            'content': content
        }
    except Exception as e:
        logger.error(f"Error reading gameweek content: {e}")
        return None

def generate_gameweek_content(gameweek_number: int) -> Dict[str, Any]:
    """Generate content for a specific gameweek"""
    try:
        # Get user's FPL team if available
        team_file = os.path.join(DATA_DIR, 'fpl_team.json')
        team_state = None
        
        if os.path.exists(team_file):
            try:
                with open(team_file, 'r') as f:
                    team_state = json.load(f)
                # Generate personalized advice
                content = fpl_content_generator.generate_personalized_advice(gameweek_number, team_state)
            except Exception as e:
                logger.error(f"Error reading team state: {e}")
                # Fallback to generic advice
                content = fpl_content_generator.generate_generic_advice(gameweek_number)
        else:
            # Generate generic advice
            content = fpl_content_generator.generate_generic_advice(gameweek_number)
        
        # Save the generated content
        content_file = os.path.join(FPL_CONTENT_DIR, f'gameweek_{gameweek_number}.json')
        with open(content_file, 'w') as f:
            json.dump(content, f, indent=2)
        
        return {
            'gameweek_id': f'gw-{gameweek_number}',
            'gameweek_number': gameweek_number,
            'generated_at': content.get('lastUpdated', datetime.now().isoformat()),
            'content': content
        }
    except Exception as e:
        logger.error(f"Error generating gameweek content: {e}")
        raise

@fpl_bp.route('/gameweeks', methods=['GET'])
def get_all_gameweeks():
    """API endpoint to get all gameweeks"""
    try:
        # Check if we should return only the next upcoming gameweek
        only_next = request.args.get('only_next', 'false').lower() == 'true'
        
        if only_next:
            next_gameweek = get_next_upcoming_gameweek()
            if next_gameweek:
                return jsonify([next_gameweek])
            return jsonify([])
        
        # Otherwise return all gameweeks
        gameweeks = get_gameweeks()
        return jsonify(gameweeks)
    except Exception as e:
        logger.error(f"Error in get_all_gameweeks: {e}")
        return jsonify({'error': str(e)}), 500

@fpl_bp.route('/gameweek/<gameweek_id>', methods=['GET'])
def get_gameweek(gameweek_id):
    """API endpoint to get a specific gameweek"""
    try:
        gameweek = get_gameweek_by_id(gameweek_id)
        if not gameweek:
            return jsonify({'error': 'Gameweek not found'}), 404
        
        return jsonify(gameweek)
    except Exception as e:
        logger.error(f"Error in get_gameweek: {e}")
        return jsonify({'error': str(e)}), 500

@fpl_bp.route('/gameweek/<gameweek_id>/content', methods=['GET'])
def get_content(gameweek_id):
    """API endpoint to get content for a specific gameweek"""
    try:
        gameweek = get_gameweek_by_id(gameweek_id)
        if not gameweek:
            return jsonify({'error': 'Gameweek not found'}), 404
        
        content = get_gameweek_content(gameweek_id)
        if not content:
            return jsonify({'error': 'Content not found for this gameweek'}), 404
        
        return jsonify(content)
    except Exception as e:
        logger.error(f"Error in get_content: {e}")
        return jsonify({'error': str(e)}), 500

@fpl_bp.route('/gameweek/<gameweek_id>/generate', methods=['POST'])
def generate_gameweek_content_endpoint(gameweek_id):
    """API endpoint to generate content for a specific gameweek"""
    try:
        gameweek = get_gameweek_by_id(gameweek_id)
        if not gameweek:
            return jsonify({'error': 'Gameweek not found'}), 404
        
        # Check if the gameweek is completed - don't generate content for past gameweeks
        if gameweek['status'] == 'completed':
            return jsonify({'error': 'Cannot generate content for completed gameweeks'}), 400
        
        # Check if content already exists
        existing_content = get_gameweek_content(gameweek_id)
        if existing_content:
            # If force parameter is not set to true, return existing content
            if not request.args.get('force', '').lower() == 'true':
                return jsonify({
                    'message': 'Content already exists for this gameweek',
                    'content': existing_content
                })
        
        # Generate new content
        content = generate_gameweek_content(gameweek['number'])
        
        # Update gameweek status to show content has been generated
        gameweek['content_generated'] = True
        
        return jsonify({
            'message': 'Content generated successfully',
            'content': content
        })
    except Exception as e:
        logger.error(f"Error in generate_gameweek_content_endpoint: {e}")
        return jsonify({'error': str(e)}), 500
