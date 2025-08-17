import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Copy, Download, RotateCcw } from 'lucide-react';

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

function LyricsDisplay({ lyrics, onReset }) {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

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

  const formatNumber = (num) => {
    return num.toLocaleString();
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
    </Container>
  );
}

export default LyricsDisplay;
