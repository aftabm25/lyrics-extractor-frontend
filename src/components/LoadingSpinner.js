import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
`;

const SearchIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

function LoadingSpinner() {
  return (
    <Container
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SearchIcon>🔍</SearchIcon>
      <Spinner />
      <LoadingText>Searching for lyrics...</LoadingText>
      <LoadingText style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
        This may take a few seconds
      </LoadingText>
    </Container>
  );
}

export default LoadingSpinner;
