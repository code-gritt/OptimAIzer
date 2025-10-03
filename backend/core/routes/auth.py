from fastapi import Depends, HTTPException, status
from graphene import ObjectType, String, Int, Mutation, Schema, Field, Enum
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from core.models.user import User, UserRole
from core.schemas.user import UserCreate, UserResponse
from core.dependencies.db import get_db
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY = "8766025a293c21f4f1a6d73ea3b03626cde4aefbad60742dfa6d37119a22fb08"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


class UserRoleEnum(Enum):
    USER = "user"
    ADMIN = "admin"


class UserType(ObjectType):
    id = Int()
    email = String()
    role = String()
    credits = Int()


class Register(Mutation):
    class Arguments:
        email = String(required=True)
        password = String(required=True)

    user = Field(UserType)

    def mutate(self, info, email, password, db: Session = Depends(get_db)):
        if get_user_by_email(db, email):
            raise HTTPException(
                status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(password)
        user = User(email=email, hashed_password=hashed_password,
                    role=UserRole.USER, credits=100)
        db.add(user)
        db.commit()
        db.refresh(user)
        return Register(user=UserResponse.from_orm(user))


class Login(Mutation):
    class Arguments:
        email = String(required=True)
        password = String(required=True)

    token = String()
    user = Field(UserType)

    def mutate(self, info, email, password, db: Session = Depends(get_db)):
        user = get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token(
            data={"sub": user.email, "role": user.role.value})
        return Login(token=token, user=UserResponse.from_orm(user))


class Me(ObjectType):
    user = Field(UserType)

    def resolve_user(self, info, db: Session = Depends(get_db)):
        auth_header = info.context["request"].headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid")
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = get_user_by_email(db, email)
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            return UserResponse.from_orm(user)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


class Query(ObjectType):
    me = Field(Me)


class Mutation(ObjectType):
    register = Register.Field()
    login = Login.Field()


schema = Schema(query=Query, mutation=Mutation)
