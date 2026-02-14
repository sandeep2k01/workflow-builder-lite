/**
 * Groq LLM service — the sole interface between the application and the LLM.
 * 
 * Design decisions:
 *  - Isolated from business logic; only knows how to send a prompt and return text.
 *  - All workflow steps call this service rather than the Groq SDK directly.
 *  - Handles API errors, timeouts, and unexpected responses in one place.
 *  - Makes it trivial to swap Groq for another provider later.
 */

const Groq = require('groq-sdk');
const config = require('../config');
const logger = require('../utils/logger');

let client;

function getClient() {
    if (client) return client;
    client = new Groq({ apiKey: config.groq.apiKey });
    return client;
}

/**
 * Sends a structured prompt to the Groq model and returns clean text output.
 *
 * @param {string} systemPrompt - Role and rules for the model.
 * @param {string} userPrompt   - The actual task/input text.
 * @returns {{ output: string, model: string, tokensUsed: number, latencyMs: number }}
 */
async function processPrompt(systemPrompt, userPrompt) {
    const startTime = Date.now();
    const model = config.groq.model;

    try {
        const response = await getClient().chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.3, // Low temperature for deterministic, consistent output
            max_tokens: 1024,
        });

        const output = response.choices?.[0]?.message?.content?.trim();

        if (!output) {
            throw new Error('LLM returned an empty response.');
        }

        const latencyMs = Date.now() - startTime;
        const tokensUsed = response.usage?.total_tokens ?? 0;

        logger.info('GroqService', `Model: ${model} | Tokens: ${tokensUsed} | Latency: ${latencyMs}ms`);

        return { output, model, tokensUsed, latencyMs };
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        logger.error('GroqService', `LLM call failed after ${latencyMs}ms: ${error.message}`, error);

        // Map to clear, actionable error messages
        if (error.status === 401) {
            throw new Error('Groq API key is invalid or expired. Check your GROQ_API_KEY.');
        }
        if (error.status === 429) {
            throw new Error('Groq rate limit exceeded. Please wait a moment and try again.');
        }
        if (error.status >= 500) {
            throw new Error('Groq service is temporarily unavailable. Try again shortly.');
        }
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            throw new Error('Cannot reach Groq API. Check your internet connection.');
        }

        throw new Error(`LLM processing failed: ${error.message}`);
    }
}

/**
 * Lightweight connectivity check for the health endpoint.
 * Sends a minimal prompt to verify the API key and model are valid.
 */
async function checkHealth() {
    try {
        const response = await getClient().chat.completions.create({
            model: config.groq.model,
            messages: [{ role: 'user', content: 'Respond with OK.' }],
            max_tokens: 5,
        });
        return response.choices?.[0]?.message?.content ? true : false;
    } catch {
        return false;
    }
}

module.exports = { processPrompt, checkHealth };
