/**
 * Server entry point — starts the Express app and initializes the database.
 */

const app = require('./app');
const config = require('./config');
const { initDatabase } = require('./models/database');
const logger = require('./utils/logger');

async function start() {
    // Initialize database before accepting requests
    try {
        await initDatabase();
        logger.info('Server', 'Database initialized successfully');
    } catch (error) {
        logger.error('Server', 'Failed to initialize database', error);
        process.exit(1);
    }

    // Start listening
    app.listen(config.port, () => {
        logger.info('Server', `Workflow Builder Lite API running on port ${config.port}`);
        logger.info('Server', `Environment: ${config.nodeEnv}`);
        logger.info('Server', `Groq model: ${config.groq.model}`);

        if (!config.groq.apiKey) {
            logger.warn('Server', 'GROQ_API_KEY is not set — LLM features will fail');
        }
    });
}

start();
