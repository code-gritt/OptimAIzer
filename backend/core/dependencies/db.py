from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_4bDAOTSKdN0z@ep-quiet-dream-acs172xb-pooler.sa-east-1.aws.neon.tech/optimaizer-database?sslmode=require&channel_binding=require"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # checks connections before using
    connect_args={"sslmode": "require"}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
