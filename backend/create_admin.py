"""
سكربت لمرة واحدة: ينشئ حساب المدير الرئيسي بكلمة مرور حقيقية تختارينها.
شغليه من مجلد backend:  python create_admin.py
"""
import getpass
import sys

sys.path.insert(0, ".")

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models.user import User  # noqa: E402
from app.security import hash_password  # noqa: E402

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    email = input("البريد الإلكتروني للمدير: ").strip().lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"يوجد حساب فعلاً بهذا البريد ({existing.display_id}). ألغيت العملية.")
        sys.exit(1)

    name = input("الاسم الكامل: ").strip()
    password = getpass.getpass("كلمة المرور (لن تظهر أثناء الكتابة): ").strip()
    confirm = getpass.getpass("أعيدي كتابة كلمة المرور: ").strip()
    if password != confirm:
        print("كلمتا المرور غير متطابقتين. ألغيت العملية.")
        sys.exit(1)
    if len(password) < 6:
        print("كلمة المرور لازم تكون 6 خانات على الأقل. ألغيت العملية.")
        sys.exit(1)

    salt, pwd_hash = hash_password(password)
    all_permissions = [
        "لوحة التحكم", "العملاء", "الطلبات", "الفواتير", "المدفوعات",
        "الشحنات", "المخزون", "التقارير", "المستخدمون",
    ]
    user = User(
        name=name,
        email=email,
        role="مدير النظام",
        department="الإدارة",
        status="نشط",
        permissions=",".join(all_permissions),
        password_salt=salt,
        password_hash=pwd_hash,
        last_active="لم يسجل الدخول",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    user.display_id = f"USR-{user.id:03d}"
    db.commit()
    print(f"تم إنشاء حساب المدير بنجاح: {user.display_id} — {user.email}")
finally:
    db.close()