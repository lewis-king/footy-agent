import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
  color: var(--light-text);
  padding: 1.2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  letter-spacing: -0.5px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 30px;
    height: 3px;
    background-color: var(--secondary-color);
    border-radius: 2px;
  }

  span {
    color: var(--secondary-color);
    margin-left: 2px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: var(--light-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  position: relative;
  padding: 0.5rem 0;
  transition: all var(--transition-speed) ease;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--secondary-color);
    transition: width var(--transition-speed) ease;
  }

  &:hover {
    color: var(--secondary-color);
    
    &:after {
      width: 100%;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent className="container">
        <Logo>
          Footy<span>Agent</span>
        </Logo>
        <NavLinks>
          <NavLink href="#">Home</NavLink>
          <NavLink href="#">Fixtures</NavLink>
          <NavLink href="#">Teams</NavLink>
          <NavLink href="#">Insights</NavLink>
        </NavLinks>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
