from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.models.user import User
from core.models.activity import Activity
from core.dependencies.db import get_db
from graphene import ObjectType, String, Int, List, Mutation, Field, Boolean
from graphene_sqlalchemy import SQLAlchemyObjectType
from jose import JWTError, jwt
from datetime import datetime
from dotenv import load_dotenv
import os

from graphene import Schema
from starlette.graphql import GraphQLApp

# Load environment variables
load_dotenv()
SECRET_KEY = "8766025a293c21f4f1a6d73ea3b03626cde4aefbad60742dfa6d37119a22fb08"
ALGORITHM = "HS256"

router = APIRouter()


# Graphene SQLAlchemy Object
class ActivityType(SQLAlchemyObjectType):
    class Meta:
        model = Activity


# Queries
class Query(ObjectType):
    activities = List(
        ActivityType,
        description="List of all activities for the authenticated user"
    )

    async def resolve_activities(self, info, db: Session = Depends(get_db)):
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid"
            )
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            return user.activities
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


# Mutations
class CreateActivity(Mutation):
    class Arguments:
        activity = String(required=True)

    activity = Field(ActivityType)

    async def mutate(self, info, activity, db: Session = Depends(get_db)):
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid"
            )
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            new_activity = Activity(
                user_id=user.id, activity=activity, timestamp=datetime.utcnow()
            )
            db.add(new_activity)
            db.commit()
            db.refresh(new_activity)
            return CreateActivity(activity=new_activity)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


class UpdateActivity(Mutation):
    class Arguments:
        id = Int(required=True)
        activity = String(required=True)

    activity = Field(ActivityType)

    async def mutate(self, info, id, activity, db: Session = Depends(get_db)):
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid"
            )
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            activity_record = db.query(Activity).filter(
                Activity.id == id, Activity.user_id == user.id
            ).first()
            if not activity_record:
                raise HTTPException(
                    status_code=404, detail="Activity not found or unauthorized"
                )
            activity_record.activity = activity
            db.commit()
            db.refresh(activity_record)
            return UpdateActivity(activity=activity_record)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


class DeleteActivity(Mutation):
    class Arguments:
        id = Int(required=True)

    success = Field(Boolean)

    async def mutate(self, info, id, db: Session = Depends(get_db)):
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid"
            )
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            activity_record = db.query(Activity).filter(
                Activity.id == id, Activity.user_id == user.id
            ).first()
            if not activity_record:
                raise HTTPException(
                    status_code=404, detail="Activity not found or unauthorized"
                )
            db.delete(activity_record)
            db.commit()
            return DeleteActivity(success=True)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


class Mutation(ObjectType):
    create_activity = CreateActivity.Field()
    update_activity = UpdateActivity.Field()
    delete_activity = DeleteActivity.Field()


# GraphQL schema & app
schema = Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLApp(schema=schema)
