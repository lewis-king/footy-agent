import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(90deg, #0f0f1b, #1a1a2e);
  color: var(--light-text);
  padding: 1.2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid rgba(138, 43, 226, 0.2);
  width: 100%;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.75rem;
  }
`;

const Logo = styled.div`
  font-family: 'Azonix', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  position: relative;
  color: var(--light-text);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), transparent);
    border-radius: 2px;
  }

  span {
    color: var(--primary-color);
    margin-left: 2px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavLinks = styled.nav<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #0f0f1b, #1a1a2e);
    padding: 1rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
    z-index: 99;
    border-bottom: 2px solid rgba(138, 43, 226, 0.2);
  }
`;

const NavLink = styled.a<{ $active?: boolean }>`
  color: var(--light-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  position: relative;
  padding: 0.5rem 1rem;
  transition: all var(--transition-speed) ease;
  border-radius: 20px;
  background: ${props => props.$active ? 'rgba(138, 43, 226, 0.1)' : 'transparent'};

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${props => props.$active ? '0' : '50%'};
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background-color: var(--primary-color);
    transition: width var(--transition-speed) ease, left var(--transition-speed) ease;
    box-shadow: 0 0 8px var(--primary-color);
  }

  &:hover {
    color: var(--primary-color);
    text-shadow: 0 0 8px rgba(138, 43, 226, 0.5);
    
    &:after {
      width: 100%;
      left: 0;
    }
  }
`;

const MobileNavLink = styled(NavLink)`
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    text-align: center;
    border-radius: 0;
    
    &:after {
      bottom: auto;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      transform: scaleY(${props => props.$active ? '1' : '0'});
    }
    
    &:hover:after {
      transform: scaleY(1);
      width: 4px;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--light-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const BetaTag = styled.span`
  background-color: var(--accent-color);
  color: var(--light-text);
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-left: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(255, 40, 130, 0.5);
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 0.1rem 0.4rem;
  }
`;

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'preview', onTabChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onTabChange) {
      onTabChange(tab);
    }
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <HeaderContainer style={{ 
      boxShadow: scrolled ? '0 4px 20px rgba(138, 43, 226, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
      transition: 'box-shadow 0.3s ease'
    }}>
      <HeaderContent className="container">
        <Logo>
          Footy<span>Agent</span>
          <BetaTag>Beta</BetaTag>
        </Logo>
        
        <NavLinks>
          <NavLink 
            href="#" 
            $active={activeTab === 'preview'} 
            onClick={handleTabClick('preview')}
          >
            Match Previews
          </NavLink>
          <NavLink 
            href="#" 
            $active={activeTab === 'fpl'} 
            onClick={handleTabClick('fpl')}
          >
            FPL Zone
          </NavLink>
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </HeaderContent>
      
      <MobileNavLinks isOpen={mobileMenuOpen}>
        <MobileNavLink 
          href="#" 
          $active={activeTab === 'preview'} 
          onClick={handleTabClick('preview')}
        >
          Match Previews
        </MobileNavLink>
        <MobileNavLink 
          href="#" 
          $active={activeTab === 'fpl'} 
          onClick={handleTabClick('fpl')}
        >
          FPL Zone
        </MobileNavLink>
      </MobileNavLinks>
    </HeaderContainer>
  );
};

export default Header;
