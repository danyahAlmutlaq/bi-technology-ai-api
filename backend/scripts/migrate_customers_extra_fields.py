"""
Safe one-time migration for the `customers` table.

Adds optional profile columns (customer_type, city, national_id,
commercial_registration, company_website, contact_person) if missing.
Does NOT drop the table and does NOT delete any existing rows.

Run once from the backend directory:
    python3 scripts/migrate_customers_extra_fields.py
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "business.db"

NEW_COLUMNS = {
    "customer_type": "VARCHAR",
    "city": "VARCHAR",
    "national_id": "VARCHAR",
    "commercial_registration": "VARCHAR",
    "company_website": "VARCHAR",
    "contact_person": "VARCHAR",
}


def get_existing_columns(cursor, table_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    return {row[1] for row in cursor.fetchall()}


def main():
    print(f"Using database: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_before = get_existing_columns(cursor, "customers")
    print(f"Existing columns in customers: {sorted(columns_before)}")

    for column_name, column_type in NEW_COLUMNS.items():
        if column_name not in columns_before:
            print(f"Adding missing column: {column_name}")
            cursor.execute(
                f"ALTER TABLE customers ADD COLUMN {column_name} {column_type}"
            )
        else:
            print(f"Column {column_name} already exists. Skipping.")

    cursor.execute(
        "UPDATE customers SET customer_type = 'individual' "
        "WHERE customer_type IS NULL"
    )

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