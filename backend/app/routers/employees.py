from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse
)

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


@router.post("/", response_model=EmployeeResponse)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db)
):

    employee = Employee(
        full_name=employee_data.full_name,
        email=employee_data.email,
        phone=employee_data.phone,
        position=employee_data.position,
        department=employee_data.department,
        salary=employee_data.salary
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee


@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    search: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Employee).filter(
        Employee.is_archived == False
    )

    if search:
        query = query.filter(
            Employee.full_name.ilike(f"%{search}%")
        )

    return query.all()


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee or employee.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee or employee.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if employee_data.full_name is not None:
        employee.full_name = employee_data.full_name

    if employee_data.email is not None:
        employee.email = employee_data.email

    if employee_data.phone is not None:
        employee.phone = employee_data.phone

    if employee_data.position is not None:
        employee.position = employee_data.position

    if employee_data.department is not None:
        employee.department = employee_data.department

    if employee_data.salary is not None:
        employee.salary = employee_data.salary

    if employee_data.status is not None:
        employee.status = employee_data.status

    db.commit()
    db.refresh(employee)

    return employee


@router.delete("/{employee_id}")
def archive_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee or employee.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    employee.is_archived = True

    db.commit()

    return {
        "message": "Employee archived successfully"
    }
