"""
Safe one-time migration for the `customers` table.

Adds the missing `updated_at` column (if absent) and backfills any
NULL `is_archived` values to 0 (false). Does NOT drop the table and
does NOT delete any existing rows.

Run once from the backend directory:
    python3 scripts/migrate_customers_table.py
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

    columns_before = get_existing_columns(cursor, "customers")
    print(f"Existing columns in customers: {sorted(columns_before)}")

    if "updated_at" not in columns_before:
        print("Adding missing column: updated_at")
        cursor.execute(
            "ALTER TABLE customers ADD COLUMN updated_at DATETIME"
        )
        cursor.execute(
            "UPDATE customers SET updated_at = "
            "COALESCE(created_at, CURRENT_TIMESTAMP) "
            "WHERE updated_at IS NULL"
        )
        print("Column updated_at added and backfilled from created_at.")
    else:
        print("Column updated_at already exists. Skipping.")

    cursor.execute(
        "UPDATE customers SET is_archived = 0 WHERE is_archived IS NULL"
    )
    print("Backfilled NULL is_archived values to 0 (false).")

    conn.commit()

    columns_after = get_existing_columns(cursor, "customers")
    print(f"Columns after migration: {sorted(columns_after)}")

    cursor.execute("SELECT COUNT(*) FROM customers")
    count = cursor.fetchone()[0]
    print(f"Total customers rows preserved: {count}")

    conn.close()
    print("Migration completed successfully. No data was deleted.")


if __name__ == "__main__":
    main()