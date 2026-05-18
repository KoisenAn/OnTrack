import { db } from "./db";

export function addEntry(trackerId: number, value: string) {
  db.runSync(
    `INSERT INTO entries (tracker_id, value, created_at)
     VALUES (?, ?, ?)`,
    [trackerId, value, new Date().toISOString()]
  );
}

export function getEntriesForTracker(trackerId: number) {
  return db.getAllSync(
    `SELECT * FROM entries
     WHERE tracker_id = ?
     ORDER BY created_at DESC`,
    [trackerId]
  );
}