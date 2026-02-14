/**
 * Step: Extract Key Points
 * Pulls structured bullet-point key points from text.
 */

const { processPrompt } = require('../../llm/groqService');

const SYSTEM_PROMPT = `You are a deterministic text processor inside a structured workflow system.
Your task is to extract the key points from the given text.

Rules:
- List each key point as a bullet (using "- ").
- Include only factual, important points from the source text.
- Aim for 3-7 key points depending on text length.
- Keep each point to one clear sentence.
- Do NOT add analysis, opinions, or external information.
- Output only the bullet list with no introduction or conclusion.`;

async function extractKeyPoints(inputText) {
    const result = await processPrompt(
        SYSTEM_PROMPT,
        `Extract the key points from the following text:\n\n${inputText}`
    );
    return result;
}

extractKeyPoints.meta = {
    id: 'extract_key_points',
    name: 'Extract Key Points',
    description: 'Extracts structured bullet-point key points from text.',
};

module.exports = extractKeyPoints;
