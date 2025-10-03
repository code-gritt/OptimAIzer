from sqlalchemy.orm import Session, declarative_base
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = "postgresql://neondb_owner:npg_4bDAOTSKdN0z@ep-quiet-dream-acs172xb-pooler.sa-east-1.aws.neon.tech/optimaizer-database?sslmode=require&channel_binding=require"
engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()
