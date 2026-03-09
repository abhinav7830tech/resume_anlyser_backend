import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=API_KEY)

MODEL = genai.GenerativeModel("gemini-2.0-flash")


def clean_json(text):
    text = text.strip()

    if "```" in text:
        text = text.split("```")[1]
        text = text.replace("json", "")

    return text.strip()


def extract_skills_and_feedback(resume_text):

    prompt = f"""
You are an expert ATS resume evaluator.

Analyze the resume and return ONLY valid JSON.

Job analysis should include ATS score, strengths, weaknesses and improvements.

Resume:
{resume_text[:4000]}

Return JSON in this exact format:

{{
"personal_info": {{
"name": "candidate name or Unknown",
"email": "email or Not found",
"phone": "phone or Not found"
}},
"skills": {{
"technical": [],
"soft": [],
"tools": []
}},
"experience_years": "",
"education": "",
"ats_score": 0,
"ats_score_reason": "",
"strengths": [],
"weaknesses": [],
"improvements": [],
"overall_rating": 0,
"summary": ""
}}
"""

    try:
        response = MODEL.generate_content(prompt)

        raw = clean_json(response.text)

        data = json.loads(raw)

        if "ats_score" not in data:
            data["ats_score"] = 6

        return data

    except Exception as e:
        print("AI Error:", e)

        return {
            "personal_info": {
                "name": "Unknown",
                "email": "Not found",
                "phone": "Not found"
            },
            "skills": {
                "technical": [],
                "soft": [],
                "tools": []
            },
            "experience_years": "Unknown",
            "education": "Unknown",
            "ats_score": 5,
            "ats_score_reason": "AI parsing fallback",
            "strengths": [],
            "weaknesses": [],
            "improvements": [],
            "overall_rating": 5,
            "summary": "Analysis could not be generated."
        }


def generate_interview_questions(resume_text, job_role):

    prompt = f"""
You are a senior technical interviewer.

Generate interview questions for the role of {job_role}.

Resume:
{resume_text[:3000]}

Return ONLY JSON:

{{
"technical":[{{"question":"", "hint":""}}],
"behavioral":[{{"question":"", "hint":""}}],
"situational":[{{"question":"", "hint":""}}],
"hr":[{{"question":"", "hint":""}}]
}}
"""

    try:
        response = MODEL.generate_content(prompt)

        raw = clean_json(response.text)

        return json.loads(raw)

    except Exception as e:
        print("AI Error:", e)

        return {
            "technical": [],
            "behavioral": [],
            "situational": [],
            "hr": []
        }


def chat_with_interviewer(resume_text, job_role, conversation_history, user_message, category="technical"):

    system_prompt = f"""
You are a professional interviewer.

Role: {job_role}

Resume:
{resume_text[:2000]}

Interview category: {category}

Ask one question at a time.
Keep responses short.
"""

    try:

        if not conversation_history:

            prompt = system_prompt + "\nStart the interview with greeting and first question."

        else:

            prompt = f"""
{system_prompt}

Conversation history:
{conversation_history}

Candidate answer:
{user_message}

Continue the interview.
"""

        response = MODEL.generate_content(prompt)

        return response.text.strip()

    except Exception as e:
        print("Chat Error:", e)

        return "Interview error occurred."


def chat_support(user_message):

    prompt = f"""
You are a support assistant for an AI Resume Interview platform.

User question:
{user_message}

Provide a helpful answer.
"""

    try:
        response = MODEL.generate_content(prompt)

        return response.text.strip()

    except Exception as e:
        print("Support Chat Error:", e)

        return "Support service unavailable."