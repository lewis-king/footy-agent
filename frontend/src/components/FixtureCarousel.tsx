import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Fixture } from '../types/fixtures';

interface FixtureCarouselProps {
  fixtures: Fixture[];
  selectedFixture: Fixture | null;
  onSelectFixture: (fixture: Fixture) => void;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 10px 20px rgba(0, 255, 133, 0.2); }
  50% { box-shadow: 0 15px 30px rgba(0, 255, 133, 0.4); }
  100% { box-shadow: 0 10px 20px rgba(0, 255, 133, 0.2); }
`;

const highlightShine = keyframes`
  0% {
    background-position: -100px;
  }
  40%, 100% {
    background-position: 300px;
  }
`;

const rotateAnim = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CarouselContainer = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
  padding: 1.5rem 0;
`;

const CarouselTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    border-radius: 2px;
  }
`;

const CarouselScroller = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1.5rem 0.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar but allow scrolling */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* Snap scrolling for better UX */
  scroll-snap-type: x mandatory;
  > * {
    scroll-snap-align: start;
  }
`;

const FixtureCard = styled.div<{ isSelected: boolean; primaryColor: string; secondaryColor: string; isPast: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 320px;
  height: 300px;
  padding: 1.5rem;
  border-radius: var(--card-radius);
  background: ${props => {
    if (props.isSelected) {
      return `linear-gradient(135deg, ${props.primaryColor}40, ${props.secondaryColor}40)`;
    } else if (props.isPast) {
      return `linear-gradient(135deg, rgba(0, 128, 0, 0.25), rgba(0, 100, 0, 0.15))`;
    } else {
      return 'var(--alt-card-background)';
    }
  }};
  border: ${props => {
    if (props.isSelected) {
      return `2px solid ${props.primaryColor}`;
    } else if (props.isPast) {
      return '1px solid rgba(0, 128, 0, 0.3)';
    } else {
      return '1px solid var(--border-color)';
    }
  }};
  box-shadow: ${props => props.isSelected 
    ? '0 10px 25px rgba(138, 43, 226, 0.3)' 
    : '0 5px 15px var(--shadow-color)'};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  animation: ${props => props.isSelected ? glow : 'none'} 3s infinite;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
    background-size: 200px 100%;
    animation: ${highlightShine} 3s infinite linear;
    opacity: ${props => props.isSelected ? 1 : 0};
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    
    &:before {
      opacity: 1;
    }
  }
`;

const CompletedIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 128, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

const FixtureHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Kickoff = styled.span`
  font-size: 0.85rem;
  color: var(--light-text);
  background-color: rgba(138, 43, 226, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const TeamsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  position: relative;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 40%;
  position: relative;
  z-index: 1;
`;

const TeamLogo = styled.img`
  width: 65px;
  height: 65px;
  margin-bottom: 0.8rem;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
  
  ${Team}:hover & {
    transform: scale(1.15) translateY(-5px);
  }
`;

const TeamName = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: var(--light-text);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  display: block;
  
  ${Team}:hover & {
    color: var(--primary-color);
    text-shadow: 0 0 8px rgba(138, 43, 226, 0.5);
  }
`;

const Versus = styled.div`
  font-weight: 700;
  color: var(--accent-color);
  margin: 0 0.5rem;
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
    opacity: 0.2;
    z-index: 0;
    animation: ${pulse} 2s infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 70px;
    height: 70px;
    border: 2px dashed var(--accent-color);
    border-radius: 50%;
    opacity: 0.3;
    animation: ${rotateAnim} 10s linear infinite;
  }
  
  span {
    z-index: 1;
    font-size: 1.3rem;
  }
`;

const Venue = styled.div`
  margin-top: auto;
  font-size: 0.9rem;
  text-align: center;
  color: var(--light-text);
  background-color: rgba(138, 43, 226, 0.1);
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
`;

const ScrollButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: -15px;' : 'right: -15px;'}
  transform: translateY(-50%);
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: var(--text-color);
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 255, 133, 0.4);
  }
  
  &:before {
    content: '${props => props.direction === 'left' ? '←' : '→'}';
    font-size: 1.4rem;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    ${props => props.direction === 'left' ? 'left: -5px;' : 'right: -5px;'}
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--card-background);
  border-radius: var(--card-radius);
  box-shadow: 0 8px 16px var(--shadow-color);
  
  p {
    color: var(--light-text);
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.3s ease;
`;

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

const FixtureCarousel: React.FC<FixtureCarouselProps> = ({ 
  fixtures, 
  selectedFixture, 
  onSelectFixture 
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollerRef.current) {
        setMaxScroll(scrollerRef.current.scrollWidth - scrollerRef.current.clientWidth);
      }
    };
    
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [fixtures]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollerRef.current) {
        setScrollPosition(scrollerRef.current.scrollLeft);
      }
    };
    
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', handleScroll);
      return () => scroller.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleScrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Auto-scroll into view when a fixture is selected
  useEffect(() => {
    if (selectedFixture && scrollerRef.current) {
      const selectedCard = scrollerRef.current.querySelector(`[data-fixture-id="${selectedFixture.id}"]`) as HTMLElement;
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedFixture]);

  // Find the next upcoming fixture based on current time
  const findNextUpcomingFixture = (fixtures: Fixture[]): Fixture | null => {
    const now = new Date();
    
    // Sort fixtures by kickoff time
    const sortedFixtures = [...fixtures].sort((a, b) => {
      return new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
    });
    
    // Find the first fixture that hasn't started yet
    const nextFixture = sortedFixtures.find(fixture => {
      return new Date(fixture.kickoff) > now;
    });
    
    return nextFixture || null;
  };

  // Auto-scroll to the next upcoming fixture when fixtures are loaded
  useEffect(() => {
    if (fixtures.length > 0 && scrollerRef.current && !selectedFixture) {
      const nextUpcomingFixture = findNextUpcomingFixture(fixtures);
      
      if (nextUpcomingFixture) {
        const nextUpcomingCard = scrollerRef.current.querySelector(`[data-fixture-id="${nextUpcomingFixture.id}"]`) as HTMLElement;
        if (nextUpcomingCard) {
          // Scroll to the next upcoming fixture with a slight delay to ensure DOM is ready
          setTimeout(() => {
            nextUpcomingCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }, 300);
        }
      }
    }
  }, [fixtures, selectedFixture]);

  if (fixtures.length === 0) {
    return (
      <EmptyState>
        <p>No fixtures available</p>
      </EmptyState>
    );
  }

  // Calculate progress percentage
  const progressWidth = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;

  return (
    <CarouselContainer>
      <CarouselTitle>Fixtures</CarouselTitle>
      
      <div style={{ position: 'relative' }}>
        <CarouselScroller ref={scrollerRef}>
          {fixtures.map(fixture => {
            // Extract team colors for gradient
            const homeColor = fixture.homeTeam.primaryColor || '#8a2be2';
            const awayColor = fixture.awayTeam.secondaryColor || '#8a2be2';
            
            const isSelected = selectedFixture?.id === fixture.id;
            const isPast = new Date(fixture.kickoff) < new Date();
            
            return (
              <FixtureCard 
                key={fixture.id}
                data-fixture-id={fixture.id}
                isSelected={isSelected}
                primaryColor={homeColor}
                secondaryColor={awayColor}
                isPast={isPast}
                onClick={() => onSelectFixture(fixture)}
              >
                {isPast && <CompletedIcon>✓</CompletedIcon>}
                <FixtureHeader>
                  <Kickoff>{formatDate(fixture.kickoff)}</Kickoff>
                </FixtureHeader>
                
                <TeamsContainer>
                  <Team>
                    <TeamLogo 
                      src={fixture.homeTeam.logo} 
                      alt={fixture.homeTeam.name} 
                    />
                    <TeamName>{fixture.homeTeam.name}</TeamName>
                  </Team>
                  
                  <Versus>
                    <span>VS</span>
                  </Versus>
                  
                  <Team>
                    <TeamLogo 
                      src={fixture.awayTeam.logo} 
                      alt={fixture.awayTeam.name} 
                    />
                    <TeamName>{fixture.awayTeam.name}</TeamName>
                  </Team>
                </TeamsContainer>
                
                <Venue>{fixture.venue}</Venue>
              </FixtureCard>
            );
          })}
        </CarouselScroller>
        
        <ScrollButton direction="left" onClick={handleScrollLeft} aria-label="Scroll to previous fixtures">
          {/* Arrow content handled in CSS */}
        </ScrollButton>
        <ScrollButton direction="right" onClick={handleScrollRight} aria-label="Scroll to next fixtures">
          {/* Arrow content handled in CSS */}
        </ScrollButton>
        
        <ProgressBar style={{ width: `${progressWidth}%` }} />
      </div>
    </CarouselContainer>
  );
};

export default FixtureCarousel;
