import os

from sqlalchemy import MetaData, create_engine, select, text


SQLITE_URL = "sqlite:///backend/business.db"

POSTGRES_URL = os.environ.get("TARGET_DATABASE_URL")

if not POSTGRES_URL:
    raise RuntimeError("TARGET_DATABASE_URL is not set")

if POSTGRES_URL.startswith("postgres://"):
    POSTGRES_URL = POSTGRES_URL.replace("postgres://", "postgresql://", 1)

sqlite_engine = create_engine(SQLITE_URL)
postgres_engine = create_engine(POSTGRES_URL)

source_metadata = MetaData()
source_metadata.reflect(bind=sqlite_engine)

target_metadata = MetaData()
target_metadata.reflect(bind=postgres_engine)

print("Starting data migration...")

inserted_ids = {}

with sqlite_engine.connect() as source_connection:
    with postgres_engine.begin() as target_connection:
        for source_table in source_metadata.sorted_tables:
            table_name = source_table.name
            if table_name not in target_metadata.tables:
                print(f"Skipping {table_name}: not found in PostgreSQL")
                continue

            target_table = target_metadata.tables[table_name]
            rows = source_connection.execute(select(source_table)).mappings().all()

            target_connection.execute(target_table.delete())

            if not rows:
                inserted_ids[table_name] = set()
                print(f"{table_name}: 0 rows")
                continue

            fks = list(source_table.foreign_keys)
            good_rows = []
            skipped = 0
            for row in rows:
                ok = True
                for fk in fks:
                    parent_table = fk.column.table.name
                    child_col = fk.parent.name
                    value = row.get(child_col)
                    if value is None or parent_table == table_name:
                        continue
                    parent_ids = inserted_ids.get(parent_table)
                    if parent_ids is not None and value not in parent_ids:
                        ok = False
                        break
                if ok:
                    good_rows.append(dict(row))
                else:
                    skipped += 1

            if good_rows:
                target_connection.execute(target_table.insert(), good_rows)

            id_col = "id" if "id" in target_table.columns else None
            inserted_ids[table_name] = {r[id_col] for r in good_rows} if id_col else set()

            msg = f"{table_name}: migrated {len(good_rows)} rows"
            if skipped:
                msg += f" (skipped {skipped} broken/orphaned rows)"
            print(msg)

        for table_name, target_table in target_metadata.tables.items():
            if "id" not in target_table.columns:
                continue
            try:
                target_connection.execute(text(f"""
                    SELECT setval(
                        pg_get_serial_sequence('"{table_name}"', 'id'),
                        COALESCE((SELECT MAX(id) FROM "{table_name}"), 1),
                        (SELECT COUNT(*) FROM "{table_name}") > 0
                    )
                """))
            except Exception:
                pass

print("Migration completed successfully.")
