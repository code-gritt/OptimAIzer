from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Strawberry GraphQLRouter
from core.routes.auth import graphql_app as auth_graphql_app
# Graphene GraphQLApp
from core.routes.activity import graphql_app as activity_graphql_app
from core.routes.oauth import router as oauth_router
from core.models.user import Base as UserBase
from core.models.activity import Base as ActivityBase
from core.dependencies.db import engine
from starlette.responses import RedirectResponse

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

# Create database tables
UserBase.metadata.create_all(bind=engine)
ActivityBase.metadata.create_all(bind=engine)

# Mount GraphQL apps as separate endpoints
app.mount("/graphql/auth", auth_graphql_app)  # For login, register, me
app.mount("/graphql/activity", activity_graphql_app)  # For activities

# Redirect /graphql to /graphql/auth as a fallback (temporary)


@app.post("/graphql")
async def redirect_graphql():
    return RedirectResponse(url="/graphql/auth")

# Mount OAuth routes
app.include_router(oauth_router, prefix="/oauth")
