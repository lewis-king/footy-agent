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
    rationale?: string;
    raw?: string;
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
