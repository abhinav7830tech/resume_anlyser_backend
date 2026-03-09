import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=API_KEY)

MODEL = genai.GenerativeModel("gemini-1.5-flash")


def extract_skills_and_feedback(resume_text):

    prompt = f"""
    Analyze the resume below and return ONLY valid JSON.

    Resume Text:
    {resume_text[:4000]}

    Return this JSON structure only:
    {{
        "personal_info": {{
            "name": "candidate name or Unknown",
            "email": "email or Not found",
            "phone": "phone or Not found"
        }},
        "skills": {{
            "technical": ["skill1","skill2"],
            "soft": ["skill1","skill2"],
            "tools": ["tool1","tool2"]
        }},
        "experience_years": "example: 2 years or Fresher",
        "education": "highest degree",
        "ats_score": 7,
        "ats_score_reason": "reason",
        "strengths": ["s1","s2","s3"],
        "weaknesses": ["w1","w2"],
        "improvements": ["i1","i2","i3"],
        "overall_rating": 7,
        "summary": "2-3 line summary"
    }}
    """

    try:
        response = MODEL.generate_content(prompt)
        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw)

    except Exception as e:
        print("AI Error:", e)
        return {"error": "Analysis failed"}


def generate_interview_questions(resume_text, job_role):

    prompt = f"""
    Generate interview questions for a {job_role} role.

    Resume:
    {resume_text[:3000]}

    Return ONLY JSON:
    {{
        "technical":[{{"question":"Q1","hint":"hint"}}],
        "behavioral":[{{"question":"Q1","hint":"hint"}}],
        "situational":[{{"question":"Q1","hint":"hint"}}],
        "hr":[{{"question":"Q1","hint":"hint"}}]
    }}
    """

    try:
        response = MODEL.generate_content(prompt)
        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw)

    except Exception as e:
        print("AI Error:", e)
        return {"error": "Question generation failed"}


def chat_with_interviewer(resume_text, job_role, conversation_history, user_message, category="technical"):

    system_context = f"""
    You are a professional interviewer for a {job_role} role.

    Resume:
    {resume_text[:2000]}

    Ask questions in English.
    Ask one question at a time.
    """

    try:
        if not conversation_history:
            prompt = system_context + "\nStart the interview with greeting and first question."
        else:
            prompt = f"""
            {system_context}

            Conversation so far:
            {conversation_history}

            Candidate said: {user_message}

            Continue the interview.
            """

        response = MODEL.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Chat Error:", e)
        return "Interview error occurred."


def chat_support(user_message):

    prompt = f"""
    You are a support assistant for a Resume Interview App.

    User query:
    {user_message}

    Give a helpful answer in English.
    """

    try:
        response = MODEL.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Support Chat Error:", e)
        return "Sorry, something went wrong."