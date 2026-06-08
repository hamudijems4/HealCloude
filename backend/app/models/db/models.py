import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Enum as SAEnum, ForeignKey, Float, Text, Date, JSON
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
    NGO_ANALYST = "ngo_analyst"
    SUPER_ADMIN = "super_admin"


class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    ATTENDED = "attended"
    MISSED = "missed"
    CANCELLED = "cancelled"


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
    phone: Mapped[str | None] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    staff: Mapped[list["Profile"]] = relationship("Profile", back_populates="facility")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="facility")


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    fayda_id: Mapped[str | None] = mapped_column(String(20), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    date_of_birth: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(10))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.PATIENT)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    facility_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=True)
    region: Mapped[str | None] = mapped_column(String(100))
    woreda: Mapped[str | None] = mapped_column(String(100))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    facility: Mapped["Facility | None"] = relationship("Facility", back_populates="staff")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    wellness_scores: Mapped[list["WellnessScore"]] = relationship("WellnessScore", back_populates="patient")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"))
    clinician_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[AppointmentStatus] = mapped_column(SAEnum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    notes: Mapped[str | None] = mapped_column(Text)
    appointment_type: Mapped[str] = mapped_column(String(100))
    ai_scheduled: Mapped[bool] = mapped_column(Boolean, default=False)
    ussd_notified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient: Mapped["Profile"] = relationship("Profile", back_populates="appointments", foreign_keys=[patient_id])
    facility: Mapped["Facility"] = relationship("Facility", back_populates="appointments")


class WellnessScore(Base):
    __tablename__ = "wellness_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    score: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String(20))
    risk_factors: Mapped[str | None] = mapped_column(Text)
    ai_notes: Mapped[str | None] = mapped_column(Text)
    computed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient: Mapped["Profile"] = relationship("Profile", back_populates="wellness_scores")


class DiseaseAlert(Base):
    __tablename__ = "disease_alerts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    region: Mapped[str] = mapped_column(String(100))
    zone: Mapped[str | None] = mapped_column(String(100))
    disease: Mapped[str] = mapped_column(String(100))
    severity: Mapped[str] = mapped_column(String(20))
    case_count: Mapped[int] = mapped_column(default=0)
    trend_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    alert_date: Mapped[datetime] = mapped_column(Date, nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
