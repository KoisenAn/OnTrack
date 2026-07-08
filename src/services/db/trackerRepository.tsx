import { createTrackerEntryTable, db, getTrackerEntryTableName, initializeDatabase } from "./db";

export type TrackerRow = {
  id: number;
  name: string;
  type: string;
  notes: string | null;
  entry_table_name: string | null;
};

export type CreateTrackerInput = {
  name: string;
  type: string;
  notes?: string;
};

export function createTracker({ name, type, notes }: CreateTrackerInput) {
  initializeDatabase();

  const result = db.runSync(
    "INSERT INTO trackers (name, type, notes) VALUES (?, ?, ?)",
    [name, type, notes?.trim() || null]
  );
  const trackerId = result.lastInsertRowId;
  const entryTableName = createTrackerEntryTable(trackerId);

  return {
    id: trackerId,
    name,
    type,
    notes: notes?.trim() || null,
    entry_table_name: entryTableName,
  } satisfies TrackerRow;
}

export function getTrackers() {
  initializeDatabase();

  const trackers = db.getAllSync<TrackerRow>(
    "SELECT id, name, type, notes, entry_table_name FROM trackers ORDER BY id DESC"
  );

  return trackers.map((tracker) => {
    if (tracker.entry_table_name) {
      return tracker;
    }

    return {
      ...tracker,
      entry_table_name: getTrackerEntryTableName(tracker.id),
    };
  });
}
