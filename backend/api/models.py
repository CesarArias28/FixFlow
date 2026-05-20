from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(db.String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(db.String(80), nullable=False)
    role: Mapped[str] = mapped_column(db.String(20), nullable=False)

class Property(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(db.String(200), nullable=False)

    class Incidence(db.Model):
     id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(100), nullable=False)
    description: Mapped[str] = mapped_column(db.String(500), nullable=False)
    status: Mapped[str] = mapped_column(db.String(20), default="Pendiente")
    severity: Mapped[Optional[str]] = mapped_column(db.String(20), nullable=True) 
    specialty: Mapped[Optional[str]] = mapped_column(db.String(50), nullable=True) 
      
    tenant_id: Mapped[int] = mapped_column(db.ForeignKey('user.id'), nullable=False)
    property_id: Mapped[int] = mapped_column(db.ForeignKey('property.id'), nullable=False)