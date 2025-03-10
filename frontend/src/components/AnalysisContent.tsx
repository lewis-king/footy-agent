import React from 'react';
import styled from 'styled-components';
import { Analysis } from '../types/fixtures';
import ReactMarkdown from 'react-markdown';

interface AnalysisContentProps {
  analysis: Analysis;
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const ContentBody = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionContainer = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: var(--light-text);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  color: var(--light-text);
  
  th, td {
    padding: 0.75rem;
    border: 1px solid rgba(138, 43, 226, 0.3);
    text-align: left;
  }
  
  th {
    background-color: rgba(138, 43, 226, 0.2);
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: rgba(138, 43, 226, 0.05);
  }
`;

const TableHeader = styled.th`
  background-color: rgba(138, 43, 226, 0.2);
  color: var(--light-text);
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(138, 43, 226, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border: 1px solid rgba(138, 43, 226, 0.3);
  color: var(--light-text);
`;

const RecommendationCard = styled.div`
  background-color: rgba(138, 43, 226, 0.1);
  border-left: 4px solid #8a2be2;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
`;

const RecommendationTitle = styled.h4`
  color: #8a2be2;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const RecommendationContent = styled.p`
  color: var(--light-text);
  margin: 0;
  font-weight: 500;
`;

const RawContentContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 1rem;
`;

const MarkdownContent = styled.div`
  color: var(--light-text);
  line-height: 1.6;
  font-size: 1rem;
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  strong {
    color: #8a2be2;
  }
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const TeamBadge = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0.5rem;
`;

const TeamName = styled.h3`
  color: var(--light-text);
  font-size: 1.2rem;
  text-align: center;
`;

const VersusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
`;

const VersusText = styled.span`
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.4rem;
`;

const MatchDate = styled.span`
  color: var(--light-text);
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const PredictionSection = styled.div`
  margin-bottom: 2rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  overflow: hidden;
`;

const ScorePredictionContent = styled.div`
  padding: 1.5rem;
  color: var(--light-text);
`;

const PredictionHeader = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: inherit;
  font-weight: 600;
`;

const ScoreBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(138, 43, 226, 0.15);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  gap: 0.75rem;
  
  span:nth-child(2), span:nth-child(4) {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  
  span:nth-child(3) {
    font-size: 1.6rem;
    opacity: 0.7;
  }
`;

const ReasoningText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--light-text);
  
  p {
    margin-bottom: 1rem;
  }
  
  strong {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const PredictionTeamName = styled.span`
  font-weight: 500;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  text-align: center;
  padding: 0 0.5rem;
  
  @media (min-width: 768px) {
    max-width: 200px;
  }
`;

const PredictionCard = styled.div`
  background-color: rgba(138, 43, 226, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(138, 43, 226, 0.3);
`;

const PredictionIcon = styled.div`
  margin-right: 0.75rem;
  color: var(--primary-color);
`;

const PredictionTitle = styled.h3`
  color: var(--primary-color);
  margin: 0;
  font-size: 1.2rem;
`;

const TextPredictionContent = styled.div`
  color: var(--light-text);
  line-height: 1.6;
  font-size: 1rem;
`;

const SourcesContainer = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(138, 43, 226, 0.3);
  font-size: 1rem;
  color: var(--light-text);
  opacity: 0.8;
`;

const SourcesTitle = styled.h4`
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const SourcesList = styled.ol`
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  color: var(--light-text);
`;

const SourceItem = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
`;

const TeamNewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const TeamNewsCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TeamNewsTitle = styled.h3`
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
`;

const TeamLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
`;

const TeamNewsSection = styled.div`
  margin-bottom: 1.25rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const TeamNewsSectionTitle = styled.h4`
  color: var(--primary-color);
  font-size: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

const TeamNewsList = styled.ul`
  list-style-type: none;
  padding-left: 0.5rem;
  margin: 0;
`;

const TeamNewsItem = styled.li`
  color: var(--light-text);
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  
  &:before {
    content: "•";
    color: var(--primary-color);
    position: absolute;
    left: 0;
  }
`;

const EmptyMessage = styled.p`
  color: var(--light-text);
  opacity: 0.7;
  font-style: italic;
  padding-left: 0.5rem;
  margin: 0;
`;

const ProjectedXIContainer = styled.div`
  background-color: rgba(138, 43, 226, 0.1);
  border-radius: 6px;
  padding: 0.75rem;
  color: var(--light-text);
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const AnalysisContent: React.FC<AnalysisContentProps> = ({ analysis }) => {
  const renderAsianHandicapAnalysis = () => {
    if (!analysis?.content.asian_handicap_analysis) return null;
    
    const handicapData = analysis.content.asian_handicap_analysis;
    const containsTable = typeof handicapData === 'string' 
      ? (handicapData as string).includes('|') && (handicapData as string).includes('-|-')
      : handicapData.table !== undefined;
    
    let tableContent = '';
    let otherContent = typeof handicapData === 'string' 
      ? handicapData 
      : handicapData.analysis || '';
    
    if (containsTable && typeof handicapData === 'string') {
      const lines = otherContent.split('\n');
      const tableLines = [];
      const nonTableLines = [];
      
      let inTable = false;
      for (const line of lines) {
        if ((line as string).includes('|') && line.trim().startsWith('|')) {
          inTable = true;
          tableLines.push(line);
        } else if (inTable && !(line as string).includes('|')) {
          inTable = false;
          nonTableLines.push(line);
        } else {
          nonTableLines.push(line);
        }
      }
      
      tableContent = tableLines.join('\n');
      otherContent = nonTableLines.join('\n');
    }
    
    return (
      <SectionContainer>
        <SectionTitle>Asian Handicap Analysis</SectionTitle>
        
        {containsTable && typeof handicapData === 'string' && (
          <StyledTable>
            <thead>
              <tr>
                <TableHeader>League</TableHeader>
                <TableHeader>Home</TableHeader>
                <TableHeader>Away</TableHeader>
                <TableHeader>Asian Handicap</TableHeader>
                <TableHeader>Over/Under</TableHeader>
              </tr>
            </thead>
            <tbody>
              {tableContent.split('\n').map((line, index) => (
                <TableRow key={index}>
                  {line.split('|').map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell.trim()}</TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        )}
        
        {typeof handicapData === 'object' && 
         handicapData.table && (
          <StyledTable>
            <thead>
              <tr>
                {handicapData.table.headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handicapData.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        )}
        
        <p>{typeof handicapData === 'object' 
          ? handicapData.analysis 
          : otherContent}</p>
        
        {typeof handicapData === 'object' && 
         handicapData.recommendation && (
          <RecommendationCard>
            <RecommendationTitle>Recommendation</RecommendationTitle>
            <RecommendationContent>{handicapData.recommendation}</RecommendationContent>
          </RecommendationCard>
        )}
        
        {typeof handicapData === 'object' && 
         handicapData.raw && (
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Analysis:</strong>
              <ReactMarkdown>{typeof handicapData.raw === 'string' ? handicapData.raw : ''}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
      </SectionContainer>
    );
  };

  const renderMatchOverview = () => {
    if (!analysis?.content.match_overview) return null;
    
    // Check for my_say in different possible formats
    const hasMySay = analysis?.content?.my_say?.content || 
                     (typeof analysis?.content?.my_say === 'string' && analysis.content.my_say);
    
    return (
      <SectionContainer>
        <SectionTitle>Match Overview</SectionTitle>
        <div style={{ 
          backgroundColor: 'var(--alt-card-background)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          color: 'var(--light-text)',
          marginBottom: '1.5rem'
        }}>
          <p style={{ 
            marginBottom: hasMySay ? '1.5rem' : '0',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>{analysis.content.match_overview}</p>
          
          {hasMySay && renderMySay()}
        </div>
      </SectionContainer>
    );
  };
  
  const renderMySay = () => {
    // Check for my_say in different possible formats
    const mySayContent = analysis?.content?.my_say?.content || 
                         (typeof analysis?.content?.my_say === 'string' ? analysis.content.my_say : null);
    
    if (!mySayContent) return null;
    
    return (
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
          <MarkdownContent>
            <ReactMarkdown>{typeof mySayContent === 'string' ? mySayContent : ''}</ReactMarkdown>
          </MarkdownContent>
        </div>
      </div>
    );
  };
  
  const renderKeyPlayerMatchups = () => {
    if (!analysis?.content.key_player_matchups) return null;
    
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {matchups.map((matchup, index) => (
              <div key={index} style={{ 
                background: 'var(--alt-card-background)', 
                padding: '1rem', 
                borderRadius: '8px',
                borderLeft: '4px solid #8a2be2' 
              }}>
                <strong>{matchup.title}</strong>
                <div style={{ color: 'var(--light-text)', lineHeight: '1.6' }}>
                  <ReactMarkdown>{typeof matchup.content === 'string' ? matchup.content : ''}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      );
    }
    
    return (
      <SectionContainer>
        <SectionTitle>Key Player Matchups</SectionTitle>
        <div style={{ color: 'var(--light-text)', lineHeight: '1.6' }}>
          <ReactMarkdown>{typeof analysis.content.key_player_matchups === 'string' 
            ? analysis.content.key_player_matchups 
            : ''}</ReactMarkdown>
        </div>
      </SectionContainer>
    );
  };
  
  const renderBettingInsights = () => {
    if (!analysis?.content.betting_insights) return null;
    
    const isStructuredArray = Array.isArray(analysis.content.betting_insights);
    
    if (isStructuredArray) {
      const insights = analysis.content.betting_insights as Array<{
        market: string;
        insight: string;
        recommendation?: string;
      }>;
      
      return (
        <SectionContainer>
          <SectionTitle>Betting Insights</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {insights.map((insight, index) => (
              <div key={index} style={{ 
                background: 'var(--alt-card-background)', 
                padding: '1rem', 
                borderRadius: '8px',
                borderLeft: '4px solid #8a2be2' 
              }}>
                <strong>{insight.market}</strong>
                <div style={{ color: 'var(--light-text)', lineHeight: '1.6' }}>
                  <ReactMarkdown>{typeof insight.insight === 'string' ? insight.insight : ''}</ReactMarkdown>
                </div>
                {insight.recommendation && (
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#8a2be2',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginTop: '0.5rem'
                  }}>{insight.recommendation}</span>
                )}
              </div>
            ))}
          </div>
        </SectionContainer>
      );
    }
    
    return (
      <SectionContainer>
        <SectionTitle>Betting Insights</SectionTitle>
        <div style={{ color: 'var(--light-text)', lineHeight: '1.6' }}>
          <ReactMarkdown>{typeof analysis.content.betting_insights === 'object' && 'raw' in analysis.content.betting_insights && typeof analysis.content.betting_insights.raw === 'string'
            ? analysis.content.betting_insights.raw
            : ''}</ReactMarkdown>
        </div>
      </SectionContainer>
    );
  };

  const renderMatchPrediction = () => {
    if (!analysis?.content.prediction) return null;
    
    const prediction = analysis.content.prediction;
    // Check if prediction is an object with score property
    const hasScorePrediction = typeof prediction === 'object' && prediction.score && typeof prediction.score === 'object';
    
    if (hasScorePrediction) {
      // Get reasoning from rationale property (based on type definition)
      const reasoningText = prediction.reasoning || '';
      
      return (
        <PredictionSection>
          <ScorePredictionContent>
            <PredictionHeader>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              AI Match Prediction
            </PredictionHeader>
            
            <ScoreBadge>
              <PredictionTeamName>
                {analysis.home_team}
              </PredictionTeamName>
              <span>{prediction.score.home}</span>
              <span>-</span>
              <span>{prediction.score.away}</span>
              <PredictionTeamName>
                {analysis.away_team}
              </PredictionTeamName>
            </ScoreBadge>
  
            <ReasoningText>
              <ReactMarkdown>{reasoningText}</ReactMarkdown>
            </ReasoningText>
          </ScorePredictionContent>
        </PredictionSection>
      );
    }
    
    // Fallback for string-based prediction
    const predictionContent = typeof prediction === 'string' 
      ? prediction 
      : prediction.reasoning || '';
    
    return (
      <SectionContainer>
        <PredictionCard>
          <PredictionHeader>
            <PredictionIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </PredictionIcon>
            <PredictionTitle>AI Match Prediction</PredictionTitle>
          </PredictionHeader>
          <TextPredictionContent>
            <ReactMarkdown>{typeof predictionContent === 'string' ? predictionContent : ''}</ReactMarkdown>
          </TextPredictionContent>
        </PredictionCard>
      </SectionContainer>
    );
  };
  
  const renderTeamNews = () => {
    if (!analysis?.content.team_news) return null;
    
    // Check if we have structured team news data
    const hasStructuredTeamNews = 
      analysis.content.team_news.structured && 
      analysis.content.team_news.structured.home && 
      analysis.content.team_news.structured.away;
    
    return (
      <SectionContainer>
        <SectionTitle>Team News</SectionTitle>
        {hasStructuredTeamNews ? (
          <TeamNewsGrid>
            <TeamNewsCard>
              <TeamNewsTitle>
                <TeamLogo 
                  src={`https://resources.premierleague.com/premierleague/badges/t${getTeamIdByName(analysis.home_team)}.png`} 
                  alt={analysis.home_team} 
                />
                {analysis.home_team}
              </TeamNewsTitle>
              
              {analysis.content.team_news.structured.home.projected_xi && (
                <TeamNewsSection>
                  <TeamNewsSectionTitle>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a2be2" strokeWidth="2" style={{ marginRight: '8px' }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Predicted Lineup
                  </TeamNewsSectionTitle>
                  <ProjectedXIContainer>
                    {analysis.content.team_news.structured.home.projected_xi}
                  </ProjectedXIContainer>
                </TeamNewsSection>
              )}
              
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
                <TeamLogo 
                  src={`https://resources.premierleague.com/premierleague/badges/t${getTeamIdByName(analysis.away_team)}.png`} 
                  alt={analysis.away_team} 
                />
                {analysis.away_team}
              </TeamNewsTitle>
              
              {analysis.content.team_news.structured.away.projected_xi && (
                <TeamNewsSection>
                  <TeamNewsSectionTitle>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a2be2" strokeWidth="2" style={{ marginRight: '8px' }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Predicted Lineup
                  </TeamNewsSectionTitle>
                  <ProjectedXIContainer>
                    {analysis.content.team_news.structured.away.projected_xi}
                  </ProjectedXIContainer>
                </TeamNewsSection>
              )}
              
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
            <ReactMarkdown>{typeof analysis.content.team_news === 'object' && analysis.content.team_news.raw && typeof analysis.content.team_news.raw === 'string'
              ? analysis.content.team_news.raw
              : ''}</ReactMarkdown>
          </MarkdownContent>
        )}
        {hasStructuredTeamNews && analysis.content.team_news.raw && (
          <RawContentContainer>
            <MarkdownContent>
              <strong>Detailed Team News:</strong>
              <ReactMarkdown>{typeof analysis.content.team_news.raw === 'string' ? analysis.content.team_news.raw : ''}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
      </SectionContainer>
    );
  };

  const renderSources = () => {
    if (!analysis?.content.citations) return null;
    
    const citations = analysis.content.citations;
    
    return (
      <SourcesContainer>
        <SourcesTitle>Sources & Citations</SourcesTitle>
        {Array.isArray(citations) && citations.length > 0 ? (
          <SourcesList>
            {citations.map((citation, index) => (
              <SourceItem key={citation.id || index}>
                <a href={citation.url} target="_blank" rel="noopener noreferrer">
                  {citation.description}
                </a>
              </SourceItem>
            ))}
          </SourcesList>
        ) : (
          typeof citations === 'string' && (
            <div>
              <ReactMarkdown>{citations}</ReactMarkdown>
            </div>
          )
        )}
      </SourcesContainer>
    );
  };

  const getTeamBadgeUrl = (teamName: string) => {
    // Convert team name to lowercase and replace spaces with hyphens for URL-friendly format
    // Not using this formatted name directly but keeping for future reference
    // const formattedName = teamName.toLowerCase().replace(/\s+/g, '-');
    return `https://resources.premierleague.com/premierleague/badges/t${getTeamIdByName(teamName)}.png`;
  };
  
  const getTeamIdByName = (teamName: string) => {
    // Normalize the team name to handle variations
    const normalizedName = teamName.trim();
    
    // Map of team names to their Premier League badge IDs
    // Using the exact names from fixtures.json as primary keys
    const teamMap: {[key: string]: number} = {
      // Primary names (as used in fixtures.json)
      'Arsenal': 3,
      'Aston Villa': 7,
      'Bournemouth': 91,
      'Brentford': 94,
      'Brighton': 36,
      'Chelsea': 8,
      'Crystal Palace': 31,
      'Everton': 11,
      'Fulham': 54,
      'Ipswich': 45,
      'Leicester': 13,
      'Liverpool': 14,
      'Man City': 43,
      'Man Utd': 1,
      'Newcastle': 4,
      'Nottm Forest': 17,
      'Southampton': 20,
      'Tottenham': 6,
      'West Ham': 21,
      'Wolves': 39,
      
      // Alternative names (for backward compatibility)
      'Manchester City': 43,
      'Manchester United': 1,
      'Newcastle United': 4,
      'Nottingham Forest': 17,
      'Tottenham Hotspur': 6,
      'West Ham United': 21,
      'Wolverhampton Wanderers': 39
    };
    
    // Try to find the team ID using the normalized name
    if (teamMap[normalizedName] !== undefined) {
      return teamMap[normalizedName];
    }
    
    // If not found, try to match with a case-insensitive search
    const lowerCaseName = normalizedName.toLowerCase();
    for (const [key, value] of Object.entries(teamMap)) {
      if (key.toLowerCase() === lowerCaseName) {
        return value;
      }
    }
    
    // If still not found, try to find a partial match
    for (const [key, value] of Object.entries(teamMap)) {
      if (key.toLowerCase().includes(lowerCaseName) || lowerCaseName.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Default to 0 if no match is found
    console.warn(`Team badge not found for: ${teamName}`);
    return 0;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format the date part using Intl.DateTimeFormat
    const datePart = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
    
    // Format the time part manually to remove leading zeros in hours
    //const hours = date.getHours();
    //const minutes = date.getMinutes();
    //const ampm = hours >= 12 ? 'PM' : 'AM';
    //const formattedHours = hours % 12 || 12; // Convert to 12-hour format without leading zeros
    //const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure minutes are always 2 digits
    
    return `${datePart}`;
  };
  
  return (
    <ContentContainer>
      <ContentBody>
        {/* Team Header with Badges */}
        <TeamHeader>
          <TeamInfo>
            <TeamBadge src={getTeamBadgeUrl(analysis.home_team)} alt={analysis.home_team} />
            <TeamName>{analysis.home_team}</TeamName>
          </TeamInfo>
          <VersusContainer>
            <VersusText>VS</VersusText>
            <MatchDate>{formatDate(analysis.date)}</MatchDate>
          </VersusContainer>
          <TeamInfo>
            <TeamBadge src={getTeamBadgeUrl(analysis.away_team)} alt={analysis.away_team} />
            <TeamName>{analysis.away_team}</TeamName>
          </TeamInfo>
        </TeamHeader>
        
        {renderMatchOverview()}
        {/* Standalone My Say section if not rendered within Match Overview */}
        {(analysis?.content?.my_say?.content || 
          (typeof analysis?.content?.my_say === 'string' && analysis.content.my_say)) && 
         !analysis.content.match_overview && 
         renderMySay()}
        {renderMatchPrediction()}
        {renderTeamNews()}
        {renderKeyPlayerMatchups()}
        {renderAsianHandicapAnalysis()}
        {renderBettingInsights()}
        {renderSources()}
      </ContentBody>
    </ContentContainer>
  );
};

export { ContentContainer, ContentBody, SectionContainer, SectionTitle };
export default AnalysisContent;
