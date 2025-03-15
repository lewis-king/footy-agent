import sys
import os
import json
import unittest
import re
from datetime import datetime
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from tools.fpl_content_generator import FPLContentGenerator

class TestFPLContentGenerator(unittest.TestCase):
    
    def setUp(self):
        self.generator = FPLContentGenerator()
    
    def test_parse_perplexity_response_from_debug_file(self):
        """Test that the _parse_perplexity_response method correctly extracts JSON from a debug file"""
        # Path to the debug file
        debug_file_path = Path(__file__).parent.parent / "data" / "debug" / "perplexity_response_20250315_122435.txt"
        
        # Read the content from the debug file
        with open(debug_file_path, 'r') as f:
            content = f.read()
        
        # Extract the JSON content manually to verify it exists in the file
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', content)
        self.assertIsNotNone(json_match, "JSON code block not found in the debug file")
        
        json_content = json_match.group(1).strip()
        self.assertTrue(len(json_content) > 0, "JSON content is empty")
        
        # Print the length of the extracted JSON content to understand its size
        print(f"Length of extracted JSON content: {len(json_content)} characters")
        
        # Print the specific location where the JSON parsing error occurs
        try:
            json.loads(json_content)
            print("JSON parsed successfully manually!")
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Error location: line {e.lineno}, column {e.colno}, position {e.pos}")
            
            # Print the content around the error position to help debug
            start_pos = max(0, e.pos - 50)
            end_pos = min(len(json_content), e.pos + 50)
            print(f"Content around error: '...{json_content[start_pos:e.pos]}|ERROR HERE|{json_content[e.pos:end_pos]}...'")
        
        # Call the method being tested
        try:
            parsed_json = self.generator._parse_perplexity_response(content)
            
            # Verify that we got a valid JSON response
            self.assertIsInstance(parsed_json, dict, "Parsed result is not a dictionary")
            
            # Check for expected keys in the JSON
            expected_keys = ["overview"]  # Only check for overview as minimum requirement
            for key in expected_keys:
                self.assertIn(key, parsed_json, f"Key '{key}' not found in parsed JSON")
            
            # Check some specific content to ensure it was parsed correctly
            self.assertIn("Gameweek 29", parsed_json["overview"], 
                         "Expected content not found in overview")
            
            # Print success message with details about the parsed JSON
            print(f"Parse perplexity response test passed!")
            print(f"Parsed JSON keys: {list(parsed_json.keys())}")
            
            # Check if the team_insights key exists and print its structure
            if "team_insights" in parsed_json:
                print(f"team_insights keys: {list(parsed_json['team_insights'].keys())}")
                
                # Check if suggested_starting_xi exists and print its value
                if "suggested_starting_xi" in parsed_json["team_insights"]:
                    print(f"suggested_starting_xi value: {parsed_json['team_insights']['suggested_starting_xi']}")
            
        except Exception as e:
            self.fail(f"_parse_perplexity_response raised an exception: {str(e)}")
    
    def test_structure_response(self):
        """Test that the _structure_response method correctly parses the JSON response"""
        # Create a sample JSON response that matches the structure in the debug file
        response = {
            "overview": "Gameweek 29 presents a unique blank gameweek challenge",
            "top_picks": [
                {
                    "position": "GK",
                    "players": [
                        {
                            "name": "Mark Flekken",
                            "team": "Brentford",
                            "reason": "2nd-best GK form",
                            "price": 4.5,
                            "ownership": 6.2
                        }
                    ]
                },
                {
                    "position": "DEF",
                    "players": [
                        {
                            "name": "Nathan Aké",
                            "team": "Man City",
                            "reason": "78% goal involvement rate",
                            "price": 5.2,
                            "ownership": 12.4
                        }
                    ]
                }
            ],
            "differentials": [
                {
                    "name": "Alejandro Garnacho",
                    "team": "Man United",
                    "position": "MID",
                    "reason": "4.8% owned",
                    "ownership": 4.8
                }
            ],
            "captain_picks": [
                {
                    "name": "Erling Haaland",
                    "team": "Man City",
                    "reason": "#1 captaincy index",
                    "fixtures": "BHA (H)"
                }
            ],
            "key_fixtures": [
                {
                    "home_team": "Man City",
                    "away_team": "Brighton",
                    "analysis": "City have 58% win probability"
                }
            ],
            "team_insights": {
                "current_team_analysis": "**Strengths:**\n- Solid Fulham defensive double",
                "suggested_transfers": [
                    {
                        "player_out": "Alexander Isak",
                        "player_in": "Dominic Solanke",
                        "reason": "Essential replacement"
                    }
                ],
                "suggested_starting_xi": "Sanchez (CHE)\nWan-Bissaka (MUN)",
                "captain_suggestion": "Bruno Fernandes - Highest ceiling",
                "chip_advice": "**Free Hit NOT recommended**"
            }
        }
        
        # Call the method being tested
        gameweek = 29
        team_state = {"some": "data"}  # Dummy team state
        structured_response = self.generator._structure_response(response, gameweek, team_state)
        
        # Verify the structure
        self.assertEqual(structured_response["gameweekId"], f"gw-{gameweek}")
        self.assertTrue("lastUpdated" in structured_response)
        self.assertEqual(structured_response["overview"], response["overview"])
        
        # Check that topPicks is correctly formatted
        self.assertEqual(len(structured_response["topPicks"]), len(response["top_picks"]))
        
        # Check that differentials is correctly formatted
        self.assertEqual(len(structured_response["differentials"]), len(response["differentials"]))
        
        # Check that captainPicks is correctly formatted
        self.assertEqual(len(structured_response["captainPicks"]), len(response["captain_picks"]))
        
        # Check that keyFixtures is correctly formatted
        self.assertEqual(len(structured_response["keyFixtures"]), len(response["key_fixtures"]))
        
        # Check that chipAdvice is correctly extracted from team_insights
        self.assertEqual(structured_response["chipAdvice"], response["team_insights"]["chip_advice"])
        
        # Check that teamInsights is correctly formatted
        self.assertTrue("teamInsights" in structured_response)
        self.assertEqual(structured_response["teamInsights"]["currentTeamAnalysis"], 
                         response["team_insights"]["current_team_analysis"])
        self.assertEqual(len(structured_response["teamInsights"]["suggestedTransfers"]), 
                         len(response["team_insights"]["suggested_transfers"]))
        self.assertEqual(structured_response["teamInsights"]["suggestedStartingXI"], 
                         response["team_insights"]["suggested_starting_xi"])
        self.assertEqual(structured_response["teamInsights"]["captainSuggestion"], 
                         response["team_insights"]["captain_suggestion"])
        self.assertEqual(structured_response["teamInsights"]["chipAdvice"], 
                         response["team_insights"]["chip_advice"])
        
        print("Structure response test passed!")

if __name__ == "__main__":
    unittest.main()
