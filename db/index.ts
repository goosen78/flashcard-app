import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

// Database connection singleton
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'flashcards.db');
    db = new Database(dbPath);
    
    // Enable foreign keys and WAL mode for better concurrency
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    
    // Initialize schema
    const schema = readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
    db.exec(schema);
  }
  
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

// Helper for transactions
export function transaction<T>(fn: (db: Database.Database) => T): T {
  const database = getDb();
  const txn = database.transaction(fn);
  return txn(database);
}
