import React from 'react';
import styled from 'styled-components';
import TeamNewsCard from './TeamNewsCard';

// Helper function to get team badge ID based on team name
const getTeamBadgeId = (teamName: string) => {
  switch (teamName) {
    case 'Arsenal':
      return '3';
    case 'Aston Villa':
      return '7';
    case 'Bournemouth':
      return '91';
    case 'Brentford':
      return '94';
    case 'Brighton':
    case 'Brighton & Hove Albion':
      return '36';
    case 'Chelsea':
      return '8';
    case 'Crystal Palace':
      return '31';
    case 'Everton':
      return '11';
    case 'Fulham':
      return '54';
    case 'Ipswich':
      return '40';
    case 'Liverpool':
      return '14';
    case 'Luton':
      return '102';
    case 'Man City':
    case 'Manchester City':
      return '43';
    case 'Man Utd':
    case 'Manchester United':
      return '1';
    case 'Newcastle':
    case 'Newcastle United':
      return '4';
    case 'Nottingham Forest':
    case 'Nottm Forest':
      return '17';
    case 'Sheffield United':
      return '49';
    case 'Tottenham':
    case 'Tottenham Hotspur':
      return '6';
    case 'West Ham':
    case 'West Ham United':
      return '21';
    case 'Wolves':
    case 'Wolverhampton Wanderers':
      return '39';
    case 'Southampton':
      return '20';
    case 'Leicester':
    case 'Leicester City':
      return '13';
    default:
      return '0';
  }
};

interface TeamNewsData {
  teamName: string;
  teamLogo: string;
  teamColor: string;
  injuries: string[];
  suspensions: string[];
  returnees: string[];
}

interface TeamNewsSectionProps {
  title: string;
  homeTeam: TeamNewsData;
  awayTeam: TeamNewsData;
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

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamNewsSection: React.FC<TeamNewsSectionProps> = ({ title, homeTeam, awayTeam }) => {
  // Ensure team logos use the correct Premier League format
  const homeTeamLogo = `https://resources.premierleague.com/premierleague/badges/t${getTeamBadgeId(homeTeam.teamName)}.svg`;
  const awayTeamLogo = `https://resources.premierleague.com/premierleague/badges/t${getTeamBadgeId(awayTeam.teamName)}.svg`;

  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <TeamsGrid>
        <TeamNewsCard 
          teamName={homeTeam.teamName}
          teamLogo={homeTeamLogo}
          injuries={homeTeam.injuries}
          suspensions={homeTeam.suspensions}
          returnees={homeTeam.returnees}
        />
        <TeamNewsCard 
          teamName={awayTeam.teamName}
          teamLogo={awayTeamLogo}
          injuries={awayTeam.injuries}
          suspensions={awayTeam.suspensions}
          returnees={awayTeam.returnees}
        />
      </TeamsGrid>
    </SectionContainer>
  );
};

export default TeamNewsSection;
