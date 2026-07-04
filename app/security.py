from __future__ import annotations

import os
import time
from typing import Any

import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def _secret() -> str:
    s = os.getenv("JWT_SECRET", "")
    if not s:
        raise RuntimeError("Missing JWT_SECRET")
    return s


def create_access_token(*, sub: str, role: str) -> str:
    now = int(time.time())
    exp = now + int(os.getenv("JWT_ACCESS_TTL_SECONDS", "900"))
    payload: dict[str, Any] = {"typ": "access", "sub": sub, "role": role, "iat": now, "exp": exp}
    return jwt.encode(payload, _secret(), algorithm="HS256")


def create_refresh_token(*, sub: str) -> str:
    now = int(time.time())
    exp = now + int(os.getenv("JWT_REFRESH_TTL_SECONDS", str(60 * 60 * 24 * 14)))
    payload: dict[str, Any] = {"typ": "refresh", "sub": sub, "iat": now, "exp": exp}
    return jwt.encode(payload, _secret(), algorithm="HS256")


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, _secret(), algorithms=["HS256"])

