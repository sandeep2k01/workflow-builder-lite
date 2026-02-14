/**
 * History Service — retrieves past workflow runs.
 */

const WorkflowRun = require('../models/WorkflowRun');

/**
 * Returns the most recent workflow runs (max 5).
 */
function getRecentRuns() {
    return WorkflowRun.getRecent();
}

module.exports = { getRecentRuns };
