import React from 'react';
import styled from 'styled-components';

export interface Competition {
  id: string;
  name: string;
  logo: string;
}

interface CompetitionSelectorProps {
  competitions: Competition[];
  selectedCompetition: string;
  onSelectCompetition: (competitionId: string) => void;
}

const SelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #8a2be2 var(--alt-card-background);
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--alt-card-background);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #8a2be2;
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const CompetitionsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.25rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const CompetitionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.isSelected ? 'rgba(138, 43, 226, 0.3)' : 'var(--alt-card-background)'};
  border: 2px solid ${props => props.isSelected ? '#8a2be2' : 'rgba(138, 43, 226, 0.1)'};
  border-radius: 14px;
  padding: 0.85rem 1.75rem;
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: ${props => props.isSelected 
    ? '0 6px 16px rgba(138, 43, 226, 0.35)' 
    : '0 4px 10px rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(138, 43, 226, 0.4);
    border-color: #8a2be2;
    background-color: ${props => props.isSelected 
      ? 'rgba(138, 43, 226, 0.35)' 
      : 'rgba(138, 43, 226, 0.1)'};
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg, 
      rgba(138, 43, 226, 0.05) 0%, 
      rgba(138, 43, 226, 0) 50%
    );
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    padding: 0.75rem 1rem;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
  }
`;

const CompetitionLogo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.4));
  transition: transform 0.3s ease;
  
  ${CompetitionButton}:hover & {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    margin-bottom: 0.4rem;
  }
`;

const CompetitionName = styled.span`
  color: var(--light-text);
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  transition: color 0.3s ease;
  
  ${CompetitionButton}:hover & {
    color: #fff;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({
  competitions,
  selectedCompetition,
  onSelectCompetition
}) => {
  return (
    <SelectorContainer>
      <CompetitionsWrapper>
        {competitions.map((competition) => (
          <CompetitionButton
            key={competition.id}
            isSelected={selectedCompetition === competition.id}
            onClick={() => onSelectCompetition(competition.id)}
            aria-label={`Select ${competition.name}`}
          >
            <CompetitionLogo src={competition.logo} alt={`${competition.name} logo`} />
            <CompetitionName>{competition.name}</CompetitionName>
          </CompetitionButton>
        ))}
      </CompetitionsWrapper>
    </SelectorContainer>
  );
};

export default CompetitionSelector;
