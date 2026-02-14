/**
 * Input validation for workflow execution requests.
 * Validates before any processing — fail fast, clear messages.
 */

const { getAvailableSteps } = require('../workflows/stepRegistry');

const MIN_INPUT_LENGTH = 10;
const MAX_INPUT_LENGTH = 15000;
const MIN_STEPS = 2;
const MAX_STEPS = 4;

/**
 * Validates the workflow run request body.
 * Returns { valid: true } or { valid: false, error: string }.
 */
function validateWorkflowInput(body) {
    const { inputText, selectedSteps } = body;

    // Check input text exists
    if (!inputText || typeof inputText !== 'string') {
        return { valid: false, error: 'Input text is required and must be a string.' };
    }

    const trimmed = inputText.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: 'Input text cannot be empty.' };
    }

    if (trimmed.length < MIN_INPUT_LENGTH) {
        return {
            valid: false,
            error: `Input text is too short. Please provide at least ${MIN_INPUT_LENGTH} characters for meaningful processing.`,
        };
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
        return {
            valid: false,
            error: `Input text exceeds maximum length of ${MAX_INPUT_LENGTH} characters.`,
        };
    }

    // Check steps array
    if (!Array.isArray(selectedSteps)) {
        return { valid: false, error: 'Selected steps must be an array.' };
    }

    if (selectedSteps.length < MIN_STEPS || selectedSteps.length > MAX_STEPS) {
        return {
            valid: false,
            error: `Please select between ${MIN_STEPS} and ${MAX_STEPS} workflow steps.`,
        };
    }

    // Check each step exists in registry
    const availableStepIds = getAvailableSteps().map((s) => s.id);
    for (const stepId of selectedSteps) {
        if (!availableStepIds.includes(stepId)) {
            return { valid: false, error: `Unknown step: "${stepId}". Available steps: ${availableStepIds.join(', ')}` };
        }
    }

    // Check for duplicate steps
    const unique = new Set(selectedSteps);
    if (unique.size !== selectedSteps.length) {
        return { valid: false, error: 'Duplicate steps are not allowed.' };
    }

    return { valid: true };
}

module.exports = { validateWorkflowInput };
