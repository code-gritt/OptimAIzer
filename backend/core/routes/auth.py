from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import strawberry
from strawberry.fastapi import GraphQLRouter
from passlib.context import CryptContext
from jose import jwt, JWTError

load_dotenv()

SECRET_KEY = os.getenv(
    "SECRET_KEY", "8766025a293c21f4f1a6d73ea3b03626cde4aefbad60742dfa6d37119a22fb08")
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
    from core.models.user import User  # Import here to avoid circular import
    return db.query(User).filter(User.email == email).first()

# ------------------------- GraphQL Types -------------------------


@strawberry.type
class UserType:
    id: int
    email: str
    role: str
    credits: int

# ------------------------- Mutations -------------------------


@strawberry.type
class Mutation:

    @strawberry.mutation
    async def register(self, email: str, password: str) -> UserType:
        from core.dependencies.db import get_db  # Import here to avoid circular import
        db: Session = next(get_db())
        if get_user_by_email(db, email):
            raise HTTPException(
                status_code=400, detail="Email already registered")
        # Import here to avoid circular import
        from core.models.user import User, UserRole
        hashed_password = get_password_hash(password)
        user = User(email=email, hashed_password=hashed_password,
                    role=UserRole.USER, credits=100)
        db.add(user)
        db.commit()
        db.refresh(user)
        return UserType(id=user.id, email=user.email, role=user.role.value, credits=user.credits)

    @strawberry.mutation
    async def login(self, email: str, password: str) -> str:
        from core.dependencies.db import get_db  # Import here to avoid circular import
        db: Session = next(get_db())
        from core.models.user import User  # Import here to avoid circular import
        user = get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token(
            data={"sub": user.email, "role": user.role.value})
        return token

# ------------------------- Queries -------------------------


@strawberry.type
class Query:

    @strawberry.field
    async def me(self, info) -> UserType:
        request = info.context["request"]
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid")
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            from core.dependencies.db import get_db  # Import here to avoid circular import
            db: Session = next(get_db())
            from core.models.user import User  # Import here to avoid circular import
            user = get_user_by_email(db, email)
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            return UserType(id=user.id, email=user.email, role=user.role.value, credits=user.credits)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)
