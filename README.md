# Abdulla Zohaib Portfolio — Gemini AI Assistant

A production-ready local portfolio setup with a FastAPI Gemini backend and a Vite/React frontend.

## Structure

- `frontend/` — React + Vite portfolio
- `backend/` — FastAPI AI assistant

## Setup

### Backend

1. Open PowerShell in `backend/`.
2. Create `.env` from `.env.example`.
3. Add your own Gemini API key to `.env`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.6-flash
```

4. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

5. Start FastAPI:

```powershell
python -m uvicorn app:app --reload --port 8000
```

Health check:

`http://127.0.0.1:8000/health`

### Frontend

Open a second PowerShell in `frontend/`:

```powershell
npm install
npm run dev
```

Open:

`http://localhost:5173/`

## AI Assistant

The frontend calls `/api/chat` through the Vite development proxy.
The backend returns:

```json
{
  "response": "...",
  "interaction_id": "..."
}
```

The frontend reads `response`, preserves the `interaction_id`, and sends it with the next message so the assistant can continue a conversation.

The frontend also handles non-JSON backend responses without crashing on `response.json()`.

## Security

- `.env` is ignored by Git.
- Never commit or paste a real API key into source code or GitHub.
- Use a regenerated key if an old key was exposed.
