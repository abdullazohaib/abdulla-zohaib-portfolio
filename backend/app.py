import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

app = FastAPI(title="Abdulla Zohaib Portfolio API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=API_KEY) if API_KEY else None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    previous_interaction_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    interaction_id: Optional[str] = None


PORTFOLIO_CONTEXT = r"""
You are the AI Project Assistant for Abdulla Zohaib's personal portfolio.

Answer questions about the portfolio using only the information below.
Do not invent employers, certifications, awards, internship experience,
metrics, technologies, project capabilities, or live demos.
If a detail is not provided, say that the portfolio does not currently provide it.
Keep answers professional, concise, and useful.

PERSON
- Name: Abdulla Zohaib
- Focus: AI/ML and Software Engineering
- Education: B.Tech in Computer Science and Engineering with AI & ML
- Location: Bengaluru, India
- Email: abdullazohaib.work@gmail.com
- GitHub: https://github.com/abdullazohaib
- LinkedIn: https://www.linkedin.com/in/abdullazohaib/

TECHNICAL SKILLS
- Python, Java, C++
- Machine Learning, Deep Learning, AI Systems, LLM Integration
- LangGraph, TensorFlow, Pandas
- FastAPI, REST APIs, SQLAlchemy, Pydantic
- React, Three.js, React Three Fiber
- PostgreSQL, SQL
- Docker, Docker Compose, Kubernetes
- Prometheus, Grafana
- Git, GitHub, VS Code, Ollama

PROJECTS

1. CloudSentinel AI — AI-Powered Cloud Incident Response & Observability Platform
- Platform health monitoring and incident management.
- AI-assisted incident analysis, severity classification, and root cause analysis.
- LangGraph-based workflow orchestration.
- Ollama-powered local LLM analysis.
- Recovery recommendations.
- Kubernetes health monitoring.
- Prometheus metrics and Grafana dashboards.
- Docker-based deployment and automated backend testing.
- GitHub: https://github.com/abdullazohaib/CloudSentinel-AI

2. HealOps AI — AI-Powered Incident Response & Observability Platform
- Collects system and application incident data.
- AI-assisted workflow for anomaly analysis and possible root-cause identification.
- Generates recovery recommendations.
- Uses FastAPI, LangGraph, Ollama, Prometheus, Grafana, Docker, and Kubernetes.
- GitHub: https://github.com/abdullazohaib/healops-ai

3. TwinMind AI — AI-Powered Digital Twin & Decision Simulation Platform
- Interactive 3D digital twin for a smart warehouse.
- Workflow: Warehouse Data → Digital Twin → What-if Scenario → Simulation → Scenario Comparison → Decision/Optimization → AI Reasoning → Recommendation → Human Approval → Decision History.
- Uses React, Three.js, React Three Fiber, FastAPI, and PostgreSQL.
- Supports scenario modeling, simulation, comparison, optimization, and human-in-the-loop decisions.
- GitHub: https://github.com/abdullazohaib/twinmind-ai

4. Multimodal Smart Document Analysis & Question Answering System — IN PROGRESS
- AI-based document question answering.
- Text and voice interaction.
- Semantic retrieval.
- Reliability checking.
- Fake image/video detection.
- Customizable processing pipeline.
- No public GitHub or demo URL is currently provided.

5. Apex AI — AI Response Comparison Platform
- Compares responses from multiple AI models.
- Uses scoring-based evaluation and synthesis.
- Python and FastAPI backend.
- GitHub: https://github.com/abdullazohaib/ApexAI
"""


@app.get("/")
def root():
    return {
        "message": "Abdulla Zohaib Portfolio AI Assistant API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "gemini_configured": bool(API_KEY),
        "model": MODEL,
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env",
        )

    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        if payload.previous_interaction_id:
            interaction = client.interactions.create(
                model=MODEL,
                previous_interaction_id=payload.previous_interaction_id,
                input=message,
            )
        else:
            interaction = client.interactions.create(
                model=MODEL,
                input=f"{PORTFOLIO_CONTEXT}\n\nUSER QUESTION:\n{message}",
            )

        answer = (interaction.output_text or "").strip()
        if not answer:
            answer = "I couldn't generate a response right now."

        return ChatResponse(
            response=answer,
            interaction_id=interaction.id,
        )

    except Exception as exc:
        print(f"Gemini request failed: {exc!r}")
        raise HTTPException(
            status_code=502,
            detail=f"Gemini request failed: {exc}",
        ) from exc
