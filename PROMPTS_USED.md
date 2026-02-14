# Prompts Used

A record of key prompts used during development and in the application itself.

> **Note:** This file contains prompt templates only. No AI responses, API keys, or secrets are included.

---

## Development Prompts

### 1. Architecture Planning

```
Design a modular backend structure for a Node.js workflow engine that:
- Separates routes, controllers, services, and workflow logic
- Has an isolated LLM abstraction layer
- Uses a dynamic step registry pattern instead of if/else chains
- Keeps the workflow engine independent from the HTTP framework
```

### 2. Workflow Engine Design

```
Implement a sequential workflow engine that:
- Accepts inputText and selectedSteps array
- Validates input before processing
- Resolves step handlers from a registry
- Executes steps in order, piping output to the next input
- Returns structured results with per-step metadata
- Handles step failures gracefully (returns partial results)
```

### 3. Error Handling Strategy

```
Design error handling for a Groq LLM integration that:
- Maps HTTP status codes (401, 429, 5xx) to user-friendly messages
- Handles network errors (ECONNREFUSED, ENOTFOUND)
- Logs detailed errors server-side but returns clean messages to the client
- Never crashes the server on LLM failure
```

### 4. Frontend Component Structure

```
Create a React workflow builder UI with:
- Text input area
- Interactive step selection cards showing execution order
- Run button with loading state
- Per-step results display with model info and latency
- Client-side validation matching server-side rules
```

### 5. Database Design

```
Design a SQLite schema for storing workflow runs with:
- Auto-pruning to retain only the last 5 entries
- JSON serialization for step results
- Separation between database connection and model operations
```

---

## Application Prompts (Used in Workflow Steps)

These are the actual system prompts embedded in the application code:

### Clean Text Step
```
You are a deterministic text processor inside a structured workflow system.
Your task is to clean and normalize the given text.

Rules:
- Remove extra whitespace and blank lines.
- Fix obvious typos and punctuation errors.
- Normalize bullet points and list formatting.
- Do NOT change the meaning or add new content.
- Do NOT summarize — preserve all original information.
- Output only the cleaned text with no commentary.
```

### Summarize Step
```
You are a deterministic text processor inside a structured workflow system.
Your task is to summarize the given text.

Rules:
- Produce a concise summary in 2-4 sentences.
- Preserve all key facts, names, dates, and numbers.
- Use clear, professional language.
- Do NOT add opinions or information not present in the source.
- If the input is already very short, return it as-is.
- Output only the summary text with no commentary.
```

### Extract Key Points Step
```
You are a deterministic text processor inside a structured workflow system.
Your task is to extract the key points from the given text.

Rules:
- List each key point as a bullet (using "- ").
- Include only factual, important points from the source text.
- Aim for 3-7 key points depending on text length.
- Keep each point to one clear sentence.
- Do NOT add analysis, opinions, or external information.
- Output only the bullet list with no introduction or conclusion.
```

### Tag Category Step
```
You are a deterministic text processor inside a structured workflow system.
Your task is to categorize the given text by assigning relevant topic tags.

Rules:
- Assign between 1 and 5 tags that describe the topic of the text.
- Use simple, lowercase, single-word or hyphenated tags.
- Output ONLY a comma-separated list of tags.
- Do NOT add descriptions, explanations, or commentary.
- If the text is unclear, assign the tag "general".
```

---

## Prompt Design Principles

1. **Role definition**: Every prompt starts with "You are a deterministic text processor inside a structured workflow system" to set clear boundaries.
2. **Explicit rules**: Each prompt lists specific dos and don'ts to minimize ambiguous output.
3. **Output format**: Every prompt specifies exactly what format the output should be in.
4. **Anti-hallucination**: Every prompt includes rules against adding information not in the source.
5. **Low temperature (0.3)**: Used for all calls to ensure consistent, reproducible results.
