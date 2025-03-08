import React from 'react';
import styled from 'styled-components';
import PlayerMatchupCard from './PlayerMatchupCard';

interface PlayerMatchup {
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

interface PlayerMatchupsSectionProps {
  title: string;
  matchups: PlayerMatchup[];
}

const SectionContainer = styled.section`
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

const MatchupsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerMatchupsSection: React.FC<PlayerMatchupsSectionProps> = ({ title, matchups }) => {
  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <MatchupsGrid>
        {matchups.map((matchup, index) => (
          <PlayerMatchupCard 
            key={`matchup-${index}`}
            player1={matchup.player1}
            player2={matchup.player2}
            analysis={matchup.analysis}
          />
        ))}
      </MatchupsGrid>
    </SectionContainer>
  );
};

export default PlayerMatchupsSection;
