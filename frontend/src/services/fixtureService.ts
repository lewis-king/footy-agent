import axios from 'axios';
import { Fixture, FixtureContent, Analysis } from '../types/fixtures';
import { API_BASE_URL } from '../config/api';

/**
 * Fetches fixtures from the API
 * @param competition The competition to fetch fixtures for ('premier-league' or 'champions-league')
 * @param includePast Whether to include past fixtures (default: true)
 * @returns Promise resolving to an array of Fixture objects
 */
export const fetchFixtures = async (competition: string = 'premier-league', includePast: boolean = true): Promise<Fixture[]> => {
  try {
    console.log('Fetching fixtures from API...', `${API_BASE_URL}/fixtures/${competition}?include_past=${includePast}`);
    const response = await axios.get(`${API_BASE_URL}/fixtures/${competition}`, {
      params: {
        include_past: includePast
      }
    });
    console.log('Fixtures API response:', response.data);
    
    // Map the backend fixture format to the frontend format
    return response.data.map((backendFixture: any) => {
      try {
        // Parse the date and time
        const [year, month, day] = backendFixture.date.split('-').map(Number);
        const [hour, minute] = backendFixture.time.split(':').map(Number);
        const kickoffDate = new Date(year, month - 1, day, hour, minute);
        
        // Generate team colors based on team names
        const getTeamColors = (teamName: string) => {
          // Simple hash function to generate consistent colors
          const hash = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const hue = hash % 360;
          return {
            primary: `hsl(${hue}, 70%, 50%)`,
            secondary: `hsl(${hue}, 70%, 30%)`
          };
        };
        
        const homeColors = getTeamColors(backendFixture.home_team);
        const awayColors = getTeamColors(backendFixture.away_team);
        
        // Create a frontend fixture from the backend data
        return {
          id: backendFixture.id,
          competition: backendFixture.competition,
          kickoff: kickoffDate.toISOString(),
          venue: backendFixture.venue,
          status: 'upcoming',
          homeTeam: {
            id: `home-${backendFixture.id}`,
            name: backendFixture.home_team,
            shortName: backendFixture.home_team.split(' ')[0],
            logo: getTeamLogo(backendFixture.home_team, backendFixture.competition),
            primaryColor: homeColors.primary,
            secondaryColor: homeColors.secondary
          },
          awayTeam: {
            id: `away-${backendFixture.id}`,
            name: backendFixture.away_team,
            shortName: backendFixture.away_team.split(' ')[0],
            logo: getTeamLogo(backendFixture.away_team, backendFixture.competition),
            primaryColor: awayColors.primary,
            secondaryColor: awayColors.secondary
          }
        };
      } catch (mapError) {
        console.error('Error mapping fixture:', backendFixture, mapError);
        throw mapError;
      }
    });
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }
    
    // For initial development, return mock fixtures if API fails
    console.log('Returning mock fixtures due to API error');
    return getMockFixtures(competition);
  }
};

/**
 * Helper function to get team logo URLs based on competition
 * @param teamName The name of the team
 * @param competition The competition ('Premier League' or 'Champions League')
 * @returns URL to the team's logo
 */
const getTeamLogo = (teamName: string, competition: string): string => {
  if (competition === 'Premier League') {
    return getPremierLeagueTeamLogo(teamName);
  } else if (competition === 'Champions League') {
    return getChampionsLeagueTeamLogo(teamName);
  }
  
  // Default to Premier League if competition is not recognized
  return getPremierLeagueTeamLogo(teamName);
};

/**
 * Helper function to get Premier League team logo URLs
 * @param teamName The name of the team
 * @returns URL to the team's logo
 */
const getPremierLeagueTeamLogo = (teamName: string): string => {
  // Map of team names to their Premier League badge IDs
  const teamLogoMap: Record<string, string> = {
    'Arsenal': 't3',
    'Aston Villa': 't7',
    'Bournemouth': 't91',
    'Brentford': 't94',
    'Brighton': 't36',
    'Burnley': 't90',
    'Chelsea': 't8',
    'Crystal Palace': 't31',
    'Everton': 't11',
    'Fulham': 't54',
    'Ipswich': 't40',
    'Liverpool': 't14',
    'Luton': 't102',
    'Man City': 't43',
    'Man Utd': 't1',
    'Newcastle': 't4',
    'Nottingham Forest': 't17',
    'Sheffield United': 't49',
    'Tottenham': 't6',
    'West Ham': 't21',
    'Wolves': 't39',
    'Southampton': 't20',
    'Nottm Forest': 't17',
    'Leicester': 't13'
  };

  // Get the team ID from the map, or use a default
  const teamId = teamLogoMap[teamName] || 't0';
  
  // Return the Premier League badge URL
  return `https://resources.premierleague.com/premierleague/badges/${teamId}.svg`;
};

/**
 * Helper function to get Champions League team logo URLs
 * @param teamName The name of the team
 * @returns URL to the team's logo
 */
const getChampionsLeagueTeamLogo = (teamName: string): string => {
  // Map of team names to their Champions League team IDs
  const teamLogoMap: Record<string, string> = {
    'Real Madrid': '50051',
    'Barcelona': '50080',
    'Bayern Munich': '50037',
    'Manchester City': '52919',
    'Liverpool': '7889',
    'Paris Saint-Germain': '52747',
    'Atletico Madrid': '50124',
    'Juventus': '50139',
    'Borussia Dortmund': '50064',
    'Inter Milan': '50138',
    'Chelsea': '7889',
    'Manchester United': '7889',
    'Tottenham': '7889',
    'Arsenal': '52280',
    'Ajax': '50143',
    'RB Leipzig': '2603790',
    'Sevilla': '50142',
    'Valencia': '50141',
    'Zenit Saint Petersburg': '64388',
    'Benfica': '50147',
    'Porto': '50064',
    'Napoli': '6195',
    'AC Milan': '52816',
    'Roma': '50137'
  };

  // Get the team ID from the map, or use a default
  const teamId = teamLogoMap[teamName] || '50051';
  
  // Return the Champions League badge URL
  return `https://img.uefa.com/imgml/TP/teams/logos/100x100/${teamId}.png`;
};

/**
 * Fetches content for a specific fixture
 * @param fixtureId ID of the fixture to get content for
 * @returns Promise resolving to fixture content
 */
export const fetchFixtureContent = async (fixtureId: string): Promise<FixtureContent> => {
  try {
    console.log(`Fetching analysis for fixture ${fixtureId}...`);
    // First, try to get analysis if it exists
    const response = await axios.get(`${API_BASE_URL}/analysis/${fixtureId}`);
    console.log(`Analysis API response for ${fixtureId}:`, response.data);
    
    if (response.data) {
      // The backend now returns the analysis directly, not nested under an "analysis" property
      const analysis = response.data;
      const content = analysis.content;
      
      // Extract home and away team form from fixture ID
      const getTeamForm = (teamName: string) => {
        // Default form if we can't extract it
        const defaultForm = ['W', 'D', 'L', 'W', 'D'];
        
        try {
          // Try to get the form from the backend data if available
          if (teamName.toLowerCase() === analysis.home_team.toLowerCase() && analysis.home_form) {
            return analysis.home_form.split('').slice(0, 5);
          } else if (teamName.toLowerCase() === analysis.away_team.toLowerCase() && analysis.away_form) {
            return analysis.away_form.split('').slice(0, 5);
          }
          return defaultForm;
        } catch (e) {
          return defaultForm;
        }
      };
      
      // Extract key player matchups
      const extractKeyPlayers = (isHome: boolean) => {
        const teamName = isHome ? analysis.home_team : analysis.away_team;
        const defaultPlayers = [
          {
            name: `${teamName} Key Player 1`,
            position: 'Forward',
            impact: 'Goal scoring threat'
          },
          {
            name: `${teamName} Key Player 2`,
            position: 'Midfielder',
            impact: 'Creative playmaker'
          }
        ];
        
        // If we have structured key player matchups, try to extract players
        if (Array.isArray(content.key_player_matchups)) {
          try {
            // Create a list of players for this team
            const teamPlayers = [];
            
            // Process each matchup to extract players
            for (const matchup of content.key_player_matchups) {
              const parts = matchup.title.split(' vs ');
              if (parts.length < 2) continue;
              
              // Extract player names, removing any text after space or parentheses
              const homePlayerFull = parts[0].trim();
              const awayPlayerFull = parts[1].trim();
              
              // Get the player name for this team (home or away)
              const playerFull = isHome ? homePlayerFull : awayPlayerFull;
              
              // Extract just the name part (before any descriptors)
              const playerName = playerFull.split(/\s+\(/)[0].split(' Midfielder')[0].split(' Forward')[0].split(' Defender')[0];
              
              // Determine position based on text
              let position = 'Forward';
              if (playerFull.toLowerCase().includes('midfielder')) {
                position = 'Midfielder';
              } else if (playerFull.toLowerCase().includes('defender')) {
                position = 'Defender';
              } else if (playerFull.toLowerCase().includes('goalkeeper')) {
                position = 'Goalkeeper';
              }
              
              // Add to team players if we have a valid name
              if (playerName && playerName.length > 0) {
                teamPlayers.push({
                  name: playerName,
                  position: position,
                  impact: matchup.content || 'Key player for the team'
                });
              }
            }
            
            // Return up to 2 players for this team, or default if none found
            return teamPlayers.length > 0 ? teamPlayers.slice(0, 2) : defaultPlayers;
          } catch (e) {
            console.error('Error extracting key players:', e);
            return defaultPlayers;
          }
        }
        
        return defaultPlayers;
      };
      
      // Extract betting insights from the structured data
      const extractBettingInsights = (content: any) => {
        const insights = [];
        
        // Add Asian Handicap insight
        if (content.asian_handicap_analysis) {
          insights.push({
            type: 'value',
            title: 'Asian Handicap',
            description: content.asian_handicap_analysis.analysis || content.asian_handicap_analysis.recommendation || '',
            confidence: 0.8
          });
        }
        
        // Add Key Matchups insight
        if (content.key_player_matchups) {
          insights.push({
            type: 'trending',
            title: 'Key Matchups',
            description: Array.isArray(content.key_player_matchups) 
              ? content.key_player_matchups.map((m: { title: string; content: string }) => m.title + ': ' + m.content).join('\n\n')
              : content.key_player_matchups,
            confidence: 0.75
          });
        }
        
        // Add Team News insight
        if (content.team_news) {
          insights.push({
            type: 'caution',
            title: 'Team News',
            description: content.team_news.raw || JSON.stringify(content.team_news.structured),
            confidence: 0.7
          });
        }
        
        // Add betting insights from content.betting_insights
        if (content.betting_insights) {
          if (typeof content.betting_insights === 'object' && !Array.isArray(content.betting_insights)) {
            // Handle the case where betting_insights is an object with raw and insights properties
            if (content.betting_insights.insights && Array.isArray(content.betting_insights.insights)) {
              content.betting_insights.insights.forEach((insight: string) => {
                const parts = insight.split('@');
                insights.push({
                  type: 'value',
                  title: parts[0].trim(),
                  description: parts.length > 1 ? `Odds: ${parts[1].trim()}` : '',
                  confidence: 0.7
                });
              });
            } else if (content.betting_insights.raw) {
              // Try to extract insights from raw text
              const lines = content.betting_insights.raw.split('\n');
              lines.forEach((line: string) => {
                if (line.includes('@')) {
                  const parts = line.split('@');
                  insights.push({
                    type: 'value',
                    title: parts[0].trim().replace(/\*\*/g, ''),
                    description: parts.length > 1 ? `Odds: ${parts[1].trim()}` : '',
                    confidence: 0.7
                  });
                }
              });
            }
          } else if (Array.isArray(content.betting_insights)) {
            // Handle the case where betting_insights is an array of objects
            content.betting_insights.forEach((insight: any) => {
              insights.push({
                type: 'value',
                title: insight.market || insight.title || 'Betting Insight',
                description: insight.insight || insight.description || '',
                confidence: 0.7
              });
            });
          }
        }
        
        return insights;
      };
      
      // Extract additional content from betting insights
      const extractAdditionalContent = () => {
        if (!content.betting_insights) return [];
        
        if (Array.isArray(content.betting_insights)) {
          return content.betting_insights.map((insight: { market?: string; recommendation?: string; insight?: string }) => ({
            title: insight.market || 'Betting Insight',
            content: insight.recommendation || insight.insight || ''
          }));
        } else if (typeof content.betting_insights === 'string') {
          return content.betting_insights.split('\n').map((line: string) => ({
            title: 'Betting Insight',
            content: line
          }));
        } else if (content.betting_insights.insights) {
          return content.betting_insights.insights.map((insight: string) => ({
            title: 'Betting Insight',
            content: insight
          }));
        }
        
        return [];
      };
      
      // Map the backend analysis format to the frontend format
      return {
        fixtureId: analysis.fixture_id,
        lastUpdated: analysis.generated_at,
        image: {
          url: '/match-preview.jpg',
          alt: `${analysis.home_team} vs ${analysis.away_team}`
        },
        previewHeadline: `${analysis.home_team} vs ${analysis.away_team} Preview`,
        previewContent: content.match_overview,
        teamComparison: {
          homeTeam: {
            form: getTeamForm(analysis.home_team),
            strengths: ['Strong home record', 'Solid defense'],
            weaknesses: ['Inconsistent scoring']
          },
          awayTeam: {
            form: getTeamForm(analysis.away_team),
            strengths: ['Counter-attacking', 'Set pieces'],
            weaknesses: ['Away form', 'Defensive lapses']
          }
        },
        keyPlayers: {
          homeTeam: extractKeyPlayers(true),
          awayTeam: extractKeyPlayers(false)
        },
        bettingInsights: extractBettingInsights(content),
        asianHandicap: {
          recommendation: content.asian_handicap_analysis.recommendation || 'See analysis below',
          homeAdvantage: -0.5,
          explanation: content.asian_handicap_analysis.analysis || ''
        },
        additionalContent: extractAdditionalContent()
      };
    } else {
      throw new Error('No analysis available');
    }
  } catch (error) {
    console.error(`Error fetching content for fixture ${fixtureId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }
    
    // For initial development, return mock content if API fails
    console.log(`Returning mock content for fixture ${fixtureId} due to API error`);
    return getMockContent(fixtureId);
  }
};

/**
 * Fetches fixture analysis from the backend API
 * @param fixtureId The ID of the fixture to fetch analysis for
 * @returns The analysis data adapted to the frontend format
 */
export const fetchFixtureAnalysis = async (fixtureId: string): Promise<Analysis | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${fixtureId}`);
    
    if (!response.ok) {
      console.error(`Error fetching analysis for fixture ${fixtureId}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    // Adapt the backend data to the frontend format
    return {
      fixture_id: data.fixture_id,
      generated_at: data.generated_at,
      home_team: data.home_team,
      away_team: data.away_team,
      date: data.date,
      content: {
        match_overview: data.content.match_overview,
        
        // Handle key_player_matchups which could be a string or structured array
        key_player_matchups: data.content.key_player_matchups,
        
        // Handle asian_handicap_analysis which could be a string or structured object
        asian_handicap_analysis: data.content.asian_handicap_analysis,
        
        // Handle team_news which should be structured
        team_news: data.content.team_news,
        
        // Handle betting_insights which could be an object or array
        betting_insights: data.content.betting_insights,
        
        // Handle prediction which should be structured
        prediction: data.content.prediction,

        // Handle citations which should be structured
        citations: data.content.citations,

        // Handle my_say which should be structured
        my_say: data.content.my_say
      }
    };
  } catch (error) {
    console.error(`Error fetching analysis for fixture ${fixtureId}:`, error);
    return null;
  }
};

/**
 * Provides mock fixtures for development
 * This will be removed when backend is fully implemented
 */
const getMockFixtures = (competition: string = 'premier-league'): Fixture[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  if (competition === 'premier-league') {
    return [
      {
        id: 'pl-fixture-1',
        competition: 'Premier League',
        kickoff: tomorrow.toISOString(),
        venue: 'Emirates Stadium',
        status: 'upcoming',
        homeTeam: {
          id: 'team-arsenal',
          name: 'Arsenal',
          shortName: 'Arsenal',
          logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg',
          primaryColor: '#EF0107',
          secondaryColor: '#063672'
        },
        awayTeam: {
          id: 'team-chelsea',
          name: 'Chelsea',
          shortName: 'Chelsea',
          logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg',
          primaryColor: '#034694',
          secondaryColor: '#EE242C'
        }
      },
      {
        id: 'pl-fixture-2',
        competition: 'Premier League',
        kickoff: nextWeek.toISOString(),
        venue: 'Anfield',
        status: 'upcoming',
        homeTeam: {
          id: 'team-liverpool',
          name: 'Liverpool',
          shortName: 'Liverpool',
          logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg',
          primaryColor: '#C8102E',
          secondaryColor: '#00B2A9'
        },
        awayTeam: {
          id: 'team-mancity',
          name: 'Man City',
          shortName: 'Man City',
          logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg',
          primaryColor: '#6CABDD',
          secondaryColor: '#1C2C5B'
        }
      }
    ];
  } else if (competition === 'champions-league') {
    return [
      {
        id: 'cl-fixture-1',
        competition: 'Champions League',
        kickoff: tomorrow.toISOString(),
        venue: 'Santiago Bernabéu',
        status: 'upcoming',
        homeTeam: {
          id: 'team-real-madrid',
          name: 'Real Madrid',
          shortName: 'Real Madrid',
          logo: 'https://img.uefa.com/imgml/TP/teams/logos/100x100/50051.png',
          primaryColor: '#FFFFFF',
          secondaryColor: '#00529F'
        },
        awayTeam: {
          id: 'team-bayern',
          name: 'Bayern Munich',
          shortName: 'Bayern',
          logo: 'https://img.uefa.com/imgml/TP/teams/logos/100x100/50037.png',
          primaryColor: '#DC052D',
          secondaryColor: '#0066B2'
        }
      },
      {
        id: 'cl-fixture-2',
        competition: 'Champions League',
        kickoff: nextWeek.toISOString(),
        venue: 'Camp Nou',
        status: 'upcoming',
        homeTeam: {
          id: 'team-barcelona',
          name: 'Barcelona',
          shortName: 'Barcelona',
          logo: 'https://img.uefa.com/imgml/TP/teams/logos/100x100/50080.png',
          primaryColor: '#A50044',
          secondaryColor: '#004D98'
        },
        awayTeam: {
          id: 'team-juventus',
          name: 'Juventus',
          shortName: 'Juventus',
          logo: 'https://img.uefa.com/imgml/TP/teams/logos/100x100/50139.png',
          primaryColor: '#000000',
          secondaryColor: '#FFFFFF'
        }
      }
    ];
  }
  
  // Default to Premier League if competition is not recognized
  return getMockFixtures('premier-league');
};

/**
 * Provides mock content for a fixture for development
 * This will be removed when backend is fully implemented
 */
const getMockContent = (fixtureId: string): FixtureContent => {
  return {
    fixtureId,
    lastUpdated: new Date().toISOString(),
    image: {
      url: 'https://resources.premierleague.com/photos/2023/12/10/ccdd7ca2-1a60-414d-8a40-d508c9c35417/GettyImages-1864063158.jpg?width=860&height=573',
      alt: 'Fixture preview image'
    },
    previewHeadline: 'Tactical Analysis: Liverpool vs Manchester United',
    previewContent: 'Liverpool host Manchester United in what promises to be a thrilling encounter at Anfield. Both teams come into this fixture with contrasting form, with Liverpool enjoying a strong run of results while United have struggled for consistency.',
    teamComparison: {
      homeTeam: {
        form: ['W', 'W', 'D', 'W', 'W'],
        strengths: ['High pressing', 'Counter-attacking', 'Set pieces'],
        weaknesses: ['Vulnerability to counter-attacks', 'Inconsistent defensive concentration']
      },
      awayTeam: {
        form: ['L', 'W', 'L', 'D', 'W'],
        strengths: ['Individual brilliance', 'Fast transitions', 'Aerial dominance'],
        weaknesses: ['Midfield control', 'Defensive organization', 'Away form']
      }
    },
    keyPlayers: {
      homeTeam: [
        {
          name: 'Mohamed Salah',
          position: 'RW',
          impact: 'Key goal threat with excellent scoring record against Manchester United'
        },
        {
          name: 'Virgil van Dijk',
          position: 'CB',
          impact: 'Defensive leader who will be crucial in dealing with United\'s counterattacks'
        }
      ],
      awayTeam: [
        {
          name: 'Bruno Fernandes',
          position: 'CAM',
          impact: 'Creative hub who will need to find space between Liverpool\'s midfield and defense'
        },
        {
          name: 'Rasmus Højlund',
          position: 'ST',
          impact: 'Target man who will look to exploit any gaps in Liverpool\'s high defensive line'
        }
      ]
    },
    bettingInsights: [
      {
        type: 'Match Result',
        title: 'Liverpool strong favorites at home',
        description: 'Liverpool have won 7 of their last 8 home fixtures, making them clear favorites in this matchup.',
        confidence: 80
      },
      {
        type: 'Goals',
        title: 'Over 2.5 goals likely',
        description: 'The last 6 meetings between these teams at Anfield have produced an average of 3.2 goals per game.',
        confidence: 75
      },
      {
        type: 'First Goalscorer',
        title: 'Salah prime candidate for first goal',
        description: 'Salah has scored first in 4 of Liverpool\'s last 10 home games and has an exceptional record against United.',
        confidence: 70
      }
    ],
    asianHandicap: {
      recommendation: 'Liverpool -1.25',
      homeAdvantage: 1.25,
      explanation: 'Liverpool\'s strong home form combined with United\'s defensive vulnerabilities suggests Liverpool should cover the -1.25 handicap with around 60% probability.'
    },
    additionalContent: [
      {
        title: 'Historical Context',
        content: 'This fixture has historically been one of the most fiercely contested in English football. Recent meetings have favored Liverpool, who famously won 7-0 in this fixture last season - their biggest ever victory in this rivalry.'
      },
      {
        title: 'Injury News',
        content: 'Liverpool will be without Diogo Jota and Andy Robertson, while United are missing Lisandro Martinez and Mason Mount. These absences could impact both teams\' tactical approaches, particularly United\'s build-up play from the back.'
      },
      {
        title: 'Referee Analysis',
        content: 'Michael Oliver will referee this fixture. He has shown an average of 3.2 yellow cards per game this season and has awarded 3 penalties in his last 10 Premier League matches, which could be relevant for betting purposes.'
      }
    ]
  };
};

/**
 * Provides mock analysis for a fixture for development
 * This will be removed when backend is fully implemented
 */
// Commented out unused function to fix TypeScript warning
/*
const getMockAnalysis = (fixtureId: string): Analysis => {
  return {
    fixture_id: fixtureId,
    home_team: "Nottingham Forest",
    away_team: "Manchester City",
    date: "2025-03-08",
    generated_at: "2025-03-07T20:56:04.305168",
    content: {
      match_overview: "Nottingham Forest's **W-D-L-W-D** form demonstrates volatility, bookended by a 7-0 demolition of Brighton and consecutive away losses to Newcastle (1-3) and Fulham (0-2). Their 1.82 xGA/90 at home ranks 6th-best in the league, though they've kept just one clean sheet in their last seven matches.\n\nManchester City's **W-W-W-D-W** run masks underlying defensive frailties:\n- 19 goals conceded in 7 Premier League games when starting in the top four\n- 51% xG ratio on the road (6th-worst among top-half teams)\n- 1 clean sheet in 14 away games vs top-12 opponents\n\nThe reverse fixture saw City dominate possession (68%) but require set-piece goals to break through Forest's low block, winning 3-0 with 8 corners and 2.17 xG.",
      
      team_news: {
        raw: "**Nottm Forest**:\n- **Injuries:** Carlos Miguel (GK)\n- **Suspensions:** None\n- **Projected XI (4-2-3-1):** Sels; Aina, Milenković, Murillo, Williams; Domínguez, Anderson; Elanga, Gibbs-White, Hudson-Odoi; Wood\n\n**Man City**:\n- **Injuries:** Stones (thigh), Aké (foot), Akanji (hamstring), Bobb (knee), Rodri (ACL)\n- **Suspensions:** None\n- **Projected XI (4-3-3):** Ederson; Lewis, Khusanov, Dias, Gvardiol; Nico, Kovacic, De Bruyne; Savinho, Marmoush, Doku",
        structured: {
          home: {
            injuries: ["Carlos Miguel (GK)"],
            suspensions: [],
            returnees: ["Projected XI (4-2-3-1): Sels; Aina, Milenković, Murillo, Williams; Domínguez, Anderson; Elanga, Gibbs-White, Hudson-Odoi; Wood"]
          },
          away: {
            injuries: ["Stones (thigh)", "Aké (foot)", "Akanji (hamstring)", "Bobb (knee)", "Rodri (ACL)"],
            suspensions: [],
            returnees: ["Projected XI (4-3-3): Ederson; Lewis, Khusanov, Dias, Gvardiol; Nico, Kovacic, De Bruyne; Savinho, Marmoush, Doku"]
          }
        }
      },
      
      key_player_matchups: "The New Zealand striker's 0.68 xG/90 (94th percentile) meets City's inexperienced Uzbek center-back making just his 5th PL start:\n- Wood wins 4.1 aerial duels/90 (82nd %ile)\n- Khusanov's 1.3 fouls/90 could yield dangerous set pieces\n\nCity's left winger completes 4.7 dribbles/90 (97th %ile) against Forest's attack-minded right-back:\n- Williams allows 1.3 crosses/90 from his flank\n- Doku creates 2.3 chances/90 but loses possession 12.4 times/90\n\nForest's creative hub (2.3 key passes/90) faces City's makeshift right-back:\n- Nunes' 38% tackle success rate vs wingers\n- Gibbs-White draws 2.1 fouls/90 in final third",
      
      asian_handicap_analysis: {
        analysis: "City failed to cover -1.5 in 9/10 away games vs top-7 teams. Forest covered +1.5 in 12/14 home matches (85.7%). Forest's 4-4-2 defensive shape forces opponents wide, neutralizing City's preferred central combinations. This increases likelihood of low-xG crosses and counterattacks via Elanga and Wood. City's missing defensive starters account for 63% of aerial duels won.",
        recommendation: "Forest +1.5 (1.85)",
        table: {
          headers: ["Line", "Forest (+1.5)", "City (-1.5)"],
          rows: [["Odds", "1.85", "1.95"]]
        }
      },
      
      betting_insights: {
        raw: "**This pivotal Premier League clash between Nottingham Forest (4th, 53 pts) and Manchester City (5th, 52 pts) carries significant implications for Champions League qualification. Forest's defensive resilience at home (7W-4D-2L) collides with City's league-best 21 goals scored in 2025, creating a tactical chess match with multiple value opportunities in Asian Handicap and ancillary markets.**\n\nCity average 7.2 corners/90 vs low blocks (Forest concede 5.1/90 at home):\n- **City Over 6.5 Corners @ +112** (3u)\n- **Total Corners Over 10.5 @ -120** (Hits in 73% of City away games)\n- **Yes @ -188** (1.53)\n\nForest scored in 13/14 home games; City kept 1 clean sheet in last 7 away\n- **+300** vs xG value of +250\n\nFaces City's 3rd-choice CB pairing; scored in 4 of last 5 home starts\n- **Draw/City @ +550**\n\nCity score 61% of goals after halftime; Forest concede 0.6 xGA/90 in first halves",
        insights: [
          "City average 7.2 corners/90 vs low blocks (Forest concede 5.1/90 at home) - City Over 6.5 Corners @ +112 (3u)",
          "Total Corners Over 10.5 @ -120 (Hits in 73% of City away games)",
          "Forest scored in 13/14 home games; City kept 1 clean sheet in last 7 away",
          "Faces City's 3rd-choice CB pairing; scored in 4 of last 5 home starts - Draw/City @ +550",
          "City score 61% of goals after halftime; Forest concede 0.6 xGA/90 in first halves"
        ]
      },
      
      prediction: {
        raw: "**Score Projection:** Nottingham Forest 1-2 Manchester City\n**Rationale:**\nCity's superior individual quality should prevail through De Bruyne's set-piece delivery (3 assists in last 5 games) and Marmoush's movement between lines (1.7 key passes/90). However, Forest will make it difficult and likely score themselves given City's defensive issues without Rodri.\n\n**Best Value Bets:**\n1. Nottingham Forest +1.5 Asian Handicap @ 1.85\n2. Manchester City Corners Over 6.5 @ +112\n3. Both Teams to Score Yes @ -188\n\nThis comprehensive approach balances statistical rigor with market mispricing, particularly in Asian Handicap and corners markets where bookmakers underweight Forest's defensive organization and City's set-piece reliance.",
        score: {
          home: 1,
          away: 2,
          found: true
        }
      },
      
      my_say: {
        content: "This is a much more competitive fixture than the table positions suggest. Forest's home form has been excellent, and City have shown vulnerability away from home without Rodri anchoring their midfield. The Asian Handicap of Forest +1.5 offers significant value given the tactical matchup and City's struggles to win by multiple goals against defensively organized teams."
      }
    }
  };
};
*/
