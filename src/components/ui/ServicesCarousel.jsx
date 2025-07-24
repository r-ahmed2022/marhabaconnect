import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../../servicesData'; 

const CarouselContainer = styled.div`
   position: relative;
  width: 320px;
  height: 400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    width: 300px;
    height: 380px;
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 360px;
  }

  @media (max-width: 480px) {
    width: 260px;
    height: 340px;
  }

  @media (max-width: 375px) {
    width: 240px;
    height: 320px;
  }
`;

const CardContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const ServiceCard = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: float 3s ease-in-out infinite;
  touch-action: manipulation;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: 1024px) {
    padding: 22px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 18px;
    border-radius: 12px;
  }

  @media (max-width: 375px) {
    padding: 16px;
  }
`;

const ServiceImage = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ff9900;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const CardContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ServiceName = styled.h3`
  font-family: 'Cairo', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const FeaturesList = styled.ul`
  font-family: 'Cairo', sans-serif;
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  list-style: none;
  padding: 0;
  margin: 16px 0;
  text-align: left;
  width: 100%;

  li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
  }

  li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0;
    color: #ff9900;
    font-weight: bold;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;

    li {
      padding-left: 18px;
      margin-bottom: 6px;
    }

    li::before {
      font-size: 1rem;
    }
  }
`;

const NavigationDots = styled.div`
   position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
`;

const Dot = styled.button`
    width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isActive ? '#ff9900' : 'rgba(255, 255, 255, 0.5)'};

  &:hover {
    background-color: ${props => props.isActive ? '#ff9900' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const ServicesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 2000);
  };

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <CarouselContainer>
      <CardContainer>
        <AnimatePresence mode="wait">
          <ServiceCard
            key={services[currentIndex].name}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ServiceImage>
              <img src={services[currentIndex].image} alt={services[currentIndex].name} />
            </ServiceImage>
            <CardContent>
              <ServiceName>{services[currentIndex].name}</ServiceName>
              <FeaturesList>
                {services[currentIndex].features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </FeaturesList>
            </CardContent>
          </ServiceCard>
        </AnimatePresence>
      </CardContainer>
      <NavigationDots>
        {services.map((_, index) => (
          <Dot
            key={index}
            isActive={index === currentIndex}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </NavigationDots>
    </CarouselContainer>
  );
};

export default ServicesCarousel;