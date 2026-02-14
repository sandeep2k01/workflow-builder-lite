/**
 * Step: Summarize
 * Produces a concise summary preserving key facts.
 */

const { processPrompt } = require('../../llm/groqService');

const SYSTEM_PROMPT = `You are a deterministic text processor inside a structured workflow system.
Your task is to summarize the given text.

Rules:
- Produce a concise summary in 2-4 sentences.
- Preserve all key facts, names, dates, and numbers.
- Use clear, professional language.
- Do NOT add opinions or information not present in the source.
- If the input is already very short, return it as-is.
- Output only the summary text with no commentary.`;

async function summarize(inputText) {
    const result = await processPrompt(
        SYSTEM_PROMPT,
        `Summarize the following text:\n\n${inputText}`
    );
    return result;
}

summarize.meta = {
    id: 'summarize',
    name: 'Summarize',
    description: 'Condenses text into a concise 2-4 sentence summary.',
};

module.exports = summarize;
