import sys
patches = []
def add(path, old, new, expected=1):
    patches.append((path, old, new, expected))

# ---- Task 1: received_by on Receiving ----
add(
    "backend/app/models/receiving.py",
    '    damage_notes = Column(String, nullable=True)\n    status = Column(String, nullable=False, default="pending")\n',
    '    damage_notes = Column(String, nullable=True)\n    received_by = Column(String, nullable=True)\n    status = Column(String, nullable=False, default="pending")\n',
)
add(
    "backend/app/schemas/receiving.py",
    'class ReceivingRecordArrival(BaseModel):\n    actual_quantity: int\n    storage_location: Optional[str] = None\n    damage_notes: Optional[str] = None\n    handling_fee: Optional[float] = None\n    storage_fee: Optional[float] = None\n',
    'class ReceivingRecordArrival(BaseModel):\n    actual_quantity: int\n    storage_location: Optional[str] = None\n    damage_notes: Optional[str] = None\n    received_by: Optional[str] = None\n    handling_fee: Optional[float] = None\n    storage_fee: Optional[float] = None\n',
)
add(
    "backend/app/schemas/receiving.py",
    '    damage_notes: Optional[str] = None\n    status: str\n    receipt_sent: bool\n',
    '    damage_notes: Optional[str] = None\n    received_by: Optional[str] = None\n    status: str\n    receipt_sent: bool\n',
)
add(
    "backend/app/routers/receiving.py",
    'from sqlalchemy.orm import Session\nfrom app.database import get_db\n',
    'from sqlalchemy.orm import Session\nfrom sqlalchemy import text\nfrom app.database import get_db\n',
)
add(
    "backend/app/routers/receiving.py",
    'router = APIRouter(prefix="/receiving", tags=["Receiving"])\n',
    'router = APIRouter(prefix="/receiving", tags=["Receiving"])\n\n\n@router.post("/migrate-received-by")\ndef migrate_received_by(db: Session = Depends(get_db)):\n    try:\n        db.execute(text("ALTER TABLE receiving_records ADD COLUMN received_by VARCHAR"))\n        db.commit()\n        return {"status": "added"}\n    except Exception as exc:\n        db.rollback()\n        return {"status": "already_exists_or_skipped", "detail": str(exc)}\n',
)
add(
    "backend/app/routers/receiving.py",
    '    record.actual_quantity = data.actual_quantity\n    record.storage_location = data.storage_location\n    record.damage_notes = data.damage_notes\n    record.handling_fee = data.handling_fee or 0\n    record.storage_fee = data.storage_fee or 0\n',
    '    record.actual_quantity = data.actual_quantity\n    record.storage_location = data.storage_location\n    record.damage_notes = data.damage_notes\n    record.received_by = data.received_by\n    record.handling_fee = data.handling_fee or 0\n    record.storage_fee = data.storage_fee or 0\n',
)

# ---- Task 2: container_type on Shipment ----
add(
    "backend/app/models/shipment.py",
    '    container_number = Column(String, nullable=True)\n    bill_of_lading_number = Column(String, nullable=True)\n',
    '    container_number = Column(String, nullable=True)\n    container_type = Column(String, nullable=True)\n    bill_of_lading_number = Column(String, nullable=True)\n',
)
add(
    "backend/app/schemas/shipment.py",
    '    container_number: Optional[str] = None\n    bill_of_lading_number: Optional[str] = None\n    vessel_name: Optional[str] = None\n    arrival_date: Optional[str] = None\n    notes: Optional[str] = None\nclass ShipmentUpdate(BaseModel):\n',
    '    container_number: Optional[str] = None\n    container_type: Optional[str] = None\n    bill_of_lading_number: Optional[str] = None\n    vessel_name: Optional[str] = None\n    arrival_date: Optional[str] = None\n    notes: Optional[str] = None\nclass ShipmentUpdate(BaseModel):\n',
)
add(
    "backend/app/schemas/shipment.py",
    '    container_number: Optional[str] = None\n    bill_of_lading_number: Optional[str] = None\n    vessel_name: Optional[str] = None\n    arrival_date: Optional[str] = None\n    status: Optional[str] = None\n    notes: Optional[str] = None\nclass ShipmentResponse(BaseModel):\n',
    '    container_number: Optional[str] = None\n    container_type: Optional[str] = None\n    bill_of_lading_number: Optional[str] = None\n    vessel_name: Optional[str] = None\n    arrival_date: Optional[str] = None\n    status: Optional[str] = None\n    notes: Optional[str] = None\nclass ShipmentResponse(BaseModel):\n',
)
add(
    "backend/app/schemas/shipment.py",
    '    container_number: Optional[str] = None\n    bill_of_lading_number: Optional[str] = None\n    vessel_name: Optional[str] = None\n    arrival_date: Optional[str] = None\n    order_id: Optional[int] = None\n',
    '    container_number: Optional[str] = None\n    container_type: Optional[str] = None\n    bill_of_lading_number: Optional[str] = None\n    vessel_name: Optional[str] = None\n    arrival_date: Optional[str] = None\n    order_id: Optional[int] = None\n',
)
add(
    "backend/app/routers/shipments.py",
    'from sqlalchemy.orm import Session\nfrom app.database import get_db\n',
    'from sqlalchemy.orm import Session\nfrom sqlalchemy import text\nfrom app.database import get_db\n',
)
add(
    "backend/app/routers/shipments.py",
    'router = APIRouter(prefix="/shipments", tags=["Shipments"])\n',
    'router = APIRouter(prefix="/shipments", tags=["Shipments"])\n\n\n@router.post("/migrate-container-type")\ndef migrate_container_type(db: Session = Depends(get_db)):\n    try:\n        db.execute(text("ALTER TABLE shipments ADD COLUMN container_type VARCHAR"))\n        db.commit()\n        return {"status": "added"}\n    except Exception as exc:\n        db.rollback()\n        return {"status": "already_exists_or_skipped", "detail": str(exc)}\n',
)
add(
    "backend/app/routers/shipments.py",
    '        container_number=shipment_data.container_number,\n        bill_of_lading_number=shipment_data.bill_of_lading_number,\n',
    '        container_number=shipment_data.container_number,\n        container_type=shipment_data.container_type,\n        bill_of_lading_number=shipment_data.bill_of_lading_number,\n',
)
add(
    "backend/app/routers/shipments.py",
    '    if shipment_data.container_number is not None:\n        shipment.container_number = shipment_data.container_number\n    if shipment_data.bill_of_lading_number is not None:\n',
    '    if shipment_data.container_number is not None:\n        shipment.container_number = shipment_data.container_number\n    if shipment_data.container_type is not None:\n        shipment.container_type = shipment_data.container_type\n    if shipment_data.bill_of_lading_number is not None:\n',
)

contents = {}
for path, old, new, expected in patches:
    if path not in contents:
        contents[path] = open(path, encoding="utf-8").read()
    c = contents[path].count(old)
    print(f"{path}: {c} (expected {expected})")
    if c != expected:
        sys.exit("MISMATCH - stopped, no changes written")
for path, old, new, expected in patches:
    contents[path] = contents[path].replace(old, new)
for path, text_ in contents.items():
    open(path, "w", encoding="utf-8").write(text_)
print("DONE p10")
