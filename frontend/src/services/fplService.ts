import axios from 'axios';
import { Gameweek, FplAnalysis } from '../types/fixtures';

// Base API URL
const API_BASE_URL = 'http://localhost:5050/api';

/**
 * Fetch gameweeks from the API
 * @param onlyNext If true, only fetch the next upcoming gameweek
 * @returns Array of gameweeks
 */
export const fetchGameweeks = async (onlyNext: boolean = true): Promise<Gameweek[]> => {
  try {
    console.log('Fetching gameweeks from API...');
    const response = await axios.get(`${API_BASE_URL}/fpl/gameweeks`, {
      params: { only_next: onlyNext }
    });
    console.log('Gameweeks API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching gameweeks:', error);
    throw error;
  }
};

/**
 * Fetch content for a specific gameweek
 * @param gameweekId The ID of the gameweek to fetch content for
 * @returns The FPL analysis for the gameweek
 */
export const fetchGameweekContent = async (gameweekId: string): Promise<FplAnalysis> => {
  try {
    console.log(`Fetching FPL content for gameweek ${gameweekId}...`);
    const response = await axios.get(`${API_BASE_URL}/fpl/gameweek/${gameweekId}/content`);
    console.log(`FPL content API response for ${gameweekId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching FPL content for gameweek ${gameweekId}:`, error);
    throw error;
  }
};

/**
 * Generate content for a specific gameweek
 * @param gameweekId The ID of the gameweek to generate content for
 * @param force If true, force regeneration even if content already exists
 * @returns The generated FPL analysis for the gameweek
 */
export const generateGameweekContent = async (gameweekId: string, force: boolean = false): Promise<FplAnalysis> => {
  try {
    console.log(`Generating FPL content for gameweek ${gameweekId}...`);
    const response = await axios.post(`${API_BASE_URL}/fpl/gameweek/${gameweekId}/generate`, null, {
      params: { force }
    });
    console.log(`FPL content generation API response for ${gameweekId}:`, response.data);
    return response.data.content;
  } catch (error) {
    console.error(`Error generating FPL content for gameweek ${gameweekId}:`, error);
    throw error;
  }
};
