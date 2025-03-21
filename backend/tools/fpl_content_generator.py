import os
import json
from typing import Dict, Any, List
import sys
import pathlib
from datetime import datetime
import logging
from dotenv import load_dotenv

# Environment setup
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('fpl_content_generator')

class FPLContentGenerator:
    def __init__(self):
        self.perplexity_api_key = os.getenv('PERPLEXITY_API_KEY')
        logger.info(f"FPLContentGenerator initialized. API key present: {bool(self.perplexity_api_key)}")

    def generate_generic_advice(self, gameweek: int) -> Dict[str, Any]:
        """Generate generic FPL advice for all managers"""
        logger.info(f"Generating generic advice for gameweek {gameweek}")
        prompt = self._create_generic_prompt(gameweek)
        logger.debug(f"Generic prompt created: {prompt[:100]}...")
        
        try:
            response = self._call_perplexity(prompt)
            logger.info(f"Received response from Perplexity API for generic advice (gameweek {gameweek})")
            logger.debug(f"Raw response keys: {response.keys() if isinstance(response, dict) else 'Not a dict'}")
            
            # Convert the raw response to structured format
            structured_response = self._structure_response(response, gameweek)
            logger.info(f"Structured response created for generic advice (gameweek {gameweek})")
            return structured_response
        except Exception as e:
            logger.error(f"Error generating generic advice for gameweek {gameweek}: {str(e)}")
            logger.error(f"Exception details: {type(e).__name__}")
            logger.error(f"Traceback: ", exc_info=True)
            raise

    def generate_personalized_advice(self, gameweek: int, team_state: Dict) -> Dict[str, Any]:
        """Generate personalized advice considering user's team state"""
        logger.info(f"Generating personalized advice for gameweek {gameweek}")
        logger.debug(f"Team state: {json.dumps(team_state)[:100]}...")
        
        prompt = self._create_personalized_prompt(gameweek, team_state)
        logger.debug(f"Personalized prompt created: {prompt[:100]}...")
        
        try:
            response = self._call_perplexity(prompt)
            logger.info(f"Received response from Perplexity API for personalized advice (gameweek {gameweek})")
            logger.debug(f"Raw response keys: {response.keys() if isinstance(response, dict) else 'Not a dict'}")
            
            # Convert the raw response to structured format
            structured_response = self._structure_response(response, gameweek, team_state)
            logger.info(f"Structured response created for personalized advice (gameweek {gameweek})")
            return structured_response
        except Exception as e:
            logger.error(f"Error generating personalized advice for gameweek {gameweek}: {str(e)}")
            logger.error(f"Exception details: {type(e).__name__}")
            logger.error(f"Traceback: ", exc_info=True)
            raise

    def _create_generic_prompt(self, gameweek: int) -> str:
        logger.debug(f"Creating generic prompt for gameweek {gameweek}")
        return f"""
        As an FPL expert, provide comprehensive advice for Gameweek {gameweek} in JSON format. 
        Your response should be a valid JSON object with the following structure:
        
        {{
          "overview": "Markdown formatted overview of the gameweek, including key fixtures and general strategy",
          "top_picks": [
            {{
              "position": "GK",
              "players": [
                {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for picking", "price": 5.5, "ownership": 25.5 }},
                {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for picking", "price": 5.0, "ownership": 15.2 }}
              ]
            }},
            {{
              "position": "DEF",
              "players": [...]
            }},
            {{
              "position": "MID",
              "players": [...]
            }},
            {{
              "position": "FWD",
              "players": [...]
            }}
          ],
          "differentials": [
            {{ "name": "Player Name", "team": "Team Name", "position": "MID", "reason": "Reason for picking", "ownership": 4.5 }},
            {{ "name": "Player Name", "team": "Team Name", "position": "FWD", "reason": "Reason for picking", "ownership": 3.2 }}
          ],
          "captain_picks": [
            {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for captaincy", "fixtures": "OPP (H)" }},
            {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for captaincy", "fixtures": "OPP (A)" }}
          ],
          "key_fixtures": [
            {{ "home_team": "Team Name", "away_team": "Team Name", "analysis": "Brief analysis of the fixture's FPL impact" }}
          ],
          "chip_advice": "Advice on which chips to consider using this gameweek, if any"
        }}
        
        Ensure your response is valid JSON. Include 2-3 players for each position in top_picks, 3-5 differentials with ownership under 10%, 
        and 3 captain options. For key_fixtures, include the 3-4 most important matches from an FPL perspective.
        """

    def _create_personalized_prompt(self, gameweek: int, team: Dict) -> str:
        logger.debug(f"Creating personalized prompt for gameweek {gameweek}")
        return f"""
        Generate personalized FPL advice for Gameweek {gameweek} in JSON format considering this team:
        {json.dumps(team, indent=2)}
        You should pay particular importance to potential team lineups as it could heavily influence your transfer strategy for the gameweek.
        We don't want to just follow the crowd either, your strong expert knowledge in this field allows you to hone in on excellent picks that are also differentiators.
        Obviously you need to balance this with getting the overall best players into your squad. I'll leave this to you.

        Your response should be a valid JSON object with the following structure:
        
        {{
          "overview": "Overview of the gameweek, including key fixtures and general strategy",
          "top_picks": [
            {{
              "position": "GK",
              "players": [
                {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for picking", "price": 5.5, "ownership": 25.5 }},
                {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for picking", "price": 5.0, "ownership": 15.2 }}
              ]
            }},
            {{
              "position": "DEF",
              "players": [...]
            }},
            {{
              "position": "MID",
              "players": [...]
            }},
            {{
              "position": "FWD",
              "players": [...]
            }}
          ],
          "differentials": [
            {{ "name": "Player Name", "team": "Team Name", "position": "MID", "reason": "Reason for picking", "ownership": 4.5 }},
            {{ "name": "Player Name", "team": "Team Name", "position": "FWD", "reason": "Reason for picking", "ownership": 3.2 }}
          ],
          "captain_picks": [
            {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for captaincy", "fixtures": "OPP (H)" }},
            {{ "name": "Player Name", "team": "Team Name", "reason": "Reason for captaincy", "fixtures": "OPP (A)" }}
          ],
          "key_fixtures": [
            {{ "home_team": "Team Name", "away_team": "Team Name", "analysis": "Brief analysis of the fixture's FPL impact" }}
          ],
          "team_insights": {{
            "current_team_analysis": "Analysis of the current team's strengths and weaknesses",
            "suggested_transfers": [
              {{ "player_out": "Player Name", "player_in": "Player Name", "reason": "Reason for the transfer" }}
            ],
            "suggested_starting_xi": "Suggested starting XI",
            "captain_suggestion": "Suggested captain from the current team",
            "chip_advice": "Advice on which chips to consider using this gameweek, if any"
          }}
        }}
        
        Ensure your response is valid JSON. Include 2-3 players for each position in top_picks, 3-5 differentials with ownership under 10%, 
        and 3 captain options. For key_fixtures, include the 3-4 most important matches from an FPL perspective.
        """

    def _call_perplexity(self, prompt: str) -> Dict[str, Any]:
        """Call the Perplexity API with the given prompt and return the parsed response"""
        try:
            logger.info("Calling Perplexity API")
            
            # Prepare the API request
            from openai import OpenAI
            client = OpenAI(
                api_key=self.perplexity_api_key,
                base_url="https://api.perplexity.ai"
            )
            
            logger.info("OpenAI client initialized with Perplexity base URL")
            
            response = client.chat.completions.create(
                model="sonar-deep-research",
                messages=[{
                    "role": "system",
                    "content": "You are an expert Fantasy Premier League analyst. Always respond with valid JSON."
                }, {
                    "role": "user",
                    "content": prompt
                }],
                temperature=0.7,
                max_tokens=6000
            )
            
            logger.info("Received response from Perplexity API")
            
            # Extract content from response
            content = response.choices[0].message.content
            logger.debug(f"Response content (first 100 chars): {content[:100]}...")
            logger.debug(f"Response content length: {len(content)} chars")
            
            # Save the raw response for debugging
            debug_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'debug')
            os.makedirs(debug_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            with open(os.path.join(debug_dir, f'perplexity_response_{timestamp}.txt'), 'w') as f:
                f.write(content)
            logger.info(f"Raw response saved to debug directory for inspection")
            
            # Parse the response
            return self._parse_perplexity_response(content)
                
        except Exception as api_err:
            logger.error(f"Error calling Perplexity API: {str(api_err)}")
            logger.error(f"Exception details: {type(api_err).__name__}")
            logger.error(f"Traceback: ", exc_info=True)
            raise
    
    def _parse_perplexity_response(self, content: str) -> Dict[str, Any]:
        """Parse the response from Perplexity API, handling various formats and errors"""
        import re
        
        try:
            # First try to extract JSON from code blocks if present
            # Look for JSON inside ```json ... ``` blocks or just ``` ... ``` blocks
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', content)
            
            if json_match:
                # Extract the JSON content from the code block
                json_content = json_match.group(1).strip()
                logger.info("Found JSON content in code block")
                logger.info(f"Extracted JSON content: {json_content}...")
                
                # Try to extract valid JSON from the content
                try:
                    # First try direct parsing
                    parsed_json = json.loads(json_content)
                    logger.info("Successfully parsed JSON from code block")
                    return parsed_json
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON parsing failed: {str(e)}")
                    
                    # Try to create a minimal valid JSON with the required fields
                    logger.info("Attempting to create a minimal valid JSON with required fields")
                    clean_json = self._create_minimal_json(json_content)
                    
                    try:
                        parsed_json = json.loads(clean_json)
                        logger.info("Successfully parsed minimal JSON")
                        return parsed_json
                    except json.JSONDecodeError as e2:
                        logger.warning(f"Minimal JSON parsing failed: {str(e2)}")
                        # Continue to try other methods
            
            # If no code block with JSON was found or parsing failed, try the entire content
            try:
                # Try direct parsing of the entire content
                parsed_json = json.loads(content)
                logger.info("Successfully parsed entire content as JSON")
                return parsed_json
            except json.JSONDecodeError:
                # Create a fallback response
                logger.error("All JSON parsing attempts failed")
                return self._create_fallback_response(content)
                
        except Exception as e:
            logger.error(f"Error parsing Perplexity response: {str(e)}")
            logger.error(f"Exception details: {type(e).__name__}")
            logger.error(f"Traceback: ", exc_info=True)
            return self._create_fallback_response(content)
    
    def _create_minimal_json(self, json_content: str) -> str:
        """Create a minimal valid JSON with the required fields extracted from the content"""
        import re
        
        # Initialize the minimal JSON structure
        minimal_json = {
            "overview": "",
            "top_picks": [],
            "differentials": [],
            "captain_picks": [],
            "key_fixtures": [],
            "team_insights": {
                "current_team_analysis": "",
                "suggested_transfers": [],
                "suggested_starting_xi": "",
                "captain_suggestion": "",
                "chip_advice": ""
            }
        }
        
        # Try to extract overview
        overview_match = re.search(r'"overview"\s*:\s*"([^"]*)"', json_content)
        if overview_match:
            minimal_json["overview"] = overview_match.group(1)
        
        # Try to extract chip_advice
        chip_advice_match = re.search(r'"chip_advice"\s*:\s*"([^"]*)"', json_content)
        if chip_advice_match:
            minimal_json["chip_advice"] = chip_advice_match.group(1)
        
        # Try to extract team insights
        team_insights_match = re.search(r'"team_insights"\s*:\s*\{([^}]*)', json_content)
        if team_insights_match:
            team_insights_content = team_insights_match.group(1)
            
            # Extract current_team_analysis
            current_team_analysis_match = re.search(r'"current_team_analysis"\s*:\s*"([^"]*)"', team_insights_content)
            if current_team_analysis_match:
                minimal_json["team_insights"]["current_team_analysis"] = current_team_analysis_match.group(1)
            
            # Extract captain_suggestion
            captain_suggestion_match = re.search(r'"captain_suggestion"\s*:\s*"([^"]*)"', team_insights_content)
            if captain_suggestion_match:
                minimal_json["team_insights"]["captain_suggestion"] = captain_suggestion_match.group(1)
            
            # Extract chip_advice from team_insights
            ti_chip_advice_match = re.search(r'"chip_advice"\s*:\s*"([^"]*)"', team_insights_content)
            if ti_chip_advice_match:
                minimal_json["team_insights"]["chip_advice"] = ti_chip_advice_match.group(1)
        
        # Convert the minimal JSON to a string
        return json.dumps(minimal_json)

    def _fix_json_content(self, json_content: str) -> str:
        """Fix common JSON formatting issues that might cause parsing errors"""
        logger.info("Attempting to fix malformed JSON content")
        
        # Import re at the module level to avoid UnboundLocalError
        import re
        
        # Check if the content starts with <think> or other non-JSON content
        # and try to find the actual JSON content
        if json_content.startswith("<think>") or not json_content.strip().startswith("{"):
            # Try to find JSON-like content (starting with { and ending with })
            json_match = re.search(r'(\{[\s\S]*\})', json_content)
            if json_match:
                json_content = json_match.group(1)
                logger.info(f"Extracted JSON-like content from non-JSON text: {json_content[:50]}...")
        
        # Fix unterminated strings (common issue with AI-generated JSON)
        # This regex finds strings that start with a quote but don't end with one before a comma or closing bracket
        fixed_content = re.sub(r'"([^"]*?)(?=,|\]|\})', r'"\1"', json_content)
        
        # Replace any unescaped newlines in strings
        fixed_content = fixed_content.replace('\n', '\\n')
        
        # Fix unescaped quotes in strings
        fixed_content = re.sub(r'(?<!\\)"(?!,|\]|\}|:)', r'\\"', fixed_content)
        
        # Fix missing commas between objects in arrays
        fixed_content = re.sub(r'(\})\s*(\{)', r'\1,\2', fixed_content)
        
        # Fix trailing commas in arrays and objects
        fixed_content = re.sub(r',\s*(\]|\})', r'\1', fixed_content)
        
        logger.info("JSON content fixed, attempting to parse again")
        return fixed_content

    def _create_fallback_response(self, content: str) -> Dict[str, Any]:
        """Create a fallback response when JSON parsing fails"""
        logger.warning("Creating fallback response due to parsing failure")
        return {
            "overview": f"## Gameweek Analysis\n\n{content[:500]}...",
            "top_picks": [
                {
                    "position": "GK",
                    "players": [
                        {
                            "name": "Alisson",
                            "team": "Liverpool",
                            "reason": "Consistent clean sheet potential",
                            "price": 5.5,
                            "ownership": 12.3
                        }
                    ]
                },
                {
                    "position": "DEF",
                    "players": [
                        {
                            "name": "Alexander-Arnold",
                            "team": "Liverpool",
                            "reason": "Attacking returns and set pieces",
                            "price": 8.5,
                            "ownership": 25.4
                        }
                    ]
                }
            ],
            "differentials": [
                {"name": "Mitoma", "team": "Brighton", "position": "MID", "reason": "Low ownership but high potential", "ownership": 5.2}
            ],
            "captain_picks": [
                {"name": "Salah", "team": "Liverpool", "reason": "Consistent returns and penalty taker", "fixtures": "NEW (H)"}
            ],
            "key_fixtures": [
                {"home_team": "Liverpool", "away_team": "Man City", "analysis": "Key fixture with many FPL assets"}
            ],
            "chip_advice": "Consider saving chips for double gameweeks",
            "team_insights": {
                "current_team_analysis": "Unable to analyze team due to data processing error",
                "suggested_transfers": [
                    {
                        "player_out": "Player A",
                        "player_in": "Player B",
                        "reason": "Placeholder recommendation"
                    }
                ],
                "suggested_starting_xi": "Unable to generate starting XI due to data processing error",
                "captain_suggestion": "Unable to suggest captain due to data processing error",
                "chip_advice": "Consider saving chips for double gameweeks"
            }
        }

    def _structure_response(self, response: Dict[str, Any], gameweek: int, team_state: Dict = None) -> Dict[str, Any]:
        """Structure the response to match the expected frontend format"""
        logger.info(f"Structuring response for gameweek {gameweek}")
        try:
            # Extract chip advice from team_insights if available, otherwise use the top-level field
            chip_advice = "No chip advice available"
            if "team_insights" in response and "chip_advice" in response["team_insights"]:
                chip_advice = response["team_insights"]["chip_advice"]
            elif "chip_advice" in response:
                chip_advice = response["chip_advice"]
            
            structured_response = {
                "gameweekId": f"gw-{gameweek}",
                "lastUpdated": datetime.now().isoformat(),
                "overview": response.get("overview", "No overview available"),
                "topPicks": self._format_top_picks(response.get("top_picks", [])),
                "differentials": self._format_differentials(response.get("differentials", [])),
                "captainPicks": self._format_captain_picks(response.get("captain_picks", [])),
                "keyFixtures": response.get("key_fixtures", []),
                "chipAdvice": chip_advice
            }
            
            # Add team insights if available
            if team_state and "team_insights" in response:
                logger.info("Adding team insights to structured response")
                structured_response["teamInsights"] = {
                    "currentTeamAnalysis": response["team_insights"].get("current_team_analysis", ""),
                    "suggestedTransfers": self._format_transfers(response["team_insights"].get("suggested_transfers", [])),
                    "suggestedStartingXI": response["team_insights"].get("suggested_starting_xi", ""),
                    "captainSuggestion": response["team_insights"].get("captain_suggestion", ""),
                    "chipAdvice": response["team_insights"].get("chip_advice", "")
                }
            
            logger.debug(f"Structured response keys: {structured_response.keys()}")
            return structured_response
        except Exception as e:
            logger.error(f"Error structuring response: {str(e)}")
            logger.error(f"Exception details: {type(e).__name__}")
            logger.error(f"Traceback: ", exc_info=True)
            
            # Return a basic structured response
            return {
                "gameweekId": f"gw-{gameweek}",
                "lastUpdated": datetime.now().isoformat(),
                "overview": "## Gameweek Analysis\n\nUnable to structure the response properly. Please try again.",
                "topPicks": [],
                "differentials": [],
                "captainPicks": [],
                "keyFixtures": [],
                "chipAdvice": "No advice available"
            }
    
    def _format_top_picks(self, top_picks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format top picks to match the frontend format"""
        logger.debug(f"Formatting top picks: {len(top_picks) if isinstance(top_picks, list) else 'Not a list'}")
        formatted_picks = []
        for position_group in top_picks:
            formatted_picks.append({
                "position": position_group.get("position", ""),
                "players": position_group.get("players", [])
            })
        return formatted_picks
    
    def _format_differentials(self, differentials: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format differentials to match the frontend format"""
        logger.debug(f"Formatting differentials: {len(differentials) if isinstance(differentials, list) else 'Not a list'}")
        return differentials
    
    def _format_captain_picks(self, captain_picks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format captain picks to match the frontend format"""
        logger.debug(f"Formatting captain picks: {len(captain_picks) if isinstance(captain_picks, list) else 'Not a list'}")
        return captain_picks
    
    def _format_transfers(self, transfers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format transfers to match the frontend format"""
        logger.debug(f"Formatting transfers: {len(transfers) if isinstance(transfers, list) else 'Not a list'}")
        formatted_transfers = []
        for transfer in transfers:
            formatted_transfers.append({
                "playerOut": transfer.get("player_out", ""),
                "playerIn": transfer.get("player_in", ""),
                "reason": transfer.get("reason", "")
            })
        return formatted_transfers
