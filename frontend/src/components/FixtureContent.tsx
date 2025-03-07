import React from 'react';
import styled from 'styled-components';
import { Fixture, FixtureContent as FixtureContentType } from '../types/fixtures';

interface FixtureContentProps {
  fixture: Fixture;
  content: FixtureContentType;
}

const ContentContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 8px var(--shadow-color);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const FixtureImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: center;
  
  @media (max-width: 768px) {
    height: 250px;
  }
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

const PreviewText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--text-color);
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

const TeamComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const TeamColumn = styled.div<{ teamColor: string }>`
  background-color: ${props => `${props.teamColor}10`};
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid ${props => props.teamColor};
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
      case 'W': return '#2cba00';
      case 'D': return '#ffa500';
      case 'L': return '#e53935';
      default: return '#888';
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
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PlayerCard = styled.div`
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const PlayerName = styled.h4`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  span {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    background-color: var(--primary-color);
    color: white;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 0.8rem;
  }
`;

const PlayerImpact = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

const BettingInsightsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  padding: 1.5rem;
  border-top: 4px solid var(--accent-color);
`;

const InsightType = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #666;
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

const HandicapContainer = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const HandicapRecommendation = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
`;

const HandicapExplanation = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const AdditionalContentContainer = styled.div`
  margin-top: 2rem;
`;

const AdditionalContentSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const AdditionalContentTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const AdditionalContentText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const LastUpdated = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-align: right;
  margin-top: 2rem;
`;

const FixtureContent: React.FC<FixtureContentProps> = ({ fixture, content }) => {
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

  return (
    <ContentContainer>
      <FixtureImage src={content.image.url} alt={content.image.alt} />
      
      <ContentBody>
        <Headline>{content.previewHeadline}</Headline>
        <PreviewText>{content.previewContent}</PreviewText>
        
        <Section>
          <SectionTitle>Team Comparison</SectionTitle>
          <TeamComparisonContainer>
            <TeamColumn teamColor={fixture.homeTeam.primaryColor}>
              <TeamHeader>
                <TeamLogo src={fixture.homeTeam.logo} alt={fixture.homeTeam.name} />
                <TeamName>{fixture.homeTeam.name}</TeamName>
              </TeamHeader>
              
              <h4>Form (Last 5)</h4>
              <FormContainer>
                {content.teamComparison.homeTeam.form.map((result, index) => (
                  <FormResult key={index} result={result}>{result}</FormResult>
                ))}
              </FormContainer>
              
              <h4>Strengths</h4>
              <AttributeList>
                {content.teamComparison.homeTeam.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </AttributeList>
              
              <h4>Weaknesses</h4>
              <AttributeList>
                {content.teamComparison.homeTeam.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </AttributeList>
            </TeamColumn>
            
            <TeamColumn teamColor={fixture.awayTeam.primaryColor}>
              <TeamHeader>
                <TeamLogo src={fixture.awayTeam.logo} alt={fixture.awayTeam.name} />
                <TeamName>{fixture.awayTeam.name}</TeamName>
              </TeamHeader>
              
              <h4>Form (Last 5)</h4>
              <FormContainer>
                {content.teamComparison.awayTeam.form.map((result, index) => (
                  <FormResult key={index} result={result}>{result}</FormResult>
                ))}
              </FormContainer>
              
              <h4>Strengths</h4>
              <AttributeList>
                {content.teamComparison.awayTeam.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </AttributeList>
              
              <h4>Weaknesses</h4>
              <AttributeList>
                {content.teamComparison.awayTeam.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </AttributeList>
            </TeamColumn>
          </TeamComparisonContainer>
        </Section>
        
        <Section>
          <SectionTitle>Key Players to Watch</SectionTitle>
          <KeyPlayersContainer>
            <div>
              <h3>{fixture.homeTeam.name}</h3>
              {content.keyPlayers.homeTeam.map((player, index) => (
                <PlayerCard key={index}>
                  <PlayerName>
                    {player.name}
                    <span>{player.position}</span>
                  </PlayerName>
                  <PlayerImpact>{player.impact}</PlayerImpact>
                </PlayerCard>
              ))}
            </div>
            
            <div>
              <h3>{fixture.awayTeam.name}</h3>
              {content.keyPlayers.awayTeam.map((player, index) => (
                <PlayerCard key={index}>
                  <PlayerName>
                    {player.name}
                    <span>{player.position}</span>
                  </PlayerName>
                  <PlayerImpact>{player.impact}</PlayerImpact>
                </PlayerCard>
              ))}
            </div>
          </KeyPlayersContainer>
        </Section>
        
        <Section>
          <SectionTitle>Betting Insights</SectionTitle>
          <BettingInsightsContainer>
            {content.bettingInsights.map((insight, index) => (
              <InsightCard key={index}>
                <InsightType>{insight.type}</InsightType>
                <InsightTitle>{insight.title}</InsightTitle>
                <InsightDescription>{insight.description}</InsightDescription>
                <ConfidenceBar confidence={insight.confidence} />
              </InsightCard>
            ))}
          </BettingInsightsContainer>
        </Section>
        
        <Section>
          <SectionTitle>Asian Handicap Analysis</SectionTitle>
          <HandicapContainer>
            <HandicapRecommendation>
              Recommendation: {content.asianHandicap.recommendation}
            </HandicapRecommendation>
            <HandicapExplanation>
              {content.asianHandicap.explanation}
            </HandicapExplanation>
          </HandicapContainer>
        </Section>
        
        <AdditionalContentContainer>
          {content.additionalContent.map((section, index) => (
            <AdditionalContentSection key={index}>
              <AdditionalContentTitle>{section.title}</AdditionalContentTitle>
              <AdditionalContentText>{section.content}</AdditionalContentText>
            </AdditionalContentSection>
          ))}
        </AdditionalContentContainer>
        
        <LastUpdated>
          Last updated: {formatLastUpdated(content.lastUpdated)}
        </LastUpdated>
      </ContentBody>
    </ContentContainer>
  );
};

export default FixtureContent;
