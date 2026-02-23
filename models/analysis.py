from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime
from typing import Optional, Dict, Any, List


class ResumeAnalysis(Document):
    user_id: Indexed(str)
    resume_text: str
    job_role: str
    analysis: Dict[str, Any]
    questions: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resume_analyses"


class InterviewSession(Document):
    user_id: Indexed(str)
    resume_text: str
    job_role: str
    category: str
    conversation: List[Dict[str, str]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interview_sessions"
