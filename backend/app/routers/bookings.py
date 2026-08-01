from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.booking import Booking
from app.models.customer import Customer
from app.models.shipment import Shipment
from app.schemas.booking import (
    BookingCreate,
    BookingResponse,
    BookingStatusUpdate,
    BookingUpdate,
)


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


def generate_booking_number() -> str:
    date_part = datetime.now().strftime("%Y%m%d")
    unique_part = uuid4().hex[:6].upper()

    return f"BKG-{date_part}-{unique_part}"


def get_active_customer(
    customer_id: int,
    db: Session,
) -> Customer:
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id,
            Customer.is_archived.is_(False),
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


def get_booking_or_404(
    booking_id: int,
    db: Session,
) -> Booking:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    return booking


@router.post(
    "/",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
):
    get_active_customer(
        customer_id=booking_data.customer_id,
        db=db,
    )

    booking = Booking(
        booking_number=generate_booking_number(),
        customer_id=booking_data.customer_id,
        service_type=booking_data.service_type,
        origin=booking_data.origin,
        destination=booking_data.destination,
        pickup_date=booking_data.pickup_date,
        expected_delivery_date=booking_data.expected_delivery_date,
        package_count=booking_data.package_count,
        total_weight=booking_data.total_weight,
        notes=booking_data.notes,
        status="draft",
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


@router.get(
    "/",
    response_model=list[BookingResponse],
)
def get_bookings(
    search: str | None = None,
    booking_status: str | None = Query(
        default=None,
        alias="status",
    ),
    customer_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Booking)

    if search:
        search_value = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Booking.booking_number.ilike(search_value),
                Booking.service_type.ilike(search_value),
                Booking.origin.ilike(search_value),
                Booking.destination.ilike(search_value),
            )
        )

    if booking_status:
        query = query.filter(
            Booking.status == booking_status
        )

    if customer_id:
        query = query.filter(
            Booking.customer_id == customer_id
        )

    return query.order_by(Booking.id.desc()).all()


@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    return get_booking_or_404(
        booking_id=booking_id,
        db=db,
    )


@router.put(
    "/{booking_id}",
    response_model=BookingResponse,
)
def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    db: Session = Depends(get_db),
):
    booking = get_booking_or_404(
        booking_id=booking_id,
        db=db,
    )

    if booking.status in {
        "cancelled",
        "converted_to_shipment",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This booking cannot be edited",
        )

    update_data = booking_data.model_dump(
        exclude_unset=True
    )

    if "customer_id" in update_data:
        get_active_customer(
            customer_id=update_data["customer_id"],
            db=db,
        )

    pickup_date = update_data.get(
        "pickup_date",
        booking.pickup_date,
    )

    expected_delivery_date = update_data.get(
        "expected_delivery_date",
        booking.expected_delivery_date,
    )

    if (
        pickup_date
        and expected_delivery_date
        and expected_delivery_date < pickup_date
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Expected delivery date cannot be "
                "before pickup date"
            ),
        )

    for field, value in update_data.items():
        setattr(booking, field, value)

    db.commit()
    db.refresh(booking)

    return booking


@router.patch(
    "/{booking_id}/status",
    response_model=BookingResponse,
)
def update_booking_status(
    booking_id: int,
    status_data: BookingStatusUpdate,
    db: Session = Depends(get_db),
):
    booking = get_booking_or_404(
        booking_id=booking_id,
        db=db,
    )

    allowed_transitions = {
        "draft": {
            "confirmed",
            "cancelled",
        },
        "confirmed": {
            "cancelled",
            "converted_to_shipment",
        },
        "cancelled": set(),
        "converted_to_shipment": set(),
    }

    if status_data.status == booking.status:
        return booking

    allowed_statuses = allowed_transitions.get(
        booking.status,
        set(),
    )

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Booking status cannot move from "
                f"'{booking.status}' to "
                f"'{status_data.status}'"
            ),
        )

    if status_data.status == "converted_to_shipment":
        if not status_data.delivery_company_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="يجب اختيار شركة التوصيل لتحويل الحجز إلى شحنة",
            )
        new_shipment = Shipment(
            customer_id=booking.customer_id,
            delivery_company_id=status_data.delivery_company_id,
            tracking_number=status_data.tracking_number,
            shipping_cost=status_data.shipping_cost or 0.0,
            service_type=booking.service_type,
            notes=f"تم الإنشاء تلقائيًا من الحجز {booking.booking_number}",
        )
        db.add(new_shipment)

    booking.status = status_data.status

    db.commit()
    db.refresh(booking)

    return booking


@router.delete(
    "/{booking_id}",
    response_model=BookingResponse,
)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    booking = get_booking_or_404(
        booking_id=booking_id,
        db=db,
    )

    if booking.status == "converted_to_shipment":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "A booking converted to shipment "
                "cannot be cancelled"
            ),
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled",
        )

    booking.status = "cancelled"

    db.commit()
    db.refresh(booking)

    return booking