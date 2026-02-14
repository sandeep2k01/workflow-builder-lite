/**
 * Workflow routes — endpoint definitions only.
 * No logic here; all handling is in the controller.
 */

const express = require('express');
const router = express.Router();
const {
    executeWorkflowHandler,
    getHistoryHandler,
    getStepsHandler,
} = require('../controllers/workflowController');

router.post('/run', executeWorkflowHandler);
router.get('/history', getHistoryHandler);
router.get('/steps', getStepsHandler);

module.exports = router;
