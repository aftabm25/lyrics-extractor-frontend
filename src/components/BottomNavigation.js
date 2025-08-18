import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavContainer = styled.nav`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  
  @media (min-width: 768px) {
    display: none; /* Hide on desktop */
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'none'};
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  min-width: 56px;
  min-height: 56px;
  position: relative;
  box-shadow: ${props => props.active ? '0 4px 20px rgba(102, 126, 234, 0.4)' : 'none'};
  
  &:hover {
    color: ${props => props.active ? 'white' : 'white'};
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.1)'};
    transform: ${props => props.active ? 'scale(1.05)' : 'scale(1.1)'};
  }
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  margin-top: 0.25rem;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
`;

function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHome = location.pathname === '/';
  const isSearch = location.pathname === '/search';

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <BottomNavContainer>
      <NavItems>
        <NavItem
          active={isHome}
          onClick={() => handleNavigation('/')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavIcon>
            <Home size={24} />
          </NavIcon>
          <NavLabel active={isHome}>Home</NavLabel>
        </NavItem>

        <NavItem
          active={isSearch}
          onClick={() => handleNavigation('/search')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavIcon>
            <Search size={24} />
          </NavIcon>
          <NavLabel active={isSearch}>Search</NavLabel>
        </NavItem>
      </NavItems>
    </BottomNavContainer>
  );
}

export default BottomNavigation;
