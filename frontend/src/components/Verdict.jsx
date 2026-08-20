function Verdict({ verdict, error }) {
  if (error) {
    return (
      <div className="p-6 font-mono">
        <p className="text-error font-bold">Error</p>
        <p className="text-error text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!verdict) {
    return (
      <div className="p-6 font-mono text-muted">
        Run or submit your code to see a verdict here.
      </div>
    );
  }

  const { allPassed, results } = verdict;
  
  const lastCase = results[results.length - 1];

  return (
    <div className="p-6 font-mono">
      <p className={`font-bold text-lg ${allPassed ? "text-success" : "text-error"}`}>
        {allPassed ? "Accepted" : "Wrong Answer"}
      </p>
      <p className="text-muted text-sm mt-1">
        {results.length} test case{results.length !== 1 ? "s" : ""} run
      </p>

      {!allPassed && (
        <div className="mt-4 bg-black/30 rounded-lg p-3 text-sm space-y-3">
          <div>
            <p className="text-muted mb-1">Input:</p>
            <pre className="whitespace-pre-wrap">{lastCase.input}</pre>
          </div>
          <div>
            <p className="text-muted mb-1">Expected:</p>
            <pre className="whitespace-pre-wrap text-success">{lastCase.expectedOutput}</pre>
          </div>
          <div>
            <p className="text-muted mb-1">Your Output:</p>
            <pre className="whitespace-pre-wrap text-error">{lastCase.actualOutput || "(empty)"}</pre>
          </div>
          {lastCase.stderr && (
            <div>
              <p className="text-muted mb-1">stderr:</p>
              <pre className="whitespace-pre-wrap text-error">{lastCase.stderr}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Verdict;