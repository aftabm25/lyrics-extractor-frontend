import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Music, Play, Pause, ExternalLink, LogOut } from 'lucide-react';
import { 
  getSpotifyAuthURL, 
  hasValidSpotifySession, 
  getStoredAccessToken,
  getCurrentlyPlayingTrack,
  getUserProfile,
  clearSpotifySession,
  extractTrackInfo,
  exchangeCodeForToken,
  storeSpotifyTokens
} from '../services/spotifyService';
import { extractLyrics } from '../services/lyricsService';
import toast from 'react-hot-toast';

const Container = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConnectButton = styled(motion.button)`
  background: #1DB954;
  color: white;
  border: none;
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
    background: #1ed760;
    transform: translateY(-2px);
  }
`;

const DisconnectButton = styled(motion.button)`
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

const CurrentTrackContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AlbumArt = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  flex: 1;
`;

const TrackName = styled.h4`
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TrackArtist = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
`;

const TrackAlbum = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const GetLyricsButton = styled(ActionButton)`
  background: #667eea;
  color: white;
  
  &:hover {
    background: #5a67d8;
  }
`;

const SpotifyButton = styled(ActionButton)`
  background: #1DB954;
  color: white;
  
  &:hover {
    background: #1ed760;
  }
`;

const NoTrackMessage = styled.div`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 2rem;
  font-style: italic;
`;

const LoadingMessage = styled.div`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 1rem;
`;

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1DB954;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1DB954;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ConnectedIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #1DB954;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

function SpotifyConnect({ onLyricsFound }) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define fetchUserProfile first
  const fetchUserProfile = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        setIsConnected(false);
        return;
      }

      const profileData = await getUserProfile(accessToken);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.message.includes('401')) {
        // Token expired
        setIsConnected(false);
        clearSpotifySession();
      }
    }
  }, [isConnected]);

  // Define fetchCurrentTrack
  const fetchCurrentTrack = useCallback(async () => {
    if (!isConnected) return;
    
    setIsRefreshing(true);
    try {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        setIsConnected(false);
        return;
      }

      const trackData = await getCurrentlyPlayingTrack(accessToken);
      if (trackData) {
        const trackInfo = extractTrackInfo(trackData);
        setCurrentTrack(trackInfo);
      } else {
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
      if (error.message.includes('401')) {
        // Token expired
        setIsConnected(false);
        clearSpotifySession();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isConnected]);

  // Define handleSpotifyCallback
  const handleSpotifyCallback = useCallback(async (code) => {
    try {
      // Exchange authorization code for access token
      const tokenData = await exchangeCodeForToken(code);
      
      // Store tokens
      storeSpotifyTokens(tokenData);
      
      toast.success('Spotify connected successfully!');
      setIsConnected(true);
      
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Fetch user profile and current track
      fetchUserProfile();
      fetchCurrentTrack();
    } catch (error) {
      toast.error('Failed to connect to Spotify');
      console.error('Spotify callback error:', error);
    }
  }, [fetchUserProfile, fetchCurrentTrack]);

  useEffect(() => {
    // Check if user is already connected to Spotify
    const connected = hasValidSpotifySession();
    setIsConnected(connected);
    
    if (connected) {
      fetchUserProfile();
      fetchCurrentTrack();
    }
  }, [fetchUserProfile, fetchCurrentTrack]);

  useEffect(() => {
    // Handle Spotify callback with authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !isConnected) {
      handleSpotifyCallback(code);
    }
  }, [isConnected, handleSpotifyCallback]);

  const connectToSpotify = () => {
    const authUrl = getSpotifyAuthURL();
    window.location.href = authUrl;
  };

  const disconnectFromSpotify = () => {
    clearSpotifySession();
    setIsConnected(false);
    setCurrentTrack(null);
    setUserProfile(null);
    toast.success('Disconnected from Spotify');
  };

  const getLyricsForCurrentTrack = async () => {
    if (!currentTrack) return;
    
    setIsLoading(true);
    try {
      const searchQuery = `${currentTrack.name} ${currentTrack.artist}`;
      const lyrics = await extractLyrics(searchQuery);
      
      if (onLyricsFound) {
        onLyricsFound(lyrics);
      }
      
      toast.success(`Found lyrics for "${currentTrack.name}"!`);
    } catch (error) {
      toast.error(`Failed to find lyrics: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openInSpotify = () => {
    if (currentTrack?.spotifyUrl) {
      window.open(currentTrack.spotifyUrl, '_blank');
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <Title>
          <Music size={20} />
          Spotify Integration
        </Title>
        
        {!isConnected ? (
          <ConnectButton
            onClick={connectToSpotify}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={16} />
            Connect Spotify
          </ConnectButton>
        ) : (
          <DisconnectButton
            onClick={disconnectFromSpotify}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={16} />
            Disconnect
          </DisconnectButton>
        )}
      </Header>

      {isConnected && (
        <>
          {/* User Profile Section */}
          <UserProfileContainer>
            {userProfile?.images?.[0]?.url ? (
              <ProfilePicture 
                src={userProfile.images[0].url} 
                alt={userProfile.display_name || 'Profile'} 
              />
            ) : (
              <ProfilePicture 
                src="https://via.placeholder.com/50x50/1DB954/FFFFFF?text=🎵" 
                alt="Default Profile" 
              />
            )}
            <UserInfo>
              <UserName>
                {userProfile?.display_name || 'Spotify User'}
              </UserName>
              <UserStatus>
                <ConnectedIndicator />
                Connected to Spotify
              </UserStatus>
            </UserInfo>
          </UserProfileContainer>

          {/* Current Track Section */}
          <CurrentTrackContainer>
            {isRefreshing ? (
              <LoadingMessage>Refreshing track info...</LoadingMessage>
            ) : currentTrack ? (
              <>
                <TrackInfo>
                  {currentTrack.albumArt && (
                    <AlbumArt src={currentTrack.albumArt} alt="Album Art" />
                  )}
                  <TrackDetails>
                    <TrackName>{currentTrack.name}</TrackName>
                    <TrackArtist>{currentTrack.artist}</TrackArtist>
                    <TrackAlbum>{currentTrack.album}</TrackAlbum>
                  </TrackDetails>
                  {currentTrack.isPlaying ? (
                    <Play size={20} color="#1DB954" />
                  ) : (
                    <Pause size={20} color="#FF6B6B" />
                  )}
                </TrackInfo>
                
                <ActionButtons>
                  <GetLyricsButton
                    onClick={getLyricsForCurrentTrack}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? 'Finding Lyrics...' : 'Get Lyrics'}
                  </GetLyricsButton>
                  
                  <SpotifyButton
                    onClick={openInSpotify}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    Open in Spotify
                  </SpotifyButton>
                  
                  <ActionButton
                    onClick={fetchCurrentTrack}
                    disabled={isRefreshing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={16} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Track'}
                  </ActionButton>
                </ActionButtons>
              </>
            ) : (
              <NoTrackMessage>
                No track currently playing. Start playing music on Spotify to see it here.
              </NoTrackMessage>
            )}
          </CurrentTrackContainer>
        </>
      )}
    </Container>
  );
}

export default SpotifyConnect;
