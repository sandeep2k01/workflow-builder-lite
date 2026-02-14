/**
 * WorkflowRun model — data access layer for workflow execution records.
 * Handles storage, retrieval, and automatic cleanup (retain last 5 only).
 */

const { getDatabase, saveToFile } = require('./database');
const logger = require('../utils/logger');

const MAX_HISTORY = 5;

const WorkflowRun = {
    /**
     * Saves a completed workflow run and prunes old entries.
     */
    save(run) {
        const db = getDatabase();

        const stmt = db.prepare(`
      INSERT INTO workflow_runs (input_text, selected_steps, results, executed_at)
      VALUES (?, ?, ?, ?)
    `);

        stmt.run([
            run.inputText,
            JSON.stringify(run.selectedSteps),
            JSON.stringify(run.results),
            run.executedAt,
        ]);

        stmt.free();

        // Automatically prune to keep only the last N runs
        this.prune();

        // Persist changes to disk
        saveToFile();

        logger.info('WorkflowRun', 'Saved workflow run');
    },

    /**
     * Returns the most recent workflow runs (up to MAX_HISTORY).
     */
    getRecent() {
        const db = getDatabase();

        const results = db.exec(
            `SELECT id, input_text, selected_steps, results, executed_at 
       FROM workflow_runs ORDER BY executed_at DESC LIMIT ${MAX_HISTORY}`
        );

        if (!results.length) return [];

        const columns = results[0].columns;
        return results[0].values.map((row) => {
            const obj = {};
            columns.forEach((col, i) => (obj[col] = row[i]));
            return this._deserialize(obj);
        });
    },

    /**
     * Removes all runs except the most recent MAX_HISTORY entries.
     */
    prune() {
        const db = getDatabase();

        db.run(`
      DELETE FROM workflow_runs
      WHERE id NOT IN (
        SELECT id FROM workflow_runs ORDER BY executed_at DESC LIMIT ${MAX_HISTORY}
      )
    `);
    },

    /**
     * Deserializes a database row into a clean object.
     */
    _deserialize(row) {
        return {
            id: row.id,
            inputText: row.input_text,
            selectedSteps: JSON.parse(row.selected_steps),
            results: JSON.parse(row.results),
            executedAt: row.executed_at,
        };
    },
};

module.exports = WorkflowRun;
