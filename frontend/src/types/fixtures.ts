// Types for fixtures in the FootyAgent application

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Fixture {
  id: string;
  competition: string;
  kickoff: string;
  homeTeam: Team;
  awayTeam: Team;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface FixtureContentImage {
  url: string;
  alt: string;
}

export interface BettingInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
}

export interface FixtureContent {
  fixtureId: string;
  lastUpdated: string;
  image: FixtureContentImage;
  previewHeadline: string;
  previewContent: string;
  teamComparison: {
    homeTeam: {
      form: string[];
      strengths: string[];
      weaknesses: string[];
    };
    awayTeam: {
      form: string[];
      strengths: string[];
      weaknesses: string[];
    };
  };
  keyPlayers: {
    homeTeam: {
      name: string;
      position: string;
      impact: string;
    }[];
    awayTeam: {
      name: string;
      position: string;
      impact: string;
    }[];
  };
  bettingInsights: BettingInsight[];
  asianHandicap: {
    recommendation: string;
    homeAdvantage: number;
    explanation: string;
  };
  additionalContent: {
    title: string;
    content: string;
  }[];
}

export interface AnalysisContent {
  match_overview: string;
  raw_perplexity_content?: string;
  citations?: Array<{
    id: string;
    url: string;
    description: string;
  }>;
  asian_handicap_analysis: {
    table?: {
      headers: string[];
      rows: string[][];
    };
    analysis: string;
    recommendation?: string;
    raw?: string;
  };
  key_player_matchups: Array<{
    title: string;
    content: string;
    raw?: string;
  }> | string;
  team_news: {
    raw: string;
    structured: {
      home: {
        injuries: string[];
        suspensions: string[];
        returnees: string[];
        projected_xi?: string;
      };
      away: {
        injuries: string[];
        suspensions: string[];
        returnees: string[];
        projected_xi?: string;
      };
    };
  };
  betting_insights: {
    raw: string;
    insights?: string[];
  } | Array<{
    market: string;
    insight: string;
    recommendation: string;
    raw?: string;
  }>;
  prediction: {
    score: {
      home: number;
      away: number;
      found: boolean;
    };
    confidence?: string;
    reasoning?: string;
    raw?: string;
  };
  my_say: {
    content: string;
  };
}

export interface Analysis {
  fixture_id: string;
  home_team: string;
  away_team: string;
  date: string;
  generated_at: string;
  content: AnalysisContent;
}

// FPL Types
export interface Gameweek {
  id: string;
  number: number;
  name: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  deadline: string;
  content_generated?: boolean;
}

export interface FplPlayer {
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  team: string;
  price: number;
}

export interface FplTeam {
  players: {
    goalkeepers: FplPlayer[];
    defenders: FplPlayer[];
    midfielders: FplPlayer[];
    forwards: FplPlayer[];
  };
  freeTransfers: number;
  budget: number;
  chips: {
    assistantManager: boolean;
    freeHit: boolean;
    wildcard: boolean;
    benchBoost: boolean;
    tripleCaptain: boolean;
  };
}

export interface FplContent {
  gameweekId: string;
  lastUpdated: string;
  overview: string;
  topPicks: {
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    players: Array<{
      name: string;
      team: string;
      reason: string;
      price?: number;
      ownership?: number;
    }>;
  }[];
  differentials: Array<{
    name: string;
    team: string;
    position: string;
    reason: string;
    ownership?: number;
  }>;
  captainPicks: Array<{
    name: string;
    team: string;
    reason: string;
    fixtures?: string;
  }>;
  keyFixtures?: Array<{
    home_team: string;
    away_team: string;
    analysis: string;
  }>;
  chipAdvice?: string;
  teamInsights?: {
    currentTeamAnalysis: string;
    suggestedTransfers: Array<{
      playerOut: string;
      playerIn: string;
      reason: string;
    }>;
    suggestedStartingXI: string;
    captainSuggestion: string;
    chipAdvice?: string;
  };
}

export interface FplAnalysis {
  gameweek_id: string;
  gameweek_number: number;
  generated_at: string;
  content: FplContent;
}
