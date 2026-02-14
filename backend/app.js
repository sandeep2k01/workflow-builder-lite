/**
 * Express application configuration.
 * Separated from server.js so the app can be imported for testing.
 */

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

// Route modules
const workflowRoutes = require('./routes/workflowRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// --- Middleware ---

// Security headers - Relax CSP in production so bundled assets can load
app.use(helmet({
    contentSecurityPolicy: false,
}));

// CORS — allows frontend to communicate with backend
app.use(cors({
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
}));

// Request logging (concise in production, verbose in dev)
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// --- Routes ---

app.use('/api/workflow', workflowRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint — quick confirmation the API is running
app.get('/api', (req, res) => {
    res.json({
        name: 'Workflow Builder Lite API',
        version: '1.0.0',
        docs: '/api/health for system status, /api/workflow/steps for available steps',
    });
});

// Serve frontend static files in production (single-container Docker)
if (config.nodeEnv === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// --- Error handling ---

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'An unexpected error occurred.' });
});

module.exports = app;
