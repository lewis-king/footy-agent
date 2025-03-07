import os
import json
from typing import Dict, Any, List
import sys
import pathlib
from datetime import datetime
import traceback
import re
import openai

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent.parent))

# Import dotenv for environment variables
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define output schemas for structured generation
response_schemas = [
    {"name": "match_overview", "description": "A comprehensive overview of the match, including team form, recent performances, and general context."},
    {"name": "asian_handicap_analysis", "description": "Detailed analysis of the Asian handicap market for this fixture, including value bets and recommendations."},
    {"name": "key_player_matchups", "description": "Analysis of key player matchups that could influence the outcome of the game."},
    {"name": "team_news", "description": "Latest team news including injuries, suspensions, and expected lineups."},
    {"name": "betting_insights", "description": "3-5 key betting insights for this match, focusing on value opportunities."},
    {"name": "prediction", "description": "A prediction for the match outcome with reasoning."}
]

# Define prompt template for fixture analysis
fixture_analysis_template = """
You are a professional football betting analyst specializing in Premier League matches. Your task is to provide comprehensive, data-driven betting analysis for an upcoming fixture.
YOU MUST USE UP TO DATE FACTS THAT YOU SOURCE - YOU CANNOT RELY ON YOUR BASE KNOWLEDGE WHEN STATING FACTS - I.E IF YOU DIDN'T SOURCE THE INFORMATION DON'T USE IT

FIXTURE INFORMATION:
- Home Team: {home_team}
- Away Team: {away_team}
- Date: {date}
- Venue: {venue}
- Home Team Form: {home_form}
- Away Team Form: {away_form}
- Asian Handicap Line: {asian_handicap_line}
- Asian Handicap Home Odds: {asian_handicap_home}
- Asian Handicap Away Odds: {asian_handicap_away}

TASK:
Provide detailed betting analysis for this fixture, focusing on value opportunities in the betting markets.
Your analysis should be structured according to the following format:

match_overview: A comprehensive overview of the match, including team form, recent performances, and general context.
asian_handicap_analysis: Detailed analysis of the Asian handicap market for this fixture, including value bets and recommendations.
key_player_matchups: Analysis of key player matchups that could influence the outcome of the game.
team_news: Latest team news including injuries, suspensions, and expected lineups.
betting_insights: 3-5 key betting insights for this match, focusing on value opportunities.
prediction: A prediction for the match outcome with reasoning.

IMPORTANT GUIDELINES:
1. Focus on data-driven insights rather than general observations
2. Provide specific, actionable betting recommendations
3. Consider team form, head-to-head records, injuries, and tactical matchups
4. Pay special attention to the Asian Handicap market and identify value bets
5. Make your content engaging and unique compared to mainstream betting sites
"""

def generate_fixture_analysis(fixture: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate betting analysis for a fixture using Perplexity API
    
    Args:
        fixture: Dictionary containing fixture information
        
    Returns:
        Dictionary containing analysis
    """
    import os
    import json
    import traceback
    from datetime import datetime
    
    try:
        # Format fixture data for prompt
        home_team = fixture.get("home_team", "")
        away_team = fixture.get("away_team", "")
        
        # Create a prompt for Perplexity
        prompt = create_perplexity_prompt(
            home_team=home_team,
            away_team=away_team,
            date=fixture.get("date", ""),
            venue=fixture.get("venue", ""),
            home_form=fixture.get("home_form", ""),
            away_form=fixture.get("away_form", ""),
            asian_handicap_line=fixture.get("asian_handicap_line", "0"),
            asian_handicap_home=fixture.get("asian_handicap_home", "1.90"),
            asian_handicap_away=fixture.get("asian_handicap_away", "1.90")
        )
        
        # Get Perplexity API key from environment variables
        perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")
        
        if not perplexity_api_key:
            print("Warning: PERPLEXITY_API_KEY not set. Using fallback method.")
            return generate_mock_analysis(fixture)
        else:
            print(f"Generating analysis for {fixture['home_team']} vs {fixture['away_team']} using Perplexity API")
            
            # Set up Perplexity client using OpenAI client with custom base URL
            from openai import OpenAI
            
            # Create messages for the API call with structured output instructions
            messages = [
                {
                    "role": "system",
                    "content": """You are a professional football betting analyst specializing in Premier League matches. 
                    Provide detailed, data-driven betting analysis in a structured JSON format that follows this exact schema:
                    
                    {
                      "match_overview": "Detailed overview of the match and storylines",
                      "team_news": {
                        "raw": "Detailed team news including injuries, suspensions, and returnees",
                        "structured": {
                          "home": {
                            "injuries": ["Player 1 (reason)", "Player 2 (reason)"],
                            "suspensions": ["Player 1", "Player 2"],
                            "returnees": ["Player 1", "Player 2"],
                            "projected_xi": "Likely starting lineup"
                          },
                          "away": {
                            "injuries": ["Player 1 (reason)", "Player 2 (reason)"],
                            "suspensions": ["Player 1", "Player 2"],
                            "returnees": ["Player 1", "Player 2"],
                            "projected_xi": "Likely starting lineup"
                          }
                        }
                      },
                      "asian_handicap_analysis": {
                        "table": {
                          "headers": ["Team", "Form", "Home/Away Form", "H2H", "Value"],
                          "rows": [
                            ["Home Team", "Form rating", "Home form rating", "H2H advantage", "Value rating"],
                            ["Away Team", "Form rating", "Away form rating", "H2H advantage", "Value rating"]
                          ]
                        },
                        "analysis": "Detailed analysis of the Asian handicap market",
                        "recommendation": "Clear recommendation for the Asian handicap market",
                        "raw": "Additional detailed insights about the Asian handicap market"
                      },
                      "key_player_matchups": [
                        {
                          "title": "Matchup 1 title",
                          "content": "Analysis of the matchup",
                          "raw": "Additional detailed insights about this matchup"
                        },
                        {
                          "title": "Matchup 2 title",
                          "content": "Analysis of the matchup",
                          "raw": "Additional detailed insights about this matchup"
                        }
                      ],
                      "betting_insights": [
                        {
                          "market": "Market name (e.g., 'Match Result', 'Over/Under')",
                          "insight": "Brief insight about this market",
                          "recommendation": "Clear recommendation for this market",
                          "raw": "Additional detailed insights about this market"
                        }
                      ],
                      "prediction": {
                        "score": {
                          "home": 1,
                          "away": 2
                        },
                        "confidence": 7,
                        "reasoning": "Explanation for the prediction"
                      }
                    }
                    
                    Your response must be valid JSON that exactly follows this schema. Include as much detailed analysis as possible in the 'raw' fields.
                    """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
            
            try:
                # Make the API call to Perplexity
                try:
                    client = OpenAI(api_key=perplexity_api_key, base_url="https://api.perplexity.ai")
                    response = client.chat.completions.create(
                        model="sonar-deep-research",  # Perplexity model
                        messages=messages,
                        temperature=0.7,
                        max_tokens=4000
                    )
                except TypeError as e:
                    print(f"Error with OpenAI client initialization: {e}")
                    # Try alternative initialization with httpx client
                    import httpx
                    client = OpenAI(
                        api_key=perplexity_api_key,
                        base_url="https://api.perplexity.ai",
                        http_client=httpx.Client()
                    )
                    response = client.chat.completions.create(
                        model="sonar-deep-research",  # Perplexity model
                        messages=messages,
                        temperature=0.7,
                        max_tokens=4000
                    )
                
                # Extract the response content
                raw_content = response.choices[0].message.content
                
                # Print a sample of the raw content for debugging
                print(f"\nSample of raw Perplexity response (first 300 chars):\n{raw_content[:300]}...\n")
                
                # Parse the JSON response
                try:
                    # Clean the response to handle potential markdown code blocks
                    cleaned_content = raw_content
                    if "```json" in raw_content:
                        cleaned_content = raw_content.split("```json")[1].split("```")[0].strip()
                    elif "```" in raw_content:
                        cleaned_content = raw_content.split("```")[1].split("```")[0].strip()
                    
                    # Parse the JSON
                    analysis_content = json.loads(cleaned_content)
                    
                    # Add the raw Perplexity response for reference
                    analysis_content["raw_perplexity_content"] = raw_content
                    
                    # Create the full analysis object
                    analysis = {
                        "fixture_id": fixture.get("id", ""),
                        "home_team": home_team,
                        "away_team": away_team,
                        "date": fixture.get("date", ""),
                        "generated_at": datetime.now().isoformat(),
                        "content": analysis_content
                    }
                    
                    return analysis
                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON from Perplexity response: {e}")
                    print("Falling back to raw content structure")
                    
                    # Create a basic structure with just the raw content
                    analysis = {
                        "fixture_id": fixture.get("id", ""),
                        "home_team": home_team,
                        "away_team": away_team,
                        "date": fixture.get("date", ""),
                        "generated_at": datetime.now().isoformat(),
                        "content": {
                            "match_overview": f"Analysis for {home_team} vs {away_team}",
                            "raw_perplexity_content": raw_content,
                            "team_news": {
                                "raw": "",
                                "structured": {
                                    "home": {"injuries": [], "suspensions": [], "returnees": []},
                                    "away": {"injuries": [], "suspensions": [], "returnees": []}
                                }
                            },
                            "betting_insights": {"raw": "", "insights": []},
                            "prediction": {"score": {"home": 0, "away": 0}, "confidence": 0, "reasoning": ""}
                        }
                    }
                    
                    return analysis
            except Exception as e:
                print(f"Error generating analysis: {e}")
                mock_analysis = generate_mock_analysis(fixture)
                mock_analysis["generated_at"] = datetime.now().isoformat()
                return mock_analysis
    
    except Exception as e:
        print(f"Error in generate_fixture_analysis: {e}")
        traceback.print_exc()
        mock_analysis = generate_mock_analysis(fixture)
        mock_analysis["generated_at"] = datetime.now().isoformat()
        return mock_analysis

def create_perplexity_prompt(home_team, away_team, date, venue, home_form, away_form, 
                            asian_handicap_line, asian_handicap_home, asian_handicap_away):
    """
    Create a detailed prompt for the Perplexity API
    
    Args:
        Various fixture details
        
    Returns:
        Formatted prompt string
    """
    return f"""Provide a detailed betting analysis for the Premier League match between {home_team} and {away_team}.

Match Details:
- Date: {date}
- Venue: {venue}
- Home team form: {home_form}
- Away team form: {away_form}
- Asian handicap line: {asian_handicap_line}
- Asian handicap odds: Home {asian_handicap_home}, Away {asian_handicap_away}

Please include:
1. A brief match overview
2. Team news (injuries, suspensions, returnees, and projected lineups)
3. Asian handicap analysis with a clear recommendation
4. Key player matchups that could influence the outcome
5. Betting insights for various markets (match result, over/under, etc.)
6. A final score prediction with confidence level

Your analysis should be data-driven, focusing on statistics, form, head-to-head records, and value in the betting markets.
Remember to provide your response in the exact JSON format specified in the system instructions.
"""

def betting_journalist_agent(content: Dict[str, str], home_team: str, away_team: str) -> Dict[str, Any]:
    """
    Uses OpenAI GPT-4o to clean and structure the raw Perplexity analysis into a well-formatted model
    that's easier for the frontend to render, while preserving as much original information as possible.
    
    Args:
        content: Dictionary containing raw content from Perplexity
        home_team: Home team name
        away_team: Away team name
        
    Returns:
        Cleaned and structured content dictionary with preserved raw content
    """
    try:
        # Check if OpenAI API key is set
        openai_api_key = os.environ.get("OPENAI_API_KEY")
        if not openai_api_key:
            print("Warning: OPENAI_API_KEY not set. Falling back to enhance_analysis_content.")
            return enhance_analysis_content(content, home_team, away_team)
        
        # Set up OpenAI client
        try:
            client = openai.OpenAI(api_key=openai_api_key)
        except TypeError as e:
            print(f"Error with OpenAI client: {e}")
            # Try alternative initialization without proxies
            import httpx
            client = openai.OpenAI(
                api_key=openai_api_key,
                http_client=httpx.Client()
            )
        
        # Get the raw content from Perplexity
        raw_content = content.get("raw_content", "")
        
        if not raw_content:
            print("Warning: No raw content provided to betting_journalist_agent.")
            # Create empty structure that matches the expected format
            return {
                "match_overview": "",
                "raw_perplexity_content": "",
                "team_news": {
                    "raw": "",
                    "structured": {
                        "home": {
                            "injuries": [],
                            "suspensions": [],
                            "returnees": [],
                            "projected_xi": ""
                        },
                        "away": {
                            "injuries": [],
                            "suspensions": [],
                            "returnees": [],
                            "projected_xi": ""
                        }
                    }
                },
                "key_player_matchups": [],
                "asian_handicap_analysis": {
                    "table": {
                        "headers": [],
                        "rows": []
                    },
                    "analysis": "",
                    "recommendation": ""
                },
                "betting_insights": [],
                "prediction": {
                    "score": {
                        "home": None,
                        "away": None,
                        "found": False
                    },
                    "confidence": "",
                    "rationale": ""
                }
            }
        
        # Define the system prompt for the betting journalist agent
        system_prompt = """
        You are a professional betting journalist who specializes in football (soccer) match analysis.
        Your task is to clean and structure the raw analysis data from Perplexity into a well-formatted, consistent model.
        
        The match is between {0} (home) and {1} (away).
        
        The raw analysis should contain information about:
        1. match_overview - General overview of the match and teams' form
        2. team_news - Information about injuries, suspensions, and projected lineups
        3. key_player_matchups - Analysis of important player matchups
        4. asian_handicap_analysis - Analysis of Asian Handicap betting markets
        5. betting_insights - Various betting insights and recommendations
        6. prediction - Score prediction and rationale
        
        Your job is to:
        1. Remove any AI thinking artifacts (like <think> blocks)
        2. Remove citation references (like [1][5][7])
        3. Structure the data into a consistent format
        4. PRESERVE ALL valuable betting information and insights - this is CRITICAL
        5. Format tables properly
        6. Extract structured data where possible
        7. Include the full cleaned raw content for each section in a 'raw' field
        
        Return the cleaned and structured data in the following JSON format:
        
        {{
            "raw_perplexity_content": "The entire cleaned raw content from Perplexity, with artifacts removed",
            "match_overview": "Cleaned and formatted match overview text",
            "team_news": {{
                "raw": "Original team news text, cleaned of artifacts, preserving ALL details",
                "structured": {{
                    "home": {{
                        "injuries": ["Player1 (reason)", "Player2 (reason)"],
                        "suspensions": ["Player3 (reason)"],
                        "returnees": ["Player4", "Player5"],
                        "projected_xi": "Full projected XI string"
                    }},
                    "away": {{
                        "injuries": ["Player1 (reason)", "Player2 (reason)"],
                        "suspensions": ["Player3 (reason)"],
                        "returnees": ["Player4", "Player5"],
                        "projected_xi": "Full projected XI string"
                    }}
                }}
            }},
            "key_player_matchups": [
                {{
                    "title": "Player1 vs Player2",
                    "content": "Analysis of this matchup",
                    "raw": "Full original analysis of this matchup with all details"
                }},
                {{
                    "title": "Player3 vs Player4",
                    "content": "Analysis of this matchup",
                    "raw": "Full original analysis of this matchup with all details"
                }}
            ],
            "asian_handicap_analysis": {{
                "raw": "Full original Asian handicap analysis text with all details",
                "table": {{
                    "headers": ["Line", "Home", "Away"],
                    "rows": [
                        ["1.5", "1.85", "1.95"],
                        ["2.0", "1.65", "2.25"]
                    ]
                }},
                "analysis": "Detailed analysis text",
                "recommendation": "Betting recommendation"
            }},
            "betting_insights": [
                {{
                    "market": "Over/Under",
                    "insight": "Analysis of this market",
                    "recommendation": "Betting recommendation",
                    "raw": "Full original insight for this market with all details"
                }},
                {{
                    "market": "Both Teams to Score",
                    "insight": "Analysis of this market",
                    "recommendation": "Betting recommendation",
                    "raw": "Full original insight for this market with all details"
                }}
            ],
            "prediction": {{
                "raw": "Full original prediction text with all details",
                "score": {{
                    "home": 2,
                    "away": 1,
                    "found": true
                }},
                "confidence": "Medium",
                "rationale": "Reasoning behind prediction"
            }}
        }}
        
        IMPORTANT: For each section, make sure to include both the structured data AND the full raw content in the 'raw' field.
        This ensures no information is lost while still providing a structured format.
        
        If you can't find information for a particular section, use empty strings, empty arrays, or null values as appropriate.
        Make sure the JSON is valid and properly formatted.
        """.format(home_team, away_team)
        
        # Prepare the user message with the raw content
        user_message = f"""
        Here is the raw analysis from Perplexity for the match between {home_team} and {away_team}:
        
        {raw_content}
        
        Please clean and structure this data according to the format specified.
        Remember to preserve ALL valuable information from the original content in the 'raw' fields.
        """
        
        # Call OpenAI API
        print("Sending raw Perplexity content to GPT-4o for structuring...")
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        # Extract the structured content from the response
        structured_content_text = response.choices[0].message.content
        
        # Parse the JSON response
        try:
            structured_content = json.loads(structured_content_text)
            print("Successfully cleaned and structured the analysis using GPT-4o")
            return structured_content
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from GPT-4o: {e}")
            print(f"Raw response: {structured_content_text[:500]}...")
            # Fall back to the enhance_analysis_content function
            return enhance_analysis_content({"match_overview": raw_content}, home_team, away_team)
        
    except Exception as e:
        print(f"Error in betting_journalist_agent: {str(e)}")
        print(traceback.format_exc())
        # Fall back to the enhance_analysis_content function
        return enhance_analysis_content(content, home_team, away_team)

def enhance_analysis_content(content: Dict[str, str], home_team: str, away_team: str) -> Dict[str, Any]:
    """
    Enhance and structure the analysis content for better frontend display
    
    Args:
        content: Dictionary containing analysis content sections
        home_team: Home team name
        away_team: Away team name
        
    Returns:
        Enhanced and structured content dictionary
    """
    enhanced_content = {}
    
    # Clean up AI thinking artifacts and citation references from all content sections
    for key, value in content.items():
        # Skip if value is not a string
        if not isinstance(value, str):
            enhanced_content[key] = value
            continue
            
        # Remove AI thinking sections
        value = re.sub(r'<think>.*?</think>', '', value, flags=re.DOTALL)
        
        # Remove citation references like [1][5][7]
        value = re.sub(r'\[\d+\]', '', value)
        
        enhanced_content[key] = value
    
    # Extract score prediction from prediction text
    prediction_text = enhanced_content.get('prediction', '')
    if not isinstance(prediction_text, str):
        prediction_text = str(prediction_text) if prediction_text else ''
        
    score_regex = r'(?:Score Projection:|Prediction:).*?(\d+)[^\d]+(\d+)'
    score_match = re.search(score_regex, prediction_text, re.IGNORECASE | re.DOTALL)
    
    score_prediction = {
        'raw': prediction_text,
        'score': {
            'home': int(score_match.group(1)) if score_match else 0,
            'away': int(score_match.group(2)) if score_match else 0,
            'found': bool(score_match)
        }
    }
    enhanced_content['prediction'] = score_prediction
    
    # Parse team news into home and away sections
    team_news_text = enhanced_content.get('team_news', '')
    if not isinstance(team_news_text, str):
        team_news_text = str(team_news_text) if team_news_text else ''
    
    # Split team news by team
    home_team_pattern = rf'\*\*{re.escape(home_team)}(?:\*\*)?:'
    away_team_pattern = rf'\*\*{re.escape(away_team)}(?:\*\*)?:'
    
    # If team names aren't found directly, try to find sections with Injuries/Suspensions headers
    if not re.search(home_team_pattern, team_news_text, re.IGNORECASE) and not re.search(away_team_pattern, team_news_text, re.IGNORECASE):
        # Split the text in half - first half for home team, second half for away team
        sections = team_news_text.split('\n\n', 1)
        home_news = sections[0] if sections else ''
        away_news = sections[1] if len(sections) > 1 else ''
    else:
        # Try to extract based on team names
        team_sections = re.split(away_team_pattern, team_news_text, flags=re.IGNORECASE, maxsplit=1)
        
        if len(team_sections) > 1:
            home_section = team_sections[0]
            away_section = team_sections[1]
            
            # Further split home section if it contains both teams
            home_parts = re.split(home_team_pattern, home_section, flags=re.IGNORECASE, maxsplit=1)
            home_news = home_parts[1] if len(home_parts) > 1 else home_section
            away_news = away_section
        else:
            # If away team pattern not found, try splitting by home team
            team_sections = re.split(home_team_pattern, team_news_text, flags=re.IGNORECASE, maxsplit=1)
            home_news = team_sections[1] if len(team_sections) > 1 else ''
            
            # Check if there's content after home news that might be away news
            remaining_text = team_sections[1] if len(team_sections) > 1 else team_news_text
            away_news_match = re.search(r'\n\n(.*?)$', remaining_text, re.DOTALL)
            away_news = away_news_match.group(1) if away_news_match else ''
    
    # Extract injuries, suspensions, and returnees for each team
    def extract_team_info(team_text):
        injuries = []
        suspensions = []
        returnees = []
        
        # Extract injuries
        injuries_match = re.search(r'\*\*Injuries:?\*\*\s*(.*?)(?:\n\*\*|\Z)', team_text, re.DOTALL)
        if injuries_match:
            injuries_text = injuries_match.group(1).strip()
            injuries = [injury.strip() for injury in re.split(r',|\n-', injuries_text) if injury.strip()]
        
        # Extract suspensions
        suspensions_match = re.search(r'\*\*Suspensions:?\*\*\s*(.*?)(?:\n\*\*|\Z)', team_text, re.DOTALL)
        if suspensions_match:
            suspensions_text = suspensions_match.group(1).strip()
            if 'None' not in suspensions_text:
                suspensions = [suspension.strip() for suspension in re.split(r',|\n-', suspensions_text) if suspension.strip()]
        
        # Extract projected XI or other info as returnees
        projected_match = re.search(r'\*\*Projected XI.*?:(.*?)(?:\n\n|\Z)', team_text, re.DOTALL)
        if projected_match:
            projected_text = projected_match.group(1).strip()
            returnees = [projected_text]
        
        return {
            'injuries': injuries,
            'suspensions': suspensions,
            'returnees': returnees
        }
    
    team_news_structured = {
        'raw': team_news_text,
        'structured': {
            'home': extract_team_info(home_news),
            'away': extract_team_info(away_news)
        }
    }
    enhanced_content['team_news'] = team_news_structured
    
    # Structure betting insights into a list
    betting_insights_text = enhanced_content.get('betting_insights', '')
    if not isinstance(betting_insights_text, str):
        betting_insights_text = str(betting_insights_text) if betting_insights_text else ''
    
    # Extract individual insights using bullet points or numbered lists
    insights = []
    
    # Look for bullet points or numbered lists
    bullet_matches = re.findall(r'(?:^|\n)-\s*(.*?)(?:\n|$)', betting_insights_text)
    numbered_matches = re.findall(r'(?:^|\n)\d+\.\s*(.*?)(?:\n|$)', betting_insights_text)
    
    # Combine all matches
    insights = bullet_matches + numbered_matches
    
    # If no bullet points or numbered lists found, try splitting by newlines
    if not insights:
        # Split by double newlines and filter out empty lines
        insights = [line.strip() for line in betting_insights_text.split('\n\n') if line.strip()]
        
        # If still no insights or just one big chunk, try to split by single newlines
        if len(insights) <= 1:
            insights = [line.strip() for line in betting_insights_text.split('\n') if line.strip()]
            
            # Remove any very short lines or headers
            insights = [line for line in insights if len(line) > 15 and not line.startswith('**')]
    
    betting_insights_structured = {
        'raw': betting_insights_text,
        'insights': insights
    }
    enhanced_content['betting_insights'] = betting_insights_structured
    
    return enhanced_content

def generate_mock_analysis(fixture: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate mock analysis when API is not available
    
    Args:
        fixture: Dictionary containing fixture information
        
    Returns:
        Dictionary containing mock analysis
    """
    from datetime import datetime
    
    home_team = fixture["home_team"]
    away_team = fixture["away_team"]
    date = fixture.get("date", "")
    
    # Create mock content with the same structure as expected by the frontend
    mock_content = {
        "match_overview": f"This is a Premier League match between {home_team} and {away_team} scheduled for {date}. Both teams have been in good form recently and this promises to be an exciting encounter.",
        
        "team_news": {
            "raw": f"**{home_team}**:\n- No major injury concerns reported.\n- Full squad available for selection.\n\n**{away_team}**:\n- No major injury concerns reported.\n- Full squad available for selection.",
            "structured": {
                "home": {
                    "injuries": [],
                    "suspensions": [],
                    "returnees": ["Full squad available for selection."],
                    "projected_xi": "Full strength lineup expected"
                },
                "away": {
                    "injuries": [],
                    "suspensions": [],
                    "returnees": ["Full squad available for selection."],
                    "projected_xi": "Full strength lineup expected"
                }
            }
        },
        
        "asian_handicap_analysis": {
            "table": {
                "headers": ["Team", "Form", "Home/Away Form", "H2H", "Value"],
                "rows": [
                    [home_team, "Good", "Strong at home", "Slight advantage", "Fair value"],
                    [away_team, "Good", "Decent away", "Slight disadvantage", "Fair value"]
                ]
            },
            "analysis": f"The Asian handicap line for this match favors {home_team if fixture.get('asian_handicap_home', 0) < fixture.get('asian_handicap_away', 0) else away_team}. Based on recent form and head-to-head records, there might be value in backing the underdog with the handicap advantage.",
            "recommendation": "Back the underdog with the handicap advantage",
            "raw": "Additional detailed insights about the Asian handicap market would appear here"
        },
        
        "key_player_matchups": [
            {
                "title": "Midfield Battle",
                "content": "Watch out for the midfield battle which could determine the outcome of this match.",
                "raw": "Additional detailed insights about this matchup would appear here"
            },
            {
                "title": "Striker vs. Defense",
                "content": "The main striker will test the opposition's defense throughout the match.",
                "raw": "Additional detailed insights about this matchup would appear here"
            }
        ],
        
        "betting_insights": [
            {
                "market": "Over/Under Goals",
                "insight": "The over/under market could offer value given both teams' recent scoring trends.",
                "recommendation": "Consider Over 2.5 goals",
                "raw": "Additional detailed insights about this market would appear here"
            },
            {
                "market": "First Half Result",
                "insight": "Consider backing the home team in the first half market.",
                "recommendation": "Home team to lead at half-time",
                "raw": "Additional detailed insights about this market would appear here"
            }
        ],
        
        "prediction": {
            "score": {
                "home": 1,
                "away": 1
            },
            "confidence": 6,
            "reasoning": "Both teams are evenly matched and a draw seems the most likely outcome."
        },
        
        "raw_perplexity_content": "This is mock data as the Perplexity API was not available."
    }
    
    # Return the full analysis structure
    return {
        "fixture_id": fixture.get("id", ""),
        "home_team": home_team,
        "away_team": away_team,
        "date": date,
        "generated_at": datetime.now().isoformat(),
        "content": mock_content
    }

def generate_batch_analysis(fixtures: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generate analysis for multiple fixtures
    
    Args:
        fixtures: List of fixture dictionaries
        
    Returns:
        List of analysis dictionaries
    """
    results = []
    
    for fixture in fixtures:
        try:
            analysis = generate_fixture_analysis(fixture)
            results.append(analysis)
        except Exception as e:
            print(f"Error generating analysis for fixture {fixture.get('id', 'unknown')}: {str(e)}")
            # Add error result
            results.append({
                "fixture_id": fixture.get("id", "unknown"),
                "error": str(e),
                "generated_at": datetime.now().isoformat()
            })
    
    return results
