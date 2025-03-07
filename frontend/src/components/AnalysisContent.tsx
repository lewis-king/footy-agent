import React, { useState } from 'react';
import styled from 'styled-components';
import { Fixture, Analysis } from '../types/fixtures';
import ReactMarkdown from 'react-markdown';
import MarkdownTable from './MarkdownTable';

interface AnalysisContentProps {
  fixture: Fixture;
  analysis: Analysis;
}

const ContentContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 8px var(--shadow-color);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ContentBody = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Headline = styled.h1`
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background-color: var(--secondary-color);
    margin-right: 10px;
    border-radius: 2px;
  }
`;

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const TeamLogo = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 0.8rem;
`;

const TeamName = styled.h3`
  font-size: 1.3rem;
  color: var(--text-color);
`;

const MarkdownContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color);
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    border-bottom: 1px solid #eee;
  }
  
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }
  
  tr:hover {
    background-color: #f0f0f0;
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
    color: #666;
    font-style: italic;
  }
`;

const PredictionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 1.5rem;
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
`;

const PredictionTeamName = styled.h3`
  font-size: 1.3rem;
  color: var(--text-color);
`;

const ScoreBox = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const MatchupVersusText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 1rem;
`;

const ConfidenceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${({ confidence }) => confidence === 'high' ? 'var(--primary-color)' : 'var(--secondary-color)'};
`;

const ConfidenceLabel = styled.span`
  font-size: 1.1rem;
  margin-right: 0.5rem;
`;

const ConfidenceValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

const BettingInsightCard = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--accent-color);
`;

const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const InsightItem = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 3px solid var(--secondary-color);
`;

const InsightCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--primary-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  font-size: 0.8rem;
  color: #666;
  text-align: right;
  margin-top: 2rem;
`;

const MatchupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

const TeamSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TeamLogoLarge = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 0.5rem;
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
  background-color: white;
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
  color: #666;
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
  color: #666;
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
    background-color: #f8f8f8;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const RecommendationCard = styled.div`
  background-color: #f8f8f8;
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
  color: var(--text-color);
`;

const RawContentToggle = styled.button`
  background-color: transparent;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    color: white;
  }
`;

const RawContentContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  border-left: 3px solid var(--secondary-color);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const AnalysisContent: React.FC<AnalysisContentProps> = ({ fixture, analysis }) => {
  // State for toggling raw content visibility
  const [showRawContent, setShowRawContent] = useState({
    overview: false,
    teamNews: false,
    keyPlayerMatchups: false,
    asianHandicap: false,
    bettingInsights: false,
    prediction: false,
    fullPerplexity: false
  });

  // Toggle function for raw content
  const toggleRawContent = (section: keyof typeof showRawContent) => {
    setShowRawContent(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  // Check if team news has structured data
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
        <Section>
          <SectionHeader>
            <SectionTitle>Asian Handicap Analysis</SectionTitle>
            {handicapData.raw && (
              <RawContentToggle 
                onClick={() => toggleRawContent('asianHandicap')}
              >
                {showRawContent.asianHandicap ? 'Hide Details' : 'Show Details'}
              </RawContentToggle>
            )}
          </SectionHeader>
          
          {/* Render table if available */}
          {handicapData.table && (
            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    {handicapData.table.headers.map((header, index) => (
                      <TableHeader key={index}>{header}</TableHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {handicapData.table.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </tbody>
              </StyledTable>
            </TableContainer>
          )}
          
          {/* Render analysis */}
          <MarkdownContent>
            <ReactMarkdown>{handicapData.analysis}</ReactMarkdown>
          </MarkdownContent>
          
          {/* Render recommendation if available */}
          {handicapData.recommendation && (
            <RecommendationCard>
              <RecommendationTitle>Recommendation</RecommendationTitle>
              <RecommendationContent>{handicapData.recommendation}</RecommendationContent>
            </RecommendationCard>
          )}

          {/* Render raw content if available and toggled */}
          {handicapData.raw && showRawContent.asianHandicap && (
            <RawContentContainer>
              <MarkdownContent>
                <strong>Detailed Analysis:</strong>
                <ReactMarkdown>{handicapData.raw}</ReactMarkdown>
              </MarkdownContent>
            </RawContentContainer>
          )}
        </Section>
      );
    }
    
    // Fallback to the old format handling
    // Check if the content contains a markdown table
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
      <Section>
        <SectionHeader>
          <SectionTitle>Asian Handicap Analysis</SectionTitle>
          {otherContent && (
            <RawContentToggle 
              onClick={() => toggleRawContent('asianHandicap')}
            >
              {showRawContent.asianHandicap ? 'Hide Details' : 'Show Details'}
            </RawContentToggle>
          )}
        </SectionHeader>
        {containsTable && <MarkdownTable markdown={tableContent} />}
        <MarkdownContent>
          <ReactMarkdown>{otherContent}</ReactMarkdown>
        </MarkdownContent>
        {otherContent && showRawContent.asianHandicap && (
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{otherContent}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
      </Section>
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
        <Section>
          <SectionHeader>
            <SectionTitle>Key Player Matchups</SectionTitle>
            {matchups.some(m => m.raw) && (
              <RawContentToggle 
                onClick={() => toggleRawContent('keyPlayerMatchups')}
              >
                {showRawContent.keyPlayerMatchups ? 'Hide Details' : 'Show Details'}
              </RawContentToggle>
            )}
          </SectionHeader>
          <InsightGrid>
            {matchups.map((matchup, index) => (
              <InsightCard key={index}>
                <strong>{matchup.title}</strong>
                <MarkdownContent>
                  <ReactMarkdown>{matchup.content}</ReactMarkdown>
                </MarkdownContent>
                {matchup.raw && showRawContent.keyPlayerMatchups && (
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
        </Section>
      );
    }
    
    // Fallback to the old format handling
    // Split the content into individual matchups
    const matchupsText = typeof analysis.content.key_player_matchups === 'string' 
      ? analysis.content.key_player_matchups 
      : '';
      
    const matchups = matchupsText
      .split('\n\n')
      .filter(matchup => matchup.trim().length > 0);
    
    if (matchups.length === 0) {
      return (
        <Section>
          <SectionHeader>
            <SectionTitle>Key Player Matchups</SectionTitle>
            {matchupsText && (
              <RawContentToggle 
                onClick={() => toggleRawContent('keyPlayerMatchups')}
              >
                {showRawContent.keyPlayerMatchups ? 'Hide Details' : 'Show Details'}
              </RawContentToggle>
            )}
          </SectionHeader>
          <MarkdownContent>
            <ReactMarkdown>{matchupsText}</ReactMarkdown>
          </MarkdownContent>
          {matchupsText && showRawContent.keyPlayerMatchups && (
            <RawContentContainer>
              <MarkdownContent>
                <strong>Detailed Analysis:</strong>
                <ReactMarkdown>{matchupsText}</ReactMarkdown>
              </MarkdownContent>
            </RawContentContainer>
          )}
        </Section>
      );
    }
    
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Key Player Matchups</SectionTitle>
          {matchupsText && (
            <RawContentToggle 
              onClick={() => toggleRawContent('keyPlayerMatchups')}
            >
              {showRawContent.keyPlayerMatchups ? 'Hide Details' : 'Show Details'}
            </RawContentToggle>
          )}
        </SectionHeader>
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
                {matchupsText && showRawContent.keyPlayerMatchups && (
                  <RawContentContainer>
                    <MarkdownContent>
                      <strong>Detailed Analysis:</strong>
                      <ReactMarkdown>{matchup}</ReactMarkdown>
                    </MarkdownContent>
                  </RawContentContainer>
                )}
              </InsightCard>
            );
          })}
        </InsightGrid>
      </Section>
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
        <Section>
          <SectionHeader>
            <SectionTitle>Betting Insights</SectionTitle>
            {insights.some(i => i.raw) && (
              <RawContentToggle 
                onClick={() => toggleRawContent('bettingInsights')}
              >
                {showRawContent.bettingInsights ? 'Hide Details' : 'Show Details'}
              </RawContentToggle>
            )}
          </SectionHeader>
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
                {insight.raw && showRawContent.bettingInsights && (
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
        </Section>
      );
    }
    
    // Fallback to the old format
    const bettingInsights = analysis.content.betting_insights as {
      raw: string;
      insights?: string[];
    };
    
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Betting Insights</SectionTitle>
          {bettingInsights.raw && (
            <RawContentToggle 
              onClick={() => toggleRawContent('bettingInsights')}
            >
              {showRawContent.bettingInsights ? 'Hide Details' : 'Show Details'}
            </RawContentToggle>
          )}
        </SectionHeader>
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
        {bettingInsights.raw && showRawContent.bettingInsights && (
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{bettingInsights.raw}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
      </Section>
    );
  };

  const renderPrediction = () => {
    if (!analysis?.content.prediction) return null;
    
    const prediction = analysis.content.prediction;
    const homeTeam = fixture.homeTeam;
    const awayTeam = fixture.awayTeam;
    
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Prediction</SectionTitle>
          {prediction.raw && (
            <RawContentToggle 
              onClick={() => toggleRawContent('prediction')}
            >
              {showRawContent.prediction ? 'Hide Details' : 'Show Details'}
            </RawContentToggle>
          )}
        </SectionHeader>
        
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
        
        {prediction.confidence && (
          <ConfidenceContainer confidence={prediction.confidence.toLowerCase()}>
            <ConfidenceLabel>Confidence:</ConfidenceLabel>
            <ConfidenceValue>{prediction.confidence}</ConfidenceValue>
          </ConfidenceContainer>
        )}
        
        {prediction.rationale && (
          <MarkdownContent>
            <strong>Rationale:</strong>
            <ReactMarkdown>{prediction.rationale}</ReactMarkdown>
          </MarkdownContent>
        )}
        
        {prediction.raw && showRawContent.prediction && (
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{prediction.raw}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
        
        {prediction.raw && !prediction.rationale && !showRawContent.prediction && (
          <MarkdownContent>
            <ReactMarkdown>{prediction.raw}</ReactMarkdown>
          </MarkdownContent>
        )}
      </Section>
    );
  };

  return (
    <ContentContainer>
      <ContentBody>
        <Headline>{fixture.homeTeam.name} vs {fixture.awayTeam.name} Analysis</Headline>
        
        <MatchupContainer>
          <TeamSide>
            <TeamLogoLarge src={fixture.homeTeam.logo} alt={fixture.homeTeam.name} />
            <TeamName>{fixture.homeTeam.name}</TeamName>
          </TeamSide>
          <MatchupVersusText>VS</MatchupVersusText>
          <TeamSide>
            <TeamLogoLarge src={fixture.awayTeam.logo} alt={fixture.awayTeam.name} />
            <TeamName>{fixture.awayTeam.name}</TeamName>
          </TeamSide>
        </MatchupContainer>
        
        <Section>
          <SectionHeader>
            <SectionTitle>Match Overview</SectionTitle>
            <RawContentToggle 
              onClick={() => toggleRawContent('overview')}
            >
              {showRawContent.overview ? 'Hide Details' : 'Show Details'}
            </RawContentToggle>
          </SectionHeader>
          <MarkdownContent>
            <ReactMarkdown>{analysis.content.match_overview}</ReactMarkdown>
          </MarkdownContent>
          {showRawContent.overview && analysis.content.raw_perplexity_content && (
            <RawContentContainer>
              <MarkdownContent>
                <strong>Detailed Analysis:</strong>
                <ReactMarkdown>{analysis.content.raw_perplexity_content}</ReactMarkdown>
              </MarkdownContent>
            </RawContentContainer>
          )}
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionTitle>Team News</SectionTitle>
            <RawContentToggle 
              onClick={() => toggleRawContent('teamNews')}
            >
              {showRawContent.teamNews ? 'Hide Details' : 'Show Details'}
            </RawContentToggle>
          </SectionHeader>
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
          
          {showRawContent.teamNews && analysis.content.team_news.raw && (
            <RawContentContainer>
              <MarkdownContent>
                <strong>Detailed Team News:</strong>
                <ReactMarkdown>{analysis.content.team_news.raw}</ReactMarkdown>
              </MarkdownContent>
            </RawContentContainer>
          )}
        </Section>
        
        {renderKeyPlayerMatchups()}
        {renderAsianHandicapAnalysis()}
        {renderBettingInsights()}
        {renderPrediction()}
        
        {analysis.content.raw_perplexity_content && (
          <Section>
            <SectionHeader>
              <SectionTitle>Full Analysis</SectionTitle>
              <RawContentToggle 
                onClick={() => toggleRawContent('fullPerplexity')}
              >
                {showRawContent.fullPerplexity ? 'Hide Full Analysis' : 'Show Full Analysis'}
              </RawContentToggle>
            </SectionHeader>
            
            {showRawContent.fullPerplexity && (
              <RawContentContainer>
                <MarkdownContent>
                  <ReactMarkdown>{analysis.content.raw_perplexity_content}</ReactMarkdown>
                </MarkdownContent>
              </RawContentContainer>
            )}
          </Section>
        )}
      </ContentBody>
    </ContentContainer>
  );
};

export default AnalysisContent;
