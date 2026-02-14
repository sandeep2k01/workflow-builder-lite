/**
 * Workflow Controller — handles HTTP request/response for workflow operations.
 * Contains no business logic; delegates to services.
 */

const { runWorkflow } = require('../services/workflowService');
const { getRecentRuns } = require('../services/historyService');
const { getAvailableSteps } = require('../workflows/stepRegistry');
const { validateWorkflowInput } = require('../utils/validation');

/**
 * POST /api/workflow/run
 * Executes a workflow with the provided input text and selected steps.
 */
async function executeWorkflowHandler(req, res) {
    const validation = validateWorkflowInput(req.body);

    if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
    }

    try {
        const { inputText, selectedSteps } = req.body;
        const result = await runWorkflow(inputText, selectedSteps);
        return res.json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Workflow execution failed. Please try again.',
            detail: error.message,
        });
    }
}

/**
 * GET /api/workflow/history
 * Returns the last 5 workflow runs.
 */
function getHistoryHandler(req, res) {
    try {
        const runs = getRecentRuns();
        return res.json({ success: true, data: runs });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to retrieve history.' });
    }
}

/**
 * GET /api/workflow/steps
 * Returns metadata for all available workflow steps.
 */
function getStepsHandler(req, res) {
    const steps = getAvailableSteps();
    return res.json({ success: true, data: steps });
}

module.exports = { executeWorkflowHandler, getHistoryHandler, getStepsHandler };
