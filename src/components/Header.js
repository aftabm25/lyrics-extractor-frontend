import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { hasValidSpotifySession, clearSpotifySession } from '../services/spotifyService';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: white;
  }
`;

const LogoIcon = styled.span`
  font-size: 2rem;
`;

const LogoText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
    text-decoration: none;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #48bb78;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const LogoutButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

function Header() {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
    // Check if user is connected to Spotify
    const checkSpotifyConnection = () => {
      const connected = hasValidSpotifySession();
      setIsSpotifyConnected(connected);
    };

    checkSpotifyConnection();
    
    // Listen for storage changes to update connection status
    const handleStorageChange = () => {
      checkSpotifyConnection();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically
    const interval = setInterval(checkSpotifyConnection, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    clearSpotifySession();
    setIsSpotifyConnected(false);
    // Force a page reload to clear any cached state
    window.location.reload();
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo
          as="a"
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogoIcon>🎵</LogoIcon>
          <LogoText>Lyrics Extractor</LogoText>
        </Logo>
        
        <Nav>
          <NavLink
            href="https://web-production-176d5.up.railway.app/api/health"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            API Status
          </NavLink>
          
          <StatusIndicator>
            <StatusDot />
            <span>Backend Online</span>
          </StatusIndicator>

          {isSpotifyConnected && (
            <LogoutButton
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
              Logout
            </LogoutButton>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
