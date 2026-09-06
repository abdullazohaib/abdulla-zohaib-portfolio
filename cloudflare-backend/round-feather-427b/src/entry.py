import json

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from workers import asgi, env


MODEL = "gemini-3.6-flash"


PORTFOLIO_CONTEXT = """
You are the AI Project Assistant for Abdulla Zohaib's personal portfolio.

Answer questions about Abdulla Zohaib, his projects, skills,
education, technical interests, and engineering approach.

Use only the information below. Do not invent jobs, companies,
awards, metrics, achievements, or technologies.

NAME
Abdulla Zohaib

FOCUS
AI/ML and Software Engineering

EDUCATION
B.Tech in Computer Science and Engineering with AI & ML

LOCATION
Bengaluru, India

SKILLS
Python, Java, C++, Machine Learning, Deep Learning, AI Systems,
LLM Integration, LangGraph, TensorFlow, Pandas, FastAPI, REST APIs,
SQLAlchemy, Pydantic, React, Three.js, React Three Fiber,
PostgreSQL, SQL, Docker, Docker Compose, Kubernetes,
Prometheus, Grafana, Git, GitHub, VS Code, Ollama.

PROJECTS

CloudSentinel AI
AI-powered cloud incident response and observability platform.
Capabilities include platform health monitoring, incident management,
AI-assisted incident analysis, severity classification, root-cause
analysis, LangGraph workflow orchestration, Ollama-powered local LLM
analysis, recovery recommendations, Kubernetes monitoring,
Prometheus metrics, Grafana dashboards, Docker deployment,
and automated backend testing.

HealOps AI
AI-powered incident response and observability platform that collects
incident data, analyzes anomalies and possible root causes, and
generates recovery recommendations.

TwinMind AI
AI-powered digital twin and decision simulation platform for smart
warehouse environments.

Workflow:
Warehouse Data -> Digital Twin -> What-if Scenario -> Simulation
-> Scenario Comparison -> Decision/Optimization
-> AI Reasoning -> Recommendation -> Human Approval
-> Decision History

Multimodal Smart Document Analysis and Question Answering System
Currently in progress.
Focus areas include document question answering, text and voice
interaction, semantic retrieval, reliability checking, multimodal
analysis, fake image/video detection, and a customizable pipeline.

Apex AI
AI response comparison platform that compares responses from
multiple AI systems using scoring and synthesis.

RESPONSE STYLE

Be professional, concise, and natural.
Prefer short paragraphs or small lists.
When discussing a project, explain its purpose and important technical
capabilities.
For contact questions, direct the user to the Contact section.
"""


app = FastAPI(
    title="Abdulla Zohaib Portfolio AI Assistant",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    previous_interaction_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    interaction_id: str | None = None


def get_gemini_api_key():
    return getattr(env, "GEMINI_API_KEY", None)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "Abdulla Zohaib Portfolio AI Assistant",
        "model": MODEL,
    }


@app.get("/health")
async def health():
    api_key = get_gemini_api_key()

    return {
        "status": "ok",
        "gemini_configured": bool(api_key),
        "model": MODEL,
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):

    # ---------------------------------------------------------
    # Get the Cloudflare Worker secret
    # ---------------------------------------------------------
    api_key = get_gemini_api_key()

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured in this Worker.",
        )

    # ---------------------------------------------------------
    # Validate message
    # ---------------------------------------------------------
    message = body.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    # ---------------------------------------------------------
    # Gemini endpoint
    # ---------------------------------------------------------
    url = (
        "https://generativelanguage.googleapis.com/"
        f"v1beta/models/{MODEL}:generateContent"
    )

    # ---------------------------------------------------------
    # Gemini payload
    # ---------------------------------------------------------
    payload = {
        "system_instruction": {
            "parts": [
                {
                    "text": PORTFOLIO_CONTEXT,
                }
            ]
        },
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": message,
                    }
                ],
            }
        ],
        "generationConfig": {
            "maxOutputTokens": 600,
        },
    }

    # ---------------------------------------------------------
    # Call Gemini
    # ---------------------------------------------------------
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                url,
                headers={
                    "x-goog-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json=payload,
            )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini request failed before receiving a response: "
                f"{type(exc).__name__}: {exc}"
            ),
        )

    # ---------------------------------------------------------
    # Gemini HTTP errors
    # ---------------------------------------------------------
    if response.status_code >= 400:

        try:
            error_data = response.json()
        except Exception:
            error_data = None

        if isinstance(error_data, dict):
            gemini_error = error_data.get("error", {})

            error_message = gemini_error.get(
                "message",
                "Gemini returned an error.",
            )

            error_status = gemini_error.get(
                "status",
                "UNKNOWN",
            )

            error_code = gemini_error.get(
                "code",
                response.status_code,
            )

            raise HTTPException(
                status_code=response.status_code,
                detail=(
                    f"Gemini HTTP {error_code} "
                    f"({error_status}): {error_message}"
                ),
            )

        raise HTTPException(
            status_code=response.status_code,
            detail=(
                f"Gemini HTTP {response.status_code}: "
                f"{response.text[:1500]}"
            ),
        )

    # ---------------------------------------------------------
    # Parse Gemini response
    # ---------------------------------------------------------
    try:
        data = response.json()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Gemini returned invalid JSON: "
                f"{type(exc).__name__}: {exc}"
            ),
        )

    # ---------------------------------------------------------
    # Candidates
    # ---------------------------------------------------------
    candidates = data.get("candidates", [])

    if not candidates:
        raise HTTPException(
            status_code=502,
            detail=(
                "Gemini returned no candidates. "
                f"Response: {json.dumps(data)[:2000]}"
            ),
        )

    candidate = candidates[0]

    # ---------------------------------------------------------
    # Extract text
    # ---------------------------------------------------------
    content = candidate.get("content", {})
    parts = content.get("parts", [])

    answer_parts = []

    for part in parts:
        if isinstance(part, dict):
            text = part.get("text")

            if text:
                answer_parts.append(text)

    answer = "\n".join(answer_parts).strip()

    # ---------------------------------------------------------
    # Empty response
    # ---------------------------------------------------------
    if not answer:
        finish_reason = candidate.get(
            "finishReason",
            "UNKNOWN",
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Gemini returned no text. "
                f"finishReason={finish_reason}. "
                f"Response: {json.dumps(data)[:2000]}"
            ),
        )

    # ---------------------------------------------------------
    # Success
    # ---------------------------------------------------------
    return ChatResponse(
        response=answer,
        interaction_id=None,
    )


# Cloudflare Workers ASGI entrypoint
Default = asgi.entrypoint(app)