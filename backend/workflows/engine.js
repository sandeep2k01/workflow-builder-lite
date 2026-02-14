/**
 * Workflow Engine — the core execution module.
 *
 * Responsibilities:
 *  - Accepts input text and an ordered list of step IDs.
 *  - Resolves each step from the registry.
 *  - Executes steps sequentially (output of step N → input of step N+1).
 *  - Captures per-step output, model info, and timing.
 *  - Returns a structured result object.
 *
 * This module is intentionally independent of Express (no req/res).
 * It can be called from an HTTP controller, a CLI, tests, or a queue worker.
 */

const { getStepHandler } = require('./stepRegistry');
const logger = require('../utils/logger');

/**
 * Runs a workflow pipeline.
 *
 * @param {string}   inputText     - The raw text to process.
 * @param {string[]} selectedSteps - Ordered array of step IDs to execute.
 * @returns {Promise<Object>} Structured execution result.
 */
async function executeWorkflow(inputText, selectedSteps) {
    const executedAt = new Date().toISOString();
    const stepResults = [];
    let currentInput = inputText.trim();

    logger.info('WorkflowEngine', `Starting workflow with ${selectedSteps.length} step(s)`);

    for (const stepId of selectedSteps) {
        const handler = getStepHandler(stepId);

        if (!handler) {
            // This should not happen if validation passed, but we guard anyway
            throw new Error(`Step handler not found for: "${stepId}"`);
        }

        logger.info('WorkflowEngine', `Executing step: ${handler.meta.name}`);

        try {
            const result = await handler(currentInput);

            stepResults.push({
                stepId: handler.meta.id,
                stepName: handler.meta.name,
                output: result.output,
                model: result.model,
                tokensUsed: result.tokensUsed,
                latencyMs: result.latencyMs,
                success: true,
            });

            // Pipeline: output becomes input for the next step
            currentInput = result.output;
        } catch (error) {
            logger.error('WorkflowEngine', `Step "${handler.meta.name}" failed: ${error.message}`);

            stepResults.push({
                stepId: handler.meta.id,
                stepName: handler.meta.name,
                output: null,
                error: error.message,
                success: false,
            });

            // Stop the pipeline on failure — partial results are still returned
            break;
        }
    }

    const workflowResult = {
        inputText,
        selectedSteps,
        results: stepResults,
        executedAt,
    };

    logger.info('WorkflowEngine', `Workflow complete. ${stepResults.filter((s) => s.success).length}/${selectedSteps.length} steps succeeded.`);

    return workflowResult;
}

module.exports = { executeWorkflow };
