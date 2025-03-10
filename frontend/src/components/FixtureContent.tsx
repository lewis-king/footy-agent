import React from 'react';
import styled from 'styled-components';
import {
  ContentBody,
  SectionContainer,
  SectionTitle
} from './AnalysisContent';
import TeamNewsSection from './TeamNewsSection';
import PlayerMatchupsSection from './PlayerMatchupsSection';

interface FixtureContentProps {
  fixture: {
    home_team: {
      name?: string;
      logo?: string;
      color?: string;
      form?: string[];
      strengths?: string[];
      weaknesses?: string[];
    };
    away_team: {
      name?: string;
      logo?: string;
      color?: string;
      form?: string[];
      strengths?: string[];
      weaknesses?: string[];
    };
  };
  content: {
    previewHeadline: string;
    previewContent: string;
    teamComparison: {
      homeTeam: {
        form?: string[];
        strengths?: string[];
        weaknesses?: string[];
      };
      awayTeam: {
        form?: string[];
        strengths?: string[];
        weaknesses?: string[];
      };
    };
    keyPlayers: {
      homeTeam: {
        name: string;
        position: string;
        impact: string;
        score: number;
      }[];
      awayTeam: {
        name: string;
        position: string;
        impact: string;
        score: number;
      }[];
    };
    team_news?: {
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
    bettingInsights: BettingInsight[];
    asianHandicap: {
      recommendation: string;
      explanation: string;
    };
    additionalContent: {
      title: string;
      content: string;
    }[];
    lastUpdated: string;
    prediction: {
      score: {
        home: number;
        away: number;
      };
      confidence: number;
      reasoning: string;
    };
  };
}

interface BettingInsight {
  type: 'value' | 'probability';
  title: string;
  description: string;
  confidence: number;
  winProbability: number;
  drawProbability: number;
  lossProbability: number;
}

// Define ContentContainer with team color props
const ContentContainer = styled.div<{ $team1Color: string; $team2Color: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Subtle gradient border using team colors */
  border-top: 3px solid;
  border-image: linear-gradient(to right, ${props => props.$team1Color}, ${props => props.$team2Color}) 1;
`;

const TeamColumn = styled.div<{ $teamColor: string }>`
  background-color: ${props => `${props.$teamColor}08`};
  padding: 1.5rem;
  border-left: 3px solid ${props => props.$teamColor};
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => `${props.$teamColor}12`};
  }
  margin-bottom: 1.5rem;
`;

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const TeamLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const TeamName = styled.h3`
  font-size: 1.25rem;
  color: var(--light-text);
  margin: 0;
`;

const AttributeHeading = styled.h4`
  font-size: 1.1rem;
  margin: 1.25rem 0 0.75rem;
  color: var(--light-text);
`;

const FormContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FormResult = styled.span<{ result: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background-color: ${props => {
    switch (props.result) {
      case 'W': return '#38a169';
      case 'D': return '#f59e0b';
      case 'L': return '#e53e3e';
      default: return '#a0aec0';
    }
  }};
`;

const AttributeList = styled.ul`
  margin: 0;
  padding-left: 1.2rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

const KeyPlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: var(--alt-card-background);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PlayerCard = styled.div`
  padding: 1rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
`;

const PlayerName = styled.h4`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--light-text);

  span {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    background-color: var(--primary-color);
    color: var(--light-text);
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 0.8rem;
  }
`;

const PlayerImpact = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: var(--light-text);
`;

const PlayerImpactVisual = styled.div<{ score: number }>`
  width: ${props => props.score * 40}px;
  height: 8px;
  background: linear-gradient(to right, #ff6b6b, #4ecdc4);
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const BettingInsightsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  background-color: var(--alt-card-background);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.div`
  background: var(--alt-card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(138, 43, 226, 0.2);
  }
`;

const InsightType = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 0.5rem;
`;

const InsightTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: var(--primary-color);
`;

const InsightDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: var(--light-text);
`;

const ConfidenceBar = styled.div<{ confidence: number }>`
  display: flex;
  align-items: center;

  &::before {
    content: 'Confidence:';
    font-size: 0.8rem;
    margin-right: 0.8rem;
    color: #666;
  }

  &::after {
    content: '';
    flex-grow: 1;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: ${props => `${props.confidence}%`};
      background-color: ${props => {
        if (props.confidence >= 80) return '#2cba00';
        if (props.confidence >= 60) return '#9ccc65';
        if (props.confidence >= 40) return '#ffb74d';
        return '#e53935';
      }};
      border-radius: 3px;
    }
  }
`;

const WinProbabilityMeter = styled.div`
  display: flex;
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;
`;

const StyledBar = styled.div<{ width: string; color: string }>`
  height: 8px;
  width: ${props => props.width};
  background: ${props => props.color};
  border-radius: 4px;
  margin: 0 2px;
`;

const HandicapContainer = styled.div`
  background-color: var(--alt-card-background);
  color: var(--light-text);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const HandicapRecommendation = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--primary-color);
`;

const HandicapExplanation = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--light-text);
`;

const AdditionalContentContainer = styled.div`
  margin-top: 3rem;
`;

const AdditionalContentSection = styled.div`
  margin-bottom: 2rem;
  background-color: var(--alt-card-background);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-bottom: 0;
  }
`;

const AdditionalContentTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--accent-color);
`;

const AdditionalContentText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--light-text);
`;

const LastUpdated = styled.div`
  font-size: 0.8rem;
  color: var(--light-text);
  text-align: right;
  margin-top: 2rem;
`;

const PredictionSection = styled.div`
  background: var(--alt-card-background);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const ScoreBadge = styled.div`
  background: #8a2be2;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 1.8rem;
  font-weight: 700;
  display: inline-flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
`;

interface ConfidenceMeterProps {
  confidence: number;
}

const ConfidenceMeter = styled.div<ConfidenceMeterProps>`
  width: 100%;
  height: 8px;
  background-color: rgba(138, 43, 226, 0.2);
  border-radius: 4px;
  overflow: hidden;
  
  > div {
    height: 100%;
    width: ${props => Math.min(Math.max(props.confidence * 10, 0), 100)}%;
    background-color: #8a2be2;
    border-radius: 4px;
  }
`;

const ReasoningText = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  font-size: 1rem;
  margin: 1rem 0;
  white-space: pre-wrap;

  strong {
    color: #8a2be2;
    font-weight: 600;
  }
`;

// Define the Section component locally since it's not exported from AnalysisContent
const Section = styled.section`
  margin-bottom: 2rem;
`;

const Headline = styled.h2`
  color: var(--light-text);
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FixtureContentComponent: React.FC<FixtureContentProps> = ({ fixture, content }) => {
  // Format the last updated date
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get team badge ID based on team name
  const getTeamBadgeId = (teamName: string) => {
    switch (teamName) {
      case 'Arsenal':
        return '3';
      case 'Aston Villa':
        return '7';
      case 'Bournemouth':
        return '97';
      case 'Brentford':
        return '90';
      case 'Brighton & Hove Albion':
        return '36';
      case 'Chelsea':
        return '8';
      case 'Crystal Palace':
        return '31';
      case 'Everton':
        return '12';
      case 'Fulham':
        return '54';
      case 'Leeds United':
        return '2';
      case 'Leicester City':
        return '13';
      case 'Liverpool':
        return '14';
      case 'Manchester City':
        return '43';
      case 'Manchester United':
        return '1';
      case 'Newcastle United':
        return '23';
      case 'Nottingham Forest':
        return '65';
      case 'Southampton':
        return '20';
      case 'Tottenham Hotspur':
        return '6';
      case 'West Ham United':
        return '21';
      case 'Wolverhampton Wanderers':
        return '39';
      default:
        return '0';
    }
  };

  // Sample team news data - in a real app, this would come from the API
  const teamNewsData = {
    homeTeam: {
      teamName: fixture.home_team?.name || 'Home Team',
      teamLogo: `https://resources.premierleague.com/premierleague/badges/t${getTeamBadgeId(fixture.home_team?.name || '')}.svg`,
      teamColor: fixture.home_team?.color || '#8a2be2',
      injuries: content.team_news?.structured.home.injuries || [
        'Saka (Ankle knock)',
        'Rice (Hamstring strain)',
        'Odegaard (Knee injury)'
      ],
      suspensions: content.team_news?.structured.home.suspensions || [],
      returnees: content.team_news?.structured.home.returnees || ['Wood'],
      projectedXI: content.team_news?.structured.home.projected_xi
    },
    awayTeam: {
      teamName: fixture.away_team?.name || 'Away Team',
      teamLogo: `https://resources.premierleague.com/premierleague/badges/t${getTeamBadgeId(fixture.away_team?.name || '')}.svg`,
      teamColor: fixture.away_team?.color || '#8a2be2',
      injuries: content.team_news?.structured.away.injuries || [
        'Kevin De Bruyne (Hamstring)',
        'John Stones (Calf strain)',
        'Nathan Aké (Foot)',
        'Rodri (Knee)',
        'Oscar Bobb (Leg)'
      ],
      suspensions: content.team_news?.structured.away.suspensions || [],
      returnees: content.team_news?.structured.away.returnees || [
        'Doku (Fit)',
        'Grealish'
      ],
      projectedXI: content.team_news?.structured.away.projected_xi
    }
  };

  // Sample player matchups data - in a real app, this would come from the API
  const playerMatchups = [
    {
      player1: {
        name: 'Wood',
        team: fixture.home_team?.name || 'Home Team',
        teamColor: fixture.home_team?.color || '#8a2be2'
      },
      player2: {
        name: 'Dias',
        team: fixture.away_team?.name || 'Away Team',
        teamColor: fixture.away_team?.color || '#8a2be2'
      },
      analysis: "Wood's aerial dominance (4.1 duels won/game) tests Dias' declining success rate (58% in 2025). Forest's cross-heavy approach (21.2/game home) targets City's vulnerability."
    },
    {
      player1: {
        name: 'Doku',
        team: fixture.away_team?.name || 'Away Team',
        teamColor: fixture.away_team?.color || '#8a2be2'
      },
      player2: {
        name: 'Tavares',
        team: fixture.home_team?.name || 'Home Team',
        teamColor: fixture.home_team?.color || '#8a2be2'
      },
      analysis: "Doku's league-best 7.3 dribbles/game meets Tavares' 63% tackle success. Forest likely double-team with Danilo, risking space for De Bruyne's late runs."
    }
  ];

  return (
    <ContentContainer
      $team1Color={fixture.home_team?.color || '#8a2be2'}
      $team2Color={fixture.away_team?.color || '#8a2be2'}
      role="article"
      aria-label={`Match analysis for ${fixture.home_team?.name} vs ${fixture.away_team?.name}`}
    >
      <ContentBody>
        <Headline>{content.previewHeadline}</Headline>
        
        {/* Match Overview Section with The Final Word integrated */}
        <Section>
          <SectionTitle>Match Overview</SectionTitle>
          <SectionContainer>
            <div style={{ 
              backgroundColor: 'var(--alt-card-background)', 
              padding: '1.5rem', 
              borderRadius: '8px',
              color: 'var(--light-text)',
              marginBottom: '1.5rem'
            }}>
              <p style={{ 
                marginBottom: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>{content.previewContent}</p>
              
              {/* The Final Word subsection if it exists */}
              {content.additionalContent && content.additionalContent.find(section => section.title === "The Final Word") && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1rem', 
                    borderTop: '1px solid rgba(138, 43, 226, 0.3)', 
                    paddingTop: '1.5rem'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a2be2" strokeWidth="2" style={{ marginRight: '0.75rem' }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <h3 style={{ 
                      color: '#8a2be2', 
                      margin: 0, 
                      fontSize: '1.25rem', 
                      fontWeight: 600 
                    }}>The Final Word</h3>
                  </div>
                  <div style={{ 
                    borderLeft: '4px solid #8a2be2',
                    paddingLeft: '1rem',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'var(--light-text)'
                  }}>
                    {content.additionalContent.find(section => section.title === "The Final Word")?.content}
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>Team News</SectionTitle>
          <SectionContainer>
            <TeamNewsSection
              title="Team News"
              homeTeam={teamNewsData.homeTeam}
              awayTeam={teamNewsData.awayTeam}
            />
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>Team Comparison</SectionTitle>
          <SectionContainer>
            <div>
              <TeamColumn $teamColor={fixture.home_team?.color || '#8a2be2'}>
                <TeamHeader>
                  <TeamLogo
                    src={`https://resources.premierleague.com/premierleague/badges/${getTeamBadgeId(fixture.home_team?.name || '')}.svg`}
                    alt={fixture.home_team?.name}
                  />
                  <TeamName>{fixture.home_team?.name}</TeamName>
                </TeamHeader>

                <AttributeHeading>Form (Last 5)</AttributeHeading>
                <FormContainer>
                  {content.teamComparison.homeTeam.form?.map((result, index) => (
                    <FormResult key={index} result={result}>{result}</FormResult>
                  ))}
                </FormContainer>

                <AttributeHeading>Strengths</AttributeHeading>
                <AttributeList>
                  {content.teamComparison.homeTeam.strengths?.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </AttributeList>

                <AttributeHeading>Weaknesses</AttributeHeading>
                <AttributeList>
                  {content.teamComparison.homeTeam.weaknesses?.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </AttributeList>
              </TeamColumn>

              <TeamColumn $teamColor={fixture.away_team?.color || '#8a2be2'}>
                <TeamHeader>
                  <TeamLogo
                    src={`https://resources.premierleague.com/premierleague/badges/${getTeamBadgeId(fixture.away_team?.name || '')}.svg`}
                    alt={fixture.away_team?.name}
                  />
                  <TeamName>{fixture.away_team?.name}</TeamName>
                </TeamHeader>

                <AttributeHeading>Form (Last 5)</AttributeHeading>
                <FormContainer>
                  {content.teamComparison.awayTeam.form?.map((result, index) => (
                    <FormResult key={index} result={result}>{result}</FormResult>
                  ))}
                </FormContainer>

                <AttributeHeading>Strengths</AttributeHeading>
                <AttributeList>
                  {content.teamComparison.awayTeam.strengths?.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </AttributeList>

                <AttributeHeading>Weaknesses</AttributeHeading>
                <AttributeList>
                  {content.teamComparison.awayTeam.weaknesses?.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </AttributeList>
              </TeamColumn>
            </div>
          </SectionContainer>
        </Section>

        {/* Player Matchups Section */}
        <Section>
          <SectionTitle>Key Player Matchups</SectionTitle>
          <SectionContainer>
            <PlayerMatchupsSection
              title="Key Player Matchups"
              matchups={playerMatchups}
            />
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>Key Players to Watch</SectionTitle>
          <SectionContainer>
            <KeyPlayersContainer>
              <div>
                <h3>{fixture.home_team?.name}</h3>
                {content.keyPlayers.homeTeam.map((player, index) => (
                  <PlayerCard key={index}>
                    <PlayerName>
                      {player.name}
                      <span>{player.position}</span>
                    </PlayerName>
                    <PlayerImpact>{player.impact}</PlayerImpact>
                    <PlayerImpactVisual score={player.score} />
                  </PlayerCard>
                ))}
              </div>

              <div>
                <h3>{fixture.away_team?.name}</h3>
                {content.keyPlayers.awayTeam.map((player, index) => (
                  <PlayerCard key={index}>
                    <PlayerName>
                      {player.name}
                      <span>{player.position}</span>
                    </PlayerName>
                    <PlayerImpact>{player.impact}</PlayerImpact>
                    <PlayerImpactVisual score={player.score} />
                  </PlayerCard>
                ))}
              </div>
            </KeyPlayersContainer>
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>Betting Insights</SectionTitle>
          <SectionContainer>
            <BettingInsightsContainer>
              {content.bettingInsights.map((insight, index) => (
                <InsightCard key={index}>
                  <InsightType>{insight.type}</InsightType>
                  <InsightTitle>{insight.title}</InsightTitle>
                  <InsightDescription>{insight.description}</InsightDescription>
                  <ConfidenceBar confidence={insight.confidence} />
                  <WinProbabilityMeter>
                    <StyledBar width={`${insight.winProbability}%`} color="#2cba00" />
                    <StyledBar width={`${insight.drawProbability}%`} color="#ffa500" />
                    <StyledBar width={`${insight.lossProbability}%`} color="#e53935" />
                  </WinProbabilityMeter>
                </InsightCard>
              ))}
            </BettingInsightsContainer>
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>Asian Handicap Analysis</SectionTitle>
          <SectionContainer>
            <HandicapContainer>
              <HandicapRecommendation>
                Recommendation: {content.asianHandicap.recommendation}
              </HandicapRecommendation>
              <HandicapExplanation>
                {content.asianHandicap.explanation}
              </HandicapExplanation>
            </HandicapContainer>
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>AI Match Prediction</SectionTitle>
          <SectionContainer>
            <PredictionSection>
              <h3 style={{ color: '#8a2be2', marginBottom: '1rem' }}>AI Match Prediction</h3>
              <ScoreBadge>
                <span>{content.prediction.score.away}</span>
                <span>-</span>
                <span>{content.prediction.score.home}</span>
              </ScoreBadge>
              
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Confidence Level:</span>
                  <span style={{ color: '#8a2be2', fontWeight: '600' }}>{content.prediction.confidence}/10</span>
                </div>
                <ConfidenceMeter confidence={content.prediction.confidence}>
                  <div />
                </ConfidenceMeter>
              </div>

              <h4 style={{ color: '#8a2be2', margin: '1rem 0' }}>Key Reasoning</h4>
              <ReasoningText>
                {content.prediction.reasoning.replace(/(\d+\+)/g, '**$1**').replace(/(\[\d+\])/g, '<strong>$1</strong>')}
              </ReasoningText>
            </PredictionSection>
          </SectionContainer>
        </Section>

        <Section>
          <SectionTitle>Additional Analysis</SectionTitle>
          <SectionContainer>
            <AdditionalContentContainer>
              {content.additionalContent
                .filter(section => section.title !== "The Final Word") // Filter out "The Final Word" since we're displaying it earlier
                .map((section, index) => (
                <AdditionalContentSection key={index}>
                  <AdditionalContentTitle>{section.title}</AdditionalContentTitle>
                  <AdditionalContentText>{section.content}</AdditionalContentText>
                </AdditionalContentSection>
              ))}
            </AdditionalContentContainer>
          </SectionContainer>
        </Section>

        <LastUpdated>
          Last updated: {formatLastUpdated(content.lastUpdated)}
        </LastUpdated>
      </ContentBody>
    </ContentContainer>
  );
};

export default FixtureContentComponent;
