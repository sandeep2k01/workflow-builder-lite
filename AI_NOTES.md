# AI Notes

## How AI Was Used in This Project

### During Development

I used AI coding assistants (Claude via Antigravity) to accelerate development. Here's a transparent breakdown:

**What AI helped with:**
- Initial file scaffolding and boilerplate (package.json, Vite config, Express setup)
- CSS design system generation (custom properties, component styles)
- Code suggestions for repetitive patterns (CRUD operations, React hooks)

**What I designed and decided myself:**
- **Architecture** — The modular folder structure (routes → controllers → services → workflows → llm) was a deliberate design choice. I chose this separation because the workflow engine must be independent from the HTTP layer.
- **Workflow engine pattern** — The dynamic step registry and sequential pipeline pattern were intentional engineering decisions to avoid if/else chains and make the system extensible.
- **Prompt design** — Every LLM prompt was crafted with specific rules: deterministic output, anti-hallucination instructions, clear output format constraints. This wasn't auto-generated; it reflects understanding of prompt engineering principles.
- **Error handling strategy** — Specific error codes from Groq (401, 429, 5xx) are mapped to user-friendly messages. The pipeline stops on failure and returns partial results. These decisions required understanding both the API behavior and the user experience.
- **Database pruning** — The auto-prune to 5 entries happens at the model layer, not the controller, because it's a data integrity concern, not a request-handling concern.

**What I reviewed and verified:**
- Every file was read and understood before finalizing
- Error handling paths were mentally traced
- API response structures were verified against Groq documentation
- Frontend state management was tested for edge cases (empty input, disabled states, loading)

### In the Application

The app uses **Groq API** with the **LLaMA 3.1 8B Instant** model for text processing.

**Why this model:**
- Fast inference (~200-500ms per call) — important when chaining 2-4 steps
- Sufficient capability for text cleaning, summarization, extraction, and tagging
- Free tier available for demo purposes
- Configurable via environment variable if a different model is needed

**Prompt engineering approach:**
- Each step has a dedicated system prompt with explicit rules
- Low temperature (0.3) ensures deterministic, consistent output
- Anti-hallucination instructions in every prompt ("Do NOT add information not present in the source")
- Output format is specified ("Output only the bullet list with no introduction or conclusion")

This is not blind copy-paste. The AI in this app is treated as a controlled, deterministic text processor with clear boundaries.
