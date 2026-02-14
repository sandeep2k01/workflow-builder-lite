import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ResultsView from './ResultsView';

export default function HistoryPage() {
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        setLoading(true);
        try {
            const response = await api.getHistory();
            setRuns(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function toggleExpand(id) {
        setExpandedId((prev) => (prev === id ? null : id));
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleString();
    }

    function truncate(text, maxLength = 80) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '…';
    }

    if (loading) {
        return (
            <div className="loading-overlay">
                <span className="loading-spinner"></span>
                Loading history...
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1>Run History</h1>
                <p>Last 5 workflow executions are stored.</p>
            </div>

            {error && (
                <div className="error-message">
                    <span>⚠</span>
                    <span>{error}</span>
                </div>
            )}

            {runs.length === 0 ? (
                <div className="empty-state">
                    <h3>No runs yet</h3>
                    <p>Execute a workflow to see results here.</p>
                </div>
            ) : (
                runs.map((run) => (
                    <div key={run.id} className="history-item">
                        <div
                            className="history-item-header"
                            onClick={() => toggleExpand(run.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') toggleExpand(run.id);
                            }}
                        >
                            <h4>
                                {expandedId === run.id ? '▾' : '▸'}{' '}
                                {run.selectedSteps.join(' → ')}
                            </h4>
                            <div className="history-meta">
                                <span>{run.results.filter((r) => r.success).length}/{run.selectedSteps.length} steps</span>
                                <span>{formatDate(run.executedAt)}</span>
                            </div>
                        </div>

                        {expandedId === run.id && (
                            <div className="history-item-body">
                                <div className="section-label" style={{ marginTop: 'var(--space-md)' }}>Input</div>
                                <div className="history-input-preview">{run.inputText}</div>
                                <ResultsView result={run} />
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
