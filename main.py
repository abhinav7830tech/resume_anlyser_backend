from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager

from resume_parser import extract_text_from_pdf
from ai_service import (
    extract_skills_and_feedback,
    generate_interview_questions,
    chat_with_interviewer,
    chat_support,
)
from config.db import init_db
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from models.user import User


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Resume & Interview Assistant", lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://resume-frontend-lm4q.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        raise HTTPException(status_code=400, detail="Email already registered")

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
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
        },
    }


@app.post("/api/auth/login")
async def login(request: LoginRequest):
    from models.user import get_user_by_email

    user = await get_user_by_email(request.email)

    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
        },
    }


@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(default="Software Engineer"),
    current_user: User = Depends(get_current_user),
):
    file_bytes = await file.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    try:
        analysis = extract_skills_and_feedback(resume_text)
        questions = generate_interview_questions(resume_text, job_role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

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


class ChatMessage(BaseModel):
    role: str
    content: str


class InterviewRequest(BaseModel):
    resume_text: str
    job_role: str
    conversation_history: List[ChatMessage]
    user_message: Optional[str] = None
    category: Optional[str] = "technical"


@app.post("/api/interview/chat")
async def interview_chat(request: InterviewRequest):
    gemini_history = [
        {"role": msg.role, "parts": [msg.content]}
        for msg in request.conversation_history
    ]

    try:
        response = chat_with_interviewer(
            resume_text=request.resume_text,
            job_role=request.job_role,
            conversation_history=gemini_history,
            user_message=request.user_message,
            category=request.category,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview AI failed: {str(e)}")

    return {"response": response}


@app.post("/chat")
async def support_chat(request: dict):
    try:
        response = chat_support(request["message"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"response": response}


@app.get("/api/analysis/history")
async def get_analysis_history(current_user: User = Depends(get_current_user)):
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
    from models.analysis import ResumeAnalysis
    from bson import ObjectId

    try:
        analysis = await ResumeAnalysis.find_one(
            ResumeAnalysis.id == ObjectId(analysis_id),
            ResumeAnalysis.user_id == str(current_user.id),
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return {
        "id": str(analysis.id),
        "resume_text": analysis.resume_text,
        "job_role": analysis.job_role,
        "analysis": analysis.analysis,
        "questions": analysis.questions,
        "created_at": analysis.created_at.isoformat(),
    }


@app.get("/api/interview/history")
async def get_interview_history(current_user: User = Depends(get_current_user)):
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


@app.get("/")
async def root():
    return {"status": "ok", "message": "Resume & Interview Assistant API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}