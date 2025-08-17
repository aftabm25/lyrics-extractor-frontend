import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { extractLyrics } from '../services/lyricsService';
import SpotifyConnect from './SpotifyConnect';
import LyricsDisplay from './LyricsDisplay';
import LoadingSpinner from './LoadingSpinner';

const Container = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  text-align: center;
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #718096;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fed7d7;
  border-radius: 8px;
  border: 1px solid #feb2b2;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #c6f6d5;
  border-radius: 8px;
  border: 1px solid #9ae6b4;
`;

function LyricsExtractor() {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleLyricsFound = (lyricsData) => {
    setLyrics(lyricsData);
    setSuccess(`Successfully found lyrics for "${lyricsData.title}"!`);
    setError('');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setLyrics(null);

    try {
      const result = await extractLyrics(data.songName);
      setLyrics(result);
      setSuccess(`Successfully found lyrics for "${result.title}"!`);
      toast.success('Lyrics extracted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to extract lyrics. Please try again.');
      toast.error('Failed to extract lyrics');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLyrics(null);
    setError('');
    setSuccess('');
    reset();
  };

  return (
    <Container
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Title>🎵 Lyrics Extractor</Title>
      <Subtitle>
        Find lyrics for any song, even with misspelled names!
      </Subtitle>

      <SpotifyConnect onLyricsFound={handleLyricsFound} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Input
            {...register('songName', { 
              required: 'Song name is required',
              minLength: { value: 2, message: 'Song name must be at least 2 characters' }
            })}
            placeholder="Enter song name (e.g., Shape of You, Bohemian Rhapsody)"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Searching...' : 'Find Lyrics'}
          </Button>
        </InputGroup>
        
        {errors.songName && (
          <ErrorMessage>{errors.songName.message}</ErrorMessage>
        )}
      </Form>

      {loading && <LoadingSpinner />}
      
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}
      
      {success && (
        <SuccessMessage>
          <strong>Success:</strong> {success}
        </SuccessMessage>
      )}

      {lyrics && (
        <LyricsDisplay 
          lyrics={lyrics} 
          onReset={handleReset}
        />
      )}
    </Container>
  );
}

export default LyricsExtractor;
