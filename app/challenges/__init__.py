# app/challenges/__init__.py
from fastapi import FastAPI
from .router import router  # your B2 router with /challenges and /quizzes endpoints

# This is the *sub-app* for B2
app = FastAPI(
    title="DevNest - Content & Challenge Management (B2)",
    description="Create, store, and manage challenges & quizzes.",
    docs_url="/",              # so http://127.0.0.1:8000/challenges shows Swagger
    openapi_url="/openapi.json"
)

# include all B2 routes (both /challenges/* and /quizzes/*)
app.include_router(router)
