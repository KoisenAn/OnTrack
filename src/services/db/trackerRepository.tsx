import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('ontrack.db');

export function createTracker(name: string, type: string) {
  db.runSync(
    "INSERT INTO trackers (name, type) VALUES (?, ?)",
    [name, type]
  );
}

export function getTrackers() {
  return db.getAllSync("SELECT * FROM trackers");
}