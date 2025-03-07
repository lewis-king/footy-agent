import React, { useRef } from 'react';
import styled from 'styled-components';
import { Fixture } from '../types/fixtures';

interface FixtureCarouselProps {
  fixtures: Fixture[];
  selectedFixture: Fixture | null;
  onSelectFixture: (fixture: Fixture) => void;
}

const CarouselContainer = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
  padding: 1rem 0;
`;

const CarouselTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: var(--accent-color);
    border-radius: 2px;
  }
`;

const CarouselScroller = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.2rem;
  padding: 1rem 0.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--border-color);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }
`;

const FixtureCard = styled.div<{ isSelected: boolean; primaryColor: string; secondaryColor: string }>`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  padding: 1.2rem;
  border-radius: var(--card-radius);
  background: ${props => props.isSelected 
    ? `linear-gradient(135deg, ${props.primaryColor}30, ${props.secondaryColor}30)` 
    : 'var(--card-background)'};
  border: ${props => props.isSelected 
    ? `2px solid ${props.primaryColor}` 
    : '1px solid var(--border-color)'};
  box-shadow: ${props => props.isSelected 
    ? '0 8px 16px var(--shadow-color)' 
    : '0 4px 8px var(--shadow-color)'};
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px var(--shadow-color);
  }
`;

const FixtureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Competition = styled.span`
  font-size: 0.85rem;
  color: var(--primary-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Kickoff = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const TeamsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 40%;
`;

const TeamLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 0.8rem;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${Team}:hover & {
    transform: scale(1.1);
  }
`;

const TeamName = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-color);
`;

const Versus = styled.div`
  font-weight: 700;
  color: var(--accent-color);
  margin: 0 0.5rem;
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--accent-color);
    opacity: 0.1;
    z-index: 0;
  }
  
  span {
    z-index: 1;
  }
`;

const Venue = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const ScrollButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: -15px;' : 'right: -15px;'}
  transform: translateY(-50%);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: var(--card-radius);
  box-shadow: 0 4px 8px var(--shadow-color);
`;

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const FixtureCarousel: React.FC<FixtureCarouselProps> = ({ 
  fixtures, 
  selectedFixture, 
  onSelectFixture 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 260; // Card width + gap
    const currentScroll = scrollRef.current.scrollLeft;
    
    scrollRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };
  
  return (
    <CarouselContainer>
      <CarouselTitle>Upcoming Fixtures</CarouselTitle>
      
      {fixtures.length > 0 && (
        <>
          <ScrollButton 
            direction="left" 
            onClick={() => handleScroll('left')}
          >
            ←
          </ScrollButton>
          
          <CarouselScroller ref={scrollRef}>
            {fixtures.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                isSelected={selectedFixture?.id === fixture.id}
                primaryColor={fixture.homeTeam.primaryColor}
                secondaryColor={fixture.awayTeam.primaryColor}
                onClick={() => onSelectFixture(fixture)}
              >
                <FixtureHeader>
                  <Competition>{fixture.competition}</Competition>
                  <Kickoff>{formatDate(fixture.kickoff)}</Kickoff>
                </FixtureHeader>
                
                <TeamsContainer>
                  <Team>
                    <TeamLogo 
                      src={fixture.homeTeam.logo} 
                      alt={fixture.homeTeam.name} 
                    />
                    <TeamName>{fixture.homeTeam.shortName}</TeamName>
                  </Team>
                  
                  <Versus><span>VS</span></Versus>
                  
                  <Team>
                    <TeamLogo 
                      src={fixture.awayTeam.logo} 
                      alt={fixture.awayTeam.name} 
                    />
                    <TeamName>{fixture.awayTeam.shortName}</TeamName>
                  </Team>
                </TeamsContainer>
                
                <Venue>{fixture.venue}</Venue>
              </FixtureCard>
            ))}
          </CarouselScroller>
          
          <ScrollButton 
            direction="right" 
            onClick={() => handleScroll('right')}
          >
            →
          </ScrollButton>
        </>
      )}
      
      {fixtures.length === 0 && (
        <EmptyState>No upcoming fixtures available</EmptyState>
      )}
    </CarouselContainer>
  );
};

export default FixtureCarousel;
