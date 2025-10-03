from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from core.routes.auth import graphql_app as auth_graphql_app  # Strawberry
from core.routes.activity import graphql_app as activity_graphql_app  # Graphene
from core.routes.oauth import router as oauth_router
from core.models.user import Base as UserBase
from core.models.activity import Base as ActivityBase
from core.dependencies.db import engine, get_db
from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse
from graphql import parse, graphql_sync
import strawberry
import graphene

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

# Create a single GraphQL router to proxy requests
graphql_router = APIRouter()


@graphql_router.post("/graphql")
async def graphql_endpoint(request: Request, db=Depends(get_db)):
    data = await request.json()
    query = data.get("query", "")
    variables = data.get("variables", {})
    operation_name = data.get("operationName")

    if not query:
        return JSONResponse({"errors": [{"message": "No query provided"}]})

    # Determine if the query/mutation belongs to auth or activity
    is_auth_query = any(op in query.lower()
                        for op in ["login", "register", "me"])
    is_activity_query = any(op in query.lower() for op in [
                            "activities", "create_activity", "update_activity", "delete_activity"])

    try:
        if is_auth_query and not is_activity_query:
            # Proxy to Strawberry (auth)
            auth_response = await auth_graphql_app(request)
            return JSONResponse(await auth_response.json())
        elif is_activity_query and not is_auth_query:
            # Proxy to Graphene (activity)
            activity_response = await activity_graphql_app(request)
            return JSONResponse(await activity_response.json())
        else:
            return JSONResponse({
                "errors": [{"message": "Ambiguous query: Please specify auth or activity operations separately."}]
            })
    except Exception as e:
        return JSONResponse({"errors": [{"message": str(e)}]})

# Mount the GraphQL router
app.include_router(graphql_router)

# Mount OAuth routes
app.include_router(oauth_router, prefix="/oauth")
