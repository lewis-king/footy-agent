from flask import Blueprint, jsonify, request
import json
import os
from datetime import datetime
import sys
import pathlib

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent.parent.parent))

from utils.data_utils import load_fixtures, load_analysis, save_analysis
from tools.content_generator import generate_fixture_analysis
from backend.tools.fpl_content_generator import FPLContentGenerator

analysis_bp = Blueprint('analysis', __name__)

def determine_competition_from_fixture_id(fixture_id):
    """
    Determine which competition a fixture belongs to based on its ID
    
    Args:
        fixture_id: ID of the fixture
        
    Returns:
        Competition name ('premier-league' or 'champions-league')
    """
    if fixture_id.startswith('pl-'):
        return 'premier-league'
    elif fixture_id.startswith('cl-'):
        return 'champions-league'
    else:
        # Default to premier-league for backward compatibility
        return 'premier-league'

@analysis_bp.route('/generate/<fixture_id>', methods=['POST'])
def generate_analysis(fixture_id):
    """
    Generate betting analysis for a specific fixture
    """
    try:
        # Check if analysis already exists
        existing_analysis = load_analysis(fixture_id)
        if existing_analysis:
            return jsonify({
                "message": "Analysis already exists for this fixture",
                "analysis": existing_analysis,
                "cached": True
            })
        
        # Determine which competition to load based on fixture_id prefix
        competition = determine_competition_from_fixture_id(fixture_id)
        
        # Get fixture data
        fixtures = load_fixtures(competition)
        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
        
        # If not found in the specified competition, try all competitions
        if not fixture:
            for comp in ['premier-league', 'champions-league']:
                if comp != competition:  # Skip the one we already checked
                    comp_fixtures = load_fixtures(comp)
                    fixture = next((f for f in comp_fixtures if f['id'] == fixture_id), None)
                    if fixture:
                        competition = comp
                        break
        
        if not fixture:
            return jsonify({"error": "Fixture not found"}), 404
        
        # Generate analysis
        #analysis = generate_fixture_analysis(fixture)
        
        # Save analysis
        #save_analysis(fixture_id, analysis)
        
        return jsonify({
            "message": "Analysis generated successfully",
            "analysis": analysis,
            "cached": False
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analysis_bp.route('/<fixture_id>', methods=['GET'])
def get_analysis(fixture_id):
    """
    Get betting analysis for a specific fixture.
    If analysis doesn't exist, generate it automatically.
    """
    try:
        # Check if analysis exists
        analysis = load_analysis(fixture_id)
        
        if not analysis:
            # Analysis doesn't exist, so generate it
            # Determine which competition to load based on fixture_id prefix
            competition = determine_competition_from_fixture_id(fixture_id)
            
            # Get fixture data
            fixtures = load_fixtures(competition)
            fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
            
            # If not found in the specified competition, try all competitions
            if not fixture:
                for comp in ['premier-league', 'champions-league']:
                    if comp != competition:  # Skip the one we already checked
                        comp_fixtures = load_fixtures(comp)
                        fixture = next((f for f in comp_fixtures if f['id'] == fixture_id), None)
                        if fixture:
                            break
            
            if not fixture:
                return jsonify({"error": "Fixture not found"}), 404
            
            # Generate analysis
            analysis = generate_fixture_analysis(fixture)
            
            # Save analysis
            save_analysis(fixture_id, analysis)
        
        return jsonify(analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analysis_bp.route('/batch', methods=['POST'])
def batch_generate_analysis():
    """
    Generate analysis for multiple fixtures
    Request body should contain a list of fixture IDs
    """
    try:
        data = request.get_json()
        
        if not data or 'fixture_ids' not in data:
            return jsonify({"error": "Missing fixture_ids in request body"}), 400
        
        fixture_ids = data['fixture_ids']
        
        if not isinstance(fixture_ids, list):
            return jsonify({"error": "fixture_ids must be a list"}), 400
        
        # Group fixture IDs by competition for more efficient loading
        fixture_ids_by_competition = {}
        for fixture_id in fixture_ids:
            competition = determine_competition_from_fixture_id(fixture_id)
            if competition not in fixture_ids_by_competition:
                fixture_ids_by_competition[competition] = []
            fixture_ids_by_competition[competition].append(fixture_id)
        
        # Load fixtures for each competition
        fixtures_by_competition = {}
        for competition, ids in fixture_ids_by_competition.items():
            fixtures_by_competition[competition] = load_fixtures(competition)
        
        results = []
        for fixture_id in fixture_ids:
            # Check if analysis already exists
            existing_analysis = load_analysis(fixture_id)
            if existing_analysis:
                results.append({
                    "fixture_id": fixture_id,
                    "status": "cached",
                    "message": "Analysis already exists"
                })
                continue
            
            # Determine which competition this fixture belongs to
            competition = determine_competition_from_fixture_id(fixture_id)
            
            # Find fixture in its competition
            fixture = next((f for f in fixtures_by_competition[competition] if f['id'] == fixture_id), None)
            
            # If not found, try other competitions
            if not fixture:
                for comp, fixtures in fixtures_by_competition.items():
                    if comp != competition:
                        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
                        if fixture:
                            break
            
            if not fixture:
                results.append({
                    "fixture_id": fixture_id,
                    "status": "error",
                    "message": "Fixture not found"
                })
                continue
            
            try:
                # Generate analysis
                #analysis = generate_fixture_analysis(fixture)
                
                # Save analysis
                #save_analysis(fixture_id, analysis)
                
                results.append({
                    "fixture_id": fixture_id,
                    "status": "success",
                    "message": "Analysis generated successfully"
                })
            except Exception as e:
                results.append({
                    "fixture_id": fixture_id,
                    "status": "error",
                    "message": str(e)
                })
        
        return jsonify({
            "message": f"Batch analysis completed. {len([r for r in results if r['status'] == 'success'])} succeeded, {len([r for r in results if r['status'] == 'error'])} failed, {len([r for r in results if r['status'] == 'cached'])} cached.",
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analysis_bp.route('/fpl/generic-advice/<int:gameweek>', methods=['GET'])
def get_generic_fpl_advice(gameweek):
    generator = FPLContentGenerator()
    return jsonify(generator.generate_generic_advice(gameweek))

@analysis_bp.route('/fpl/personalized-advice/<int:gameweek>', methods=['POST'])
def get_personalized_fpl_advice(gameweek):
    team_data = request.json
    generator = FPLContentGenerator()
    return jsonify(generator.generate_personalized_advice(gameweek, team_data))
