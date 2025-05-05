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
    Get all fixtures (legacy endpoint)
    Optional query params:
    - limit (int) - Limit the number of fixtures returned
    - include_past (bool) - Include past fixtures (default: false)
    """
    # Default to Premier League for backward compatibility
    return get_competition_fixtures('premier-league')

@fixtures_bp.route('/<competition>', methods=['GET'])
def get_competition_fixtures(competition):
    """
    Get fixtures for a specific competition
    Supported competitions: 'premier-league', 'champions-league'
    Optional query params:
    - limit (int) - Limit the number of fixtures returned
    - include_past (bool) - Include past fixtures (default: false)
    """
    try:
        # Validate competition
        if competition not in ['premier-league', 'champions-league']:
            return jsonify({"error": f"Unsupported competition: {competition}"}), 400
            
        fixtures = load_fixtures(competition)
        
        # Check if we should include past fixtures
        include_past = request.args.get('include_past', 'false').lower() == 'true'
        
        # If fixtures are empty or outdated, refresh them
        if False:
        #if not fixtures or is_fixtures_outdated(fixtures, include_past):
            print(f"Refreshing {competition} fixtures...")
            fixtures = refresh_fixtures_data(competition)
            #save_fixtures(fixtures, competition)
        
        today = datetime.now().date()
        
        if include_past:
            # Include all fixtures but mark them as past/upcoming
            for fixture in fixtures:
                fixture_date = datetime.strptime(fixture['date'], '%Y-%m-%d').date()
                fixture['status'] = 'past' if fixture_date < today else 'upcoming'
            filtered_fixtures = fixtures
        else:
            # Filter to only include upcoming fixtures
            filtered_fixtures = [f for f in fixtures if datetime.strptime(f['date'], '%Y-%m-%d').date() >= today]
        
        # Sort by date (ascending)
        filtered_fixtures.sort(key=lambda x: x['date'])
        
        # Check if analysis exists for each fixture
        for fixture in filtered_fixtures:
            fixture_id = fixture['id']
            analysis = load_analysis(fixture_id)
            fixture['has_analysis'] = bool(analysis)
        
        # Apply limit if provided
        limit = request.args.get('limit', type=int)
        if limit and limit > 0:
            filtered_fixtures = filtered_fixtures[:limit]
        
        return jsonify(filtered_fixtures)
    except Exception as e:
        print(f"Error in get_competition_fixtures: {str(e)}")
        return jsonify({"error": str(e)}), 500

@fixtures_bp.route('/fixture/<fixture_id>', methods=['GET'])
def get_fixture(fixture_id):
    """Get a specific fixture by ID"""
    try:
        # Determine which competition to load based on fixture_id prefix
        competition = None
        if fixture_id.startswith('pl-'):
            competition = 'premier-league'
        elif fixture_id.startswith('cl-'):
            competition = 'champions-league'
            
        fixtures = load_fixtures(competition)
        fixture = next((f for f in fixtures if f['id'] == fixture_id), None)
        
        if not fixture:
            # If not found in the specified competition, try all competitions
            for comp in ['premier-league', 'champions-league']:
                if competition != comp:  # Skip the one we already checked
                    comp_fixtures = load_fixtures(comp)
                    fixture = next((f for f in comp_fixtures if f['id'] == fixture_id), None)
                    if fixture:
                        break
        
        if not fixture:
            return jsonify({"error": "Fixture not found"}), 404
        
        # Check if analysis exists for this fixture
        analysis = load_analysis(fixture_id)
        fixture['has_analysis'] = bool(analysis)
            
        return jsonify(fixture)
    except Exception as e:
        print(f"Error in get_fixture: {str(e)}")
        return jsonify({"error": str(e)}), 500

@fixtures_bp.route('/refresh/<competition>', methods=['POST'])
def refresh_competition_fixtures(competition):
    """
    Endpoint to refresh fixtures data for a specific competition
    """
    try:
        # Validate competition
        if competition not in ['premier-league', 'champions-league']:
            return jsonify({"error": f"Unsupported competition: {competition}"}), 400
            
        fixtures = refresh_fixtures_data(competition)
        save_fixtures(fixtures, competition)
        
        # Check if analysis exists for each fixture
        for fixture in fixtures:
            fixture_id = fixture['id']
            analysis = load_analysis(fixture_id)
            fixture['has_analysis'] = bool(analysis)
            
        return jsonify({
            "message": f"{competition} fixtures refreshed successfully", 
            "count": len(fixtures),
            "fixtures": fixtures
        })
    except Exception as e:
        print(f"Error in refresh_competition_fixtures: {str(e)}")
        return jsonify({"error": str(e)}), 500

def is_fixtures_outdated(fixtures, include_past=False):
    """Check if fixtures data is outdated (older than 24 hours)"""
    if not fixtures:
        return True
    
    # Check the first fixture's date
    today = datetime.now().date()
    
    if not include_past:
        # If we're only showing upcoming fixtures, check if we have any upcoming ones
        upcoming_fixtures = [f for f in fixtures if datetime.strptime(f['date'], '%Y-%m-%d').date() >= today]
        if not upcoming_fixtures:
            return True
    else:
        # If we're including past fixtures, check if we have fixtures from the past 14 days
        two_weeks_ago = today - timedelta(days=14)
        recent_fixtures = [f for f in fixtures if datetime.strptime(f['date'], '%Y-%m-%d').date() >= two_weeks_ago]
        if len(recent_fixtures) < 10:  # Assuming we should have at least 10 fixtures in a 2-week period
            return True
    
    return False

def refresh_fixtures_data(competition):
    """Fetch latest fixtures from Rotowire or fallback"""
    try:
        print(f"Fetching {competition} fixtures...")
        return scrape_rotowire_fixtures(competition)
    except Exception as e:
        print(f"Error in refresh_fixtures_data: {str(e)}")
        return generate_fallback_fixtures(competition)

def scrape_rotowire_fixtures(competition=None):
    """
    Scrape upcoming Premier League or Champions League fixtures and lineups from Rotowire
    Returns a list of fixture objects compatible with the existing format
    """
    try:
        # Determine URL based on competition
        url = "https://www.rotowire.com/soccer/lineups.php"
        if competition == 'champions-league':
            url += "?league=UCL"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        print(f"Fetching {competition or 'Premier League'} fixtures from Rotowire...")
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"Failed to fetch fixtures from Rotowire: HTTP {response.status_code}")
            return generate_fallback_fixtures(competition or 'premier-league')
        
        soup = BeautifulSoup(response.text, 'html.parser')
        fixtures = []
        
        # Load existing fixtures to preserve IDs and other data
        existing_fixtures = load_fixtures(competition or 'premier-league')
        existing_fixtures_dict = {f"{f['home_team']}-{f['away_team']}": f for f in existing_fixtures}
        
        # Find all fixture boxes
        fixture_boxes = soup.select('.lineup__box')
        
        if not fixture_boxes:
            print("No fixture boxes found on Rotowire")
            return generate_fallback_fixtures(competition or 'premier-league')
        
        print(f"Found {len(fixture_boxes)} fixture boxes on Rotowire")
        
        for box in fixture_boxes:
            try:
                # Extract home and away team names
                home_team_div = box.select_one('.lineup__mteam.is-home')
                away_team_div = box.select_one('.lineup__mteam.is-visit')
                
                if not home_team_div or not away_team_div:
                    continue
                
                home_team = home_team_div.get_text(strip=True) 
                away_team = away_team_div.get_text(strip=True)
                
                # Map team names to our standard format
                home_team = standardize_team_name(home_team)
                away_team = standardize_team_name(away_team)
                
                # For Premier League, skip non-PL teams; for UCL, skip non-UCL teams (optional, can be expanded)
                if competition == 'premier-league' or competition is None:
                    if not is_premier_league_team(home_team) or not is_premier_league_team(away_team):
                        print(f"Skipping non-Premier League teams: {home_team} vs {away_team}")
                        continue
                # For UCL, optionally add a check for UCL teams if you have a list
                
                # Extract date and time
                fixture_date = datetime.now().date() + timedelta(days=7)
                fixture_time = "15:00"  # Default time
                
                weather_div = box.select_one('.lineup__weather-text')
                if weather_div:
                    weather_text = weather_div.get_text(strip=True)
                    time_match = re.search(r'(\d{1,2}):(\d{2})', weather_text)
                    if time_match:
                        hour, minute = time_match.groups()
                        fixture_time = f"{hour.zfill(2)}:{minute}"
                
                # Format date as YYYY-MM-DD
                date_str = fixture_date.strftime('%Y-%m-%d')
                
                # Generate fixture ID
                prefix = 'pl' if competition == 'premier-league' or competition is None else 'cl'
                fixture_id = f"{prefix}-{home_team.lower().replace(' ', '-')}-{away_team.lower().replace(' ', '-')}-{date_str.replace('-', '')}"
                
                # Extract lineups
                home_lineup = []
                away_lineup = []
                
                home_lineup_list = box.select_one('.lineup__list.is-home')
                away_lineup_list = box.select_one('.lineup__list.is-visit')
                
                if home_lineup_list:
                    for player in home_lineup_list.select('.lineup__player'):
                        position_div = player.select_one('.lineup__pos')
                        player_link = player.select_one('a')
                        
                        if position_div and player_link:
                            position = position_div.get_text(strip=True)
                            player_name = player_link.get_text(strip=True)
                            
                            # Skip injury section
                            if "Injuries" in player_name:
                                break
                            home_lineup.append({
                                "name": player_name,
                                "position": position
                            })
                
                if away_lineup_list:
                    for player in away_lineup_list.select('.lineup__player'):
                        position_div = player.select_one('.lineup__pos')
                        player_link = player.select_one('a')
                        
                        if position_div and player_link:
                            position = position_div.get_text(strip=True)
                            player_name = player_link.get_text(strip=True)
                            
                            if "Injuries" in player_name:
                                break
                            away_lineup.append({
                                "name": player_name,
                                "position": position
                            })
                
                # Build fixture object
                fixture = {
                    "id": fixture_id,
                    "competition": competition or 'premier-league',
                    "home_team": home_team,
                    "away_team": away_team,
                    "date": date_str,
                    "time": fixture_time,
                    "venue": None,
                    "odds": generate_random_odds(),
                    "home_lineup": home_lineup,
                    "away_lineup": away_lineup
                }
                fixtures.append(fixture)
            except Exception as e:
                print(f"Error parsing fixture box: {str(e)}")
                continue
        return fixtures
    except Exception as e:
        print(f"Exception in scrape_rotowire_fixtures: {str(e)}")
        return generate_fallback_fixtures(competition or 'premier-league')

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
        "Luton": "Kenilworth Road",
        "Bayern Munich": "Allianz Arena",
        "Barcelona": "Camp Nou",
        "Real Madrid": "Santiago Bernabeu",
        "Juventus": "Allianz Stadium",
        "Paris Saint-Germain": "Parc des Princes",
        "Ajax": "Johan Cruyff Arena",
        "Atletico Madrid": "Wanda Metropolitano",
        "Borussia Dortmund": "Signal Iduna Park",
        "Inter Milan": "San Siro",
        "RB Leipzig": "Red Bull Arena",
        "Sevilla": "Ramón Sánchez Pizjuán",
        "Valencia": "Mestalla",
        "Zenit Saint Petersburg": "Gazprom Arena"
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

def generate_fallback_fixtures(competition):
    """Generate fallback fixtures if scraping fails"""
    print("Generating fallback fixtures...")
    
    if competition == 'premier-league':
        # Premier League teams
        teams = [
            "Arsenal", "Aston Villa", "Bournemouth", "Brentford", 
            "Brighton", "Chelsea", "Crystal Palace", "Everton", "Leicester"
            "Fulham", "Liverpool", "Manchester City", "Manchester United", 
            "Newcastle", "Nottingham Forest", "Southampton", "Tottenham", 
            "West Ham", "Wolverhampton"
        ]
    elif competition == 'champions-league':
        # Champions League teams
        teams = [
            "Bayern Munich", "Barcelona", "Real Madrid", "Juventus", 
            "Manchester City", "Liverpool", "Chelsea", "Paris Saint-Germain", 
            "Ajax", "Atletico Madrid", "Borussia Dortmund", "Inter Milan", 
            "RB Leipzig", "Sevilla", "Tottenham", "Valencia", "Zenit Saint Petersburg"
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
        "Wolverhampton": "Molineux Stadium",
        "Leicester": "King Power Stadium",
        "Ipswich": "Portman Road",
        "Wolves": "Molineux Stadium",
        "Leeds": "Elland Road",
        "Sheffield United": "Bramall Lane",
        "Burnley": "Turf Moor",
        "Luton": "Kenilworth Road",
        "Bayern Munich": "Allianz Arena",
        "Barcelona": "Camp Nou",
        "Real Madrid": "Santiago Bernabeu",
        "Juventus": "Allianz Stadium",
        "Paris Saint-Germain": "Parc des Princes",
        "Ajax": "Johan Cruyff Arena",
        "Atletico Madrid": "Wanda Metropolitano",
        "Borussia Dortmund": "Signal Iduna Park",
        "Inter Milan": "San Siro",
        "RB Leipzig": "Red Bull Arena",
        "Sevilla": "Ramón Sánchez Pizjuán",
        "Valencia": "Mestalla",
        "Zenit Saint Petersburg": "Gazprom Arena"
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
        if competition == 'premier-league':
            fixture_id = f"pl-{str(uuid.uuid4())[:8]}"
        elif competition == 'champions-league':
            fixture_id = f"cl-{str(uuid.uuid4())[:8]}"
        
        # Create the fixture object
        fixture = {
            "id": fixture_id,
            "competition": competition,
            "home_team": home_team,
            "away_team": away_team,
            "date": fixture_date.strftime('%Y-%m-%d'),
            "time": f"{random.randint(12, 19)}:{random.choice(['00', '15', '30', '45'])}",
            "venue": venues.get(home_team, f"{home_team} Stadium"),
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

def standardize_team_name(name):
    """Standardize team names to match our format"""
    name_map = {
        "Arsenal": "Arsenal",
        "Aston Villa": "Aston Villa",
        "AFC Bournemouth": "Bournemouth",
        "Brentford": "Brentford",
        "Brighton &": "Brighton",
        "Chelsea": "Chelsea",
        "Crystal Palace": "Crystal Palace",
        "Everton": "Everton",
        "Fulham": "Fulham",
        "Ipswich Town": "Ipswich",
        "Leicester City": "Leicester",
        "Liverpool": "Liverpool",
        "Manchester City": "Man City",
        "Manchester United": "Man Utd",
        "Newcastle United": "Newcastle",
        "Nottingham Forest": "Nottm Forest",
        "Southampton": "Southampton",
        "Tottenham Hotspur": "Tottenham",
        "West Ham": "West Ham",
        "Wolverhampton": "Wolves"
    }
    
    # Try to match the first word of the team name
    name = (name.split()[0] + " " + name.split()[1]) if len(name.split()) > 1 else name.split()[0]
    if name in name_map:
        return name_map[name]
    
    # Special cases
    if "United" in name:
        return "Man Utd"
    if "City" in name:
        return "Man City"
    if "Forest" in name:
        return "Nottm Forest"
    if "Villa" in name:
        return "Aston Villa"
    if "Palace" in name:
        return "Crystal Palace"
    if "Ham" in name:
        return "West Ham"
    if "Wolves" in name or "Wolverhampton" in name:
        return "Wolves"
    
    # Return original if no match
    return name

def is_premier_league_team(team_name):
    """Check if a team is in the Premier League"""
    premier_league_teams = [
        "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
        "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich",
        "Leicester", "Liverpool", "Man City", "Man Utd", "Newcastle",
        "Nottm Forest", "Southampton", "Tottenham", "West Ham", "Wolves"
    ]
    return team_name in premier_league_teams

def american_to_decimal(american_odds):
    """Convert American odds format to decimal"""
    try:
        if american_odds == "–" or american_odds == "-":
            return 2.0  # Default value
        
        american_odds = american_odds.replace('+', '')
        american_odds = float(american_odds)
        
        if american_odds > 0:
            return round(american_odds / 100 + 1, 2)
        else:
            return round(100 / abs(american_odds) + 1, 2)
    except:
        return 2.0  # Default value
