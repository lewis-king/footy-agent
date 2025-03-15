import sys
import os
import json
import re
from pathlib import Path

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
    
    # Try to parse the content using the _parse_perplexity_response method
    try:
        # Extract content from code blocks if present
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', content)
        
        if json_match:
            # Extract the JSON content from the code block
            json_content = json_match.group(1).strip()
            print(f"Found JSON content in code block ({len(json_content)} chars)")
            print(f"First 100 chars of JSON content: {json_content[:100]}")
            print(f"Last 100 chars of JSON content: {json_content[-100:]}")
            
            # Check if the content starts and ends with curly braces
            if json_content.startswith("{") and json_content.endswith("}"):
                print("JSON content starts with { and ends with }")
            else:
                print(f"JSON content starts with: {json_content[0:10]} and ends with: {json_content[-10:]}")
            
            # Try to manually extract a valid JSON object
            json_obj_match = re.search(r'(\{[\s\S]*\})', json_content)
            if json_obj_match:
                extracted_json = json_obj_match.group(1)
                print(f"Extracted JSON object ({len(extracted_json)} chars)")
                print(f"First 100 chars: {extracted_json[:100]}")
                print(f"Last 100 chars: {extracted_json[-100:]}")
                
                try:
                    # Try to parse the extracted JSON
                    parsed_json = json.loads(extracted_json)
                    print("Successfully parsed extracted JSON object!")
                    print("Keys:", list(parsed_json.keys()))
                except json.JSONDecodeError as e:
                    print(f"Extracted JSON parsing failed: {str(e)}")
                    print(f"Error at position {e.pos}, line {e.lineno}, column {e.colno}")
                    print(f"Context around error: {extracted_json[max(0, e.pos-20):min(len(extracted_json), e.pos+20)]}")
                    
                    # Try a more manual approach - create a clean JSON string
                    clean_json = '{'
                    # Add overview
                    if "overview" in extracted_json:
                        overview_match = re.search(r'"overview"\s*:\s*"([^"]*)"', extracted_json)
                        if overview_match:
                            clean_json += f'"overview": "{overview_match.group(1)}",'
                    
                    # Add top_picks
                    clean_json += '"top_picks": [],'
                    
                    # Add differentials
                    clean_json += '"differentials": [],'
                    
                    # Add captain_picks
                    clean_json += '"captain_picks": [],'
                    
                    # Add key_fixtures
                    clean_json += '"key_fixtures": [],'
                    
                    # Add team_insights
                    clean_json += '"team_insights": {"current_team_analysis": "Manually extracted", "suggested_transfers": []}'
                    
                    # Close the JSON object
                    clean_json += '}'
                    
                    try:
                        # Try to parse the clean JSON
                        parsed_json = json.loads(clean_json)
                        print("Successfully parsed clean JSON!")
                        print("Keys:", list(parsed_json.keys()))
                        
                        # Try to structure the response
                        structured_response = generator._structure_response(parsed_json, 29)
                        print("Successfully structured the response!")
                        print("Structured response keys:", list(structured_response.keys()))
                    except json.JSONDecodeError as e2:
                        print(f"Clean JSON parsing failed: {str(e2)}")
            else:
                print("Could not extract a JSON object from the content")
        else:
            print("No JSON code block found in the content")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
