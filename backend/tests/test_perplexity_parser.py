import sys
import os
import json
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from tools.fpl_content_generator import FPLContentGenerator

def main():
    # Create an instance of the FPLContentGenerator
    generator = FPLContentGenerator()
    
    # Path to the problematic JSON file
    file_path = '/Users/lewis-king/Workspace/footyagent/backend/data/debug/perplexity_response_20250315_120225.txt'
    
    # Read the file content
    with open(file_path, 'r') as f:
        content = f.read()
    
    print(f"Read {len(content)} characters from file")
    
    # Test the _parse_perplexity_response method
    try:
        parsed_response = generator._parse_perplexity_response(content)
        print("Successfully parsed the Perplexity response!")
        print(f"Response keys: {list(parsed_response.keys())}")
        
        # Test the _structure_response method
        structured_response = generator._structure_response(parsed_response, 29)
        print("Successfully structured the response!")
        print(f"Structured response keys: {list(structured_response.keys())}")
        
        # Print some key information from the structured response
        print("\nOverview:")
        print(structured_response.get("overview", "No overview available"))
        
        print("\nChip Advice:")
        print(structured_response.get("chipAdvice", "No chip advice available"))
        
        print("\nTop Picks:")
        top_picks = structured_response.get("topPicks", [])
        for pick in top_picks[:3]:  # Show first 3 picks
            print(f"- {pick.get('name', 'Unknown')}: {pick.get('reason', 'No reason provided')}")
        
        # Save the structured response to a file for inspection
        debug_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'debug')
        with open(os.path.join(debug_dir, 'structured_response.json'), 'w') as f:
            json.dump(structured_response, f, indent=2)
        print("\nStructured response saved to data/debug/structured_response.json")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
