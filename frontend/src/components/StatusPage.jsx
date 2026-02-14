import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function StatusPage() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkHealth();
    }, []);

    async function checkHealth() {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getHealth();
            setHealth(data);
        } catch (err) {
            // If the backend is completely down, we still want to show something
            setHealth({
                backend: 'error',
                database: 'error',
                llm: 'error',
                timestamp: new Date().toISOString(),
            });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function StatusDot({ status }) {
        return <span className={`status-dot ${status === 'ok' ? 'ok' : 'error'}`}></span>;
    }

    if (loading) {
        return (
            <div className="loading-overlay">
                <span className="loading-spinner"></span>
                Checking system health...
            </div>
        );
    }

    const components = [
        { key: 'backend', label: 'Backend Server', description: 'Express.js API server', okText: '● Running', errorText: '● Not Running' },
        { key: 'database', label: 'Database', description: 'SQLite storage', okText: '● Connected', errorText: '● Disconnected' },
        { key: 'llm', label: 'LLM Service', description: 'Groq API connection', okText: '● Connected', errorText: '● Not Responding' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1>System Status</h1>
                <p>
                    Real-time health check of all system components.
                    {health?.timestamp && (
                        <span style={{ marginLeft: 'var(--space-md)', color: 'var(--color-text-muted)' }}>
                            Last checked: {new Date(health.timestamp).toLocaleTimeString()}
                        </span>
                    )}
                </p>
            </div>

            {error && (
                <div className="error-message" style={{ marginBottom: 'var(--space-lg)' }}>
                    <span>⚠</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="health-grid">
                {components.map(({ key, label, description, okText, errorText }) => {
                    const status = health?.[key] || 'error';
                    return (
                        <div key={key} className="health-card">
                            <StatusDot status={status} />
                            <div>
                                <div className="health-label">{label}</div>
                                <div className="health-status">{description}</div>
                                <span className={`status-badge ${status === 'ok' ? 'ok' : 'error'}`}>
                                    {status === 'ok' ? okText : errorText}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
                <button className="btn btn-secondary" onClick={checkHealth}>
                    ↻ Refresh
                </button>
            </div>
        </div>
    );
}
