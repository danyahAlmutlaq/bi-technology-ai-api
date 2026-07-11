from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.shipment import Shipment
from app.models.delivery_receipt import DeliveryReceipt
from app.schemas.delivery_receipt import (
    DeliveryReceiptCreate,
    DeliveryReceiptUpdate,
    DeliveryReceiptResponse
)


router = APIRouter(prefix="/delivery-receipts", tags=["Delivery Receipts"])


@router.post("/", response_model=DeliveryReceiptResponse)
def create_delivery_receipt(
    receipt_data: DeliveryReceiptCreate,
    db: Session = Depends(get_db)
):

    shipment = db.query(Shipment).filter(
        Shipment.id == receipt_data.shipment_id
    ).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    receipt = DeliveryReceipt(
        shipment_id=receipt_data.shipment_id,
        recipient_name=receipt_data.recipient_name,
        proof_image_url=receipt_data.proof_image_url,
        notes=receipt_data.notes
    )

    shipment.status = "delivered"

    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    return receipt


@router.get("/", response_model=list[DeliveryReceiptResponse])
def get_delivery_receipts(db: Session = Depends(get_db)):

    receipts = db.query(DeliveryReceipt).filter(
        DeliveryReceipt.is_archived == False
    ).all()

    return receipts


@router.get("/{receipt_id}", response_model=DeliveryReceiptResponse)
def get_delivery_receipt(
    receipt_id: int,
    db: Session = Depends(get_db)
):

    receipt = db.query(DeliveryReceipt).filter(
        DeliveryReceipt.id == receipt_id
    ).first()

    if not receipt or receipt.is_archived:
        raise HTTPException(status_code=404, detail="Delivery receipt not found")

    return receipt


@router.put("/{receipt_id}", response_model=DeliveryReceiptResponse)
def update_delivery_receipt(
    receipt_id: int,
    receipt_data: DeliveryReceiptUpdate,
    db: Session = Depends(get_db)
):

    receipt = db.query(DeliveryReceipt).filter(
        DeliveryReceipt.id == receipt_id
    ).first()

    if not receipt or receipt.is_archived:
        raise HTTPException(status_code=404, detail="Delivery receipt not found")

    if receipt_data.recipient_name is not None:
        receipt.recipient_name = receipt_data.recipient_name

    if receipt_data.proof_image_url is not None:
        receipt.proof_image_url = receipt_data.proof_image_url

    if receipt_data.notes is not None:
        receipt.notes = receipt_data.notes

    db.commit()
    db.refresh(receipt)

    return receipt


@router.delete("/{receipt_id}")
def archive_delivery_receipt(
    receipt_id: int,
    db: Session = Depends(get_db)
):

    receipt = db.query(DeliveryReceipt).filter(
        DeliveryReceipt.id == receipt_id
    ).first()

    if not receipt or receipt.is_archived:
        raise HTTPException(status_code=404, detail="Delivery receipt not found")

    receipt.is_archived = True

    db.commit()

    return {"message": "Delivery receipt archived successfully"}
