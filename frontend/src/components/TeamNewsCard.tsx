import React from 'react';
import styled from 'styled-components';

interface TeamNewsProps {
  teamName: string;
  teamLogo: string;
  injuries: string[];
  suspensions: string[];
  returnees: string[];
  projectedXI?: string;
}

const CardContainer = styled.div`
  background-color: var(--alt-card-background);
  border-radius: var(--card-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--neon-box-shadow);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: rgba(138, 43, 226, 0.2);
  border-bottom: 2px solid var(--primary-color);
`;

const TeamLogo = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TeamName = styled.h3`
  font-size: 1.25rem;
  color: var(--light-text);
  margin: 0;
  font-weight: 600;
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  border-left: 3px solid var(--primary-color);
  padding-left: 0.75rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const ListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(138, 43, 226, 0.1);
  color: var(--light-text);
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-right: 0.5rem;
  }
`;

const EmptyMessage = styled.p`
  color: #888;
  font-style: italic;
  margin: 0.5rem 0 1.5rem 0;
`;

const ProjectedXIContainer = styled.div`
  background-color: rgba(138, 43, 226, 0.1);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(138, 43, 226, 0.2);
`;

const ProjectedXITitle = styled.h4`
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ProjectedXIText = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
  white-space: pre-wrap;
`;

const TeamNewsCard: React.FC<TeamNewsProps> = ({ 
  teamName, 
  teamLogo, 
  injuries, 
  suspensions, 
  returnees,
  projectedXI
}) => {
  return (
    <CardContainer>
      <CardHeader>
        <TeamLogo src={teamLogo} alt={`${teamName} logo`} />
        <TeamName>{teamName}</TeamName>
      </CardHeader>
      <CardBody>
        {projectedXI && (
          <ProjectedXIContainer>
            <ProjectedXITitle>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a2be2" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Projected XI
            </ProjectedXITitle>
            <ProjectedXIText>{projectedXI}</ProjectedXIText>
          </ProjectedXIContainer>
        )}
        
        <SectionTitle>Injuries</SectionTitle>
        {injuries.length > 0 ? (
          <List>
            {injuries.map((injury, index) => (
              <ListItem key={`injury-${index}`}>{injury}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyMessage>No injuries reported</EmptyMessage>
        )}
        
        <SectionTitle>Suspensions</SectionTitle>
        {suspensions.length > 0 ? (
          <List>
            {suspensions.map((suspension, index) => (
              <ListItem key={`suspension-${index}`}>{suspension}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyMessage>No suspensions reported</EmptyMessage>
        )}
        
        <SectionTitle>Returnees</SectionTitle>
        {returnees.length > 0 ? (
          <List>
            {returnees.map((returnee, index) => (
              <ListItem key={`returnee-${index}`}>{returnee}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyMessage>No returnees reported</EmptyMessage>
        )}
      </CardBody>
    </CardContainer>
  );
};

export default TeamNewsCard;
