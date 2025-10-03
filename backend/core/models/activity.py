from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from core.models.user import User

Base = declarative_base()


class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    user = relationship("User", back_populates="activities")


User.activities = relationship(
    "Activity", order_by=Activity.id, back_populates="user")
