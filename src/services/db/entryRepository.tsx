import { db, getTrackerEntryTableName, initializeDatabase } from "./db";

export function addEntry(trackerId: number, value: string) {
  initializeDatabase();

  const createdAt = new Date().toISOString();
  const tableName = getTrackerEntryTableName(trackerId);

  db.runSync(
    `CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT,
      created_at TEXT NOT NULL
    )`
  );

  db.runSync(
    `INSERT INTO entries (tracker_id, value, created_at)
     VALUES (?, ?, ?)`,
    [trackerId, value, createdAt]
  );

  db.runSync(
    `INSERT INTO ${tableName} (value, created_at)
     VALUES (?, ?)`,
    [value, createdAt]
  );
}

export function getEntriesForTracker(trackerId: number) {
  initializeDatabase();

  return db.getAllSync(
    `SELECT * FROM entries
     WHERE tracker_id = ?
     ORDER BY created_at DESC`,
    [trackerId]
  );
}
