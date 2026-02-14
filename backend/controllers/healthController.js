/**
 * Health Controller — checks system component connectivity.
 * Verifies backend, database, and LLM are operational.
 */

const { isHealthy: isDatabaseHealthy } = require('../models/database');
const { checkHealth: isLlmHealthy } = require('../llm/groqService');

/**
 * GET /api/health
 * Returns status of each system component.
 */
async function healthCheckHandler(req, res) {
    const dbStatus = isDatabaseHealthy();

    // LLM check is async (makes a lightweight API call)
    let llmStatus = false;
    try {
        llmStatus = await isLlmHealthy();
    } catch {
        llmStatus = false;
    }

    const allHealthy = dbStatus && llmStatus;

    const health = {
        backend: 'ok',            // If this code runs, Express is operational
        database: dbStatus ? 'ok' : 'error',
        llm: llmStatus ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
    };

    return res.status(allHealthy ? 200 : 503).json(health);
}

module.exports = { healthCheckHandler };
