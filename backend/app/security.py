import hashlib
import hmac
import secrets


def hash_password(password: str) -> tuple[str, str]:
    """Returns (salt, hash) - never store plaintext passwords."""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 200_000
    )
    return salt, pwd_hash.hex()


def verify_password(password: str, salt: str, stored_hash: str) -> bool:
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 200_000
    )
    return hmac.compare_digest(pwd_hash.hex(), stored_hash)


def generate_token() -> str:
    return secrets.token_urlsafe(32)