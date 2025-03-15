import sys
import os
import json
import re
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from tools.fpl_content_generator import FPLContentGenerator

def fix_json_content(json_content: str) -> str:
    """Fix common JSON formatting issues that might cause parsing errors"""
    print("Attempting to fix malformed JSON content")
    
    # Fix unterminated strings (common issue with AI-generated JSON)
    # This regex finds strings that start with a quote but don't end with one before a comma or closing bracket
    import re
    fixed_content = re.sub(r'"([^"]*?)(?=,|\]|\})', r'"\1"', json_content)
    
    # Replace any unescaped newlines in strings
    fixed_content = fixed_content.replace('\n', '\\n')
    
    # Fix unescaped quotes in strings
    fixed_content = re.sub(r'(?<!\\)"(?!,|\]|\}|:)', r'\\"', fixed_content)
    
    # Fix missing commas between objects in arrays
    fixed_content = re.sub(r'(\})\s*(\{)', r'\1,\2', fixed_content)
    
    # Fix trailing commas in arrays and objects
    fixed_content = re.sub(r',\s*(\]|\})', r'\1', fixed_content)
    
    print("JSON content fixed, attempting to parse again")
    return fixed_content

def main():
    # Path to the problematic JSON file
    file_path = '/Users/lewis-king/Workspace/footyagent/backend/data/debug/perplexity_response_20250315_120225.txt'
    
    # Read the file content
    with open(file_path, 'r') as f:
        content = f.read()
    
    print(f"Read {len(content)} characters from file")
    
    # Try to parse the JSON directly
    try:
        parsed_json = json.loads(content)
        print("Original JSON parsed successfully!")
    except json.JSONDecodeError as e:
        print(f"Original JSON parsing failed: {str(e)}")
        
        # Try to extract JSON from code blocks if present
        json_match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
        
        if json_match:
            # Extract the JSON content from the code block
            json_content = json_match.group(1).strip()
            print(f"Found JSON content in code block ({len(json_content)} chars)")
            
            try:
                # Try to parse the extracted JSON
                parsed_json = json.loads(json_content)
                print("JSON from code block parsed successfully!")
            except json.JSONDecodeError as e2:
                print(f"JSON from code block parsing failed: {str(e2)}")
                
                # Try to fix the JSON
                fixed_json = fix_json_content(json_content)
                
                try:
                    # Try to parse the fixed JSON
                    parsed_json = json.loads(fixed_json)
                    print("Fixed JSON parsed successfully!")
                    print(f"Fixed JSON has {len(fixed_json)} characters")
                    print("Sample of parsed JSON:")
                    print(json.dumps(parsed_json, indent=2)[:500] + "...")
                except json.JSONDecodeError as e3:
                    print(f"Fixed JSON parsing still failed: {str(e3)}")
        else:
            print("No JSON code block found in the content")

if __name__ == "__main__":
    main()
