from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from core.models.user import User
from core.models.activity import Activity
from core.dependencies.db import get_db
from graphene import ObjectType, String, Int, List, Mutation, Field, Boolean, Schema
from graphene_sqlalchemy import SQLAlchemyObjectType
from jose import JWTError, jwt
from datetime import datetime
from dotenv import load_dotenv
import os
from starlette_graphene3 import GraphQLApp

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv(
    "SECRET_KEY") or "8766025a293c21f4f1a6d73ea3b03626cde4aefbad60742dfa6d37119a22fb08"
ALGORITHM = "HS256"

router = APIRouter()


# Graphene SQLAlchemy Object
class ActivityType(SQLAlchemyObjectType):
    class Meta:
        model = Activity
        interfaces = ()


# GraphQL Queries
class Query(ObjectType):
    activities = List(
        ActivityType, description="List of all activities for the authenticated user"
    )

    async def resolve_activities(self, info):
        db: Session = info.context["db"]
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(401, "Authorization header missing or invalid")

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(401, "User not found")
            return user.activities
        except JWTError:
            raise HTTPException(401, "Invalid token")


# GraphQL Mutations
class CreateActivity(Mutation):
    class Arguments:
        activity = String(required=True)

    activity = Field(ActivityType)

    async def mutate(self, info, activity: str):
        db: Session = info.context["db"]
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(401, "Authorization header missing or invalid")

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(401, "User not found")

            new_activity = Activity(
                user_id=user.id, activity=activity, timestamp=datetime.utcnow()
            )
            db.add(new_activity)
            db.commit()
            db.refresh(new_activity)
            return CreateActivity(activity=new_activity)
        except JWTError:
            raise HTTPException(401, "Invalid token")


class UpdateActivity(Mutation):
    class Arguments:
        id = Int(required=True)
        activity = String(required=True)

    activity = Field(ActivityType)

    async def mutate(self, info, id: int, activity: str):
        db: Session = info.context["db"]
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(401, "Authorization header missing or invalid")

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(401, "User not found")

            activity_record = db.query(Activity).filter(
                Activity.id == id, Activity.user_id == user.id
            ).first()
            if not activity_record:
                raise HTTPException(404, "Activity not found or unauthorized")

            activity_record.activity = activity
            db.commit()
            db.refresh(activity_record)
            return UpdateActivity(activity=activity_record)
        except JWTError:
            raise HTTPException(401, "Invalid token")


class DeleteActivity(Mutation):
    class Arguments:
        id = Int(required=True)

    success = Field(Boolean)

    async def mutate(self, info, id: int):
        db: Session = info.context["db"]
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(401, "Authorization header missing or invalid")

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(401, "User not found")

            activity_record = db.query(Activity).filter(
                Activity.id == id, Activity.user_id == user.id
            ).first()
            if not activity_record:
                raise HTTPException(404, "Activity not found or unauthorized")

            db.delete(activity_record)
            db.commit()
            return DeleteActivity(success=True)
        except JWTError:
            raise HTTPException(401, "Invalid token")


class Mutation(ObjectType):
    create_activity = CreateActivity.Field()
    update_activity = UpdateActivity.Field()
    delete_activity = DeleteActivity.Field()


# Create GraphQL schema and app
schema = Schema(query=Query, mutation=Mutation)


def context_injector(request):
    return {"request": request, "db": next(get_db())}


graphql_app = GraphQLApp(schema=schema, context_value=context_injector)

# Add route
router.add_route("/activities", graphql_app)
