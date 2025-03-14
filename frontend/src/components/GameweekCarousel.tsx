import React, { useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Gameweek } from '../types/fixtures';

interface GameweekCarouselProps {
  gameweeks: Gameweek[];
  selectedGameweek: Gameweek | null;
  onSelectGameweek: (gameweek: Gameweek) => void;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 5px 15px rgba(255, 40, 130, 0.3); }
  50% { box-shadow: 0 5px 25px rgba(255, 40, 130, 0.5); }
  100% { box-shadow: 0 5px 15px rgba(255, 40, 130, 0.3); }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -100px; }
  40%, 100% { background-position: 300px; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CarouselContainer = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
  padding: 1.5rem 0;
  ${css`animation: ${slideIn} 0.6s ease-out;`}
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
  gap: 1.2rem;
  padding: 1.5rem 0.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  justify-content: center;
  
  /* Hide scrollbar but allow scrolling */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const StatusIndicator = styled.div<{ status: 'upcoming' | 'ongoing' | 'completed' }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-color);
  font-weight: bold;
  z-index: 2;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return css`
          background: linear-gradient(135deg, #00ff85, #00bfff);
          &:after {
            content: '✓';
          }
        `;
      case 'ongoing':
        return css`
          background: linear-gradient(135deg, #ffaa00, #ff5500);
          animation: ${pulse} 2s infinite;
          &:after {
            content: '⚡';
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, #ff2882, #aa2882);
          &:after {
            content: '⚽';
          }
        `;
    }
  }}
  
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

interface GameweekCardProps {
  isSelected: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  hasContent: boolean;
}

const GameweekCard = styled.div<GameweekCardProps>`
  display: flex;
  flex-direction: column;
  min-width: 140px;
  max-width: 180px;
  height: 160px;
  padding: 1.5rem;
  border-radius: var(--card-radius);
  background: ${props => {
    if (props.isSelected) {
      return `linear-gradient(135deg, var(--alt-card-background), var(--card-background))`;
    }
    switch (props.status) {
      case 'completed': return 'linear-gradient(135deg, rgba(0, 255, 133, 0.1), var(--card-background))';
      case 'ongoing': return 'linear-gradient(135deg, rgba(255, 170, 0, 0.1), var(--card-background))';
      default: return 'var(--card-background)';
    }
  }};
  border: ${props => {
    if (props.isSelected) {
      return `2px solid var(--primary-color)`;
    }
    switch (props.status) {
      case 'completed': return '1px solid rgba(0, 255, 133, 0.3)';
      case 'ongoing': return '1px solid rgba(255, 170, 0, 0.3)';
      default: return '1px solid var(--border-color)';
    }
  }};
  box-shadow: ${props => props.isSelected 
    ? '0 8px 20px rgba(0, 255, 133, 0.3)' 
    : '0 5px 15px var(--shadow-color)'};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  ${props => props.isSelected ? css`animation: ${glow} 3s infinite;` : ''}
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
    background-size: 200px 100%;
    ${css`animation: ${shimmer} 3s infinite linear;`}
    opacity: ${props => props.isSelected ? 1 : 0};
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
    
    &:before {
      opacity: 1;
    }
  }
`;

const GameweekCircle = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 0.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color)20, var(--accent-color)20);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    border: 1px dashed var(--primary-color);
    border-radius: 50%;
    ${css`animation: ${rotate} 20s linear infinite;`}
  }
`;

const GameweekNumber = styled.h3`
  font-size: 1.8rem;
  color: var(--primary-color);
  font-weight: 700;
  margin: 0;
  text-shadow: var(--neon-text-shadow);
  position: relative;
  z-index: 1;
`;

const GameweekLabel = styled.div`
  font-size: 1rem;
  color: var(--light-text);
  margin-top: 0.8rem;
  font-weight: 500;
`;

const Deadline = styled.div`
  font-size: 0.75rem;
  color: var(--light-text);
  opacity: 0.8;
  margin-top: 0.5rem;
`;

const ContentBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  color: var(--text-color);
  font-size: 0.75rem;
  padding: 0.3rem 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
  width: 40px;
  height: 40px;
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
  padding: 2.5rem;
  background: var(--card-background);
  border-radius: var(--card-radius);
  box-shadow: 0 8px 16px var(--shadow-color);
  border: 1px solid var(--border-color);
  color: var(--light-text);
  font-size: 1.1rem;
  
  &:before {
    content: '⚽';
    display: block;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    ${css`animation: ${pulse} 2s infinite ease-in-out;`}
  }
`;

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBD';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'TBD';
    }
    
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'TBD';
  }
};

const GameweekCarousel: React.FC<GameweekCarouselProps> = ({ 
  gameweeks, 
  selectedGameweek, 
  onSelectGameweek 
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Auto-scroll into view when a gameweek is selected
  useEffect(() => {
    if (selectedGameweek && scrollerRef.current) {
      const selectedCard = scrollerRef.current.querySelector(`#gameweek-${selectedGameweek.id}`) as HTMLElement;
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedGameweek]);

  if (!gameweeks || gameweeks.length === 0) {
    return (
      <CarouselContainer>
        <CarouselTitle>FPL Gameweeks</CarouselTitle>
        <EmptyState>No gameweeks available yet. Check back soon!</EmptyState>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer>
      <CarouselTitle>FPL Insider Tips</CarouselTitle>
      
      <div style={{ position: 'relative' }}>
        <CarouselScroller ref={scrollerRef}>
          {gameweeks.map((gameweek) => (
            <GameweekCard
              id={`gameweek-${gameweek.id}`}
              key={gameweek.id}
              isSelected={selectedGameweek?.id === gameweek.id}
              status={gameweek.status}
              hasContent={!!gameweek.content_generated}
              onClick={() => onSelectGameweek(gameweek)}
            >
              <StatusIndicator status={gameweek.status} />
              
              <GameweekCircle>
                <GameweekNumber>{gameweek.number}</GameweekNumber>
              </GameweekCircle>
              
              <GameweekLabel>Gameweek {gameweek.number}</GameweekLabel>
              
              <Deadline>Deadline: {formatDate(gameweek.deadline)}</Deadline>
              
              {gameweek.content_generated && (
                <ContentBadge>Tips Ready</ContentBadge>
              )}
            </GameweekCard>
          ))}
        </CarouselScroller>
        
        {gameweeks.length > 3 && (
          <>
            <ScrollButton direction="left" onClick={handleScrollLeft}>
              {/* Arrow content handled in CSS */}
            </ScrollButton>
            <ScrollButton direction="right" onClick={handleScrollRight}>
              {/* Arrow content handled in CSS */}
            </ScrollButton>
          </>
        )}
      </div>
    </CarouselContainer>
  );
};

export default GameweekCarousel;
