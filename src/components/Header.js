import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LogOut, Music, Sparkles } from 'lucide-react';
import { hasValidSpotifySession, clearSpotifySession, getSpotifyAuthURL, getStoredAccessToken, getUserProfile } from '../services/spotifyService';

const HeaderContainer = styled.header`
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientFlow 3s ease infinite;
  
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  &:hover {
    text-decoration: none;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    gap: 0.4rem;
  }
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    gap: 0.3rem;
  }
`;

const LogoText = styled.span`
  @media (max-width: 640px) {
    display: none;
  }
`;

const BackendStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(72, 187, 120, 0.1);
  border: 1px solid rgba(72, 187, 120, 0.3);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
    gap: 0.4rem;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #48bb78;
  animation: pulse 2s infinite;
  box-shadow: 0 0 8px rgba(72, 187, 120, 0.5);
  
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const SpotifySection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

const SpotifyProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(29, 185, 84, 0.1);
  border: 1px solid rgba(29, 185, 84, 0.3);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    gap: 0.6rem;
  }
  
  @media (max-width: 640px) {
    .profile-text {
      display: none;
    }
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
    gap: 0.4rem;
  }
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(29, 185, 84, 0.5);
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    border-width: 1.5px;
  }
  
  @media (max-width: 640px) {
    width: 24px;
    height: 24px;
    border-width: 1.5px;
  }
  
  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
    border-width: 1px;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

const ProfileName = styled.span`
  font-weight: 600;
  color: white;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const SpotifyIcon = styled.div`
  color: #1db954;
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const LogoutButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #ee5a24, #ff6b6b);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 640px) {
    .logout-text {
      display: none;
    }
    padding: 0.4rem 0.6rem;
    gap: 0.3rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
    gap: 0.3rem;
    min-width: 40px;
    justify-content: center;
  }
`;

const ConnectButton = styled(motion.button)`
  background: linear-gradient(135deg, #1db954, #1ed760);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
  white-space: nowrap;
  
  &:hover {
    background: linear-gradient(135deg, #1ed760, #1db954);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(29, 185, 84, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 640px) {
    padding: 0.4rem 0.7rem;
    font-size: 0.7rem;
    gap: 0.3rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
    gap: 0.3rem;
    min-width: 100px;
    max-width: 120px;
  }
`;

function Header() {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check if user is connected to Spotify
    const checkSpotifyConnection = async () => {
      const connected = hasValidSpotifySession();
      setIsSpotifyConnected(connected);
      
      if (connected) {
        // Fetch user profile if connected
        try {
          const accessToken = getStoredAccessToken();
          if (accessToken) {
            const profile = await getUserProfile(accessToken);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
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
    setUserProfile(null);
    // Force a page reload to clear any cached state
    window.location.reload();
  };

  const handleSpotifyConnect = () => {
    // Redirect to Spotify authorization
    const authUrl = getSpotifyAuthURL();
    window.location.href = authUrl;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo
            as="a"
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogoIcon>
              <Music size={28} />
              <Sparkles size={18} />
            </LogoIcon>
            <LogoText>LyricsAI</LogoText>
          </Logo>
          
          <BackendStatus>
            <StatusDot />
            <span>Online</span>
          </BackendStatus>
        </LeftSection>
        
        <RightSection>
          <SpotifySection>
            {isSpotifyConnected ? (
              <>
                <SpotifyProfile>
                  {userProfile?.images?.[0]?.url ? (
                    <ProfileImage 
                      src={userProfile.images[0].url} 
                      alt={userProfile.display_name || 'Profile'} 
                    />
                  ) : (
                    <SpotifyIcon>
                      <Music size={16} />
                    </SpotifyIcon>
                  )}
                  <ProfileInfo>
                    <ProfileName>{userProfile?.display_name || 'Connected'}</ProfileName>
                    <span className="profile-text">Connected</span>
                  </ProfileInfo>
                </SpotifyProfile>
                
                <LogoutButton
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={16} />
                  <span className="logout-text">Logout</span>
                </LogoutButton>
              </>
            ) : (
              <ConnectButton
                onClick={handleSpotifyConnect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="connect-text">Connect to Spotify</span>
              </ConnectButton>
            )}
          </SpotifySection>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
