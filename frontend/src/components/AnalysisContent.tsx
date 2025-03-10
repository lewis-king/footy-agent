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
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
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

const RecommendationTitle = styled.h3`
  color: #8a2be2;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const RecommendationContent = styled.p`
  color: var(--light-text);
  line-height: 1.6;
`;

const RawContentContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(37, 37, 37, 0.5);
  border-radius: 4px;
`;

const MarkdownContent = styled.div`
  color: var(--light-text);
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
  }
  
  strong {
    color: #8a2be2;
  }
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
              <ReactMarkdown>{handicapData.raw}</ReactMarkdown>
            </MarkdownContent>
          </RawContentContainer>
        )}
      </SectionContainer>
    );
  };

  const renderMatchOverview = () => {
    if (!analysis?.content.match_overview) return null;
    
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
            marginBottom: analysis?.content?.my_say?.content ? '1.5rem' : '0',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>{analysis.content.match_overview}</p>
          
          {analysis?.content?.my_say?.content && renderMySay()}
        </div>
      </SectionContainer>
    );
  };
  
  const renderMySay = () => {
    if (!analysis?.content?.my_say?.content) return null;
    
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
            <ReactMarkdown>{analysis.content.my_say.content}</ReactMarkdown>
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
                  <ReactMarkdown>{matchup.content}</ReactMarkdown>
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
                  <ReactMarkdown>{insight.insight}</ReactMarkdown>
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
          <ReactMarkdown>{typeof analysis.content.betting_insights === 'object' && 'raw' in analysis.content.betting_insights
            ? analysis.content.betting_insights.raw
            : ''}</ReactMarkdown>
        </div>
      </SectionContainer>
    );
  };
  
  const renderTeamNews = () => {
    if (!analysis?.content.team_news) return null;
    
    return (
      <SectionContainer>
        <SectionTitle>Team News</SectionTitle>
        <div style={{ color: 'var(--light-text)', lineHeight: '1.6' }}>
          <ReactMarkdown>{analysis.content.team_news.raw}</ReactMarkdown>
        </div>
      </SectionContainer>
    );
  };
  
  return (
    <ContentContainer>
      <ContentBody>
        {renderMatchOverview()}
        {renderAsianHandicapAnalysis()}
        {renderKeyPlayerMatchups()}
        {renderBettingInsights()}
        {renderTeamNews()}
      </ContentBody>
    </ContentContainer>
  );
};

export { ContentContainer, ContentBody, SectionContainer, SectionTitle };
export default AnalysisContent;
