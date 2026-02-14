/**
 * Step: Clean Text
 * Normalizes and cleans raw input text — removes noise, fixes formatting.
 * This is typically the first step in a processing pipeline.
 */

const { processPrompt } = require('../../llm/groqService');

const SYSTEM_PROMPT = `You are a deterministic text processor inside a structured workflow system.
Your task is to clean and normalize the given text.

Rules:
- Remove extra whitespace and blank lines.
- Fix obvious typos and punctuation errors.
- Normalize bullet points and list formatting.
- Do NOT change the meaning or add new content.
- Do NOT summarize — preserve all original information.
- Output only the cleaned text with no commentary.`;

async function cleanText(inputText) {
    const result = await processPrompt(
        SYSTEM_PROMPT,
        `Clean the following text:\n\n${inputText}`
    );
    return result;
}

cleanText.meta = {
    id: 'clean_text',
    name: 'Clean Text',
    description: 'Removes noise, fixes formatting, and normalizes raw text.',
};

module.exports = cleanText;
