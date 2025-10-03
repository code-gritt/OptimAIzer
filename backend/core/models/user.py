# core/models/user.py
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import Base  # single shared Base


class UserRole(PyEnum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    credits = Column(Integer, default=100)

    # Use string reference to avoid circular import
    activities = relationship(
        "Activity", back_populates="user", cascade="all, delete-orphan")
