/**
 * DeckStats Component
 * 
 * Displays statistics about the deck
 */

'use client';

import { Deck } from '@/lib/types';
import { getDeckStats } from '@/lib/flashcard';
import styles from './DeckStats.module.css';

interface DeckStatsProps {
  deck: Deck;
}

export default function DeckStats({ deck }: DeckStatsProps) {
  const stats = getDeckStats(deck);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{deck.name}</h2>
      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.totalCards}</div>
          <div className={styles.statLabel}>Total Cards</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.newCards}</div>
          <div className={styles.statLabel}>New</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.learning}</div>
          <div className={styles.statLabel}>Learning</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.reviewing}</div>
          <div className={styles.statLabel}>Reviewing</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.mastered}</div>
          <div className={styles.statLabel}>Mastered</div>
        </div>
      </div>
    </div>
  );
}
