from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.routes.auth import graphql_app
from core.models.user import Base
from core.dependencies.db import engine

app = FastAPI()

origins = [
    "https://optimaizer.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(graphql_app, prefix="/graphql")
