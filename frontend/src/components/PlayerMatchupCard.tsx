import React from 'react';
import styled from 'styled-components';

interface PlayerMatchupProps {
  player1: {
    name: string;
    team: string;
    teamColor: string;
  };
  player2: {
    name: string;
    team: string;
    teamColor: string;
  };
  analysis: string;
}

const CardContainer = styled.div`
  background-color: var(--alt-card-background);
  border-radius: var(--card-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--neon-box-shadow);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(to right, rgba(138, 43, 226, 0.2), rgba(147, 112, 219, 0.2));
  border-bottom: 1px solid var(--border-color);
`;

const PlayerName = styled.div<{ color: string }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--light-text);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${props => `${props.color}30`};
  border-left: 3px solid ${props => props.color};
  
  &:first-child {
    margin-right: 0.5rem;
  }
  
  &:last-child {
    margin-left: 0.5rem;
    text-align: right;
  }
`;

const VsContainer = styled.div`
  display: flex;
  align-items: center;
  color: var(--accent-color);
  font-weight: 600;
  
  &::before, &::after {
    content: '';
    height: 1px;
    width: 20px;
    background-color: var(--accent-color);
    margin: 0 0.5rem;
  }
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const AnalysisText = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
`;

const PlayerMatchupCard: React.FC<PlayerMatchupProps> = ({ 
  player1, 
  player2, 
  analysis 
}) => {
  return (
    <CardContainer>
      <CardHeader>
        <PlayerName color={player1.teamColor}>
          {player1.name}
        </PlayerName>
        <VsContainer>vs</VsContainer>
        <PlayerName color={player2.teamColor}>
          {player2.name}
        </PlayerName>
      </CardHeader>
      <CardBody>
        <AnalysisText>{analysis}</AnalysisText>
      </CardBody>
    </CardContainer>
  );
};

export default PlayerMatchupCard;
