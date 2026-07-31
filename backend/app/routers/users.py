from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user, user_to_response
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.security import hash_password

router = APIRouter(prefix="/users", tags=["Users"])


def require_admin(current_user: User):
    if current_user.role != "مدير النظام":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="صلاحية مدير النظام مطلوبة"
        )


@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    users = (
        db.query(User)
        .filter(User.is_archived == False)  # noqa: E712
        .order_by(User.id.asc())
        .all()
    )
    return [user_to_response(u) for u in users]


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="البريد الإلكتروني مستخدم"
        )
    salt, pwd_hash = hash_password(payload.password)
    user = User(
        name=payload.name,
        email=payload.email.lower(),
        phone=payload.phone,
        role=payload.role,
        department=payload.department,
        status=payload.status,
        permissions=",".join(payload.permissions),
        password_salt=salt,
        password_hash=pwd_hash,
        last_active="لم يسجل الدخول",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    user.display_id = f"USR-{user.id:03d}"
    db.commit()
    db.refresh(user)
    return user_to_response(user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    user = (
        db.query(User)
        .filter(User.display_id == user_id, User.is_archived == False)  # noqa: E712
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="المستخدم غير موجود"
        )
    data = payload.model_dump(exclude_unset=True)
    if data.get("password"):
        salt, pwd_hash = hash_password(data.pop("password"))
        user.password_salt = salt
        user.password_hash = pwd_hash
    elif "password" in data:
        data.pop("password")
    if data.get("permissions") is not None:
        user.permissions = ",".join(data.pop("permissions"))
    for field, value in data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user_to_response(user)