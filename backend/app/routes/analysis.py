from flask import Blueprint, jsonify, request
import json
import os
import sys
import pathlib

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent.parent.parent))

from utils.data_utils import load_fixtures, load_analysis, save_analysis
from tools.content_generator import generate_fixture_analysis

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/<fixture_id>', methods=['GET'])
def get_analysis(fixture_id):
    """Get analysis for a specific fixture"""
    try:
        # Check if analysis exists for this fixture
        analysis = load_analysis(fixture_id)
        
        if not analysis:
            return jsonify({"error": "Analysis not found for this fixture"}), 404
            
        return jsonify(analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analysis_bp.route('/generate/<fixture_id>', methods=['POST'])
def generate_analysis(fixture_id):
    """Generate analysis for a specific fixture"""
    try:
        # Check if fixture exists
        fixtures = load_fixtures()
        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
        
        if not fixture:
            return jsonify({"error": "Fixture not found"}), 404
        
        # Check if analysis already exists
        existing_analysis = load_analysis(fixture_id)
        if existing_analysis and not request.args.get('force', default=False, type=bool):
            return jsonify({
                "message": "Analysis already exists for this fixture", 
                "analysis": existing_analysis
            })
        
        # Generate analysis
        analysis = generate_fixture_analysis(fixture)
        
        # Save analysis
        save_analysis(fixture_id, analysis)
        
        return jsonify({
            "message": "Analysis generated successfully", 
            "analysis": analysis
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analysis_bp.route('/batch-generate', methods=['POST'])
def batch_generate_analysis():
    """Generate analysis for multiple fixtures"""
    try:
        # Get request data
        data = request.get_json()
        fixture_ids = data.get('fixture_ids', [])
        force = data.get('force', False)
        
        if not fixture_ids:
            return jsonify({"error": "No fixture IDs provided"}), 400
        
        # Load fixtures
        fixtures = load_fixtures()
        
        results = []
        for fixture_id in fixture_ids:
            fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
            
            if not fixture:
                results.append({
                    "fixture_id": fixture_id,
                    "status": "error",
                    "message": "Fixture not found"
                })
                continue
            
            # Check if analysis already exists
            existing_analysis = load_analysis(fixture_id)
            if existing_analysis and not force:
                results.append({
                    "fixture_id": fixture_id,
                    "status": "skipped",
                    "message": "Analysis already exists"
                })
                continue
            
            # Generate analysis
            try:
                analysis = generate_fixture_analysis(fixture)
                save_analysis(fixture_id, analysis)
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
            "message": f"Batch analysis generation completed. {len([r for r in results if r['status'] == 'success'])} succeeded, {len([r for r in results if r['status'] == 'error'])} failed, {len([r for r in results if r['status'] == 'skipped'])} skipped.",
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
