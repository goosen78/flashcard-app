/**
 * SessionSummary Component
 * 
 * Displays study session results
 */

'use client';

import { StudySession } from '@/lib/types';
import { getSessionAccuracy } from '@/lib/flashcard';
import styles from './SessionSummary.module.css';

interface SessionSummaryProps {
  session: StudySession;
  onRestart: () => void;
}

export default function SessionSummary({ session, onRestart }: SessionSummaryProps) {
  const accuracy = getSessionAccuracy(session);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Session Complete!</h2>
      
      <div className={styles.stats}>
        <div className={styles.accuracyCircle}>
          <div className={styles.accuracyValue}>{accuracy}%</div>
          <div className={styles.accuracyLabel}>Accuracy</div>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{session.cardsReviewed}</div>
            <div className={styles.statLabel}>Cards Reviewed</div>
          </div>
          <div className={`${styles.stat} ${styles.correct}`}>
            <div className={styles.statValue}>{session.cardsCorrect}</div>
            <div className={styles.statLabel}>Correct</div>
          </div>
          <div className={`${styles.stat} ${styles.incorrect}`}>
            <div className={styles.statValue}>{session.cardsIncorrect}</div>
            <div className={styles.statLabel}>Incorrect</div>
          </div>
        </div>
      </div>
      
      <button className={styles.button} onClick={onRestart}>
        Study Again
      </button>
    </div>
  );
}
