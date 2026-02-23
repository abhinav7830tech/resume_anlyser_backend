from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager

from resume_parser import extract_text_from_pdf
from ai_service import (
    extract_skills_and_feedback,
    generate_interview_questions,
    chat_with_interviewer,
)
from config.db import init_db
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from models.user import User, UserResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Resume & Interview Assistant", lifespan=lifespan)

# CORS — Frontend ko Backend se baat karne do
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── AUTH ───────────────────────────────────────────────────


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/auth/register")
async def register(request: RegisterRequest):
    from models.user import get_user_by_email

    existing = await get_user_by_email(request.email)
    if existing:
        return {"error": "Email already registered"}

    hashed_password = hash_password(request.password)
    user = User(
        username=request.username,
        email=request.email,
        password=hashed_password,
    )
    await user.create()

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": str(user.id), "username": user.username, "email": user.email},
    }


@app.post("/api/auth/login")
async def login(request: LoginRequest):
    from models.user import get_user_by_email

    user = await get_user_by_email(request.email)
    if not user or not verify_password(request.password, user.password):
        return {"error": "Invalid email or password"}

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": str(user.id), "username": user.username, "email": user.email},
    }


# ─── PART 1: RESUME ANALYZER ───────────────────────────────


@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(default="Software Engineer"),
    current_user: User = Depends(get_current_user),
):
    """Resume PDF upload karo → analysis wapas milega"""

    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        return {"error": "PDF se text nahi nikal paya"}

    analysis = extract_skills_and_feedback(resume_text)
    questions = generate_interview_questions(resume_text, job_role)

    from models.analysis import ResumeAnalysis

    saved_analysis = ResumeAnalysis(
        user_id=str(current_user.id),
        resume_text=resume_text,
        job_role=job_role,
        analysis=analysis,
        questions=questions,
    )
    await saved_analysis.create()

    return {
        "id": str(saved_analysis.id),
        "resume_text": resume_text[:500],
        "analysis": analysis,
        "questions": questions,
        "job_role": job_role,
        "created_at": saved_analysis.created_at.isoformat(),
    }


# ─── PART 2: AI INTERVIEWER ────────────────────────────────


class ChatMessage(BaseModel):
    role: str  # "user" ya "model"
    content: str


class InterviewRequest(BaseModel):
    resume_text: str
    job_role: str
    conversation_history: List[ChatMessage]
    user_message: Optional[str] = None
    category: Optional[str] = "technical"


@app.post("/api/interview/chat")
async def interview_chat(request: InterviewRequest):
    """Live AI interview conversation"""

    gemini_history = [
        {"role": msg.role, "parts": [msg.content]}
        for msg in request.conversation_history
    ]

    response = chat_with_interviewer(
        resume_text=request.resume_text,
        job_role=request.job_role,
        conversation_history=gemini_history,
        user_message=request.user_message,
        category=request.category,
    )

    return {"response": response}


# ─── HEALTH CHECK ──────────────────────────────────────────


@app.get("/")
async def root():
    return {"status": "ok", "message": "Resume & Interview Assistant API is running"}


# ─── HELP & SUPPORT CHAT ───────────────────────────────────


class SupportChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def support_chat(request: SupportChatRequest):
    """General support chat for user queries"""
    from ai_service import chat_support

    response = chat_support(request.message)
    return {"response": response}


# ─── ANALYSIS HISTORY ───────────────────────────────────────


@app.get("/api/analysis/history")
async def get_analysis_history(current_user: User = Depends(get_current_user)):
    """Get all resume analyses for the current user"""
    from models.analysis import ResumeAnalysis

    analyses = (
        await ResumeAnalysis.find(ResumeAnalysis.user_id == str(current_user.id))
        .sort(-ResumeAnalysis.created_at)
        .to_list()
    )

    return {
        "analyses": [
            {
                "id": str(a.id),
                "job_role": a.job_role,
                "created_at": a.created_at.isoformat(),
                "summary": a.analysis.get("summary", "")[:100],
            }
            for a in analyses
        ]
    }


@app.get("/api/analysis/{analysis_id}")
async def get_analysis(
    analysis_id: str, current_user: User = Depends(get_current_user)
):
    """Get a specific analysis by ID"""
    from models.analysis import ResumeAnalysis
    from bson import ObjectId

    try:
        analysis = await ResumeAnalysis.find_one(
            ResumeAnalysis.id == ObjectId(analysis_id),
            ResumeAnalysis.user_id == str(current_user.id),
        )
    except Exception:
        return {"error": "Invalid analysis ID"}

    if not analysis:
        return {"error": "Analysis not found"}

    return {
        "id": str(analysis.id),
        "resume_text": analysis.resume_text,
        "job_role": analysis.job_role,
        "analysis": analysis.analysis,
        "questions": analysis.questions,
        "created_at": analysis.created_at.isoformat(),
    }


# ─── INTERVIEW SESSIONS ─────────────────────────────────────


@app.post("/api/interview/start")
async def start_interview(
    resume_text: str,
    job_role: str,
    category: str = "technical",
    current_user: User = Depends(get_current_user),
):
    """Start a new interview session"""
    from models.analysis import InterviewSession

    session = InterviewSession(
        user_id=str(current_user.id),
        resume_text=resume_text,
        job_role=job_role,
        category=category,
        conversation=[],
    )
    await session.create()

    return {"session_id": str(session.id)}


@app.get("/api/interview/history")
async def get_interview_history(current_user: User = Depends(get_current_user)):
    """Get all interview sessions for the current user"""
    from models.analysis import InterviewSession

    sessions = (
        await InterviewSession.find(InterviewSession.user_id == str(current_user.id))
        .sort(-InterviewSession.created_at)
        .to_list()
    )

    return {
        "sessions": [
            {
                "id": str(s.id),
                "job_role": s.job_role,
                "category": s.category,
                "message_count": len(s.conversation),
                "created_at": s.created_at.isoformat(),
            }
            for s in sessions
        ]
    }


@app.get("/api/interview/{session_id}")
async def get_interview_session(
    session_id: str, current_user: User = Depends(get_current_user)
):
    """Get a specific interview session"""
    from models.analysis import InterviewSession
    from bson import ObjectId

    try:
        session = await InterviewSession.find_one(
            InterviewSession.id == ObjectId(session_id),
            InterviewSession.user_id == str(current_user.id),
        )
    except Exception:
        return {"error": "Invalid session ID"}

    if not session:
        return {"error": "Session not found"}

    return {
        "id": str(session.id),
        "resume_text": session.resume_text,
        "job_role": session.job_role,
        "category": session.category,
        "conversation": session.conversation,
        "created_at": session.created_at.isoformat(),
    }
