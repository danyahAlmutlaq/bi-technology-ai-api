import json
from sqlalchemy.orm import Session
from app.models.administration import AuditLog


def log_audit(db: Session, actor, action: str, entity_type: str, entity_id=None, entity_label=None, changes=None):
    actor_desc = ""
    if actor is not None:
        name = getattr(actor, "name", None) or ""
        email = getattr(actor, "email", None) or ""
        actor_desc = (name + " (" + email + ")").strip()

    numeric_entity_id = None
    entity_id_text = None
    if entity_id is not None:
        try:
            numeric_entity_id = int(entity_id)
        except (TypeError, ValueError):
            entity_id_text = str(entity_id)

    parts = []
    if actor_desc:
        parts.append("بواسطة: " + actor_desc)
    if entity_label:
        parts.append(str(entity_label))
    if entity_id_text:
        parts.append("(" + entity_id_text + ")")
    if changes:
        parts.append(json.dumps(changes, ensure_ascii=False, default=str))
    details = " | ".join(parts) if parts else None

    entry = AuditLog(
        employee_id=None,
        action=action,
        entity_type=entity_type,
        entity_id=numeric_entity_id,
        details=details,
    )
    db.add(entry)
