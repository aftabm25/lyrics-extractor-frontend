import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { getLyricsMeaning } from '../services/lyricsService';
import toast from 'react-hot-toast';

const Container = styled(motion.div)`
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 0.5rem;
    max-height: 80vh;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 0.25rem;
    max-height: 75vh;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.h2`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SongStats = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

// Raw lyrics UI removed to only focus on meanings

const UnderstandButton = styled(ActionButton)`
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: white;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
  }
`;

const DevelopmentNote = styled.div`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
`;

const MeaningsContainer = styled.div`
  margin-top: 1rem;
  padding: 2rem;
  background: rgba(96, 165, 250, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(96, 165, 250, 0.1);
`;

const MeaningHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(96, 165, 250, 0.2);
`;

const MeaningTitle = styled.h4`
  color: #60a5fa;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MeaningItem = styled(motion.div)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MeaningLine = styled.div`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MeaningText = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  font-style: normal;
  background: rgba(96, 165, 250, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid rgba(96, 165, 250, 0.4);
`;

const MeaningType = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const LyricType = styled(MeaningType)`
  background: linear-gradient(135deg, #374151, #4b5563);
  color: #d1d5db;
  border: 1px solid #6b7280;
`;

const MeaningTypeBadge = styled(MeaningType)`
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  border: 1px solid #34d399;
`;

const StanzaType = styled(MeaningType)`
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  border: 1px solid #f87171;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const JsonViewer = styled.div`
  background: #0f172a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.85rem;
  color: #e2e8f0;
  overflow-x: auto;
  border: 1px solid #334155;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const JsonKey = styled.span`
  color: #7dd3fc;
`;

const JsonString = styled.span`
  color: #fbbf24;
`;

const JsonType = styled.span`
  color: #f97316;
`;

const JsonArray = styled.span`
  color: #60a5fa;
`;

const JsonObject = styled.span`
  color: #34d399;
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
  const [meanings, setMeanings] = useState(initialMeanings);
  const [loadingMeanings, setLoadingMeanings] = useState(false);
  const [showJson, setShowJson] = useState(false);

  // Mock example data for development
  const mockMeanings = {
    songId: null,
    lyricsMeaning: [
      {
        LineNo: 0,
        Line: "Hello, is it me you're looking for?",
        Type: "Lyric"
      },
      {
        LineNo: 1,
        Line: "This opening line creates an immediate sense of longing and vulnerability. The speaker is reaching out, uncertain if their message will be received or reciprocated. It's a universal feeling of seeking connection.",
        Type: "Meaning"
      },
      {
        LineNo: 2,
        Line: "I can see it in your eyes, I can see it in your smile",
        Type: "Lyric"
      },
      {
        LineNo: 3,
        Line: "The speaker finds hope and recognition in the other person's nonverbal cues. This suggests a deep emotional connection that transcends words, where two people can communicate through subtle expressions.",
        Type: "Meaning"
      },
      {
        LineNo: 4,
        Line: "You're all I've ever wanted, and my arms are open wide",
        Type: "Lyric"
      },
      {
        LineNo: 5,
        Line: "This line reveals the depth of the speaker's desire and vulnerability. They're offering themselves completely, arms open wide symbolizing both emotional and physical availability and trust.",
        Type: "Meaning"
      },
      {
        LineNo: 6,
        Line: "The first verse establishes the theme of searching and connection, setting up the emotional journey of the song. It introduces the central question that drives the narrative and builds emotional intensity through vulnerability.",
        Type: "Stanza"
      },
      {
        LineNo: 7,
        Line: "The chorus builds emotional intensity, moving from observation to declaration. It's a moment of complete emotional honesty and surrender to love, culminating in a powerful expression of devotion.",
        Type: "Stanza"
      }
    ]
  };

  React.useEffect(() => {
    if (initialMeanings) {
      setMeanings(initialMeanings);
    } else {
      // Set mock data for development
      setMeanings(mockMeanings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMeanings]);

  const handleUnderstandMeaning = async () => {
    if (loadingMeanings) return;
    
    setLoadingMeanings(true);
    try {
      const { data: meaningData, cached } = await getLyricsMeaning({
        lyrics: lyrics.lyrics,
        title: lyrics.title,
        songId: null,
        customInstructions: "Focus on emotional interpretation, metaphors, and deeper meaning. Keep explanations concise but insightful. Follow the exact schema format with LineNo starting at 0, alternating Lyric/Meaning pairs, and Stanza summaries every 4-5 pairs."
      });
      
      // eslint-disable-next-line no-console
      console.log(`[Meaning] Source: ${cached ? 'cache' : 'gemini'}`);

      setMeanings(meaningData);
      toast.success('Lyrics meaning generated successfully!');
    } catch (error) {
      toast.error(`Failed to get lyrics meaning: ${error.message}`);
      console.error('Error getting lyrics meaning:', error);
    } finally {
      setLoadingMeanings(false);
    }
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

  const renderJsonValue = (value, depth = 0) => {
    const indent = '  '.repeat(depth);
    
    if (value === null) {
      return <JsonType>null</JsonType>;
    }
    
    if (typeof value === 'boolean') {
      return <JsonType>{value.toString()}</JsonType>;
    }
    
    if (typeof value === 'number') {
      return <JsonType>{value}</JsonType>;
    }
    
    if (typeof value === 'string') {
      return <JsonString>"{value}"</JsonString>;
    }
    
    if (Array.isArray(value)) {
      return (
        <span>
          <JsonArray>[</JsonArray>
          {value.length === 0 ? (
            <JsonArray>]</JsonArray>
          ) : (
            <>
              <br />
              {value.map((item, index) => (
                <div key={index} style={{ marginLeft: '20px' }}>
                  {indent}  {renderJsonValue(item, depth + 1)}
                  {index < value.length - 1 && <JsonArray>,</JsonArray>}
                </div>
              ))}
              <br />
              {indent}<JsonArray>]</JsonArray>
            </>
          )}
        </span>
      );
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      return (
        <span>
          <JsonObject>{'{'}</JsonObject>
          {keys.length === 0 ? (
            <JsonObject>}</JsonObject>
          ) : (
            <>
              <br />
              {keys.map((key, index) => (
                <div key={key} style={{ marginLeft: '20px' }}>
                  {indent}  <JsonKey>"{key}"</JsonKey>: {renderJsonValue(value[key], depth + 1)}
                  {index < keys.length - 1 && <JsonArray>,</JsonArray>}
                </div>
              ))}
              <br />
              {indent}<JsonObject>{'}'}</JsonObject>
            </>
          )}
        </span>
      );
    }
    
    return <JsonString>"{String(value)}"</JsonString>;
  };

  const renderMeanings = () => {
    if (!meanings || !meanings.lyricsMeaning) {
      return (
        <EmptyState>
          <EmptyStateIcon>🎵</EmptyStateIcon>
          <EmptyStateText>
            Click "Generate New Meaning" to analyze the lyrics and discover their deeper meaning
          </EmptyStateText>
        </EmptyState>
      );
    }

    const meaningsArray = Array.isArray(meanings.lyricsMeaning) ? meanings.lyricsMeaning : [];

    if (meaningsArray.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>🤔</EmptyStateIcon>
          <EmptyStateText>
            No meanings found. Try clicking "Generate New Meaning" again.
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <>
        {meaningsArray.map((item, index) => (
          <MeaningItem 
            key={item.LineNo || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
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
        
        {showJson && (
          <JsonViewer>
            <div style={{ marginBottom: '0.5rem', color: '#a0aec0', fontSize: '0.8rem' }}>
              Raw JSON Response:
            </div>
            {renderJsonValue(meanings, 0)}
          </JsonViewer>
        )}
      </>
    );
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
          <UnderstandButton
            onClick={handleUnderstandMeaning}
            disabled={loadingMeanings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loadingMeanings ? <LoadingSpinner /> : <Brain size={16} />}
            {loadingMeanings ? 'Analyzing...' : 'Generate New Meaning'}
          </UnderstandButton>
        </ActionButtons>
      </Header>

      <MeaningsContainer>
        <MeaningHeader>
          <MeaningTitle>
            <Brain size={20} />
            Lyrics Analysis
          </MeaningTitle>
          {meanings && meanings.lyricsMeaning && (
            <motion.button
              onClick={() => setShowJson(!showJson)}
              style={{
                background: '#4a5568',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showJson ? 'Hide' : 'Show'} JSON
            </motion.button>
          )}
        </MeaningHeader>
        
        {!initialMeanings && (
          <DevelopmentNote>
            🚧 Development Mode: Showing mock data. Click "Generate New Meaning" to test the API.
          </DevelopmentNote>
        )}
        
        {renderMeanings()}
      </MeaningsContainer>
    </Container>
  );
}

export default LyricsDisplay;
