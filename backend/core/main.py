from fastapi import FastAPI
from graphene import Schema
from starlette.graphql import GraphQLApp
from core.routes.auth import schema
from core.dependencies.db import engine
from core.models.user import Base

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Mount GraphQL endpoint
app.mount("/graphql", GraphQLApp(schema=schema))
