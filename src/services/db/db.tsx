import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('ontrack.db');

export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS trackers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracker_id INTEGER NOT NULL,
      value TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

/*
import { useEffect } from 'react';
import { initializeDatabase } from './src/database/db';

useEffect(() => {
  initializeDatabase();
}, []);

export function createTracker(name: string, type: string) {
  db.runSync(
    `INSERT INTO trackers (name, type) VALUES (?, ?)`,
    [name, type]
  );
}

createTracker('Workout', 'boolean');

export function getTrackers() {
  return db.getAllSync(
    `SELECT * FROM trackers`
  );
}

const trackers = getTrackers();
console.log(trackers);

export function addEntry(
  trackerId: number,
  value: string
) {
  db.runSync(
    `
      INSERT INTO entries
      (tracker_id, value, created_at)
      VALUES (?, ?, ?)
    `,
    [
      trackerId,
      value,
      new Date().toISOString(),
    ]
  );
}

export function getEntriesForTracker(
  trackerId: number
) {
  return db.getAllSync(
    `
      SELECT * FROM entries
      WHERE tracker_id = ?
      ORDER BY created_at DESC
    `,
    [trackerId]
  );
}
  */