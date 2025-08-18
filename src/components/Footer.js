import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Github, ExternalLink } from 'lucide-react';

const FooterContainer = styled.footer`
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  margin-top: auto;
  margin-bottom: 5rem; /* Add bottom margin for mobile nav */
  
  @media (min-width: 768px) {
    margin-bottom: 0; /* Reset margin for desktop */
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: white;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const HeartIcon = styled(motion.span)`
  color: #ff6b6b;
  display: inline-block;
`;

const TechStack = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const TechBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          Made with <HeartIcon whileHover={{ scale: 1.2 }}><Heart size={16} /></HeartIcon> by the LyricsAI Team
        </FooterText>
        
        <TechStack>
          <TechBadge>React</TechBadge>
          <TechBadge>Node.js</TechBadge>
          <TechBadge>AI-Powered</TechBadge>
          <TechBadge>Spotify API</TechBadge>
        </TechStack>
        
        <FooterLinks>
          <FooterLink
            href="https://github.com/aftabm25/lyrics-extractor-frontend"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github size={16} />
            Frontend Code
          </FooterLink>
          
          <FooterLink
            href="https://github.com/aftabm25/lyrics-extractor-api"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github size={16} />
            Backend Code
          </FooterLink>
          
          <FooterLink
            href="https://web-production-176d5.up.railway.app/api/health"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink size={16} />
            API Status
          </FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
