/**
 * ResultsView — displays per-step output from a workflow execution.
 * Shows step name, model info, latency, and the actual output.
 */

export default function ResultsView({ result }) {
    if (!result || !result.results) return null;

    const successCount = result.results.filter((s) => s.success).length;
    const totalSteps = result.selectedSteps.length;

    return (
        <div className="results-container">
            <div className="section-label">
                Results — {successCount}/{totalSteps} steps completed
            </div>

            {result.results.map((step, index) => (
                <div key={index} className={`result-step ${step.success ? '' : 'error'}`}>
                    <div className="result-step-header">
                        <h3>
                            <span style={{
                                color: step.success ? 'var(--color-success)' : 'var(--color-error)',
                                fontSize: 'var(--font-size-lg)'
                            }}>
                                {step.success ? '✓' : '✗'}
                            </span>
                            Step {index + 1}: {step.stepName}
                        </h3>
                        {step.success && (
                            <div className="result-step-meta">
                                <span>Model: {step.model}</span>
                                <span>Tokens: {step.tokensUsed}</span>
                                <span>{step.latencyMs}ms</span>
                            </div>
                        )}
                    </div>
                    <div className="result-step-output">
                        {step.success ? step.output : `Error: ${step.error}`}
                    </div>
                </div>
            ))}
        </div>
    );
}
