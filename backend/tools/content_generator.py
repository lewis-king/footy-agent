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
        home_team = fixture.get("home_team")
        away_team = fixture.get("away_team")
        
        # Create a prompt for Perplexity
        prompt = create_perplexity_prompt(
            competition=fixture.get("competition"),
            home_team=home_team,
            away_team=away_team,
            date=fixture.get("date"),
            venue=fixture.get("venue"),
            home_lineup=fixture.get("lineups", {}).get("home", []),
            away_lineup=fixture.get("lineups", {}).get("away", []),
            asian_handicap_line=fixture.get("odds", {}).get("asian_handicap", {}).get("line"),
            asian_handicap_home=fixture.get("odds", {}).get("asian_handicap", {}).get("home"),
            asian_handicap_away=fixture.get("odds", {}).get("asian_handicap", {}).get("away")
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
                    "content": """You are a professional football betting analyst specializing in Premier League and Champions League matches. 
                    Provide detailed, data-driven betting analysis in a structured JSON format that follows this exact schema:
                    
                    {
                      "match_overview": "Detailed overview of the match and storylines",
                      "citations": [
                        {
                          "id": "1",
                          "url": "https://example.com/source1",
                          "description": "Source description"
                        },
                        {
                          "id": "2",
                          "url": "https://example.com/source2",
                          "description": "Source description"
                        }
                      ],
                      "team_news": {
                        "raw": "Detailed team news including injuries, suspensions, and returnees - this must always be up-to-date sourced info. Use the given lineups in the prompt",
                        "structured": {
                          "home": {
                            "injuries": ["Player 1 (reason) [2]", "Player 2 (reason) [3]"],
                            "suspensions": ["Player 1 [1]", "Player 2 [3]"],
                            "returnees": ["Player 1 [2]", "Player 2 [4]"],
                            "projected_xi": "Likely starting lineup"
                          },
                          "away": {
                            "injuries": ["Player 1 (reason) [2]", "Player 2 (reason) [3]"],
                            "suspensions": ["Player 1 [1]", "Player 2 [3]"],
                            "returnees": ["Player 1 [2]", "Player 2 [4]"],
                            "projected_xi": "Likely starting lineup"
                          }
                        }
                      },
                      "asian_handicap_analysis": {
                        "table": {
                          "headers": ["Team", "Form", "Home/Away Form", "H2H", "Value"],
                          "rows": [
                            ["Home Team", "Form rating [1]", "Home form rating [2]", "H2H advantage [3]", "Value rating [4]"],
                            ["Away Team", "Form rating [1]", "Away form rating [2]", "H2H advantage [3]", "Value rating [4]"]
                          ]
                        },
                        "analysis": "Detailed analysis of the Asian handicap market",
                        "recommendation": "Clear recommendation for the Asian handicap market",
                        "raw": "Additional detailed insights about the Asian handicap market"
                      },
                      "key_player_matchups": [
                        {
                          "title": "Player x vs Player x",
                          "content": "Analysis of the matchup",
                          "raw": "Additional detailed insights about this matchup"
                        },
                        {
                          "title": "Player x vs Player x",
                          "content": "Analysis of the matchup",
                          "raw": "Additional detailed insights about this matchup"
                        }
                      ],
                      "betting_insights": [
                        {
                          "market": "Market name (e.g. 'Match Result', 'Over/Under' etc)",
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
                      },
                      "my_say": {
                        "content": "A journalist style paragraph conclusion featuring engaging insights and unique analysis telling a unique story to generate excitement surrounding the match ahead"
                      }
                    }
                    
                    Your response must be valid JSON that exactly follows this schema. Include as much detailed analysis as possible in the 'raw' fields.
                    
                    IMPORTANT INSTRUCTIONS FOR CITATIONS:
                    1. Use citation references like [1], [2], etc. throughout your analysis to cite your sources
                    2. You can use multiple citations together like [1][3][5] when multiple sources support a claim
                    3. In the <think> section (which won't be shown to users), list all your sources with their URLs
                    4. Format source references in your <think> section like: "Source [1]: https://example.com/source1"
                    5. Make sure to include the citation number and URL for each source
                    6. Try to include at least 5-10 different citation sources for comprehensive analysis
                    
                    Remember to use your <think> section to organize your thoughts and list your sources before providing the final JSON response.
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
                        max_tokens=12000
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
                        max_tokens=12000
                    )
                
                # Extract the response content
                raw_content = response.choices[0].message.content
                
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
                    
                    # Extract citation references if not already present in the response
                    if "citations" not in analysis_content or not analysis_content["citations"]:
                        citations = []
                        citation_map = {}
                        
                        # First, extract all citation numbers from the entire content
                        # This handles both single [1] and nested [3][6][8] citation references
                        all_citation_matches = re.findall(r'\[(\d+)\]', raw_content)
                        unique_citation_ids = set(all_citation_matches)
                        
                        # Extract citations from the <think> section if it exists
                        think_match = re.search(r'<think>(.*?)</think>', raw_content, re.DOTALL)
                        if think_match:
                            think_content = think_match.group(1)
                            
                            # Look for explicit source mentions with URLs
                            source_patterns = [
                                # Pattern: [1] https://example.com
                                r'\[(\d+)\]\s*(https?://[^\s\]]+)',
                                # Pattern: Source [1]: https://example.com
                                r'[Ss]ource\s*\[(\d+)\][:\s]*(https?://[^\s\]]+)',
                                # Pattern: Source 1: https://example.com
                                r'[Ss]ource\s*(\d+)[:\s]*(https?://[^\s\]]+)',
                                # Pattern: [1] Source: example.com
                                r'\[(\d+)\].*?[Ss]ource:?\s*(https?://[^\s\]]+)',
                            ]
                            
                            for pattern in source_patterns:
                                source_matches = re.findall(pattern, think_content)
                                for source_match in source_matches:
                                    citation_id, url = source_match
                                    citation_map[citation_id] = {
                                        "id": citation_id,
                                        "url": url,
                                        "description": f"Source {citation_id}"
                                    }
                            
                            # If we couldn't find explicit mappings, try to match any URLs in order
                            if not citation_map:
                                url_matches = re.findall(r'https?://[^\s\]]+', think_content)
                                for i, citation_id in enumerate(sorted(unique_citation_ids)):
                                    if i < len(url_matches):
                                        citation_map[citation_id] = {
                                            "id": citation_id,
                                            "url": url_matches[i],
                                            "description": f"Source {citation_id}"
                                        }
                        
                        # Create citations list from the map
                        for citation_id in unique_citation_ids:
                            if citation_id in citation_map:
                                citations.append(citation_map[citation_id])
                            else:
                                # Create placeholder for citations without URLs
                                citations.append({
                                    "id": citation_id,
                                    "url": "",
                                    "description": f"Source {citation_id}"
                                })
                        
                        # Sort citations by ID
                        citations.sort(key=lambda x: int(x["id"]))
                        
                        # Add citations to the analysis content
                        analysis_content["citations"] = citations
                    
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
                            "citations": [],
                            "team_news": {
                                "raw": "",
                                "structured": {
                                    "home": {"injuries": [], "suspensions": [], "returnees": []},
                                    "away": {"injuries": [], "suspensions": [], "returnees": []}
                                }
                            },
                            "betting_insights": {"raw": "", "insights": []},
                            "prediction": {"score": {"home": 0, "away": 0}, "confidence": 0, "reasoning": ""},
                            "my_say": {"content": ""}
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

def create_perplexity_prompt(competition, home_team, away_team, date, venue, home_lineup, away_lineup,
                            asian_handicap_line, asian_handicap_home, asian_handicap_away):
    """
    Create a detailed prompt for the Perplexity API
    
    Args:
        Various fixture details
        
    Returns:
        Formatted prompt string
    """
    # Format lineups as comma-delimited strings of "position: name" (taking only first 11 players as starters)
    formatted_home_lineup = ", ".join([f"{player['position']}: {player['name']}" for player in (home_lineup or [])[:11]])
    formatted_away_lineup = ", ".join([f"{player['position']}: {player['name']}" for player in (away_lineup or [])[:11]])
    
    return f"""Provide a detailed betting analysis for the {competition} match between {home_team} and {away_team}.

You are an english professional football betting analyst specializing in {competition} matches. Your task is to provide comprehensive, data-driven betting analysis for an upcoming fixture.
You are a data led enthusiast using xG and more advanced data insights in your research. But you understand these data points need to be articulated in a accessible way to the masses. Your ability to explain and provide punchy insights is second to none.
You understand how Asian Handicap works when it comes to evens lines and supremacy. I.e you know when odds are near evens you must consider the line to understand the supremacy a team has over the other.
YOU MUST USE UP TO DATE FACTS THAT YOU SOURCE - YOU CANNOT RELY ON YOUR BASE KNOWLEDGE WHEN STATING FACTS - I.E IF YOU DIDN'T SOURCE THE INFORMATION DON'T USE IT

FIXTURE INFORMATION:
- Home Team: {home_team}
- Away Team: {away_team}
- Date: {date}
- Venue: {venue}
- Asian Handicap Line: {asian_handicap_line}
- Asian Handicap Home Odds: {asian_handicap_home}
- Asian Handicap Away Odds: {asian_handicap_away}
- Predicted Home Team Lineup: {formatted_home_lineup}
- Predicted Away Team Lineup: {formatted_away_lineup}

TASK:
Provide detailed betting analysis for this fixture, focusing on value opportunities in the betting markets.
A a quick primer on odds value - value/edge/opportunity is when the implied probability of the odds from the bookmaker are lower than the statistical model's source implied probability. This means the bookmakers odds are higher than we think they should be.
An example is home team is 1.5 to win giving 66.7% implied probability. Our sourced model/statical analysis suggests 71.4% probability == 1.4 odds. This is a value opportunity given the odds different of 0.1. The higher the difference the more the value opportunity.
Your analysis should be structured according to the following format:

match_overview: A comprehensive overview of the match, including team form, recent performances, and general context.
asian_handicap_analysis: Detailed analysis of the Asian handicap market for this fixture, including value bets and recommendations.
key_player_matchups: Analysis of key player matchups that could influence the outcome of the game.
team_news: Latest team news including injuries, suspensions, and expected lineups sourced from real live sources NOT based on your knowledge - use the prompt predicted lineups given here.
betting_insights: 3-5 key betting insights for this match, focusing on value opportunities. Remember decimal odds format and Win/Match Odds terminology over ML or Money Line
prediction: A prediction for the match outcome with reasoning.
my_say: contains content which is A journalist style paragraph conclusion featuring engaging insights and top level analysis. Tell a story, be quirky, be insightful and unique, this is your chance to shine to set the scene and excitement for the match ahead. Roughly 1000 characters is good for this content to be engaging enough.

IMPORTANT GUIDELINES:
1. You must always use live sourced information to base your facts and analysis off of as football changes weekly. Team Lineups, Form, News, Stats are all changing weekly.
2. Focus on data-driven insights rather than general observations
3. Provide specific, actionable betting recommendations
4. Consider team form, head-to-head records, injuries, and tactical matchups
5. Pay special attention to the Asian Handicap market and identify value bets
6. Make your content engaging and unique compared to mainstream betting sites
7. You must be accurate when stating odds for markets and selections. I've noticed you have a tendency to get the Asian Handicap evens line wrong and think the line is 0 in some games. This breaks the betting recommendation so be CAREFUL!
8. Prefer European terminology over american i.e decimal odds over money line. Odds should always be in decimal format)
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
                "citations": [],
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
                },
                "my_say": {
                    "content": ""
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
        7. my_say - A journalist style paragraph conclusion with engaging insights
        
        Your job is to:
        1. Remove any AI thinking artifacts (like <think> blocks)
        2. PRESERVE citation references (like [1][5][7]) - DO NOT remove these
        3. Structure the data into a consistent format
        4. PRESERVE ALL valuable betting information and insights - this is CRITICAL
        5. Format tables properly
        6. Extract structured data where possible
        7. Include the full cleaned raw content for each section in a 'raw' field
        8. Extract citation sources if mentioned in the content
        
        Return the cleaned and structured data in the following JSON format:
        
        {{
            "raw_perplexity_content": "The entire cleaned raw content from Perplexity, with artifacts removed",
            "match_overview": "Cleaned and formatted match overview text WITH citation references preserved",
            "citations": [
                {{
                    "id": "1",
                    "url": "https://example.com/source1",
                    "description": "Source description if available"
                }},
                {{
                    "id": "2",
                    "url": "https://example.com/source2",
                    "description": "Source description if available"
                }}
            ],
            "team_news": {{
                "raw": "Original team news text, cleaned of artifacts, preserving ALL details and citation references",
                "structured": {{
                    "home": {{
                        "injuries": ["Player1 (reason)", "Player2 (reason)"],
                        "suspensions": ["Player3 (reason)"],
                        "returnees": ["Player4", "Player5"],
                        "projected_xi": "Likely starting lineup"
                    }},
                    "away": {{
                        "injuries": ["Player1 (reason)", "Player2 (reason)"],
                        "suspensions": ["Player3 (reason)"],
                        "returnees": ["Player4", "Player5"],
                        "projected_xi": "Likely starting lineup"
                    }}
                }}
            }},
            "key_player_matchups": [
                {{
                    "title": "Player1 vs Player2",
                    "content": "Analysis of this matchup WITH citation references preserved",
                    "raw": "Full original analysis of this matchup with all details"
                }},
                {{
                    "title": "Player3 vs Player4",
                    "content": "Analysis of this matchup WITH citation references preserved",
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
                "analysis": "Detailed analysis text WITH citation references preserved",
                "recommendation": "Betting recommendation"
            }},
            "betting_insights": [
                {{
                    "market": "Over/Under",
                    "insight": "Brief insight about this market WITH citation references preserved",
                    "recommendation": "Betting recommendation",
                    "raw": "Full original insight for this market with all details"
                }},
                {{
                    "market": "Both Teams to Score",
                    "insight": "Brief insight about this market WITH citation references preserved",
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
                "rationale": "Explanation for the prediction with citation references like [1][9] included"
            }},
            "my_say": {{
                "content": "A journalist style paragraph conclusion featuring engaging insights and unique analysis telling a story about the match"
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
    
    # Extract citations from the raw Perplexity content
    raw_perplexity_content = content.get('raw_perplexity_content', '')
    citations = []
    
    # Extract citations from the <think> section if it exists
    think_match = re.search(r'<think>(.*?)</think>', raw_perplexity_content, re.DOTALL)
    if think_match:
        think_content = think_match.group(1)
        # Look for patterns like "sources [1], [2], and [3]" or "mentioned in [4] and [5]"
        citation_matches = re.findall(r'\[(\d+)\]', think_content)
        source_matches = re.findall(r'source(?:s)? (?:\[(\d+)\]|(?:like|such as) (.*?))', think_content, re.IGNORECASE)
        
        # Extract source URLs if mentioned
        url_matches = re.findall(r'https?://[^\s\]]+', think_content)
        
        # Map citation numbers to sources if possible
        for i, url in enumerate(url_matches):
            if i < len(citation_matches):
                citations.append({
                    "id": citation_matches[i],
                    "url": url,
                    "description": f"Source {citation_matches[i]}"
                })
    
    # Clean up AI thinking artifacts from all content sections but preserve citation references
    for key, value in content.items():
        # Skip if value is not a string
        if not isinstance(value, str):
            enhanced_content[key] = value
            continue
            
        # Remove AI thinking sections
        value = re.sub(r'<think>.*?</think>', '', value, flags=re.DOTALL)
        
        # Don't remove citation references like [1][5][7] anymore
        # value = re.sub(r'\[\d+\]', '', value)
        
        enhanced_content[key] = value
    
    # Add citations to enhanced content
    enhanced_content['citations'] = citations
    
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
    
    # Extract my_say content if available
    my_say_text = enhanced_content.get('my_say', '')
    if isinstance(my_say_text, str) and my_say_text:
        my_say_structured = {
            'content': my_say_text
        }
        enhanced_content['my_say'] = my_say_structured
    elif not enhanced_content.get('my_say'):
        # Create a default my_say if not present
        enhanced_content['my_say'] = {
            'content': f"This match between {home_team} and {away_team} promises to be an intriguing contest based on recent form and head-to-head history. The betting markets suggest {home_team if 'home' in prediction_text.lower() else away_team} have the edge, but football often surprises us with unexpected twists and turns."
        }
    
    return enhanced_content

def generate_mock_analysis(fixture: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate mock analysis data for testing when the API is not available
    
    Args:
        fixture: Dictionary containing fixture details
        
    Returns:
        Dictionary containing mock analysis data
    """
    home_team = fixture.get("home_team", "Home Team")
    away_team = fixture.get("away_team", "Away Team")
    
    # Create mock citations
    mock_citations = [
        {
            "id": "1",
            "url": "https://www.bbc.com/sport/football",
            "description": "BBC Sport Football"
        },
        {
            "id": "2",
            "url": "https://www.skysports.com/football",
            "description": "Sky Sports Football"
        },
        {
            "id": "3",
            "url": "https://www.premierleague.com/",
            "description": "Premier League Official Website"
        },
        {
            "id": "4",
            "url": "https://www.whoscored.com/",
            "description": "WhoScored Football Statistics"
        },
        {
            "id": "5",
            "url": "https://www.transfermarkt.com/",
            "description": "Transfermarkt Player Values and Statistics"
        }
    ]
    
    # Create mock analysis content with citation references
    mock_content = {
        "match_overview": f"This Premier League fixture between {home_team} and {away_team} promises to be an exciting encounter. {home_team} have been in good form recently [1][3], while {away_team} have struggled away from home [2].",
        "citations": mock_citations,
        "raw_perplexity_content": f"""
<think>
Let me analyze this match between {home_team} and {away_team}.

Sources:
Source [1]: https://www.bbc.com/sport/football - Recent form and team news
Source [2]: https://www.skysports.com/football - Match previews and betting odds
Source [3]: https://www.premierleague.com/ - Official Premier League statistics
Source [4]: https://www.whoscored.com/ - Detailed player statistics and ratings
Source [5]: https://www.transfermarkt.com/ - Player values and injury information
</think>

# {home_team} vs {away_team} Analysis

## Match Overview
This {competition} fixture between {home_team} and {away_team} promises to be an exciting encounter. {home_team} have been in good form recently [1][3], while {away_team} have struggled away from home [2].

## Team News
{home_team} will be without their star striker due to injury [1], but their midfield looks strong with all key players available [3]. {away_team} have several injury concerns in defense [2][5], which could impact their ability to keep a clean sheet.

## Betting Analysis
The Asian handicap line of -0.5 for {home_team} seems fair given their home advantage [2][4]. Both teams to score looks like a good bet given the defensive issues for {away_team} [3][5].
""",
        "team_news": {
            "raw": f"{home_team} will be without their star striker due to injury [1], but their midfield looks strong with all key players available [3]. {away_team} have several injury concerns in defense [2][5], which could impact their ability to keep a clean sheet.",
            "structured": {
                "home": {
                    "injuries": [f"Star Striker (hamstring) [1][5]", f"Reserve Defender (knee) [5]"],
                    "suspensions": [],
                    "returnees": [f"Key Midfielder [3]"],
                    "projected_xi": f"Likely starting XI for {home_team} with available players [1][3]"
                },
                "away": {
                    "injuries": [f"Center Back (ankle) [2][5]", f"Right Back (illness) [5]"],
                    "suspensions": [f"Defensive Midfielder (accumulated yellows) [3]"],
                    "returnees": [],
                    "projected_xi": f"Likely starting XI for {away_team} with available players [2][3]"
                }
            }
        },
        "asian_handicap_analysis": {
            "table": {
                "headers": ["Team", "Form", "Home/Away Form", "H2H", "Value"],
                "rows": [
                    [f"{home_team}", "Good [1]", "Strong [3]", "Advantage [4]", "Fair [2]"],
                    [f"{away_team}", "Mixed [1]", "Poor [3]", "Disadvantage [4]", "Undervalued [2]"]
                ]
            },
            "analysis": f"The Asian handicap line of -0.5 for {home_team} seems fair given their home advantage [2][4]. {home_team}'s strong home form [3] suggests they should be able to cover this handicap.",
            "recommendation": f"Back {home_team} -0.5 Asian Handicap @ 1.95 [2][4]",
            "raw": f"Detailed analysis of the Asian handicap market for {home_team} vs {away_team}. Historical data shows {home_team} perform well at home [3][4], while {away_team} struggle on the road [2][3]."
        },
        "key_player_matchups": [
            {
                "title": f"{home_team} Midfield vs {away_team} Midfield",
                "content": f"The midfield battle will be crucial in this match. {home_team}'s midfielders have been dominating possession in recent games [1][4], while {away_team}'s midfield has struggled to control games away from home [3].",
                "raw": f"Detailed analysis of the midfield matchup between {home_team} and {away_team}. Statistics show {home_team}'s midfielders have better passing accuracy and create more chances [4]."
            },
            {
                "title": f"{away_team} Attack vs {home_team} Defense",
                "content": f"{away_team}'s forwards have been in good scoring form recently [2][4], but they'll face a tough test against {home_team}'s solid defense [1][3].",
                "raw": f"Detailed analysis of {away_team}'s attack against {home_team}'s defense. The away team has scored in their last 5 matches [2], but {home_team} have kept clean sheets in 3 of their last 5 home games [3]."
            }
        ],
        "betting_insights": [
            {
                "market": "Match Result",
                "insight": f"{home_team} are favorites at home [1][2], but {away_team} have shown they can surprise stronger teams [3][4].",
                "recommendation": f"Back {home_team} to win @ 1.85 [2]",
                "raw": f"Detailed analysis of the match result market. {home_team}'s home form and {away_team}'s away form suggest a home win is the most likely outcome [1][3]."
            },
            {
                "market": "Both Teams to Score",
                "insight": f"Both teams have been scoring and conceding regularly [2][3][4].",
                "recommendation": "Back Both Teams to Score @ 1.75 [2]",
                "raw": f"Detailed analysis of the BTTS market. {home_team} have scored in 90% of their home games [3], while {away_team} have scored in 80% of their away games [3]."
            },
            {
                "market": "Over/Under 2.5 Goals",
                "insight": f"Recent matches involving both teams have been high-scoring [3][4][5].",
                "recommendation": "Back Over 2.5 Goals @ 1.90 [2]",
                "raw": f"Detailed analysis of the goals market. The last 5 matches involving {home_team} have averaged 3.2 goals [3], while {away_team}'s away games average 2.8 goals [3]."
            }
        ],
        "prediction": {
            "score": {
                "home": 2,
                "away": 1
            },
            "confidence": 7,
            "reasoning": f"Based on current form and team news, {home_team} should have enough quality to secure a 2-1 win at home [1][2][3]. Their strong home record [3] and {away_team}'s defensive issues [2][5] suggest they'll score at least twice."
        },
        "my_say": {
            "content": f"This match has all the ingredients for an exciting encounter. {home_team} are in good form and have a strong home record, while {away_team} have shown they can cause upsets on the road. The Asian handicap line of -0.5 for {home_team} seems fair, but {away_team} could still cause problems if they can exploit {home_team}'s defensive weaknesses."
        }
    }
    
    # Create the full analysis object
    analysis = {
        "fixture_id": fixture.get("id", ""),
        "home_team": home_team,
        "away_team": away_team,
        "date": fixture.get("date", ""),
        "generated_at": datetime.now().isoformat(),
        "content": mock_content
    }
    
    return analysis

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
