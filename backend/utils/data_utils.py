import json
import os
import pathlib
from datetime import datetime, timedelta
import glob

# Define paths
BASE_DIR = pathlib.Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
FIXTURES_FILE = DATA_DIR / "fixtures.json"
FIXTURES_PREMIER_LEAGUE_FILE = DATA_DIR / "fixtures-premier-league.json"
FIXTURES_CHAMPIONS_LEAGUE_FILE = DATA_DIR / "fixtures-champions-league.json"
ANALYSIS_DIR = DATA_DIR / "analysis"

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
ANALYSIS_DIR.mkdir(exist_ok=True)

def load_fixtures(competition=None):
    """
    Load fixtures from JSON file
    
    Args:
        competition: Optional competition name ('premier-league' or 'champions-league')
                    If None, returns fixtures from the legacy file
    """
    if competition == 'premier-league':
        fixtures_file = FIXTURES_PREMIER_LEAGUE_FILE
    elif competition == 'champions-league':
        fixtures_file = FIXTURES_CHAMPIONS_LEAGUE_FILE
    else:
        fixtures_file = FIXTURES_FILE
    
    if not fixtures_file.exists():
        # Return empty list if file doesn't exist
        return []
    
    try:
        with open(fixtures_file, 'r') as f:
            print(f"Loading fixtures from {fixtures_file}")
            return json.load(f)
    except Exception as e:
        print(f"Error loading fixtures for {competition}: {str(e)}")
        return []

def save_fixtures(fixtures, competition=None):
    """
    Save fixtures to JSON file with upsert behavior
    - Updates existing fixtures if they have the same ID
    - Adds new fixtures that don't exist yet
    
    Args:
        fixtures: List of fixture data to save
        competition: Optional competition name ('premier-league' or 'champions-league')
                     If None, saves to the legacy file
    """
    if competition == 'premier-league':
        fixtures_file = FIXTURES_PREMIER_LEAGUE_FILE
    elif competition == 'champions-league':
        fixtures_file = FIXTURES_CHAMPIONS_LEAGUE_FILE
    else:
        fixtures_file = FIXTURES_FILE
        
    try:
        # Load existing fixtures
        existing_fixtures = []
        if os.path.exists(fixtures_file):
            try:
                with open(fixtures_file, 'r') as f:
                    existing_fixtures = json.load(f)
            except:
                # If file exists but can't be loaded, start with empty list
                existing_fixtures = []
        
        # Create a dictionary of existing fixtures by ID for easy lookup
        existing_fixtures_dict = {f['id']: f for f in existing_fixtures if 'id' in f}
        
        # Create a dictionary for the new fixtures
        new_fixtures_dict = {f['id']: f for f in fixtures if 'id' in f}
        
        # Merge the dictionaries, with new fixtures taking precedence
        merged_fixtures_dict = {**existing_fixtures_dict, **new_fixtures_dict}
        
        # Convert back to a list
        merged_fixtures = list(merged_fixtures_dict.values())
        
        # Sort by date (ascending)
        merged_fixtures.sort(key=lambda x: x.get('date', '9999-99-99'))
        
        # Save the merged fixtures
        with open(fixtures_file, 'w') as f:
            json.dump(merged_fixtures, f, indent=2)
            
        print(f"Saved {len(merged_fixtures)} fixtures to {fixtures_file}")
        print(f"- {len(new_fixtures_dict)} new/updated fixtures")
        print(f"- {len(existing_fixtures_dict) - len(new_fixtures_dict.keys() & existing_fixtures_dict.keys())} unchanged fixtures")
        
        return True
    except Exception as e:
        print(f"Error saving fixtures for {competition}: {str(e)}")
        return False

def load_analysis(fixture_id):
    """
    Load analysis for a specific fixture
    
    Args:
        fixture_id: ID of the fixture
        
    Returns:
        Analysis data as dictionary or None if not found
    """
    analysis_file = ANALYSIS_DIR / f"{fixture_id}.json"
    
    if not analysis_file.exists():
        return None
    
    try:
        with open(analysis_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading analysis for fixture {fixture_id}: {str(e)}")
        return None

def save_analysis(fixture_id, analysis):
    """
    Save analysis for a specific fixture
    
    Args:
        fixture_id: ID of the fixture
        analysis: Analysis data to save
        
    Returns:
        True if successful, False otherwise
    """
    analysis_file = ANALYSIS_DIR / f"{fixture_id}.json"
    
    # Add timestamp if not already present
    if 'generated_at' not in analysis:
        analysis['generated_at'] = datetime.now().isoformat()
    
    try:
        with open(analysis_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving analysis for fixture {fixture_id}: {str(e)}")
        return False

def get_all_analysis_ids():
    """
    Get IDs of all fixtures with existing analysis
    
    Returns:
        List of fixture IDs with existing analysis
    """
    try:
        analysis_files = glob.glob(str(ANALYSIS_DIR / "*.json"))
        return [os.path.splitext(os.path.basename(f))[0] for f in analysis_files]
    except Exception as e:
        print(f"Error getting analysis IDs: {str(e)}")
        return []

def check_analysis_exists(fixture_id):
    """
    Check if analysis exists for a specific fixture
    
    Args:
        fixture_id: ID of the fixture
        
    Returns:
        True if analysis exists, False otherwise
    """
    analysis_file = ANALYSIS_DIR / f"{fixture_id}.json"
    return analysis_file.exists()

def get_fixtures_with_analysis_status():
    """
    Get all fixtures with their analysis status
    
    Returns:
        List of fixtures with has_analysis flag
    """
    fixtures = load_fixtures()
    analysis_ids = get_all_analysis_ids()
    
    for fixture in fixtures:
        fixture['has_analysis'] = fixture['id'] in analysis_ids
    
    return fixtures

def create_sample_fixtures():
    """Create sample fixtures for development"""
    if FIXTURES_FILE.exists():
        # Don't overwrite existing fixtures
        return
    
    # Sample Premier League fixtures
    fixtures = [
        {
            "id": "pl-2023-01",
            "competition": "Premier League",
            "home_team": "Manchester United",
            "away_team": "Liverpool",
            "date": (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d'),
            "time": "15:00",
            "venue": "Old Trafford",
            "home_form": "WWDLW",
            "away_form": "DWWWL",
            "odds": {
                "home_win": 2.50,
                "draw": 3.40,
                "away_win": 2.70,
                "asian_handicap": {
                    "line": "-0.25",
                    "home": 1.95,
                    "away": 1.95
                }
            }
        },
        {
            "id": "pl-2023-02",
            "competition": "Premier League",
            "home_team": "Arsenal",
            "away_team": "Manchester City",
            "date": (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d'),
            "time": "17:30",
            "venue": "Emirates Stadium",
            "home_form": "WWWDW",
            "away_form": "WWWWW",
            "odds": {
                "home_win": 3.10,
                "draw": 3.40,
                "away_win": 2.20,
                "asian_handicap": {
                    "line": "+0.25",
                    "home": 1.90,
                    "away": 2.00
                }
            }
        },
        {
            "id": "pl-2023-03",
            "competition": "Premier League",
            "home_team": "Chelsea",
            "away_team": "Tottenham Hotspur",
            "date": (datetime.now() + timedelta(days=4)).strftime('%Y-%m-%d'),
            "time": "16:00",
            "venue": "Stamford Bridge",
            "home_form": "DWDWL",
            "away_form": "LWWDW",
            "odds": {
                "home_win": 2.40,
                "draw": 3.30,
                "away_win": 2.90,
                "asian_handicap": {
                    "line": "-0.25",
                    "home": 1.85,
                    "away": 2.05
                }
            }
        },
        {
            "id": "pl-2023-04",
            "competition": "Premier League",
            "home_team": "Newcastle United",
            "away_team": "Aston Villa",
            "date": (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d'),
            "time": "20:00",
            "venue": "St James' Park",
            "home_form": "WWLWD",
            "away_form": "WDWLW",
            "odds": {
                "home_win": 1.90,
                "draw": 3.50,
                "away_win": 4.00,
                "asian_handicap": {
                    "line": "-0.75",
                    "home": 2.05,
                    "away": 1.85
                }
            }
        },
        {
            "id": "pl-2023-05",
            "competition": "Premier League",
            "home_team": "Brighton & Hove Albion",
            "away_team": "West Ham United",
            "date": (datetime.now() + timedelta(days=6)).strftime('%Y-%m-%d'),
            "time": "15:00",
            "venue": "Amex Stadium",
            "home_form": "WDWLW",
            "away_form": "LLWDL",
            "odds": {
                "home_win": 1.80,
                "draw": 3.60,
                "away_win": 4.50,
                "asian_handicap": {
                    "line": "-0.75",
                    "home": 1.95,
                    "away": 1.95
                }
            }
        }
    ]
    
    save_fixtures(fixtures)
    return fixtures
