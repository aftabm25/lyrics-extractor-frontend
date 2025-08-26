import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Play } from 'lucide-react';
import { getLyricsMeaningCached } from '../services/lyricsService';
import { hasValidSpotifySession, getStoredAccessToken, getCurrentlyPlayingTrack, extractTrackInfo } from '../services/spotifyService';
import LyricsDisplay from './LyricsDisplay';
import LoadingSpinner from './LoadingSpinner';

const Container = styled(motion.div)`
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 4s infinite;
    pointer-events: none;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 24px;
    margin: 0 1rem;
    max-height: 85vh;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 20px;
    margin: 0 0.5rem;
    max-height: 80vh;
  }
`;

const Title = styled.h1`
  text-align: center;
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #f093fb, #f5576c);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  font-size: 4rem;
  font-weight: 800;
  animation: gradientFlow 4s ease infinite;
  letter-spacing: -0.02em;
  
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 0.25rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

// Removed home search form components to avoid duplication with /search page

// Current Spotify track UI
const CurrentTrackCard = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1.75rem;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.15);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const TrackMain = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const AlbumArt = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 12px 30px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    border-radius: 12px;
  }
`;

const TrackTitle = styled.div`
  font-weight: 700;
  color: white;
  font-size: 1.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TrackArtist = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const TrackAlbum = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const AnalyzeButton = styled(motion.button)`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(96, 165, 250, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
`;

function LyricsExtractor() {
  const [lyrics, setLyrics] = useState(null);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [analyzingCurrent, setAnalyzingCurrent] = useState(false);

  useEffect(() => {
    const checkConnAndFetch = async () => {
      const connected = hasValidSpotifySession();
      setIsSpotifyConnected(connected);
      if (!connected) return;
      const token = getStoredAccessToken();
      if (!token) return;
      try {
        const nowPlaying = await getCurrentlyPlayingTrack(token);
        if (nowPlaying) {
          const info = extractTrackInfo(nowPlaying);
          setCurrentTrack(info);
        } else {
          setCurrentTrack(null);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Current track fetch failed:', e?.message || e);
      }
    };
    checkConnAndFetch();
    const interval = setInterval(checkConnAndFetch, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    setLyrics(null);
  };

  const analyzeCurrentSong = async () => {
    if (!currentTrack || analyzingCurrent) return;
    setAnalyzingCurrent(true);
    try {
      const songName = `${currentTrack.name} ${currentTrack.artist}`;
      const { data } = await getLyricsMeaningCached({
        songId: currentTrack.id,
        title: currentTrack.name,
        artist: currentTrack.artist,
        songName
      });
      const lyricsText = data.lyrics || '';
      const computed = {
        title: data.title || `${currentTrack.artist} – ${currentTrack.name}`,
        lyrics: lyricsText,
        song_name: songName,
        characters: lyricsText.length,
        lines: lyricsText ? lyricsText.split('\n').length : 0,
        words: lyricsText ? lyricsText.trim().split(/\s+/).length : 0,
        _initialMeanings: data.lyricsMeaning ? { lyricsMeaning: data.lyricsMeaning } : null,
      };
      setLyrics(computed);
      toast.success('Analyzed current Spotify track');
    } catch (e) {
      toast.error(e.message || 'Failed to analyze current track');
    } finally {
      setAnalyzingCurrent(false);
    }
  };

  if (lyrics) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LyricsDisplay lyrics={lyrics} onReset={handleReset} initialMeanings={lyrics._initialMeanings || null} autoShowMeanings={!!lyrics._initialMeanings} />
      </motion.div>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Title>Discover Song Meanings</Title>
      <Subtitle>
        Unlock the hidden stories behind your favorite lyrics with AI-powered analysis
      </Subtitle>

      {isSpotifyConnected && currentTrack && (
        <CurrentTrackCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <TrackMain>
            {currentTrack.albumArt && <AlbumArt src={currentTrack.albumArt} alt="Album" />}
            <div>
              <TrackTitle>{currentTrack.name}</TrackTitle>
              <TrackArtist>{currentTrack.artist}</TrackArtist>
              <TrackAlbum>{currentTrack.album}</TrackAlbum>
            </div>
          </TrackMain>
          <AnalyzeButton
            onClick={analyzeCurrentSong}
            disabled={analyzingCurrent}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {analyzingCurrent ? <LoadingSpinner /> : <Play size={18} />}
            {analyzingCurrent ? 'Analyzing current song...' : 'Analyze current song'}
          </AnalyzeButton>
        </CurrentTrackCard>
      )}
    </Container>
  );
}

export default LyricsExtractor;
