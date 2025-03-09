import React from 'react';
import styled from 'styled-components';
import { Fixture, Analysis } from '../types/fixtures';
import ReactMarkdown from 'react-markdown';
import MarkdownTable from './MarkdownTable';

interface AnalysisContentProps {
  fixture: Fixture;
  analysis: Analysis;
}

interface ContentContainerProps {
  $team1Color?: string;
  $team2Color?: string;
}

export const ContentContainer = styled.div<ContentContainerProps>`
  background: linear-gradient(
    to bottom right,
    ${props => (props.$team1Color || '#8a2be2')}0A,
    ${props => (props.$team2Color || '#8a2be2')}0A
  );
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const ContentBody = styled.div`
  padding: 2rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const SectionContainer = styled.div`
  background: var(--alt-card-background);
  border-radius: var(--card-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px var(--shadow-color);
`;

export const SectionTitle = styled.h3`
  color: var(--accent-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InsightCard = styled.div`
  background: var(--card-background);
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  border-left: 4px solid var(--accent-color);
`;

export const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const TeamLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

export const TeamName = styled.h3`
  font-size: 1.3rem;
  color: var(--light-text);
`;

export const MarkdownContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--light-text);
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  th {
    background-color: var(--primary-color);
    color: white;
    padding: 0.8rem 1rem;
    text-align: left;
    font-weight: 600;
  }
  
  td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--light-text);
  }
  
  tr:nth-child(even) {
    background-color: var(--alt-card-background);
  }
  
  tr:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  tr:hover {
    background-color: rgba(138, 43, 226, 0.1);
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  strong {
    font-weight: 600;
    color: var(--primary-color);
  }
  
  h1, h2, h3, h4 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  blockquote {
    border-left: 4px solid var(--secondary-color);
    padding-left: 1rem;
    margin-left: 0;
    color: var(--light-text);
    font-style: italic;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 0 4px 4px 0;
  }
`;

const PredictionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
`;

const TeamScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PredictionTeamLogo = styled.img`
  width: 36px;
  height: 36px;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const PredictionTeamName = styled.h3`
  font-size: 1.3rem;
  color: var(--light-text);
`;

const ScoreBox = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--light-text);
`;

const MatchupVersusText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 1rem;
  color: var(--light-text);
`;

const BettingInsightCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--accent-color);
`;

const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const InsightItem = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 3px solid var(--secondary-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-left: 3px solid var(--primary-color);
  }
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ValueTag = styled.span`
  display: inline-block;
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LastUpdated = styled.div`
  font-size: 0.9rem;
  color: var(--light-text);
  opacity: 0.7;
  margin-top: 0.5rem;
  text-align: right;
  font-style: italic;
`;

const TeamLogosContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  margin: '1rem 0',
  '& img': {
    height: '60px',
    width: '60px',
    objectFit: 'contain'
  }
});

const TeamLogoLarge = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const TeamNewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamNewsCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TeamNewsTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TeamNewsSection = styled.div`
  margin-bottom: 1rem;
`;

const TeamNewsSectionTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--light-text);
  font-weight: 600;
`;

const TeamNewsList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
`;

const TeamNewsItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const EmptyMessage = styled.div`
  color: var(--light-text);
  opacity: 0.7;
  font-style: italic;
  font-size: 0.95rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--alt-card-background);
  }
  
  &:hover {
    background-color: rgba(138, 43, 226, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
`;

const RecommendationCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-color);
`;

const RecommendationTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const RecommendationContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--light-text);
`;

const RawContentContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  border-left: 3px solid var(--secondary-color);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const PredictionSection = styled.div`
  background: var(--alt-card-background);
  border-radius: 12px;
  padding: 2rem;
  margin: 3rem 0;
  border: 2px solid rgba(138, 43, 226, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(138, 43, 226, 0.1) 0%,
      rgba(138, 43, 226, 0.05) 50%,
      rgba(138, 43, 226, 0.1) 100%
    );
    animation: rotate 20s linear infinite;
    z-index: 0;
  }
`;

const PredictionContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ScoreBadge = styled.div`
  background: #8a2be2;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 24px;
  font-size: 2.2rem;
  font-weight: 700;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin: 1rem auto 2rem;
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
  justify-content: center;
  width: fit-content;
`;

const ReasoningText = styled.div`
  color: var(--light-text);
  line-height: 1.7;
  font-size: 1.1rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border-left: 4px solid #8a2be2;

  strong {
    color: #8a2be2;
    font-weight: 600;
  }
`;

const AnalysisContent: React.FC<AnalysisContentProps> = ({ fixture, analysis }) => {
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

  const hasStructuredTeamNews = (
    analysis.content.team_news.structured.home.injuries.length > 0 ||
    analysis.content.team_news.structured.home.suspensions.length > 0 ||
    analysis.content.team_news.structured.home.returnees.length > 0 ||
    analysis.content.team_news.structured.away.injuries.length > 0 ||
    analysis.content.team_news.structured.away.suspensions.length > 0 ||
    analysis.content.team_news.structured.away.returnees.length > 0
  );

  const renderAsianHandicapAnalysis = () => {
    if (!analysis?.content.asian_handicap_analysis) return null;
    
    // Check if we have the new structured format
    const isStructured = typeof analysis.content.asian_handicap_analysis === 'object';
    
    if (isStructured) {
      const handicapData = analysis.content.asian_handicap_analysis as {
        table?: { headers: string[]; rows: string[][] };
        analysis: string;
        recommendation?: string;
        raw?: string;
      };
      
      return (
        <SectionContainer>
          <SectionTitle>Asian Handicap Analysis</SectionTitle>
          <StyledTable>
            <thead>
              <tr>
                {handicapData.table?.headers.map((header, index) => (
                  <TableHeader key={index}>{header}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {handicapData.table?.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
          <p>{handicapData.analysis}</p>
          {handicapData.recommendation && (
            <RecommendationCard>
              <RecommendationTitle>Recommendation</RecommendationTitle>
              <RecommendationContent>{handicapData.recommendation}</RecommendationContent>
            </RecommendationCard>
          )}
          {handicapData.raw && (
            <RawContentContainer>
              <MarkdownContent>
                <strong>Detailed Analysis:</strong>
                <ReactMarkdown>{handicapData.raw}</ReactMarkdown>
              </MarkdownContent>
            </RawContentContainer>
          )}
        </SectionContainer>
      );
    }
    
    // Fallback to the old format handling
    const containsTable = typeof analysis.content.asian_handicap_analysis === 'string' && 
                          analysis.content.asian_handicap_analysis.includes('|') && 
                          analysis.content.asian_handicap_analysis.includes('-|-');
    
    // Extract table from content if it exists
    let tableContent = '';
    let otherContent = typeof analysis.content.asian_handicap_analysis === 'string' 
      ? analysis.content.asian_handicap_analysis 
      : '';
    
    if (containsTable) {
      const lines = otherContent.split('\n');
      const tableLines = [];
      let inTable = false;
      let tableEndIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('|') && !inTable) {
          inTable = true;
          tableLines.push(line);
        } else if (inTable && (line.includes('|') || line.trim() === '')) {
          tableLines.push(line);
        } else if (inTable) {
          inTable = false;
          tableEndIndex = i;
          break;
        }
      }
      
      if (tableLines.length > 0) {
        tableContent = tableLines.join('\n');
        
        if (tableEndIndex > 0) {
          otherContent = lines.slice(tableEndIndex).join('\n');
        }
      }
    }
    
    return (
      <SectionContainer>
        <SectionTitle>Asian Handicap Analysis</SectionTitle>
        {containsTable && <MarkdownTable markdown={tableContent} />}
        <p>{otherContent}</p>
        <RawContentContainer>
          <MarkdownContent>
            <strong>Detailed Analysis:</strong>
            <ReactMarkdown>{otherContent}</ReactMarkdown>
          </MarkdownContent>
        </RawContentContainer>
      </SectionContainer>
    );
  };

  const renderKeyPlayerMatchups = () => {
    if (!analysis?.content.key_player_matchups) return null;
    
    // Check if we have the new structured format (array of objects)
    const isStructuredArray = Array.isArray(analysis.content.key_player_matchups) && 
                             typeof analysis.content.key_player_matchups[0] === 'object';
    
    if (isStructuredArray) {
      const matchups = analysis.content.key_player_matchups as Array<{
        title: string;
        content: string;
        raw?: string;
      }>;
      
      return (
        <SectionContainer>
          <SectionTitle>Key Player Matchups</SectionTitle>
          <InsightGrid>
            {matchups.map((matchup, index) => (
              <InsightCard key={index}>
                <strong>{matchup.title}</strong>
                <MarkdownContent>
                  <ReactMarkdown>{matchup.content}</ReactMarkdown>
                </MarkdownContent>
                {matchup.raw && (
                  <RawContentContainer>
                    <MarkdownContent>
                      <strong>Detailed Analysis:</strong>
                      <ReactMarkdown>{matchup.raw}</ReactMarkdown>
                    </MarkdownContent>
                  </RawContentContainer>
                )}
              </InsightCard>
            ))}
          </InsightGrid>
        </SectionContainer>
      );
    }
    
    // Fallback to the old format handling
    const matchupsText = typeof analysis.content.key_player_matchups === 'string' 
      ? analysis.content.key_player_matchups 
      : '';
      
    const matchups = matchupsText
      .split('\n\n')
      .filter(matchup => matchup.trim().length > 0);
    
    if (matchups.length === 0) {
      return (
        <SectionContainer>
          <SectionTitle>Key Player Matchups</SectionTitle>
          <p>{matchupsText}</p>
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{matchupsText}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        </SectionContainer>
      );
    }
    
    return (
      <SectionContainer>
        <SectionTitle>Key Player Matchups</SectionTitle>
        <InsightGrid>
          {matchups.map((matchup, index) => {
            // Try to extract player names from the matchup
            const playerNameMatch = matchup.match(/^([^:]+)/);
            const playerName = playerNameMatch ? playerNameMatch[1].trim() : `Matchup ${index + 1}`;
            
            return (
              <InsightCard key={index}>
                <strong>{playerName}</strong>
                <MarkdownContent>
                  <ReactMarkdown>{matchup}</ReactMarkdown>
                </MarkdownContent>
                <RawContentContainer>
                  <MarkdownContent>
                    <strong>Detailed Analysis:</strong>
                    <ReactMarkdown>{matchup}</ReactMarkdown>
                  </MarkdownContent>
                </RawContentContainer>
              </InsightCard>
            );
          })}
        </InsightGrid>
      </SectionContainer>
    );
  };

  const renderBettingInsights = () => {
    if (!analysis?.content.betting_insights) return null;
    
    // Check if we have the new structured format (array of objects)
    const isStructuredArray = Array.isArray(analysis.content.betting_insights);
    
    if (isStructuredArray) {
      const insights = analysis.content.betting_insights as Array<{
        market: string;
        insight: string;
        recommendation: string;
        raw?: string;
      }>;
      
      return (
        <SectionContainer>
          <SectionTitle>Betting Insights</SectionTitle>
          <InsightGrid>
            {insights.map((insight, index) => (
              <InsightCard key={index}>
                <strong>{insight.market}</strong>
                <MarkdownContent>
                  <ReactMarkdown>{insight.insight}</ReactMarkdown>
                </MarkdownContent>
                {insight.recommendation && (
                  <ValueTag>{insight.recommendation}</ValueTag>
                )}
                {insight.raw && (
                  <RawContentContainer>
                    <MarkdownContent>
                      <strong>Detailed Analysis:</strong>
                      <ReactMarkdown>{insight.raw}</ReactMarkdown>
                    </MarkdownContent>
                  </RawContentContainer>
                )}
              </InsightCard>
            ))}
          </InsightGrid>
        </SectionContainer>
      );
    }
    
    // Fallback to the old format
    const bettingInsights = analysis.content.betting_insights as {
      raw: string;
      insights?: string[];
    };
    
    return (
      <SectionContainer>
        <SectionTitle>Betting Insights</SectionTitle>
        {bettingInsights.insights && bettingInsights.insights.length > 0 ? (
          <InsightGrid>
            {bettingInsights.insights.map((insight, index) => (
              <InsightCard key={index}>
                {insight}
              </InsightCard>
            ))}
          </InsightGrid>
        ) : (
          <BettingInsightCard>
            <MarkdownContent>
              <ReactMarkdown>{bettingInsights.raw}</ReactMarkdown>
            </MarkdownContent>
          </BettingInsightCard>
        )}
        <RawContentContainer>
          <MarkdownContent>
            <strong>Detailed Analysis:</strong>
            <ReactMarkdown>{bettingInsights.raw}</ReactMarkdown>
          </MarkdownContent>
        </RawContentContainer>
      </SectionContainer>
    );
  };

  const renderPrediction = () => {
    if (!analysis?.content.prediction) return null;
    
    const prediction = analysis.content.prediction;
    const homeTeam = fixture.homeTeam;
    const awayTeam = fixture.awayTeam;
    
    return (
      <SectionContainer>
        <SectionTitle>Prediction</SectionTitle>
        {prediction.score.found && (
          <PredictionContainer>
            <TeamScoreContainer>
              <PredictionTeamLogo src={homeTeam.logo} alt={homeTeam.name} />
              <PredictionTeamName>{homeTeam.name}</PredictionTeamName>
              <ScoreBox>{prediction.score.home}</ScoreBox>
            </TeamScoreContainer>
            
            <MatchupVersusText>vs</MatchupVersusText>
            
            <TeamScoreContainer>
              <PredictionTeamLogo src={awayTeam.logo} alt={awayTeam.name} />
              <PredictionTeamName>{awayTeam.name}</PredictionTeamName>
              <ScoreBox>{prediction.score.away}</ScoreBox>
            </TeamScoreContainer>
          </PredictionContainer>
        )}
        
        {prediction.rationale && (
          <MarkdownContent>
            <strong>Rationale:</strong>
            <ReactMarkdown>{prediction.rationale}</ReactMarkdown>
          </MarkdownContent>
        )}
        
        {prediction.raw && (
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{prediction.raw}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
        
        {prediction.raw && !prediction.rationale && (
          <MarkdownContent>
            <ReactMarkdown>{prediction.raw}</ReactMarkdown>
          </MarkdownContent>
        )}
      </SectionContainer>
    );
  };

  const renderPremiumPrediction = () => {
    if (!analysis?.content?.prediction) return null;
    
    const { prediction } = analysis.content;
    if (!prediction?.score) return null;

    return (
      <PredictionSection>
        <PredictionContent>
          <h2 style={{ 
            color: '#8a2be2', 
            marginBottom: '1.5rem',
            fontSize: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            AI Match Prediction
          </h2>
          
          <ScoreBadge>
            <span style={{ fontWeight: 500, fontSize: '1.4rem' }}>
              {fixture.homeTeam?.name || 'Home Team'}
            </span>
            <span>{prediction.score.home}</span>
            <span>-</span>
            <span>{prediction.score.away}</span>
            <span style={{ fontWeight: 500, fontSize: '1.4rem' }}>
              {fixture.awayTeam?.name || 'Away Team'}
            </span>
          </ScoreBadge>

          <ReasoningText>
            {prediction.reasoning
              .replace(/(\d+%?\+?)/g, '**$1**')
              .replace(/(\[\d+\])/g, '<strong>$1</strong>')}
          </ReasoningText>
        </PredictionContent>
      </PredictionSection>
    );
  };

  // Helper function to convert numeric confidence to string level
  const getConfidenceLevel = (confidence: number | string): string => {
    if (typeof confidence === 'string') {
      return confidence.toLowerCase();
    }
    
    // Convert numeric confidence to level
    const numConfidence = Number(confidence);
    if (numConfidence >= 8) return 'high';
    if (numConfidence >= 5) return 'medium';
    return 'low';
  };

  return (
    <ContentContainer>
      <ContentBody>
        <TeamLogosContainer>
          <TeamLogoLarge src={fixture.homeTeam.logo} alt={fixture.homeTeam.name} />
          <MatchupVersusText>VS</MatchupVersusText>
          <TeamLogoLarge src={fixture.awayTeam.logo} alt={fixture.awayTeam.name} />
        </TeamLogosContainer>
        
        <SectionContainer>
          <SectionTitle>Match Overview</SectionTitle>
          <p>{analysis.content.match_overview}</p>
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{analysis.content.raw_perplexity_content}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        </SectionContainer>
        
        <SectionContainer>
          <SectionTitle>Team News</SectionTitle>
          {hasStructuredTeamNews ? (
            <TeamNewsGrid>
              <TeamNewsCard>
                <TeamNewsTitle>
                  <TeamLogo src={fixture.homeTeam.logo} alt={fixture.homeTeam.name} />
                  {fixture.homeTeam.name}
                </TeamNewsTitle>
                
                <TeamNewsSection>
                  <TeamNewsSectionTitle>Injuries</TeamNewsSectionTitle>
                  {analysis.content.team_news.structured.home.injuries.length > 0 ? (
                    <TeamNewsList>
                      {analysis.content.team_news.structured.home.injuries.map((injury, index) => (
                        <TeamNewsItem key={index}>{injury}</TeamNewsItem>
                      ))}
                    </TeamNewsList>
                  ) : (
                    <EmptyMessage>No injuries reported</EmptyMessage>
                  )}
                </TeamNewsSection>
                
                <TeamNewsSection>
                  <TeamNewsSectionTitle>Suspensions</TeamNewsSectionTitle>
                  {analysis.content.team_news.structured.home.suspensions.length > 0 ? (
                    <TeamNewsList>
                      {analysis.content.team_news.structured.home.suspensions.map((suspension, index) => (
                        <TeamNewsItem key={index}>{suspension}</TeamNewsItem>
                      ))}
                    </TeamNewsList>
                  ) : (
                    <EmptyMessage>No suspensions reported</EmptyMessage>
                  )}
                </TeamNewsSection>
                
                <TeamNewsSection>
                  <TeamNewsSectionTitle>Returnees</TeamNewsSectionTitle>
                  {analysis.content.team_news.structured.home.returnees.length > 0 ? (
                    <TeamNewsList>
                      {analysis.content.team_news.structured.home.returnees.map((returnee, index) => (
                        <TeamNewsItem key={index}>{returnee}</TeamNewsItem>
                      ))}
                    </TeamNewsList>
                  ) : (
                    <EmptyMessage>No returning players reported</EmptyMessage>
                  )}
                </TeamNewsSection>
              </TeamNewsCard>
              
              <TeamNewsCard>
                <TeamNewsTitle>
                  <TeamLogo src={fixture.awayTeam.logo} alt={fixture.awayTeam.name} />
                  {fixture.awayTeam.name}
                </TeamNewsTitle>
                
                <TeamNewsSection>
                  <TeamNewsSectionTitle>Injuries</TeamNewsSectionTitle>
                  {analysis.content.team_news.structured.away.injuries.length > 0 ? (
                    <TeamNewsList>
                      {analysis.content.team_news.structured.away.injuries.map((injury, index) => (
                        <TeamNewsItem key={index}>{injury}</TeamNewsItem>
                      ))}
                    </TeamNewsList>
                  ) : (
                    <EmptyMessage>No injuries reported</EmptyMessage>
                  )}
                </TeamNewsSection>
                
                <TeamNewsSection>
                  <TeamNewsSectionTitle>Suspensions</TeamNewsSectionTitle>
                  {analysis.content.team_news.structured.away.suspensions.length > 0 ? (
                    <TeamNewsList>
                      {analysis.content.team_news.structured.away.suspensions.map((suspension, index) => (
                        <TeamNewsItem key={index}>{suspension}</TeamNewsItem>
                      ))}
                    </TeamNewsList>
                  ) : (
                    <EmptyMessage>No suspensions reported</EmptyMessage>
                  )}
                </TeamNewsSection>
                
                <TeamNewsSection>
                  <TeamNewsSectionTitle>Returnees</TeamNewsSectionTitle>
                  {analysis.content.team_news.structured.away.returnees.length > 0 ? (
                    <TeamNewsList>
                      {analysis.content.team_news.structured.away.returnees.map((returnee, index) => (
                        <TeamNewsItem key={index}>{returnee}</TeamNewsItem>
                      ))}
                    </TeamNewsList>
                  ) : (
                    <EmptyMessage>No returning players reported</EmptyMessage>
                  )}
                </TeamNewsSection>
              </TeamNewsCard>
            </TeamNewsGrid>
          ) : (
            <MarkdownContent>
              <ReactMarkdown>{analysis.content.team_news.raw}</ReactMarkdown>
            </MarkdownContent>
          )}
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Team News:</strong>
              <ReactMarkdown>{analysis.content.team_news.raw}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        </SectionContainer>
        
        {renderKeyPlayerMatchups()}
        {renderAsianHandicapAnalysis()}
        {renderBettingInsights()}
        {renderPremiumPrediction()}
        
        <SectionContainer>
          <SectionTitle>Full Analysis</SectionTitle>
          <RawContentContainer>
            <MarkdownContent>
              <ReactMarkdown>{analysis.content.raw_perplexity_content}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        </SectionContainer>
      </ContentBody>
    </ContentContainer>
  );
};

export default AnalysisContent;
