/**
 * Workflow Service — orchestrates workflow execution and persistence.
 * Bridges the workflow engine with the data layer.
 */

const { executeWorkflow } = require('../workflows/engine');
const WorkflowRun = require('../models/WorkflowRun');
const logger = require('../utils/logger');

/**
 * Runs a workflow and saves the result to the database.
 */
async function runWorkflow(inputText, selectedSteps) {
    const result = await executeWorkflow(inputText, selectedSteps);

    // Persist to database (auto-prunes to last 5)
    try {
        WorkflowRun.save(result);
    } catch (error) {
        logger.error('WorkflowService', 'Failed to save workflow run to database', error);
        // Don't throw — the workflow itself succeeded; saving is secondary
    }

    return result;
}

module.exports = { runWorkflow };
