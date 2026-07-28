"""
Safe one-time migration for the `shipments` table.
Adds the `service_type` column if missing. Does NOT delete any data.

Run once from the backend directory:
    python3 scripts/migrate_shipments_service_type.py
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "business.db"


def get_existing_columns(cursor, table_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    return {row[1] for row in cursor.fetchall()}


def main():
    print(f"Using database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_before = get_existing_columns(cursor, "shipments")
    print(f"Existing columns in shipments: {sorted(columns_before)}")

    if "service_type" not in columns_before:
        print("Adding missing column: service_type")
        cursor.execute(
            "ALTER TABLE shipments ADD COLUMN service_type VARCHAR"
        )
        cursor.execute(
            "UPDATE shipments SET service_type = 'domestic' "
            "WHERE service_type IS NULL"
        )
    else:
        print("Column service_type already exists. Skipping.")

    conn.commit()

    columns_after = get_existing_columns(cursor, "shipments")
    print(f"Columns after migration: {sorted(columns_after)}")

    cursor.execute("SELECT COUNT(*) FROM shipments")
    count = cursor.fetchone()[0]
    print(f"Total shipments rows preserved: {count}")

    conn.close()
    print("Migration completed successfully. No data was deleted.")


if __name__ == "__main__":
    main()
