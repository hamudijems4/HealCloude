import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Enum as SAEnum, ForeignKey, Float, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    PATIENT = "patient"
    CLINICIAN = "clinician"
    FACILITY_ADMIN = "facility_admin"
    MOH_ANALYST = "moh_analyst"
    SUPER_ADMIN = "super_admin"


class Profile(Base):
    """
    App-level profile that extends Supabase auth.users.
    `id` mirrors auth.users.id (UUID) — set on insert, never auto-generated here.
    Supabase Auth owns passwords, email confirmation, and sessions.
    """
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)  # = auth.users.id
    fayda_id: Mapped[str | None] = mapped_column(String(20), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.PATIENT)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    facility_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    facility: Mapped["Facility | None"] = relationship("Facility", back_populates="staff")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    wellness_scores: Mapped[list["WellnessScore"]] = relationship("WellnessScore", back_populates="patient")


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(50))
    region: Mapped[str] = mapped_column(String(100))
    zone: Mapped[str | None] = mapped_column(String(100))
    woreda: Mapped[str | None] = mapped_column(String(100))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    is_online: Mapped[bool] = mapped_column(Boolean, default=True)
    fhir_endpoint: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    staff: Mapped[list["Profile"]] = relationship("Profile", back_populates="facility")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="facility")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"))
    clinician_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    attended: Mapped[bool | None] = mapped_column(Boolean, default=None)
    notes: Mapped[str | None] = mapped_column(Text)
    appointment_type: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient: Mapped["Profile"] = relationship("Profile", back_populates="appointments", foreign_keys=[patient_id])
    facility: Mapped["Facility"] = relationship("Facility", back_populates="appointments")


class WellnessScore(Base):
    __tablename__ = "wellness_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    score: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String(20))
    risk_factors: Mapped[str | None] = mapped_column(Text)  # JSON string
    computed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient: Mapped["Profile"] = relationship("Profile", back_populates="wellness_scores")


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(50))  # hospital, clinic, health_center
    region: Mapped[str] = mapped_column(String(100))
    zone: Mapped[str | None] = mapped_column(String(100))
    woreda: Mapped[str | None] = mapped_column(String(100))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    is_online: Mapped[bool] = mapped_column(Boolean, default=True)
    fhir_endpoint: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    staff: Mapped[list["User"]] = relationship("User", back_populates="facility")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="facility")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"))
    clinician_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    attended: Mapped[bool | None] = mapped_column(Boolean, default=None)
    notes: Mapped[str | None] = mapped_column(Text)
    appointment_type: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient: Mapped["User"] = relationship("User", back_populates="appointments", foreign_keys=[patient_id])
    facility: Mapped["Facility"] = relationship("Facility", back_populates="appointments")


class WellnessScore(Base):
    __tablename__ = "wellness_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    score: Mapped[float] = mapped_column(Float)  # 0-100
    risk_level: Mapped[str] = mapped_column(String(20))  # low, medium, high, critical
    risk_factors: Mapped[str | None] = mapped_column(Text)  # JSON string
    computed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient: Mapped["User"] = relationship("User", back_populates="wellness_scores")
