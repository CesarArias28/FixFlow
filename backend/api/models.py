from sqlalchemy import Nullable
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)
    phone_prefix: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    property_id: Mapped[Optional[int]] = mapped_column(ForeignKey('property.id'), nullable=True)
    property = db.relationship('Property', backref='users')

    def __str__(self):
        return f"{self.email} ({self.role})"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    

class Property(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(String(200), nullable=False)
    pin_code: Mapped[Optional[str]] = mapped_column(String(20), unique=True, nullable=True)

    def __str__(self):
        return f"{self.address}"

class Asset(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    property_id : Mapped[int] = mapped_column(ForeignKey('property.id'), nullable=False)

    def __init__(self, name: str, property_id: int):
        self.name = name
        self.property_id = property_id

    def __str__(self):
        return f"{self.name}"


class Incidence(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(100), nullable=False)
    description: Mapped[str] = mapped_column(db.String(500), nullable=False)
    status: Mapped[str] = mapped_column(db.String(20), default="Pendiente")
    severity: Mapped[Optional[str]] = mapped_column(db.String(20), nullable=True) 
    specialty: Mapped[Optional[str]] = mapped_column(db.String(50), nullable=True)
    asset_id: Mapped[Optional[int]] = mapped_column(ForeignKey('asset.id'), nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(db.DateTime, nullable=True)
    asset = db.relationship('Asset', backref='incidences')
      
    tenant_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    property_id: Mapped[int] = mapped_column(ForeignKey('property.id'), nullable=False)
    property = db.relationship('Property', backref='incidences')
    technician_id: Mapped[Optional[int]] = mapped_column(ForeignKey('user.id'), nullable=True)

    def __str__(self):
        return f"Incidencia #{self.id} - {self.title}"



    def __init__(
        self,
        title: str,
        description: str,
        tenant_id: int,
        property_id: int,
        status: str = "Pendiente",
        severity: Optional[str] = None,
        specialty: Optional[str] = None,
        technician_id: Optional[int] = None,
        asset_id: Optional[int] = None


    ):
        self.title = title
        self.description = description
        self.tenant_id = tenant_id
        self.property_id = property_id
        self.status = status
        self.severity = severity
        self.specialty = specialty
        self.technician_id = technician_id
        self.asset_id = asset_id