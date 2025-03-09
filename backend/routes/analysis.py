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
        
        # Get fixture data
        fixtures = load_fixtures()
        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
        
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
            # Get fixture data
            fixtures = load_fixtures()
            fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
            
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
        
        # Get fixtures
        fixtures = load_fixtures()
        
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
            
            # Find fixture
            fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
            
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
