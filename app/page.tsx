/**
 * Main Flashcard Study Page
 * 
 * Thin UI layer that uses pure functions from lib/flashcard.ts
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, Deck, StudySession, ReviewResult } from '@/lib/types';
import {
  updateCardBox,
  getCardsForReview,
  shuffleCards,
  updateCardInDeck,
  createStudySession,
  updateStudySession,
} from '@/lib/flashcard';
import { sampleDeck } from '@/data/sampleDeck';
import Flashcard from '@/components/Flashcard';
import DeckStats from '@/components/DeckStats';
import SessionSummary from '@/components/SessionSummary';
import styles from './page.module.css';

export default function Home() {
  // State
  const [deck, setDeck] = useState<Deck>(sampleDeck);
  const [reviewCards, setReviewCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [session, setSession] = useState<StudySession>(createStudySession());
  const [isStudying, setIsStudying] = useState(false);

  // Start study session
  const startStudy = () => {
    // Get cards from box 0 and 1 for this session (new and learning cards)
    const cardsToReview = getCardsForReview(deck.cards, [0, 1]);
    const shuffled = shuffleCards(cardsToReview);
    setReviewCards(shuffled);
    setCurrentIndex(0);
    setSession(createStudySession());
    setIsStudying(true);
  };

  // Handle card review
  const handleReview = (result: ReviewResult) => {
    const currentCard = reviewCards[currentIndex];
    
    // Update card box based on result
    const updatedCard = updateCardBox(currentCard, result);
    
    // Update deck with new card state
    const updatedDeck = updateCardInDeck(deck, updatedCard);
    setDeck(updatedDeck);
    
    // Update session statistics
    const updatedSession = updateStudySession(session, result);
    setSession(updatedSession);
    
    // Move to next card or finish
    if (currentIndex < reviewCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsStudying(false);
    }
  };

  // Restart study
  const restartStudy = () => {
    startStudy();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Flashcard App</h1>
        <p className={styles.subtitle}>Learn with Spaced Repetition</p>
      </header>

      <main className={styles.main}>
        {!isStudying ? (
          <>
            <DeckStats deck={deck} />
            
            {session.cardsReviewed > 0 ? (
              <SessionSummary session={session} onRestart={restartStudy} />
            ) : (
              <div className={styles.startSection}>
                <p className={styles.description}>
                  Ready to study? Click the button below to review your flashcards.
                  We&apos;ll show you cards that need the most practice first.
                </p>
                <button className={styles.startButton} onClick={startStudy}>
                  Start Study Session
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.studySection}>
            <div className={styles.progress}>
              Card {currentIndex + 1} of {reviewCards.length}
            </div>
            <Flashcard
              card={reviewCards[currentIndex]}
              onCorrect={() => handleReview('correct')}
              onIncorrect={() => handleReview('incorrect')}
            />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Built with pure functions and minimal complexity</p>
      </footer>
    </div>
  );
}
