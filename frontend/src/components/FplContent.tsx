import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Gameweek, FplAnalysis } from '../types/fixtures';

interface FplContentProps {
  gameweek: Gameweek;
  analysis: FplAnalysis;
}

interface ContentContainerProps {
  $primaryColor?: string;
  $secondaryColor?: string;
}

const ContentContainer = styled.div<ContentContainerProps>`
  background: linear-gradient(
    to bottom right,
    ${props => (props.$primaryColor || '#8a2be2')}0A,
    ${props => (props.$secondaryColor || '#38003c')}0A
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

const ContentBody = styled.div`
  padding: 2rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Headline = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--light-text);
  font-weight: 600;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
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

const SectionContainer = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const MarkdownContent = styled.div`
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

const PicksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PlayerCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    border-color: var(--primary-color);
  }
`;

const PlayerName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
`;

const PlayerTeam = styled.div`
  font-size: 0.9rem;
  color: var(--light-text);
  margin-bottom: 0.8rem;
`;

const PlayerReason = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  color: var(--light-text);
`;

const AdditionalInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--light-text);
  opacity: 0.8;
`;

// Remove unused styled components
/* 
const MyTeamSection = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid var(--border-color);
`;

const MyTeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MyTeamTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--primary-color);
`;

const TeamStats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: var(--light-text);
  opacity: 0.8;
`;
*/

const TransfersList = styled.div`
  margin-top: 1.5rem;
`;

const TransferItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  background-color: var(--alt-card-background);
  border-radius: 8px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: var(--primary-color);
  }
`;

const TransferDirection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--light-text);
`;

const PlayerOut = styled.div`
  flex: 1;
  color: var(--light-text);
`;

const TransferArrow = styled.div`
  margin: 0 0.5rem;
  color: var(--accent-color);
  font-size: 1.2rem;
`;

const PlayerIn = styled.div`
  flex: 1;
  color: var(--light-text);
`;

const TransferReason = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--light-text);
  opacity: 0.9;
  line-height: 1.4;
`;

const FixtureCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: var(--primary-color);
  }
`;

const FixtureTeams = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const FixtureVs = styled.span`
  color: var(--light-text);
  opacity: 0.7;
  font-size: 0.9rem;
  margin: 0 0.5rem;
`;

const FixtureAnalysis = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  color: var(--light-text);
`;

const ChipAdviceCard = styled.div`
  background-color: var(--alt-card-background);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--accent-color);
`;

const ChipAdviceTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--primary-color);
`;

const LastUpdated = styled.div`
  font-size: 0.9rem;
  color: var(--light-text);
  opacity: 0.7;
  margin-top: 0.5rem;
  text-align: right;
  font-style: italic;
`;

const FplContent: React.FC<FplContentProps> = ({ gameweek, analysis }) => {
  const { content } = analysis;
  
  // Format the last updated date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }
      return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <ContentContainer $primaryColor="#8a2be2" $secondaryColor="#38003c">
      <ContentBody>
        <Headline>Gameweek {gameweek.number} FPL Analysis</Headline>
        <LastUpdated>Last updated: {formatDate(analysis.generated_at)}</LastUpdated>
        
        <Section>
          <SectionTitle>Gameweek Overview</SectionTitle>
          <SectionContainer>
            <MarkdownContent>
              <ReactMarkdown>{content.overview}</ReactMarkdown>
            </MarkdownContent>
          </SectionContainer>
        </Section>
        
        <Section>
          <SectionTitle>Top Picks</SectionTitle>
          {content.topPicks.map((positionGroup, index) => (
            <div key={index}>
              <h3 style={{ color: 'var(--light-text)', marginBottom: '1rem' }}>{positionGroup.position}</h3>
              <PicksGrid>
                {positionGroup.players.map((player, playerIndex) => (
                  <PlayerCard key={playerIndex}>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerTeam>{player.team}</PlayerTeam>
                    <PlayerReason>{player.reason}</PlayerReason>
                    {(player.price || player.ownership) && (
                      <AdditionalInfo>
                        {player.price && <span>£{player.price}m</span>}
                        {player.ownership && <span>{player.ownership}% owned</span>}
                      </AdditionalInfo>
                    )}
                  </PlayerCard>
                ))}
              </PicksGrid>
            </div>
          ))}
        </Section>
        
        <Section>
          <SectionTitle>Differential Picks</SectionTitle>
          <PicksGrid>
            {content.differentials.map((player, index) => (
              <PlayerCard key={index}>
                <PlayerName>{player.name}</PlayerName>
                <PlayerTeam>{player.team} - {player.position}</PlayerTeam>
                <PlayerReason>{player.reason}</PlayerReason>
                {player.ownership && (
                  <AdditionalInfo>
                    <span>{player.ownership}% owned</span>
                  </AdditionalInfo>
                )}
              </PlayerCard>
            ))}
          </PicksGrid>
        </Section>
        
        <Section>
          <SectionTitle>Captain Picks</SectionTitle>
          <PicksGrid>
            {content.captainPicks.map((player, index) => (
              <PlayerCard key={index}>
                <PlayerName>{player.name} {index === 0 && '(Top Pick)'}</PlayerName>
                <PlayerTeam>{player.team}</PlayerTeam>
                <PlayerReason>{player.reason}</PlayerReason>
                {player.fixtures && (
                  <AdditionalInfo>
                    <span>Fixture: {player.fixtures}</span>
                  </AdditionalInfo>
                )}
              </PlayerCard>
            ))}
          </PicksGrid>
        </Section>
        
        {content.keyFixtures && content.keyFixtures.length > 0 && (
          <Section>
            <SectionTitle>Key Fixtures</SectionTitle>
            {content.keyFixtures.map((fixture, index: number) => (
              <FixtureCard key={index}>
                <FixtureTeams>
                  <span>{fixture.home_team}</span>
                  <FixtureVs>vs</FixtureVs>
                  <span>{fixture.away_team}</span>
                </FixtureTeams>
                <FixtureAnalysis>{fixture.analysis}</FixtureAnalysis>
              </FixtureCard>
            ))}
          </Section>
        )}
        
        {content.teamInsights && (
          <Section>
            <SectionTitle>Personalized Team Advice</SectionTitle>
            <SectionContainer>
              <h3 style={{ color: 'var(--light-text)', marginBottom: '1rem' }}>Team Analysis</h3>
              <MarkdownContent>
                <p>{content.teamInsights.currentTeamAnalysis}</p>
              </MarkdownContent>
              
              {content.teamInsights.suggestedTransfers && content.teamInsights.suggestedTransfers.length > 0 && (
                <>
                  <h3 style={{ color: 'var(--light-text)', marginTop: '1.5rem', marginBottom: '1rem' }}>Suggested Transfers</h3>
                  <TransfersList>
                    {content.teamInsights.suggestedTransfers.map((transfer, index) => (
                      <TransferItem key={index}>
                        <TransferDirection>
                          <PlayerOut>{transfer.playerOut}</PlayerOut>
                          <TransferArrow>→</TransferArrow>
                          <PlayerIn>{transfer.playerIn}</PlayerIn>
                        </TransferDirection>
                        <TransferReason>{transfer.reason}</TransferReason>
                      </TransferItem>
                    ))}
                  </TransfersList>
                </>
              )}
              
              {content.teamInsights.suggestedStartingXI && (
                <>
                  <h3 style={{ color: 'var(--light-text)', marginTop: '1.5rem', marginBottom: '1rem' }}>Suggested Starting XI</h3>
                  <MarkdownContent>
                    <ReactMarkdown>{content.teamInsights.suggestedStartingXI}</ReactMarkdown>
                  </MarkdownContent>
                </>
              )}
              
              {content.teamInsights.captainSuggestion && (
                <>
                  <h3 style={{ color: 'var(--light-text)', marginTop: '1.5rem', marginBottom: '1rem' }}>Captain Suggestion</h3>
                  <div style={{ 
                    backgroundColor: 'var(--alt-card-background)', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary-color)',
                    color: 'var(--light-text)'
                  }}>
                    {content.teamInsights.captainSuggestion}
                  </div>
                </>
              )}
              
              {content.teamInsights.chipAdvice && (
                <>
                  <h3 style={{ color: 'var(--light-text)', marginTop: '1.5rem', marginBottom: '1rem' }}>Chip Strategy</h3>
                  <MarkdownContent>
                    <p>{content.teamInsights.chipAdvice}</p>
                  </MarkdownContent>
                </>
              )}
            </SectionContainer>
          </Section>
        )}
        
        {content.chipAdvice && (
          <Section>
            <SectionTitle>Chip Strategy</SectionTitle>
            <ChipAdviceCard>
              <ChipAdviceTitle>Chip Advice</ChipAdviceTitle>
              <MarkdownContent>
                <ReactMarkdown>{content.chipAdvice}</ReactMarkdown>
              </MarkdownContent>
            </ChipAdviceCard>
          </Section>
        )}
      </ContentBody>
    </ContentContainer>
  );
};

export default FplContent;
