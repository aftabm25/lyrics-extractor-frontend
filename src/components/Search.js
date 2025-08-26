import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { extractLyrics } from '../services/lyricsService';
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
  margin-bottom: 3.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2.5rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.25rem;
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
  padding: 1.5rem 1.75rem 1.5rem 4rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: white;
  
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.1), 0 8px 25px rgba(96, 165, 250, 0.15);
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem 1.25rem 3.5rem;
    font-size: 1.1rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 1.125rem 1.25rem 1.125rem 3.25rem;
    font-size: 1rem;
    border-radius: 18px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  z-index: 2;
  pointer-events: none;
  
  @media (max-width: 768px) {
    left: 1.25rem;
  }
  
  @media (max-width: 480px) {
    left: 1.125rem;
  }
`;

const Button = styled(motion.button)`
  padding: 1.5rem 3rem;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3);
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(96, 165, 250, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 20px;
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.125rem 2rem;
    font-size: 1rem;
    border-radius: 18px;
    gap: 0.75rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #fca5a5;
  text-align: center;
  margin-top: 1.5rem;
  padding: 1.25rem 1.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);
  
  @media (max-width: 768px) {
    margin-top: 1.25rem;
    padding: 1rem 1.5rem;
    border-radius: 16px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    padding: 0.875rem 1.25rem;
    border-radius: 14px;
    font-size: 0.95rem;
  }
`;

function Search() {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

  if (lyrics) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LyricsDisplay lyrics={lyrics} onReset={handleReset} />
      </motion.div>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Title>Search Lyrics</Title>
      <Subtitle>
        Find lyrics for any song and discover their deeper meaning with AI analysis
      </Subtitle>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <InputWrapper>
            <SearchIconWrapper>
              <SearchIcon size={20} />
            </SearchIconWrapper>
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

export default Search;
