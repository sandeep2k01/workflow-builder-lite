/**
 * Health routes — endpoint definitions only.
 */

const express = require('express');
const router = express.Router();
const { healthCheckHandler } = require('../controllers/healthController');

router.get('/', healthCheckHandler);

module.exports = router;
