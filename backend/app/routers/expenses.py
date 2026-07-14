from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse
)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db)
):

    expense = Expense(
        category=expense_data.category,
        amount=expense_data.amount,
        description=expense_data.description,
        receipt_file=expense_data.receipt_file,
        approved_by=expense_data.approved_by
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(
    search: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Expense).filter(
        Expense.is_archived == False
    )

    if search:
        query = query.filter(
            Expense.category.ilike(f"%{search}%")
        )

    return query.all()


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense or expense.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense or expense.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    data = expense_data.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)

    return expense


@router.delete("/{expense_id}")
def archive_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense or expense.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    expense.is_archived = True

    db.commit()

    return {
        "message": "Expense archived successfully"
    }
