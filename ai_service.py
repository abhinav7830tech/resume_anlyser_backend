from google import genai
from google.genai import types
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found in environment variables. Please add it to .env file."
    )

client = genai.Client(api_key=api_key)
MODEL = "gemini-2.5-flash"  # Free model


def extract_skills_and_feedback(resume_text):
    """
    Resume se skills nikalo aur feedback do — ek hi API call mein response in English
    """

    prompt = f"""
    Neeche ek resume hai. Uska analysis karo aur SIRF valid JSON return karo.
    
    Resume Text:
    {resume_text[:4000]}
    
    Ye JSON structure return karo (kuch aur mat likho, sirf JSON):
    {{
        "personal_info": {{
            "name": "candidate ka naam ya Unknown",
            "email": "email ya Not found",
            "phone": "phone ya Not found"
        }},
        "skills": {{
            "technical": ["skill1", "skill2"],
            "soft": ["skill1", "skill2"],
            "tools": ["tool1", "tool2"]
        }},
        "experience_years": "e.g. 2 years ya Fresher",
        "education": "highest degree",
        "ats_score": 7,
        "ats_score_reason": "kyun ye score diya",
        "strengths": ["strength1", "strength2", "strength3"],
        "weaknesses": ["weakness1", "weakness2"],
        "improvements": ["suggestion1", "suggestion2", "suggestion3"],
        "overall_rating": 7,
        "summary": "2-3 line ka honest resume summary"
    }}
    """

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        raw = response.text
        if not raw:
            return {"error": "Empty response from AI"}

        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw.strip())

    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        return {"error": "Failed to parse AI response"}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"error": "Analysis fail ho gayi, dobara try karo"}


def generate_interview_questions(resume_text, job_role):
    """
    Resume aur job role ke basis pe interview questions banao
    Give the response in English do not response in the Hindi
    """

    prompt = f"""
    Ek {job_role} position ke liye interview questions banao.
    
    Candidate ka resume:
    {resume_text[:3000]}
    
    SIRF JSON return karo:
    {{
        "technical": [
            {{"question": "Q1", "hint": "iska answer mein kya expected hai"}},
            {{"question": "Q2", "hint": "hint"}},
            {{"question": "Q3", "hint": "hint"}}
        ],
        "behavioral": [
            {{"question": "Q1", "hint": "hint"}},
            {{"question": "Q2", "hint": "hint"}}
        ],
        "situational": [
            {{"question": "Q1", "hint": "hint"}},
            {{"question": "Q2", "hint": "hint"}}
        ],
        "hr": [
            {{"question": "Q1", "hint": "hint"}},
            {{"question": "Q2", "hint": "hint"}}
        ]
    }}
    """

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        raw = response.text
        if not raw:
            return {"error": "Empty response from AI"}

        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw.strip())

    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        return {"error": "Questions generate nahi hue"}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": "Questions generate nahi hue"}


def chat_with_interviewer(
    resume_text, job_role, conversation_history, user_message, category="technical"
):
    """
    PART 2 — Live AI Interview
    Ye function real-time interview conduct karta hai

    conversation_history: list of {"role": "user/model", "parts": ["message"]}
    """

    category_prompts = {
        "technical": "Ask questions about technical skills, programming languages, frameworks, projects, and problem-solving abilities.",
        "behavioral": "Ask questions about past experiences, teamwork, leadership, conflict resolution, and soft skills.",
        "situational": "Ask hypothetical scenario-based questions about how the candidate would handle specific situations.",
        "hr": "Ask questions about salary expectations, career goals, strengths, weaknesses, and cultural fit.",
    }

    category_prompt = category_prompts.get(category, category_prompts["technical"])

    # System context — AI ko interviewer banao
    system_context = f"""Tu ek professional interviewer hai jo {job_role} position ke liye interview le raha hai.

Candidate ka resume:
{resume_text[:2000]}

Interview Category: {category.upper()}
{category_prompt}

Rules:
1. Ek baar mein sirf EK question poochh
2. Candidate ke jawab pe react karo (achha jawab = appreciate, incomplete = gently probe karo)
3. Professional but friendly tone rakho
4. 8-10 questions ke baad interview wrap up karo
5. End mein honest performance feedback do
6. Hinglish mein mat bolo — proper English mein interview lo"""

    # Pehla message hai to interviewer start kare
    if not conversation_history:
        first_prompt = f"""{system_context}

Interview shuru karo. Pehle candidate ko welcome karo,
apna introduction do (interviewer ke roop mein),
aur pehla warm-up question poochho."""

        response = client.models.generate_content(
            model=MODEL,
            contents=first_prompt,
        )
        return response.text

    # Ongoing conversation — build complete conversation with system context
    all_messages = [
        types.Content(role="user", parts=[types.Part(text=system_context)]),
    ]
    all_messages.extend(
        [
            types.Content(role=msg["role"], parts=[types.Part(text=msg["parts"][0])])
            for msg in conversation_history
        ]
    )

    # Add user message
    user_content = f"""Candidate ne abhi ye kaha: "{user_message}"

Iska jawab do aur interview continue karo."""

    response = client.models.generate_content(
        model=MODEL,
        contents=all_messages + [user_content],
    )
    return response.text


def chat_support(user_message):
    """
    General support chat - Answer user queries about the app
    """
    system_context = """Tu ek helpful customer support assistant hai jo Resume & Interview App ke baare mein information deta hai.

Saaf English mein jawab do.
Agar question app ke features ke baare mein hai to explain karo.
General career advice bhi de sakta hai.
Mukhta: concise aur helpful answers do."""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=f"{system_context}\n\nUser query: {user_message}",
        )
        return response.text
    except Exception as e:
        print(f"Chat Error: {e}")
        return "Sorry, I'm having trouble connecting. Please try again."
