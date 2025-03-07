import os
import json
from dotenv import load_dotenv
import sys
import pathlib
from datetime import datetime

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent))

# Import the generate_fixture_analysis function
from tools.content_generator import generate_fixture_analysis

# Load environment variables
load_dotenv()

# Create a sample fixture for testing
sample_fixture = {
    "id": "test-fixture-001",
    "home_team": "Arsenal",
    "away_team": "Manchester City",
    "date": datetime.now().strftime('%Y-%m-%d'),
    "venue": "Emirates Stadium",
    "home_form": "WWDWW",
    "away_form": "WWWDW",
    "asian_handicap_line": "0.25",
    "asian_handicap_home": "2.05",
    "asian_handicap_away": "1.85"
}

# Print the fixture details
print(f"Generating analysis for {sample_fixture['home_team']} vs {sample_fixture['away_team']}")
print(f"Date: {sample_fixture['date']}")
print(f"Venue: {sample_fixture['venue']}")
print(f"Home form: {sample_fixture['home_form']}")
print(f"Away form: {sample_fixture['away_form']}")
print(f"Asian handicap: {sample_fixture['asian_handicap_line']} (Home: {sample_fixture['asian_handicap_home']}, Away: {sample_fixture['asian_handicap_away']})")
print("-" * 50)

# Generate the analysis
try:
    print("Generating fixture analysis...")
    analysis = generate_fixture_analysis(sample_fixture)
    
    # Print the generated analysis
    print("\nAnalysis generated successfully!")
    
    # Check if generated_at exists, otherwise add it
    if 'generated_at' not in analysis:
        analysis['generated_at'] = datetime.now().isoformat()
        print(f"Generated at: {analysis['generated_at']} (added by test script)")
    else:
        print(f"Generated at: {analysis['generated_at']}")
    
    # Print a summary of the content
    print("\nContent summary:")
    for section, content in analysis['content'].items():
        if isinstance(content, dict):
            print(f"- {section}: {len(json.dumps(content))} characters")
        elif isinstance(content, list):
            print(f"- {section}: {len(content)} items")
        else:
            print(f"- {section}: {len(str(content))} characters")
    
    # Save the analysis to a file for inspection
    output_file = "test_analysis_output.json"
    with open(output_file, "w") as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\nFull analysis saved to {output_file}")
    
except Exception as e:
    print(f"Error generating analysis: {str(e)}")
    import traceback
    print(traceback.format_exc())
