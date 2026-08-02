from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.cash_settlement import CashSettlementItem
from app.models.customer_account import CustomerAccount
from app.models.customs import CustomsClearance
from app.models.delivery import Delivery
from app.models.delivery_receipt import DeliveryReceipt
from app.models.dispatch import DispatchItem
from app.models.inventory import Inventory
from app.models.invoice import Invoice
from app.models.invoice_line_item import InvoiceLineItem
from app.models.order import Order
from app.models.payment import Payment
from app.models.picking import Picking
from app.models.receiving import Receiving
from app.models.return_record import ReturnRecord
from app.models.service import ServiceRequest
from app.models.shipment import Shipment


def cascade_delete_customer(db: Session, customer_id: int) -> None:
    """Delete a customer and every record that belongs to them, in the
    correct order so no foreign key is ever left dangling.
    Shared/batch records (dispatch routes, cash settlement headers,
    delivery companies, employees, vehicles, warehouses, services) are
    left untouched since they are not owned by a single customer.
    """
    order_ids = [
        row[0] for row in db.query(Order.id).filter(Order.customer_id == customer_id).all()
    ]
    shipment_ids = [
        row[0] for row in db.query(Shipment.id).filter(Shipment.customer_id == customer_id).all()
    ]
    invoice_ids = [
        row[0] for row in db.query(Invoice.id).filter(Invoice.customer_id == customer_id).all()
    ]
    picking_ids = (
        [row[0] for row in db.query(Picking.id).filter(Picking.order_id.in_(order_ids)).all()]
        if order_ids
        else []
    )
    delivery_ids = (
        [row[0] for row in db.query(Delivery.id).filter(Delivery.picking_id.in_(picking_ids)).all()]
        if picking_ids
        else []
    )

    if delivery_ids:
        db.query(CashSettlementItem).filter(
            CashSettlementItem.delivery_id.in_(delivery_ids)
        ).delete(synchronize_session=False)
        db.query(ReturnRecord).filter(
            ReturnRecord.delivery_id.in_(delivery_ids)
        ).delete(synchronize_session=False)

    if shipment_ids:
        db.query(DeliveryReceipt).filter(
            DeliveryReceipt.shipment_id.in_(shipment_ids)
        ).delete(synchronize_session=False)
        db.query(CustomsClearance).filter(
            CustomsClearance.shipment_id.in_(shipment_ids)
        ).delete(synchronize_session=False)
        db.query(Receiving).filter(
            Receiving.shipment_id.in_(shipment_ids)
        ).delete(synchronize_session=False)

    if picking_ids:
        db.query(DispatchItem).filter(
            DispatchItem.picking_id.in_(picking_ids)
        ).delete(synchronize_session=False)
        db.query(Delivery).filter(
            Delivery.picking_id.in_(picking_ids)
        ).delete(synchronize_session=False)
        db.query(Picking).filter(Picking.id.in_(picking_ids)).delete(synchronize_session=False)

    if invoice_ids:
        db.query(InvoiceLineItem).filter(
            InvoiceLineItem.invoice_id.in_(invoice_ids)
        ).delete(synchronize_session=False)

    db.query(Payment).filter(Payment.customer_id == customer_id).delete(synchronize_session=False)
    db.query(ServiceRequest).filter(
        ServiceRequest.customer_id == customer_id
    ).delete(synchronize_session=False)

    if shipment_ids:
        db.query(Inventory).filter(
            or_(
                Inventory.customer_id == customer_id,
                Inventory.shipment_id.in_(shipment_ids),
            )
        ).delete(synchronize_session=False)
    else:
        db.query(Inventory).filter(
            Inventory.customer_id == customer_id
        ).delete(synchronize_session=False)

    db.query(CustomerAccount).filter(
        CustomerAccount.customer_id == customer_id
    ).delete(synchronize_session=False)
    db.query(Booking).filter(Booking.customer_id == customer_id).delete(synchronize_session=False)

    if invoice_ids:
        db.query(Invoice).filter(Invoice.id.in_(invoice_ids)).delete(synchronize_session=False)
    if shipment_ids:
        db.query(Shipment).filter(Shipment.id.in_(shipment_ids)).delete(synchronize_session=False)
    if order_ids:
        db.query(Order).filter(Order.id.in_(order_ids)).delete(synchronize_session=False)
