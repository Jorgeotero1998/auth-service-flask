from __future__ import annotations

import uuid

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy import select

from app.models import User
from app.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password

bp = Blueprint("api", __name__)


@bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@bp.post("/auth/register")
def register():
    data = request.get_json(force=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    if not email or not password:
        return jsonify({"detail": "email/password required"}), 400

    session = current_app.session  # type: ignore[attr-defined]
    existing = session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing:
        return jsonify({"detail": "email already exists"}), 409

    u = User(email=email, hashed_password=hash_password(password), role="user", is_active=True)
    session.add(u)
    session.commit()
    return jsonify({"id": str(u.id), "email": u.email}), 201


@bp.post("/auth/login")
def login():
    data = request.get_json(force=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    session = current_app.session  # type: ignore[attr-defined]

    user = session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        return jsonify({"detail": "invalid credentials"}), 401

    return jsonify(
        {
            "access_token": create_access_token(sub=str(user.id), role=user.role),
            "refresh_token": create_refresh_token(sub=str(user.id)),
            "token_type": "bearer",
        }
    )


@bp.post("/auth/refresh")
def refresh():
    data = request.get_json(force=True) or {}
    token = str(data.get("refresh_token", "")).strip()
    if not token:
        return jsonify({"detail": "missing refresh_token"}), 400
    try:
        payload = decode_token(token)
    except Exception:
        return jsonify({"detail": "invalid token"}), 401
    if payload.get("typ") != "refresh":
        return jsonify({"detail": "invalid token type"}), 401

    sub = payload.get("sub")
    try:
        user_uuid = uuid.UUID(str(sub))
    except Exception:
        return jsonify({"detail": "invalid subject"}), 401
    session = current_app.session  # type: ignore[attr-defined]
    user = session.execute(select(User).where(User.id == user_uuid)).scalar_one_or_none()
    if not user:
        return jsonify({"detail": "user not found"}), 401

    return jsonify(
        {
            "access_token": create_access_token(sub=str(user.id), role=user.role),
            "refresh_token": create_refresh_token(sub=str(user.id)),
            "token_type": "bearer",
        }
    )


@bp.get("/auth/me")
def me():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"detail": "missing bearer token"}), 401
    token = auth.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except Exception:
        return jsonify({"detail": "invalid token"}), 401
    if payload.get("typ") != "access":
        return jsonify({"detail": "invalid token type"}), 401
    return jsonify({"sub": payload.get("sub"), "role": payload.get("role")})

