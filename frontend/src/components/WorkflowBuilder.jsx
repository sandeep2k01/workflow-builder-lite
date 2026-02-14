import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ResultsView from './ResultsView';

export default function WorkflowBuilder() {
    const [inputText, setInputText] = useState('');
    const [availableSteps, setAvailableSteps] = useState([]);
    const [selectedSteps, setSelectedSteps] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Fetch available steps from backend on mount
    useEffect(() => {
        api.getSteps()
            .then((res) => setAvailableSteps(res.data))
            .catch((err) => setError(`Failed to load steps: ${err.message}`));
    }, []);

    function handleStepToggle(stepId) {
        setSelectedSteps((prev) => {
            if (prev.includes(stepId)) {
                return prev.filter((id) => id !== stepId);
            }
            // Max 4 steps
            if (prev.length >= 4) return prev;
            return [...prev, stepId];
        });
    }

    async function handleRun() {
        setError(null);
        setResult(null);

        // Client-side validation
        if (!inputText.trim()) {
            setError('Please enter some text to process.');
            return;
        }
        if (inputText.trim().length < 10) {
            setError('Input text is too short. Please provide at least a sentence.');
            return;
        }
        if (selectedSteps.length < 2) {
            setError('Please select at least 2 workflow steps.');
            return;
        }

        setIsRunning(true);

        try {
            const response = await api.runWorkflow(inputText.trim(), selectedSteps);
            setResult(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    }

    function handleClear() {
        setInputText('');
        setSelectedSteps([]);
        setResult(null);
        setError(null);
    }

    return (
        <div>
            <div className="page-header">
                <h1>Workflow Builder</h1>
                <p>Enter text, select processing steps, and run your AI workflow.</p>
            </div>

            {/* Input Section */}
            <div className="section">
                <label className="section-label" htmlFor="workflow-input">Input Text</label>
                <textarea
                    id="workflow-input"
                    className="textarea"
                    placeholder="Paste or type your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isRunning}
                />
            </div>

            {/* Step Selection */}
            <div className="section">
                <label className="section-label">Select Steps (2–4)</label>
                <div className="step-grid">
                    {availableSteps.map((step) => {
                        const isSelected = selectedSteps.includes(step.id);
                        const orderIndex = selectedSteps.indexOf(step.id);
                        return (
                            <div
                                key={step.id}
                                className={`step-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => !isRunning && handleStepToggle(step.id)}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleStepToggle(step.id);
                                }}
                            >
                                {isSelected && <span className="step-number">{orderIndex + 1}</span>}
                                <div className="step-name">{step.name}</div>
                                <div className="step-desc">{step.description}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected order visualization */}
                <div className="selected-steps-order">
                    {selectedSteps.length === 0 ? (
                        <span className="order-placeholder">Click steps above to build your pipeline (order matters)</span>
                    ) : (
                        selectedSteps.map((stepId, i) => {
                            const step = availableSteps.find((s) => s.id === stepId);
                            return (
                                <span key={stepId} className="order-tag">
                                    <span className="order-num">{i + 1}</span>
                                    {step?.name}
                                    {i < selectedSteps.length - 1 && ' →'}
                                </span>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="section" style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button
                    id="run-workflow-btn"
                    className="btn btn-primary"
                    onClick={handleRun}
                    disabled={isRunning || selectedSteps.length < 2 || !inputText.trim()}
                >
                    {isRunning ? (
                        <>
                            <span className="loading-spinner"></span>
                            Processing...
                        </>
                    ) : (
                        '▶ Run Workflow'
                    )}
                </button>
                <button className="btn btn-secondary" onClick={handleClear} disabled={isRunning}>
                    Clear
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-message" role="alert">
                    <span>⚠</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Results */}
            {result && <ResultsView result={result} />}
        </div>
    );
}
