/**
 * Step: Tag Category
 * Assigns one or more topic categories to the input text.
 */

const { processPrompt } = require('../../llm/groqService');

const SYSTEM_PROMPT = `You are a deterministic text processor inside a structured workflow system.
Your task is to categorize the given text by assigning relevant topic tags.

Rules:
- Assign between 1 and 5 tags that describe the topic of the text.
- Use simple, lowercase, single-word or hyphenated tags (e.g., "technology", "finance", "team-management").
- Output ONLY a comma-separated list of tags.
- Do NOT add descriptions, explanations, or commentary.
- If the text is unclear, assign the tag "general".`;

async function tagCategory(inputText) {
    const result = await processPrompt(
        SYSTEM_PROMPT,
        `Assign topic category tags to the following text:\n\n${inputText}`
    );
    return result;
}

tagCategory.meta = {
    id: 'tag_category',
    name: 'Tag Category',
    description: 'Assigns relevant topic category tags to the text.',
};

module.exports = tagCategory;
