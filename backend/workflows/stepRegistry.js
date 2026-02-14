/**
 * Step Registry — dynamic mapping of step IDs to handler functions.
 *
 * Design pattern:
 *  - Each step module self-registers via its .meta property.
 *  - No large if/else chains; adding a new step means adding one import.
 *  - The registry is the single source of truth for available steps.
 */

const cleanText = require('./steps/cleanText');
const summarize = require('./steps/summarize');
const extractKeyPoints = require('./steps/extractKeyPoints');
const tagCategory = require('./steps/tagCategory');

// Dynamic registry: step_id → handler function
const stepRegistry = {
    [cleanText.meta.id]: cleanText,
    [summarize.meta.id]: summarize,
    [extractKeyPoints.meta.id]: extractKeyPoints,
    [tagCategory.meta.id]: tagCategory,
};

/**
 * Returns metadata for all available steps (used by frontend and validation).
 */
function getAvailableSteps() {
    return Object.values(stepRegistry).map((handler) => handler.meta);
}

/**
 * Retrieves a step handler by ID. Returns undefined if not found.
 */
function getStepHandler(stepId) {
    return stepRegistry[stepId];
}

module.exports = { getAvailableSteps, getStepHandler };
