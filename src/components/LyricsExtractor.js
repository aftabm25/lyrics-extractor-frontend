import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Search, Sparkles, Play } from 'lucide-react';
import { extractLyrics, getLyricsMeaningCached } from '../services/lyricsService';
import { hasValidSpotifySession, getStoredAccessToken, getCurrentlyPlayingTrack, extractTrackInfo } from '../services/spotifyService';
import LyricsDisplay from './LyricsDisplay';
import LoadingSpinner from './LoadingSpinner';

const Container = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 30px;
  padding: 3rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
    pointer-events: none;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 20px;
    margin: 0 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 15px;
    margin: 0 0.5rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  font-size: 3.5rem;
  font-weight: 800;
  animation: gradientFlow 4s ease infinite;
  
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.25rem;
    padding: 0 0.25rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.25rem 1rem 3rem;
    font-size: 1rem;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1rem 0.875rem 3rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 2;
  pointer-events: none;
  
  @media (max-width: 768px) {
    left: 1rem;
  }
  
  @media (max-width: 480px) {
    left: 0.875rem;
  }
`;

const Button = styled(motion.button)`
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 15px;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
    border-radius: 12px;
    gap: 0.5rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #dc2626;
  text-align: center;
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  border-radius: 15px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);
  
  @media (max-width: 768px) {
    margin-top: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: 12px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.9rem;
  }
`;

// Current Spotify track UI
const CurrentTrackCard = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  margin-bottom: 1.25rem;
`;

const TrackMain = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AlbumArt = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
`;

const TrackTitle = styled.div`
  font-weight: 700;
  color: #1e293b;
`;

const TrackArtist = styled.div`
  font-size: 0.9rem;
  color: #64748b;
`;

const TrackAlbum = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const AnalyzeButton = styled(motion.button)`
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px rgba(102,126,234,0.35);
  transition: all 0.2s ease;
`;

function LyricsExtractor() {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [analyzingCurrent, setAnalyzingCurrent] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

  const onSubmit = async (data) => {
    if (!data.song_name.trim()) {
      setError('Please enter a song name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await extractLyrics(data.song_name);
      setLyrics(result);
      toast.success('Lyrics found successfully!');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to extract lyrics');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLyrics(null);
    setError('');
    reset();
  };

  const analyzeCurrentSong = async () => {
    if (!currentTrack || analyzingCurrent) return;
    setAnalyzingCurrent(true);
    setError('');
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
        _initialMeanings: data.lyricsMeaning || null,
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

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <InputWrapper>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <Input
              {...register('song_name', { required: true })}
              placeholder="Enter song name or artist..."
              disabled={loading}
            />
          </InputWrapper>
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Searching...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Find Lyrics
              </>
            )}
          </Button>
        </InputGroup>
        
        {errors.song_name && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Song name is required
          </ErrorMessage>
        )}
        
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}
      </Form>
    </Container>
  );
}

export default LyricsExtractor;
