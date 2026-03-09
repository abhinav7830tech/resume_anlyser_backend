from beanie import init_beanie
from models.user import User
from models.analysis import ResumeAnalysis, InterviewSession
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

_client = None
_db = None


async def init_db():
    global _client, _db

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in environment variables")

    _client = AsyncIOMotorClient(
        DATABASE_URL,
        tls=True,
        tlsCAFile=certifi.where()
    )

    # database name
    _db = _client["resume_db"]

    await init_beanie(
        database=_db,
        document_models=[
            User,
            ResumeAnalysis,
            InterviewSession
        ]
    )


async def get_db():
    return _db