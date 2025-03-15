#!/usr/bin/env python3
"""
Standalone script to scrape Rotowire for Premier League fixtures and lineups
"""

import json
import os
import requests
from datetime import datetime, timedelta
import re
import random
from bs4 import BeautifulSoup
import sys
import pathlib

# Add parent directory to path to allow imports
sys.path.append(str(pathlib.Path(__file__).parent.parent.parent))

# Define file paths
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
FIXTURES_PREMIER_LEAGUE_FILE = os.path.join(DATA_DIR, 'fixtures-premier-league.json')

def scrape_rotowire_fixtures():
    """
    Scrape upcoming Premier League fixtures and lineups from Rotowire
    Returns a list of fixture objects compatible with the existing format
    """
    try:
        url = "https://www.rotowire.com/soccer/lineups.php"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        print(f"Fetching Premier League fixtures from Rotowire...")
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"Failed to fetch fixtures from Rotowire: HTTP {response.status_code}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        fixtures = []
        
        # Load existing fixtures to preserve IDs and other data
        existing_fixtures = load_fixtures()
        existing_fixtures_dict = {f"{f['home_team']}-{f['away_team']}": f for f in existing_fixtures}
        
        # Find all fixture boxes
        fixture_boxes = soup.select('.lineup__box')
        
        if not fixture_boxes:
            print("No fixture boxes found on Rotowire")
            return []
        
        print(f"Found {len(fixture_boxes)} fixture boxes on Rotowire")
        
        for box in fixture_boxes:
            try:
                # Extract home and away team names
                home_team_div = box.select_one('.lineup__mteam.is-home')
                away_team_div = box.select_one('.lineup__mteam.is-visit')
                
                if not home_team_div or not away_team_div:
                    continue
                
                home_team = home_team_div.get_text(strip=True).split()[0]  # Get first word to avoid extra text
                away_team = away_team_div.get_text(strip=True).split()[0]  # Get first word to avoid extra text
                
                # Map team names to our standard format
                home_team = standardize_team_name(home_team)
                away_team = standardize_team_name(away_team)
                
                # Skip non-Premier League teams
                if not is_premier_league_team(home_team) or not is_premier_league_team(away_team):
                    continue
                
                # Extract date and time
                # Rotowire doesn't always show date/time clearly, so we'll use current date + 7 days if not found
                fixture_date = datetime.now().date() + timedelta(days=7)
                fixture_time = "15:00"  # Default time
                
                # Try to extract weather/time info
                weather_div = box.select_one('.lineup__weather-text')
                if weather_div:
                    weather_text = weather_div.get_text(strip=True)
                    # Extract time if available
                    time_match = re.search(r'(\d{1,2}):(\d{2})', weather_text)
                    if time_match:
                        hour, minute = time_match.groups()
                        fixture_time = f"{hour.zfill(2)}:{minute}"
                
                # Format date as YYYY-MM-DD
                date_str = fixture_date.strftime('%Y-%m-%d')
                
                # Generate fixture ID
                fixture_id = f"pl-{home_team.lower().replace(' ', '-')}-{away_team.lower().replace(' ', '-')}-{date_str.replace('-', '')}"
                
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
                            
                            # Skip injury section
                            if "Injuries" in player_name:
                                break
                                
                            away_lineup.append({
                                "name": player_name,
                                "position": position
                            })
                
                # Extract odds if available
                odds = generate_random_odds()  # Default to random odds
                odds_div = box.select_one('.lineup__odds')
                if odds_div:
                    home_odds_div = odds_div.select_one('.lineup__odds-item:nth-child(1)')
                    draw_odds_div = odds_div.select_one('.lineup__odds-item:nth-child(2)')
                    away_odds_div = odds_div.select_one('.lineup__odds-item:nth-child(3)')
                    
                    if home_odds_div and draw_odds_div and away_odds_div:
                        # Extract odds values
                        home_odds_span = home_odds_div.select_one('.draftkings')
                        draw_odds_span = draw_odds_div.select_one('.draftkings')
                        away_odds_span = away_odds_div.select_one('.draftkings')
                        
                        if home_odds_span and draw_odds_span and away_odds_span:
                            home_odds_text = home_odds_span.get_text(strip=True)
                            draw_odds_text = draw_odds_span.get_text(strip=True)
                            away_odds_text = away_odds_span.get_text(strip=True)
                            
                            # Convert American odds to decimal
                            try:
                                home_win = american_to_decimal(home_odds_text)
                                draw = american_to_decimal(draw_odds_text)
                                away_win = american_to_decimal(away_odds_text)
                                
                                odds = {
                                    "home_win": home_win,
                                    "draw": draw,
                                    "away_win": away_win,
                                    "asian_handicap": {
                                        "line": "+0.0",
                                        "home": 1.9,
                                        "away": 1.9
                                    }
                                }
                            except:
                                pass  # Keep default odds if conversion fails
                
                # Get venue
                venue = get_stadium_for_team(home_team)
                
                # Create fixture object
                fixture = {
                    "id": fixture_id,
                    "competition": "Premier League",
                    "home_team": home_team,
                    "away_team": away_team,
                    "date": date_str,
                    "time": fixture_time,
                    "venue": venue,
                    "home_form": generate_random_form(),
                    "away_form": generate_random_form(),
                    "odds": odds,
                    "lineups": {
                        "home": home_lineup,
                        "away": away_lineup
                    }
                }
                
                # If this fixture exists in our current data, preserve some fields
                fixture_key = f"{home_team}-{away_team}"
                if fixture_key in existing_fixtures_dict:
                    existing = existing_fixtures_dict[fixture_key]
                    # Preserve date, time, and ID if they exist
                    if 'date' in existing:
                        fixture['date'] = existing['date']
                    if 'time' in existing:
                        fixture['time'] = existing['time']
                    if 'id' in existing:
                        fixture['id'] = existing['id']
                    if 'home_form' in existing:
                        fixture['home_form'] = existing['home_form']
                    if 'away_form' in existing:
                        fixture['away_form'] = existing['away_form']
                
                fixtures.append(fixture)
                
            except Exception as e:
                print(f"Error processing fixture box: {str(e)}")
                continue
        
        if not fixtures:
            print("No Premier League fixtures found on Rotowire")
            return []
        
        print(f"Successfully scraped {len(fixtures)} Premier League fixtures from Rotowire")
        return fixtures
        
    except Exception as e:
        print(f"Error scraping Rotowire: {str(e)}")
        return []

def standardize_team_name(name):
    """Standardize team names to match our format"""
    name_map = {
        "Arsenal": "Arsenal",
        "Aston": "Aston Villa",
        "Bournemouth": "Bournemouth",
        "Brentford": "Brentford",
        "Brighton": "Brighton",
        "Chelsea": "Chelsea",
        "Crystal": "Crystal Palace",
        "Everton": "Everton",
        "Fulham": "Fulham",
        "Ipswich": "Ipswich",
        "Leicester": "Leicester",
        "Liverpool": "Liverpool",
        "Manchester": "Man City",
        "Man": "Man Utd",
        "Newcastle": "Newcastle",
        "Nottingham": "Nottm Forest",
        "Southampton": "Southampton",
        "Tottenham": "Tottenham",
        "West": "West Ham",
        "Wolverhampton": "Wolves"
    }
    
    # Try to match the first word of the team name
    first_word = name.split()[0]
    if first_word in name_map:
        return name_map[first_word]
    
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

def generate_random_form(length=5):
    """Generate random form string (e.g., 'WDLWW')"""
    results = ['W', 'D', 'L']
    return ''.join(random.choice(results) for _ in range(length))

def generate_random_odds():
    """Generate random odds for a fixture"""
    return {
        "home_win": round(random.uniform(1.5, 5.0), 2),
        "draw": round(random.uniform(3.0, 4.5), 2),
        "away_win": round(random.uniform(1.5, 5.0), 2),
        "asian_handicap": {
            "line": random.choice(["-1.5", "-1.0", "-0.5", "+0.0", "+0.5", "+1.0", "+1.5"]),
            "home": round(random.uniform(1.8, 2.1), 2),
            "away": round(random.uniform(1.8, 2.1), 2)
        }
    }

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
        "Ipswich": "Portman Road",
        "Leicester": "King Power Stadium",
        "Liverpool": "Anfield",
        "Man City": "Etihad Stadium",
        "Man Utd": "Old Trafford",
        "Newcastle": "St. James' Park",
        "Nottm Forest": "City Ground",
        "Southampton": "St. Mary's Stadium",
        "Tottenham": "Tottenham Hotspur Stadium",
        "West Ham": "London Stadium",
        "Wolves": "Molineux Stadium"
    }
    return stadiums.get(team_name, "Unknown Stadium")

def load_fixtures():
    """
    Load fixtures from JSON file
    """
    try:
        if os.path.exists(FIXTURES_PREMIER_LEAGUE_FILE):
            with open(FIXTURES_PREMIER_LEAGUE_FILE, 'r') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Error loading fixtures: {str(e)}")
        return []

def save_fixtures(fixtures):
    """
    Save fixtures to JSON file with upsert behavior
    - Updates existing fixtures if they have the same ID
    - Adds new fixtures that don't exist yet
    """
    try:
        # Load existing fixtures
        existing_fixtures = []
        if os.path.exists(FIXTURES_PREMIER_LEAGUE_FILE):
            try:
                with open(FIXTURES_PREMIER_LEAGUE_FILE, 'r') as f:
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
        with open(FIXTURES_PREMIER_LEAGUE_FILE, 'w') as f:
            json.dump(merged_fixtures, f, indent=2)
            
        print(f"Saved {len(merged_fixtures)} fixtures to {FIXTURES_PREMIER_LEAGUE_FILE}")
        print(f"- {len(new_fixtures_dict)} new/updated fixtures")
        print(f"- {len(existing_fixtures_dict) - len(new_fixtures_dict.keys() & existing_fixtures_dict.keys())} unchanged fixtures")
        
        return True
    except Exception as e:
        print(f"Error saving fixtures: {str(e)}")
        return False

if __name__ == "__main__":
    print("Scraping Rotowire for Premier League fixtures...")
    fixtures = scrape_rotowire_fixtures()
    if fixtures:
        save_fixtures(fixtures)
        print(f"Successfully scraped and saved {len(fixtures)} fixtures")
    else:
        print("No fixtures found or error occurred")
