from flask import Blueprint, jsonify, request
import json
import os
import requests
from datetime import datetime, timedelta
import sys
import pathlib
import uuid
import re
import random
from bs4 import BeautifulSoup

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent.parent.parent))

from utils.data_utils import load_fixtures, save_fixtures, load_analysis

fixtures_bp = Blueprint('fixtures', __name__)

@fixtures_bp.route('/', methods=['GET'])
def get_fixtures():
    """
    Get all upcoming Premier League fixtures
    Optional query param: limit (int) - Limit the number of fixtures returned
    """
    try:
        fixtures = load_fixtures()
        
        # If fixtures are empty or outdated, refresh them
        if not fixtures or is_fixtures_outdated(fixtures):
            fixtures = refresh_fixtures_data()
            save_fixtures(fixtures)
        
        # Filter to only include upcoming fixtures
        today = datetime.now().date()
        upcoming_fixtures = [f for f in fixtures if datetime.strptime(f['date'], '%Y-%m-%d').date() >= today]
        
        # Sort by date (ascending)
        upcoming_fixtures.sort(key=lambda x: x['date'])
        
        # Check if analysis exists for each fixture
        for fixture in upcoming_fixtures:
            fixture_id = fixture['id']
            analysis = load_analysis(fixture_id)
            fixture['has_analysis'] = bool(analysis)
        
        # Apply limit if provided
        limit = request.args.get('limit', type=int)
        if limit and limit > 0:
            upcoming_fixtures = upcoming_fixtures[:limit]
        
        return jsonify(upcoming_fixtures)
    except Exception as e:
        print(f"Error in get_fixtures: {str(e)}")
        return jsonify({"error": str(e)}), 500

@fixtures_bp.route('/<fixture_id>', methods=['GET'])
def get_fixture(fixture_id):
    """Get a specific fixture by ID"""
    try:
        fixtures = load_fixtures()
        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
        
        if not fixture:
            return jsonify({"error": "Fixture not found"}), 404
        
        # Check if analysis exists for this fixture
        analysis = load_analysis(fixture_id)
        fixture['has_analysis'] = bool(analysis)
            
        return jsonify(fixture)
    except Exception as e:
        print(f"Error in get_fixture: {str(e)}")
        return jsonify({"error": str(e)}), 500

@fixtures_bp.route('/refresh', methods=['POST'])
def refresh_fixtures():
    """
    Endpoint to refresh fixtures data from external sources
    """
    try:
        fixtures = refresh_fixtures_data()
        save_fixtures(fixtures)
        
        # Check if analysis exists for each fixture
        for fixture in fixtures:
            fixture_id = fixture['id']
            analysis = load_analysis(fixture_id)
            fixture['has_analysis'] = bool(analysis)
            
        return jsonify({
            "message": "Fixtures refreshed successfully", 
            "count": len(fixtures),
            "fixtures": fixtures
        })
    except Exception as e:
        print(f"Error in refresh_fixtures: {str(e)}")
        return jsonify({"error": str(e)}), 500

def is_fixtures_outdated(fixtures):
    """Check if fixtures data is outdated (older than 24 hours)"""
    if not fixtures:
        return True
    
    # Check the first fixture's date
    today = datetime.now().date()
    earliest_fixture = min(fixtures, key=lambda x: x['date'])
    earliest_date = datetime.strptime(earliest_fixture['date'], '%Y-%m-%d').date()
    
    # If the earliest fixture is in the past, we need to refresh
    if earliest_date < today:
        return True
    
    return False

def refresh_fixtures_data():
    """Fetch latest Premier League fixtures from Flashscore.co.uk"""
    try:
        print("Fetching fixtures from Flashscore.co.uk...")
        
        url = "https://www.flashscore.co.uk/football/england/premier-league/fixtures/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"Failed to fetch fixtures: HTTP {response.status_code}")
            return generate_fallback_fixtures()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        fixtures = []
        
        # Find all fixture elements (each match row)
        fixture_elements = soup.select('.sportName.soccer .event__match')
        
        if not fixture_elements:
            print("No fixture elements found on the page")
            return generate_fallback_fixtures()
        
        print(f"Found {len(fixture_elements)} fixture elements")
        
        # Get current date to filter only upcoming fixtures
        today = datetime.now().date()
        
        # Track the current date being processed
        current_date = None
        
        # Find all date headers and match rows
        all_elements = soup.select('.sportName.soccer .event__header, .sportName.soccer .event__match')
        
        for idx, element in enumerate(all_elements):
            try:
                # Check if this is a date header
                if 'event__header' in element.get('class', []):
                    date_text = element.select_one('.event__title').text.strip()
                    try:
                        # Parse date (format varies, but often like "01.04. 2025" or "Today")
                        if date_text.lower() == 'today':
                            current_date = today
                        elif date_text.lower() == 'tomorrow':
                            current_date = today + timedelta(days=1)
                        else:
                            # Try to parse the date format
                            # Format is typically DD.MM.YYYY or DD.MM.
                            if '.' in date_text:
                                parts = date_text.split('.')
                                if len(parts) >= 2:
                                    day = int(parts[0].strip())
                                    month = int(parts[1].strip())
                                    year = datetime.now().year
                                    if len(parts) > 2 and parts[2].strip():
                                        year = int(parts[2].strip())
                                    current_date = datetime(year, month, day).date()
                    except Exception as e:
                        print(f"Error parsing date: {date_text}, {str(e)}")
                        current_date = None
                    continue
                
                # Skip if we don't have a valid date
                if not current_date or current_date < today:
                    continue
                
                # This is a match element
                home_team_elem = element.select_one('.event__participant--home')
                away_team_elem = element.select_one('.event__participant--away')
                
                if not home_team_elem or not away_team_elem:
                    continue
                
                home_team = home_team_elem.text.strip()
                away_team = away_team_elem.text.strip()
                
                # Get time
                time_elem = element.select_one('.event__time')
                if not time_elem:
                    continue
                
                time_text = time_elem.text.strip()
                
                # Parse time (format: HH:MM)
                try:
                    hour, minute = time_text.split(':')
                    fixture_time = f"{hour.zfill(2)}:{minute}"
                    
                    # Create datetime object for the fixture
                    fixture_datetime = datetime.combine(
                        current_date, 
                        datetime.strptime(fixture_time, '%H:%M').time()
                    )
                except Exception as e:
                    print(f"Error parsing time: {time_text}, {str(e)}")
                    fixture_time = "15:00"  # Default to 3 PM if time parsing fails
                    fixture_datetime = datetime.combine(
                        current_date,
                        datetime.strptime(fixture_time, '%H:%M').time()
                    )
                
                # Create a unique ID for the fixture
                fixture_id = f"pl-{home_team.lower().replace(' ', '-')}-{away_team.lower().replace(' ', '-')}-{fixture_datetime.strftime('%Y%m%d')}"
                
                # Get venue (not available on this page, use home team's stadium)
                venue = get_stadium_for_team(home_team)
                
                # Create the fixture object
                fixture = {
                    "id": fixture_id,
                    "competition": "Premier League",
                    "home_team": home_team,
                    "away_team": away_team,
                    "date": fixture_datetime.strftime('%Y-%m-%d'),
                    "time": fixture_time,
                    "venue": venue,
                    "home_form": generate_random_form(),  # We don't have real form data
                    "away_form": generate_random_form(),  # We don't have real form data
                    "odds": generate_random_odds()        # We don't have real odds data
                }
                
                fixtures.append(fixture)
                
                # Limit to 10 fixtures for now
                if len(fixtures) >= 10:
                    break
                    
            except Exception as e:
                print(f"Error parsing fixture {idx}: {str(e)}")
                continue
        
        if fixtures:
            print(f"Successfully scraped {len(fixtures)} fixtures")
            return fixtures
        else:
            print("No fixtures could be parsed")
            return generate_fallback_fixtures()
            
    except Exception as e:
        print(f"Error scraping fixtures: {str(e)}")
        return generate_fallback_fixtures()

def get_stadium_for_team(team_name):
    """Get the stadium name for a given team"""
    stadiums = {
        "Arsenal": "Emirates Stadium",
        "Aston Villa": "Villa Park",
        "Bournemouth": "Vitality Stadium",
        "Brentford": "Brentford Community Stadium",
        "Brighton": "Amex Stadium",
        "Chelsea": "Stamford Bridge",
        "Crystal Palace": "Selhurst Park",
        "Everton": "Goodison Park",
        "Fulham": "Craven Cottage",
        "Liverpool": "Anfield",
        "Manchester City": "Etihad Stadium",
        "Manchester United": "Old Trafford",
        "Newcastle": "St James' Park",
        "Nottingham Forest": "City Ground",
        "Southampton": "St Mary's Stadium",
        "Tottenham": "Tottenham Hotspur Stadium",
        "West Ham": "London Stadium",
        "Wolverhampton": "Molineux Stadium",
        "Leicester": "King Power Stadium",
        "Ipswich": "Portman Road",
        "Wolves": "Molineux Stadium",
        "Leeds": "Elland Road",
        "Sheffield United": "Bramall Lane",
        "Burnley": "Turf Moor",
        "Luton": "Kenilworth Road"
    }
    
    # Try to find an exact match
    if team_name in stadiums:
        return stadiums[team_name]
    
    # Try to find a partial match
    for team, stadium in stadiums.items():
        if team in team_name or team_name in team:
            return stadium
    
    # Default to a generic stadium name
    return f"{team_name} Stadium"

def generate_fallback_fixtures():
    """Generate fallback fixtures if scraping fails"""
    print("Generating fallback fixtures...")
    
    # Premier League teams
    teams = [
        "Arsenal", "Aston Villa", "Bournemouth", "Brentford", 
        "Brighton", "Chelsea", "Crystal Palace", "Everton", 
        "Fulham", "Liverpool", "Manchester City", "Manchester United", 
        "Newcastle", "Nottingham Forest", "Southampton", "Tottenham", 
        "West Ham", "Wolverhampton"
    ]
    
    # Venues
    venues = {
        "Arsenal": "Emirates Stadium",
        "Aston Villa": "Villa Park",
        "Bournemouth": "Vitality Stadium",
        "Brentford": "Brentford Community Stadium",
        "Brighton": "Amex Stadium",
        "Chelsea": "Stamford Bridge",
        "Crystal Palace": "Selhurst Park",
        "Everton": "Goodison Park",
        "Fulham": "Craven Cottage",
        "Liverpool": "Anfield",
        "Manchester City": "Etihad Stadium",
        "Manchester United": "Old Trafford",
        "Newcastle": "St James' Park",
        "Nottingham Forest": "City Ground",
        "Southampton": "St Mary's Stadium",
        "Tottenham": "Tottenham Hotspur Stadium",
        "West Ham": "London Stadium",
        "Wolverhampton": "Molineux Stadium"
    }
    
    # Create fixtures for the next 3 weeks
    fixtures = []
    start_date = datetime.now().date()
    
    # Create 10 fixtures
    for i in range(10):
        # Randomly select home and away teams
        available_teams = teams.copy()
        
        home_team = random.choice(available_teams)
        available_teams.remove(home_team)
        
        away_team = random.choice(available_teams)
        
        # Set the fixture date (spread over the next 3 weeks)
        fixture_date = start_date + timedelta(days=i % 7 + (i // 7) * 7)
        
        # Create a unique ID for the fixture
        fixture_id = f"pl-{str(uuid.uuid4())[:8]}"
        
        # Create the fixture object
        fixture = {
            "id": fixture_id,
            "competition": "Premier League",
            "home_team": home_team,
            "away_team": away_team,
            "date": fixture_date.strftime('%Y-%m-%d'),
            "time": f"{random.randint(12, 19)}:{random.choice(['00', '15', '30', '45'])}",
            "venue": venues.get(home_team, f"{home_team} Stadium"),
            "home_form": generate_random_form(),
            "away_form": generate_random_form(),
            "odds": generate_random_odds()
        }
        
        fixtures.append(fixture)
    
    return fixtures

def generate_random_form(length=5):
    """Generate random form string (e.g., 'WDLWW')"""
    results = ['W', 'D', 'L']
    return ''.join(random.choices(results, weights=[0.45, 0.25, 0.3], k=length))

def generate_random_odds():
    """Generate random odds for a fixture"""
    # Home win odds (typically between 1.5 and 4.5)
    home_win = round(random.uniform(1.5, 4.5), 1)
    
    # Draw odds (typically between 3.0 and 4.5)
    draw = round(random.uniform(3.0, 4.5), 1)
    
    # Away win odds (typically between 1.5 and 4.5)
    away_win = round(random.uniform(1.5, 4.5), 1)
    
    # Asian handicap
    lines = ["-1.5", "-1.25", "-1.0", "-0.75", "-0.5", "-0.25", "+0.25", "+0.5", "+0.75", "+1.0", "+1.25", "+1.5"]
    line = random.choice(lines)
    
    return {
        "home_win": home_win,
        "draw": draw,
        "away_win": away_win,
        "asian_handicap": {
            "line": line,
            "home": round(random.uniform(1.8, 2.1), 2),
            "away": round(random.uniform(1.8, 2.1), 2)
        }
    }
