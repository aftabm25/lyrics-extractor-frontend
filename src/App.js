import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LyricsExtractor from './components/LyricsExtractor';
import Search from './components/Search';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import { hasValidSpotifySession, exchangeCodeForToken, storeSpotifyTokens } from './services/spotifyService';
import toast from 'react-hot-toast';
import './styles/App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  flex-direction: column;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const MainContent = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 6rem; /* Add bottom padding for mobile nav */
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="music-notes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><text x="50" y="50" font-family="Arial" font-size="8" fill="rgba(255,255,255,0.03)" text-anchor="middle">♪♫♬</text></pattern></defs><rect width="100" height="100" fill="url(%23music-notes)"/></svg>');
    pointer-events: none;
    z-index: 0;
  }
  
  @media (min-width: 768px) {
    padding-bottom: 2rem; /* Reset padding for desktop */
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
`;

function App() {
  useEffect(() => {
    // Handle Spotify OAuth callback
    const handleSpotifyCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          // Exchange authorization code for access token
          const tokenData = await exchangeCodeForToken(code);
          
          // Store tokens
          storeSpotifyTokens(tokenData);
          
          toast.success('Spotify connected successfully!');
          
          // Clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Force a page reload to update the header state
          window.location.reload();
        } catch (error) {
          toast.error('Failed to connect to Spotify');
          console.error('Spotify callback error:', error);
          
          // Clear the URL parameters even on error
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    // Check if this is a Spotify callback
    handleSpotifyCallback();
  }, []);

  return (
    <Router>
      <AppContainer>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(26, 26, 46, 0.95)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        
        <Header />
        
        <MainContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<LyricsExtractor />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </ContentWrapper>
        </MainContent>
        
        <BottomNavigation />
      </AppContainer>
    </Router>
  );
}

export default App;
