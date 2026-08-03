from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.user_session import UserSession
from app.schemas.user import LoginRequest, LoginResponse, UserCreate, UserResponse
from app.security import generate_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

TOKEN_TTL_DAYS = 14


def user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.display_id or f"USR-{user.id:03d}",
        name=user.name,
        email=user.email,
        phone=user.phone or "",
        role=user.role,
        department=user.department or "",
        status=user.status,
        permissions=[p for p in (user.permissions or "").split(",") if p],
        last_active=user.last_active or "",
        joined_at=user.created_at.isoformat() if user.created_at else "",
    )


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="غير مصرح"
        )
    token = authorization.removeprefix("Bearer ").strip()
    session_row = (
        db.query(UserSession)
        .filter(UserSession.token == token)
        .first()
    )
    user = None
    if session_row:
        user = (
            db.query(User)
            .filter(User.id == session_row.user_id, User.is_archived == False)  # noqa: E712
            .first()
        )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="جلسة غير صالحة"
        )
    expires_at = session_row.expires_at if session_row else None
    if expires_at is not None and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="انتهت صلاحية الجلسة"
        )
    if user.status != "نشط":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="الحساب موقوف"
        )
    return user
@router.post("/bootstrap-admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def bootstrap_admin(payload: UserCreate, db: Session = Depends(get_db)):
    existing_count = db.query(User).filter(User.is_archived == False).count()  # noqa: E712
    if existing_count > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="يوجد حساب مسجّل بالفعل، هذا المسار متاح فقط عند عدم وجود أي مستخدم",
        )
    salt, pwd_hash = hash_password(payload.password)
    user = User(
        name=payload.name,
        email=payload.email.lower(),
        phone=payload.phone,
        role="مدير النظام",
        department=payload.department or "الإدارة",
        status="نشط",
        permissions="all",
        password_salt=salt,
        password_hash=pwd_hash,
        last_active="لم يسجل الدخول",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user_to_response(user)


def require_permission(permission: str):
    """يسمح بالدخول فقط إذا كان المستخدم مدير نظام أو عنده الصلاحية المطلوبة."""

    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role == "مدير النظام":
            return current_user
        allowed = [p for p in (current_user.permissions or "").split(",") if p]
        if permission not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="ليس لديك صلاحية للوصول لهذا القسم",
            )
        return current_user

    return checker


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(
            User.email == payload.email.lower(), User.is_archived == False  # noqa: E712
        )
        .first()
    )
    if not user or not verify_password(
        payload.password, user.password_salt, user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="بيانات الدخول غير صحيحة"
        )
    if user.status != "نشط":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="الحساب موقوف حاليًا"
        )
    new_token = generate_token()
    session_row = UserSession(
        user_id=user.id,
        token=new_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=TOKEN_TTL_DAYS),
    )
    db.add(session_row)
    user.last_active = "الآن"
    db.commit()
    db.refresh(user)
    return LoginResponse(token=new_token, user=user_to_response(user))


@router.post("/logout")
def logout(
    authorization: str | None = Header(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
        db.query(UserSession).filter(UserSession.token == token).delete()
    db.commit()
    return {"ok": True}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)
