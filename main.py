from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from resume_parser import extract_text_from_pdf
from ai_service import (
    extract_skills_and_feedback,
    generate_interview_questions,
    chat_with_interviewer,
)

app = FastAPI(title="Resume & Interview Assistant")

# CORS — Frontend ko Backend se baat karne do
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── PART 1: RESUME ANALYZER ───────────────────────────────


@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...), job_role: str = Form(default="Software Engineer")
):
    """Resume PDF upload karo → analysis wapas milega"""

    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        return {"error": "PDF se text nahi nikal paya"}

    analysis = extract_skills_and_feedback(resume_text)
    questions = generate_interview_questions(resume_text, job_role)

    return {
        "resume_text": resume_text[:500],  # Preview ke liye
        "analysis": analysis,
        "questions": questions,
        "job_role": job_role,
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
