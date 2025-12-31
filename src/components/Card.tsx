import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardData } from '../utils/cardTypes';
import { CardBack } from './CardBack';
import { CardFront } from './CardFront';
import './Card.css';

interface CardProps {
  card: CardData | null;
  onNext: () => void;
  hasMoreCards: boolean;
}

export function Card({ card, onNext, hasMoreCards }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Reset flip state when new card is drawn
  useEffect(() => {
    if (card) {
      setIsFlipped(false);
      setIsExiting(false);
      // Auto-flip after draw animation completes
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [card]);

  const handleNext = () => {
    setIsExiting(true);
    setTimeout(() => {
      onNext();
    }, 300);
  };

  if (!card) {
    return null;
  }

  // Detect mobile device for optimized animations
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

  const cardVariants = {
    initial: {
      y: -viewportHeight,
      opacity: 0,
      rotateY: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: isMobile ? 80 : 100,
        damping: isMobile ? 20 : 15,
        duration: isMobile ? 0.5 : 0.6,
      },
    },
    exit: {
      y: viewportHeight,
      opacity: 0,
      rotateY: 180,
      transition: {
        duration: isMobile ? 0.3 : 0.4,
        ease: 'easeInOut',
      },
    },
  };

  const flipVariants = {
    front: {
      rotateY: 0,
      transition: {
        duration: isMobile ? 0.5 : 0.6,
        ease: 'easeInOut',
      },
    },
    back: {
      rotateY: 180,
      transition: {
        duration: isMobile ? 0.5 : 0.6,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.id}
        className="card-container"
        variants={cardVariants}
        initial="initial"
        animate={isExiting ? 'exit' : 'animate'}
        exit="exit"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="card-inner"
          animate={isFlipped ? 'back' : 'front'}
          variants={flipVariants}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="card-face card-back-face">
            <CardBack />
          </div>
          <div className="card-face card-front-face">
            <CardFront
              card={card}
              onNext={handleNext}
              hasMoreCards={hasMoreCards}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

