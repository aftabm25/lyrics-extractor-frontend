import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FooterLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
    text-decoration: none;
  }
`;

const Version = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          © 2024 Lyrics Extractor. Powered by{' '}
          <FooterLink
            href="https://web-production-176d5.up.railway.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
          >
            Railway Backend
          </FooterLink>
        </FooterText>
        
        <FooterLinks>
          <FooterLink
            href="https://web-production-176d5.up.railway.app/api/health"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
          >
            API Health
          </FooterLink>
          
          <FooterLink
            href="https://web-production-176d5.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
          >
            API Docs
          </FooterLink>
          
          <Version>v1.0.0</Version>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
