import os
import json
import logging
from tools.fpl_content_generator import FPLContentGenerator

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('test_fpl_content')

def test_fpl_content_generation():
    """Test FPL content generation for a specific gameweek"""
    logger.info("Starting FPL content generation test")
    
    # Initialize the FPL content generator
    fpl_generator = FPLContentGenerator()
    
    # Set the gameweek to test
    gameweek = 28  # Example: current gameweek is 28 (as of March 2025)
    
    # Test generic advice generation
    logger.info(f"Testing generic advice generation for gameweek {gameweek}")
    try:
        generic_advice = fpl_generator.generate_generic_advice(gameweek)
        logger.info(f"Generic advice generated successfully for gameweek {gameweek}")
        logger.info(f"Generic advice keys: {generic_advice.keys()}")
        
        # Save the generic advice to a file for inspection
        output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'fpl_content')
        os.makedirs(output_dir, exist_ok=True)
        with open(os.path.join(output_dir, f'test_generic_advice_gw{gameweek}.json'), 'w') as f:
            json.dump(generic_advice, f, indent=2)
        logger.info(f"Generic advice saved to {output_dir}/test_generic_advice_gw{gameweek}.json")
    except Exception as e:
        logger.error(f"Error generating generic advice: {str(e)}")
    
    # Load team data for personalized advice
    # Corrected path to the team file
    team_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'fpl_team.json')
    logger.info(f"Looking for team file at: {team_file}")
    
    if os.path.exists(team_file):
        try:
            with open(team_file, 'r') as f:
                team_state = json.load(f)
            
            logger.info(f"Team state loaded successfully: {len(json.dumps(team_state))} characters")
            
            # Test personalized advice generation
            logger.info(f"Testing personalized advice generation for gameweek {gameweek}")
            try:
                personalized_advice = fpl_generator.generate_personalized_advice(gameweek, team_state)
                logger.info(f"Personalized advice generated successfully for gameweek {gameweek}")
                logger.info(f"Personalized advice keys: {personalized_advice.keys()}")
                
                # Save the personalized advice to a file for inspection
                with open(os.path.join(output_dir, f'test_personalized_advice_gw{gameweek}.json'), 'w') as f:
                    json.dump(personalized_advice, f, indent=2)
                logger.info(f"Personalized advice saved to {output_dir}/test_personalized_advice_gw{gameweek}.json")
            except Exception as e:
                logger.error(f"Error generating personalized advice: {str(e)}")
        except Exception as e:
            logger.error(f"Error loading team state: {str(e)}")
    else:
        logger.warning(f"Team file not found at {team_file}")
    
    logger.info("FPL content generation test completed")

if __name__ == "__main__":
    test_fpl_content_generation()
