# Workflow Builder Lite

A modular AI workflow engine that processes text through sequential LLM-powered steps. Built as a technical assessment for the Full Stack Developer (AI-Native Workflows) role.

**🚀 [Live Demo](https://workflow-builder-lite-ox66.onrender.com)**

---

## What It Does

Users can:

1. **Enter text** they want to process.
2. **Select 2–4 processing steps** in a specific order (e.g., Clean → Summarize → Extract Key Points).
3. **Run the workflow** — each step processes the text sequentially, with the output of one step feeding into the next.
4. **View per-step results** including the model used, token count, and processing time.
5. **Browse history** of the last 5 workflow runs.
6. **Check system health** — backend, database, and LLM connectivity status.

---

## Architecture

```
┌──────────────────────────────────────┐
│           Frontend (React)           │
│   WorkflowBuilder → HistoryPage     │
│   StatusPage      → ResultsView     │
└─────────────┬────────────────────────┘
              │ HTTP (REST API)
┌─────────────▼────────────────────────┐
│          Backend (Express.js)        │
│                                      │
│  routes/     → Endpoint definitions  │
│  controllers/→ Request/response      │
│  services/   → Business logic        │
│  workflows/  → Engine + step registry│
│  llm/        → Groq abstraction      │
│  models/     → Database access       │
│  utils/      → Validation & logging  │
└─────────────┬────────────────────────┘
              │
     ┌────────┴────────┐
     │                 │
  SQLite           Groq API
  (Storage)      (LLM Processing)
```

### Key Design Decisions

**Workflow Engine is framework-agnostic.** The engine module (`workflows/engine.js`) accepts input text and step IDs, executes them, and returns results. It has no knowledge of Express, HTTP, or any web framework. This means it can be reused from a CLI, test suite, or queue worker.

**Dynamic step registry.** Steps are registered by ID in a flat map. Adding a new step requires creating one file and adding one import — no if/else chains, no switch statements. Each step is a self-contained function with a `.meta` property for discoverability.

**LLM abstraction layer.** All communication with Groq flows through `llm/groqService.js`. No other module imports the Groq SDK directly. If the LLM provider changes, only this one file needs to be updated.

**Sequential pipeline pattern.** Steps execute in order, with each step's output becoming the next step's input. If a step fails, the pipeline stops and returns partial results — the user sees which steps succeeded and where it broke.

---

## Why Groq

- **Speed**: Groq's inference engine processes requests significantly faster than most alternatives, which matters in a multi-step pipeline where latency compounds.
- **Free tier**: Suitable for a demo/assessment without cost concerns.
- **Simple API**: Compatible with the OpenAI chat completions format, making it easy to swap providers later.
- **Model**: Uses `llama-3.1-8b-instant` by default — fast and capable enough for text processing tasks. Configurable via environment variable.

---

## How AI Is Used (Sensibly)

### In the Application
- Each workflow step uses a **structured system prompt** with explicit rules, constraints, and output format requirements.
- Prompts are **deterministic** — low temperature (0.3), clear role definitions, anti-hallucination instructions.
- The LLM is treated as a **text processor**, not an oracle. Each step has a focused, narrow task.
- **Every LLM call logs** the model used, tokens consumed, and response latency.
- **All failures are caught** and surfaced with clear messages — the app never silently swallows errors.

### During Development
- AI tools were used for code generation assistance, but every file was reviewed, understood, and adjusted.
- Architecture decisions (module structure, separation of concerns, error handling strategy) were made deliberately, not auto-generated.
- See `AI_NOTES.md` for details on what was AI-assisted vs. manually crafted.

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Groq API key ([get one free](https://console.groq.com))

### Setup

```bash
# Clone the repository
git clone https://github.com/sandeep2k01/workflow-builder-lite.git
cd workflow-builder-lite

# Backend
cd backend
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to the backend on port `3001`.

### Using Docker

```bash
docker-compose up --build
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflow/steps` | List available workflow steps |
| POST | `/api/workflow/run` | Execute a workflow |
| GET | `/api/workflow/history` | Get last 5 runs |
| GET | `/api/health` | System health check |

### Example: Run a Workflow

```json
POST /api/workflow/run
{
  "inputText": "Your text to process...",
  "selectedSteps": ["clean_text", "summarize", "extract_key_points"]
}
```

---

## What's Done

- [x] Workflow engine with sequential step execution
- [x] 4 processing steps: Clean Text, Summarize, Extract Key Points, Tag Category
- [x] Input validation (client + server)
- [x] LLM error handling (auth, rate limit, network, timeout)
- [x] Run history (last 5, auto-pruned)
- [x] Health check endpoint (backend + DB + LLM)
- [x] Clean, professional UI
- [x] Responsive design
- [x] Docker support

## What's Not Done (Potential Improvements)

- [ ] User authentication
- [ ] Custom step creation from the UI
- [ ] Drag-and-drop step reordering
- [ ] Webhook/scheduled workflow execution
- [ ] Multiple LLM provider support
- [ ] Comprehensive test suite

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite | Modern, fast dev experience |
| Backend | Node.js + Express | Required by job spec, well-suited for I/O-heavy workloads |
| Database | SQLite (sql.js) | Pure JS, zero native deps, Docker-friendly, sufficient for 5-run history |
| LLM | Groq (LLaMA 3.1 8B) | Fast inference, free tier, easy API |
| Styling | Vanilla CSS | Full control, no framework overhead |

---

Built by Sandeep Damera.
