import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

type RunResult = {
  lastInsertRowId: number;
};

type DatabaseLike = {
  execSync: (source: string) => void;
  runSync: (source: string, params?: unknown[]) => RunResult;
  getAllSync: <T>(source: string, params?: unknown[]) => T[];
};

type MemoryTracker = {
  id: number;
  name: string;
  type: string;
  notes: string | null;
  entry_table_name: string | null;
};

type MemoryEntry = {
  id: number;
  tracker_id?: number;
  value: string | null;
  created_at: string;
};

export const db: DatabaseLike =
  Platform.OS === "web" ? createMemoryDatabase() : createNativeDatabase();

export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS trackers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      notes TEXT,
      entry_table_name TEXT
    );

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracker_id INTEGER NOT NULL,
      value TEXT,
      created_at TEXT NOT NULL
    );
  `);

  ensureColumn("trackers", "notes", "TEXT");
  ensureColumn("trackers", "entry_table_name", "TEXT");
}

export function getTrackerEntryTableName(trackerId: number) {
  return `tracker_entries_${trackerId}`;
}

export function createTrackerEntryTable(trackerId: number) {
  const tableName = getTrackerEntryTableName(trackerId);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT,
      created_at TEXT NOT NULL
    );
  `);

  db.runSync(
    "UPDATE trackers SET entry_table_name = ? WHERE id = ?",
    [tableName, trackerId]
  );

  return tableName;
}

function ensureColumn(tableName: string, columnName: string, definition: string) {
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(${tableName})`);
  const exists = columns.some((column) => column.name === columnName);

  if (!exists) {
    db.execSync(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function createMemoryDatabase(): DatabaseLike {
  let nextTrackerId = 1;
  let nextEntryId = 1;
  const trackers: MemoryTracker[] = [];
  const entries: MemoryEntry[] = [];
  const trackerEntryTables = new Map<string, MemoryEntry[]>();

  return {
    execSync(source) {
      const tableName = source.match(/CREATE TABLE IF NOT EXISTS (tracker_entries_\d+)/)?.[1];

      if (tableName && !trackerEntryTables.has(tableName)) {
        trackerEntryTables.set(tableName, []);
      }
    },
    runSync(source, params = []) {
      if (source.includes("INSERT INTO trackers")) {
        const id = nextTrackerId++;
        trackers.push({
          id,
          name: String(params[0] ?? ""),
          type: String(params[1] ?? ""),
          notes: params[2] ? String(params[2]) : null,
          entry_table_name: null,
        });

        return { lastInsertRowId: id };
      }

      if (source.includes("UPDATE trackers SET entry_table_name")) {
        const tableName = String(params[0] ?? "");
        const trackerId = Number(params[1]);
        const tracker = trackers.find((item) => item.id === trackerId);

        if (tracker) {
          tracker.entry_table_name = tableName;
        }

        if (!trackerEntryTables.has(tableName)) {
          trackerEntryTables.set(tableName, []);
        }

        return { lastInsertRowId: trackerId };
      }

      if (source.includes("INSERT INTO entries")) {
        const id = nextEntryId++;
        entries.push({
          id,
          tracker_id: Number(params[0]),
          value: params[1] ? String(params[1]) : null,
          created_at: String(params[2] ?? new Date().toISOString()),
        });

        return { lastInsertRowId: id };
      }

      const trackerTableName = source.match(/INSERT INTO (tracker_entries_\d+)/)?.[1];

      if (trackerTableName) {
        const id = nextEntryId++;
        const tableEntries = trackerEntryTables.get(trackerTableName) ?? [];

        tableEntries.push({
          id,
          value: params[0] ? String(params[0]) : null,
          created_at: String(params[1] ?? new Date().toISOString()),
        });
        trackerEntryTables.set(trackerTableName, tableEntries);

        return { lastInsertRowId: id };
      }

      return { lastInsertRowId: 0 };
    },
    getAllSync<T>(source: string, params: unknown[] = []) {
      if (source.includes("PRAGMA table_info(trackers)")) {
        return [
          { name: "id" },
          { name: "name" },
          { name: "type" },
          { name: "notes" },
          { name: "entry_table_name" },
        ] as T[];
      }

      if (source.includes("SELECT id, name, type, notes, entry_table_name FROM trackers")) {
        return [...trackers].sort((a, b) => b.id - a.id) as T[];
      }

      if (source.includes("SELECT * FROM entries")) {
        const trackerId = Number(params[0]);

        return entries
          .filter((entry) => entry.tracker_id === trackerId)
          .sort((a, b) => b.created_at.localeCompare(a.created_at)) as T[];
      }

      return [];
    },
  };
}

function createNativeDatabase(): DatabaseLike {
  const nativeDb = SQLite.openDatabaseSync("ontrack.db");

  return {
    execSync(source: string) {
      nativeDb.execSync(source);
    },
    runSync(source: string, params: unknown[] = []) {
      const result = nativeDb.runSync(source, params as SQLite.SQLiteBindParams);

      return { lastInsertRowId: result.lastInsertRowId };
    },
    getAllSync<T>(source: string, params: unknown[] = []) {
      return nativeDb.getAllSync<T>(source, params as SQLite.SQLiteBindParams);
    },
  };
}
