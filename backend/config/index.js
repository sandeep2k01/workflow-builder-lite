/**
 * Centralized configuration loaded from environment variables.
 * Single source of truth — no scattered process.env calls.
 */

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  },
};

module.exports = config;
