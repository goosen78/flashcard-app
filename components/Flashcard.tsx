/**
 * Flashcard Component
 * 
 * Displays a single flashcard with flip animation
 */

'use client';

import { useState } from 'react';
import { Card } from '@/lib/types';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  card: Card;
  onCorrect: () => void;
  onIncorrect: () => void;
  showControls?: boolean;
}

export default function Flashcard({ 
  card, 
  onCorrect, 
  onIncorrect,
  showControls = true 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    setIsFlipped(false);
    onCorrect();
  };

  const handleIncorrect = () => {
    setIsFlipped(false);
    onIncorrect();
  };

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleFlip}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardFront}>
            <div className={styles.label}>Question</div>
            <div className={styles.content}>{card.front}</div>
            <div className={styles.hint}>Click to reveal answer</div>
          </div>
          <div className={styles.cardBack}>
            <div className={styles.label}>Answer</div>
            <div className={styles.content}>{card.back}</div>
          </div>
        </div>
      </div>
      
      {showControls && isFlipped && (
        <div className={styles.controls}>
          <button 
            className={`${styles.button} ${styles.incorrect}`}
            onClick={handleIncorrect}
          >
            ✗ Incorrect
          </button>
          <button 
            className={`${styles.button} ${styles.correct}`}
            onClick={handleCorrect}
          >
            ✓ Correct
          </button>
        </div>
      )}
    </div>
  );
}
