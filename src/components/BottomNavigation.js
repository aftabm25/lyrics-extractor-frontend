import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavContainer = styled.nav`
  position: fixed;
  bottom: 1.5rem;
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
  gap: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 1rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
`;

const NavItem = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'none'};
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  padding: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  min-width: 64px;
  min-height: 64px;
  position: relative;
  box-shadow: ${props => props.active ? '0 8px 25px rgba(102, 126, 234, 0.4)' : 'none'};
  
  &:hover {
    color: ${props => props.active ? 'white' : 'white'};
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.15)'};
    transform: ${props => props.active ? 'scale(1.05)' : 'scale(1.1)'};
  }
`;

const NavIcon = styled.div`
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  margin-top: 0.25rem;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  letter-spacing: 0.5px;
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

        {/* Search navigation temporarily disabled - uncomment to re-enable
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
        */}
      </NavItems>
    </BottomNavContainer>
  );
}

export default BottomNavigation;
