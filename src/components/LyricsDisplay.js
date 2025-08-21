import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Copy, Download, RotateCcw, Brain, Eye, EyeOff } from 'lucide-react';
import { getLyricsMeaning } from '../services/lyricsService';
import toast from 'react-hot-toast';

const Container = styled(motion.div)`
  background: #f7fafc;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #e2e8f0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.h2`
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SongStats = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #718096;
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

const CopyButton = styled(ActionButton)`
  background: #4299e1;
  color: white;
  
  &:hover {
    background: #3182ce;
  }
`;

const DownloadButton = styled(ActionButton)`
  background: #48bb78;
  color: white;
  
  &:hover {
    background: #38a169;
  }
`;

const ResetButton = styled(ActionButton)`
  background: #ed8936;
  color: white;
  
  &:hover {
    background: #dd6b20;
  }
`;

const LyricsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  max-height: 500px;
  overflow-y: auto;
  position: relative;
`;

const LyricsText = styled.pre`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #2d3748;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const CopySuccess = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #48bb78;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 10;
`;

const UnderstandButton = styled(ActionButton)`
  background: #8b5cf6;
  color: white;
  
  &:hover {
    background: #7c3aed;
  }
`;

const ToggleButton = styled(ActionButton)`
  background: #64748b;
  color: white;
  
  &:hover {
    background: #475569;
  }
`;

const MeaningsContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const MeaningHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MeaningTitle = styled.h4`
  color: #7c3aed;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MeaningItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.1);
`;

const MeaningLine = styled.div`
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const MeaningText = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
  font-style: italic;
`;

const MeaningType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
`;

const LyricType = styled(MeaningType)`
  background: #e2e8f0;
  color: #4a5568;
`;

const MeaningTypeBadge = styled(MeaningType)`
  background: #c6f6d5;
  color: #22543d;
`;

const StanzaType = styled(MeaningType)`
  background: #fed7d7;
  color: #742a2a;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #8b5cf6;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function LyricsDisplay({ lyrics, onReset, initialMeanings = null, autoShowMeanings = false }) {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [meanings, setMeanings] = useState(initialMeanings);
  const [loadingMeanings, setLoadingMeanings] = useState(false);
  const [showMeanings, setShowMeanings] = useState(autoShowMeanings && !!initialMeanings);

  React.useEffect(() => {
    if (initialMeanings) {
      setMeanings(initialMeanings);
      if (autoShowMeanings) setShowMeanings(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMeanings]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics.lyrics);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy lyrics:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = lyrics.lyrics;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([lyrics.lyrics], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lyrics.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_lyrics.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUnderstandMeaning = async () => {
    if (loadingMeanings) return;
    
    setLoadingMeanings(true);
    try {
      const { data: meaningData, cached } = await getLyricsMeaning({
        lyrics: lyrics.lyrics,
        title: lyrics.title,
        songId: null,
        customInstructions: "Focus on emotional interpretation, metaphors, and deeper meaning. Keep explanations concise but insightful."
      });
      
      // eslint-disable-next-line no-console
      console.log(`[Meaning] Source: ${cached ? 'cache' : 'gemini'}`);

      setMeanings(meaningData);
      setShowMeanings(true);
      toast.success('Lyrics meaning generated successfully!');
    } catch (error) {
      toast.error(`Failed to get lyrics meaning: ${error.message}`);
      console.error('Error getting lyrics meaning:', error);
    } finally {
      setLoadingMeanings(false);
    }
  };

  const toggleMeanings = () => {
    setShowMeanings(!showMeanings);
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Lyric':
        return <LyricType>{type}</LyricType>;
      case 'Meaning':
        return <MeaningTypeBadge>{type}</MeaningTypeBadge>;
      case 'Stanza':
        return <StanzaType>{type}</StanzaType>;
      default:
        return <MeaningType>{type}</MeaningType>;
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <SongInfo>
          <SongTitle>🎵 {lyrics.title}</SongTitle>
          <SongStats>
            <Stat>📝 {formatNumber(lyrics.words)} words</Stat>
            <Stat>📄 {formatNumber(lyrics.lines)} lines</Stat>
            <Stat>🔤 {formatNumber(lyrics.characters)} characters</Stat>
          </SongStats>
        </SongInfo>
        
        <ActionButtons>
          <CopyButton
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy size={16} />
            Copy
          </CopyButton>
          
          <DownloadButton
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            Download
          </DownloadButton>

          <UnderstandButton
            onClick={handleUnderstandMeaning}
            disabled={loadingMeanings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loadingMeanings ? <LoadingSpinner /> : <Brain size={16} />}
            {loadingMeanings ? 'Analyzing...' : 'Understand Meaning'}
          </UnderstandButton>
          
          <ResetButton
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} />
            New Search
          </ResetButton>
        </ActionButtons>
      </Header>

      <LyricsContainer>
        {showCopySuccess && (
          <CopySuccess
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✅ Copied to clipboard!
          </CopySuccess>
        )}
        
        <LyricsText>{lyrics.lyrics}</LyricsText>
      </LyricsContainer>

      {meanings && (
        <MeaningsContainer>
          <MeaningHeader>
            <MeaningTitle>
              <Brain size={18} />
              Lyrics Analysis
            </MeaningTitle>
            <ToggleButton
              onClick={toggleMeanings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showMeanings ? <EyeOff size={16} /> : <Eye size={16} />}
              {showMeanings ? 'Hide Meanings' : 'Show Meanings'}
            </ToggleButton>
          </MeaningHeader>
          
          {showMeanings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {(Array.isArray(meanings?.lyricsMeaning) ? meanings.lyricsMeaning : []).map((item, index) => (
                <MeaningItem key={index}>
                  <MeaningLine>
                    {item.Line}
                    {getTypeBadge(item.Type)}
                  </MeaningLine>
                  {item.Type === 'Lyric' && (
                    <MeaningText>
                      <strong>Original lyric line</strong>
                    </MeaningText>
                  )}
                  {item.Type === 'Meaning' && (
                    <MeaningText>
                      <strong>Interpretation:</strong> {item.Line}
                    </MeaningText>
                  )}
                  {item.Type === 'Stanza' && (
                    <MeaningText>
                      <strong>Stanza Summary:</strong> {item.Line}
                    </MeaningText>
                  )}
                </MeaningItem>
              ))}
            </motion.div>
          )}
        </MeaningsContainer>
      )}
    </Container>
  );
}

export default LyricsDisplay;
