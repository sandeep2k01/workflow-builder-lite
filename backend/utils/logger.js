/**
 * Minimal structured logger.
 * Keeps logs consistent and parseable without adding a heavy dependency.
 */

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

function formatMessage(level, context, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

const logger = {
    info(context, message) {
        if (CURRENT_LEVEL >= LOG_LEVELS.info) {
            console.log(formatMessage('info', context, message));
        }
    },

    warn(context, message) {
        if (CURRENT_LEVEL >= LOG_LEVELS.warn) {
            console.warn(formatMessage('warn', context, message));
        }
    },

    error(context, message, err = null) {
        if (CURRENT_LEVEL >= LOG_LEVELS.error) {
            console.error(formatMessage('error', context, message));
            if (err?.stack) console.error(err.stack);
        }
    },

    debug(context, message) {
        if (CURRENT_LEVEL >= LOG_LEVELS.debug) {
            console.log(formatMessage('debug', context, message));
        }
    },
};

module.exports = logger;
