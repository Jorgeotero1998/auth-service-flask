from __future__ import annotations

import os

from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from app.models import Base


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["ENV"] = os.getenv("ENV", "local")

    database_url = os.getenv("DATABASE_URL", "")
    if not database_url:
        raise RuntimeError("Missing DATABASE_URL")

    engine = create_engine(database_url, pool_pre_ping=True)
    Session = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))

    # init schema (demo). In real production you'd use migrations.
    Base.metadata.create_all(bind=engine)

    app.session = Session  # type: ignore[attr-defined]

    from app.routes import bp

    app.register_blueprint(bp)
    return app

