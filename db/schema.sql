-- Flashcard App Schema
-- SQLite database for AI Capstone flashcard application

-- Decks: containers for cards with study limits
CREATE TABLE IF NOT EXISTS decks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  new_cards_per_day INTEGER NOT NULL DEFAULT 20,
  review_limit_per_day INTEGER NOT NULL DEFAULT 100,
  release_state TEXT NOT NULL DEFAULT 'draft' CHECK(release_state IN ('draft', 'released')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Cards: individual flashcard items with scheduling state
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'basic' CHECK(type IN ('basic', 'mcq', 'cloze', 'code')),
  prompt TEXT NOT NULL,
  answer TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK(source IN ('manual', 'generated')),
  e_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetition INTEGER NOT NULL DEFAULT 0,
  due_at TEXT,
  suspended INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Reviews: immutable record of student responses
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  reviewed_at TEXT NOT NULL DEFAULT (datetime('now')),
  quality INTEGER NOT NULL CHECK(quality >= 0 AND quality <= 5),
  latency_ms INTEGER,
  user_answer TEXT,
  grader TEXT NOT NULL DEFAULT 'self' CHECK(grader IN ('self', 'llm', 'none')),
  correctness INTEGER,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_cards_deck_due ON cards(deck_id, due_at) WHERE suspended = 0;
CREATE INDEX IF NOT EXISTS idx_reviews_card_time ON reviews(card_id, reviewed_at);
CREATE INDEX IF NOT EXISTS idx_cards_deck ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_decks_name ON decks(name);
