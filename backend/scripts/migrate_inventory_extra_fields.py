import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "business.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM inventory")
before_count = cursor.fetchone()[0]
print(f"Rows before migration: {before_count}")

cursor.execute("PRAGMA table_info(inventory)")
existing_columns = [row[1] for row in cursor.fetchall()]

new_columns = {
    "category": "TEXT DEFAULT 'عام'",
    "warehouse": "TEXT DEFAULT 'المستودع الرئيسي'",
    "minimum": "INTEGER DEFAULT 5",
    "maximum": "INTEGER DEFAULT 50",
    "movement": "INTEGER DEFAULT 0",
}

for column_name, column_def in new_columns.items():
    if column_name not in existing_columns:
        cursor.execute(f"ALTER TABLE inventory ADD COLUMN {column_name} {column_def}")
        print(f"Added column: {column_name}")
    else:
        print(f"Column already exists, skipped: {column_name}")

conn.commit()

cursor.execute("SELECT COUNT(*) FROM inventory")
after_count = cursor.fetchone()[0]
print(f"Rows after migration: {after_count}")

conn.close()
print("Migration completed successfully.")
