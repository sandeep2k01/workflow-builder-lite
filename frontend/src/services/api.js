/**
 * API service — single module for all backend communication.
 * Uses fetch (no external dependency needed for this scale).
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        // Network errors (server unreachable)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Cannot reach the backend server. Is it running?');
        }
        throw error;
    }
}

export const api = {
    /** Fetch available workflow steps */
    getSteps() {
        return request('/workflow/steps');
    },

    /** Execute a workflow */
    runWorkflow(inputText, selectedSteps) {
        return request('/workflow/run', {
            method: 'POST',
            body: JSON.stringify({ inputText, selectedSteps }),
        });
    },

    /** Fetch run history (last 5) */
    getHistory() {
        return request('/workflow/history');
    },

    /** Check system health (doesn't throw on 503 — response body is still useful) */
    async getHealth() {
        const url = `${API_BASE}/health`;
        try {
            const response = await fetch(url);
            return await response.json();
        } catch {
            return { backend: 'error', database: 'error', llm: 'error', timestamp: new Date().toISOString() };
        }
    },
};
